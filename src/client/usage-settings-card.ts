/**
 * The usage page's settings card: the plugin switch and the three display
 * rows, written through the family card form so a pick lands at once and a
 * typed value after a pause, exactly as the other Web Extensions pages do.
 * @module @linxin666/dsh-usage/client/usage-settings-card
 */

import type { ConfigForm } from '@deepseek-ai/dsh-client-ui-settings/client'
import type { SnapshotStore } from '@deepseek-ai/dsh-client-store'
import { CardForm, booleanField, choiceField, numberField, textField, type CardActions, type CardShell, type FieldState } from './settings-form.ts'

/** The settings fields this page edits (the namespace's own schema). */
export interface UsageSettings {
  enabled?: boolean
  pollIntervalSec?: number
  /** Currency the spend figures are displayed in; the ledger stays CNY. */
  spendCurrency?: 'CNY' | 'USD'
  /** CNY per USD, consulted only while the display currency is USD. */
  cnyPerUsd?: number
  /** Sidebar glance card rows. */
  footShowSpend?: boolean
  footShowUsage?: boolean
  footShowBalances?: boolean
  footShowMeters?: boolean
  /** Subscription window the sidebar meter block shows. */
  footMeterWindow?: 'week' | 'month'
  footShowPeak?: boolean
  footShowUpdated?: boolean
  footCompact?: boolean
  /** Comma-separated provider ids hidden from the balance card. */
  hiddenBalances?: string
  /** Comma-separated provider ids hidden from the plans tab. */
  hiddenPlans?: string
}

/** The display currencies the spend figures offer. */
export const SPEND_CURRENCIES = ['CNY', 'USD'] as const

/** Bounds of the poll interval, mirroring the host schema; the slider walks them in steps of 10 s. */
export const POLL_INTERVAL_RANGE = { min: 30, max: 3600, step: 10 }

/** What the settings card renders. */
export interface UsageSettingsCardState extends CardShell {
  enabled: FieldState
  pollIntervalSec: FieldState
  spendCurrency: FieldState
  cnyPerUsd: FieldState
  footShowSpend: FieldState
  footShowUsage: FieldState
  footShowBalances: FieldState
  footShowMeters: FieldState
  footMeterWindow: FieldState
  footShowPeak: FieldState
  footShowUpdated: FieldState
  footCompact: FieldState
  hiddenBalances: FieldState
  hiddenPlans: FieldState
}

/** The card's snapshot and its form actions, as the section receives them. */
export interface UsageSettingsCardFace extends CardActions {
  store: SnapshotStore<UsageSettingsCardState>
}

/** Bridges the usage namespace onto the family card form for the plugin's lifetime. */
export class UsageSettingsCardController {
  private readonly form: CardForm<UsageSettings>
  private readonly store: SnapshotStore<UsageSettingsCardState>

  /** @param scope - the bound configuration form of the usage namespace. */
  constructor(scope: ConfigForm<UsageSettings>) {
    this.form = new CardForm(scope, [
      booleanField('enabled'),
      numberField('pollIntervalSec', { integer: true, min: POLL_INTERVAL_RANGE.min }),
      choiceField('spendCurrency', SPEND_CURRENCIES),
      numberField('cnyPerUsd', { min: 0.01 }),
      booleanField('footShowSpend'),
      booleanField('footShowUsage'),
      booleanField('footShowBalances'),
      booleanField('footShowMeters'),
      choiceField('footMeterWindow', ['week', 'month'] as const),
      booleanField('footShowPeak'),
      booleanField('footShowUpdated'),
      booleanField('footCompact'),
      textField('hiddenBalances', 'pick'),
      textField('hiddenPlans', 'pick'),
    ])
    this.store = this.form.bind(() => ({
      ...this.form.shell(),
      enabled: this.form.field('enabled'),
      pollIntervalSec: this.form.field('pollIntervalSec'),
      spendCurrency: this.form.field('spendCurrency'),
      cnyPerUsd: this.form.field('cnyPerUsd'),
      footShowSpend: this.form.field('footShowSpend'),
      footShowUsage: this.form.field('footShowUsage'),
      footShowBalances: this.form.field('footShowBalances'),
      footShowMeters: this.form.field('footShowMeters'),
      footMeterWindow: this.form.field('footMeterWindow'),
      footShowPeak: this.form.field('footShowPeak'),
      footShowUpdated: this.form.field('footShowUpdated'),
      footCompact: this.form.field('footCompact'),
      hiddenBalances: this.form.field('hiddenBalances'),
      hiddenPlans: this.form.field('hiddenPlans'),
    }))
  }

  /** The face the section's slot entry injects. */
  inject(): UsageSettingsCardFace {
    return { store: this.store, ...this.form.actions() }
  }

  /** Release the form subscription; the plugin disposer calls this on teardown. */
  dispose(): void {
    this.form.dispose()
  }
}
