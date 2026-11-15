/**
 * Usage-endpoint discovery for providers without a hand-written adapter.
 *
 * A newly configured provider is only useful to this plugin once we know
 * whether it exposes a balance or a spend cap. Rather than ship an adapter per
 * relay, this module probes the provider's own configured origin with a small
 * ordered set of known response shapes, validates the JSON strictly, and
 * returns the first fact it can parse. The service caches the winning shape so
 * normal polls reuse one request; a manual rescan clears the cache.
 *
 * Rules that keep this safe:
 * - only the route's own base URL is probed (the key is already sent there for
 *   chat traffic), and redirects are refused so a 302 cannot move the key to
 *   another host;
 * - only `application/json` bodies with the expected fields are accepted (an
 *   HTML app answering 200 on every path, like the local Open WebUI, is
 *   rejected);
 * - every probe has a short timeout, and discovery runs once per provider.
 * @module @linxin666/dsh-usage/core/discovery
 */

import type { BalanceParse, SpendParse } from './adapters.ts'

/** The fact a discovered shape can produce. */
export type DiscoveryFact = BalanceParse | SpendParse

/** One known endpoint shape. */
export interface UsageShape {
  /** Stable id stored in the probe cache. */
  id: string
  /** Path appended to the route's configured base URL. */
  path: string
  /** Parse a 200 JSON body, or undefined when the shape does not match. */
  parse(body: unknown): DiscoveryFact | undefined
}

/** A successful discovery. */
export interface DiscoveryResult {
  shape: UsageShape
  fact: DiscoveryFact
}

const PROBE_TIMEOUT_MS = 4_000

function object(value: unknown): Record<string, unknown> | undefined {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? value as Record<string, unknown>
    : undefined
}

function number(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return undefined
}

function text(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined
}

function iso(value: unknown): string | undefined {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
    const ms = value < 1e12 ? value * 1000 : value
    const date = new Date(ms)
    return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
  }
  const raw = text(value)
  if (raw === undefined) return undefined
  const date = new Date(raw)
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}

/**
 * OpenRouter-style key object: `{ data: { limit, usage, limit_remaining,
 * billing_currency, limit_reset } }`. A null/0 limit is uncapped and still
 * yields a spend fact so the key's spend is visible.
 */
const OPENROUTER_KEY: UsageShape = {
  id: 'openrouter-key',
  path: '/key',
  parse: (body) => {
    const data = object(object(body)?.data)
    if (data === undefined) return undefined
    const limit = number(data.limit)
    const used = number(data.usage)
    const remaining = number(data.limit_remaining)
    if (limit === undefined && used === undefined) return undefined
    const usedValue = used ?? (limit !== undefined && remaining !== undefined ? limit - remaining : undefined)
    if (usedValue === undefined) return undefined
    const resetsAt = iso(data.limit_reset)
    return {
      currency: text(data.billing_currency)?.toUpperCase() ?? 'USD',
      used: Math.max(0, usedValue),
      limit: Math.max(0, limit ?? 0),
      window: 'key',
      ...(resetsAt !== undefined ? { resetsAt } : {}),
    }
  },
}

/** OpenRouter-compatible wallet: `{ available, balance }` in USD. */
const CREDITS: UsageShape = {
  id: 'credits',
  path: '/credits',
  parse: (body) => {
    const root = object(body)
    if (root === undefined) return undefined
    const available = number(root.available) ?? number(root.balance)
    if (available === undefined) return undefined
    return { currency: 'USD', totalBalance: available.toFixed(2) }
  },
}

/**
 * AMD Cloud's per-organization usage document: `daily_cost_limit_usd`,
 * `daily_cost_used_usd`, `daily_reset_at`. Tried before the OpenRouter key
 * shape because AMD's `/key` reports a dev-plan view, not the daily ceiling.
 */
const AMD_USAGE: UsageShape = {
  id: 'amd-usage',
  path: '/usage',
  parse: (body) => {
    const root = object(body)
    if (root === undefined) return undefined
    const used = number(root.daily_cost_used_usd)
    const limit = number(root.daily_cost_limit_usd)
    if (used === undefined || limit === undefined) return undefined
    const resetsAt = iso(root.daily_reset_at)
    return {
      currency: 'USD',
      used: Math.max(0, used),
      limit: Math.max(0, limit),
      window: 'daily',
      ...(resetsAt !== undefined ? { resetsAt } : {}),
    }
  },
}

/**
 * Ordered shapes. AMD first because its `/key` would otherwise parse as an
 * uncapped OpenRouter key and hide the daily cap; credits last because it is
 * the widest match (`available` or `balance`).
 */
export const USAGE_SHAPES: readonly UsageShape[] = [AMD_USAGE, OPENROUTER_KEY, CREDITS]

/** The route's configured base URL with a shape path appended. */
export function shapeUrl(baseURL: string, shape: UsageShape): string {
  return baseURL.replace(/\/+$/, '') + shape.path
}

/** Whether a base URL points at this machine (no billing surface worth probing). */
export function isLoopbackBaseURL(baseURL: string): boolean {
  try {
    const host = new URL(baseURL).hostname
    return host === 'localhost' || host === '127.0.0.1' || host === '::1' || host.endsWith('.localhost')
  } catch {
    return true
  }
}

/**
 * Probe one provider's base URL for a recognizable usage shape.
 * @param baseURL - the route's configured base URL.
 * @param apiKey - the resolved credential (sent only to that origin).
 * @returns the matching shape and fact, or undefined when none matched.
 */
export async function discoverUsage(baseURL: string, apiKey: string): Promise<DiscoveryResult | undefined> {
  if (isLoopbackBaseURL(baseURL)) return undefined
  for (const shape of USAGE_SHAPES) {
    try {
      const response = await fetch(shapeUrl(baseURL, shape), {
        headers: { authorization: `Bearer ${apiKey}`, accept: 'application/json' },
        signal: AbortSignal.timeout(PROBE_TIMEOUT_MS),
        redirect: 'error',
      })
      if (!response.ok) continue
      const contentType = response.headers.get('content-type') ?? ''
      if (!contentType.toLowerCase().includes('json')) continue
      const body: unknown = await response.json().catch(() => undefined)
      const fact = shape.parse(body)
      if (fact !== undefined) return { shape, fact }
    } catch {
      // 404 / timeout / redirect refusal: try the next shape.
    }
  }
  return undefined
}
