# LegifyX fork of `@linxin666/dsh-usage`

Drop-in fork of the DSH usage-statistics plugin. The package name is
intentionally unchanged so the `@linxin666/dsh-web-all` bundle patch still
resolves `@linxin666/dsh-usage` â€” the profile just points that name at this
directory instead of the registry copy.

Upstream: `@linxin666/dsh-usage@0.4.15` (Apache-2.0).

## What this fork changes

Three changes, all visible in the Usage card and the sidebar glance card:

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
   `Â¥12.34 Â· $1.50`.

3. **Always-on peak marker.** The sidebar card used to compute the DeepSeek
   peak/off-peak clock only when the day's top-spend route belonged to the
   DeepSeek family, so the marker disappeared on empty days and other routes.
   The fork computes it unconditionally; the Usage page already did.

## Install

```powershell
powershell -File scripts/install.ps1            # desktop profile
powershell -File scripts/install.ps1 -Profile web
```

The script parks the copy that was installed before the deploy as
`dsh-usage.stock` and mirrors this checkout over the package directory. Restart
DSH for the host half and refresh the page for the client half.

`scripts/uninstall.ps1` restores that previous copy.

**Why a copy and not a symlink/junction.** DSH resolves a plugin's own imports
(`@deepseek-ai/cordis`, `@deepseek-ai/schemastery`) through a profile-scoped
resolver that only routes requests made from packages physically inside the
profile. A junction to a checkout elsewhere makes `lib/index.js` fail to import
with `ERR_MODULE_NOT_FOUND`, and the host row goes inactive â€” the usage page and
sidebar card disappear. Re-run `install.ps1` after editing the checkout: the
deployed copy is what runs.

## Upgrading upstream

`dsh plugin add` / `pnpm install` restores the registry copy, overwriting the
deployed one. Re-apply the fork with `scripts/install.ps1`, then port any
upstream change to the three areas above:
`src/core/types.ts` (`balances`), `src/host/usage-service.ts`
(`probeAccountBalance`, the `overview()` projection), and the two client
renderers (`UsageSectionCard.tsx` / `UsageFootCard.tsx`).

`lib/` is hand-patched in step with `src/`; there is no build toolchain in the
shipped package. Keep the two in sync or rebuild the package from upstream
sources with its own `pnpm build`.
