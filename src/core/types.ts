/**
 * Wire-facing view types shared by the dsh-usage host service, its HTTP
 * routes, and the browser section. Everything here crosses the wire as JSON
 * and must stay provider-agnostic: provider quirks are normalized inside the
 * core adapters, never here.
 * @module @legifyx/dsh-usage/core/types
 */

import type { SpendDisplay } from './spend.ts'

/** One disjoint token bucket total, aggregated over calls (billed input = input + cacheRead + cacheWrite). */
export interface UsageTokenTotals {
  /** Uncached input tokens. */
  inputTokens: number
  /** Output tokens (reasoning included). */
  outputTokens: number
  /** Cache read tokens. */
  cacheReadTokens: number
  /** Cache write tokens. */
  cacheWriteTokens: number
  /** Reasoning tokens, when the provider reported them. */
  reasoningTokens: number
  /** Provider calls that reported usage. */
  calls: number
  /**
   * Spend estimate stamped at fold time, in the priced provider's billing
   * currency (currently DeepSeek official only, CNY); every other provider
   * stays 0 = unpriced, so the sum is never a mixed-currency total. Persisted
   * buckets recorded before a price-book change keep the old pricing.
   */
  cost: number
  /**
   * The same estimate priced from DeepSeek's USD book, for readers who show
   * spend in dollars. 0 when the provider is unpriced or the row predates the
   * USD book; a display falls back to converting `cost`.
   */
  costUsd: number
}

/** A zeroed totals bucket. */
export function emptyTotals(): UsageTokenTotals {
  return { inputTokens: 0, outputTokens: 0, cacheReadTokens: 0, cacheWriteTokens: 0, reasoningTokens: 0, calls: 0, cost: 0, costUsd: 0 }
}

/** Add `right` into `left` in place. */
export function addTotals(left: UsageTokenTotals, right: Readonly<UsageTokenTotals>): UsageTokenTotals {
  left.inputTokens += right.inputTokens
  left.outputTokens += right.outputTokens
  left.cacheReadTokens += right.cacheReadTokens
  left.cacheWriteTokens += right.cacheWriteTokens
  left.reasoningTokens += right.reasoningTokens
  left.calls += right.calls
  left.cost += right.cost
  left.costUsd += right.costUsd
  return left
}

/** On-disk usage ledger: per local day, per provider route, per model. */
export interface UsageLedgerDocument {
  version: 1
  /** Local-date key `YYYY-MM-DD` → per-provider per-model totals. */
  days: Record<string, Record<string, Record<string, UsageTokenTotals>>>
}

/** One provider row of the day summary the overview serves. */
export interface UsageProviderSummary {
  provider: string
  totals: UsageTokenTotals
  /** Per-model breakdown, heaviest by total tokens first, capped by the route. */
  models: Array<{ model: string; totals: UsageTokenTotals }>
}

/** One day row of the trend the overview serves. */
export interface UsageDaySummary {
  date: string
  totals: UsageTokenTotals
}

/**
 * One local day aggregated per provider and model. The overview serves today
 * through this shape and the day route serves any retained day with it, so a
 * day the user picks in the browser and the live today card are the same
 * document.
 */
export interface UsageDayView {
  /** Local-date key `YYYY-MM-DD`. */
  date: string
  totals: UsageTokenTotals
  /** Per-provider rows, heaviest by total tokens first. */
  providers: UsageProviderSummary[]
}

/** The day route's response body. */
export interface UsageDayResponse {
  ok: true
  day: UsageDayView
}

/** A balance fact normalized from a provider probe. */
export interface BalanceView {
  /** ISO 4217 code the provider bills in (`CNY`, `USD`, ...). */
  currency: string
  /** Spendable total formatted for display (no currency symbol). */
  totalBalance: string
  /** Epoch ms of the successful probe. */
  updatedAt: number
}

/** One quota window of a coding plan. */
export interface PlanWindowView {
  /** Stable window key the UI localizes (`5h`, `week`, `month`, provider strings otherwise). */
  key: string
  /** Provider-supplied window name, when it sends one. */
  name?: string
  /** Used percent 0-100, when computable. */
  percent?: number
  /** ISO 8601 reset instant, when the provider reports one. */
  resetsAt?: string
}

/** A coding-plan quota fact normalized from a provider probe. */
export interface PlanView {
  /** Plan tier name, when the provider reports one. */
  planName?: string
  windows: PlanWindowView[]
  updatedAt: number
}

/**
 * One window of a provider subscription that meters INPUT and OUTPUT
 * separately (deeprelay's Base/Plus plans). PlanView's percent-per-window
 * shape cannot carry this: the two caps share a window but not a
 * denominator, so each dimension keeps its own used/limit pair.
 */
export interface QuotaMeterView {
  /** Stable window key the UI localizes (`month`, `week`, provider strings otherwise). */
  key: string
  /** Provider-supplied window name, when it sends one. */
  name?: string
  /** Weighted input tokens spent this window. */
  usedInput: number
  /** Weighted input cap for this window; 0 means uncapped. */
  limitInput: number
  /** Weighted output tokens spent this window. */
  usedOutput: number
  /** Weighted output cap for this window; 0 means uncapped. */
  limitOutput: number
  /** ISO 8601 reset instant; absent for a rolling window. */
  resetsAt?: string
}

/** A subscription-metering quota fact normalized from a provider probe. */
export interface QuotaView {
  /** Plan tier name, when the provider reports one. */
  planName?: string
  /** Plan price formatted for display, when the provider reports one. */
  price?: string
  meters: QuotaMeterView[]
  updatedAt: number
}

/**
 * A provider's spend cap over one billing window, when it meters money rather
 * than tokens (AMD Cloud's daily cost ceiling, a relay key's USD limit).
 * `limit` 0 means the provider reported no cap.
 */
export interface SpendLimitView {
  /** ISO 4217 code the provider meters in. */
  currency: string
  /** Amount spent in this window. */
  used: number
  /** Cap for this window; 0 means unlimited/uncapped. */
  limit: number
  /** Window key the UI localizes (`daily`, `monthly`, `key`, provider strings otherwise). */
  window: string
  /** ISO 8601 reset instant, when the provider reports one. */
  resetsAt?: string
}

/** How the credential backing one provider route was resolved. */
export type CredentialKind = 'api-key' | 'env' | 'oauth' | 'none'

/** One aggregated usage window (the 30-day trend, or the whole retained ledger). */
export interface UsageWindowSummary {
  from: string
  to: string
  totals: UsageTokenTotals
  providers: UsageProviderSummary[]
}

/** One provider row of the overview snapshot. */
export interface ProviderSnapshotView {
  /** Provider route key (`deepseek`, `kimi-coding`, custom routes, ...). */
  provider: string
  /** Display name from the LLM runtime, else the adapter's, else the route key. */
  displayName: string
  credential: CredentialKind
  /** Whether any balance/plan adapter exists for this route. */
  supported: boolean
  /** A balance adapter exists for this route (the Usage tab's balance card). */
  balanceSupported?: boolean
  /** A coding-plan adapter exists for this route — the Plans tab lists these only. */
  planSupported?: boolean
  /** A subscription-quota adapter (input/output meters) exists for this route. */
  quotaSupported?: boolean
  /** A spend-cap adapter (money over a window) exists for this route. */
  spendSupported?: boolean
  balance?: BalanceView
  /**
   * Every currency the route's account reports, CNY and USD first.
   *
   * A signed-in DeepSeek account holds one wallet per currency and the two are
   * not summable, so the single `balance` field cannot carry the whole answer;
   * older documents and API-key routes keep just `balance`.
   */
  balances?: BalanceView[]
  plan?: PlanView
  /** Input/output subscription meters (deeprelay plans). */
  quota?: QuotaView
  /** Money spent against a provider's own cap (AMD Cloud daily cost, relay keys). */
  spend?: SpendLimitView
  /** Last probe failure, cleared on the next success. */
  error?: string
  updatedAt?: number
}

/** The overview the browser section renders. */
export interface UsageOverviewView {
  updatedAt: number
  /**
   * How to read every CNY cost in this document. The host stamps the row's
   * configured display here so both browser halves format spend the same way;
   * absent on an older host document, which renders as CNY (issue #1937).
   */
  display?: SpendDisplay
  providers: ProviderSnapshotView[]
  /** The provider the collapsed sidebar strip and the header highlight; `source` says how it was picked. */
  current: {
    provider?: string
    model?: string
    /** `live` — last request seen this boot; `default` — the agent default model. */
    source: 'live' | 'default'
    /**
     * Resolved display name (snapshot first, route-derived otherwise), so the
     * strip needs no name-resolution of its own. Optional so an older host
     * document still renders.
     */
    displayName?: string
    /**
     * Today's ledger totals for the provider's adapter family (the route
     * itself when adapter-less), carrying tokens, calls, and the priced cost.
     * Absent on a day without usage; optional for the same older-host
     * tolerance as displayName.
     */
    today?: UsageTokenTotals
  }
  usage: {
    today: UsageDayView
    /** Last N local days ascending, including today. */
    days: UsageDaySummary[]
    /**
     * Every retained local day that recorded usage, ascending — the day
     * picker's option list, reaching past the trend cap to the whole
     * retention window. Optional so an older host document still renders
     * (the section then offers no picker).
     */
    availableDays?: string[]
    /**
     * The same window aggregated per provider and model — the trend card's
     * bar-chart data. Optional so an older host document still renders.
     */
    range?: UsageWindowSummary
    /**
     * The whole retained ledger (up to `retainDays`, today included)
     * aggregated per provider — the voucher's minted total. Optional for the
     * same older-host tolerance as `range`.
     */
    all?: UsageWindowSummary
  }
}

/**
 * Host-side snapshot state: the wire view plus one error slot per probed
 * fact. A probe half only clears its own slot, so a plan success can no
 * longer mask a failing balance probe (and vice versa); the overview
 * collapses them into the single wire `error` line, balance first.
 */
export interface ProviderSnapshotState extends ProviderSnapshotView {
  /** Last balance-probe failure; cleared on the next balance success. */
  balanceError?: string
  /** Last plan-probe failure; cleared on the next plan success. */
  planError?: string
  /** Last quota-probe failure; cleared on the next quota success. */
  quotaError?: string
  /** Last spend-probe failure; cleared on the next spend success. */
  spendError?: string
}
