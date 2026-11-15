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
