# LegifyX fork of `@linxin666/dsh-usage`

Drop-in fork of the DSH usage-statistics plugin. The package name is
intentionally unchanged so the `@linxin666/dsh-web-all` bundle patch still
resolves `@linxin666/dsh-usage` — the profile just points that name at this
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
   `¥12.34 · $1.50`.

3. **Always-on peak marker.** The sidebar card used to compute the DeepSeek
   peak/off-peak clock only when the day's top-spend route belonged to the
   DeepSeek family, so the marker disappeared on empty days and other routes.
   The fork computes it unconditionally; the Usage page already did.

## Install

```powershell
powershell -File scripts/install.ps1            # desktop profile
powershell -File scripts/install.ps1 -Profile web
```

The script renames the directory that was installed before the link to
`dsh-usage.stock` and replaces it with a junction to this checkout. Restart DSH
for the host half and refresh the page for the client half.

`scripts/uninstall.ps1` renames that previous copy back.

## Upgrading upstream

`dsh plugin add` / `pnpm install` will restore the registry copy and drop the
junction (that is why `node_modules` is not committed). Re-apply the fork with
`scripts/install.ps1`, then port any upstream change to the three areas above:
`src/core/types.ts` (`balances`), `src/host/usage-service.ts`
(`probeAccountBalance`, the `overview()` projection), and the two client
renderers (`UsageSectionCard.tsx` / `UsageFootCard.tsx`).

`lib/` is hand-patched in step with `src/`; there is no build toolchain in the
shipped package. Keep the two in sync or rebuild the package from upstream
sources with its own `pnpm build`.
