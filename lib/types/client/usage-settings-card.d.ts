/**
 * The usage page's settings card: the plugin switch and the three display
 * rows, written through the family card form so a pick lands at once and a
 * typed value after a pause, exactly as the other Web Extensions pages do.
 * @module @legifyx/dsh-usage/client/usage-settings-card
 */
import type { ConfigForm } from '@deepseek-ai/dsh-client-ui-settings/client';
import type { SnapshotStore } from '@deepseek-ai/dsh-client-store';
import { type CardActions, type CardShell, type FieldState } from './settings-form.ts';
/** The settings fields this page edits (the namespace's own schema). */
export interface UsageSettings {
    enabled?: boolean;
    pollIntervalSec?: number;
    /** Currency the spend figures are displayed in; the ledger stays CNY. */
    spendCurrency?: 'CNY' | 'USD';
    /** CNY per USD, consulted only while the display currency is USD. */
    cnyPerUsd?: number;
    /** Sidebar glance card rows. */
    footShowSpend?: boolean;
    footShowUsage?: boolean;
    footShowBalances?: boolean;
    footShowMeters?: boolean;
    /** Subscription window the sidebar meter block shows. */
    footMeterWindow?: 'week' | 'month';
    footShowPeak?: boolean;
    footShowUpdated?: boolean;
    footCompact?: boolean;
    /** Comma-separated provider ids hidden from the balance card. */
    hiddenBalances?: string;
    /** Comma-separated provider ids hidden from the plans tab. */
    hiddenPlans?: string;
    /** Reader-chosen balance and plan order (comma-separated provider ids). */
    balanceOrder?: string;
    planOrder?: string;
    /** Per-provider spend currency (`provider:choice,...`). */
    providerCurrency?: string;
}
/** The display currencies the spend figures offer. */
export declare const SPEND_CURRENCIES: readonly ["CNY", "USD"];
/** Bounds of the poll interval, mirroring the host schema; the slider walks them in steps of 10 s. */
export declare const POLL_INTERVAL_RANGE: {
    min: number;
    max: number;
    step: number;
};
/** What the settings card renders. */
export interface UsageSettingsCardState extends CardShell {
    enabled: FieldState;
    pollIntervalSec: FieldState;
    spendCurrency: FieldState;
    cnyPerUsd: FieldState;
    footShowSpend: FieldState;
    footShowUsage: FieldState;
    footShowBalances: FieldState;
    footShowMeters: FieldState;
    footMeterWindow: FieldState;
    footShowPeak: FieldState;
    footShowUpdated: FieldState;
    footCompact: FieldState;
    hiddenBalances: FieldState;
    hiddenPlans: FieldState;
    balanceOrder: FieldState;
    planOrder: FieldState;
    providerCurrency: FieldState;
}
/** The card's snapshot and its form actions, as the section receives them. */
export interface UsageSettingsCardFace extends CardActions {
    store: SnapshotStore<UsageSettingsCardState>;
}
/** Bridges the usage namespace onto the family card form for the plugin's lifetime. */
export declare class UsageSettingsCardController {
    private readonly form;
    private readonly store;
    /** @param scope - the bound configuration form of the usage namespace. */
    constructor(scope: ConfigForm<UsageSettings>);
    /** The face the section's slot entry injects. */
    inject(): UsageSettingsCardFace;
    /** Release the form subscription; the plugin disposer calls this on teardown. */
    dispose(): void;
}
