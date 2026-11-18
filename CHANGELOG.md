# Changelog

Changes in this standalone package relative to upstream
`@linxin666/dsh-usage` (from `zhu1090093659/dsh-web`).

## 0.5.0

### Standalone packaging

- Renamed to `@legifyx/dsh-usage` with its own profile row (`dsh-usage`),
  instead of re-pointing the `dsh-web` bundle's `web-ui-usage` row. The bundled
  row must be disabled when both are installed.
- Emitted type declarations regenerated from source; stale declarations for
  removed modules dropped.
- Install notes moved into the README, including the one-time host restart a
  package rename requires (client module ids resolve at boot).

### Removed

- **Token Bank tab** and its day picker.
- **Voucher renderer** (`voucher.ts`) and its 300 KB inline JPEG artwork.
- **Observed-spend watch** on the host (`SpendWatch`, `accrueDeepSeekSpend`)
  and the `observedSpend` field it published, which only fed the voucher.
- Related locales, CSS, types and test fixtures.

The client bundle shrank from ~538 KB to ~223 KB, and the page is now
Usage / Plans / Sidebar.

### Added

- **deeprelay plan meters** (the fork's original feature): plan name and
  price, monthly and rolling 7-day weighted input/output meters, and the reset
  date, read from `/v1/billing/subscription` with the route's own credential.
- **Per-provider spend currency**: Native / CNY / USD / Both per provider,
  with a separate USD price book (`costUsd`) instead of dividing CNY.
- **Usage-endpoint discovery** for providers without a hand-written adapter:
  one probe against the route's own origin (`/usage`, `/key`, `/credits`),
  strict JSON validation, redirects refused, cached in `provider-probes.json`,
  with a **Re-scan limits** button.
- **Provider limits card** for money-over-window caps (AMD Cloud daily ceiling,
  numes key limit).
- **Per-provider cards**: visibility switches and up/down ordering for
  balances and plans, shared by the page and the sidebar.
- **Sidebar tab** with a live card preview and every sidebar-card switch, and
  one row per balance / per plan in the sidebar card.
- **24-hour clock** for the sidebar and peak labels, following the DSH locale.

### Changed

- A plan is one concept: billing windows (`plan`) and token quotas (`quota`)
  render together on the Plans tab; the deeprelay meter card moved there.
- Balance, plan, quota and spend probes are per provider, with per-fact error
  slots so one failing fact does not mask another.
- Settings are grouped by tab: Currency on Usage, cards and poll interval on
  Sidebar.
- LAN requests with same-origin markers are trusted for the host routes.

## 0.4.15

Initial fork base: upstream `@linxin666/dsh-usage` 0.4.15.
