/**
 * The usage page's card chrome: the family settings card whose header holds
 * the plugin switch, and the display rows the body closes with.
 * @module @legifyx/dsh-usage/client/UsagePage
 */

import type { ReactNode } from 'react'
import { t } from './locales.ts'
import styles from './usage.module.css'
import { ChoiceField, PluginSettingsCard, ToggleSwitch, ValueField } from './PluginSettingsCard.tsx'
import { POLL_INTERVAL_RANGE, SPEND_CURRENCIES, type UsageSettingsCardFace, type UsageSettingsCardState } from './usage-settings-card.ts'
import type { ProviderSnapshotView } from '../core/types.ts'
import { orderByList } from './order.ts'
import { parseProviderCurrencies, type ProviderCurrency } from '../core/spend.ts'

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

/**
 * Every sidebar-card setting, rendered by the Sidebar tab. Kept out of the
 * shared settings rows so the group does not repeat under all four tabs.
 */
export function SidebarCardSettings(props: { card: UsageSettingsCardState; face: UsageSettingsCardFace }): ReactNode {
  const { card, face } = props
  return (
    <div className={styles.card} data-dsh-part="foot-settings">
      <span className={styles.cardTitle}>{t('usage.config.footTitle')}</span>
      <p className={styles.settingsGroupHint}>{t('usage.config.footHint')}</p>
      <ValueField
        id="settings-usage-poll-interval"
        label={t('usage.config.pollIntervalSec')}
        hint={t('usage.config.pollIntervalHint')}
        numeric
        range={POLL_INTERVAL_RANGE}
        overriddenLabel={t('settings.overridden')}
        resetLabel={t('settings.reset')}
        invalidLabel={t('settings.invalidNumber')}
        disabled={!card.writable}
        {...card.pollIntervalSec}
        onEdit={(text) => { face.edit('pollIntervalSec', text) }}
        onReset={() => { face.resetField('pollIntervalSec') }}
      />
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
    </div>
  )
}

/** A card toggle with the move-up/move-down pair that sets its order. */
function OrderRow(props: {
  label: string
  checked: boolean
  disabled?: boolean
  canUp: boolean
  canDown: boolean
  onUp: () => void
  onDown: () => void
  onChange: (next: boolean) => void
}): ReactNode {
  return (
    <div className={styles.orderRow}>
      <span className={styles.orderButtons}>
        <button
          type="button"
          className={styles.orderBtn}
          aria-label={t('usage.config.moveUp')}
          disabled={!props.canUp || props.disabled}
          onClick={props.onUp}
        >↑</button>
        <button
          type="button"
          className={styles.orderBtn}
          aria-label={t('usage.config.moveDown')}
          disabled={!props.canDown || props.disabled}
          onClick={props.onDown}
        >↓</button>
      </span>
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

/**
 * Provider visibility and order for both the page cards and the sidebar. It
 * lives on the Sidebar tab so the group does not repeat under every tab.
 */
export function CardVisibilitySettings(props: { card: UsageSettingsCardState; face: UsageSettingsCardFace; providers: ProviderSnapshotView[] }): ReactNode {
  const { card, face, providers } = props
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
  const orderedBalances = orderByList(balanceRows, card.balanceOrder.text)
  const orderedPlans = orderByList(planRows, card.planOrder.text)
  const reorder = (kind: 'balance' | 'plan', from: number, delta: number): void => {
    const rows = kind === 'balance' ? orderedBalances : orderedPlans
    const ids = rows.map(row => row.provider)
    const to = from + delta
    if (to < 0 || to >= ids.length) return
    const moved = ids[from]!
    ids[from] = ids[to]!
    ids[to] = moved
    face.edit(kind === 'balance' ? 'balanceOrder' : 'planOrder', ids.join(','))
  }

  return (
      <section className={styles.settingsGroup} aria-labelledby="settings-usage-cards-title" data-dsh-part="card-settings">
        <h3 className={styles.groupTitle} id="settings-usage-cards-title">{t('usage.config.cardsTitle')}</h3>
        <p className={styles.settingsGroupHint}>{t('usage.config.cardsHint')}</p>
        {balanceRows.length === 0 && planRows.length === 0 && (
          <span className={styles.muted}>{t('usage.config.cardsNone')}</span>
        )}
        {balanceRows.length > 0 && <span className={styles.settingsSubhead}>{t('usage.config.balancesTitle')}</span>}
        {orderedBalances.map((provider, index) => (
          <OrderRow
            key={'balance-' + provider.provider}
            label={provider.displayName}
            checked={!hiddenBalances.has(provider.provider)}
            disabled={!card.writable}
            canUp={index > 0}
            canDown={index < orderedBalances.length - 1}
            onUp={() => { reorder('balance', index, -1) }}
            onDown={() => { reorder('balance', index, 1) }}
            onChange={(next) => { toggleHidden('hiddenBalances', provider.provider, next) }}
          />
        ))}
        {planRows.length > 0 && <span className={styles.settingsSubhead}>{t('usage.config.plansTitle')}</span>}
        {orderedPlans.map((provider, index) => (
          <OrderRow
            key={'plan-' + provider.provider}
            label={planLabel(provider)}
            checked={!hiddenPlans.has(provider.provider)}
            disabled={!card.writable}
            canUp={index > 0}
            canDown={index < orderedPlans.length - 1}
            onUp={() => { reorder('plan', index, -1) }}
            onDown={() => { reorder('plan', index, 1) }}
            onChange={(next) => { toggleHidden('hiddenPlans', provider.provider, next) }}
          />
        ))}
      </section>
  )
}

/**
 * The spend-currency settings: the global total currency, its rate, and each
 * provider's own choice. Rendered on the Usage tab only.
 */
export function CurrencySettings(props: { card: UsageSettingsCardState; face: UsageSettingsCardFace; providers: ProviderSnapshotView[] }): ReactNode {
  const { card, face, providers } = props
  const fieldProps = {
    overriddenLabel: t('settings.overridden'),
    resetLabel: t('settings.reset'),
    disabled: !card.writable
  }
  const providerRows = providers.filter(provider => provider.credential !== 'none'
    && (provider.balance !== undefined || provider.balances !== undefined || provider.plan !== undefined || provider.quota !== undefined))
  const writeProviderCurrency = (id: string, choice: ProviderCurrency | undefined): void => {
    const next = parseProviderCurrencies(card.providerCurrency.text)
    if (choice === undefined || choice === 'native') next.delete(id)
    else next.set(id, choice)
    face.edit('providerCurrency', [...next].map(([key, value]) => key + ':' + value).join(','))
  }
  return (
    <div className={styles.card} data-dsh-part="currency-settings">
      <span className={styles.cardTitle}>{t('usage.config.currencyTitle')}</span>
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
      {providerRows.length > 0 && (
        <>
          <span className={styles.settingsSubhead}>{t('usage.config.providerCurrencies')}</span>
          <p className={styles.settingsGroupHint}>{t('usage.config.providerCurrenciesHint')}</p>
          {providerRows.map(provider => {
            const current = parseProviderCurrencies(card.providerCurrency.text).get(provider.provider) ?? 'native'
            return (
              <div key={provider.provider} className={styles.currencyRow}>
                <span className={styles.currencyName}>{provider.displayName}</span>
                <span className={styles.currencyChoices} role="group" aria-label={provider.displayName}>
                  {([['native', t('usage.currency.native')], ['CNY', 'CNY'], ['USD', 'USD'], ['both', t('usage.currency.both')]] as const).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      className={styles.currencyChoice}
                      data-active={current === value ? '' : undefined}
                      disabled={!card.writable}
                      onClick={() => { writeProviderCurrency(provider.provider, value) }}
                    >{label}</button>
                  ))}
                  {current !== 'native' && (
                    <button
                      type="button"
                      className={styles.currencyReset}
                      disabled={!card.writable}
                      onClick={() => { writeProviderCurrency(provider.provider, undefined) }}
                    >{t('settings.reset')}</button>
                  )}
                </span>
              </div>
            )
          })}
        </>
      )}
    </div>
  )
}

/** Split a comma-separated hidden-provider list into a set. */
function splitHidden(text: string): Set<string> {
  return new Set(text.split(',').map(entry => entry.trim()).filter(entry => entry !== ''))
}
