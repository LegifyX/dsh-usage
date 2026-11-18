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
 * @module @legifyx/dsh-usage/core/discovery
 */
import type { BalanceParse, SpendParse } from './adapters.ts';
/** The fact a discovered shape can produce. */
export type DiscoveryFact = BalanceParse | SpendParse;
/** One known endpoint shape. */
export interface UsageShape {
    /** Stable id stored in the probe cache. */
    id: string;
    /** Path appended to the route's configured base URL. */
    path: string;
    /** Parse a 200 JSON body, or undefined when the shape does not match. */
    parse(body: unknown): DiscoveryFact | undefined;
}
/** A successful discovery. */
export interface DiscoveryResult {
    shape: UsageShape;
    fact: DiscoveryFact;
}
/**
 * Ordered shapes. AMD first because its `/key` would otherwise parse as an
 * uncapped OpenRouter key and hide the daily cap; credits last because it is
 * the widest match (`available` or `balance`).
 */
export declare const USAGE_SHAPES: readonly UsageShape[];
/** The route's configured base URL with a shape path appended. */
export declare function shapeUrl(baseURL: string, shape: UsageShape): string;
/** Whether a base URL points at this machine (no billing surface worth probing). */
export declare function isLoopbackBaseURL(baseURL: string): boolean;
/**
 * Probe one provider's base URL for a recognizable usage shape.
 * @param baseURL - the route's configured base URL.
 * @param apiKey - the resolved credential (sent only to that origin).
 * @returns the matching shape and fact, or undefined when none matched.
 */
export declare function discoverUsage(baseURL: string, apiKey: string): Promise<DiscoveryResult | undefined>;
