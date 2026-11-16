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

/**
 * The page's card: the plugin switch in the header, the statistics and the
 * display rows in the body. A switched-off plugin keeps only the header, whose
 * line says how to bring it back; a refused write keeps the body, so the
 * failure line under the rows stays readable.
 */
export function UsagePage(props: { card: UsageSettingsCardState; face: UsageSettingsCardFace; enabled: boolean; children: ReactNode }): ReactNode {
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
        {card.exposed ? <SettingsRows card={card} face={face} /> : null}
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
 * The display rows under the statistics. Each control writes through the card
 * form: the currency pick at once, a typed number after a pause or on Enter.
 * The rate only matters while spend shows in dollars, so it appears then.
 */
function SettingsRows(props: { card: UsageSettingsCardState; face: UsageSettingsCardFace }): ReactNode {
  const { card, face } = props
  const fieldProps = {
    overriddenLabel: t('settings.overridden'),
    resetLabel: t('settings.reset'),
    invalidLabel: t('settings.invalidNumber'),
    disabled: !card.writable,
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
    </section>
  )
}
