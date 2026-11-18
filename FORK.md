# LegifyX fork of `@linxin666/dsh-usage`

Drop-in fork of the DSH usage-statistics plugin. The package name is
intentionally unchanged so the `@linxin666/dsh-web-all` bundle patch still
resolves `@linxin666/dsh-usage` — the profile points that name at this fork
instead of the registry copy.

Upstream: `@linxin666/dsh-usage@0.4.15` (Apache-2.0), published from
`zhu1090093659/dsh-web` at `packages/dsh-usage`. That repository is a ~1.5 GB
monorepo holding every DSH web plugin, so this fork is a **standalone repo**
rather than a GitHub fork of the monorepo: a monorepo fork would clone 1.5 GB
to carry 14 changed files and would make every upstream release a merge across
unrelated packages.

## Syncing with upstream

The upstream package lives at `packages/dsh-usage` inside that monorepo, so
`git merge upstream/dev` would pull in the whole workspace. Use a sparse
checkout of just that package instead:

```bash
# one-time: fetch only the package directory
git remote add upstream https://github.com/zhu1090093659/dsh-web.git   # already set
git fetch --no-tags --depth=1 upstream dev
git sparse-checkout init --cone
git sparse-checkout set packages/dsh-usage
git -c core.sparseCheckout=true checkout upstream/dev -- packages/dsh-usage
```

Then compare `packages/dsh-usage` against this repo and port the upstream
changes into the four modified areas listed above. `git log --oneline
upstream/dev -- packages/dsh-usage` shows the upstream commits that touched the
package.

The alternative is the published tarball, which is exactly what the fork was
cut from:

```bash
npm pack @linxin666/dsh-usage@0.4.18
tar -xzf linxin666-dsh-usage-0.4.18.tgz   # package/ holds lib, src, locale
```

Diff that against this tree. The tarball carries `src/` and `lib/` but not the
upstream `tests/` or `tsconfig` files.

Current state: this fork is based on **0.4.15**; npm is at **0.4.18**. The
three intervening releases have not been reviewed.

## What this fork changes

Four changes, all visible in the Usage card and the sidebar glance card:

1. **Signed-in account balance.** `deepseek-account` is a `familyOnly` route
   upstream: it is excluded from balance probing because `/user/balance` reads
   the API-key account, which may differ from the signed-in one (upstream issue
   #1772). The fork reads the harness account service instead
   (`deepseekAccount.getBalance`) on every poll and records the row as
   `credential: 'oauth'`, so a signed-in DeepSeek account finally shows its
   money.

2. **Every wallet currency.** The account reports one wallet per currency, and
   CNY cannot be converted into USD here. `ProviderSnapshotView` gains
   `balances?: BalanceView[]`; `balance` stays the primary (CNY when held) for
   the observed-spend watch, while the cards render every currency:
   `¥12.34 · $1.50`.

3. **Always-on peak marker.** The sidebar card used to compute the DeepSeek
   peak/off-peak clock only when the day's top-spend route belonged to the
   DeepSeek family, so the marker disappeared on empty days and other routes.
   The fork computes it unconditionally; the Usage page already did.

4. **deeprelay subscription meters.** `deeprelay` is a flat-plan provider
   whose quota is metered as four weighted-token windows (monthly input,
   monthly output, rolling 7-day input, rolling 7-day output), which the
   upstream `PlanView` percent-per-window shape cannot carry. The fork adds a
   `quota` probe half to the adapter contract and a `DEEPRELAY` adapter that
   reads `GET /v1/billing/subscription` with the route's own credential, so
   the Usage tab shows a card with one full-width blue (input) and orange
   (output) bar per window, the used/limit pair beside each, and the reset
   date for the month. Numbers are the server's weighted counters — they
   already include each model's usage factor, which the local ledger cannot
   reconstruct. The route is origin-gated like the balance half, so a
   different host that merely shares the `deeprelay` route id is not read.
   The sidebar glance card also carries the rolling 7-day pair as two compact
   meter rows under the balance line, so the plan's weekly headroom is visible
   without opening the panel.

5. **Provider spend caps.** Not every provider meters tokens: AMD Cloud
   enforces a daily USD cost ceiling, numes exposes an OpenRouter-style key with
   a USD limit (0 = uncapped), and refuseless publishes a USD wallet. The fork
   adds a `spend` probe half for money-over-a-window facts and a "Provider
   limits" card on the Usage tab, plus a balance adapter for refuseless. A cap
   of 0 renders as "unlimited" rather than a full bar. NVIDIA, the local
   llama.cpp server and the LAN Open WebUI instance expose no usage endpoint,
   so they stay unprobed.

6. **Usage-endpoint discovery.** A provider with no hand-written adapter is
   probed once against its own base URL for known shapes (`/usage` for AMD's
   daily cap, `/key` for OpenRouter-style limits, `/credits` for a wallet).
   Only JSON with expected fields is accepted and redirects are refused, so an
   HTML app answering every path is rejected. The winning shape is cached in
   `$DSH_HOME/dsh-usage/provider-probes.json`; normal polls reuse it. A failed
   discovery is retried after a week, and the Usage header's **Re-scan limits**
   button clears the cache and re-probes now.

7. **Sidebar-card composition.** The Usage settings page gains a *Sidebar card*
   group: one pill switch per row (spend headline, tokens/calls, balances, plan
   meters, peak clock, updated time), a meter-window choice (rolling 7 days or
   the month), and a compact-spacing switch. Every field defaults to the
   original card, so an existing profile looks unchanged.

8. **Per-provider cards and one plan concept.** A *Cards* group on the Usage
   settings page lists every configured provider that reports a balance and
   every provider that reports a plan, each with its own switch. Hiding is a
   comma-separated provider list (`hiddenBalances`, `hiddenPlans`) that defaults
   to empty, so a provider discovered later is visible without a schema change.
   A plan now means either fact: the DeepSeek billing windows (`plan`) or a
   deeprelay-style token quota (`quota`). The Plans tab renders both kinds, and
   the deeprelay meter card moved there from the Usage tab. The sidebar's
   balances line and plan block follow the same switches.

9. **A Sidebar tab, one row per card, reader-chosen order.** The Usage page
   gains a fourth *Sidebar* tab holding a live copy of the seated card and every
   sidebar-card switch (they no longer repeat under the other tabs). Balances
   and plans each render on their own row instead of being joined into one
   line, and the Cards group gives every provider a move-up/move-down pair
   (`balanceOrder`, `planOrder`), so the reader sets the order once and both the
   page cards and the sidebar follow it.

10. **Cards live on the Sidebar tab.** The per-provider visibility and order
    group moved out of the shared settings rows into the Sidebar tab, next to
    the widget preview and its switches. Only the general rows (poll interval,
    currency) stay visible under every tab.

11. **Per-provider spend currency and a USD price book.** Each provider with a
    wallet or plan gets a Native / CNY / USD / Both choice
    (`providerCurrency`), applied to its own spend rows; the total keeps one
    global currency because mixed currencies cannot be summed. USD spend is
    priced from a separate USD book stored as `costUsd` per ledger row, not
    divided from CNY; rows recorded before the book fall back to conversion.

12. **Currency settings live on the Usage tab.** The global display currency,
    its rate, and the per-provider choices moved out of the shared settings
    rows into a Currency card on the Usage tab, so they no longer repeat under
    Plans, Token Bank and Sidebar. Choosing
    Native drops the per-provider override instead of storing a redundant entry.
    Each provider's choices render as one inline row (label, then compressed
    buttons) so the fourth option cannot wrap onto its own line. Poll interval
    moved into the Sidebar tab too, so no shared settings row is left: every
    control belongs to exactly one tab.

13. **Standalone package, Token Bank removed.** The package is now
    `@legifyx/dsh-usage` (its own row, `dsh-usage`) instead of a fork that
    re-pointed the bundle's `web-ui-usage` row, so it can be installed next to
    the dsh-web bundle once that row is disabled. The Token Bank tab, its
    voucher artwork (a 300 KB inline JPEG), the whale-yuan drawing module and
    the host-side observed-spend watch were removed; the usage page is now
    Usage / Plans / Sidebar. The client bundle shrank from ~538 KB to ~223 KB.
    A package rename changes the client module id, which DSH resolves at boot:
    restart the host once after switching names.

## Install

```powershell
powershell -File scripts/install.ps1            # desktop profile
powershell -File scripts/install.ps1 -Profile web
```

The script mirrors this checkout to `<profile>/plugins/dsh-usage`, links
`node_modules/@linxin666/dsh-usage` at it, and declares
`"@linxin666/dsh-usage": "link:./plugins/dsh-usage"` in the profile manifest.
That manifest entry is what survives `pnpm install`: any plugin install
re-creates the link instead of restoring the registry copy. Restart DSH for the
host half and refresh the page for the client half.

`scripts/uninstall.ps1` removes the link, the deploy, and the manifest entry.

**Why the deploy lives inside the profile.** DSH resolves a plugin's own imports
(`@deepseek-ai/cordis`, `@deepseek-ai/schemastery`) through a profile-scoped
resolver that only routes requests made from packages physically inside the
profile. A link to a checkout elsewhere makes `lib/index.js` fail to import with
`ERR_MODULE_NOT_FOUND`, and the host row goes inactive - the usage page and
sidebar card disappear. Re-run `install.ps1` after editing the checkout: the
deployed copy is what runs.

## Local fork additions outside the four changes

Two more changes ship here that are specific to this machine's setup:

- **LAN trust for the host routes.** `src/host/loopback.ts` gains
  `isTrustedLanRequest`, and `src/host/pair-access.ts` admits it, so the usage
  page works over a LAN address without pairing. A forwarded request never
  qualifies.
- **deeprelay 7-day meters in the sidebar card.** The compact glance card shows
  the rolling-7-day input/output pair under the balance line.

## Rebuilding `lib/`

`lib/` is hand-patched in step with `src/`; there is no build toolchain in the
shipped package. Keep the two in sync, or rebuild from upstream sources with
their own `pnpm build` and re-apply the changes above.
