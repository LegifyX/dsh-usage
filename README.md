# dsh-usage · Usage Statistics for DeepSeek Harness

English | [中文](README.zh.md)

> **Standalone usage plugin for DeepSeek Harness (DSH).** Published as
> `@legifyx/dsh-usage`, a fork of `@linxin666/dsh-usage` (Apache-2.0) with the
> Token Bank removed and per-provider currencies, provider ordering and usage
> discovery added. It can be installed next to the `dsh-web` bundle once that
> bundle's own usage row is disabled. See [CHANGELOG.md](CHANGELOG.md) for the
> changes since upstream.

<p align="center">
  <img src="https://img.shields.io/badge/DSH-%3E%3D0.2.2--rc.1-4c6ef5?style=flat-square&amp;labelColor=454a54" alt="DSH">
  &nbsp;
  <img src="https://img.shields.io/badge/license-Apache--2.0-blue?style=flat-square" alt="License">
</p>

## Install (standalone)

1. Add the package to the profile (e.g. `~/.dsh/profiles/web/package.json`):

   ```json
   { "dependencies": { "@legifyx/dsh-usage": "github:LegifyX/dsh-usage" } }
   ```

   A local checkout can use `"link:./plugins/dsh-usage"` instead.

2. If the `dsh-web` bundle is installed, disable its own usage row so the page
   mounts once:

   ```yaml
   - id: web-ui-usage
     disabled: true
   ```

3. Insert the standalone row:

   ```yaml
   - insert:
       - id: dsh-usage
         name: '@legifyx/dsh-usage'
   ```

4. Restart the host once. DSH resolves its client-module ids at boot, so a new
   package name is not served until the next start; after that, this package's
   edits hot-reload like any other plugin.

No other configuration is needed: balances and plans come from the profile's
`llm-pi-ai` routes and the credentials they name.

## What it does

The plugin runs a host-side service and a page under **Settings → Web Extensions
→ Usage Statistics** (or a first-level Usage Statistics section when the Web
Extensions parent is absent), with three tabs.

**Usage**
- Today's disjoint token totals (input / output / cache read / cache write),
  the current peak/off-peak pricing period, and the estimated spend.
- A day picker for any retained day that recorded usage.
- One row per configured provider balance, every currency the account reports,
  with per-provider visibility and order.
- Provider spend caps where a provider enforces one (e.g. AMD Cloud's daily USD
  ceiling, a relay key's USD limit).
- The last 30 days as a horizontal per-provider, per-model bar chart.
- A Currency card: the display currency for totals, its rate, and a per-provider
  choice of Native / CNY / USD / Both.

**Plans**
- One card per provider that reports a subscription: plan windows (Kimi For
  Coding, OpenCode Go, Codex/ChatGPT) or token-quota meters (deeprelay), each
  with its own visibility and order.

**Sidebar**
- A live preview of the sidebar card, the poll interval, and every card switch
  (headline, tokens/calls, balances, plan meters, peak clock, updated time,
  compact spacing), plus the per-provider card visibility and order.

**Sidebar glance card**
- Today's spend as the headline (today's tokens when nothing priced is
  recorded), the tokens/calls line, one row per visible balance, one meter block
  per visible plan, the peak clock, and the last update time. The whole card
  opens the Usage page; the chevron collapses it to a one-line strip.

Probing runs host-side on a poll cycle (default 60 s, plus **Refresh** and
**Re-scan limits**). API keys resolve through the harness credential seam
(`llm-pi-ai` records, `apiKeyEnv` references) and never reach the browser.

### Supported plans

A provider is probed only after its adapter knows the endpoint shape, so this is
the complete list. Anything else stays unprobed.

| Plan | Endpoint | Windows |
| --- | --- | --- |
| Codex / ChatGPT subscription | OAuth grant, ChatGPT backend | 5-hour, week |
| deeprelay | `GET /v1/billing/subscription` | month (weighted input/output), rolling 7-day (weighted input/output), reset date |
| GLM Coding Plan (CN / intl) | `GET /api/monitor/usage/quota/limit` on open.bigmodel.cn or api.z.ai | 5-hour, week, month |
| Kimi For Coding | `GET /coding/v1/usages` on api.kimi.com | 5-hour, week |
| MiniMax Coding Plan (CN / intl) | `GET /v1/api/openplatform/coding_plan/remains` | 5-hour, week |
| OpenCode Go | `GET /zen/go/v1/usage` on opencode.ai | rolling, week, month |

Plan endpoints differ in shape and access, and we cannot see another account's
plan data. If you want a plan added, open an issue or a pull request with a
redacted sample response from your provider's endpoint plus the route id; a new
plan is one adapter entry, but it can only be built from an endpoint we can
observe.

## Providers

Built-in adapters, matched by provider route id and origin:

| Kind | Providers |
| --- | --- |
| Balance | DeepSeek account (CNY + USD), Moonshot (CN/intl), OpenRouter, SiliconFlow (CN/intl), ZenMux, refuseless |
| Plan windows | Kimi For Coding, GLM Coding Plan (CN/intl), MiniMax Coding Plan (CN/intl), OpenCode Go, Codex / ChatGPT subscription (OAuth grant) |
| Plan quota | deeprelay plans: plan name/price, monthly + rolling 7-day weighted input/output, reset date |
| Spend cap | AMD Cloud (`/v1/usage`: daily USD ceiling), numes (key limit) |

**Discovery.** A configured provider with no hand-written adapter is probed once
against its own base URL for known shapes: `/usage` (daily cost cap), `/key`
(OpenRouter-style key), `/credits` (wallet). Only JSON with expected fields is
accepted and redirects are refused, so an HTML app answering every path is
rejected. The winning shape is cached in `provider-probes.json` and reused;
failures are retried after a week, and **Re-scan limits** clears the cache.
Providers with no programmatic endpoint (e.g. NVIDIA, a local llama.cpp server,
a LAN Open WebUI) simply stay unprobed.

## Configuration

| Key | Default | Meaning |
| --- | --- | --- |
| `enabled` | `true` | Master switch; off = no listeners, probes or routes |
| `pollIntervalSec` | `60` | Probe cycle in seconds (30-3600) |
| `retainDays` | `180` | Ledger retention in local days (7-730) |
| `spendCurrency` | `CNY` | Currency for total spend figures (`CNY` / `USD`) |
| `cnyPerUsd` | `7.2` | Rate used when displaying CNY-priced spend in USD |
| `providerCurrency` | `''` | Per-provider spend currency (`provider:choice,...`) |
| `footShowSpend` | `true` | Sidebar headline row |
| `footShowUsage` | `true` | Sidebar tokens/calls row |
| `footShowBalances` | `true` | Sidebar balance rows |
| `footShowMeters` | `true` | Sidebar plan meter blocks |
| `footMeterWindow` | `week` | Sidebar plan window (`week` / `month`) |
| `footShowPeak` | `true` | Sidebar peak clock |
| `footShowUpdated` | `true` | Sidebar update time |
| `footCompact` | `false` | Tighter sidebar spacing |
| `hiddenBalances` | `''` | Provider ids hidden from the balance card |
| `hiddenPlans` | `''` | Provider ids hidden from the Plans tab |
| `balanceOrder` | `''` | Reader-chosen balance order (provider ids) |
| `planOrder` | `''` | Reader-chosen plan order (provider ids) |

## Spend estimation

Costs are stamped at fold time from the published DeepSeek peak/off-peak price
book. Two books are kept: CNY (the ledger's stored value) and USD (`costUsd`,
priced independently, not converted). Peak windows are Beijing-time weekday
09:00-12:00 and 14:00-18:00; the published Chinese public-holiday table marks
holiday weekdays off-peak. Only the official DeepSeek family is priced; relay
traffic stays unpriced (`0`), and unknown DeepSeek model ids take the
flash-class row. A price-book change applies from the moment it ships, not
retroactively.

## Data files

Under `$DSH_HOME/dsh-usage/`:

| File | Contents |
| --- | --- |
| `usage-ledger.json` | Per day / provider / model token totals and costs |
| `provider-snapshots.json` | Last successful balance, plan, quota and spend facts |
| `provider-probes.json` | Discovery results for adapter-less providers |

## HTTP API

All routes are fenced to loopback, the LAN with same-origin markers, or a paired
remote session:

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/dsh-usage/overview` | Full overview document |
| GET | `/api/dsh-usage/day?date=YYYY-MM-DD` | One retained day |
| POST | `/api/dsh-usage/refresh` | Force a probe cycle |
| POST | `/api/dsh-usage/rescan` | Clear discovery cache and re-probe |

## Limitations

- Counting starts when the plugin is first enabled; historical sessions are not
  backfilled.
- OAuth-based routes are detected but not probed; the plugin does not spend
  third-party OAuth budgets.
- A failed probe keeps the previous fact visible and reports the error line.
- The Plans tab shows only providers that report an entitled subscription with
  at least one positive token limit; a free or expired plan shows nothing.
- Discovery can only report what a provider exposes; providers without a usage
  endpoint stay unprobed.
- Day pickers list only days the ledger recorded usage on.

## Attribution

Forked from `@linxin666/dsh-usage` (upstream: `zhu1090093659/dsh-web`,
`packages/dsh-usage`) under Apache-2.0. See [LICENSE](LICENSE).
