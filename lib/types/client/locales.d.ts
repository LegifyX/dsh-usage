/**
 * dsh-usage locale dictionaries (zh/en). The zh dictionary is the key source;
 * `en` mirrors its full key set (packages/AGENTS.md bilingual discipline).
 * @module @legifyx/dsh-usage/client/locales
 */
/** Dictionary namespace this package registers. */
export declare const NS = "dsh-web-ui-usage";
/** Chinese copy. */
export declare const zh: {
    'usage.title': string;
    'usage.tab.usage': string;
    'usage.tab.plans': string;
    'usage.tab.sidebar': string;
    'usage.sidebar.preview': string;
    'usage.refresh': string;
    'usage.refreshing': string;
    'usage.rescan': string;
    'usage.rescanning': string;
    'usage.updated': string;
    'usage.loading': string;
    'usage.error': string;
    'usage.disabled': string;
    'usage.current': string;
    'usage.today': string;
    'usage.today.cost': string;
    'usage.day.label': string;
    'usage.day.today': string;
    'usage.day.title': string;
    'usage.day.cost': string;
    'usage.day.empty': string;
    'usage.day.loading': string;
    'usage.day.error': string;
    'usage.peak.on': string;
    'usage.peak.off': string;
    'usage.peak.tag.on': string;
    'usage.peak.tag.off': string;
    'usage.peak.ends': string;
    'usage.peak.starts': string;
    'usage.calls': string;
    'usage.tokens.total': string;
    'usage.tokens.input': string;
    'usage.tokens.output': string;
    'usage.tokens.cacheRead': string;
    'usage.tokens.cacheWrite': string;
    'usage.trend': string;
    'usage.noData': string;
    'usage.balance': string;
    'usage.balance.unsupported': string;
    'usage.balance.noCredential': string;
    'usage.balance.noneConfigured': string;
    'usage.oauth': string;
    'usage.plan.reset': string;
    'usage.plan.noPlan': string;
    'usage.plan.noneConfigured': string;
    'usage.plan.windows.5h': string;
    'usage.plan.windows.week': string;
    'usage.plan.windows.month': string;
    'usage.quota.month': string;
    'usage.quota.week': string;
    'usage.quota.in': string;
    'usage.quota.out': string;
    'usage.quota.rolling': string;
    'usage.quota.hint': string;
    'usage.spend.title': string;
    'usage.spend.daily': string;
    'usage.spend.monthly': string;
    'usage.spend.key': string;
    'usage.spend.unlimited': string;
    'usage.provider.error': string;
    'usage.errorListSeparator': string;
    'usage.config.title': string;
    'usage.config.pollIntervalSec': string;
    'usage.config.spendCurrency': string;
    'usage.config.cnyPerUsd': string;
    'usage.foot.cost': string;
    'usage.foot.noData': string;
    'usage.foot.open': string;
    'usage.foot.collapse': string;
    'usage.foot.expand': string;
    'usage.description': string;
    'usage.config.pollIntervalHint': string;
    'usage.config.spendCurrencyHint': string;
    'usage.config.cnyPerUsdHint': string;
    'usage.config.footTitle': string;
    'usage.config.footHint': string;
    'usage.config.footShowSpend': string;
    'usage.config.footShowUsage': string;
    'usage.config.footShowBalances': string;
    'usage.config.footShowMeters': string;
    'usage.config.footMeterWindow': string;
    'usage.config.footShowPeak': string;
    'usage.config.footShowUpdated': string;
    'usage.config.footCompact': string;
    'usage.config.cardsTitle': string;
    'usage.config.cardsHint': string;
    'usage.config.balancesTitle': string;
    'usage.config.plansTitle': string;
    'usage.config.cardsNone': string;
    'usage.config.moveUp': string;
    'usage.config.moveDown': string;
    'usage.balance.hidden': string;
    'usage.config.providerCurrencies': string;
    'usage.config.providerCurrenciesHint': string;
    'usage.currency.native': string;
    'usage.currency.both': string;
    'usage.config.currencyTitle': string;
    'settings.collapse': string;
    'settings.expand': string;
    'settings.notExposed': string;
    'settings.readOnly': string;
    'settings.saveFailed': string;
    'settings.inherit': string;
    'settings.overridden': string;
    'settings.reset': string;
    'settings.invalidNumber': string;
};
/** English mirror; every zh key present. */
export declare const en: Record<UsageKey, string>;
export type UsageKey = keyof typeof zh;
/**
 * Active dictionary, picked by the document language at call time. The
 * section resolves its copy the same tiny way the pet's DOM-injected surface
 * does (the settings section has no framework locale seat of its own).
 */
export declare function dictionary(): Record<UsageKey, string>;
/** Translate a key with optional `{name}` template params; missing keys degrade to the key. */
export declare function t(key: string, params?: Record<string, unknown>): string;
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** dsh-usage UI copy. */
        'dsh-web-ui-usage': UsageKey;
    }
}
