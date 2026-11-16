/**
 * The usage page's card chrome: the family settings card whose header holds
 * the plugin switch, and the display rows the body closes with.
 * @module @linxin666/dsh-usage/client/UsagePage
 */

import type { ReactNode } from 'react'
import { t } from './locales.ts'
import styles from './usage.module.css'
import { ChoiceField, PluginSettingsCard, ToggleSwitch, ValueField } from './PluginSettingsCard.tsx'
import { POLL_INTERVAL_RANGE, SPEND_CURRENCIES, type UsageSettingsCardFace, type UsageSettingsCardState } from './usage-settings-card.ts'
import type { ProviderSnapshotView } from '../core/types.ts'

/**
 * The page's card: the plugin switch in the header, the statistics and the
 * display rows in the body. A switched-off plugin keeps only the header, whose
 * line says how to bring it back; a refused write keeps the body, so the
 * failure line under the rows stays readable.
 */
export function UsagePage(props: { card: UsageSettingsCardState; face: UsageSettingsCardFace; enabled: boolean; providers?: ProviderSnapshotView[]; children: ReactNode }): ReactNode {
  const { card, face, enabled } = props
  return (
    <ul className={styles.sectionList} data-dsh-plugin="usage">
      <PluginSettingsCard
        t={t}
        titleKey="usage.title"
        titleId="settings-usage-title"
        descriptionKey={enabled ? 'usage.description' : 'usage.disabled'}
        headerAction={card.exposed
          ? (
            <ToggleSwitch
              labelledBy="settings-usage-title"
              checked={enabled}
              disabled={!card.writable}
              onChange={(next) => { face.edit('enabled', String(next)) }}
            />
          )
          : undefined}
        headerOnly={!enabled && !card.failed}
        state={card}
        alwaysOpen
        renderChildrenWhenNotExposed
        hideNotExposedNotice
        onSave={face.save}
        onDiscard={face.discard}
      >
        {props.children}
        {card.exposed ? <SettingsRows card={card} face={face} providers={props.providers ?? []} /> : null}
      </PluginSettingsCard>
    </ul>
  )
}

/** One label + pill switch row, matching the plugin switch in the header. */
function ToggleRow(props: { label: string; checked: boolean; disabled?: boolean; onChange: (next: boolean) => void }): ReactNode {
  return (
    <div className={styles.settingsToggle}>
      <span className={styles.settingsToggleLabel}>{props.label}</span>
      <ToggleSwitch
        ariaLabel={props.label}
        checked={props.checked}
        disabled={props.disabled}
        onChange={props.onChange}
      />
    </div>
  )
}

/** Split a comma-separated hidden-provider list into a set. */
function splitHidden(text: string): Set<string> {
  return new Set(text.split(',').map(entry => entry.trim()).filter(entry => entry !== ''))
}

/**
 * The display rows under the statistics. Each control writes through the card
 * form: the currency pick at once, a typed number after a pause or on Enter.
 * The rate only matters while spend shows in dollars, so it appears then.
 */
function SettingsRows(props: { card: UsageSettingsCardState; face: UsageSettingsCardFace; providers: ProviderSnapshotView[] }): ReactNode {
  const { card, face } = props
  const fieldProps = {
    overriddenLabel: t('settings.overridden'),
    resetLabel: t('settings.reset'),
    invalidLabel: t('settings.invalidNumber'),
    disabled: !card.writable
  }
  const hiddenBalances = splitHidden(card.hiddenBalances.text)
  const hiddenPlans = splitHidden(card.hiddenPlans.text)
  // Every configured provider that reports the fact gets a row, so a provider
  // added later appears here without a schema change. Hidden is the stored
  // list; a provider not in it is visible.
  const balanceRows = props.providers.filter(provider => provider.credential !== 'none'
    && (provider.balance !== undefined || provider.balances !== undefined || provider.balanceSupported === true))
  const planRows = props.providers.filter(provider => provider.credential !== 'none'
    && (provider.plan !== undefined || provider.quota !== undefined || provider.planSupported === true || provider.quotaSupported === true))
  const toggleHidden = (field: 'hiddenBalances' | 'hiddenPlans', id: string, show: boolean): void => {
    const next = splitHidden(card[field].text)
    if (show) next.delete(id)
    else next.add(id)
    face.edit(field, [...next].sort().join(','))
  }
  const planLabel = (provider: ProviderSnapshotView): string => {
    const name = provider.quota?.planName ?? provider.plan?.planName
    return name !== undefined ? `${provider.displayName} · ${name}` : provider.displayName
  }
  return (
    <section className={styles.settingsGroup} aria-labelledby="settings-usage-display-title" data-dsh-part="settings-rows">
      <h3 className={styles.groupTitle} id="settings-usage-display-title">{t('usage.config.title')}</h3>
      <ValueField
        id="settings-usage-poll-interval"
        label={t('usage.config.pollIntervalSec')}
        hint={t('usage.config.pollIntervalHint')}
        numeric
        range={POLL_INTERVAL_RANGE}
        {...fieldProps}
        {...card.pollIntervalSec}
        onEdit={(text) => { face.edit('pollIntervalSec', text) }}
        onReset={() => { face.resetField('pollIntervalSec') }}
      />
      <ChoiceField
        id="settings-usage-spend-currency"
        label={t('usage.config.spendCurrency')}
        hint={t('usage.config.spendCurrencyHint')}
        inheritLabel={t('settings.inherit')}
        presentation="segment"
        choices={SPEND_CURRENCIES.map(currency => ({ value: currency, label: currency }))}
        {...fieldProps}
        {...card.spendCurrency}
        onEdit={(text) => { face.edit('spendCurrency', text) }}
        onReset={() => { face.resetField('spendCurrency') }}
      />
      {card.spendCurrency.text === 'USD'
        ? (
          <ValueField
            id="settings-usage-cny-per-usd"
            label={t('usage.config.cnyPerUsd')}
            hint={t('usage.config.cnyPerUsdHint')}
            numeric
            {...fieldProps}
            {...card.cnyPerUsd}
            onEdit={(text) => { face.edit('cnyPerUsd', text) }}
            onReset={() => { face.resetField('cnyPerUsd') }}
          />
        )
        : null}
      <section className={styles.settingsGroup} aria-labelledby="settings-usage-foot-title" data-dsh-part="foot-settings">
        <h3 className={styles.groupTitle} id="settings-usage-foot-title">{t('usage.config.footTitle')}</h3>
        <p className={styles.settingsGroupHint}>{t('usage.config.footHint')}</p>
        <ToggleRow
          label={t('usage.config.footShowSpend')}
          checked={card.footShowSpend.text !== 'false'}
          disabled={!card.writable}
          onChange={(next) => face.edit('footShowSpend', String(next))}
        />
        <ToggleRow
          label={t('usage.config.footShowUsage')}
          checked={card.footShowUsage.text !== 'false'}
          disabled={!card.writable}
          onChange={(next) => face.edit('footShowUsage', String(next))}
        />
        <ToggleRow
          label={t('usage.config.footShowBalances')}
          checked={card.footShowBalances.text !== 'false'}
          disabled={!card.writable}
          onChange={(next) => face.edit('footShowBalances', String(next))}
        />
        <ToggleRow
          label={t('usage.config.footShowMeters')}
          checked={card.footShowMeters.text !== 'false'}
          disabled={!card.writable}
          onChange={(next) => face.edit('footShowMeters', String(next))}
        />
        <ChoiceField
          id="settings-usage-foot-window"
          label={t('usage.config.footMeterWindow')}
          presentation="segment"
          choices={[{ value: 'week', label: t('usage.quota.week') }, { value: 'month', label: t('usage.quota.month') }]}
          overriddenLabel={t('settings.overridden')}
          resetLabel={t('settings.reset')}
          disabled={!card.writable}
          {...card.footMeterWindow}
          onEdit={(text) => { face.edit('footMeterWindow', text) }}
          onReset={() => { face.resetField('footMeterWindow') }}
        />
        <ToggleRow
          label={t('usage.config.footShowPeak')}
          checked={card.footShowPeak.text !== 'false'}
          disabled={!card.writable}
          onChange={(next) => face.edit('footShowPeak', String(next))}
        />
        <ToggleRow
          label={t('usage.config.footShowUpdated')}
          checked={card.footShowUpdated.text !== 'false'}
          disabled={!card.writable}
          onChange={(next) => face.edit('footShowUpdated', String(next))}
        />
        <ToggleRow
          label={t('usage.config.footCompact')}
          checked={card.footCompact.text === 'true'}
          disabled={!card.writable}
          onChange={(next) => face.edit('footCompact', String(next))}
        />
      </section>
      <section className={styles.settingsGroup} aria-labelledby="settings-usage-cards-title" data-dsh-part="card-settings">
        <h3 className={styles.groupTitle} id="settings-usage-cards-title">{t('usage.config.cardsTitle')}</h3>
        <p className={styles.settingsGroupHint}>{t('usage.config.cardsHint')}</p>
        {balanceRows.length === 0 && planRows.length === 0 && (
          <span className={styles.muted}>{t('usage.config.cardsNone')}</span>
        )}
        {balanceRows.length > 0 && <span className={styles.settingsSubhead}>{t('usage.config.balancesTitle')}</span>}
        {balanceRows.map(provider => (
          <ToggleRow
            key={'balance-' + provider.provider}
            label={provider.displayName}
            checked={!hiddenBalances.has(provider.provider)}
            disabled={!card.writable}
            onChange={(next) => { toggleHidden('hiddenBalances', provider.provider, next) }}
          />
        ))}
        {planRows.length > 0 && <span className={styles.settingsSubhead}>{t('usage.config.plansTitle')}</span>}
        {planRows.map(provider => (
          <ToggleRow
            key={'plan-' + provider.provider}
            label={planLabel(provider)}
            checked={!hiddenPlans.has(provider.provider)}
            disabled={!card.writable}
            onChange={(next) => { toggleHidden('hiddenPlans', provider.provider, next) }}
          />
        ))}
      </section>
    </section>
  )
}
