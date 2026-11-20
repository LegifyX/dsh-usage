/**
 * Provider adapters: one entry per provider family this plugin can query for
 * a pay-as-you-go balance or a coding-plan quota. Adapters are pure — they
 * build an HTTP probe from a resolved credential and parse the response — so
 * the service stays transport-only and every endpoint detail lives here.
 *
 * All probes run host-side (Node fetch); API keys never reach the browser.
 * @module @legifyx/dsh-usage/core/adapters
 */

import type { PlanWindowView, QuotaMeterView, SpendLimitView } from './types.ts'

/** One HTTP probe the service executes verbatim. */
export interface ProbeSpec {
  url: string
  headers: Record<string, string>
}

/** Inputs an adapter may use to build a probe. */
export interface AdapterProbeContext {
  /** Resolved credential value: a raw API key, or an OAuth access token for the oauth-aware adapters. */
  apiKey: string
  /** Provider account id riding a dedicated header, when the credential carries one (Codex). */
  accountId?: string
  /**
   * The route's configured base URL (the pi-ai profile's baseURL), when it
   * declares one. An adapter whose endpoint belongs to one provider origin
   * uses it to refuse an account that merely shares the route key, so a
   * differently-hosted model of the same family is never reported with the
   * other account's number.
   */
  baseURL?: string
}

/** A parsed balance fact. */
export interface BalanceParse {
  currency: string
  totalBalance: string
}

/** A parsed plan-quota fact. */
export interface PlanParse {
  planName?: string
  windows: PlanWindowView[]
}

/** A parsed subscription-quota fact (input/output meters over one window). */
export interface QuotaParse {
  planName?: string
  price?: string
  meters: QuotaMeterView[]
}

/** A parsed spend-cap fact (money spent against a provider's own ceiling). */
export interface SpendParse extends SpendLimitView {}

/** One provider family's probing capability. */
export interface ProviderAdapter {
  /** Provider route keys this adapter serves. */
  ids: readonly string[]
  /**
   * Route keys that belong to this family for accounting (token folding, the
   * spend price book) but must never be probed with this
   * adapter's endpoints.
   *
   * A route reaches the DeepSeek family without an API key when the user is
   * signed in to a DeepSeek account: the llm-deepseek-account plugin registers
   * the route id deepseek-account, which authenticates with the account token
   * rather than a key. Its tokens bill the same account the official route
   * bills, so the family must own it, but the balance endpoint reads an
   * API-key account: probing it would either fail on the account token or,
   * when the user also configured DEEPSEEK_API_KEY, print the API-key account's
   * money under the account route's name (issue #1772, the same
   * mis-attribution class as #1688). adapterFor() deliberately does not
   * resolve these ids, so no probe, credential fallback, or alias fold can
   * reach them; family membership is read through isDeepSeekProviderRoute().
   */
  familyOnlyIds?: readonly string[]
  /** Fallback display name when the LLM runtime has none. */
  displayName: string
  balance?: {
    /**
     * Origin (scheme + host) whose account this balance endpoint reports.
     * Omitted when the endpoint is per-route by construction (a profile
     * supplies the host) or when the provider has only one origin. When set,
     * a route whose configured baseURL resolves elsewhere is not this
     * origin's account and must not be probed with this adapter.
     */
    origin?: string
    build(context: AdapterProbeContext): ProbeSpec
    parse(status: number, body: unknown): BalanceParse | undefined
  }
  plan?: {
    build(context: AdapterProbeContext): ProbeSpec
    parse(status: number, body: unknown): PlanParse | undefined
  }
  /**
   * Input/output subscription meters (deeprelay). Separate from `plan` because
   * the two dimensions carry their own used/limit counters rather than one
   * percentage. `origin` gates the probe the same way the balance half does,
   * so a reseller route that merely shares the id is never read.
   */
  quota?: {
    origin?: string
    build(context: AdapterProbeContext): ProbeSpec
    parse(status: number, body: unknown): QuotaParse | undefined
  }
  /**
   * Money spent against a cap the provider itself enforces (a daily cost
   * ceiling, a relay key's USD limit). Separate from balance (what is left to
   * spend) and from quota (token meters): a spend cap can exist with no
   * wallet, and the window is the provider's own.
   */
  spend?: {
    origin?: string
    build(context: AdapterProbeContext): ProbeSpec
    parse(status: number, body: unknown): SpendParse | undefined
  }
}

/** Parse a string/number into a finite number, else undefined. */
function toNum(value: unknown): number | undefined {
  if (typeof value === 'number') return Number.isFinite(value) ? value : undefined
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : undefined
  }
  return undefined
}

/** Read a string field that must be a non-empty string. */
function str(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined
}

/** Clamp a provider percentage into the renderable 0-100 band. */
function clampPercent(value: number): number {
  return Math.max(0, Math.min(100, value))
}

/** Format a number to a fixed 2-decimal display string. */
function money(value: number): string {
  return value.toFixed(2)
}

/** Millisecond epoch or ISO string → normalized ISO 8601, else undefined. */
function toIso(value: unknown): string | undefined {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
    const ms = value < 1e12 ? value * 1000 : value
    const date = new Date(ms)
    return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
  }
  const text = str(value)
  if (text === undefined) return undefined
  // Epoch instants also arrive as strings ("1756428000"); route them through
  // the numeric branch instead of letting Date() reject them.
  if (/^\d+$/.test(text)) return toIso(Number(text))
  const date = new Date(text)
  // The contract is "normalized ISO 8601, else undefined": returning the raw
  // text would render as "Invalid Date" downstream.
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}

/** Used-percent helper guarding zero/absent limits. */
function usedPercent(used: unknown, limit: unknown): number | undefined {
  const usedNum = toNum(used)
  const limitNum = toNum(limit)
  if (usedNum === undefined || limitNum === undefined || limitNum <= 0) return undefined
  return Math.max(0, Math.min(100, (usedNum / limitNum) * 100))
}

function bearer(apiKey: string): Record<string, string> {
  return { authorization: `Bearer ${apiKey}` }
}

/**
 * The official pay-as-you-go balance. `deepseek` is the configurable-catalog
 * route key; `deepseek-official` is the live provider route the llm-deepseek
 * adapter registers (sessions and agent-default-model carry it), so both ids
 * must resolve here or the current provider would never be probed.
 */
/** The official DeepSeek API origin: the only account its balance endpoint reports. */
export const DEEPSEEK_API_ORIGIN = 'https://api.deepseek.com'

const DEEPSEEK: ProviderAdapter = {
  ids: ['deepseek', 'deepseek-official'],
  // The signed-in DeepSeek account route bills the same account but holds no
  // API key, so it joins the family for accounting and stays out of the probe
  // directory (issue #1772).
  familyOnlyIds: ['deepseek-account'],
  displayName: 'DeepSeek',
  balance: {
    origin: DEEPSEEK_API_ORIGIN,
    build: ({ apiKey }) => ({ url: 'https://api.deepseek.com/user/balance', headers: bearer(apiKey) }),
    parse: (status, body) => {
      if (status !== 200 || typeof body !== 'object' || body === null) return undefined
      const infos = (body as Record<string, unknown>).balance_infos
      if (!Array.isArray(infos) || infos.length === 0) return undefined
      const first = infos[0]
      if (typeof first !== 'object' || first === null) return undefined
      const currency = str((first as Record<string, unknown>).currency)
      const total = str((first as Record<string, unknown>).total_balance)
      if (currency === undefined || total === undefined) return undefined
      return { currency, totalBalance: total }
    },
  },
}

/**
 * deeprelay flat-plan subscription: four weighted-token meters (monthly input,
 * monthly output, rolling 7-day input, rolling 7-day output) plus a dollar
 * usage backstop. `/v1/billing/subscription` is the server's own gate, so the
 * card shows exactly what the provider enforces rather than a reconstructed
 * local count; the local ledger cannot reproduce the per-model usage factors
 * (a glm-5.3 token spends 12 of the allowance).
 *
 * The response is only meaningful when it is an entitled subscription whose
 * meter was readable: `subscribed` is the entitlement flag (NOT `status`,
 * which follows Stripe's vocabulary) and a null `usage` means "unknown", not
 * "nothing used".
 */
export const DEEPRELAY_API_ORIGIN = 'https://api.deeprelay.ai'

/** Format the plan price the provider reports (`amount_cents` + currency). */
function planPrice(price: Record<string, unknown> | undefined): string | undefined {
  if (typeof price !== 'object' || price === null) return undefined
  const cents = toNum((price as Record<string, unknown>).amount_cents)
  if (cents === undefined) return undefined
  const currency = str((price as Record<string, unknown>).currency)?.toUpperCase() ?? 'USD'
  const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'CNY' ? '¥' : `${currency} `
  const amount = (cents / 100).toFixed(2).replace(/\.00$/, '')
  const interval = str((price as Record<string, unknown>).interval)
  const suffix = interval === 'month' ? '/mo' : interval === 'year' ? '/yr' : ''
  return `${symbol}${amount}${suffix}`
}

const DEEPRELAY: ProviderAdapter = {
  ids: ['deeprelay'],
  displayName: 'deeprelay',
  quota: {
    origin: DEEPRELAY_API_ORIGIN,
    build: ({ apiKey }) => ({ url: 'https://api.deeprelay.ai/v1/billing/subscription', headers: bearer(apiKey) }),
    parse: (status, body) => {
      if (status !== 200 || typeof body !== 'object' || body === null) return undefined
      const root = body as Record<string, unknown>
      if (root.subscribed !== true) return undefined
      const quota = root.quota
      const usage = root.usage
      if (typeof quota !== 'object' || quota === null) return undefined
      if (typeof usage !== 'object' || usage === null) return undefined
      const limits = quota as Record<string, unknown>
      const used = usage as Record<string, unknown>
      const plan = root.plan
      const planName = typeof plan === 'object' && plan !== null ? str((plan as Record<string, unknown>).name) : undefined
      const price = typeof plan === 'object' && plan !== null
        ? planPrice((plan as Record<string, unknown>).price as Record<string, unknown> | undefined)
        : undefined
      const resetAt = toIso(used.period_end) ?? toIso(root.current_period_end)
      const meter = (key: string, name: string, limitIn: unknown, limitOut: unknown, usedIn: unknown, usedOut: unknown, resetsAt: string | undefined): QuotaMeterView | undefined => {
        const limitInput = Math.max(0, toNum(limitIn) ?? 0)
        const limitOutput = Math.max(0, toNum(limitOut) ?? 0)
        if (limitInput <= 0 && limitOutput <= 0) return undefined
        return {
          key,
          name,
          usedInput: Math.max(0, toNum(usedIn) ?? 0),
          limitInput,
          usedOutput: Math.max(0, toNum(usedOut) ?? 0),
          limitOutput,
          ...(resetsAt !== undefined ? { resetsAt } : {}),
        }
      }
      const meters = [
        meter('month', 'Month', limits.input_tokens_monthly, limits.output_tokens_monthly, used.weighted_input_tokens, used.weighted_output_tokens, resetAt),
        meter('week', '7 days', limits.weekly_input_tokens, limits.weekly_output_tokens, used.weekly_weighted_input_tokens, used.weekly_weighted_output_tokens, undefined),
      ].filter((entry): entry is QuotaMeterView => entry !== undefined)
      if (meters.length === 0) return undefined
      return { planName, price, meters }
    },
  },
}

/**
 * AMD Cloud (Radeon) meters a daily USD cost ceiling per organization and
 * reports it on `/v1/usage`: the cap, what today has spent, and the reset
 * instant in the organization's own time zone. Its `/v1/key` endpoint reports
 * a different, dev-plan view and is not this account's daily ceiling.
 */
const AMD_CLOUD: ProviderAdapter = {
  ids: ['amdradeoncloud'],
  displayName: 'AMD Cloud',
  spend: {
    origin: 'https://developer.amd.com.cn',
    build: ({ apiKey }) => ({ url: 'https://developer.amd.com.cn/radeon/api/v1/usage', headers: bearer(apiKey) }),
    parse: (status, body) => {
      if (status !== 200 || typeof body !== 'object' || body === null) return undefined
      const root = body as Record<string, unknown>
      const used = toNum(root.daily_cost_used_usd)
      const limit = toNum(root.daily_cost_limit_usd)
      if (used === undefined || limit === undefined) return undefined
      return {
        currency: 'USD',
        used,
        limit: Math.max(0, limit),
        window: 'daily',
        ...(toIso(root.daily_reset_at) !== undefined ? { resetsAt: toIso(root.daily_reset_at) } : {}),
      }
    },
  },
}

/**
 * numes exposes an OpenRouter-style key object at `/api/v1/key`: `limit` is the
 * key's USD cap (0 = uncapped), and `usage_daily`/`usage_weekly`/`usage_monthly`
 * break the spend down. The account named `dsh` currently reports 0 usage and
 * no cap, so the card renders it as unlimited rather than inventing a bar.
 */
const NUMES: ProviderAdapter = {
  ids: ['numes'],
  displayName: 'numes',
  spend: {
    origin: 'https://api.numes.ai',
    build: ({ apiKey }) => ({ url: 'https://api.numes.ai/api/v1/key', headers: bearer(apiKey) }),
    parse: (status, body) => {
      if (status !== 200 || typeof body !== 'object' || body === null) return undefined
      const data = (body as Record<string, unknown>).data
      if (typeof data !== 'object' || data === null) return undefined
      const row = data as Record<string, unknown>
      const limit = toNum(row.limit)
      const used = toNum(row.usage)
      if (limit === undefined && used === undefined) return undefined
      return {
        currency: str(row.billing_currency)?.toUpperCase() ?? 'USD',
        used: used ?? 0,
        limit: Math.max(0, limit ?? 0),
        window: 'key',
        ...(toIso(row.limit_reset) !== undefined ? { resetsAt: toIso(row.limit_reset) } : {}),
      }
    },
  },
}

/**
 * refuseless publishes an OpenRouter-compatible `/v1/credits` object: the
 * wallet balance, not a cap. It belongs on the balance card; `available` is
 * what can still be spent.
 */
const REFUSELESS: ProviderAdapter = {
  ids: ['refuseless'],
  displayName: 'refuseless',
  balance: {
    origin: 'https://api.refuseless.com',
    build: ({ apiKey }) => ({ url: 'https://api.refuseless.com/v1/credits', headers: bearer(apiKey) }),
    parse: (status, body) => {
      if (status !== 200 || typeof body !== 'object' || body === null) return undefined
      const available = toNum((body as Record<string, unknown>).available)
      if (available === undefined) return undefined
      return { currency: 'USD', totalBalance: money(available) }
    },
  },
}

/** Moonshot pay-as-you-go balance; CN bills in CNY, international in USD. */
function moonshotBalance(host: string, currency: string, ids: readonly string[]): ProviderAdapter {
  return {
    ids,
    displayName: 'Moonshot AI',
    balance: {
      origin: `https://${host}`,
      build: ({ apiKey }) => ({ url: `https://${host}/v1/users/me/balance`, headers: bearer(apiKey) }),
      parse: (status, body) => {
        if (status !== 200 || typeof body !== 'object' || body === null) return undefined
        const data = (body as Record<string, unknown>).data
        if (typeof data !== 'object' || data === null) return undefined
        const available = toNum((data as Record<string, unknown>).available_balance)
        if (available === undefined) return undefined
        return { currency, totalBalance: money(available) }
      },
    },
  }
}

/** Kimi For Coding quota: top-level `usage` is the weekly summary, `limits[]` the per-window rows. */
const KIMI_CODING: ProviderAdapter = {
  ids: ['kimi-coding'],
  displayName: 'Kimi For Coding',
  plan: {
    origin: 'https://api.kimi.com',
    build: ({ apiKey }) => ({ url: 'https://api.kimi.com/coding/v1/usages', headers: bearer(apiKey) }),
    parse: (status, body) => {
      if (status !== 200 || typeof body !== 'object' || body === null) return undefined
      const root = body as Record<string, unknown>
      const windows: PlanWindowView[] = []
      const limits = root.limits
      if (Array.isArray(limits)) {
        for (const entry of limits) {
          if (typeof entry !== 'object' || entry === null) continue
          const detail = (entry as Record<string, unknown>).detail
          const window = (entry as Record<string, unknown>).window
          if (typeof detail !== 'object' || detail === null) continue
          const row = detail as Record<string, unknown>
          const duration = typeof window === 'object' && window !== null ? toNum((window as Record<string, unknown>).duration) : undefined
          const unit = typeof window === 'object' && window !== null ? str((window as Record<string, unknown>).timeUnit) : undefined
          const key = duration === 300 && unit === 'TIME_UNIT_MINUTE' ? '5h' : duration !== undefined ? `w-${duration}` : 'window'
          const percent = usedPercent(row.used, row.limit)
          windows.push({ key, name: str(row.name), percent, resetsAt: toIso(row.resetTime) })
        }
      }
      const usage = root.usage
      if (typeof usage === 'object' && usage !== null) {
        const weekly = usage as Record<string, unknown>
        windows.push({
          key: 'week',
          name: 'Weekly',
          percent: usedPercent(weekly.used, weekly.limit),
          resetsAt: toIso(weekly.resetTime),
        })
      }
      if (windows.length === 0) return undefined
      const user = root.user
      const membership = typeof user === 'object' && user !== null ? (user as Record<string, unknown>).membership : undefined
      const planName = typeof membership === 'object' && membership !== null ? str((membership as Record<string, unknown>).level) : undefined
      return { planName, windows }
    },
  },
}

/**
 * GLM Coding Plan quota windows, keyed by the provider's own `unit` code
 * rather than by row position so an added or reordered limit cannot shift a
 * window's meaning: 3 = the rolling 5-hour window, 6 = the weekly window,
 * 5 = the monthly one. Two row kinds carry quota — `TOKENS_LIMIT` (token
 * plans) and `CREDIT_LIMIT` (credit plans, whose exact ratio is
 * `currentValue` / `usage`) — while `TIME_LIMIT` is the MCP request cap and
 * is not a plan window at all. Auth is the RAW key without a Bearer prefix.
 */
const GLM_UNIT_KEYS: Readonly<Record<number, string>> = { 3: '5h', 5: 'month', 6: 'week' }

/** Percent from a credit row's exact ratio, else the provider's own percentage. */
function glmCreditPercent(row: Record<string, unknown>): number | undefined {
  const used = toNum(row.currentValue)
  const limit = toNum(row.usage)
  if (used !== undefined && limit !== undefined && limit > 0) return clampPercent((used / limit) * 100)
  const percentage = toNum(row.percentage)
  return percentage === undefined ? undefined : clampPercent(percentage)
}

function glmPlan(host: string, ids: readonly string[]): ProviderAdapter {
  return {
    ids,
    displayName: 'GLM Coding Plan',
    plan: {
      origin: `https://${host}`,
      build: ({ apiKey }) => ({
        url: `https://${host}/api/monitor/usage/quota/limit`,
        headers: { authorization: apiKey, 'accept-language': 'en-US,en' },
      }),
      parse: (status, body) => {
        if (status !== 200 || typeof body !== 'object' || body === null) return undefined
        const root = body as Record<string, unknown>
        if (root.success !== true) return undefined
        const data = root.data
        if (typeof data !== 'object' || data === null) return undefined
        const limits = (data as Record<string, unknown>).limits
        if (!Array.isArray(limits)) return undefined
        const windows: PlanWindowView[] = []
        for (const entry of limits) {
          if (typeof entry !== 'object' || entry === null) continue
          const row = entry as Record<string, unknown>
          const kind = str(row.type)
          // The MCP request cap is a per-minute request budget, not a plan window.
          if (kind === 'TIME_LIMIT') continue
          const key = GLM_UNIT_KEYS[toNum(row.unit) ?? Number.NaN]
          // Unknown units fall through: rendering them would invent a window.
          if (key === undefined) continue
          if (kind !== 'TOKENS_LIMIT' && kind !== 'CREDIT_LIMIT') continue
          windows.push({
            key,
            percent: kind === 'CREDIT_LIMIT'
              ? glmCreditPercent(row)
              : (() => {
                  const percentage = toNum(row.percentage)
                  return percentage === undefined ? undefined : clampPercent(percentage)
                })(),
            resetsAt: toIso(row.nextResetTime),
          })
        }
        if (windows.length === 0) return undefined
        return { planName: str((data as Record<string, unknown>).level), windows }
      },
    },
  }
}

/** OpenCode Go quota: percent-only rolling/weekly/monthly windows. */
const OPENCODE_GO: ProviderAdapter = {
  ids: ['opencode-go'],
  displayName: 'OpenCode Go',
  plan: {
    origin: 'https://opencode.ai',
    build: ({ apiKey }) => ({ url: 'https://opencode.ai/zen/go/v1/usage', headers: bearer(apiKey) }),
    parse: (status, body) => {
      if (status !== 200 || typeof body !== 'object' || body === null) return undefined
      const usage = (body as Record<string, unknown>).usage
      if (typeof usage !== 'object' || usage === null) return undefined
      const windows: PlanWindowView[] = []
      const keys: Array<[string, string]> = [['rolling', '5h'], ['weekly', 'week'], ['monthly', 'month']]
      for (const [field, key] of keys) {
        const entry = (usage as Record<string, unknown>)[field]
        if (typeof entry !== 'object' || entry === null) continue
        const row = entry as Record<string, unknown>
        const percent = toNum(row.percent)
        windows.push({
          key,
          percent: percent === undefined ? undefined : Math.max(0, Math.min(100, percent)),
          // percent 0 resetsAt is a placeholder (now + window); drop it.
          resetsAt: percent === 0 ? undefined : toIso(row.resetsAt),
        })
      }
      if (windows.length === 0) return undefined
      return { windows }
    },
  },
}

/** MiniMax coding-plan remains: remaining-percent semantics, `general` model entry. */
function minimaxPlan(host: string, ids: readonly string[]): ProviderAdapter {
  return {
    ids,
    displayName: 'MiniMax Coding Plan',
    plan: {
      origin: `https://${host}`,
      build: ({ apiKey }) => ({ url: `https://${host}/v1/api/openplatform/coding_plan/remains`, headers: bearer(apiKey) }),
      parse: (status, body) => {
        if (status !== 200 || typeof body !== 'object' || body === null) return undefined
        const remains = (body as Record<string, unknown>).model_remains
        if (!Array.isArray(remains)) return undefined
        const general = remains.find((entry) => typeof entry === 'object' && entry !== null
          && (entry as Record<string, unknown>).model_name === 'general')
        if (typeof general !== 'object' || general === null) return undefined
        const row = general as Record<string, unknown>
        const windows: PlanWindowView[] = []
        const intervalRemaining = toNum(row.current_interval_remaining_percent)
        if (intervalRemaining !== undefined) {
          windows.push({ key: '5h', percent: Math.max(0, Math.min(100, 100 - intervalRemaining)), resetsAt: toIso(row.end_time) })
        }
        if (row.current_weekly_status === 1) {
          const weeklyRemaining = toNum(row.current_weekly_remaining_percent)
          if (weeklyRemaining !== undefined) {
            windows.push({ key: 'week', percent: Math.max(0, Math.min(100, 100 - weeklyRemaining)), resetsAt: toIso(row.weekly_end_time) })
          }
        }
        if (windows.length === 0) return undefined
        return { windows }
      },
    },
  }
}

const OPENROUTER: ProviderAdapter = {
  ids: ['openrouter'],
  displayName: 'OpenRouter',
  balance: {
    origin: 'https://openrouter.ai',
    build: ({ apiKey }) => ({ url: 'https://openrouter.ai/api/v1/credits', headers: bearer(apiKey) }),
    parse: (status, body) => {
      if (status !== 200 || typeof body !== 'object' || body === null) return undefined
      const data = (body as Record<string, unknown>).data
      if (typeof data !== 'object' || data === null) return undefined
      const credits = toNum((data as Record<string, unknown>).total_credits)
      const used = toNum((data as Record<string, unknown>).total_usage) ?? 0
      if (credits === undefined) return undefined
      return { currency: 'USD', totalBalance: money(credits - used) }
    },
  },
}

function siliconFlow(host: string, ids: readonly string[], currency: string): ProviderAdapter {
  return {
    ids,
    displayName: 'SiliconFlow',
    balance: {
      origin: `https://${host}`,
      build: ({ apiKey }) => ({ url: `https://${host}/v1/user/info`, headers: bearer(apiKey) }),
      parse: (status, body) => {
        if (status !== 200 || typeof body !== 'object' || body === null) return undefined
        const data = (body as Record<string, unknown>).data
        if (typeof data !== 'object' || data === null) return undefined
        const total = str((data as Record<string, unknown>).totalBalance)
        if (total === undefined) return undefined
        return { currency, totalBalance: total }
      },
    },
  }
}

const ZENMUX: ProviderAdapter = {
  ids: ['zenmux'],
  displayName: 'ZenMux',
  balance: {
    origin: 'https://zenmux.ai',
    build: ({ apiKey }) => ({ url: 'https://zenmux.ai/api/v1/management/payg/balance', headers: bearer(apiKey) }),
    parse: (status, body) => {
      if (status !== 200 || typeof body !== 'object' || body === null) return undefined
      const data = (body as Record<string, unknown>).data
      if (typeof data !== 'object' || data === null) return undefined
      const credits = toNum((data as Record<string, unknown>).total_credits)
      if (credits === undefined) return undefined
      return { currency: 'USD', totalBalance: money(credits) }
    },
  },
}

/**
 * OpenAI Codex (ChatGPT subscription) quota over the OAuth access token the
 * pi-ai grant stores — the one plan adapter whose credential is an OAuth
 * token rather than an API key. A 401 here means the stored access token has
 * expired; it refreshes when the harness next runs a Codex request, so the
 * error line tells the user to use Codex once and refresh.
 */
const OPENAI_CODEX: ProviderAdapter = {
  ids: ['openai-codex'],
  displayName: 'Codex (ChatGPT 订阅)',
  plan: {
    origin: 'https://chatgpt.com',
    build: ({ apiKey, accountId }) => ({
      url: 'https://chatgpt.com/backend-api/wham/usage',
      headers: {
        authorization: `Bearer ${apiKey}`,
        'user-agent': 'codex-cli',
        accept: 'application/json',
        ...(accountId !== undefined ? { 'chatgpt-account-id': accountId } : {}),
      },
    }),
    parse: (status, body) => {
      if (status !== 200 || typeof body !== 'object' || body === null) return undefined
      const rateLimit = (body as Record<string, unknown>).rate_limit
      if (typeof rateLimit !== 'object' || rateLimit === null) return undefined
      const windows: PlanWindowView[] = []
      const rows = (rateLimit as Record<string, unknown>).primary_window !== undefined || (rateLimit as Record<string, unknown>).secondary_window !== undefined
        ? [(rateLimit as Record<string, unknown>).primary_window, (rateLimit as Record<string, unknown>).secondary_window]
        : []
      for (const entry of rows) {
        if (typeof entry !== 'object' || entry === null) continue
        const row = entry as Record<string, unknown>
        const percent = toNum(row.used_percent)
        if (percent === undefined) continue
        const seconds = toNum(row.limit_window_seconds)
        windows.push({
          key: codexWindowKey(seconds),
          percent: Math.max(0, Math.min(100, percent)),
          // reset_at is unix seconds; toIso scales sub-millisecond-epoch values.
          resetsAt: toIso(row.reset_at),
        })
      }
      if (windows.length === 0) return undefined
      return { windows }
    },
  },
}

/** Map a Codex window length in seconds onto the shared window key vocabulary. */
function codexWindowKey(seconds: number | undefined): string {
  if (seconds === undefined) return 'window'
  if (seconds === 18000) return '5h'
  if (seconds === 604800) return 'week'
  if (seconds === 2_592_000) return 'month'
  const hours = seconds / 3600
  return hours >= 24 ? `${Math.round(hours / 24)}_day` : `${Math.round(hours)}_hour`
}

/**
 * The adapter registry, in no particular order. Route keys come from the
 * pi-ai provider catalog plus the routes this deployment observed in user
 * configuration (`zenmux`).
 */
export const PROVIDER_ADAPTERS: readonly ProviderAdapter[] = [
  DEEPSEEK,
  moonshotBalance('api.moonshot.cn', 'CNY', ['moonshotai-cn']),
  moonshotBalance('api.moonshot.ai', 'USD', ['moonshotai']),
  KIMI_CODING,
  glmPlan('open.bigmodel.cn', ['zai-coding-cn']),
  glmPlan('api.z.ai', ['zai', 'zai-coding']),
  OPENCODE_GO,
  minimaxPlan('api.minimaxi.com', ['minimax-cn']),
  minimaxPlan('api.minimax.io', ['minimax']),
  OPENAI_CODEX,
  OPENROUTER,
  DEEPRELAY,
  AMD_CLOUD,
  NUMES,
  REFUSELESS,
  siliconFlow('api.siliconflow.cn', ['siliconflow', 'siliconflow-cn'], 'CNY'),
  siliconFlow('api.siliconflow.com', ['siliconflow-intl'], 'USD'),
  ZENMUX,
]

/** Find the adapter serving a provider route key, if any. */
export function adapterFor(provider: string): ProviderAdapter | undefined {
  return PROVIDER_ADAPTERS.find((adapter) => adapter.ids.includes(provider))
}

/**
 * Resolve the adapter for a route by its configured API origin. The endpoint
 * identifies the account, so a route may be named anything (`deeprelay-dshflash`)
 * and still gets its balance, plan or quota. The route id is only a fallback
 * for routes that configure no base URL at all (catalog defaults): a route with
 * a base URL that matches no adapter is a different provider, never the one its
 * id happens to name.
 * @param provider - the route id.
 * @param baseURL - the route's configured base URL, if any.
 * @returns the adapter serving that route, if one matches.
 */
export function adapterForRoute(provider: string, baseURL: string | undefined): ProviderAdapter | undefined {
  const origin = originOf(baseURL)
  if (origin !== undefined) {
    return PROVIDER_ADAPTERS.find((adapter) =>
      adapter.balance?.origin === origin
      || adapter.plan?.origin === origin
      || adapter.quota?.origin === origin
      || adapter.spend?.origin === origin)
  }
  if (baseURL !== undefined && baseURL.trim() !== '') return undefined
  return adapterFor(provider)
}

/** Origin of a configured base URL, or undefined when it cannot be parsed. */
export function originOf(baseURL: string | undefined): string | undefined {
  if (baseURL === undefined || baseURL.trim() === '') return undefined
  try {
    return new URL(baseURL).origin
  } catch {
    return undefined
  }
}

/**
 * Whether an adapter's balance endpoint reports THIS route's account.
 *
 * Some adapter families share one route key across providers that merely
 * speak the same API: `deepseek` is both the official DeepSeek catalog entry
 * and a common id for an OpenAI-compatible reseller (Alibaba Bailian, ...)
 * pointed at another host by the profile's `baseURL`. The balance endpoint is
 * per ORIGIN, not per route key, so probing the official endpoint for a
 * reseller profile reports the official account's money under the reseller's
 * name (issue #1688). An adapter published with a fixed `origin` therefore
 * only applies to a route whose configured base URL is that origin, or to a
 * route that pins no base URL at all (the catalog alias of the official
 * route, which resolves the family's own credential).
 *
 * @param adapter - the matched adapter.
 * @param baseURL - the route's configured base URL (pi-ai profile), if any.
 * @returns true when the adapter may probe its balance endpoint for the route.
 */
export function balanceAppliesToRoute(adapter: ProviderAdapter, baseURL: string | undefined): boolean {
  const expected = adapter.balance?.origin
  if (expected === undefined) return true
  const configured = originOf(baseURL)
  if (configured === undefined) return true
  return configured === expected
}

/**
 * Whether a spend-cap endpoint reports THIS route's account. Same origin gate
 * as the balance and quota halves.
 *
 * @param adapter - the matched adapter.
 * @param baseURL - the route's configured base URL (pi-ai profile), if any.
 * @returns true when the adapter may probe its spend endpoint for the route.
 */
export function spendAppliesToRoute(adapter: ProviderAdapter, baseURL: string | undefined): boolean {
  const expected = adapter.spend?.origin
  if (expected === undefined) return true
  const configured = originOf(baseURL)
  if (configured === undefined) return true
  return configured === expected
}

/**
 * Whether a subscription-quota endpoint reports THIS route's account. Same
 * origin gate as {@link balanceAppliesToRoute}, for the quota half: a route key
 * that merely shares `deeprelay` but points at another host is another account.
 *
 * @param adapter - the matched adapter.
 * @param baseURL - the route's configured base URL (pi-ai profile), if any.
 * @returns true when the adapter may probe its quota endpoint for the route.
 */
export function quotaAppliesToRoute(adapter: ProviderAdapter, baseURL: string | undefined): boolean {
  const expected = adapter.quota?.origin
  if (expected === undefined) return true
  const configured = originOf(baseURL)
  if (configured === undefined) return true
  return configured === expected
}

/**
 * Whether a provider route belongs to the official DeepSeek family: the only
 * family with a spend price book and a settings-section-owned env credential
 * (llm-deepseek) rather than a pi-ai profile. Drives the fold-time cost
 * stamping and the client fold-time spend estimate.
 *
 * Family membership is wider than the probe directory. The account route
 * (deepseek-account) bills the same account but authenticates with the account
 * token, so it prices spend while `adapterFor()` still returns undefined
 * for it and no probe or env-credential fallback can reach it. Every caller of
 * this predicate is an accounting decision; the credential and probing
 * decisions read `adapterFor()` instead, so the two never widen together
 * (issue #1772).
 */
export function isDeepSeekProviderRoute(provider: string): boolean {
  if (adapterFor(provider) === DEEPSEEK) return true
  return DEEPSEEK.familyOnlyIds?.includes(provider) === true
}

/**
 * Best-effort human message from a provider error body, for the per-provider
 * error line. Never throws; truncated to one short sentence.
 */
export function providerErrorMessage(status: number, body: unknown): string {
  let message: string | undefined
  if (typeof body === 'object' && body !== null) {
    const root = body as Record<string, unknown>
    const nested = typeof root.error === 'object' && root.error !== null ? (root.error as Record<string, unknown>) : undefined
    message = str(root.message) ?? str(root.msg) ?? (nested !== undefined ? str(nested.message) : undefined)
  }
  const detail = message === undefined ? '' : `: ${message.slice(0, 120)}`
  return `HTTP ${status}${detail}`
}
