/**
 * Spend display: the ledger keeps every cost estimate in the priced provider's
 * billing currency (CNY), and that stored value never moves. This module turns
 * one CNY figure into the currency the user chose to READ it in, so switching
 * the display is a rendering decision, not a data migration (issue #1937).
 * @module @legifyx/dsh-usage/core/spend
 */
/** A currency the spend display can render. */
export type SpendCurrency = 'CNY' | 'USD';
/** How to read a stored CNY cost. */
export interface SpendDisplay {
    /** The currency to render in. */
    currency: SpendCurrency;
    /** CNY per USD; consulted only when the display currency is USD. */
    cnyPerUsd: number;
}
/**
 * The rate used when the row configures none: a plain default, so an
 * unconfigured display still has a defined美元 figure instead of a blank card.
 * The plugin never fetches a live rate (its host routes are loopback-fenced and
 * its browser half has no network), so there is no fetch that could fail and
 * leave the card empty.
 */
export declare const DEFAULT_CNY_PER_USD = 7.2;
/** The display used when the row carries no setting: the historical CNY rendering. */
export declare const DEFAULT_SPEND_DISPLAY: SpendDisplay;
/**
 * Normalize a configured display.
 * An unknown currency reads as CNY, and a rate that is not a positive finite
 * number falls back to the default rate — the display must never be able to
 * blank the card.
 * @param input - the configured currency and rate, if any.
 * @returns a display that can always render.
 */
export declare function resolveSpendDisplay(input?: {
    currency?: unknown;
    cnyPerUsd?: unknown;
}): SpendDisplay;
/**
 * Render one stored CNY cost in the display currency.
 * A non-finite or negative cost renders as zero rather than as `NaN`/`¥-0.10`.
 * @param costCny - the stored cost in CNY.
 * @param display - the display to render in; defaults to CNY.
 * @returns the formatted amount with its currency symbol.
 */
export declare function formatSpend(costCny: number, display?: SpendDisplay): string;
/** How one provider's spend should read. */
export type ProviderCurrency = 'native' | 'CNY' | 'USD' | 'both';
/**
 * Parse the per-provider currency list (`provider:choice,...`).
 * Unknown choices are ignored; a provider absent from the map reads native.
 * @param text - the stored list.
 * @returns the choice for each named provider.
 */
export declare function parseProviderCurrencies(text: string): Map<string, ProviderCurrency>;
/**
 * Format one provider's spend in the currency the reader picked.
 * USD prefers the stored USD-book estimate; a row recorded before that book
 * existed falls back to converting the CNY estimate at the display rate.
 * @param costCny - the provider's CNY estimate.
 * @param costUsd - the provider's USD-book estimate (0 when unavailable).
 * @param choice - the provider's configured currency.
 * @param display - the display rate used for the USD fallback.
 * @returns the formatted amount.
 */
export declare function formatProviderSpend(costCny: number, costUsd: number, choice: ProviderCurrency, display?: SpendDisplay): string;
