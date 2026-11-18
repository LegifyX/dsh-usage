/**
 * The usage page's card chrome: the family settings card whose header holds
 * the plugin switch, and the display rows the body closes with.
 * @module @legifyx/dsh-usage/client/UsagePage
 */
import type { ReactNode } from 'react';
import { type UsageSettingsCardFace, type UsageSettingsCardState } from './usage-settings-card.ts';
import type { ProviderSnapshotView } from '../core/types.ts';
/**
 * The page's card: the plugin switch in the header, the statistics and the
 * display rows in the body. A switched-off plugin keeps only the header, whose
 * line says how to bring it back; a refused write keeps the body, so the
 * failure line under the rows stays readable.
 */
export declare function UsagePage(props: {
    card: UsageSettingsCardState;
    face: UsageSettingsCardFace;
    enabled: boolean;
    providers?: ProviderSnapshotView[];
    children: ReactNode;
}): ReactNode;
/**
 * Every sidebar-card setting, rendered by the Sidebar tab. Kept out of the
 * shared settings rows so the group does not repeat under all four tabs.
 */
export declare function SidebarCardSettings(props: {
    card: UsageSettingsCardState;
    face: UsageSettingsCardFace;
}): ReactNode;
/**
 * Provider visibility and order for both the page cards and the sidebar. It
 * lives on the Sidebar tab so the group does not repeat under every tab.
 */
export declare function CardVisibilitySettings(props: {
    card: UsageSettingsCardState;
    face: UsageSettingsCardFace;
    providers: ProviderSnapshotView[];
}): ReactNode;
/**
 * The spend-currency settings: the global total currency, its rate, and each
 * provider's own choice. Rendered on the Usage tab only.
 */
export declare function CurrencySettings(props: {
    card: UsageSettingsCardState;
    face: UsageSettingsCardFace;
    providers: ProviderSnapshotView[];
}): ReactNode;
