/**
 * Sidebar foot card: the compact usage glance seated below the shell sidebar's
 * Settings row. It is deliberately a GLANCE, not the panel the 2026-09-18
 * removal took out. Two states, persisted across reloads:
 *
 * - expanded (default): a price-first headline (today's estimated spend,
 *   falling back to today's tokens when nothing priced was recorded), a
 *   tokens/calls line, up to two configured-provider balances, and an
 *   updated-at footer;
 * - collapsed: a one-line strip with the gauge glyph, the spending
 *   provider's name, the label and the headline value.
 *
 * The card body is one button that opens the settings panel on the usage
 * section, so detail lives in exactly one place; the corner chevron toggles
 * the collapse state (sibling buttons — buttons inside a button are invalid
 * HTML).
 *
 * Data comes from the same shared store the settings section reads; the card
 * runs its own relaxed poll loop (30 s, visible-tab only) because the sidebar
 * foot is permanently mounted. The card disappears while the plugin is
 * disabled (settings flag) or while the host serves no usage routes (a 404
 * means the host half is off), matching the section's own gating.
 * @module @legifyx/dsh-usage/client/UsageFootCard
 */

import { useEffect, useState, useSyncExternalStore, type ReactNode } from 'react'
import type { ConfigForm } from '@deepseek-ai/dsh-client-ui-settings/client'
import { t } from './locales.ts'
import { orderByList } from './order.ts'
import styles from './usage.module.css'
import { formatClock, PeakBadge } from './PeakBadge.tsx'
import { formatTokens, type UsageSettings } from './UsageSectionCard.tsx'
import { deepseekPeriodAt } from '../core/pricing.ts'
import { isDeepSeekProviderRoute } from '../core/adapters.ts'
import { totalTokens } from '../core/ledger.ts'
import { formatSpend } from '../core/spend.ts'
import type { BalanceView, ProviderSnapshotView, QuotaMeterView, UsageOverviewView } from '../core/types.ts'
import type { UsageStoreInstance } from './usage-store.ts'

/** Props the mount forwards into the React tree. */
export interface UsageFootCardProps {
  /** The shared overview store (section and card read the same snapshot). */
  store: UsageStoreInstance
  /** Fetch one overview now. */
  poll: () => void
  /** Card-body click: open the settings panel on the usage section. */
  onOpen: () => void
  /** The shared settings form; the card hides while the plugin is disabled. */
  settings: ConfigForm<UsageSettings>
  /** Locale-change source; the plain copy re-renders on a language switch. */
  locale?: { subscribe(listener: () => void): () => void }
}

/** Poll cadence of the permanently seated card; the section's 10 s loop stays its own. */
export const FOOT_CARD_POLL_MS = 30_000

/** localStorage key holding the collapsed flag ('1' = collapsed strip). */
export const FOOT_CARD_COLLAPSED_KEY = 'dsh-usage.foot-card.collapsed'

/** At most this many provider balances render before a +N overflow marker. */
const BALANCE_CAP = 2

/** Read the persisted collapsed flag (absent = expanded). */
export function readFootCardCollapsed(): boolean {
  try {
    return window.localStorage.getItem(FOOT_CARD_COLLAPSED_KEY) === '1'
  } catch {
    // Storage can be unavailable (privacy modes); the card stays expanded.
    return false
  }
}

/** Persist the collapsed flag; storage failures keep the session state. */
function writeFootCardCollapsed(collapsed: boolean): void {
  try {
    window.localStorage.setItem(FOOT_CARD_COLLAPSED_KEY, collapsed ? '1' : '0')
  } catch {
    // Storage unavailable: the state still flips for this session.
  }
}

/** Inline gauge glyph, 14px beside the card title. */
function GaugeIcon(): ReactNode {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2.5 12.5a7 7 0 0 1 11 -4.3" />
      <path d="M8 12.5V8.2l2.9-2.1" />
      <circle cx="8" cy="12.5" r="1" />
    </svg>
  )
}

/** Disclosure chevrons: down collapses the expanded card, up expands the strip. */
function ChevronIcon(props: { collapsed: boolean }): ReactNode {
  return props.collapsed
    ? (
      <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m4 10 4-4 4 4" />
      </svg>
    )
    : (
      <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m4 6 4 4 4-4" />
      </svg>
    )
}

/** A provider row worth showing a balance for: configured, with a probed balance. */
function balanceRow(provider: ProviderSnapshotView): boolean {
  const supported = provider.balanceSupported === true || (provider.balanceSupported === undefined && provider.supported)
  return provider.credential !== 'none' && supported && provider.balance !== undefined
}

/** Currency-symbol prefix for the priced balances (CNY/USD), else the ISO code. */
function formatBalance(balance: BalanceView): string {
  const currency = balance.currency.toUpperCase()
  if (currency === 'CNY') return '¥' + balance.totalBalance
  if (currency === 'USD') return '$' + balance.totalBalance
  return currency + ' ' + balance.totalBalance
}

/**
 * Route key owning today's priced spend: the day's highest cost row, else the
 * current session route (an older host without the day rows falls back to the
 * current route). Undefined when neither names one.
 */
function spendRoute(snapshot: UsageOverviewView): string | undefined {
  let top: UsageOverviewView['usage']['today']['providers'][number] | undefined
  for (const row of snapshot.usage.today.providers) {
    if (row.totals.cost <= 0) continue
    if (top === undefined || row.totals.cost > top.totals.cost) top = row
  }
  return top?.provider ?? snapshot.current.provider
}

/** Display name of the route spendRoute() names, resolved through the snapshot. */
function spendProvider(snapshot: UsageOverviewView): string | undefined {
  const route = spendRoute(snapshot)
  if (route === undefined) return undefined
  return snapshot.providers.find((entry) => entry.provider === route)?.displayName
    ?? (route === snapshot.current.provider ? snapshot.current.displayName : undefined)
    ?? route
}

/**
 * The headline triple: today's priced spend, else today's tokens, else zero.
 * tokenFallback tells the sub-line to keep only the call count instead of
 * repeating the total the headline already shows; provider names the spender
 * beside the collapsed cost headline.
 */
function headline(snapshot: UsageOverviewView): { label: string; value: string; tokenFallback: boolean; provider?: string } {
  const totals = snapshot.usage.today.totals
  if (totals.cost > 0) return { label: t('usage.foot.cost'), value: formatSpend(totals.cost, snapshot.display), tokenFallback: false, provider: spendProvider(snapshot) }
  if (totals.calls > 0) return { label: t('usage.today'), value: formatTokens(totalTokens(totals)) + ' tokens', tokenFallback: true }
  return { label: t('usage.foot.cost'), value: formatSpend(0, snapshot.display), tokenFallback: false }
}

/** The tokens/calls sub-line under the headline; a quiet no-data line on an empty day. */
function usageLine(snapshot: UsageOverviewView, tokenFallback: boolean): string {
  const totals = snapshot.usage.today.totals
  if (totals.calls === 0) return t('usage.foot.noData')
  const calls = t('usage.calls', { n: totals.calls })
  return tokenFallback ? calls : formatTokens(totalTokens(totals)) + ' tokens · ' + calls
}

/** One row per visible balance, in the reader's order. */
function balanceRows(snapshot: UsageOverviewView, hidden: Set<string>, order: string): { id: string; text: string }[] {
  return orderByList(snapshot.providers.filter(balanceRow).filter((provider) => !hidden.has(provider.provider)), order)
    .map((provider) => {
      // Every wallet currency rides on one row: an account can hold both CNY
      // and USD, and dropping either would understate what is spendable.
      const balances = provider.balances ?? (provider.balance !== undefined ? [provider.balance] : [])
      return { id: provider.provider, text: provider.displayName + ' ' + balances.map(formatBalance).join(' / ') }
    })
}

/** Card chrome classes for the current collapse state. */
function cardClass(collapsed: boolean): string {
  return collapsed ? styles.footCard + ' ' + styles.footCardCollapsed : styles.footCard
}

/** One block per visible plan that reports the chosen window. */
function planMeters(snapshot: UsageOverviewView, window: 'week' | 'month', hidden: Set<string>, order: string): { id: string; name: string; meter: QuotaMeterView }[] {
  return orderByList(snapshot.providers.filter((provider) => !hidden.has(provider.provider)), order)
    .flatMap((provider) => {
      const meter = provider.quota?.meters.find((entry) => entry.key === window)
      return meter === undefined ? [] : [{ id: provider.provider, name: provider.displayName, meter }]
    })
}

/** One compact plan meter: label, track and used/limit with the percentage. */
function FootMeterRow(props: { kind: 'in' | 'out'; used: number; limit: number }): ReactNode {
  const { kind, used, limit } = props
  const percent = limit > 0 ? Math.max(0, Math.min(100, (used / limit) * 100)) : undefined
  const label = percent === undefined ? '' : percent >= 10 ? `${Math.round(percent)}%` : `${percent.toFixed(1)}%`
  return (
    <span className={styles.footMeter} data-dsh-meter={kind}>
      <span className={styles.footMeterKey}>{t(`usage.quota.${kind}`)}</span>
      <span className={styles.footMeterTrack}>
        <span
          className={kind === 'in' ? styles.quotaIn : styles.quotaOut}
          style={{ width: `${percent ?? 0}%`, display: 'block' }}
        />
      </span>
      <span className={styles.footMeterValue}>{formatTokens(used)}/{formatTokens(limit)} · {label}</span>
    </span>
  )
}

/** The plain settings values the preview reads (the card state's text form). */
export interface FootCardValues {
  footShowSpend?: boolean
  footShowUsage?: boolean
  footShowBalances?: boolean
  footShowMeters?: boolean
  footMeterWindow?: 'week' | 'month'
  footShowPeak?: boolean
  footShowUpdated?: boolean
  footCompact?: boolean
  hiddenBalances?: string
  hiddenPlans?: string
  balanceOrder?: string
  planOrder?: string
}

/** Split a comma-separated hidden-provider list into a set. */
function previewHidden(text: string | undefined): Set<string> {
  return new Set((text ?? '').split(',').map((entry) => entry.trim()).filter((entry) => entry !== ''))
}

/**
 * The card's rows, shared by the seated card and the Sidebar tab preview so a
 * switch cannot make the two disagree. Each balance and each plan gets its own
 * row, in the reader's order.
 */
function FootRows(props: { snapshot: UsageOverviewView; values: FootCardValues }): ReactNode {
  const { snapshot, values } = props
  const showSpend = values.footShowSpend !== false
  const showUsage = values.footShowUsage !== false
  const showBalances = values.footShowBalances !== false
  const showMeters = values.footShowMeters !== false
  const meterWindow: 'week' | 'month' = values.footMeterWindow === 'month' ? 'month' : 'week'
  const showPeak = values.footShowPeak !== false
  const showUpdated = values.footShowUpdated !== false
  const head = headline(snapshot)
  const balances = balanceRows(snapshot, previewHidden(values.hiddenBalances), values.balanceOrder ?? '')
  const plans = planMeters(snapshot, meterWindow, previewHidden(values.hiddenPlans), values.planOrder ?? '')
  const period = deepseekPeriodAt(Date.now())
  return (
    <>
      {showSpend && (
        <span className={styles.footHead}>
          <span className={styles.footTitle}><GaugeIcon />{head.label}</span>
          <span className={styles.footValue}>{head.value}</span>
        </span>
      )}
      {showUsage && <span className={styles.footLine} data-dsh-part="foot-card-usage">{usageLine(snapshot, head.tokenFallback)}</span>}
      {showBalances && balances.map((row) => (
        <span key={row.id} className={styles.footLine} data-dsh-part="foot-card-balances">{row.text}</span>
      ))}
      {showMeters && plans.map((plan) => (
        <span key={plan.id} className={styles.footPlan} data-dsh-part="foot-card-plan">
          <span className={styles.footPlanName}>{plan.name} · {meterWindow === 'month' ? t('usage.quota.month') : '7d'}</span>
          <FootMeterRow kind="in" used={plan.meter.usedInput} limit={plan.meter.limitInput} />
          <FootMeterRow kind="out" used={plan.meter.usedOutput} limit={plan.meter.limitOutput} />
        </span>
      ))}
      {(showPeak || showUpdated) && (
        <span className={styles.footFoot} data-dsh-part="foot-card-foot">
          {showPeak && <PeakBadge peak={period.peak} boundaryMs={period.boundaryMs} variant="compact" />}
          {showPeak && (
            <span className={styles.footPeakClock}>
              {t(period.peak ? 'usage.peak.ends' : 'usage.peak.starts', { time: formatClock(period.boundaryMs) })}
            </span>
          )}
          {showUpdated && (
            <span className={styles.footMeta} title={t('usage.updated', { time: formatClock(snapshot.updatedAt) })}>
              {formatClock(snapshot.updatedAt)}
            </span>
          )}
        </span>
      )}
    </>
  )
}

/**
 * A non-interactive copy of the sidebar card, rendered by the Sidebar tab so
 * the reader sees the exact rows the switches control. It never polls or
 * toggles its own collapse.
 */
export function UsageFootPreview(props: { snapshot: UsageOverviewView; values: FootCardValues }): ReactNode {
  const { snapshot, values } = props
  const compact = values.footCompact === true
  return (
    <div className={styles.footCard} data-dsh-part="foot-preview-card">
      <div className={compact ? `${styles.footMain} ${styles.footMainCompact}` : styles.footMain}>
        <FootRows snapshot={snapshot} values={values} />
      </div>
    </div>
  )
}

/**
 * Render the foot card content for the current store snapshot.
 * @param props - store, poller, settings form and open callback from the mount.
 * @returns the card, or null while disabled / host-off.
 */
export function UsageFootCard(props: UsageFootCardProps): ReactNode {
  const { store, poll, onOpen, settings, locale } = props
  const ui = useSyncExternalStore(store.subscribe, store.getSnapshot)
  // Settings writes and locale switches both re-render the card's copy/visibility.
  const [, bump] = useState(0)
  useEffect(() => settings.subscribe(() => bump((count) => count + 1)), [settings])
  useEffect(() => locale?.subscribe(() => bump((count) => count + 1)), [locale])
  const values = settings.getSnapshot().value
  const enabled = values?.enabled ?? true
  const compact = values?.footCompact === true
  const footValues: FootCardValues = {
    footShowSpend: values?.footShowSpend,
    footShowUsage: values?.footShowUsage,
    footShowBalances: values?.footShowBalances,
    footShowMeters: values?.footShowMeters,
    footMeterWindow: values?.footMeterWindow,
    footShowPeak: values?.footShowPeak,
    footShowUpdated: values?.footShowUpdated,
    hiddenBalances: values?.hiddenBalances,
    hiddenPlans: values?.hiddenPlans,
    balanceOrder: values?.balanceOrder,
    planOrder: values?.planOrder,
  }

  // The collapse choice is one localStorage flag, read at mount and persisted
  // on every flip (the old sidebar strip used the same contract shape).
  const [collapsed, setCollapsed] = useState(readFootCardCollapsed)
  const toggleCollapsed = (): void => {
    setCollapsed((current) => {
      writeFootCardCollapsed(!current)
      return !current
    })
  }

  // The permanently seated card pays a relaxed cadence; a hidden tab pauses.
  useEffect(() => {
    if (!enabled) return undefined
    poll()
    let timer: number | undefined
    const start = (): void => {
      if (timer === undefined && document.visibilityState === 'visible') timer = window.setInterval(poll, FOOT_CARD_POLL_MS)
    }
    const onVisibility = (): void => {
      if (document.visibilityState === 'visible') {
        poll()
        start()
      } else if (timer !== undefined) {
        window.clearInterval(timer)
        timer = undefined
      }
    }
    start()
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      if (timer !== undefined) window.clearInterval(timer)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [poll, enabled])

  if (!enabled) return null
  const snapshot = ui.snapshot
  // A 404 means the host half serves no usage routes (plugin off): the card
  // bows out instead of pinning a permanent error to the sidebar foot.
  if (snapshot === null && ui.status === 'error' && /failed: 404/.test(ui.error ?? '')) return null

  const toggle = (
    <button
      type="button"
      className={styles.footToggle}
      data-dsh-part="foot-card-toggle"
      aria-label={t(collapsed ? 'usage.foot.expand' : 'usage.foot.collapse')}
      title={t(collapsed ? 'usage.foot.expand' : 'usage.foot.collapse')}
      onClick={toggleCollapsed}
    >
      <ChevronIcon collapsed={collapsed} />
    </button>
  )

  if (snapshot === null) {
    const quiet = ui.status === 'error' ? t('usage.error', { error: ui.error ?? '' }) : t('usage.loading')
    return (
      <div className={cardClass(collapsed)} data-dsh-plugin="usage" data-dsh-part="foot-card">
        <button type="button" className={styles.footMain} data-dsh-part="foot-card-main" aria-label={t('usage.foot.open')} title={t('usage.foot.open')} onClick={onOpen}>
          {collapsed
            ? <span className={styles.footStrip} data-dsh-part="foot-card-strip"><GaugeIcon /><span className={styles.footStripValue}>—</span></span>
            : (
              <>
                <span className={styles.footHead}>
                  <span className={styles.footTitle}><GaugeIcon />{t('usage.title')}</span>
                </span>
                <span className={styles.footLine}>{quiet}</span>
              </>
            )}
        </button>
        {toggle}
      </div>
    )
  }

  const head = headline(snapshot)
  // The published peak/off-peak clock is always in force, so the card carries
  // it on every route and on empty days instead of only when the day's spend
  // happened to run through the official family.
  const period = deepseekPeriodAt(Date.now())

  if (collapsed) {
    return (
      <div className={cardClass(true)} data-dsh-plugin="usage" data-dsh-part="foot-card">
        <button type="button" className={styles.footMain} data-dsh-part="foot-card-main" aria-label={t('usage.foot.open')} title={t('usage.foot.open')} onClick={onOpen}>
          <span className={styles.footStrip} data-dsh-part="foot-card-strip">
            <GaugeIcon />
            {head.provider !== undefined && <span className={styles.footStripProvider}>{head.provider}</span>}
            {period !== undefined && <PeakBadge peak={period.peak} boundaryMs={period.boundaryMs} variant="compact" />}
            <span className={styles.footStripLabel}>{head.label}</span>
            <span className={styles.footStripValue}>{head.value}</span>
          </span>
        </button>
        {toggle}
      </div>
    )
  }

  return (
    <div className={cardClass(false)} data-dsh-plugin="usage" data-dsh-part="foot-card">
      <button type="button" className={compact ? `${styles.footMain} ${styles.footMainCompact}` : styles.footMain} data-dsh-part="foot-card-main" aria-label={t('usage.foot.open')} title={t('usage.foot.open')} onClick={onOpen}>
        <FootRows snapshot={snapshot} values={footValues} />
      </button>
      {toggle}
    </div>
  )
}
