window.__ModuleLoader__.load({
	id: "@legifyx/dsh-usage",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let _deepseek_ai_dsh_client_store = require("@deepseek-ai/dsh-client-store");
		let react = require("react");
		let react_jsx_runtime = require("react/jsx-runtime");
		let react_dom_client = require("react-dom/client");
		//#region src/client/usage-store.ts
		/**
		* Browser-side usage store: the overview snapshot polled from the host plus
		* the fetch lifecycle. Section-local: the store lives while the settings
		* section is mounted, so polling only runs while the page is open.
		* @module @legifyx/dsh-usage/client/usage-store
		*/
		/** Create the usage store handle (apply world only; never module-level). */
		function createUsageStore() {
			return (0, _deepseek_ai_dsh_client_store.defineStore)({
				init: () => ({
					snapshot: null,
					status: "loading",
					error: null
				}),
				actions: {
					setSnapshot: (draft, snapshot) => {
						draft.snapshot = snapshot;
						draft.status = "ready";
						draft.error = null;
					},
					setState: (draft, status, error) => {
						draft.status = status;
						draft.error = error;
					}
				}
			});
		}
		//#endregion
		//#region src/client/locales.ts
		/**
		* dsh-usage locale dictionaries (zh/en). The zh dictionary is the key source;
		* `en` mirrors its full key set (packages/AGENTS.md bilingual discipline).
		* @module @legifyx/dsh-usage/client/locales
		*/
		/** Dictionary namespace this package registers. */
		const NS = "dsh-web-ui-usage";
		/** Chinese copy. */
		const zh = {
			"usage.title": "使用统计",
			"usage.tab.usage": "用量",
			"usage.tab.plans": "个人套餐",
			"usage.tab.sidebar": "侧边栏",
			"usage.sidebar.preview": "预览",
			"usage.refresh": "刷新",
			"usage.refreshing": "刷新中…",
			"usage.rescan": "重新扫描限额",
			"usage.rescanning": "扫描中…",
			"usage.updated": "更新于 {time}",
			"usage.loading": "正在读取用量…",
			"usage.error": "加载失败：{error}",
			"usage.disabled": "已停用，打开开关继续统计。",
			"usage.current": "当前",
			"usage.today": "今日用量",
			"usage.today.cost": "今日消费（估算）",
			"usage.day.label": "查看日期",
			"usage.day.today": "今日",
			"usage.day.title": "{date} 用量",
			"usage.day.cost": "当日消费（估算）",
			"usage.day.empty": "该日没有用量记录",
			"usage.day.loading": "正在加载该日用量…",
			"usage.day.error": "该日用量加载失败：{error}",
			"usage.peak.on": "DeepSeek 高峰时段：计价 ×2，{time} 结束",
			"usage.peak.off": "DeepSeek 空闲时段：计价为高峰一半，{time} 进入高峰",
			"usage.peak.tag.on": "高峰",
			"usage.peak.tag.off": "空闲",
			"usage.peak.ends": "{time} 结束",
			"usage.peak.starts": "{time} 进入高峰",
			"usage.calls": "{n} 次调用",
			"usage.tokens.total": "总 tokens",
			"usage.tokens.input": "输入",
			"usage.tokens.output": "输出",
			"usage.tokens.cacheRead": "缓存读",
			"usage.tokens.cacheWrite": "缓存写",
			"usage.trend": "近 30 天",
			"usage.noData": "还没有用量，插件启用后开始统计。",
			"usage.balance": "余额",
			"usage.balance.unsupported": "不支持查询余额",
			"usage.balance.noCredential": "未配置凭据",
			"usage.balance.noneConfigured": "还没有配置提供方",
			"usage.oauth": "OAuth 凭据，不查余额",
			"usage.plan.reset": "{date} 重置",
			"usage.plan.noPlan": "没有读到套餐数据",
			"usage.plan.noneConfigured": "没有配置套餐类提供方，例如 Kimi、GLM、OpenCode Go、MiniMax、Codex 订阅。",
			"usage.plan.windows.5h": "5 小时",
			"usage.plan.windows.week": "每周",
			"usage.plan.windows.month": "每月",
			"usage.quota.month": "每月",
			"usage.quota.week": "7 天",
			"usage.quota.in": "输入",
			"usage.quota.out": "输出",
			"usage.quota.rolling": "滚动 7 天",
			"usage.quota.hint": "按服务端计量口径统计的加权 tokens",
			"usage.spend.title": "提供方限额",
			"usage.spend.daily": "每日",
			"usage.spend.monthly": "每月",
			"usage.spend.key": "密钥",
			"usage.spend.unlimited": "不限",
			"usage.provider.error": "查询失败：{error}",
			"usage.errorListSeparator": "；",
			"usage.config.title": "设置",
			"usage.config.pollIntervalSec": "轮询间隔（秒）",
			"usage.config.spendCurrency": "货币",
			"usage.config.cnyPerUsd": "汇率",
			"usage.foot.cost": "今日消费",
			"usage.foot.noData": "今日暂无用量",
			"usage.foot.open": "打开使用统计设置",
			"usage.foot.collapse": "收起用量卡片",
			"usage.foot.expand": "展开用量卡片",
			"usage.description": "各提供方的用量、余额与套餐额度。",
			"usage.config.pollIntervalHint": "多久查一次余额与套餐。",
			"usage.config.spendCurrencyHint": "消费金额用这种货币显示。",
			"usage.config.cnyPerUsdHint": "1 美元折合多少人民币。",
			"usage.config.footTitle": "侧边栏卡片",
			"usage.config.footHint": "选择侧边栏速览卡片显示哪些行。",
			"usage.config.footShowSpend": "今日消费主数字",
			"usage.config.footShowUsage": "tokens 与调用次数",
			"usage.config.footShowBalances": "提供方余额",
			"usage.config.footShowMeters": "套餐计量条",
			"usage.config.footMeterWindow": "计量窗口",
			"usage.config.footShowPeak": "峰谷时钟",
			"usage.config.footShowUpdated": "更新时间",
			"usage.config.footCompact": "紧凑间距",
			"usage.config.cardsTitle": "卡片",
			"usage.config.cardsHint": "选择显示哪些提供方卡片；新提供方会自动出现。",
			"usage.config.balancesTitle": "余额",
			"usage.config.plansTitle": "套餐",
			"usage.config.cardsNone": "暂无提供方报告余额或套餐。",
			"usage.config.moveUp": "上移",
			"usage.config.moveDown": "下移",
			"usage.balance.hidden": "余额已在设置中全部隐藏。",
			"usage.config.providerCurrencies": "提供方货币",
			"usage.config.providerCurrenciesHint": "每个提供方的消费显示货币。",
			"usage.currency.native": "原生",
			"usage.currency.both": "双币",
			"usage.config.currencyTitle": "货币",
			"settings.collapse": "收起",
			"settings.expand": "展开",
			"settings.notExposed": "这个版本的 DSH 没有开放使用统计的设置。",
			"settings.readOnly": "设置只读。",
			"settings.saveFailed": "没有保存成功。",
			"settings.inherit": "默认",
			"settings.overridden": "已修改",
			"settings.reset": "恢复默认",
			"settings.invalidNumber": "填一个数字，留空用默认值。"
		};
		/** English mirror; every zh key present. */
		const en = {
			"usage.title": "Usage Statistics",
			"usage.tab.usage": "Usage",
			"usage.tab.plans": "Plans",
			"usage.tab.sidebar": "Sidebar",
			"usage.sidebar.preview": "Preview",
			"usage.refresh": "Refresh",
			"usage.refreshing": "Refreshing…",
			"usage.rescan": "Re-scan limits",
			"usage.rescanning": "Scanning…",
			"usage.updated": "Updated {time}",
			"usage.loading": "Reading usage…",
			"usage.error": "Failed to load: {error}",
			"usage.disabled": "Turned off; flip the switch to resume.",
			"usage.current": "Current",
			"usage.today": "Today",
			"usage.today.cost": "Today spend (estimated)",
			"usage.day.label": "Day",
			"usage.day.today": "Today",
			"usage.day.title": "Usage · {date}",
			"usage.day.cost": "Day spend (estimated)",
			"usage.day.empty": "No usage recorded on this day",
			"usage.day.loading": "Loading that day…",
			"usage.day.error": "Failed to load that day: {error}",
			"usage.peak.on": "DeepSeek peak hours: 2x pricing, ends {time}",
			"usage.peak.off": "DeepSeek off-peak: half of peak pricing, peak returns {time}",
			"usage.peak.tag.on": "Peak",
			"usage.peak.tag.off": "Off-peak",
			"usage.peak.ends": "ends {time}",
			"usage.peak.starts": "peak at {time}",
			"usage.calls": "{n} calls",
			"usage.tokens.total": "Total tokens",
			"usage.tokens.input": "Input",
			"usage.tokens.output": "Output",
			"usage.tokens.cacheRead": "Cache read",
			"usage.tokens.cacheWrite": "Cache write",
			"usage.trend": "Last 30 days",
			"usage.noData": "No usage yet; counting starts once the plugin is on.",
			"usage.balance": "Balance",
			"usage.balance.unsupported": "No balance query",
			"usage.balance.noCredential": "No credential configured",
			"usage.balance.noneConfigured": "No providers configured",
			"usage.oauth": "OAuth credential, no balance query",
			"usage.plan.reset": "resets {date}",
			"usage.plan.noPlan": "No plan data",
			"usage.plan.noneConfigured": "No plan provider configured, such as Kimi, GLM, OpenCode Go, MiniMax or a Codex subscription.",
			"usage.plan.windows.5h": "5 hours",
			"usage.plan.windows.week": "Weekly",
			"usage.plan.windows.month": "Monthly",
			"usage.quota.month": "Month",
			"usage.quota.week": "7 days",
			"usage.quota.in": "in",
			"usage.quota.out": "out",
			"usage.quota.rolling": "rolling 7 days",
			"usage.quota.hint": "Weighted tokens, as the server meters them",
			"usage.spend.title": "Provider limits",
			"usage.spend.daily": "daily",
			"usage.spend.monthly": "monthly",
			"usage.spend.key": "key",
			"usage.spend.unlimited": "unlimited",
			"usage.provider.error": "Query failed: {error}",
			"usage.errorListSeparator": "; ",
			"usage.config.title": "Settings",
			"usage.config.pollIntervalSec": "Poll interval (seconds)",
			"usage.config.spendCurrency": "Currency",
			"usage.config.cnyPerUsd": "Exchange rate",
			"usage.foot.cost": "Today spend",
			"usage.foot.noData": "No usage yet today",
			"usage.foot.open": "Open usage statistics settings",
			"usage.foot.collapse": "Collapse the usage card",
			"usage.foot.expand": "Expand the usage card",
			"usage.description": "Usage, balances and plan quotas for each provider.",
			"usage.config.pollIntervalHint": "How often balances and plans are read.",
			"usage.config.spendCurrencyHint": "Spend figures show in this currency.",
			"usage.config.cnyPerUsdHint": "How many CNY one USD buys.",
			"usage.config.footTitle": "Sidebar card",
			"usage.config.footHint": "Choose which rows the sidebar glance shows.",
			"usage.config.footShowSpend": "Today's spend headline",
			"usage.config.footShowUsage": "Tokens and calls line",
			"usage.config.footShowBalances": "Provider balances",
			"usage.config.footShowMeters": "Plan meter block",
			"usage.config.footMeterWindow": "Meter window",
			"usage.config.footShowPeak": "Peak clock",
			"usage.config.footShowUpdated": "Updated time",
			"usage.config.footCompact": "Compact spacing",
			"usage.config.cardsTitle": "Cards",
			"usage.config.cardsHint": "Choose which provider cards appear; new providers show automatically.",
			"usage.config.balancesTitle": "Balances",
			"usage.config.plansTitle": "Plans",
			"usage.config.cardsNone": "No provider reports a balance or plan yet.",
			"usage.config.moveUp": "Move up",
			"usage.config.moveDown": "Move down",
			"usage.balance.hidden": "All balances are hidden in settings.",
			"usage.config.providerCurrencies": "Provider currencies",
			"usage.config.providerCurrenciesHint": "How each provider's spend reads.",
			"usage.currency.native": "Native",
			"usage.currency.both": "Both",
			"usage.config.currencyTitle": "Currency",
			"settings.collapse": "Collapse",
			"settings.expand": "Expand",
			"settings.notExposed": "This DSH version does not open the usage settings.",
			"settings.readOnly": "Settings are read-only.",
			"settings.saveFailed": "Not saved.",
			"settings.inherit": "Default",
			"settings.overridden": "Changed",
			"settings.reset": "Reset",
			"settings.invalidNumber": "Enter a number, or leave it empty for the default."
		};
		/**
		* Active dictionary, picked by the document language at call time. The
		* section resolves its copy the same tiny way the pet's DOM-injected surface
		* does (the settings section has no framework locale seat of its own).
		*/
		function dictionary() {
			return (typeof document !== "undefined" ? document.documentElement.lang : "zh").toLowerCase().startsWith("en") ? en : zh;
		}
		/** Translate a key with optional `{name}` template params; missing keys degrade to the key. */
		function t(key, params) {
			let text = dictionary()[key] ?? key;
			if (params !== void 0) for (const [name, value] of Object.entries(params)) text = text.replaceAll(`{${name}}`, String(value));
			return text;
		}
		//#endregion
		//#region \0dsh-css:packages/dsh-usage/src/client/usage.module.css.mjs
		const css$1 = ".cvtkAW_section{min-width:0;color:inherit;flex-direction:column;gap:16px;display:flex;container:cvtkAW_usage-section/inline-size}.cvtkAW_header{flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px 16px;display:flex}.cvtkAW_headerActions{flex-wrap:wrap;justify-content:flex-end;align-items:center;gap:8px;display:flex}.cvtkAW_currentProvider{opacity:.75;font-size:13px}.cvtkAW_refreshBtn{appearance:none;color:inherit;font:inherit;cursor:pointer;opacity:.85;background:0 0;border:1px solid;border-radius:8px;padding:4px 12px;font-size:12px;transition:opacity .12s,background-color .12s}.cvtkAW_refreshBtn:hover:not(:disabled){opacity:1;background:color-mix(in srgb, currentColor 8%, transparent)}.cvtkAW_refreshBtn:disabled{cursor:default;opacity:.5}.cvtkAW_refreshBtn:focus-visible{box-shadow:0 0 0 2px color-mix(in srgb, currentColor 45%, transparent);outline:none}.cvtkAW_sectionList{margin:0;padding:0;list-style:none}.cvtkAW_tabs{align-self:stretch;display:flex}.cvtkAW_tabs>.cvtkAW_tab{text-align:center;flex:1 1 0;min-width:max-content}.cvtkAW_settingsGroup{flex-direction:column;margin-top:16px;display:flex}.cvtkAW_groupTitle{opacity:.6;margin:0 0 2px;font-size:12px;font-weight:600}.cvtkAW_card{border:1px solid color-mix(in srgb, currentColor 14%, transparent);border-radius:12px;flex-direction:column;gap:10px;padding:14px 16px;display:flex}.cvtkAW_cardTitle{letter-spacing:.04em;text-transform:uppercase;opacity:.6;font-size:12px;font-weight:600}.cvtkAW_dayPicker{align-items:center;gap:8px;display:flex}.cvtkAW_dayPickerLabel{opacity:.6;font-size:11px}.cvtkAW_daySelect{border:1px solid color-mix(in srgb, currentColor 25%, transparent);color:inherit;font:inherit;font-variant-numeric:tabular-nums;background:0 0;border-radius:6px;padding:3px 8px;font-size:12px}.cvtkAW_daySelect:focus-visible{box-shadow:0 0 0 2px color-mix(in srgb, currentColor 45%, transparent);outline:none}.cvtkAW_daySelect option{background-color:var(--dsw-alias-bg-multi-select,Canvas);color:var(--dsw-alias-label-primary,CanvasText)}.cvtkAW_statRow{grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;display:grid}.cvtkAW_stat{background:color-mix(in srgb, currentColor 4%, transparent);border-radius:8px;flex-direction:column;gap:3px;min-width:0;padding:9px 10px;display:flex}.cvtkAW_statValue{font-variant-numeric:tabular-nums;font-size:18px;font-weight:600}.cvtkAW_statLabel{opacity:.6;font-size:11px}.cvtkAW_providerRow{border-top:1px solid color-mix(in srgb, currentColor 8%, transparent);flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px;padding:6px 0;font-size:13px;display:flex}.cvtkAW_providerRow:first-of-type{border-top:none}.cvtkAW_providerName{align-items:center;gap:8px;min-width:0;display:flex}.cvtkAW_providerTokens{font-variant-numeric:tabular-nums;opacity:.75;white-space:nowrap}.cvtkAW_providerBalance{font-variant-numeric:tabular-nums;white-space:nowrap;font-weight:600}.cvtkAW_currentBadge{border:1px solid color-mix(in srgb, currentColor 35%, transparent);opacity:.8;border-radius:999px;flex:none;padding:1px 7px;font-size:10px;font-weight:600}.cvtkAW_chart{grid-template-columns:repeat(2,minmax(0,1fr));gap:14px 20px;display:grid}.cvtkAW_usageSummaryGrid{grid-template-columns:repeat(2,minmax(0,1fr));align-items:start;gap:16px;display:grid}.cvtkAW_trendAxis{grid-column:1/-1}@container cvtkAW_usage-section (width<=680px){.cvtkAW_usageSummaryGrid,.cvtkAW_chart{grid-template-columns:minmax(0,1fr)}.cvtkAW_statRow{grid-template-columns:repeat(2,minmax(0,1fr))}}.cvtkAW_chartProvider{flex-direction:column;gap:4px;display:flex}.cvtkAW_chartHead{justify-content:space-between;align-items:baseline;gap:10px;font-size:13px;display:flex}.cvtkAW_chartTokens{font-variant-numeric:tabular-nums;opacity:.65;white-space:nowrap;font-size:11px}.cvtkAW_chartBar{background:color-mix(in srgb, currentColor 8%, transparent);border-radius:999px;height:8px;display:block;overflow:hidden}.cvtkAW_chartFill{background:color-mix(in srgb, currentColor 55%, transparent);border-radius:999px;height:100%;transition:width .3s;display:block}.cvtkAW_chartModel{opacity:.8;grid-template-columns:minmax(80px,180px) 1fr auto;align-items:center;gap:8px;padding-left:14px;font-size:11px;display:grid}.cvtkAW_chartModelName{text-overflow:ellipsis;white-space:nowrap;opacity:.8;overflow:hidden}.cvtkAW_chartModelBar{background:color-mix(in srgb, currentColor 6%, transparent);border-radius:999px;height:4px;display:block;overflow:hidden}.cvtkAW_chartModelFill{background:color-mix(in srgb, currentColor 35%, transparent);border-radius:999px;height:100%;transition:width .3s;display:block}.cvtkAW_trendAxis{opacity:.5;font-variant-numeric:tabular-nums;justify-content:space-between;font-size:10px;display:flex}.cvtkAW_muted{opacity:.6;font-size:12px}..cvtkAW_buttonRow{gap:8px;display:flex}.cvtkAW_errorLine{opacity:.75;font-size:12px}.cvtkAW_planCard{flex-direction:column;gap:8px;display:flex}.cvtkAW_planHead{justify-content:space-between;align-items:baseline;gap:10px;display:flex}.cvtkAW_planName{font-size:14px;font-weight:600}.cvtkAW_windowRow{flex-direction:column;gap:4px;display:flex}.cvtkAW_windowLabel{opacity:.8;font-variant-numeric:tabular-nums;justify-content:space-between;font-size:12px;display:flex}.cvtkAW_bar{background:color-mix(in srgb, currentColor 10%, transparent);border-radius:999px;height:6px;overflow:hidden}.cvtkAW_barFill{background:color-mix(in srgb, currentColor 55%, transparent);border-radius:999px;height:100%;transition:width .3s}.cvtkAW_barWarn{background:#d97706}.cvtkAW_barLow{background:#dc2626}.cvtkAW_resetLine{opacity:.55;font-variant-numeric:tabular-nums;font-size:11px}.cvtkAW_footCard{box-sizing:border-box;background:color-mix(in srgb, currentColor 4%, transparent);width:100%;color:inherit;border:none;border-radius:12px;margin:2px 0 4px;transition:background-color .12s;position:relative}.cvtkAW_footCard:hover{background:var(--dsw-alias-interactive-bg-hover)}.cvtkAW_footCardCollapsed{background:0 0}.cvtkAW_footMain{appearance:none;box-sizing:border-box;width:100%;color:inherit;font:inherit;text-align:left;cursor:pointer;background:0 0;border:none;border-radius:12px;flex-direction:column;gap:3px;padding:7px 8px;display:flex}.cvtkAW_footMain:focus-visible{box-shadow:0 0 0 2px color-mix(in srgb, currentColor 45%, transparent);outline:none}.cvtkAW_footToggle{appearance:none;width:20px;height:20px;color:inherit;cursor:pointer;opacity:.55;background:0 0;border:none;border-radius:6px;justify-content:center;align-items:center;padding:0;transition:opacity .12s,background-color .12s;display:inline-flex;position:absolute;top:6px;right:6px}.cvtkAW_footCard:hover .cvtkAW_footToggle{opacity:.8}.cvtkAW_footToggle:hover{opacity:1;background:color-mix(in srgb, currentColor 10%, transparent)}.cvtkAW_footToggle:focus-visible{box-shadow:0 0 0 2px color-mix(in srgb, currentColor 45%, transparent);outline:none}.cvtkAW_footToggle svg{display:block}.cvtkAW_footHead{justify-content:space-between;align-items:baseline;gap:8px;display:flex}.cvtkAW_footTitle{opacity:.65;white-space:nowrap;align-items:center;gap:6px;min-width:0;font-size:12px;display:inline-flex}.cvtkAW_footTitle svg{flex:none;display:block}.cvtkAW_footValue{font-variant-numeric:tabular-nums;white-space:nowrap;margin-right:18px;font-size:15px;font-weight:600}.cvtkAW_footLine{opacity:.7;font-variant-numeric:tabular-nums;text-overflow:ellipsis;white-space:nowrap;font-size:11px;overflow:hidden}.cvtkAW_footMeta{opacity:.5;font-variant-numeric:tabular-nums;font-size:10px}.cvtkAW_footCardCollapsed .cvtkAW_footMain{min-height:36px;padding:7px 8px}.cvtkAW_footStrip{white-space:nowrap;align-items:center;gap:6px;padding-right:20px;font-size:12px;display:flex;overflow:hidden}.cvtkAW_footStrip svg{opacity:.65;flex:none;display:block}.cvtkAW_footStripProvider{text-overflow:ellipsis;flex:none;max-width:38%;font-weight:500;overflow:hidden}.cvtkAW_footStripLabel{opacity:.65;text-overflow:ellipsis;overflow:hidden}.cvtkAW_footStripValue{font-variant-numeric:tabular-nums;margin-left:auto;font-weight:600}[data-dsh-frame][data-sidebar-collapsed] .cvtkAW_footCard,[data-sidebar-collapsed] .cvtkAW_footCard{display:none}.cvtkAW_peakBadge,.cvtkAW_peakLine{font-variant-numeric:tabular-nums;white-space:nowrap;align-items:center;gap:4px;font-size:11px;display:inline-flex}.cvtkAW_peakBadge{flex:none}.cvtkAW_peakLine{gap:6px}.cvtkAW_peakBadge[data-peak=on],.cvtkAW_peakLine[data-peak=on]{color:var(--dsw-alias-state-error-primary,#b42318)}.cvtkAW_peakBadge[data-peak=off],.cvtkAW_peakLine[data-peak=off]{color:var(--dsw-alias-state-success-primary,#067647)}.cvtkAW_peakDot{background:currentColor;border-radius:50%;flex:none;width:6px;height:6px}.cvtkAW_footPeak{white-space:nowrap;align-items:center;gap:5px;font-size:10px;display:flex;overflow:hidden}.cvtkAW_footPeakClock{opacity:.7;font-variant-numeric:tabular-nums}.cvtkAW_quotaMeter{flex-direction:column;gap:4px;font-size:11px;font-variant-numeric:tabular-nums;display:flex}.cvtkAW_quotaLimit{align-items:baseline;gap:6px;opacity:.85;display:flex}.cvtkAW_quotaDotIn,.cvtkAW_quotaDotOut{width:7px;height:7px;border-radius:2px;flex:none;display:inline-block}.cvtkAW_quotaDotIn{background:#4c8dff}.cvtkAW_quotaDotOut{background:#f08a24}.cvtkAW_quotaPercent{margin-left:auto;opacity:.6}.cvtkAW_quotaIn{height:100%;border-radius:999px;background:#4c8dff;transition:width .3s}.cvtkAW_quotaOut{height:100%;border-radius:999px;background:#f08a24;transition:width .3s}.cvtkAW_footPlan{flex-direction:column;gap:3px;display:flex}.cvtkAW_footPlanName{opacity:.6;font-size:10px}.cvtkAW_footMeter{grid-template-columns:18px minmax(0,1fr) auto;align-items:center;gap:5px;font-size:10px;font-variant-numeric:tabular-nums;display:grid}.cvtkAW_footMeterKey{opacity:.6}.cvtkAW_footMeterTrack{background:color-mix(in srgb, currentColor 10%, transparent);border-radius:999px;height:5px;overflow:hidden}.cvtkAW_footMeterValue{opacity:.75;white-space:nowrap}.cvtkAW_footFoot{white-space:nowrap;align-items:center;gap:5px;font-size:10px;display:flex;overflow:hidden}.cvtkAW_footFoot .cvtkAW_footMeta{margin-left:auto;opacity:.45}.cvtkAW_settingsToggle{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:6px 0;border-top:1px solid color-mix(in srgb, currentColor 8%, transparent)}.cvtkAW_settingsToggle:first-of-type{border-top:none}.cvtkAW_settingsToggleLabel{font-size:13px}.cvtkAW_settingsGroupHint{opacity:.55;margin:0 0 4px;font-size:11px}.cvtkAW_footMainCompact{gap:2px;padding:5px 8px}.cvtkAW_settingsSubhead{margin:8px 0 0;font-size:11px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;opacity:.55}.cvtkAW_orderRow{display:flex;align-items:center;gap:8px;padding:6px 0;border-top:1px solid color-mix(in srgb,currentColor 8%,transparent)}.cvtkAW_orderRow:first-of-type{border-top:none}.cvtkAW_orderRow .cvtkAW_settingsToggleLabel{flex:1 1 auto;min-width:0}.cvtkAW_orderButtons{display:flex;gap:2px}.cvtkAW_orderBtn{appearance:none;color:inherit;font:inherit;font-size:11px;line-height:1;cursor:pointer;opacity:.6;background:none;border:1px solid color-mix(in srgb,currentColor 22%,transparent);border-radius:5px;padding:2px 5px}.cvtkAW_orderBtn:hover:not(:disabled){opacity:1;background:color-mix(in srgb,currentColor 8%,transparent)}.cvtkAW_orderBtn:disabled{opacity:.25;cursor:default}.cvtkAW_footPreviewFrame{display:flex;flex-direction:column;gap:6px;max-width:320px}.cvtkAW_currencyRow{display:flex;align-items:center;gap:10px;padding:6px 0;border-top:1px solid color-mix(in srgb,currentColor 8%,transparent)}.cvtkAW_currencyRow:first-of-type{border-top:none}.cvtkAW_currencyName{flex:0 0 auto;font-size:13px;white-space:nowrap}.cvtkAW_currencyChoices{display:flex;align-items:center;gap:2px;margin-left:auto;flex:0 0 auto;flex-wrap:nowrap}.cvtkAW_currencyChoice,.cvtkAW_currencyReset{appearance:none;color:inherit;font:inherit;font-size:11px;line-height:1;white-space:nowrap;cursor:pointer;background:none;border:1px solid color-mix(in srgb,currentColor 18%,transparent);border-radius:6px;padding:4px 8px}.cvtkAW_currencyChoice[data-active]{background:color-mix(in srgb,currentColor 16%,transparent);border-color:color-mix(in srgb,currentColor 40%,transparent)}.cvtkAW_currencyChoice:hover:not(:disabled),.cvtkAW_currencyReset:hover:not(:disabled){background:color-mix(in srgb,currentColor 8%,transparent)}.cvtkAW_currencyChoice:disabled,.cvtkAW_currencyReset:disabled{opacity:.4;cursor:default}.cvtkAW_currencyReset{opacity:.65;border-color:transparent}";
		const tagId$1 = "@legifyx/dsh-usage/packages/dsh-usage/src/client/usage.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$1) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@legifyx/dsh-usage";
			tag.dataset.pluginCss = tagId$1;
			tag.textContent = css$1;
			document.head.appendChild(tag);
		}
		var usage_module_css_default = {
			"bar": "cvtkAW_bar",
			"barFill": "cvtkAW_barFill",
			"barLow": "cvtkAW_barLow",
			"barWarn": "cvtkAW_barWarn",
			"buttonRow": "cvtkAW_buttonRow",
			"card": "cvtkAW_card",
			"cardTitle": "cvtkAW_cardTitle",
			"chart": "cvtkAW_chart",
			"chartBar": "cvtkAW_chartBar",
			"chartFill": "cvtkAW_chartFill",
			"chartHead": "cvtkAW_chartHead",
			"chartModel": "cvtkAW_chartModel",
			"chartModelBar": "cvtkAW_chartModelBar",
			"chartModelFill": "cvtkAW_chartModelFill",
			"chartModelName": "cvtkAW_chartModelName",
			"chartProvider": "cvtkAW_chartProvider",
			"chartTokens": "cvtkAW_chartTokens",
			"currentBadge": "cvtkAW_currentBadge",
			"currentProvider": "cvtkAW_currentProvider",
			"dayPicker": "cvtkAW_dayPicker",
			"dayPickerLabel": "cvtkAW_dayPickerLabel",
			"daySelect": "cvtkAW_daySelect",
			"errorLine": "cvtkAW_errorLine",
			"footCard": "cvtkAW_footCard",
			"footCardCollapsed": "cvtkAW_footCardCollapsed",
			"footHead": "cvtkAW_footHead",
			"footLine": "cvtkAW_footLine",
			"footMain": "cvtkAW_footMain",
			"footMeta": "cvtkAW_footMeta",
			"footPeak": "cvtkAW_footPeak",
			"footPeakClock": "cvtkAW_footPeakClock",
			"footStrip": "cvtkAW_footStrip",
			"footStripLabel": "cvtkAW_footStripLabel",
			"footStripProvider": "cvtkAW_footStripProvider",
			"footStripValue": "cvtkAW_footStripValue",
			"footTitle": "cvtkAW_footTitle",
			"footToggle": "cvtkAW_footToggle",
			"footValue": "cvtkAW_footValue",
			"groupTitle": "cvtkAW_groupTitle",
			"header": "cvtkAW_header",
			"headerActions": "cvtkAW_headerActions",
			"muted": "cvtkAW_muted",
			"peakBadge": "cvtkAW_peakBadge",
			"peakDot": "cvtkAW_peakDot",
			"peakLine": "cvtkAW_peakLine",
			"planCard": "cvtkAW_planCard",
			"planHead": "cvtkAW_planHead",
			"planName": "cvtkAW_planName",
			"providerBalance": "cvtkAW_providerBalance",
			"providerName": "cvtkAW_providerName",
			"providerRow": "cvtkAW_providerRow",
			"providerTokens": "cvtkAW_providerTokens",
			"refreshBtn": "cvtkAW_refreshBtn",
			"resetLine": "cvtkAW_resetLine",
			"section": "cvtkAW_section",
			"sectionList": "cvtkAW_sectionList",
			"settingsGroup": "cvtkAW_settingsGroup",
			"stat": "cvtkAW_stat",
			"statLabel": "cvtkAW_statLabel",
			"statRow": "cvtkAW_statRow",
			"statValue": "cvtkAW_statValue",
			"tab": "cvtkAW_tab",
			"tabs": "cvtkAW_tabs",
			"trendAxis": "cvtkAW_trendAxis",
			"usage-section": "cvtkAW_usage-section",
			"usageSummaryGrid": "cvtkAW_usageSummaryGrid",
			"windowLabel": "cvtkAW_windowLabel",
			"windowRow": "cvtkAW_windowRow",
			"quotaMeter": "cvtkAW_quotaMeter",
			"quotaLimit": "cvtkAW_quotaLimit",
			"quotaDotIn": "cvtkAW_quotaDotIn",
			"quotaDotOut": "cvtkAW_quotaDotOut",
			"quotaPercent": "cvtkAW_quotaPercent",
			"quotaIn": "cvtkAW_quotaIn",
			"quotaOut": "cvtkAW_quotaOut",
			"footPlan": "cvtkAW_footPlan",
			"footPlanName": "cvtkAW_footPlanName",
			"footMeter": "cvtkAW_footMeter",
			"footMeterKey": "cvtkAW_footMeterKey",
			"footMeterTrack": "cvtkAW_footMeterTrack",
			"footMeterValue": "cvtkAW_footMeterValue",
			"footFoot": "cvtkAW_footFoot",
			"settingsToggle": "cvtkAW_settingsToggle",
			"settingsToggleLabel": "cvtkAW_settingsToggleLabel",
			"settingsGroupHint": "cvtkAW_settingsGroupHint",
			"footMainCompact": "cvtkAW_footMainCompact",
			"settingsSubhead": "cvtkAW_settingsSubhead",
			"orderRow": "cvtkAW_orderRow",
			"orderButtons": "cvtkAW_orderButtons",
			"orderBtn": "cvtkAW_orderBtn",
			"footPreviewFrame": "cvtkAW_footPreviewFrame",
			"currencyRow": "cvtkAW_currencyRow",
			"currencyName": "cvtkAW_currencyName",
			"currencyChoices": "cvtkAW_currencyChoices",
			"currencyChoice": "cvtkAW_currencyChoice",
			"currencyReset": "cvtkAW_currencyReset"
		};
		//#endregion
		//#region \0dsh-css:packages/dsh-usage/src/client/settings-card.module.css.mjs
		const css = ".Fys0GG_card{--settings-card-radius:12px;--settings-card-header-pad:16px;--settings-card-header-gap:13px;--settings-card-title-size:15px;--settings-card-description-size:13px;--settings-card-body-inset:16px;--settings-card-motion:.18s;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);border-radius:var(--settings-card-radius);list-style:none;transition:border-color .16s,background .16s}.Fys0GG_card:hover{border-color:var(--dsw-alias-label-dimmed)}.Fys0GG_cardOpen{background:var(--dsw-alias-bg-layer-2);border-color:var(--dsw-alias-label-dimmed)}.Fys0GG_cardNested{--settings-card-radius:10px;--settings-card-header-pad:10px 12px;--settings-card-header-gap:10px;--settings-card-title-size:13px;--settings-card-description-size:12px;--settings-card-body-inset:12px}.Fys0GG_cardNested .Fys0GG_description{white-space:nowrap;text-overflow:ellipsis;overflow:hidden}.Fys0GG_header{appearance:none;box-sizing:border-box;width:100%;font:inherit;color:inherit;text-align:left;cursor:pointer;border-radius:var(--settings-card-radius);align-items:center;gap:var(--settings-card-header-gap);padding:var(--settings-card-header-pad);background:0 0;border:0;display:flex}.Fys0GG_header:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:-2px}.Fys0GG_headerStatic{box-sizing:border-box;border-radius:var(--settings-card-radius);align-items:center;gap:var(--settings-card-header-gap);width:100%;padding:var(--settings-card-header-pad);display:flex}.Fys0GG_headText{flex-direction:column;flex:1;gap:4px;min-width:0;display:flex}.Fys0GG_mark{background:var(--dsw-alias-bg-module-platform);width:34px;height:34px;color:var(--dsw-alias-label-secondary);border-radius:10px;flex:none;place-items:center;transition:color .16s;display:grid}.Fys0GG_header:hover .Fys0GG_mark,.Fys0GG_cardOpen .Fys0GG_mark{color:var(--dsw-alias-label-primary)}.Fys0GG_name{color:var(--dsw-alias-label-primary);font-size:var(--settings-card-title-size);font-weight:600;line-height:1.4}.Fys0GG_description{color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px}.Fys0GG_headerAction{flex:none;align-items:center;display:inline-flex}.Fys0GG_chevron{color:var(--dsw-alias-label-tertiary);flex:none;width:16px;height:16px;transition:transform .16s,color .16s}.Fys0GG_header:hover .Fys0GG_chevron{color:var(--dsw-alias-label-secondary)}.Fys0GG_chevronOpen{transform:rotate(180deg)}.Fys0GG_disclosure{opacity:0;transition:grid-template-rows var(--settings-card-motion) ease, opacity var(--settings-card-motion) ease;grid-template-rows:0fr;display:grid}.Fys0GG_disclosure[data-state=collapsed],.Fys0GG_disclosure[data-state=entering],.Fys0GG_disclosure[data-state=closing]{overflow:hidden}.Fys0GG_disclosure[data-state=entering],.Fys0GG_disclosure[data-state=shown]{opacity:1;grid-template-rows:1fr}.Fys0GG_disclosure>.Fys0GG_body{min-height:0}.Fys0GG_body{border-top:1px solid var(--dsw-alias-border-l2);margin:0 var(--settings-card-body-inset);padding-bottom:8px;container:Fys0GG_settings-card/inline-size}.Fys0GG_readOnly{color:var(--dsw-alias-label-secondary);margin:12px 0 0;font-size:12px;line-height:1.5}.Fys0GG_notExposed{color:var(--dsw-alias-state-warn-primary);margin:12px 0 0;font-size:12px;line-height:1.5}.Fys0GG_failed{color:var(--dsw-alias-state-error-primary,#b42318);overflow-wrap:anywhere;margin:8px 0 4px;font-size:12px;line-height:18px}.Fys0GG_field{grid-template-columns:minmax(0,1fr) fit-content(50%);grid-template-areas:\"Fys0GG_head Fys0GG_control\"\"Fys0GG_hint Fys0GG_control\";align-items:center;gap:4px 24px;padding:16px 0;display:grid}.Fys0GG_field>.Fys0GG_head{grid-area:Fys0GG_head}.Fys0GG_field>:is(.Fys0GG_hint,.Fys0GG_invalid){grid-area:Fys0GG_hint}.Fys0GG_field>:not(.Fys0GG_head,.Fys0GG_hint,.Fys0GG_invalid){grid-area:Fys0GG_control;justify-self:end;max-width:100%}.Fys0GG_field+.Fys0GG_field{border-top:1px solid var(--dsw-alias-border-l2)}.Fys0GG_head{align-items:center;gap:8px;display:flex}.Fys0GG_label{min-width:0;color:var(--dsw-alias-label-primary);flex:1;font-size:14px;font-weight:400;line-height:22px}.Fys0GG_badges{align-items:center;gap:8px;display:inline-flex}.Fys0GG_badge{white-space:nowrap;background:var(--dsw-alias-bg-module-platform);color:var(--dsw-alias-label-secondary);border-radius:999px;padding:1px 8px;font-size:11px;font-weight:500;line-height:17px}.Fys0GG_reset{font:inherit;color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:none;padding:0;font-size:12px;line-height:1.5}.Fys0GG_reset:hover:not(:disabled){color:var(--dsw-alias-label-primary)}.Fys0GG_reset:disabled{cursor:default}.Fys0GG_reset:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px}.Fys0GG_segmentGroup{background:color-mix(in srgb, var(--dsw-alias-label-primary) 7%, transparent);box-shadow:inset 0 0 0 1px color-mix(in srgb, var(--dsw-alias-label-primary) 5%, transparent);border-radius:8px;flex-wrap:wrap;align-items:center;gap:2px;padding:2px;display:inline-flex;position:relative}.Fys0GG_segment{appearance:none;color:var(--dsw-alias-label-secondary);font:inherit;white-space:nowrap;cursor:pointer;background:0 0;border:0;border-radius:7px;margin:0;padding:3px 12px;font-size:13px;font-weight:500;line-height:18px;transition:background-color .12s,color .12s}.Fys0GG_segment:hover:not(:disabled):not([data-active]){color:var(--dsw-alias-label-primary)}.Fys0GG_segmentGroup:not([data-pill])>.Fys0GG_segment[data-active],.Fys0GG_segmentGroup[data-pill]:before{background:var(--dsw-alias-bg-overlay,var(--dsw-alias-bg-layer-3));box-shadow:0 1px 2px #14141314}body[data-ds-dark-theme] .Fys0GG_segmentGroup:not([data-pill])>.Fys0GG_segment[data-active],body[data-ds-dark-theme] .Fys0GG_segmentGroup[data-pill]:before{box-shadow:none;background:#ffffff24}.Fys0GG_segment[data-active]{color:var(--dsw-alias-label-primary)}.Fys0GG_segmentGroup[data-pill]:before{content:\"\";width:var(--segment-pill-w,0px);height:var(--segment-pill-h,0px);transform:translate(var(--segment-pill-x,0px), var(--segment-pill-y,0px));pointer-events:none;border-radius:7px;transition:transform .24s cubic-bezier(.22,.61,.36,1),width .24s cubic-bezier(.22,.61,.36,1),height .24s cubic-bezier(.22,.61,.36,1);position:absolute;top:0;left:0}.Fys0GG_segmentGroup>*{z-index:1;position:relative}.Fys0GG_segment:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}.Fys0GG_segment:disabled{cursor:not-allowed;opacity:.45}.Fys0GG_segmentGroup[data-pill]:has(>.Fys0GG_segment:disabled):before{opacity:.45}.Fys0GG_input,.Fys0GG_select{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);height:34px;font:inherit;color:var(--dsw-alias-label-primary);border-radius:8px;padding:0 12px;font-size:13px;line-height:1.5}.Fys0GG_input:focus-visible,.Fys0GG_select:focus-visible{border-color:var(--dsw-alias-brand-primary);outline:none}.Fys0GG_input:disabled,.Fys0GG_select:disabled{color:var(--dsw-alias-label-tertiary);cursor:default}.Fys0GG_inputInvalid{border:1px solid var(--dsw-alias-state-error-primary,#b42318);background:var(--dsw-alias-bg-layer-3);height:34px;font:inherit;color:var(--dsw-alias-label-primary);border-radius:8px;padding:0 12px;font-size:13px;line-height:1.5}.Fys0GG_inputInvalid:focus-visible{outline:2px solid var(--dsw-alias-state-error-primary,#b42318);outline-offset:1px;border-color:var(--dsw-alias-state-error-primary,#b42318)}.Fys0GG_field>:is(.Fys0GG_input,.Fys0GG_inputInvalid,.Fys0GG_select,.Fys0GG_selectWrap,.Fys0GG_rangeAnchor){box-sizing:border-box;width:220px}.Fys0GG_rangeAnchor>:is(.Fys0GG_input,.Fys0GG_inputInvalid){box-sizing:border-box;width:100%}@container Fys0GG_settings-card (width<=440px){.Fys0GG_field{grid-template-columns:minmax(0,1fr);grid-template-areas:\"Fys0GG_head\"\"Fys0GG_hint\"\"Fys0GG_control\";row-gap:8px}.Fys0GG_field>:not(.Fys0GG_head,.Fys0GG_hint,.Fys0GG_invalid){justify-self:start}.Fys0GG_field>:is(.Fys0GG_input,.Fys0GG_inputInvalid,.Fys0GG_select,.Fys0GG_selectWrap,.Fys0GG_rangeAnchor){justify-self:stretch;width:auto}}.Fys0GG_selectWrap{position:relative}.Fys0GG_selectButton{appearance:none;text-align:left;cursor:pointer;justify-content:space-between;align-items:center;gap:8px;width:100%;display:flex}.Fys0GG_selectLabel{text-overflow:ellipsis;white-space:nowrap;min-width:0;overflow:hidden}.Fys0GG_selectChevron{color:var(--dsw-alias-label-tertiary);flex:none;transition:transform .16s}.Fys0GG_selectChevronOpen{transform:rotate(180deg)}.Fys0GG_selectPopup{z-index:40;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);max-height:240px;box-shadow:0 8px 24px var(--dsw-alias-bg-mask-2);opacity:0;border-radius:8px;flex-direction:column;padding:4px;transition:opacity .1s,transform .1s;display:flex;position:absolute;top:calc(100% + 4px);left:0;right:0;overflow-y:auto;transform:translateY(-4px)}.Fys0GG_selectPopupOpen{opacity:1;transform:none}.Fys0GG_selectPopupClose{opacity:0;pointer-events:none;transform:translateY(-4px)}.Fys0GG_rangeAnchor{display:inline-flex;position:relative}.Fys0GG_rangeBubble{z-index:40;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);width:220px;box-shadow:0 8px 24px var(--dsw-alias-bg-mask-2);opacity:0;visibility:hidden;border-radius:10px;padding:10px 12px 6px;transition:opacity .12s,transform .12s,visibility 0s linear .12s;position:absolute;right:0}.Fys0GG_rangeBubble[data-side=above]{bottom:calc(100% + 6px);transform:translateY(4px)}.Fys0GG_rangeBubble[data-side=below]{top:calc(100% + 6px);transform:translateY(-4px)}.Fys0GG_rangeBubble[data-open]{opacity:1;visibility:visible;transition:opacity .12s,transform .12s,visibility;transform:none}.Fys0GG_rangeSlider{appearance:none;cursor:pointer;background:0 0;width:100%;height:18px;margin:0;display:block}.Fys0GG_rangeSlider::-webkit-slider-runnable-track{background:linear-gradient(to right, var(--dsw-alias-brand-primary) var(--range-fill,0%), color-mix(in srgb, var(--dsw-alias-label-primary) 12%, transparent) var(--range-fill,0%));border-radius:999px;height:4px}.Fys0GG_rangeSlider::-moz-range-track{background:color-mix(in srgb, var(--dsw-alias-label-primary) 12%, transparent);border-radius:999px;height:4px}.Fys0GG_rangeSlider::-moz-range-progress{background:var(--dsw-alias-brand-primary);border-radius:999px;height:4px}.Fys0GG_rangeSlider::-webkit-slider-thumb{appearance:none;background:#fff;border:0;border-radius:50%;width:14px;height:14px;margin-top:-5px;transition:transform .12s;box-shadow:0 0 0 1px #0000001f,0 1px 3px #00000040}.Fys0GG_rangeSlider::-moz-range-thumb{background:#fff;border:0;border-radius:50%;width:14px;height:14px;box-shadow:0 0 0 1px #0000001f,0 1px 3px #00000040}.Fys0GG_rangeSlider:active::-webkit-slider-thumb{transform:scale(1.15)}.Fys0GG_rangeSlider:focus-visible{outline:none}.Fys0GG_rangeSlider:focus-visible::-webkit-slider-thumb{box-shadow:0 0 0 2px var(--dsw-alias-brand-primary)}.Fys0GG_rangeSlider:disabled{cursor:not-allowed}.Fys0GG_rangeEnds{color:var(--dsw-alias-label-secondary);font-variant-numeric:tabular-nums;justify-content:space-between;margin-top:2px;font-size:11px;line-height:16px;display:flex}.Fys0GG_selectOption{color:var(--dsw-alias-label-primary);cursor:pointer;white-space:nowrap;text-overflow:ellipsis;border-radius:6px;flex-shrink:0;padding:6px 10px;font-size:13px;line-height:1.5;overflow:hidden}.Fys0GG_selectOption:hover,.Fys0GG_selectOptionActive{background:var(--dsw-alias-interactive-bg-hover)}.Fys0GG_selectOptionSelected{color:var(--dsw-alias-brand-primary);background:color-mix(in srgb, var(--dsw-alias-brand-primary) 10%, transparent);font-weight:500}.Fys0GG_invalid{color:var(--dsw-alias-state-error-primary,#b42318);margin:0;font-size:12px;line-height:18px}.Fys0GG_hint{color:var(--dsw-alias-label-secondary);margin:0;font-size:12px;line-height:18px}.Fys0GG_toggle{appearance:none;cursor:pointer;font:inherit;background:0 0;border:0;border-radius:999px;align-items:center;margin:0;padding:0;display:inline-flex}.Fys0GG_toggleTrack{background:var(--dsw-alias-label-dimmed);border-radius:999px;flex:none;width:36px;height:20px;transition:background-color .18s;position:relative}.Fys0GG_toggleThumb{--toggle-travel:16px;--toggle-overshoot:1px;background:var(--dsw-alias-bg-layer-3);border-radius:50%;width:16px;height:16px;transition:translate .18s;position:absolute;top:2px;left:2px;translate:0;box-shadow:0 1px 2px #1414132e}.Fys0GG_toggle[aria-checked=true] .Fys0GG_toggleTrack{background:var(--dsw-alias-button-primary-fill,var(--dsw-alias-label-primary))}.Fys0GG_toggle[aria-checked=true] .Fys0GG_toggleThumb{translate:var(--toggle-travel) 0;background:var(--dsw-alias-label-primary-foreground,var(--dsw-alias-bg-layer-3))}.Fys0GG_toggle[data-moved][aria-checked=true] .Fys0GG_toggleThumb{animation:.35s cubic-bezier(.34,1.45,.64,1) both Fys0GG_toggle-on}.Fys0GG_toggle[data-moved][aria-checked=false] .Fys0GG_toggleThumb{animation:.35s cubic-bezier(.34,1.45,.64,1) both Fys0GG_toggle-off}@keyframes Fys0GG_toggle-on{0%{translate:0}55%{translate:calc(var(--toggle-travel) + var(--toggle-overshoot)) 0}80%,to{translate:var(--toggle-travel) 0}}@keyframes Fys0GG_toggle-off{0%{translate:var(--toggle-travel) 0}55%{translate:calc(0px - var(--toggle-overshoot)) 0}80%,to{translate:0}}.Fys0GG_toggle:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px}.Fys0GG_toggle:disabled{opacity:.45;cursor:not-allowed}@media (prefers-reduced-motion:reduce){.Fys0GG_card,.Fys0GG_header,.Fys0GG_mark,.Fys0GG_chevron,.Fys0GG_chevronOpen,.Fys0GG_rangeBubble,.Fys0GG_selectChevron,.Fys0GG_selectChevronOpen,.Fys0GG_selectPopup,.Fys0GG_toggleTrack,.Fys0GG_toggleThumb{transition:none}.Fys0GG_toggle[data-moved] .Fys0GG_toggleThumb{animation:none}.Fys0GG_disclosure{transition-property:opacity}}";
		const tagId = "@legifyx/dsh-usage/packages/dsh-usage/src/client/settings-card.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@legifyx/dsh-usage";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var settings_card_module_css_default = {
			"badge": "Fys0GG_badge",
			"badges": "Fys0GG_badges",
			"body": "Fys0GG_body",
			"card": "Fys0GG_card",
			"cardNested": "Fys0GG_cardNested",
			"cardOpen": "Fys0GG_cardOpen",
			"chevron": "Fys0GG_chevron",
			"chevronOpen": "Fys0GG_chevronOpen",
			"control": "Fys0GG_control",
			"description": "Fys0GG_description",
			"disclosure": "Fys0GG_disclosure",
			"failed": "Fys0GG_failed",
			"field": "Fys0GG_field",
			"head": "Fys0GG_head",
			"headText": "Fys0GG_headText",
			"header": "Fys0GG_header",
			"headerAction": "Fys0GG_headerAction",
			"headerStatic": "Fys0GG_headerStatic",
			"hint": "Fys0GG_hint",
			"input": "Fys0GG_input",
			"inputInvalid": "Fys0GG_inputInvalid",
			"invalid": "Fys0GG_invalid",
			"label": "Fys0GG_label",
			"mark": "Fys0GG_mark",
			"name": "Fys0GG_name",
			"notExposed": "Fys0GG_notExposed",
			"rangeAnchor": "Fys0GG_rangeAnchor",
			"rangeBubble": "Fys0GG_rangeBubble",
			"rangeEnds": "Fys0GG_rangeEnds",
			"rangeSlider": "Fys0GG_rangeSlider",
			"readOnly": "Fys0GG_readOnly",
			"reset": "Fys0GG_reset",
			"segment": "Fys0GG_segment",
			"segmentGroup": "Fys0GG_segmentGroup",
			"select": "Fys0GG_select",
			"selectButton": "Fys0GG_selectButton",
			"selectChevron": "Fys0GG_selectChevron",
			"selectChevronOpen": "Fys0GG_selectChevronOpen",
			"selectLabel": "Fys0GG_selectLabel",
			"selectOption": "Fys0GG_selectOption",
			"selectOptionActive": "Fys0GG_selectOptionActive",
			"selectOptionSelected": "Fys0GG_selectOptionSelected",
			"selectPopup": "Fys0GG_selectPopup",
			"selectPopupClose": "Fys0GG_selectPopupClose",
			"selectPopupOpen": "Fys0GG_selectPopupOpen",
			"selectWrap": "Fys0GG_selectWrap",
			"settings-card": "Fys0GG_settings-card",
			"toggle": "Fys0GG_toggle",
			"toggle-off": "Fys0GG_toggle-off",
			"toggle-on": "Fys0GG_toggle-on",
			"toggleThumb": "Fys0GG_toggleThumb",
			"toggleTrack": "Fys0GG_toggleTrack"
		};
		//#endregion
		//#region src/client/PeakBadge.tsx
		/** HH:MM of one instant; an unparsable instant drops the time. */
		function formatClock(ms) {
			try {
				return new Date(ms).toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
					hourCycle: "h23"
				});
			} catch {
				return "";
			}
		}
		/** The peak/off-peak marker itself; nothing renders outside the DeepSeek family. */
		function PeakBadge(props) {
			const { peak, boundaryMs, variant } = props;
			const sentence = t(peak ? "usage.peak.on" : "usage.peak.off", { time: formatClock(boundaryMs) });
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
				className: variant === "full" ? usage_module_css_default.peakLine : usage_module_css_default.peakBadge,
				"data-peak": peak ? "on" : "off",
				"data-dsh-part": "peak-status",
				title: sentence,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: usage_module_css_default.peakDot,
					"aria-hidden": "true"
				}), variant === "full" ? sentence : t(peak ? "usage.peak.tag.on" : "usage.peak.tag.off")]
			});
		}
		//#endregion
		//#region src/client/SegmentGroup.tsx
		/**
		* The family's segmented control: a quiet track whose options share one
		* highlight that slides to the pressed option, instead of each option fading
		* its own background out and the next one in. The settings fields' small
		* choices and the Web Extensions TAB strip both render through it, so the two
		* read as one control.
		*
		* The caller builds the option buttons and marks the pressed one with
		* `data-active`; the group measures that button after every render and writes
		* its box as four custom properties, and the stylesheet draws the highlight
		* there (`.segmentGroup[data-pill]::before`). Attribute and first placement
		* land in the same task, so the highlight appears in place and only later
		* changes slide. A ResizeObserver re-measures when the group or an option
		* changes size: a longer locale, a font arriving, a container growing, a
		* strip wrapping onto a second line.
		*/
		/** The attribute marking a group whose highlight has been placed. */
		const PILL_ATTR = "data-pill";
		/** The pressed option, relative to the group. */
		const ACTIVE_SELECTOR = ":scope > [data-active]";
		const PILL_PROPERTIES = [
			"--segment-pill-x",
			"--segment-pill-y",
			"--segment-pill-w",
			"--segment-pill-h"
		];
		/**
		* Write the highlight's box from the pressed option's box, or take the
		* highlight off when nothing is pressed or the group has no layout yet.
		* The two boxes are read in viewport pixels and turned back into the group's
		* own CSS pixels, so a dialog that opens through a scale transform still
		* lands the highlight on its option.
		*/
		function placePill(group) {
			const item = group.querySelector(ACTIVE_SELECTOR);
			const box = group.getBoundingClientRect();
			if (item === null || group.offsetWidth === 0 || box.width === 0) {
				group.removeAttribute(PILL_ATTR);
				for (const property of PILL_PROPERTIES) group.style.removeProperty(property);
				return;
			}
			const scale = box.width / group.offsetWidth;
			const itemBox = item.getBoundingClientRect();
			[
				(itemBox.left - box.left) / scale - group.clientLeft,
				(itemBox.top - box.top) / scale - group.clientTop,
				itemBox.width / scale,
				itemBox.height / scale
			].forEach((value, index) => {
				group.style.setProperty(PILL_PROPERTIES[index], `${Math.round(value * 100) / 100}px`);
			});
			if (!group.hasAttribute(PILL_ATTR)) group.setAttribute(PILL_ATTR, "");
		}
		/**
		* Render a segmented track around the caller's option buttons.
		* @param props - the track's attributes (role, accessible name, key handler) and its options.
		* @returns the track.
		*/
		function SegmentGroup(props) {
			const { children, className, ...rest } = props;
			const group = (0, react.useRef)(null);
			const count = react.Children.count(children);
			(0, react.useLayoutEffect)(() => {
				if (group.current !== null) placePill(group.current);
			});
			(0, react.useLayoutEffect)(() => {
				const element = group.current;
				if (element === null || typeof ResizeObserver === "undefined") return void 0;
				const observer = new ResizeObserver(() => {
					placePill(element);
				});
				observer.observe(element);
				for (const item of Array.from(element.children)) observer.observe(item);
				return () => {
					observer.disconnect();
				};
			}, [count]);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				...rest,
				ref: group,
				className: className === void 0 ? settings_card_module_css_default.segmentGroup : `${settings_card_module_css_default.segmentGroup} ${className}`,
				children
			});
		}
		//#endregion
		//#region src/client/RangeBubble.tsx
		/**
		* Coarse adjustment for a bounded number: resting the pointer on the control
		* (or moving focus into it) raises a small bubble holding a slider across the
		* field's whole range, so a large change is one drag instead of many presses
		* or a retyped value. The control itself stays the precise entry.
		*
		* The bubble belongs to the anchor's subtree, so moving from the control onto
		* the bubble never counts as leaving. It opens after a short rest and closes a
		* moment after the pointer and focus have both gone, so crossing the control
		* on the way elsewhere does not flash it. While a drag is in progress the
		* bubble stays put even if the pointer strays off it.
		*
		* Dragging reports each value through `onInput`, so the field shows it live;
		* releasing the thumb, or a key press on it, reports `onCommit` once. The
		* bubble opens on the side of the control that has room inside the nearest
		* scrolling ancestor, so a row near the top of a settings page does not hang
		* its bubble under the page edge.
		*/
		/** Rest on the control before the bubble opens. */
		const OPEN_DELAY_MS = 220;
		/** Grace after pointer and focus have left before the bubble closes. */
		const CLOSE_DELAY_MS = 200;
		/** Room the bubble needs between the control and the scroller's edge. */
		const BUBBLE_ROOM_PX = 64;
		/** The nearest ancestor that scrolls vertically, or the viewport's root. */
		function scroller(node) {
			for (let parent = node.parentElement; parent !== null; parent = parent.parentElement) {
				const overflow = getComputedStyle(parent).overflowY;
				if (overflow === "auto" || overflow === "scroll") return parent;
			}
			return node.ownerDocument.documentElement;
		}
		/**
		* Render the control with its coarse-adjustment bubble.
		* @param props - the range, the value and the two report callbacks.
		* @returns the anchor holding the control and the bubble.
		*/
		function RangeBubble(props) {
			const { min, max, step, disabled = false } = props;
			const [open, setOpen] = (0, react.useState)(false);
			const [side, setSide] = (0, react.useState)("above");
			const [live, setLive] = (0, react.useState)(null);
			const anchorRef = (0, react.useRef)(null);
			const timer = (0, react.useRef)(void 0);
			const hovered = (0, react.useRef)(false);
			const focused = (0, react.useRef)(false);
			const dragging = (0, react.useRef)(false);
			(0, react.useEffect)(() => () => {
				clearTimeout(timer.current);
			}, []);
			(0, react.useEffect)(() => {
				if (disabled) {
					clearTimeout(timer.current);
					setOpen(false);
				}
			}, [disabled]);
			const show = () => {
				const anchor = anchorRef.current;
				if (anchor !== null) {
					const room = anchor.getBoundingClientRect().top - scroller(anchor).getBoundingClientRect().top;
					setSide(room >= BUBBLE_ROOM_PX ? "above" : "below");
				}
				setOpen(true);
			};
			const schedule = () => {
				clearTimeout(timer.current);
				if (disabled) return;
				if (hovered.current || focused.current || dragging.current) {
					if (!open) timer.current = setTimeout(show, focused.current ? 0 : OPEN_DELAY_MS);
					return;
				}
				timer.current = setTimeout(() => {
					setOpen(false);
				}, CLOSE_DELAY_MS);
			};
			const commit = (value) => {
				dragging.current = false;
				setLive(null);
				props.onCommit(value);
				schedule();
			};
			const onChange = (event) => {
				const value = Number(event.target.value);
				setLive(value);
				props.onInput(value);
			};
			const onKeyUp = (event) => {
				if (live !== null) commit(live);
				if (event.key === "Escape") {
					clearTimeout(timer.current);
					setOpen(false);
				}
			};
			const shown = live ?? Math.min(max, Math.max(min, props.value));
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				ref: anchorRef,
				className: settings_card_module_css_default.rangeAnchor,
				onPointerEnter: () => {
					hovered.current = true;
					schedule();
				},
				onPointerLeave: () => {
					hovered.current = false;
					schedule();
				},
				onFocus: () => {
					focused.current = true;
					schedule();
				},
				onBlur: (event) => {
					if (event.currentTarget.contains(event.relatedTarget)) return;
					focused.current = false;
					if (live !== null) commit(live);
					else schedule();
				},
				children: [props.children, /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: settings_card_module_css_default.rangeBubble,
					"data-open": open ? "" : void 0,
					"data-side": side,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
						type: "range",
						className: settings_card_module_css_default.rangeSlider,
						min,
						max,
						step,
						value: shown,
						"aria-label": props.label,
						tabIndex: open ? 0 : -1,
						disabled,
						style: { "--range-fill": `${(shown - min) / (max - min) * 100}%` },
						onPointerDown: () => {
							dragging.current = true;
						},
						onPointerUp: (event) => {
							commit(Number(event.currentTarget.value));
						},
						onPointerCancel: (event) => {
							commit(Number(event.currentTarget.value));
						},
						onChange,
						onKeyUp
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
						className: settings_card_module_css_default.rangeEnds,
						"aria-hidden": "true",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: min }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: max })]
					})]
				})]
			});
		}
		//#endregion
		//#region src/client/PluginSettingsCard.tsx
		/**
		* Family-shared chrome for plugin settings cards: a disclosure header naming
		* the plugin and what its settings govern, the controls inside, and the line
		* that reports a refused write. A pick is written the moment it is made and a
		* typed value after a pause, so the card has no save button and nothing waits
		* on the reader. Renders nothing while the namespace is unavailable — a
		* deployment that does not compose the owning plugin should show no trace of
		* it. Inlined into each consumer's client bundle; mirrors the official
		* ui-plugin-config PluginCard in a self-contained slice.
		*
		* Every field inside the body is one settings row: the label and its hint on
		* the left, the control on the right, a hairline between two rows; a narrow
		* card stacks the control under the text (settings-card.module.css).
		*/
		/**
		* What a text field inside a card reaches without its plugin wiring it: write
		* the pending draft now (Enter, leaving the field) or put it back (Escape).
		* Picks need neither; they are written the moment they are made.
		*/
		const CardApply = (0, react.createContext)(null);
		/** Length of the body's disclosure motion; it matches `--settings-card-motion` on the card root. */
		const BODY_MOTION_MS = 180;
		/**
		* Render one plugin settings card.
		* @param props - the plugin's copy keys, its form state, and its controls.
		* @returns the card, or nothing while the namespace is still loading.
		*/
		function PluginSettingsCard(props) {
			const [open, setOpen] = (0, react.useState)(props.defaultOpen ?? true);
			const { state, alwaysOpen } = props;
			const expanded = alwaysOpen === true || open;
			const [bodyPhase, setBodyPhase] = (0, react.useState)(expanded ? "shown" : "hidden");
			const bodyRef = (0, react.useRef)(null);
			(0, react.useLayoutEffect)(() => {
				if (expanded) {
					if (bodyPhase === "hidden") setBodyPhase("collapsed");
					else if (bodyPhase === "collapsed") {
						const node = bodyRef.current;
						if (node !== null) node.offsetHeight;
						setBodyPhase("entering");
					} else if (bodyPhase === "closing") setBodyPhase("entering");
					return;
				}
				if (bodyPhase === "collapsed") setBodyPhase("hidden");
				else if (bodyPhase === "entering" || bodyPhase === "shown") setBodyPhase("closing");
			}, [expanded, bodyPhase]);
			(0, react.useEffect)(() => {
				if (bodyPhase !== "entering" && bodyPhase !== "closing") return;
				const timer = setTimeout(() => {
					setBodyPhase(bodyPhase === "entering" ? "shown" : "hidden");
				}, BODY_MOTION_MS);
				return () => {
					clearTimeout(timer);
				};
			}, [bodyPhase]);
			if (!state.available) return null;
			const title = props.t(props.titleKey);
			const description = props.t(props.descriptionKey);
			const descriptionTitle = props.descriptionTitleKey === void 0 ? description : props.t(props.descriptionTitleKey);
			const baseClass = expanded ? `${settings_card_module_css_default.cardOpen} ${settings_card_module_css_default.card}` : settings_card_module_css_default.card;
			const cardClass = props.density === "nested" ? `${baseClass} ${settings_card_module_css_default.cardNested}` : baseClass;
			/** The body region both legs share; a hidden phase renders nothing at all. */
			const bodyRegion = (content) => bodyPhase === "hidden" ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: settings_card_module_css_default.disclosure,
				"data-state": bodyPhase,
				ref: bodyRef,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: settings_card_module_css_default.body,
					children: content
				})
			});
			const header = alwaysOpen === true ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: settings_card_module_css_default.headerStatic,
				children: [
					props.icon !== void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: settings_card_module_css_default.mark,
						"aria-hidden": "true",
						children: props.icon
					}) : null,
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
						className: settings_card_module_css_default.headText,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: settings_card_module_css_default.name,
							id: props.titleId,
							title,
							children: title
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: settings_card_module_css_default.description,
							title: descriptionTitle,
							children: props.descriptionNode ?? description
						})]
					}),
					props.headerAction !== void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: settings_card_module_css_default.headerAction,
						children: props.headerAction
					}) : null
				]
			}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
				type: "button",
				className: settings_card_module_css_default.header,
				"aria-expanded": open,
				"aria-label": `${props.t(open ? "settings.collapse" : "settings.expand")}: ${title}`,
				onClick: () => {
					setOpen(!open);
				},
				children: [
					props.icon !== void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: settings_card_module_css_default.mark,
						"aria-hidden": "true",
						children: props.icon
					}) : null,
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
						className: settings_card_module_css_default.headText,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: settings_card_module_css_default.name,
							id: props.titleId,
							title,
							children: title
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: settings_card_module_css_default.description,
							title: descriptionTitle,
							children: props.descriptionNode ?? description
						})]
					}),
					props.headerAction !== void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: settings_card_module_css_default.headerAction,
						children: props.headerAction
					}) : null,
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
						width: "14",
						height: "14",
						viewBox: "0 0 14 14",
						fill: "none",
						xmlns: "http://www.w3.org/2000/svg",
						className: open ? `${settings_card_module_css_default.chevron} ${settings_card_module_css_default.chevronOpen}` : settings_card_module_css_default.chevron,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							d: "M11.8486 5.5L11.4238 5.92383L8.69727 8.65137C8.44157 8.90706 8.21562 9.13382 8.01172 9.29785C7.79912 9.46883 7.55595 9.61756 7.25 9.66602C7.08435 9.69222 6.91565 9.69222 6.75 9.66602C6.44405 9.61756 6.20088 9.46883 5.98828 9.29785C5.78438 9.13382 5.55843 8.90706 5.30273 8.65137L2.57617 5.92383L2.15137 5.5L3 4.65137L3.42383 5.07617L6.15137 7.80273C6.42595 8.07732 6.59876 8.24849 6.74023 8.3623C6.87291 8.46904 6.92272 8.47813 6.9375 8.48047C6.97895 8.48703 7.02105 8.48703 7.0625 8.48047C7.07728 8.47813 7.12709 8.46904 7.25977 8.3623C7.40124 8.24849 7.57405 8.07732 7.84863 7.80273L10.5762 5.07617L11 4.65137L11.8486 5.5Z",
							fill: "currentColor"
						})
					})
				]
			});
			const notExposedNotice = state.exposed || props.hideNotExposedNotice === true ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
				className: settings_card_module_css_default.notExposed,
				role: "status",
				children: props.t("settings.notExposed")
			});
			if (!state.exposed && props.renderChildrenWhenNotExposed !== true) return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", {
				className: cardClass,
				children: [header, bodyRegion(notExposedNotice)]
			});
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", {
				className: cardClass,
				children: [header, props.headerOnly !== true ? bodyRegion(/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
					notExposedNotice,
					!state.writable ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: settings_card_module_css_default.readOnly,
						role: "status",
						children: props.t("settings.readOnly")
					}) : null,
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(CardApply.Provider, {
						value: {
							commit: props.onSave,
							revert: props.onDiscard
						},
						children: props.children
					}),
					props.hideFooter !== true && state.failed ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
						className: settings_card_module_css_default.failed,
						role: "status",
						children: [props.t("settings.saveFailed"), state.failedReason ? " - " + state.failedReason : ""]
					}) : null
				] })) : null]
			});
		}
		/**
		* A typed value field. Its draft is written after a pause in typing, at once on
		* Enter or when focus leaves, and Escape puts the stored value back. `numeric`
		* only hints the keypad: which drafts a field accepts is decided by its spec.
		* A field given a `range` also offers the coarse slider bubble: dragging fills
		* the draft live and releasing writes it.
		*/
		function ValueField(props) {
			const apply = (0, react.useContext)(CardApply);
			const settledByKey = (0, react.useRef)(false);
			const onKeyDown = (event) => {
				if (apply === null || event.key !== "Enter" && event.key !== "Escape") return;
				event.preventDefault();
				settledByKey.current = true;
				if (event.key === "Enter") apply.commit();
				else apply.revert();
				event.currentTarget.blur();
			};
			const input = /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
				id: props.id,
				className: props.invalid ? settings_card_module_css_default.inputInvalid : settings_card_module_css_default.input,
				type: "text",
				...props.numeric === true ? { inputMode: "numeric" } : {},
				...props.invalid ? { "aria-invalid": true } : {},
				value: props.text,
				placeholder: props.placeholder ?? "",
				disabled: props.disabled,
				onChange: (event) => {
					props.onEdit(event.target.value);
				},
				onKeyDown,
				onFocus: () => {
					settledByKey.current = false;
				},
				onBlur: () => {
					if (settledByKey.current) {
						settledByKey.current = false;
						return;
					}
					apply?.commit();
				}
			});
			const { range } = props;
			const typed = Number(props.text);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: settings_card_module_css_default.field,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: settings_card_module_css_default.head,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
							className: settings_card_module_css_default.label,
							htmlFor: props.id,
							children: props.label
						}), props.overridden ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: settings_card_module_css_default.badges,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: settings_card_module_css_default.badge,
								children: props.overriddenLabel
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: settings_card_module_css_default.reset,
								disabled: props.disabled,
								onClick: props.onReset,
								children: props.resetLabel
							})]
						}) : null]
					}),
					range === void 0 ? input : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(RangeBubble, {
						min: range.min,
						max: range.max,
						step: range.step,
						value: props.text.trim() === "" || Number.isNaN(typed) ? range.min : typed,
						label: `${props.label} ${range.min}–${range.max}`,
						disabled: props.disabled,
						onInput: (value) => {
							props.onEdit(String(value));
						},
						onCommit: (value) => {
							props.onEdit(String(value));
							apply?.commit();
						},
						children: input
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: props.invalid ? settings_card_module_css_default.invalid : settings_card_module_css_default.hint,
						title: props.hintTitle,
						children: props.invalid ? props.invalidLabel : props.hint
					})
				]
			});
		}
		const NON_SKIN_BODY_MARKERS = /* @__PURE__ */ new Set(["dshSkinCenter", "dshSidebarCollapsed"]);
		function isSkinActive() {
			return Object.keys(document.body.dataset).some((key) => key.startsWith("dsh") && !NON_SKIN_BODY_MARKERS.has(key));
		}
		const SELECT_CLOSE_MS = 100;
		/**
		* The shared dual-mode select control. While an appearance skin is active it
		* renders the legacy native `<select>` untouched, so element-level skin
		* selectors keep working; under the default appearance it renders a
		* self-drawn `role="listbox"` popup whose open/close is transition-animated.
		* Cards reach it through BooleanField/ChoiceField; editors outside a card
		* (the side-card prefs) bind it directly through onEdit.
		* 双模式下拉框：皮肤激活时用原生 select，默认外观用自绘动画弹层。
		*/
		function SelectField(props) {
			const { id, options, value } = props;
			const [open, setOpen] = (0, react.useState)(false);
			const [closing, setClosing] = (0, react.useState)(false);
			const [phase, setPhase] = (0, react.useState)("initial");
			const [activeIndex, setActiveIndex] = (0, react.useState)(0);
			const closeTimer = (0, react.useRef)(void 0);
			const wrapRef = (0, react.useRef)(null);
			const popupRef = (0, react.useRef)(null);
			const currentIndex = () => {
				const index = options.findIndex((option) => option.value === value);
				return index >= 0 ? index : 0;
			};
			const close = (0, react.useCallback)(() => {
				if (closeTimer.current !== void 0) clearTimeout(closeTimer.current);
				setClosing(true);
				closeTimer.current = setTimeout(() => {
					setClosing(false);
					setOpen(false);
				}, SELECT_CLOSE_MS);
			}, []);
			const openPopup = () => {
				if (closeTimer.current !== void 0) clearTimeout(closeTimer.current);
				setActiveIndex(currentIndex());
				setPhase("initial");
				setClosing(false);
				setOpen(true);
			};
			const commit = (index) => {
				const option = options[index];
				if (option) props.onEdit(option.value);
				close();
			};
			const onTriggerClick = () => {
				if (props.disabled) return;
				if (open && !closing) close();
				else openPopup();
			};
			const onKeyDown = (event) => {
				if (props.disabled) return;
				const count = options.length;
				switch (event.key) {
					case "ArrowDown":
					case "ArrowUp":
					case "Enter":
					case " ":
						event.preventDefault();
						if (!open) openPopup();
						else if (!closing) if (event.key === "ArrowDown") setActiveIndex((index) => (index + 1) % count);
						else if (event.key === "ArrowUp") setActiveIndex((index) => (index - 1 + count) % count);
						else commit(activeIndex);
						break;
					case "Escape":
						if (open) {
							event.preventDefault();
							event.stopPropagation();
							close();
						}
						break;
					case "Tab":
						if (open) close();
						break;
				}
			};
			(0, react.useEffect)(() => () => {
				if (closeTimer.current !== void 0) clearTimeout(closeTimer.current);
			}, []);
			(0, react.useLayoutEffect)(() => {
				if (open && !closing && phase === "initial") {
					popupRef.current?.offsetHeight;
					setPhase("open");
				}
			}, [
				open,
				closing,
				phase
			]);
			(0, react.useEffect)(() => {
				if (!open) return;
				const onPointerDown = (event) => {
					const target = event.target;
					if (target instanceof Node && !wrapRef.current?.contains(target)) close();
				};
				document.addEventListener("pointerdown", onPointerDown);
				return () => document.removeEventListener("pointerdown", onPointerDown);
			}, [open, close]);
			(0, react.useEffect)(() => {
				if (props.disabled && open) close();
			}, [
				props.disabled,
				open,
				close
			]);
			if (isSkinActive()) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("select", {
				id,
				className: settings_card_module_css_default.select,
				value,
				disabled: props.disabled,
				onChange: (event) => {
					props.onEdit(event.target.value);
				},
				children: options.map((option) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
					value: option.value,
					children: option.label
				}, option.value))
			});
			const label = options.find((option) => option.value === value)?.label ?? "";
			const popupClass = closing ? `${settings_card_module_css_default.selectPopup} ${settings_card_module_css_default.selectPopupClose}` : phase === "open" ? `${settings_card_module_css_default.selectPopup} ${settings_card_module_css_default.selectPopupOpen}` : settings_card_module_css_default.selectPopup;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: settings_card_module_css_default.selectWrap,
				ref: wrapRef,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
					type: "button",
					id,
					className: `${settings_card_module_css_default.select} ${settings_card_module_css_default.selectButton}`,
					disabled: props.disabled,
					"aria-haspopup": "listbox",
					"aria-expanded": open,
					"aria-activedescendant": open ? `${id}-o${activeIndex}` : void 0,
					"aria-invalid": props.invalid || void 0,
					onClick: onTriggerClick,
					onKeyDown,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: settings_card_module_css_default.selectLabel,
						children: label
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
						width: "14",
						height: "14",
						viewBox: "0 0 14 14",
						fill: "none",
						xmlns: "http://www.w3.org/2000/svg",
						className: open ? `${settings_card_module_css_default.selectChevron} ${settings_card_module_css_default.selectChevronOpen}` : settings_card_module_css_default.selectChevron,
						"aria-hidden": "true",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							d: "M11.8486 5.5L11.4238 5.92383L8.69727 8.65137C8.44157 8.90706 8.21562 9.13382 8.01172 9.29785C7.79912 9.46883 7.55595 9.61756 7.25 9.66602C7.08435 9.69222 6.91565 9.69222 6.75 9.66602C6.44405 9.61756 6.20088 9.46883 5.98828 9.29785C5.78438 9.13382 5.55843 8.90706 5.30273 8.65137L2.57617 5.92383L2.15137 5.5L3 4.65137L3.42383 5.07617L6.15137 7.80273C6.42595 8.07732 6.59876 8.24849 6.74023 8.3623C6.87291 8.46904 6.92272 8.47813 6.9375 8.48047C6.97895 8.48703 7.02105 8.48703 7.0625 8.48047C7.07728 8.47813 7.12709 8.46904 7.25977 8.3623C7.40124 8.24849 7.57405 8.07732 7.84863 7.80273L10.5762 5.07617L11 4.65137L11.8486 5.5Z",
							fill: "currentColor"
						})
					})]
				}), open ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: popupClass,
					role: "listbox",
					ref: popupRef,
					children: options.map((option, index) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						id: `${id}-o${index}`,
						role: "option",
						"aria-selected": option.value === value,
						className: `${settings_card_module_css_default.selectOption}${option.value === value ? ` ${settings_card_module_css_default.selectOptionSelected}` : ""}${index === activeIndex && !closing ? ` ${settings_card_module_css_default.selectOptionActive}` : ""}`,
						onClick: () => {
							commit(index);
						},
						children: option.label
					}, option.value))
				}) : null]
			});
		}
		/**
		* A visible segmented group for a small set of mutually exclusive values.
		* Every option stays on screen, so inherit/on/off and short enum fields take
		* one click without opening a popup. The pressed option carries the group's
		* sliding highlight and `aria-pressed`; the group takes the field label as its
		* accessible name.
		*/
		function SegmentField(props) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SegmentGroup, {
				id: props.id,
				role: "group",
				"aria-label": props.label,
				"aria-invalid": props.invalid || void 0,
				children: props.options.map((option, index) => {
					const active = option.value === props.value;
					return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: settings_card_module_css_default.segment,
						"aria-pressed": active,
						disabled: props.disabled,
						"data-active": active ? "" : void 0,
						"data-segment-index": index,
						onClick: () => {
							if (!active) props.onEdit(option.value);
						},
						children: option.label
					}, option.value);
				})
			});
		}
		/** An enumerated field, selecting or segmenting its small choice set. */
		function ChoiceField(props) {
			const segmented = props.presentation === "segment";
			const options = [{
				value: "",
				label: props.inheritLabel
			}, ...props.choices];
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: settings_card_module_css_default.field,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: settings_card_module_css_default.head,
						children: [segmented ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: settings_card_module_css_default.label,
							children: props.label
						}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
							className: settings_card_module_css_default.label,
							htmlFor: props.id,
							children: props.label
						}), props.overridden ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: settings_card_module_css_default.badges,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: settings_card_module_css_default.badge,
								children: props.overriddenLabel
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: settings_card_module_css_default.reset,
								disabled: props.disabled,
								onClick: props.onReset,
								children: props.resetLabel
							})]
						}) : null]
					}),
					segmented ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SegmentField, {
						id: props.id,
						label: props.label,
						options,
						value: props.text,
						disabled: props.disabled,
						invalid: props.invalid,
						onEdit: props.onEdit
					}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SelectField, {
						id: props.id,
						options,
						value: props.text,
						disabled: props.disabled,
						invalid: props.invalid,
						onEdit: props.onEdit
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: props.invalid ? settings_card_module_css_default.invalid : settings_card_module_css_default.hint,
						title: props.hintTitle,
						children: props.invalid ? props.invalidLabel : props.hint
					})
				]
			});
		}
		/**
		* A boolean toggle drawn as a switch track, for a setting that is only on or
		* off and applies on flip. It is a real button with
		* `role="switch"` and `aria-checked`, so keyboard and assistive activation
		* arrive as a click and the state is announced instead of inferred from a
		* checkbox tick.
		*
		* The thumb bounces across only once the reader has pressed this switch: the
		* press writes the mark that arms the bounce, so a page opening, a TAB
		* switching back or a value arriving from elsewhere draws every thumb at rest.
		*/
		function ToggleSwitch(props) {
			const [moved, setMoved] = (0, react.useState)(false);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				type: "button",
				className: settings_card_module_css_default.toggle,
				role: "switch",
				"aria-checked": props.checked,
				"aria-labelledby": props.labelledBy,
				"aria-label": props.labelledBy === void 0 ? props.ariaLabel : void 0,
				disabled: props.disabled,
				"data-moved": moved ? "" : void 0,
				onClick: () => {
					setMoved(true);
					props.onChange(!props.checked);
				},
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: settings_card_module_css_default.toggleTrack,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { className: settings_card_module_css_default.toggleThumb })
				})
			});
		}
		/** A whole- or decimal-number field. An empty draft clears the field; any other draft that is not a finite number within the constraints stays unwritten. */
		function numberField(field, constraints = {}) {
			const { integer = false, min } = constraints;
			return {
				field,
				entry: "type",
				format: (value) => typeof value === "number" ? String(value) : "",
				parse: (text) => {
					const trimmed = text.trim();
					if (trimmed === "") return { kind: "clear" };
					const parsed = Number(trimmed);
					if (!Number.isFinite(parsed)) return void 0;
					if (integer && !Number.isInteger(parsed)) return void 0;
					if (min !== void 0 && parsed < min) return void 0;
					return {
						kind: "set",
						value: parsed
					};
				}
			};
		}
		/** A boolean field, edited through true/false draft text. */
		/** A free-text field; `pick` writes the whole value at once. */
		function textField(field, entry = "type") {
			return {
				field,
				entry,
				format: (value) => typeof value === "string" ? value : "",
				parse: (text) => {
					const trimmed = text.trim();
					return trimmed === "" ? { kind: "clear" } : { kind: "set", value: trimmed };
				}
			};
		}
		function booleanField(field) {
			return {
				field,
				entry: "pick",
				format: (value) => typeof value === "boolean" ? String(value) : "",
				parse: (text) => {
					const trimmed = text.trim();
					if (trimmed === "") return { kind: "clear" };
					if (trimmed === "true") return {
						kind: "set",
						value: true
					};
					if (trimmed === "false") return {
						kind: "set",
						value: false
					};
				}
			};
		}
		/** An enumerated string field; only the listed choices are accepted. An empty draft clears the field. */
		function choiceField(field, choices) {
			return {
				field,
				entry: "pick",
				format: (value) => typeof value === "string" && choices.includes(value) ? value : "",
				parse: (text) => {
					if (text === "") return { kind: "clear" };
					return choices.includes(text) ? {
						kind: "set",
						value: text
					} : void 0;
				}
			};
		}
		/**
		* Applies one card's edits to one settings namespace as the reader makes them.
		*
		* The Host is the only authority on whether a value was accepted — its
		* validators own the constraints no schema can express — so the outcome is
		* read back from the section rather than predicted here. A write that did not
		* land puts each pick back to the stored value, the way a switch that could not
		* flip springs back, and keeps typed text so the reader can correct it instead
		* of retyping.
		*/
		var CardForm = class {
			scope;
			specs;
			staged = /* @__PURE__ */ new Map();
			listeners = /* @__PURE__ */ new Set();
			/** The form subscription installed in the constructor; released by dispose(). */
			disposeForm;
			disposed = false;
			/** The pending write of typed text, waiting for typing to pause. */
			typePause;
			saving = false;
			/** A save asked for while one was in flight; it runs once the first settles (#1754). */
			saveQueued = false;
			failed = false;
			failedReason;
			/** @param scope - the bound configuration form for this card's namespace. */
			constructor(scope, specs) {
				this.scope = scope;
				this.specs = new Map(specs.map((spec) => [spec.field, spec]));
				this.disposeForm = scope.subscribe(() => {
					this.publish();
				});
			}
			/**
			* Release the form subscription and every bound store listener. The card
			* must call this on teardown; later calls are no-ops.
			*/
			dispose() {
				if (this.disposed) return;
				this.disposed = true;
				clearTimeout(this.typePause);
				this.disposeForm();
				this.listeners.clear();
			}
			/** Publish a projection of this form, rebuilt whenever the form or a draft changes. */
			bind(project) {
				const store = (0, _deepseek_ai_dsh_client_store.createSnapshotStore)(project());
				this.listeners.add(() => {
					store.set(project());
				});
				return store;
			}
			/** Read the card-level state: what the Host serves, and what is still waiting to be written. */
			shell() {
				const snapshot = this.scope.getSnapshot();
				const plan = this.plan();
				return {
					available: snapshot.status !== "loading",
					exposed: snapshot.status === "ready",
					writable: snapshot.writable,
					dirty: plan.length > 0,
					invalid: plan.some((item) => item.judge === void 0),
					saving: this.saving,
					failed: this.failed,
					...this.failedReason === void 0 ? {} : { failedReason: this.failedReason }
				};
			}
			/** Read one field's state from the effective section and its staged draft. */
			field(field) {
				const spec = this.specOf(field);
				const staged = this.staged.get(field);
				if (staged === void 0) return {
					text: spec.format(this.sectionValue(field)),
					overridden: this.stored(field),
					invalid: false
				};
				const write = staged.clear ? { kind: "clear" } : spec.parse(staged.text);
				return {
					text: staged.text,
					overridden: write?.kind === "set",
					invalid: write === void 0
				};
			}
			/** The actions the card's slot registration injects. */
			actions() {
				return {
					edit: (field, text) => {
						this.stage(field, {
							text,
							clear: false
						});
					},
					resetField: (field) => {
						this.stage(field, {
							text: this.specOf(field).format(this.baseValue(field)),
							clear: true
						});
					},
					save: () => {
						this.applyNow();
					},
					discard: () => {
						clearTimeout(this.typePause);
						if (this.staged.size === 0 && !this.failed) return;
						this.staged.clear();
						this.failed = false;
						this.failedReason = void 0;
						this.publish();
					}
				};
			}
			/**
			* Run one write, and re-run it once if another was asked for while this one
			* was still in flight.
			*
			* A write is a Host round trip that also drives the profile reconcile, and
			* the Host runs it inside one exclusive transaction. Answering an edit that
			* arrives mid-flight by returning immediately dropped it with no explanation
			* (#1754). Serializing instead means an edit made while another write is
			* still settling is written against the settled state.
			* @returns settlement after the mutation and the read-back.
			*/
			async requestSave() {
				if (this.saving) {
					this.saveQueued = true;
					return;
				}
				await this.save();
				if (!this.saveQueued) return;
				this.saveQueued = false;
				await this.requestSave();
			}
			/**
			* Write every valid draft in one atomic form mutation, then re-seed from
			* what the Host accepted. A draft the field does not accept stays on screen,
			* unwritten, without holding the others back.
			*
			* The batch rides one mutate, so cross-field validate hooks (baseURL+model)
			* judge it as a unit: the Host either applies every write or refuses the
			* batch. The form contract answers a refusal or a skipped write with `false`
			* (it recovers with a fresh Host view instead of throwing), so the outcome is
			* judged twice: the answer itself, and then the settled snapshot read back
			* one planned write at a time. One missed write fails the whole batch. A
			* transport that rejects instead (the dsh-web bridge controller on a dead
			* connection) reports through the same failure path with its rejection
			* message. A batch that did not land puts its picks and clears back to the
			* stored value and keeps its typed text, so the reader can correct it.
			* @returns settlement after the mutation and the read-back.
			*/
			async save() {
				const valid = this.plan().filter((item) => item.judge !== void 0);
				if (valid.length === 0 || this.saving) return;
				const pending = /* @__PURE__ */ new Map();
				for (const item of valid) pending.set(item.field, this.staged.get(item.field));
				this.saving = true;
				this.failed = false;
				this.failedReason = void 0;
				this.publish();
				const ops = valid.map((item) => item.op.op === "set" ? {
					op: "set",
					path: [item.field],
					value: item.op.value
				} : {
					op: "unset",
					path: [item.field]
				});
				let failedReason;
				let accepted = false;
				try {
					accepted = await this.scope.mutate(ops);
				} catch (error) {
					failedReason = error instanceof Error ? error.message : String(error);
				}
				const landed = accepted && failedReason === void 0 && valid.every((item) => item.judge());
				for (const [field, before] of pending) {
					if (this.staged.get(field) !== before) continue;
					if (landed || before === void 0 || before.clear || this.specOf(field).entry === "pick") this.staged.delete(field);
				}
				this.saving = false;
				this.failed = !landed;
				this.failedReason = failedReason;
				this.publish();
			}
			/**
			* Every staged edit a write would carry. An entry whose draft is not a value
			* its field accepts carries no write: the form is still dirty, and the draft
			* stays on screen rather than being dropped. A staged edit that matches the
			* effective section is not a write at all.
			* @returns the planned writes, in the order the fields were staged.
			*/
			plan() {
				const plan = [];
				for (const [field, staged] of this.staged) {
					const spec = this.specOf(field);
					if (staged.clear) {
						if (this.stored(field)) plan.push({
							field,
							op: {
								field,
								op: "unset"
							},
							judge: () => this.landedUnset(field)
						});
						continue;
					}
					if (staged.text === spec.format(this.sectionValue(field))) continue;
					const write = spec.parse(staged.text);
					if (write === void 0) plan.push({
						field,
						op: {
							field,
							op: "unset"
						},
						judge: void 0
					});
					else if (write.kind === "clear") plan.push({
						field,
						op: {
							field,
							op: "unset"
						},
						judge: () => this.landedUnset(field)
					});
					else plan.push({
						field,
						op: {
							field,
							op: "set",
							value: write.value
						},
						judge: () => this.landedSet(field, write.value)
					});
				}
				return plan;
			}
			/**
			* Read-back judgment for a planned set: the user layer must hold the
			* intended value once the mutation has settled.
			*/
			landedSet(field, value) {
				if (this.specOf(field).secret) return true;
				return this.userLayer()?.[field] === value;
			}
			/**
			* Read-back judgment for a planned unset: the field must be gone from the
			* user layer once the mutation has settled.
			*/
			landedUnset(field) {
				return !this.stored(field);
			}
			/**
			* Take one edit and schedule its write: a pick or a clear is written now,
			* typed text once typing has rested for TYPE_PAUSE_MS.
			*/
			stage(field, edit) {
				this.staged.set(field, edit);
				this.failed = false;
				this.failedReason = void 0;
				this.publish();
				if (edit.clear || this.specOf(field).entry === "pick") {
					this.applyNow();
					return;
				}
				clearTimeout(this.typePause);
				this.typePause = setTimeout(() => {
					this.applyNow();
				}, 600);
			}
			/** Write every pending draft now, taking the place of a waiting pause. */
			applyNow() {
				clearTimeout(this.typePause);
				this.typePause = void 0;
				if (this.disposed) return;
				this.requestSave();
			}
			specOf(field) {
				const spec = this.specs.get(field);
				if (spec === void 0) throw new Error(`settings card has no field ${field}`);
				return spec;
			}
			snapshotOf() {
				return this.scope.getSnapshot();
			}
			sectionValue(field) {
				return this.snapshotOf().value?.[field];
			}
			baseValue(field) {
				return this.snapshotOf().base?.[field];
			}
			userLayer() {
				return this.snapshotOf().user;
			}
			stored(field) {
				const user = this.userLayer();
				return user !== void 0 && Object.hasOwn(user, field);
			}
			publish() {
				for (const listener of this.listeners) listener();
			}
		};
		//#endregion
		//#region src/client/usage-settings-card.ts
		/** The display currencies the spend figures offer. */
		const SPEND_CURRENCIES = ["CNY", "USD"];
		/** Bounds of the poll interval, mirroring the host schema; the slider walks them in steps of 10 s. */
		const POLL_INTERVAL_RANGE = {
			min: 30,
			max: 3600,
			step: 10
		};
		/** Bridges the usage namespace onto the family card form for the plugin's lifetime. */
		var UsageSettingsCardController = class {
			form;
			store;
			/** @param scope - the bound configuration form of the usage namespace. */
			constructor(scope) {
				this.form = new CardForm(scope, [
					booleanField("enabled"),
					numberField("pollIntervalSec", {
						integer: true,
						min: POLL_INTERVAL_RANGE.min
					}),
					choiceField("spendCurrency", SPEND_CURRENCIES),
					numberField("cnyPerUsd", { min: .01 }),
					booleanField("footShowSpend"),
					booleanField("footShowUsage"),
					booleanField("footShowBalances"),
					booleanField("footShowMeters"),
					choiceField("footMeterWindow", ["week", "month"]),
					booleanField("footShowPeak"),
					booleanField("footShowUpdated"),
					booleanField("footCompact"),
					textField("hiddenBalances", "pick"),
					textField("hiddenPlans", "pick"),
					textField("balanceOrder", "pick"),
					textField("planOrder", "pick"),
					textField("providerCurrency", "pick")
				]);
				this.store = this.form.bind(() => ({
					...this.form.shell(),
					enabled: this.form.field("enabled"),
					pollIntervalSec: this.form.field("pollIntervalSec"),
					spendCurrency: this.form.field("spendCurrency"),
					cnyPerUsd: this.form.field("cnyPerUsd"),
					footShowSpend: this.form.field("footShowSpend"),
					footShowUsage: this.form.field("footShowUsage"),
					footShowBalances: this.form.field("footShowBalances"),
					footShowMeters: this.form.field("footShowMeters"),
					footMeterWindow: this.form.field("footMeterWindow"),
					footShowPeak: this.form.field("footShowPeak"),
					footShowUpdated: this.form.field("footShowUpdated"),
					footCompact: this.form.field("footCompact"),
					hiddenBalances: this.form.field("hiddenBalances"),
					hiddenPlans: this.form.field("hiddenPlans"),
					balanceOrder: this.form.field("balanceOrder"),
					planOrder: this.form.field("planOrder"),
					providerCurrency: this.form.field("providerCurrency")
				}));
			}
			/** The face the section's slot entry injects. */
			inject() {
				return {
					store: this.store,
					...this.form.actions()
				};
			}
			/** Release the form subscription; the plugin disposer calls this on teardown. */
			dispose() {
				this.form.dispose();
			}
		};
		//#endregion
		//#region src/client/UsagePage.tsx
		/**
		* The page's card: the plugin switch in the header, the statistics and the
		* display rows in the body. A switched-off plugin keeps only the header, whose
		* line says how to bring it back; a refused write keeps the body, so the
		* failure line under the rows stays readable.
		*/
		/** Order rows by a stored provider id list; unknown ids keep the tail. */
		function orderByList(rows, order) {
			const ids = order.split(",").map((entry) => entry.trim()).filter((entry) => entry !== "");
			if (ids.length === 0) return [...rows];
			const rank = new Map(ids.map((id, index) => [id, index]));
			return [...rows].sort((a, b) => (rank.get(a.provider) ?? ids.length) - (rank.get(b.provider) ?? ids.length));
		}
		function UsagePage(props) {
			const { card, face, enabled } = props;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
				className: usage_module_css_default.sectionList,
				"data-dsh-plugin": "usage",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(PluginSettingsCard, {
					t,
					titleKey: "usage.title",
					titleId: "settings-usage-title",
					descriptionKey: enabled ? "usage.description" : "usage.disabled",
					headerAction: card.exposed ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ToggleSwitch, {
						labelledBy: "settings-usage-title",
						checked: enabled,
						disabled: !card.writable,
						onChange: (next) => {
							face.edit("enabled", String(next));
						}
					}) : void 0,
					headerOnly: !enabled && !card.failed,
					state: card,
					alwaysOpen: true,
					renderChildrenWhenNotExposed: true,
					hideNotExposedNotice: true,
					onSave: face.save,
					onDiscard: face.discard,
					children: [props.children]
				})
			});
		}
		/**
		* The display rows under the statistics. Each control writes through the card
		* form: the currency pick at once, a typed number after a pause or on Enter.
		* The rate only matters while spend shows in dollars, so it appears then.
		*/
		/** One label + pill switch row, matching the plugin switch in the header. */
		function ToggleRow(props) {
			return (0, react_jsx_runtime.jsxs)("div", {
				className: usage_module_css_default.settingsToggle,
				children: [(0, react_jsx_runtime.jsx)("span", {
					className: usage_module_css_default.settingsToggleLabel,
					children: props.label
				}), (0, react_jsx_runtime.jsx)(ToggleSwitch, {
					ariaLabel: props.label,
					checked: props.checked,
					disabled: props.disabled,
					onChange: props.onChange
				})]
			});
		}

		/** A card toggle with the move-up/move-down pair that sets its order. */
		function OrderRow(props) {
			return (0, react_jsx_runtime.jsxs)("div", {
				className: usage_module_css_default.orderRow,
				children: [(0, react_jsx_runtime.jsxs)("span", {
					className: usage_module_css_default.orderButtons,
					children: [(0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: usage_module_css_default.orderBtn,
						"aria-label": t("usage.config.moveUp"),
						disabled: !props.canUp || props.disabled,
						onClick: props.onUp,
						children: "\u2191"
					}), (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: usage_module_css_default.orderBtn,
						"aria-label": t("usage.config.moveDown"),
						disabled: !props.canDown || props.disabled,
						onClick: props.onDown,
						children: "\u2193"
					})]
				}), (0, react_jsx_runtime.jsx)("span", {
					className: usage_module_css_default.settingsToggleLabel,
					children: props.label
				}), (0, react_jsx_runtime.jsx)(ToggleSwitch, {
					ariaLabel: props.label,
					checked: props.checked,
					disabled: props.disabled,
					onChange: props.onChange
				})]
			});
		}

/** Every sidebar-card setting, rendered by the Sidebar tab. */
		function SidebarCardSettings(props) {
			const { card, face } = props;
			const toggle = (field, label, checked) => (0, react_jsx_runtime.jsx)(ToggleRow, {
				label,
				checked,
				disabled: !card.writable,
				onChange: (next) => {
					face.edit(field, String(next));
				}
			}, field);
			return (0, react_jsx_runtime.jsxs)("div", {
				className: usage_module_css_default.card,
				"data-dsh-part": "foot-settings",
				children: [
					(0, react_jsx_runtime.jsx)("span", {
						className: usage_module_css_default.cardTitle,
						children: t("usage.config.footTitle")
					}),
					(0, react_jsx_runtime.jsx)("p", {
						className: usage_module_css_default.settingsGroupHint,
						children: t("usage.config.footHint")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ValueField, {
						id: "settings-usage-poll-interval",
						label: t("usage.config.pollIntervalSec"),
						hint: t("usage.config.pollIntervalHint"),
						numeric: true,
						range: POLL_INTERVAL_RANGE,
						overriddenLabel: t("settings.overridden"),
						resetLabel: t("settings.reset"),
						invalidLabel: t("settings.invalidNumber"),
						disabled: !card.writable,
						...card.pollIntervalSec,
						onEdit: (text) => {
							face.edit("pollIntervalSec", text);
						},
						onReset: () => {
							face.resetField("pollIntervalSec");
						}
					}),
					toggle("footShowSpend", t("usage.config.footShowSpend"), card.footShowSpend.text !== "false"),
					toggle("footShowUsage", t("usage.config.footShowUsage"), card.footShowUsage.text !== "false"),
					toggle("footShowBalances", t("usage.config.footShowBalances"), card.footShowBalances.text !== "false"),
					toggle("footShowMeters", t("usage.config.footShowMeters"), card.footShowMeters.text !== "false"),
					(0, react_jsx_runtime.jsx)(ChoiceField, Object.assign({
						id: "settings-usage-foot-window",
						label: t("usage.config.footMeterWindow"),
						presentation: "segment",
						choices: [{ value: "week", label: t("usage.quota.week") }, { value: "month", label: t("usage.quota.month") }],
						overriddenLabel: t("settings.overridden"),
						resetLabel: t("settings.reset"),
						disabled: !card.writable
					}, card.footMeterWindow, {
						onEdit: (text) => {
							face.edit("footMeterWindow", text);
						},
						onReset: () => {
							face.resetField("footMeterWindow");
						}
					}), "window"),
					toggle("footShowPeak", t("usage.config.footShowPeak"), card.footShowPeak.text !== "false"),
					toggle("footShowUpdated", t("usage.config.footShowUpdated"), card.footShowUpdated.text !== "false"),
					toggle("footCompact", t("usage.config.footCompact"), card.footCompact.text === "true")
				]
			});
		}

		/** Split a comma-separated hidden-provider list into a set. */
		function splitHidden(text) {
			return new Set(text.split(",").map((entry) => entry.trim()).filter((entry) => entry !== ""));
		}

		/** Provider visibility and order, rendered only by the Sidebar tab. */
		function CardVisibilitySettings(props) {
			const { card, face, providers } = props;
			const hiddenBalances = splitHidden(card.hiddenBalances.text);
			const hiddenPlans = splitHidden(card.hiddenPlans.text);
			const toggleHidden = (field, id, show) => {
				const next = splitHidden(card[field].text);
				if (show) next.delete(id);
				else next.add(id);
				face.edit(field, [...next].sort().join(","));
			};
			const planLabel = (provider) => {
				const name = provider.quota?.planName ?? provider.plan?.planName;
				return name !== void 0 ? `${provider.displayName} · ${name}` : provider.displayName;
			};
			const balanceRows = providers.filter((provider) => provider.credential !== "none" && (provider.balance !== void 0 || provider.balances !== void 0 || provider.balanceSupported === true));
			const planRows = providers.filter((provider) => provider.credential !== "none" && (provider.plan !== void 0 || provider.quota !== void 0 || provider.planSupported === true || provider.quotaSupported === true));
			const orderedBalances = orderByList(balanceRows, card.balanceOrder.text);
			const orderedPlans = orderByList(planRows, card.planOrder.text);
			const reorder = (kind, from, delta) => {
				const rows = kind === "balance" ? orderedBalances : orderedPlans;
				const ids = rows.map((row) => row.provider);
				const to = from + delta;
				if (to < 0 || to >= ids.length) return;
				const moved = ids[from];
				ids[from] = ids[to];
				ids[to] = moved;
				face.edit(kind === "balance" ? "balanceOrder" : "planOrder", ids.join(","));
			};

			return (0, react_jsx_runtime.jsxs)("section", {
						className: usage_module_css_default.settingsGroup,
						"aria-labelledby": "settings-usage-cards-title",
						"data-dsh-part": "card-settings",
						children: [
							(0, react_jsx_runtime.jsx)("h3", {
								className: usage_module_css_default.groupTitle,
								id: "settings-usage-cards-title",
								children: t("usage.config.cardsTitle")
							}),
							(0, react_jsx_runtime.jsx)("p", {
								className: usage_module_css_default.settingsGroupHint,
								children: t("usage.config.cardsHint")
							}),
							balanceRows.length === 0 && planRows.length === 0 && (0, react_jsx_runtime.jsx)("span", {
								className: usage_module_css_default.muted,
								children: t("usage.config.cardsNone")
							}),
							balanceRows.length > 0 && (0, react_jsx_runtime.jsx)("span", {
								className: usage_module_css_default.settingsSubhead,
								children: t("usage.config.balancesTitle")
							}),
							...orderedBalances.map((provider, index) => (0, react_jsx_runtime.jsx)(OrderRow, {
						label: provider.displayName,
						checked: !hiddenBalances.has(provider.provider),
						disabled: !card.writable,
						canUp: index > 0,
						canDown: index < orderedBalances.length - 1,
						onUp: () => {
							reorder("balance", index, -1);
						},
						onDown: () => {
							reorder("balance", index, 1);
						},
						onChange: (next) => {
							toggleHidden("hiddenBalances", provider.provider, next);
						}
					}, "balance-" + provider.provider)),
							planRows.length > 0 && (0, react_jsx_runtime.jsx)("span", {
								className: usage_module_css_default.settingsSubhead,
								children: t("usage.config.plansTitle")
							}),
							...orderedPlans.map((provider, index) => (0, react_jsx_runtime.jsx)(OrderRow, {
						label: planLabel(provider),
						checked: !hiddenPlans.has(provider.provider),
						disabled: !card.writable,
						canUp: index > 0,
						canDown: index < orderedPlans.length - 1,
						onUp: () => {
							reorder("plan", index, -1);
						},
						onDown: () => {
							reorder("plan", index, 1);
						},
						onChange: (next) => {
							toggleHidden("hiddenPlans", provider.provider, next);
						}
					}, "plan-" + provider.provider))
						]
					});
		}

		//#endregion
		/** The spend-currency settings, rendered on the Usage tab only. */
		function CurrencySettings(props) {
			const { card, face, providers } = props;
			const fieldProps = {
				overriddenLabel: t("settings.overridden"),
				resetLabel: t("settings.reset"),
				disabled: !card.writable
			};
			const providerRows = props.providers.filter((provider) => provider.credential !== "none" && (provider.balance !== void 0 || provider.balances !== void 0 || provider.plan !== void 0 || provider.quota !== void 0));
			const providerCurrencies = parseProviderCurrencies(card.providerCurrency.text);
			const writeProviderCurrency = (id, choice) => {
				const next = parseProviderCurrencies(card.providerCurrency.text);
				if (choice === void 0 || choice === "native") next.delete(id);
				else next.set(id, choice);
				face.edit("providerCurrency", [...next].map(([key, value]) => key + ":" + value).join(","));
			};
			return (0, react_jsx_runtime.jsxs)("div", {
				className: usage_module_css_default.card,
				"data-dsh-part": "currency-settings",
				children: [(0, react_jsx_runtime.jsx)("span", {
					className: usage_module_css_default.cardTitle,
					children: t("usage.config.currencyTitle")
				}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ChoiceField, {
						id: "settings-usage-spend-currency",
						label: t("usage.config.spendCurrency"),
						hint: t("usage.config.spendCurrencyHint"),
						inheritLabel: t("settings.inherit"),
						presentation: "segment",
						choices: SPEND_CURRENCIES.map((currency) => ({
							value: currency,
							label: currency
						})),
						...fieldProps,
						...card.spendCurrency,
						onEdit: (text) => {
							face.edit("spendCurrency", text);
						},
						onReset: () => {
							face.resetField("spendCurrency");
						}
					}),
					card.spendCurrency.text === "USD" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ValueField, {
						id: "settings-usage-cny-per-usd",
						label: t("usage.config.cnyPerUsd"),
						hint: t("usage.config.cnyPerUsdHint"),
						numeric: true,
						...fieldProps,
						...card.cnyPerUsd,
						onEdit: (text) => {
							face.edit("cnyPerUsd", text);
						},
						onReset: () => {
							face.resetField("cnyPerUsd");
						}
					}) : null,
					providerRows.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: usage_module_css_default.settingsSubhead,
						children: t("usage.config.providerCurrencies")
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: usage_module_css_default.settingsGroupHint,
						children: t("usage.config.providerCurrenciesHint")
					}), providerRows.map((provider) => {
						const current = providerCurrencies.get(provider.provider) ?? "native";
						const choices = [["native", t("usage.currency.native")], ["CNY", "CNY"], ["USD", "USD"], ["both", t("usage.currency.both")]];
						const buttons = choices.map(([value, label]) => react.createElement("button", {
							key: value,
							type: "button",
							className: usage_module_css_default.currencyChoice,
							"data-active": current === value ? "" : void 0,
							disabled: !card.writable,
							onClick: () => {
								writeProviderCurrency(provider.provider, value);
							}
						}, label));
						if (current !== "native") buttons.push(react.createElement("button", {
							key: "reset",
							type: "button",
							className: usage_module_css_default.currencyReset,
							disabled: !card.writable,
							onClick: () => {
								writeProviderCurrency(provider.provider, void 0);
							}
						}, t("settings.reset")));
						return react.createElement("div", {
							key: provider.provider,
							className: usage_module_css_default.currencyRow
						}, react.createElement("span", {
							className: usage_module_css_default.currencyName
						}, provider.displayName), react.createElement("span", {
							className: usage_module_css_default.currencyChoices,
							role: "group",
							"aria-label": provider.displayName
						}, buttons));
					})] }),
				]
			});
		}

		//#region src/core/adapters.ts
		/** Parse a string/number into a finite number, else undefined. */
		function toNum(value) {
			if (typeof value === "number") return Number.isFinite(value) ? value : void 0;
			if (typeof value === "string" && value.trim() !== "") {
				const parsed = Number(value);
				return Number.isFinite(parsed) ? parsed : void 0;
			}
		}
		/** Read a string field that must be a non-empty string. */
		function str(value) {
			return typeof value === "string" && value.trim() !== "" ? value.trim() : void 0;
		}
		/** Clamp a provider percentage into the renderable 0-100 band. */
		function clampPercent(value) {
			return Math.max(0, Math.min(100, value));
		}
		/** Format a number to a fixed 2-decimal display string. */
		function money(value) {
			return value.toFixed(2);
		}
		/** Millisecond epoch or ISO string → normalized ISO 8601, else undefined. */
		function toIso(value) {
			if (typeof value === "number" && Number.isFinite(value) && value > 0) {
				const ms = value < 0xe8d4a51000 ? value * 1e3 : value;
				const date = new Date(ms);
				return Number.isNaN(date.getTime()) ? void 0 : date.toISOString();
			}
			const text = str(value);
			if (text === void 0) return void 0;
			if (/^\d+$/.test(text)) return toIso(Number(text));
			const date = new Date(text);
			return Number.isNaN(date.getTime()) ? void 0 : date.toISOString();
		}
		/** Used-percent helper guarding zero/absent limits. */
		function usedPercent(used, limit) {
			const usedNum = toNum(used);
			const limitNum = toNum(limit);
			if (usedNum === void 0 || limitNum === void 0 || limitNum <= 0) return void 0;
			return Math.max(0, Math.min(100, usedNum / limitNum * 100));
		}
		function bearer(apiKey) {
			return { authorization: `Bearer ${apiKey}` };
		}
		const DEEPSEEK = {
			ids: ["deepseek", "deepseek-official"],
			familyOnlyIds: ["deepseek-account"],
			displayName: "DeepSeek",
			balance: {
				origin: "https://api.deepseek.com",
				build: ({ apiKey }) => ({
					url: "https://api.deepseek.com/user/balance",
					headers: bearer(apiKey)
				}),
				parse: (status, body) => {
					if (status !== 200 || typeof body !== "object" || body === null) return void 0;
					const infos = body.balance_infos;
					if (!Array.isArray(infos) || infos.length === 0) return void 0;
					const first = infos[0];
					if (typeof first !== "object" || first === null) return void 0;
					const currency = str(first.currency);
					const total = str(first.total_balance);
					if (currency === void 0 || total === void 0) return void 0;
					return {
						currency,
						totalBalance: total
					};
				}
			}
		};
		/** Moonshot pay-as-you-go balance; CN bills in CNY, international in USD. */
		function moonshotBalance(host, currency, ids) {
			return {
				ids,
				displayName: "Moonshot AI",
				balance: {
					build: ({ apiKey }) => ({
						url: `https://${host}/v1/users/me/balance`,
						headers: bearer(apiKey)
					}),
					parse: (status, body) => {
						if (status !== 200 || typeof body !== "object" || body === null) return void 0;
						const data = body.data;
						if (typeof data !== "object" || data === null) return void 0;
						const available = toNum(data.available_balance);
						if (available === void 0) return void 0;
						return {
							currency,
							totalBalance: money(available)
						};
					}
				}
			};
		}
		/** Kimi For Coding quota: top-level `usage` is the weekly summary, `limits[]` the per-window rows. */
		const KIMI_CODING = {
			ids: ["kimi-coding"],
			displayName: "Kimi For Coding",
			plan: {
				build: ({ apiKey }) => ({
					url: "https://api.kimi.com/coding/v1/usages",
					headers: bearer(apiKey)
				}),
				parse: (status, body) => {
					if (status !== 200 || typeof body !== "object" || body === null) return void 0;
					const root = body;
					const windows = [];
					const limits = root.limits;
					if (Array.isArray(limits)) for (const entry of limits) {
						if (typeof entry !== "object" || entry === null) continue;
						const detail = entry.detail;
						const window = entry.window;
						if (typeof detail !== "object" || detail === null) continue;
						const row = detail;
						const duration = typeof window === "object" && window !== null ? toNum(window.duration) : void 0;
						const unit = typeof window === "object" && window !== null ? str(window.timeUnit) : void 0;
						const key = duration === 300 && unit === "TIME_UNIT_MINUTE" ? "5h" : duration !== void 0 ? `w-${duration}` : "window";
						const percent = usedPercent(row.used, row.limit);
						windows.push({
							key,
							name: str(row.name),
							percent,
							resetsAt: toIso(row.resetTime)
						});
					}
					const usage = root.usage;
					if (typeof usage === "object" && usage !== null) {
						const weekly = usage;
						windows.push({
							key: "week",
							name: "Weekly",
							percent: usedPercent(weekly.used, weekly.limit),
							resetsAt: toIso(weekly.resetTime)
						});
					}
					if (windows.length === 0) return void 0;
					const user = root.user;
					const membership = typeof user === "object" && user !== null ? user.membership : void 0;
					return {
						planName: typeof membership === "object" && membership !== null ? str(membership.level) : void 0,
						windows
					};
				}
			}
		};
		/**
		* GLM Coding Plan quota windows, keyed by the provider's own `unit` code
		* rather than by row position so an added or reordered limit cannot shift a
		* window's meaning: 3 = the rolling 5-hour window, 6 = the weekly window,
		* 5 = the monthly one. Two row kinds carry quota — `TOKENS_LIMIT` (token
		* plans) and `CREDIT_LIMIT` (credit plans, whose exact ratio is
		* `currentValue` / `usage`) — while `TIME_LIMIT` is the MCP request cap and
		* is not a plan window at all. Auth is the RAW key without a Bearer prefix.
		*/
		const GLM_UNIT_KEYS = {
			3: "5h",
			5: "month",
			6: "week"
		};
		/** Percent from a credit row's exact ratio, else the provider's own percentage. */
		function glmCreditPercent(row) {
			const used = toNum(row.currentValue);
			const limit = toNum(row.usage);
			if (used !== void 0 && limit !== void 0 && limit > 0) return clampPercent(used / limit * 100);
			const percentage = toNum(row.percentage);
			return percentage === void 0 ? void 0 : clampPercent(percentage);
		}
		function glmPlan(host, ids) {
			return {
				ids,
				displayName: "GLM Coding Plan",
				plan: {
					build: ({ apiKey }) => ({
						url: `https://${host}/api/monitor/usage/quota/limit`,
						headers: {
							authorization: apiKey,
							"accept-language": "en-US,en"
						}
					}),
					parse: (status, body) => {
						if (status !== 200 || typeof body !== "object" || body === null) return void 0;
						const root = body;
						if (root.success !== true) return void 0;
						const data = root.data;
						if (typeof data !== "object" || data === null) return void 0;
						const limits = data.limits;
						if (!Array.isArray(limits)) return void 0;
						const windows = [];
						for (const entry of limits) {
							if (typeof entry !== "object" || entry === null) continue;
							const row = entry;
							const kind = str(row.type);
							if (kind === "TIME_LIMIT") continue;
							const key = GLM_UNIT_KEYS[toNum(row.unit) ?? NaN];
							if (key === void 0) continue;
							if (kind !== "TOKENS_LIMIT" && kind !== "CREDIT_LIMIT") continue;
							windows.push({
								key,
								percent: kind === "CREDIT_LIMIT" ? glmCreditPercent(row) : (() => {
									const percentage = toNum(row.percentage);
									return percentage === void 0 ? void 0 : clampPercent(percentage);
								})(),
								resetsAt: toIso(row.nextResetTime)
							});
						}
						if (windows.length === 0) return void 0;
						return {
							planName: str(data.level),
							windows
						};
					}
				}
			};
		}
		/** OpenCode Go quota: percent-only rolling/weekly/monthly windows. */
		const OPENCODE_GO = {
			ids: ["opencode-go"],
			displayName: "OpenCode Go",
			plan: {
				build: ({ apiKey }) => ({
					url: "https://opencode.ai/zen/go/v1/usage",
					headers: bearer(apiKey)
				}),
				parse: (status, body) => {
					if (status !== 200 || typeof body !== "object" || body === null) return void 0;
					const usage = body.usage;
					if (typeof usage !== "object" || usage === null) return void 0;
					const windows = [];
					for (const [field, key] of [
						["rolling", "5h"],
						["weekly", "week"],
						["monthly", "month"]
					]) {
						const entry = usage[field];
						if (typeof entry !== "object" || entry === null) continue;
						const row = entry;
						const percent = toNum(row.percent);
						windows.push({
							key,
							percent: percent === void 0 ? void 0 : Math.max(0, Math.min(100, percent)),
							resetsAt: percent === 0 ? void 0 : toIso(row.resetsAt)
						});
					}
					if (windows.length === 0) return void 0;
					return { windows };
				}
			}
		};
		/** MiniMax coding-plan remains: remaining-percent semantics, `general` model entry. */
		function minimaxPlan(host, ids) {
			return {
				ids,
				displayName: "MiniMax Coding Plan",
				plan: {
					build: ({ apiKey }) => ({
						url: `https://${host}/v1/api/openplatform/coding_plan/remains`,
						headers: bearer(apiKey)
					}),
					parse: (status, body) => {
						if (status !== 200 || typeof body !== "object" || body === null) return void 0;
						const remains = body.model_remains;
						if (!Array.isArray(remains)) return void 0;
						const general = remains.find((entry) => typeof entry === "object" && entry !== null && entry.model_name === "general");
						if (typeof general !== "object" || general === null) return void 0;
						const row = general;
						const windows = [];
						const intervalRemaining = toNum(row.current_interval_remaining_percent);
						if (intervalRemaining !== void 0) windows.push({
							key: "5h",
							percent: Math.max(0, Math.min(100, 100 - intervalRemaining)),
							resetsAt: toIso(row.end_time)
						});
						if (row.current_weekly_status === 1) {
							const weeklyRemaining = toNum(row.current_weekly_remaining_percent);
							if (weeklyRemaining !== void 0) windows.push({
								key: "week",
								percent: Math.max(0, Math.min(100, 100 - weeklyRemaining)),
								resetsAt: toIso(row.weekly_end_time)
							});
						}
						if (windows.length === 0) return void 0;
						return { windows };
					}
				}
			};
		}
		const OPENROUTER = {
			ids: ["openrouter"],
			displayName: "OpenRouter",
			balance: {
				build: ({ apiKey }) => ({
					url: "https://openrouter.ai/api/v1/credits",
					headers: bearer(apiKey)
				}),
				parse: (status, body) => {
					if (status !== 200 || typeof body !== "object" || body === null) return void 0;
					const data = body.data;
					if (typeof data !== "object" || data === null) return void 0;
					const credits = toNum(data.total_credits);
					const used = toNum(data.total_usage) ?? 0;
					if (credits === void 0) return void 0;
					return {
						currency: "USD",
						totalBalance: money(credits - used)
					};
				}
			}
		};
		function siliconFlow(host, ids, currency) {
			return {
				ids,
				displayName: "SiliconFlow",
				balance: {
					build: ({ apiKey }) => ({
						url: `https://${host}/v1/user/info`,
						headers: bearer(apiKey)
					}),
					parse: (status, body) => {
						if (status !== 200 || typeof body !== "object" || body === null) return void 0;
						const data = body.data;
						if (typeof data !== "object" || data === null) return void 0;
						const total = str(data.totalBalance);
						if (total === void 0) return void 0;
						return {
							currency,
							totalBalance: total
						};
					}
				}
			};
		}
		const ZENMUX = {
			ids: ["zenmux"],
			displayName: "ZenMux",
			balance: {
				build: ({ apiKey }) => ({
					url: "https://zenmux.ai/api/v1/management/payg/balance",
					headers: bearer(apiKey)
				}),
				parse: (status, body) => {
					if (status !== 200 || typeof body !== "object" || body === null) return void 0;
					const data = body.data;
					if (typeof data !== "object" || data === null) return void 0;
					const credits = toNum(data.total_credits);
					if (credits === void 0) return void 0;
					return {
						currency: "USD",
						totalBalance: money(credits)
					};
				}
			}
		};
		/**
		* OpenAI Codex (ChatGPT subscription) quota over the OAuth access token the
		* pi-ai grant stores — the one plan adapter whose credential is an OAuth
		* token rather than an API key. A 401 here means the stored access token has
		* expired; it refreshes when the harness next runs a Codex request, so the
		* error line tells the user to use Codex once and refresh.
		*/
		const OPENAI_CODEX = {
			ids: ["openai-codex"],
			displayName: "Codex (ChatGPT 订阅)",
			plan: {
				build: ({ apiKey, accountId }) => ({
					url: "https://chatgpt.com/backend-api/wham/usage",
					headers: {
						authorization: `Bearer ${apiKey}`,
						"user-agent": "codex-cli",
						accept: "application/json",
						...accountId !== void 0 ? { "chatgpt-account-id": accountId } : {}
					}
				}),
				parse: (status, body) => {
					if (status !== 200 || typeof body !== "object" || body === null) return void 0;
					const rateLimit = body.rate_limit;
					if (typeof rateLimit !== "object" || rateLimit === null) return void 0;
					const windows = [];
					const rows = rateLimit.primary_window !== void 0 || rateLimit.secondary_window !== void 0 ? [rateLimit.primary_window, rateLimit.secondary_window] : [];
					for (const entry of rows) {
						if (typeof entry !== "object" || entry === null) continue;
						const row = entry;
						const percent = toNum(row.used_percent);
						if (percent === void 0) continue;
						const seconds = toNum(row.limit_window_seconds);
						windows.push({
							key: codexWindowKey(seconds),
							percent: Math.max(0, Math.min(100, percent)),
							resetsAt: toIso(row.reset_at)
						});
					}
					if (windows.length === 0) return void 0;
					return { windows };
				}
			}
		};
		/** Map a Codex window length in seconds onto the shared window key vocabulary. */
		function codexWindowKey(seconds) {
			if (seconds === void 0) return "window";
			if (seconds === 18e3) return "5h";
			if (seconds === 604800) return "week";
			if (seconds === 2592e3) return "month";
			const hours = seconds / 3600;
			return hours >= 24 ? `${Math.round(hours / 24)}_day` : `${Math.round(hours)}_hour`;
		}
		/**
		* The adapter registry, in no particular order. Route keys come from the
		* pi-ai provider catalog plus the routes this deployment observed in user
		* configuration (`zenmux`).
		*/
		const PROVIDER_ADAPTERS = [
			DEEPSEEK,
			moonshotBalance("api.moonshot.cn", "CNY", ["moonshotai-cn"]),
			moonshotBalance("api.moonshot.ai", "USD", ["moonshotai"]),
			KIMI_CODING,
			glmPlan("open.bigmodel.cn", ["zai-coding-cn"]),
			glmPlan("api.z.ai", ["zai", "zai-coding"]),
			OPENCODE_GO,
			minimaxPlan("api.minimaxi.com", ["minimax-cn"]),
			minimaxPlan("api.minimax.io", ["minimax"]),
			OPENAI_CODEX,
			OPENROUTER,
			siliconFlow("api.siliconflow.cn", ["siliconflow", "siliconflow-cn"], "CNY"),
			siliconFlow("api.siliconflow.com", ["siliconflow-intl"], "USD"),
			ZENMUX
		];
		/** Find the adapter serving a provider route key, if any. */
		function adapterFor(provider) {
			return PROVIDER_ADAPTERS.find((adapter) => adapter.ids.includes(provider));
		}
		/**
		* Whether a provider route belongs to the official DeepSeek family: the only
		* family with a spend price book and a settings-section-owned env credential
		* (llm-deepseek) rather than a pi-ai profile. Drives the fold-time cost
		* stamping and the client fold-time spend estimate.
		*
		* Family membership is wider than the probe directory. The account route
		* (deepseek-account) bills the same account but authenticates with the account
		* token, so it prices and mints while `adapterFor()` still returns undefined
		* for it and no probe or env-credential fallback can reach it. Every caller of
		* this predicate is an accounting decision; the credential and probing
		* decisions read `adapterFor()` instead, so the two never widen together
		* (issue #1772).
		*/
		function isDeepSeekProviderRoute(provider) {
			if (adapterFor(provider) === DEEPSEEK) return true;
			return DEEPSEEK.familyOnlyIds?.includes(provider) === true;
		}
		//#endregion
		//#region src/core/holidays.ts
		/**
		* Chinese public-holiday dates, Beijing calendar days, as `YYYY-MM-DD`.
		*
		* The DeepSeek peak rule bills a public holiday off-peak in full, and the
		* State Council publishes these dates per year, so they cannot be derived
		* from a rule. This module is that data; `pricing.ts` keeps the arithmetic.
		*
		* Adjusted workdays are deliberately absent: the provider counts the
		* calendar day, so an adjusted Saturday or Sunday is off-peak exactly like
		* any other weekend and listing it would price it as peak.
		*
		* Source: the yearly schedules in bastengao/chinese-holidays-node
		* (`data/<year>.json`, MIT). Only the `holiday` entries are taken; that
		* package's runtime code (which fetches over the network) and its
		* dependencies are not vendored.
		*
		* Coverage ends at the newest year below. A year with no entry is priced as
		* if it had no holidays, which is the documented default of
		* {@link PublicHolidayCalendar} in `pricing.ts`.
		* @module @legifyx/dsh-usage/core/holidays
		*/
		/** Public-holiday dates keyed by Beijing calendar year. */
		const CHINESE_PUBLIC_HOLIDAYS = {
			"2020": [
				"2020-01-24",
				"2020-01-25",
				"2020-01-26",
				"2020-01-27",
				"2020-01-28",
				"2020-01-29",
				"2020-01-30",
				"2020-04-04",
				"2020-04-05",
				"2020-04-06",
				"2020-05-01",
				"2020-05-02",
				"2020-05-03",
				"2020-05-04",
				"2020-05-05",
				"2020-06-25",
				"2020-06-26",
				"2020-06-27",
				"2020-10-01",
				"2020-10-02",
				"2020-10-03",
				"2020-10-04",
				"2020-10-05",
				"2020-10-06",
				"2020-10-07",
				"2020-10-08"
			],
			"2021": [
				"2021-01-01",
				"2021-01-02",
				"2021-01-03",
				"2021-02-11",
				"2021-02-12",
				"2021-02-13",
				"2021-02-14",
				"2021-02-15",
				"2021-02-16",
				"2021-02-17",
				"2021-04-03",
				"2021-04-04",
				"2021-04-05",
				"2021-05-01",
				"2021-05-02",
				"2021-05-03",
				"2021-05-04",
				"2021-05-05",
				"2021-06-12",
				"2021-06-13",
				"2021-06-14",
				"2021-09-19",
				"2021-09-20",
				"2021-09-21",
				"2021-10-01",
				"2021-10-02",
				"2021-10-03",
				"2021-10-04",
				"2021-10-05",
				"2021-10-06",
				"2021-10-07"
			],
			"2022": [
				"2022-01-01",
				"2022-01-02",
				"2022-01-03",
				"2022-01-31",
				"2022-02-01",
				"2022-02-02",
				"2022-02-03",
				"2022-02-04",
				"2022-02-05",
				"2022-02-06",
				"2022-04-03",
				"2022-04-04",
				"2022-04-05",
				"2022-04-30",
				"2022-05-01",
				"2022-05-02",
				"2022-05-03",
				"2022-05-04",
				"2022-06-03",
				"2022-06-04",
				"2022-06-05",
				"2022-09-10",
				"2022-09-11",
				"2022-09-12",
				"2022-10-01",
				"2022-10-02",
				"2022-10-03",
				"2022-10-04",
				"2022-10-05",
				"2022-10-06",
				"2022-10-07"
			],
			"2023": [
				"2022-12-31",
				"2023-01-01",
				"2023-01-02",
				"2023-01-21",
				"2023-01-22",
				"2023-01-23",
				"2023-01-24",
				"2023-01-25",
				"2023-01-26",
				"2023-01-27",
				"2023-04-29",
				"2023-04-30",
				"2023-05-01",
				"2023-05-02",
				"2023-05-03",
				"2023-06-22",
				"2023-06-23",
				"2023-06-24",
				"2023-09-29",
				"2023-09-30",
				"2023-10-01",
				"2023-10-02",
				"2023-10-03",
				"2023-10-04",
				"2023-10-05",
				"2023-10-06"
			],
			"2024": [
				"2023-12-30",
				"2023-12-31",
				"2024-01-01",
				"2024-02-10",
				"2024-02-11",
				"2024-02-12",
				"2024-02-13",
				"2024-02-14",
				"2024-02-15",
				"2024-02-16",
				"2024-02-17",
				"2024-04-04",
				"2024-04-05",
				"2024-04-06",
				"2024-05-01",
				"2024-05-02",
				"2024-05-03",
				"2024-05-04",
				"2024-05-05",
				"2024-06-08",
				"2024-06-09",
				"2024-06-10",
				"2024-09-15",
				"2024-09-16",
				"2024-09-17",
				"2024-10-01",
				"2024-10-02",
				"2024-10-03",
				"2024-10-04",
				"2024-10-05",
				"2024-10-06",
				"2024-10-07"
			],
			"2025": [
				"2025-01-28",
				"2025-01-29",
				"2025-01-30",
				"2025-01-31",
				"2025-02-01",
				"2025-02-02",
				"2025-02-03",
				"2025-02-04",
				"2025-04-04",
				"2025-04-05",
				"2025-04-06",
				"2025-05-01",
				"2025-05-02",
				"2025-05-03",
				"2025-05-04",
				"2025-05-05",
				"2025-05-31",
				"2025-06-01",
				"2025-06-02",
				"2025-10-01",
				"2025-10-02",
				"2025-10-03",
				"2025-10-04",
				"2025-10-05",
				"2025-10-06",
				"2025-10-07",
				"2025-10-08"
			],
			"2026": [
				"2026-01-01",
				"2026-01-02",
				"2026-01-03",
				"2026-02-15",
				"2026-02-16",
				"2026-02-17",
				"2026-02-18",
				"2026-02-19",
				"2026-02-20",
				"2026-02-21",
				"2026-02-22",
				"2026-02-23",
				"2026-04-04",
				"2026-04-05",
				"2026-04-06",
				"2026-05-01",
				"2026-05-02",
				"2026-05-03",
				"2026-05-04",
				"2026-05-05",
				"2026-06-19",
				"2026-06-20",
				"2026-06-21",
				"2026-09-25",
				"2026-09-26",
				"2026-09-27",
				"2026-10-01",
				"2026-10-02",
				"2026-10-03",
				"2026-10-04",
				"2026-10-05",
				"2026-10-06",
				"2026-10-07"
			]
		};
		//#endregion
		//#region src/core/pricing.ts
		/** The published peak windows: weekday 09:00-12:00 and 14:00-18:00. */
		const PEAK_WINDOWS = [{
			from: 540,
			to: 720
		}, {
			from: 840,
			to: 1080
		}];
		/** Beijing is UTC+8 year-round (no DST), so a fixed shift is exact. */
		const BEIJING_UTC_OFFSET_MS = 8 * 36e5;
		function withinWindow(minuteOfDay) {
			return PEAK_WINDOWS.find((window) => minuteOfDay >= window.from && minuteOfDay < window.to);
		}
		/**
		* The default calendar: the published Chinese public-holiday table, so a holiday
		* weekday prices off-peak instead of over-reporting at the peak rate. A year the
		* table does not cover holds no dates and falls back to peak on weekdays, which
		* is the safe direction to be wrong in: the estimate reads high rather than low.
		*/
		const CN_PUBLIC_HOLIDAYS = { isPublicHoliday: (date) => {
			const year = date.slice(0, 4);
			if (Number(year) > 2026) return false;
			return CHINESE_PUBLIC_HOLIDAYS[year]?.includes(date) ?? false;
		} };
		/** The Beijing-time `YYYY-MM-DD` calendar day of `ms` (UTC+8 has no DST, so the shift is exact). */
		function beijingDate(ms) {
			const shifted = new Date(ms + BEIJING_UTC_OFFSET_MS);
			const month = `${shifted.getUTCMonth() + 1}`.padStart(2, "0");
			const day = `${shifted.getUTCDate()}`.padStart(2, "0");
			return `${shifted.getUTCFullYear()}-${month}-${day}`;
		}
		/**
		* Whether `ms` falls on a peak-eligible Beijing day: Monday-Friday that is
		* not a public holiday. A Saturday or Sunday is never eligible, including on
		* an adjusted workday — the provider counts the calendar day, not the
		* working schedule.
		*/
		function isPeakDay(ms, calendar) {
			const weekday = new Date(ms + BEIJING_UTC_OFFSET_MS).getUTCDay();
			if (weekday < 1 || weekday > 5) return false;
			return !calendar.isPublicHoliday(beijingDate(ms));
		}
		/**
		* The DeepSeek billing period at `ms`, plus when it next flips. The clock is
		* Beijing time regardless of the host timezone (UTC+8 has no DST, so a fixed
		* shift is exact). `boundaryMs` is the instant the current period ends — the
		* window's close while peaking, the next window's open otherwise.
		*/
		function deepseekPeriodAt(ms, calendar = CN_PUBLIC_HOLIDAYS) {
			const shifted = new Date(ms + BEIJING_UTC_OFFSET_MS);
			const minuteOfDay = shifted.getUTCHours() * 60 + shifted.getUTCMinutes();
			const current = isPeakDay(ms, calendar) ? withinWindow(minuteOfDay) : void 0;
			if (current !== void 0) return {
				peak: true,
				boundaryMs: ms + (current.to - minuteOfDay) * 6e4 - shifted.getUTCSeconds() * 1e3 - shifted.getUTCMilliseconds()
			};
			for (let dayOffset = 0; dayOffset < 8; dayOffset += 1) {
				const dayStartMs = ms + dayOffset * 864e5;
				if (!isPeakDay(dayStartMs, calendar)) continue;
				const day = new Date(dayStartMs + BEIJING_UTC_OFFSET_MS);
				const realDayStart = Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate()) - BEIJING_UTC_OFFSET_MS;
				for (const window of PEAK_WINDOWS) {
					if (dayOffset === 0 && window.from <= minuteOfDay) continue;
					return {
						peak: false,
						boundaryMs: realDayStart + window.from * 6e4
					};
				}
			}
			return {
				peak: false,
				boundaryMs: ms + 864e5
			};
		}
		//#endregion
		//#region src/core/ledger.ts
		/** Total tokens of a bucket (billed input + output; reasoning is inside output). */
		function totalTokens(totals) {
			return totals.inputTokens + totals.cacheReadTokens + totals.cacheWriteTokens + totals.outputTokens;
		}
		//#endregion
		//#region src/core/spend.ts
		/**
		* The rate used when the row configures none: a plain default, so an
		* unconfigured display still has a defined美元 figure instead of a blank card.
		* The plugin never fetches a live rate (its host routes are loopback-fenced and
		* its browser half has no network), so there is no fetch that could fail and
		* leave the card empty.
		*/
		const DEFAULT_CNY_PER_USD = 7.2;
		/** The display used when the row carries no setting: the historical CNY rendering. */
		const DEFAULT_SPEND_DISPLAY = {
			currency: "CNY",
			cnyPerUsd: DEFAULT_CNY_PER_USD
		};
		/**
		* Render one stored CNY cost in the display currency.
		* A non-finite or negative cost renders as zero rather than as `NaN`/`¥-0.10`.
		* @param costCny - the stored cost in CNY.
		* @param display - the display to render in; defaults to CNY.
		* @returns the formatted amount with its currency symbol.
		*/
		function formatSpend(costCny, display = DEFAULT_SPEND_DISPLAY) {
			const safe = Number.isFinite(costCny) && costCny > 0 ? costCny : 0;
			if (display.currency === "USD") return "$" + (safe / (Number.isFinite(display.cnyPerUsd) && display.cnyPerUsd > 0 ? display.cnyPerUsd : DEFAULT_CNY_PER_USD)).toFixed(2);
			return "¥" + safe.toFixed(2);
		}
		/** Parse the per-provider currency list (`provider:choice,...`). */
		function parseProviderCurrencies(text) {
			const map = /* @__PURE__ */ new Map();
			for (const entry of text.split(",")) {
				const at = entry.indexOf(":");
				if (at < 0) continue;
				const id = entry.slice(0, at).trim();
				const choice = entry.slice(at + 1).trim();
				if (id === "") continue;
				if (choice === "native" || choice === "CNY" || choice === "USD" || choice === "both") map.set(id, choice);
			}
			return map;
		}
		/** Format one provider's spend in the currency the reader picked. */
		function formatProviderSpend(costCny, costUsd, choice, display = DEFAULT_SPEND_DISPLAY) {
			const cny = Number.isFinite(costCny) && costCny > 0 ? costCny : 0;
			const rate = Number.isFinite(display.cnyPerUsd) && display.cnyPerUsd > 0 ? display.cnyPerUsd : DEFAULT_CNY_PER_USD;
			const usd = Number.isFinite(costUsd) && costUsd > 0 ? costUsd : cny / rate;
			const cnyText = "¥" + cny.toFixed(2);
			const usdText = "$" + usd.toFixed(2);
			if (choice === "USD") return usdText;
			if (choice === "both") return cnyText + " / " + usdText;
			return cnyText;
		}
		//#endregion
		//#region src/client/UsageSectionCard.tsx
		/**
		* The usage statistics settings page: one family settings card whose header
		* carries the plugin switch, whose body holds three tabs (用量: today's
		* usage, balances, trend; 个人套餐: per-provider plan quota windows; Token
		* (Sidebar: the glance card and its switches))
		* and, under them, the display rows. Data comes from the host's
		* loopback-fenced /api/dsh-usage/overview document; polling runs only while
		* the section is mounted and the tab is visible.
		* @module @legifyx/dsh-usage/client/UsageSectionCard
		*/
		/** Poll cadence while the section is open. */
		const SECTION_POLL_MS = 1e4;
		/** Compact token count: 12345 -> 12.3k, 1234567 -> 1.23M. */
		function formatTokens(value) {
			if (!Number.isFinite(value) || value <= 0) return "0";
			if (value < 1e3) return String(value);
			if (value < 1e6) return trim(value / 1e3) + "k";
			if (value < 1e9) return trim(value / 1e6) + "M";
			return trim(value / 1e9) + "B";
		}
		function trim(value) {
			return value >= 100 ? String(Math.round(value)) : value.toFixed(value >= 10 ? 1 : 2).replace(/\.?0+$/, "");
		}
		function formatTime(ms) {
			try {
				return new Date(ms).toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
					second: "2-digit",
					hourCycle: "h23"
				});
			} catch {
				return "";
			}
		}
		function toneClass(percent) {
			if (percent >= 90) return usage_module_css_default.barLow;
			if (percent >= 70) return usage_module_css_default.barWarn;
			return usage_module_css_default.barFill;
		}
		/** A provider row backed by a configured credential (api key, env key, or OAuth grant). */
		function isConfigured(provider) {
			return provider.credential !== "none";
		}
		function TotalsRow(props) {
			const { totals } = props;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: usage_module_css_default.statRow,
				"data-dsh-layout": "usage-totals",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: usage_module_css_default.stat,
						"data-dsh-stat": "total",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: usage_module_css_default.statValue,
							children: formatTokens(totals.inputTokens + totals.cacheReadTokens + totals.cacheWriteTokens + totals.outputTokens)
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: usage_module_css_default.statLabel,
							children: t("usage.tokens.total")
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: usage_module_css_default.stat,
						"data-dsh-stat": "input",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: usage_module_css_default.statValue,
							children: formatTokens(totals.inputTokens + totals.cacheReadTokens + totals.cacheWriteTokens)
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: usage_module_css_default.statLabel,
							children: t("usage.tokens.input")
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: usage_module_css_default.stat,
						"data-dsh-stat": "output",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: usage_module_css_default.statValue,
							children: formatTokens(totals.outputTokens)
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: usage_module_css_default.statLabel,
							children: t("usage.tokens.output")
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: usage_module_css_default.stat,
						"data-dsh-stat": "cache-read",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: usage_module_css_default.statValue,
							children: formatTokens(totals.cacheReadTokens)
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: usage_module_css_default.statLabel,
							children: t("usage.tokens.cacheRead")
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: usage_module_css_default.stat,
						"data-dsh-stat": "cache-write",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: usage_module_css_default.statValue,
							children: formatTokens(totals.cacheWriteTokens)
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: usage_module_css_default.statLabel,
							children: t("usage.tokens.cacheWrite")
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: usage_module_css_default.stat,
						"data-dsh-stat": "calls",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: usage_module_css_default.statValue,
							children: formatTokens(totals.calls)
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: usage_module_css_default.statLabel,
							children: t("usage.calls", { n: totals.calls })
						})]
					})
				]
			});
		}
		function walletText(balance) {
			const currency = balance.currency.toUpperCase();
			return currency === "CNY" ? "¥" + balance.totalBalance : currency === "USD" ? "$" + balance.totalBalance : currency + " " + balance.totalBalance;
		}
		function balanceLine$1(provider) {
			const balances = provider.balances ?? (provider.balance !== void 0 ? [provider.balance] : []);
			if (balances.length > 0) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: usage_module_css_default.providerBalance,
				children: balances.map((entry, index) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
					children: [index > 0 ? " · " : "", walletText(entry)]
				}, entry.currency))
			});
			if (provider.credential === "oauth") return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: usage_module_css_default.muted,
				children: t("usage.oauth")
			});
			if (provider.credential === "none") return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: usage_module_css_default.muted,
				children: t("usage.balance.noCredential")
			});
			if (provider.balanceSupported === false) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: usage_module_css_default.muted,
				children: t("usage.balance.unsupported")
			});
			if (!provider.supported) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: usage_module_css_default.muted,
				children: t("usage.balance.unsupported")
			});
			return null;
		}
		function ProviderRow(props) {
			const { provider, current } = props;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: usage_module_css_default.providerRow,
				"data-dsh-part": "provider-row",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
					className: usage_module_css_default.providerName,
					children: [provider.displayName, current === provider.provider && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: usage_module_css_default.currentBadge,
						children: t("usage.current")
					})]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: usage_module_css_default.providerTokens,
					children: balanceLine$1(provider)
				})]
			});
		}
		/**
		* Fetch the day a picker selected, or stay idle for the default window. Today
		* never fetches: the overview already carries it live, so switching back to
		* today is instant and keeps counting with the poll. A superseded selection
		* never lands (the effect cancels), and a failed load reports its own message
		* instead of leaving the card on a stale day.
		*/
		function useDayView(loadDay, date, today) {
			const [load, setLoad] = (0, react.useState)(void 0);
			(0, react.useEffect)(() => {
				if (date === void 0 || date === today) {
					setLoad((previous) => previous === void 0 ? previous : void 0);
					return;
				}
				let cancelled = false;
				setLoad({ status: "loading" });
				loadDay(date).then((view) => {
					if (!cancelled) setLoad({
						status: "ready",
						view
					});
				}, (error) => {
					if (!cancelled) setLoad({
						status: "error",
						error: error instanceof Error ? error.message : String(error)
					});
				});
				return () => {
					cancelled = true;
				};
			}, [
				date,
				today,
				loadDay
			]);
			return load;
		}
		/**
		* The day picker: today plus every retained day that recorded usage, newest
		* first (the host serves the list ascending). Without that list (an older host
		* document) no picker renders and the card stays on its default window.
		*/
		function DayPicker(props) {
			const { value, options, today, leading, onSelect, part } = props;
			if (options.length === 0) return null;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: usage_module_css_default.dayPicker,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
					className: usage_module_css_default.dayPickerLabel,
					htmlFor: "dsh-usage-day-" + part,
					children: t("usage.day.label")
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
					id: "dsh-usage-day-" + part,
					className: usage_module_css_default.daySelect,
					value,
					onChange: (event) => {
						onSelect(event.target.value);
					},
					children: [leading !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
						value: leading.value,
						children: leading.label
					}), options.map((date) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
						value: date,
						children: date === today ? t("usage.day.today") : date
					}, date))]
				})]
			});
		}
		/** The section component; the slot merges the face into these props. */
		function UsageSectionCard(props) {
			const { store, poll, refresh, rescan, loadDay, settingsCard } = props;
			const ui = (0, react.useSyncExternalStore)(store.subscribe, store.getSnapshot);
			const card = (0, react.useSyncExternalStore)(settingsCard.store.subscribe, settingsCard.store.getSnapshot);
			const [tab, setTab] = (0, react.useState)("usage");
			const [usageDay, setUsageDay] = (0, react.useState)(void 0);
			const [refreshing, setRefreshing] = (0, react.useState)(false);
			const [rescanning, setRescanning] = (0, react.useState)(false);
			const enabled = card.enabled.text !== "false";
			(0, react.useEffect)(() => {
				if (!enabled) return void 0;
				poll();
				let timer;
				const start = () => {
					if (timer === void 0 && document.visibilityState === "visible") timer = window.setInterval(poll, SECTION_POLL_MS);
				};
				const onVisibility = () => {
					if (document.visibilityState === "visible") {
						poll();
						start();
					} else if (timer !== void 0) {
						window.clearInterval(timer);
						timer = void 0;
					}
				};
				start();
				document.addEventListener("visibilitychange", onVisibility);
				return () => {
					if (timer !== void 0) window.clearInterval(timer);
					document.removeEventListener("visibilitychange", onVisibility);
				};
			}, [poll, enabled]);
			const snapshot = ui.snapshot;
			const todayDate = snapshot?.usage.today.date;
			const dayOptions = snapshot === null ? [] : [...new Set([todayDate, ...snapshot.usage.availableDays ?? []].filter((date) => date !== void 0))].sort().reverse();
			const usageSelection = usageDay !== void 0 && dayOptions.includes(usageDay) ? usageDay : void 0;
			const selectedDay = usageSelection ?? todayDate;
			const isToday = selectedDay === todayDate;
			const usageDayLoad = useDayView(loadDay, usageSelection, todayDate);
			const day = isToday ? snapshot?.usage.today : usageDayLoad?.view;
			const onRescan = () => {
				setRescanning(true);
				try {
					rescan();
				} finally {
					window.setTimeout(() => setRescanning(false), 4e3);
				}
			};
			const onRefresh = () => {
				setRefreshing(true);
				try {
					refresh();
				} finally {
					window.setTimeout(() => setRefreshing(false), 3e3);
				}
			};
			if (!enabled || ui.status === "error" || snapshot === null) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(UsagePage, {
				card,
				face: settingsCard,
				enabled,
				providers: snapshot?.providers,
				children: enabled ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: usage_module_css_default.muted,
					"data-dsh-part": "status-line",
					children: ui.status === "error" ? t("usage.error", { error: ui.error ?? "" }) : t("usage.loading")
				}) : null
			});
			const current = snapshot.current;
			const currentProvider = snapshot.providers.find((provider) => provider.provider === current.provider);
			const deepseekPeriod = deepseekPeriodAt(Date.now());
			const isDeepSeek = (id) => snapshot.providers.find((provider) => provider.provider === id)?.deepseekFamily ?? isDeepSeekProviderRoute(id);
			const deepseekVisible = isToday && (current.provider !== void 0 && isDeepSeek(current.provider) || snapshot.usage.today.providers.some((row) => isDeepSeek(row.provider)));
			const parseHidden = (text) => new Set(text.split(",").map((entry) => entry.trim()).filter((entry) => entry !== ""));
			const hiddenBalances = parseHidden(card.hiddenBalances.text);
			const hiddenPlans = parseHidden(card.hiddenPlans.text);
			const providerCurrencies = parseProviderCurrencies(card.providerCurrency.text);
			const previewValues = {
				footShowSpend: card.footShowSpend.text !== "false",
				footShowUsage: card.footShowUsage.text !== "false",
				footShowBalances: card.footShowBalances.text !== "false",
				footShowMeters: card.footShowMeters.text !== "false",
				footMeterWindow: card.footMeterWindow.text === "month" ? "month" : "week",
				footShowPeak: card.footShowPeak.text !== "false",
				footShowUpdated: card.footShowUpdated.text !== "false",
				footCompact: card.footCompact.text === "true",
				hiddenBalances: card.hiddenBalances.text,
				hiddenPlans: card.hiddenPlans.text,
				balanceOrder: card.balanceOrder.text,
				planOrder: card.planOrder.text
			};
			const planProviders = orderByList(snapshot.providers.filter((provider) => isConfigured(provider) && (provider.plan !== void 0 || provider.quota !== void 0 || provider.planSupported === true || provider.quotaSupported === true)), card.planOrder.text).filter((provider) => !hiddenPlans.has(provider.provider));
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(UsagePage, {
				card,
				face: settingsCard,
				enabled,
				providers: snapshot.providers,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: usage_module_css_default.section,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: usage_module_css_default.header,
							"data-dsh-part": "header",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: usage_module_css_default.currentProvider,
								children: currentProvider !== void 0 ? `${currentProvider.displayName}${current.model !== void 0 && current.model !== "" ? " · " + current.model : ""}` : null
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
								className: usage_module_css_default.headerActions,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: usage_module_css_default.muted,
									children: t("usage.updated", { time: formatTime(snapshot.updatedAt) })
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: usage_module_css_default.refreshBtn,
									onClick: onRefresh,
									disabled: refreshing || rescanning,
									children: refreshing ? t("usage.refreshing") : t("usage.refresh")
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: usage_module_css_default.refreshBtn,
									onClick: onRescan,
									disabled: rescanning || refreshing,
									children: rescanning ? t("usage.rescanning") : t("usage.rescan")
								})]
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SegmentGroup, {
							className: usage_module_css_default.tabs,
							role: "tablist",
							"aria-label": t("usage.title"),
							"data-dsh-part": "tabs",
							children: USAGE_TABS.map((entry) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								role: "tab",
								"aria-selected": tab === entry,
								className: `${settings_card_module_css_default.segment} ${usage_module_css_default.tab}`,
								"data-active": tab === entry ? "" : void 0,
								onClick: () => setTab(entry),
								children: t(`usage.tab.${entry}`)
							}, entry))
						}),
						tab === "usage" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: usage_module_css_default.usageSummaryGrid,
							"data-dsh-layout": "summary-grid",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: usage_module_css_default.card,
								"data-dsh-part": "today-card",
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: usage_module_css_default.cardTitle,
										children: isToday ? t("usage.today") : t("usage.day.title", { date: selectedDay ?? "" })
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(DayPicker, {
										part: "usage",
										value: selectedDay ?? "",
										options: dayOptions,
										today: todayDate ?? "",
										onSelect: (date) => {
											setUsageDay(date === todayDate ? void 0 : date);
										}
									}),
									deepseekVisible && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(PeakBadge, {
										peak: deepseekPeriod.peak,
										boundaryMs: deepseekPeriod.boundaryMs,
										variant: "full"
									}),
									usageDayLoad?.status === "error" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: usage_module_css_default.errorLine,
										children: t("usage.day.error", { error: usageDayLoad.error ?? "" })
									}) : day === void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: usage_module_css_default.muted,
										children: t("usage.day.loading")
									}) : day.totals.calls === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: usage_module_css_default.muted,
										children: isToday ? t("usage.noData") : t("usage.day.empty")
									}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(TotalsRow, { totals: day.totals }),
									(day?.totals.cost ?? 0) > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: usage_module_css_default.providerRow,
										"data-dsh-part": "today-cost",
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: usage_module_css_default.providerName,
											children: isToday ? t("usage.today.cost") : t("usage.day.cost")
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: usage_module_css_default.providerTokens,
											children: formatSpend(day?.totals.cost ?? 0, snapshot.display)
										})]
									}),
									(day?.providers.length ?? 0) > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
										"data-dsh-part": "provider-list",
										children: (day?.providers ?? []).map((row) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
											className: usage_module_css_default.providerRow,
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
												className: usage_module_css_default.providerName,
												children: [snapshot.providers.find((provider) => provider.provider === row.provider)?.displayName ?? row.provider, current.provider === row.provider && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
													className: usage_module_css_default.currentBadge,
													children: t("usage.current")
												})]
											}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
												className: usage_module_css_default.providerTokens,
												children: [
													formatTokens(row.totals.inputTokens + row.totals.cacheReadTokens + row.totals.cacheWriteTokens + row.totals.outputTokens),
													" · ",
													t("usage.calls", { n: row.totals.calls }),
													row.totals.cost > 0 ? ` · ${formatProviderSpend(row.totals.cost, row.totals.costUsd, providerCurrencies.get(row.provider) ?? "native", snapshot.display)}` : ""
												]
											})]
										}, row.provider))
									})
								]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: usage_module_css_default.card,
								"data-dsh-part": "balance-card",
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: usage_module_css_default.cardTitle,
										children: t("usage.balance")
									}),
									(() => {
										const configured = snapshot.providers.filter(isConfigured);
										const rows = orderByList(configured.filter((provider) => provider.balanceSupported === true || provider.balanceSupported === false || provider.balanceSupported === void 0 && provider.balance !== void 0), card.balanceOrder.text).filter((provider) => !hiddenBalances.has(provider.provider));
										if (rows.length === 0) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: usage_module_css_default.muted,
											children: configured.length === 0 ? t("usage.balance.noneConfigured") : configured.some((provider) => hiddenBalances.has(provider.provider)) ? t("usage.balance.hidden") : t("usage.balance.unsupported")
										});
										return rows.map((provider) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ProviderRow, {
											provider,
											current: current.provider
										}, provider.provider));
									})(),
									snapshot.providers.some((provider) => isConfigured(provider) && provider.error !== void 0) && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: usage_module_css_default.errorLine,
										children: snapshot.providers.filter((provider) => isConfigured(provider) && provider.error !== void 0).map((provider) => `${provider.displayName}: ${t("usage.provider.error", { error: provider.error ?? "" })}`).join(t("usage.errorListSeparator"))
									})
								]
							})]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SpendLimitsCard, {
	providers: snapshot.providers,
	current: current.provider
}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(RangeCard, {
							range: snapshot.usage.range,
							providers: snapshot.providers,
							currentProvider: current.provider
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(CurrencySettings, {
							card,
							face: settingsCard,
							providers: snapshot.providers
						})] }),
						tab === "plans" && (planProviders.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: usage_module_css_default.card,
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: usage_module_css_default.muted,
								children: t("usage.plan.noneConfigured")
							})
						}) : planProviders.map((provider) => provider.quota !== void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(QuotaCard, {
							providers: [provider],
							current: current.provider
						}, provider.provider) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(PlanCard, {
							provider,
							current: current.provider
						}, provider.provider))),
						tab === "sidebar" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: usage_module_css_default.footPreviewFrame,
							"data-dsh-part": "foot-preview",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: usage_module_css_default.cardTitle,
								children: t("usage.sidebar.preview")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(UsageFootPreview, {
								snapshot,
								values: previewValues
							})]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SidebarCardSettings, {
							card,
							face: settingsCard
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(CardVisibilitySettings, {
							card,
							face: settingsCard,
							providers: snapshot.providers
						})] }),
					]
				})
			});
		}
		/** The statistics tabs, in their order on the page. */
		const USAGE_TABS = [
			"usage",
			"plans",
			"sidebar"
		];
		/** How many model sub-bars render under one provider bar. */
		const CHART_MODEL_CAP = 3;
		/**
		* The 近 30 天 card: horizontal bars per provider over the trend window,
		* each with its heaviest models as nested sub-bars. Window totals come from
		* the host's aggregated `usage.range` (an older host without it renders no
		* card instead of a wrong one).
		*/
		function RangeCard(props) {
			const { range, providers, currentProvider } = props;
			if (range === void 0) return null;
			const grandTotal = range.totals.inputTokens + range.totals.outputTokens + range.totals.cacheReadTokens + range.totals.cacheWriteTokens;
			const maxProvider = Math.max(1, ...range.providers.map((row) => totalOf(row.totals)));
			const nameOf = (id) => providers.find((provider) => provider.provider === id)?.displayName ?? id;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: usage_module_css_default.card,
				"data-dsh-part": "trend-card",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: usage_module_css_default.cardTitle,
					children: t("usage.trend")
				}), range.providers.length === 0 || grandTotal === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: usage_module_css_default.muted,
					children: t("usage.noData")
				}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: usage_module_css_default.chart,
					"data-dsh-part": "usage-chart",
					"data-dsh-layout": "trend-grid",
					children: [range.providers.map((row) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ChartProviderRow, {
						row,
						name: nameOf(row.provider),
						max: maxProvider,
						current: currentProvider === row.provider
					}, row.provider)), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
						className: usage_module_css_default.trendAxis,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: range.from.slice(5) }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: range.to.slice(5) })]
					})]
				})]
			});
		}
		function ChartProviderRow(props) {
			const { row, name, max, current } = props;
			const total = totalOf(row.totals);
			const maxModel = Math.max(1, ...row.models.slice(0, CHART_MODEL_CAP).map((model) => totalOf(model.totals)));
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: usage_module_css_default.chartProvider,
				"data-dsh-layout": "trend-provider",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
						className: usage_module_css_default.chartHead,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: usage_module_css_default.providerName,
							children: [name, current && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: usage_module_css_default.currentBadge,
								children: t("usage.current")
							})]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: usage_module_css_default.chartTokens,
							children: [
								formatTokens(total),
								" · ",
								t("usage.calls", { n: row.totals.calls })
							]
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: usage_module_css_default.chartBar,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: usage_module_css_default.chartFill,
							style: { width: `${Math.max(2, Math.round(total / max * 100))}%` }
						})
					}),
					row.models.slice(0, CHART_MODEL_CAP).map((model) => {
						const modelTotal = totalOf(model.totals);
						return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: usage_module_css_default.chartModel,
							title: `${row.provider} · ${model.model}: ${formatTokens(modelTotal)}`,
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: usage_module_css_default.chartModelName,
									children: model.model
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: usage_module_css_default.chartModelBar,
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: usage_module_css_default.chartModelFill,
										style: { width: `${Math.max(3, Math.round(modelTotal / maxModel * 100))}%` }
									})
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: usage_module_css_default.chartTokens,
									children: formatTokens(modelTotal)
								})
							]
						}, model.model);
					})
				]
			});
		}
		function totalOf(totals) {
			return totals.inputTokens + totals.cacheReadTokens + totals.cacheWriteTokens + totals.outputTokens;
		}
/** Money text for a spend cap: a symbol for USD/CNY, else the ISO code. */
function spendMoney(value, currency) {
	const code = currency.toUpperCase();
	const amount = value.toFixed(2);
	if (code === "USD") return "$" + amount;
	if (code === "CNY") return "\u00a5" + amount;
	return amount + " " + code;
}
/** The window word for a spend cap; an unknown provider window shows as-is. */
function spendWindowLabel(window) {
	return window === "daily" || window === "monthly" || window === "key"
		? t("usage.spend." + window)
		: window;
}
/**
* Money spent against a provider's own cap (AMD Cloud's daily USD ceiling, a
* relay key's limit). Distinct from the token quota card: the window and unit
* are the provider's, and a 0 limit renders as "unlimited", not a full bar.
*/
function SpendLimitsCard(props) {
	const rows = props.providers.filter((provider) => provider.spend !== void 0);
	if (rows.length === 0) return null;
	return (0, react_jsx_runtime.jsxs)("div", {
		className: usage_module_css_default.card,
		"data-dsh-part": "spend-limits-card",
		children: [
			(0, react_jsx_runtime.jsx)("span", {
				className: usage_module_css_default.cardTitle,
				children: t("usage.spend.title")
			}),
			...rows.map((provider) => {
				const spend = provider.spend;
				if (spend === void 0) return null;
				const limited = spend.limit > 0;
				const percent = limited ? Math.min(100, Math.max(0, spend.used / spend.limit * 100)) : void 0;
				return (0, react_jsx_runtime.jsxs)("div", {
					className: usage_module_css_default.windowRow,
					"data-dsh-part": "spend-row",
					children: [
						(0, react_jsx_runtime.jsxs)("span", {
							className: usage_module_css_default.windowLabel,
							children: [
								(0, react_jsx_runtime.jsxs)("span", {
									children: [
										provider.displayName + " \u00b7 " + spendWindowLabel(spend.window),
										props.current === provider.provider && (0, react_jsx_runtime.jsx)("span", {
											className: usage_module_css_default.currentBadge,
											children: t("usage.current")
										})
									]
								}),
								(0, react_jsx_runtime.jsx)("span", {
									children: spendMoney(spend.used, spend.currency) + " / " + (limited ? spendMoney(spend.limit, spend.currency) : t("usage.spend.unlimited")) + (percent !== void 0 ? " \u00b7 " + percentLabel(percent) : "")
								})
							]
						}),
						limited && (0, react_jsx_runtime.jsx)("span", {
							className: usage_module_css_default.bar,
							children: (0, react_jsx_runtime.jsx)("span", {
								className: usage_module_css_default.barFill,
								style: {
									width: `${percent ?? 0}%`,
									display: "block"
								}
							})
						}),
						spend.resetsAt !== void 0 && (0, react_jsx_runtime.jsx)("span", {
							className: usage_module_css_default.resetLine,
							children: t("usage.plan.reset", { date: new Date(spend.resetsAt).toLocaleString() })
						})
					]
				}, provider.provider);
			})
		]
	});
}

function meterPercent(used, limit) {
  if (!Number.isFinite(used) || !Number.isFinite(limit) || limit <= 0) return void 0;
  return Math.max(0, Math.min(100, used / limit * 100));
}
function percentLabel(percent) {
  return percent >= 10 ? `${Math.round(percent)}%` : `${percent.toFixed(1)}%`;
}
function QuotaMeterLine(props) {
  const { kind, used, limit } = props;
  const percent = meterPercent(used, limit);
  return (0, react_jsx_runtime.jsxs)("div", {
    className: usage_module_css_default.quotaMeter,
    "data-dsh-meter": kind,
    children: [
      (0, react_jsx_runtime.jsxs)("span", {
        className: usage_module_css_default.quotaLimit,
        children: [
          (0, react_jsx_runtime.jsx)("span", {
            className: kind === "in" ? usage_module_css_default.quotaDotIn : usage_module_css_default.quotaDotOut
          }),
          (0, react_jsx_runtime.jsx)("span", {
            children: `${t(`usage.quota.${kind}`)} ${formatTokens(used)} / ${limit > 0 ? formatTokens(limit) : "∞"}`
          }),
          percent !== void 0 && (0, react_jsx_runtime.jsx)("span", {
            className: usage_module_css_default.quotaPercent,
            children: percentLabel(percent)
          })
        ]
      }),
      (0, react_jsx_runtime.jsx)("span", {
        className: usage_module_css_default.bar,
        children: (0, react_jsx_runtime.jsx)("span", {
          className: kind === "in" ? usage_module_css_default.quotaIn : usage_module_css_default.quotaOut,
          style: {
            width: `${percent ?? 0}%`,
            display: "block"
          }
        })
      })
    ]
  });
}
function QuotaWindow(props) {
  const meter = props.meter;
  const localized = meter.key === "month" || meter.key === "week" ? t(`usage.quota.${meter.key}`) : void 0;
  return (0, react_jsx_runtime.jsxs)("div", {
    className: usage_module_css_default.windowRow,
    "data-dsh-part": "quota-window",
    children: [
      (0, react_jsx_runtime.jsxs)("span", {
        className: usage_module_css_default.windowLabel,
        children: [
          (0, react_jsx_runtime.jsx)("span", { children: localized ?? meter.name ?? meter.key }),
          (0, react_jsx_runtime.jsx)("span", {
            children: meter.resetsAt !== void 0 ? t("usage.plan.reset", { date: new Date(meter.resetsAt).toLocaleDateString() }) : t("usage.quota.rolling")
          })
        ]
      }),
      (0, react_jsx_runtime.jsx)(QuotaMeterLine, {
        kind: "in",
        used: meter.usedInput,
        limit: meter.limitInput
      }),
      (0, react_jsx_runtime.jsx)(QuotaMeterLine, {
        kind: "out",
        used: meter.usedOutput,
        limit: meter.limitOutput
      })
    ]
  });
}
function QuotaCard(props) {
  const rows = props.providers.filter((provider) => provider.quota !== void 0 && provider.quota.meters.length > 0);
  if (rows.length === 0) return null;
  return (0, react_jsx_runtime.jsx)(react_jsx_runtime.Fragment, {
    children: rows.map((provider) => {
      const quota = provider.quota;
      if (quota === void 0) return null;
      return (0, react_jsx_runtime.jsxs)("div", {
        className: `${usage_module_css_default.card} ${usage_module_css_default.planCard}`,
        "data-dsh-part": "quota-card",
        children: [
          (0, react_jsx_runtime.jsxs)("div", {
            className: usage_module_css_default.planHead,
            children: [
              (0, react_jsx_runtime.jsxs)("span", {
                className: usage_module_css_default.planName,
                children: [
                  provider.displayName,
                  quota.planName !== void 0 ? ` \u00b7 ${quota.planName}` : "",
                  props.current === provider.provider && (0, react_jsx_runtime.jsx)("span", {
                    className: usage_module_css_default.currentBadge,
                    children: t("usage.current")
                  })
                ]
              }),
              quota.price !== void 0 && (0, react_jsx_runtime.jsx)("span", {
                className: usage_module_css_default.muted,
                children: quota.price
              })
            ]
          }),
          provider.error !== void 0 && (0, react_jsx_runtime.jsx)("span", {
            className: usage_module_css_default.errorLine,
            children: t("usage.provider.error", { error: provider.error })
          }),
          quota.meters.map((meter) => (0, react_jsx_runtime.jsx)(QuotaWindow, { meter }, meter.key)),
          (0, react_jsx_runtime.jsx)("span", {
            className: usage_module_css_default.resetLine,
            children: t("usage.quota.hint")
          })
        ]
      }, provider.provider);
    })
  });
}
		function PlanCard(props) {
			const { provider, current } = props;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: `${usage_module_css_default.card} ${usage_module_css_default.planCard}`,
				"data-dsh-part": "plan-card",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: usage_module_css_default.planHead,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: usage_module_css_default.planName,
							children: [
								provider.displayName,
								current === provider.provider && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: usage_module_css_default.currentBadge,
									children: t("usage.current")
								}),
								provider.plan?.planName !== void 0 ? ` · ${provider.plan.planName}` : ""
							]
						})
					}),
					provider.error !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: usage_module_css_default.errorLine,
						children: t("usage.provider.error", { error: provider.error })
					}),
					provider.credential === "none" && provider.plan === void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: usage_module_css_default.muted,
						children: t("usage.balance.noCredential")
					}) : provider.plan === void 0 || provider.plan.windows.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: usage_module_css_default.muted,
						children: t("usage.plan.noPlan")
					}) : provider.plan.windows.map((window) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: usage_module_css_default.windowRow,
						"data-dsh-part": "plan-window",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
								className: usage_module_css_default.windowLabel,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: window.name ?? t(`usage.plan.windows.${window.key}`) }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: window.percent !== void 0 ? `${window.percent >= 10 ? Math.round(window.percent) : window.percent.toFixed(1)}%` : "" })]
							}),
							window.percent !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: usage_module_css_default.bar,
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: toneClass(window.percent),
									style: {
										width: `${Math.min(100, Math.max(0, window.percent))}%`,
										display: "block"
									}
								})
							}),
							window.resetsAt !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: usage_module_css_default.resetLine,
								children: t("usage.plan.reset", { date: new Date(window.resetsAt).toLocaleString() })
							})
						]
					}, window.key))
				]
			});
		}
		//#endregion
		//#region src/client/body-mutations.ts
		/** Cross-bundle registry key; `Symbol.for` so every module copy agrees. */
		const HUB_KEY = Symbol.for("dsh-web.body-mutation-hub");
		const INVALIDATION_ONLY = Symbol.for("dsh-web.body-mutation-invalidation");
		function needsRecords(subscribers) {
			for (const listener of subscribers) if (!listener[INVALIDATION_ONLY]) return true;
			return false;
		}
		/**
		* Subscribe to a coalesced DOM re-check without retaining mutation records.
		* The marked wrapper also works with an older hub, which delivers records
		* that it simply ignores until a page reload picks up the updated hub.
		*/
		function subscribeBodyInvalidations(subscriber) {
			const listener = () => {
				subscriber();
			};
			listener[INVALIDATION_ONLY] = true;
			return subscribeBodyMutations(listener);
		}
		/**
		* Subscribe to body-level childList mutations.
		* @param subscriber - called at most once per animation frame with the records
		*   collected since the previous flush; must be safe to run repeatedly.
		* @returns the disposer removing this subscriber (and the observer when it was
		*   the last one).
		*/
		function subscribeBodyMutations(subscriber) {
			if (typeof globalThis === "undefined" || typeof document === "undefined") return () => {};
			if (typeof MutationObserver !== "function") return () => {};
			const registry = globalThis;
			let hub = registry[HUB_KEY];
			if (hub === void 0) {
				const subscribers = /* @__PURE__ */ new Set();
				const created = {
					observer: void 0,
					subscribers,
					pending: [],
					scheduled: false
				};
				const flush = () => {
					created.frame = void 0;
					created.scheduled = false;
					const batch = created.pending;
					created.pending = [];
					for (const listener of [...subscribers]) {
						if (!subscribers.has(listener)) continue;
						try {
							listener(batch);
						} catch {}
					}
				};
				const schedule = () => {
					if (created.scheduled) return;
					created.scheduled = true;
					if (typeof requestAnimationFrame === "function") created.frame = requestAnimationFrame(flush);
					else flush();
				};
				created.observer = new MutationObserver((records) => {
					if (needsRecords(subscribers)) for (const record of records) created.pending.push(record);
					schedule();
				});
				created.observer.observe(document.body ?? document.documentElement, {
					childList: true,
					subtree: true
				});
				registry[HUB_KEY] = created;
				hub = created;
			}
			const active = hub;
			active.subscribers.add(subscriber);
			let subscribed = true;
			return () => {
				if (!subscribed) return;
				subscribed = false;
				active.subscribers.delete(subscriber);
				if (!needsRecords(active.subscribers)) active.pending = [];
				if (active.subscribers.size === 0 && registry[HUB_KEY] === active) {
					active.observer.disconnect();
					if (active.frame !== void 0 && typeof cancelAnimationFrame === "function") cancelAnimationFrame(active.frame);
					active.frame = void 0;
					active.pending = [];
					active.scheduled = false;
					delete registry[HUB_KEY];
				}
			};
		}
		//#endregion
		//#region src/client/UsageFootCard.tsx
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
		/** Poll cadence of the permanently seated card; the section's 10 s loop stays its own. */
		const FOOT_CARD_POLL_MS = 3e4;
		/** localStorage key holding the collapsed flag ('1' = collapsed strip). */
		const FOOT_CARD_COLLAPSED_KEY = "dsh-usage.foot-card.collapsed";
		/** Read the persisted collapsed flag (absent = expanded). */
		function readFootCardCollapsed() {
			try {
				return window.localStorage.getItem(FOOT_CARD_COLLAPSED_KEY) === "1";
			} catch {
				return false;
			}
		}
		/** Persist the collapsed flag; storage failures keep the session state. */
		function writeFootCardCollapsed(collapsed) {
			try {
				window.localStorage.setItem(FOOT_CARD_COLLAPSED_KEY, collapsed ? "1" : "0");
			} catch {}
		}
		/** Inline gauge glyph, 14px beside the card title. */
		function GaugeIcon() {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
				viewBox: "0 0 16 16",
				width: "14",
				height: "14",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "1.3",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				"aria-hidden": "true",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M2.5 12.5a7 7 0 0 1 11 -4.3" }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M8 12.5V8.2l2.9-2.1" }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
						cx: "8",
						cy: "12.5",
						r: "1"
					})
				]
			});
		}
		/** Disclosure chevrons: down collapses the expanded card, up expands the strip. */
		function ChevronIcon(props) {
			return props.collapsed ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
				viewBox: "0 0 16 16",
				width: "12",
				height: "12",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "1.4",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "m4 10 4-4 4 4" })
			}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
				viewBox: "0 0 16 16",
				width: "12",
				height: "12",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "1.4",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "m4 6 4 4 4-4" })
			});
		}
		/** A provider row worth showing a balance for: configured, with a probed balance. */
		function balanceRow(provider) {
			const supported = provider.balanceSupported === true || provider.balanceSupported === void 0 && provider.supported;
			return provider.credential !== "none" && supported && provider.balance !== void 0;
		}
		/** Currency-symbol prefix for the priced balances (CNY/USD), else the ISO code. */
		function formatBalance(balance) {
			const currency = balance.currency.toUpperCase();
			if (currency === "CNY") return "¥" + balance.totalBalance;
			if (currency === "USD") return "$" + balance.totalBalance;
			return currency + " " + balance.totalBalance;
		}
		/**
		* Route key owning today's priced spend: the day's highest cost row, else the
		* current session route (an older host without the day rows falls back to the
		* current route). Undefined when neither names one.
		*/
		function spendRoute(snapshot) {
			let top;
			for (const row of snapshot.usage.today.providers) {
				if (row.totals.cost <= 0) continue;
				if (top === void 0 || row.totals.cost > top.totals.cost) top = row;
			}
			return top?.provider ?? snapshot.current.provider;
		}
		/** Display name of the route spendRoute() names, resolved through the snapshot. */
		function spendProvider(snapshot) {
			const route = spendRoute(snapshot);
			if (route === void 0) return void 0;
			return snapshot.providers.find((entry) => entry.provider === route)?.displayName ?? (route === snapshot.current.provider ? snapshot.current.displayName : void 0) ?? route;
		}
		/**
		* The headline triple: today's priced spend, else today's tokens, else zero.
		* tokenFallback tells the sub-line to keep only the call count instead of
		* repeating the total the headline already shows; provider names the spender
		* beside the collapsed cost headline.
		*/
		function headline(snapshot) {
			const totals = snapshot.usage.today.totals;
			if (totals.cost > 0) return {
				label: t("usage.foot.cost"),
				value: formatSpend(totals.cost, snapshot.display),
				tokenFallback: false,
				provider: spendProvider(snapshot)
			};
			if (totals.calls > 0) return {
				label: t("usage.today"),
				value: formatTokens(totalTokens(totals)) + " tokens",
				tokenFallback: true
			};
			return {
				label: t("usage.foot.cost"),
				value: formatSpend(0, snapshot.display),
				tokenFallback: false
			};
		}
		/** The tokens/calls sub-line under the headline; a quiet no-data line on an empty day. */
		function usageLine(snapshot, tokenFallback) {
			const totals = snapshot.usage.today.totals;
			if (totals.calls === 0) return t("usage.foot.noData");
			const calls = t("usage.calls", { n: totals.calls });
			return tokenFallback ? calls : formatTokens(totalTokens(totals)) + " tokens · " + calls;
		}
		/** One row per visible balance, in the reader's order. */
		function balanceRows(snapshot, hidden, order) {
			return orderByList(snapshot.providers.filter(balanceRow).filter((provider) => !hidden.has(provider.provider)), order).map((provider) => {
				const balances = provider.balances ?? (provider.balance !== void 0 ? [provider.balance] : []);
				return { id: provider.provider, text: provider.displayName + " " + balances.map(formatBalance).join(" / ") };
			});
		}
		/** Card chrome classes for the current collapse state. */
		function cardClass(collapsed) {
			return collapsed ? usage_module_css_default.footCard + " " + usage_module_css_default.footCardCollapsed : usage_module_css_default.footCard;
		}
		/**
		* Render the foot card content for the current store snapshot.
		* @param props - store, poller, settings form and open callback from the mount.
		* @returns the card, or null while disabled / host-off.
		*/
/** The chosen subscription window of the first provider that reports one. */
		function planMeters(snapshot, window, hidden, order) {
			return orderByList(snapshot.providers.filter((provider) => !hidden.has(provider.provider)), order).flatMap((provider) => {
				const meter = provider.quota === void 0 ? void 0 : provider.quota.meters.find((entry) => entry.key === window);
				return meter === void 0 ? [] : [{ id: provider.provider, name: provider.displayName, meter }];
			});
		}
		/** One compact plan meter: label, track and used/limit with the percentage. */
		function FootMeterRow(props) {
			const percent = meterPercent(props.used, props.limit);
			const label = percent === void 0 ? "" : percentLabel(percent);
			return (0, react_jsx_runtime.jsxs)("span", {
				className: usage_module_css_default.footMeter,
				"data-dsh-meter": props.kind,
				children: [
					(0, react_jsx_runtime.jsx)("span", {
						className: usage_module_css_default.footMeterKey,
						children: t(`usage.quota.${props.kind}`)
					}),
					(0, react_jsx_runtime.jsx)("span", {
						className: usage_module_css_default.footMeterTrack,
						children: (0, react_jsx_runtime.jsx)("span", {
							className: props.kind === "in" ? usage_module_css_default.quotaIn : usage_module_css_default.quotaOut,
							style: {
								width: `${percent ?? 0}%`,
								display: "block"
							}
						})
					}),
					(0, react_jsx_runtime.jsx)("span", {
						className: usage_module_css_default.footMeterValue,
						children: `${formatTokens(props.used)}/${formatTokens(props.limit)} · ${label}`
					})
				]
			});
		}
		function previewHidden(text) {
			return new Set((text ?? "").split(",").map((entry) => entry.trim()).filter((entry) => entry !== ""));
		}

		/** The rows, shared by the seated card and the Sidebar tab preview. */
		function FootRows(props) {
			const { snapshot, values } = props;
			const showSpend = values.footShowSpend !== false;
			const showUsage = values.footShowUsage !== false;
			const showBalances = values.footShowBalances !== false;
			const showMeters = values.footShowMeters !== false;
			const meterWindow = values.footMeterWindow === "month" ? "month" : "week";
			const showPeak = values.footShowPeak !== false;
			const showUpdated = values.footShowUpdated !== false;
			const head = headline(snapshot);
			const balances = balanceRows(snapshot, previewHidden(values.hiddenBalances), values.balanceOrder ?? "");
			const plans = planMeters(snapshot, meterWindow, previewHidden(values.hiddenPlans), values.planOrder ?? "");
			const period = deepseekPeriodAt(Date.now());
			const rows = [];
			if (showSpend) rows.push(react.createElement("span", {
				className: usage_module_css_default.footHead,
				key: "head"
			}, react.createElement("span", {
				className: usage_module_css_default.footTitle
			}, react.createElement(GaugeIcon), head.label), react.createElement("span", {
				className: usage_module_css_default.footValue
			}, head.value)));
			if (showUsage) rows.push(react.createElement("span", {
				className: usage_module_css_default.footLine,
				"data-dsh-part": "foot-card-usage",
				key: "usage"
			}, usageLine(snapshot, head.tokenFallback)));
			if (showBalances) for (const row of balances) rows.push(react.createElement("span", {
				className: usage_module_css_default.footLine,
				"data-dsh-part": "foot-card-balances",
				key: "balance-" + row.id
			}, row.text));
			if (showMeters) for (const plan of plans) rows.push(react.createElement("span", {
				className: usage_module_css_default.footPlan,
				"data-dsh-part": "foot-card-plan",
				key: "plan-" + plan.id
			}, react.createElement("span", {
				className: usage_module_css_default.footPlanName
			}, plan.name + " · " + (meterWindow === "month" ? t("usage.quota.month") : "7d")), react.createElement(FootMeterRow, {
				kind: "in",
				used: plan.meter.usedInput,
				limit: plan.meter.limitInput
			}), react.createElement(FootMeterRow, {
				kind: "out",
				used: plan.meter.usedOutput,
				limit: plan.meter.limitOutput
			})));
			if (showPeak || showUpdated) {
				const foot = [];
				if (showPeak) {
					foot.push(react.createElement(PeakBadge, {
						key: "badge",
						peak: period.peak,
						boundaryMs: period.boundaryMs,
						variant: "compact"
					}));
					foot.push(react.createElement("span", {
						className: usage_module_css_default.footPeakClock,
						key: "clock"
					}, t(period.peak ? "usage.peak.ends" : "usage.peak.starts", { time: formatClock(period.boundaryMs) })));
				}
				if (showUpdated) foot.push(react.createElement("span", {
					className: usage_module_css_default.footMeta,
					title: t("usage.updated", { time: formatClock(snapshot.updatedAt) }),
					key: "meta"
				}, formatClock(snapshot.updatedAt)));
				rows.push(react.createElement("span", {
					className: usage_module_css_default.footFoot,
					"data-dsh-part": "foot-card-foot",
					key: "foot"
				}, foot));
			}
			return react.createElement(react.Fragment, null, rows);
		}

		/** A non-interactive copy of the card for the Sidebar tab. */
		function UsageFootPreview(props) {
			const compact = props.values.footCompact === true;
			return react.createElement("div", {
				className: usage_module_css_default.footCard,
				"data-dsh-part": "foot-preview-card"
			}, react.createElement("div", {
				className: compact ? usage_module_css_default.footMain + " " + usage_module_css_default.footMainCompact : usage_module_css_default.footMain
			}, react.createElement(FootRows, {
				snapshot: props.snapshot,
				values: props.values
			})));
		}

		function UsageFootCard(props) {
			const { store, poll, onOpen, settings, locale } = props;
			const ui = (0, react.useSyncExternalStore)(store.subscribe, store.getSnapshot);
			const [, bump] = (0, react.useState)(0);
			(0, react.useEffect)(() => settings.subscribe(() => bump((count) => count + 1)), [settings]);
			(0, react.useEffect)(() => locale?.subscribe(() => bump((count) => count + 1)), [locale]);
			const values = settings.getSnapshot().value;
			const enabled = values?.enabled ?? true;
			const compact = values?.footCompact === true;
			const footValues = {
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
				planOrder: values?.planOrder
			};
			const [collapsed, setCollapsed] = (0, react.useState)(readFootCardCollapsed);
			const toggleCollapsed = () => {
				setCollapsed((current) => {
					writeFootCardCollapsed(!current);
					return !current;
				});
			};
			(0, react.useEffect)(() => {
				if (!enabled) return void 0;
				poll();
				let timer;
				const start = () => {
					if (timer === void 0 && document.visibilityState === "visible") timer = window.setInterval(poll, FOOT_CARD_POLL_MS);
				};
				const onVisibility = () => {
					if (document.visibilityState === "visible") {
						poll();
						start();
					} else if (timer !== void 0) {
						window.clearInterval(timer);
						timer = void 0;
					}
				};
				start();
				document.addEventListener("visibilitychange", onVisibility);
				return () => {
					if (timer !== void 0) window.clearInterval(timer);
					document.removeEventListener("visibilitychange", onVisibility);
				};
			}, [poll, enabled]);
			if (!enabled) return null;
			const snapshot = ui.snapshot;
			if (snapshot === null && ui.status === "error" && /failed: 404/.test(ui.error ?? "")) return null;
			const toggle = /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				type: "button",
				className: usage_module_css_default.footToggle,
				"data-dsh-part": "foot-card-toggle",
				"aria-label": t(collapsed ? "usage.foot.expand" : "usage.foot.collapse"),
				title: t(collapsed ? "usage.foot.expand" : "usage.foot.collapse"),
				onClick: toggleCollapsed,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ChevronIcon, { collapsed })
			});
			if (snapshot === null) {
				const quiet = ui.status === "error" ? t("usage.error", { error: ui.error ?? "" }) : t("usage.loading");
				return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: cardClass(collapsed),
					"data-dsh-plugin": "usage",
					"data-dsh-part": "foot-card",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: usage_module_css_default.footMain,
						"data-dsh-part": "foot-card-main",
						"aria-label": t("usage.foot.open"),
						title: t("usage.foot.open"),
						onClick: onOpen,
						children: collapsed ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: usage_module_css_default.footStrip,
							"data-dsh-part": "foot-card-strip",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(GaugeIcon, {}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: usage_module_css_default.footStripValue,
								children: "—"
							})]
						}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: usage_module_css_default.footHead,
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
								className: usage_module_css_default.footTitle,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(GaugeIcon, {}), t("usage.title")]
							})
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: usage_module_css_default.footLine,
							children: quiet
						})] })
					}), toggle]
				});
			}
			const head = headline(snapshot);
			// The published peak/off-peak clock is always in force, so the card
			// carries it on every route and on empty days instead of only when
			// the day's spend happened to run through the official family.
			const period = deepseekPeriodAt(Date.now());
			if (collapsed) return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: cardClass(true),
				"data-dsh-plugin": "usage",
				"data-dsh-part": "foot-card",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					type: "button",
					className: usage_module_css_default.footMain,
					"data-dsh-part": "foot-card-main",
					"aria-label": t("usage.foot.open"),
					title: t("usage.foot.open"),
					onClick: onOpen,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
						className: usage_module_css_default.footStrip,
						"data-dsh-part": "foot-card-strip",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(GaugeIcon, {}),
							head.provider !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: usage_module_css_default.footStripProvider,
								children: head.provider
							}),
							period !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(PeakBadge, {
								peak: period.peak,
								boundaryMs: period.boundaryMs,
								variant: "compact"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: usage_module_css_default.footStripLabel,
								children: head.label
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: usage_module_css_default.footStripValue,
								children: head.value
							})
						]
					})
				}), toggle]
			});
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: cardClass(false),
				"data-dsh-plugin": "usage",
				"data-dsh-part": "foot-card",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
					type: "button",
					className: compact ? `${usage_module_css_default.footMain} ${usage_module_css_default.footMainCompact}` : usage_module_css_default.footMain,
					"data-dsh-part": "foot-card-main",
					"aria-label": t("usage.foot.open"),
					title: t("usage.foot.open"),
					onClick: onOpen,
					children: [(0, react_jsx_runtime.jsx)(FootRows, {
						snapshot,
						values: footValues
					})]
				}), toggle]
			});
		}
		/** The shell slot whose occupant is the settings shell (and carries its store). */
		const SETTINGS_SEAT_SLOT = "sidebar.settings";
		/** The shell sidebar column, which also scopes the settings seat. */
		const SIDEBAR_SELECTOR = "[data-pane=\"sidebar\"], [class*=\"sidebarCol\"]";
		/** The shell's settings row: the launcher seat plus the Settings trigger fallback. */
		const SETTINGS_AREA_SELECTOR = "[class*=\"settingsArea\"]";
		/** A launcher that opens the settings dialog by itself (the shell's own gear). */
		const DIALOG_TRIGGER_SELECTOR = "button[aria-haspopup=\"dialog\"]";
		/** A launcher that opens a menu whose settings item opens the dialog (the account row). */
		const MENU_ITEM_SELECTOR = "[role=\"menu\"] button[role=\"menuitem\"]";
		/** One shell frame of the replay poll: menus and the panel mount a frame later. */
		const REPLAY_STEP_MS = 50;
		/** Replay poll budget in steps (about one second of shell frames). */
		const REPLAY_STEPS = 20;
		/** The shell sidebar column, when the shell has mounted one. */
		function sidebarColumn() {
			return document.querySelector(SIDEBAR_SELECTOR) ?? void 0;
		}
		/** The shell sidebar's foot area (footer actions + the Settings row), when mounted. */
		function footArea() {
			return sidebarColumn()?.querySelector("[class*=\"footArea\"]") ?? void 0;
		}
		/**
		* Resolve the settings shell's store handle from the `sidebar.settings` seat.
		*
		* The seat is a single-occupant slot and the shell's own registration carries
		* the store that owns the panel's open state and active section, so reading it
		* is the one step that opens the panel without touching the DOM. A shell that
		* exposes no seat, a seat without a store, or a registry answering mid-teardown
		* all yield undefined, and the caller replays the DOM path instead.
		* @param slots - the renderer-owned slot registry.
		* @returns the store handle, or undefined when the seat carries none.
		*/
		function settingsShellStore(slots) {
			let seat;
			try {
				seat = slots?.entries(SETTINGS_SEAT_SLOT)[0]?.store;
			} catch {
				return;
			}
			if (seat === void 0 || seat === null) return void 0;
			return typeof seat.create === "function" ? seat : void 0;
		}
		/**
		* Drive the shell's settings store onto the usage section.
		* @param store - the seat's store handle.
		* @param id - the section's slot registration id.
		* @returns true when the store accepted the call, false when it threw.
		*/
		function openThroughStore(store, id) {
			try {
				store.create().actions.openSection(id);
				return true;
			} catch {
				return false;
			}
		}
		/**
		* Click the nav row carrying the section's label inside the open panel.
		* @param panel - the open settings dialog.
		* @param label - the section's nav label in the active locale.
		*/
		function pickSectionRow(panel, label) {
			const wanted = label();
			for (const row of panel.querySelectorAll("nav button")) if (row.textContent !== null && row.textContent.includes(wanted)) {
				row.click();
				return;
			}
		}
		/**
		* Poll the page over the shell's next frames until a lookup yields a value.
		* @param find - the lookup, run once per step.
		* @param steps - remaining frame budget.
		* @returns the first value found, or undefined once the budget is spent.
		*/
		function until(find, steps = REPLAY_STEPS) {
			const found = find();
			if (found !== void 0 && found !== null) return Promise.resolve(found);
			if (steps <= 0) return Promise.resolve(void 0);
			return new Promise((resolve) => {
				window.setTimeout(resolve, REPLAY_STEP_MS);
			}).then(() => until(find, steps - 1));
		}
		/**
		* Replay the user's own settings path, one shell frame at a time.
		* @param launcher - the settings seat's trigger.
		* @param label - the section's nav label in the active locale.
		*/
		async function replay(launcher, label) {
			launcher.click();
			if (launcher.getAttribute("aria-haspopup") === "menu") {
				const item = await until(() => document.querySelector(MENU_ITEM_SELECTOR));
				if (item === void 0) return;
				item.click();
			}
			const panel = await until(() => document.querySelector("[role=\"dialog\"]"));
			if (panel !== void 0) pickSectionRow(panel, label);
		}
		/**
		* Open the settings panel on the usage section.
		*
		* The seat's store is the primary path: `openSection` opens the dialog on the
		* usage row in one call, with no dependence on which plugin occupies the
		* `settings.launcher` seat — an account row there turns a trigger click into a
		* menu, which is how this click used to land on the account menu instead of the
		* panel. Without such a store the card replays the user's own path: activate
		* the launcher (preferring the dialog trigger over a menu trigger), follow a
		* menu launcher's first settings item, then pick the nav row carrying the
		* section's label. Every step degrades silently — a missing surface leaves the
		* page untouched, and with the panel already open only the nav pick runs.
		* @param target - the section id, its localized label, and the seat's store.
		*/
		function openUsageSettings(target) {
			const { id, label, store } = target;
			if (store !== void 0 && openThroughStore(store, id)) return;
			const open = document.querySelector("[role=\"dialog\"]");
			if (open !== null) {
				pickSectionRow(open, label);
				return;
			}
			const area = sidebarColumn()?.querySelector(SETTINGS_AREA_SELECTOR);
			const launcher = area?.querySelector(DIALOG_TRIGGER_SELECTOR) ?? area?.querySelector("button");
			if (launcher === void 0 || launcher === null) return;
			replay(launcher, label);
		}
		/**
		* Mount the sidebar foot card directly above the Settings row.
		* @param props - the store/poll/settings/open inputs of the apply body.
		* @returns disposer removing the container and its observers.
		*/
		function mountUsageFootCard(props) {
			if (typeof document !== "undefined" && document.querySelector("[data-dsh-usage-foot-card]") !== null) return () => {};
			const container = document.createElement("div");
			container.setAttribute("data-dsh-usage-foot-card", "");
			const root = (0, react_dom_client.createRoot)(container);
			root.render((0, react.createElement)(UsageFootCard, props));
			/** Keep the container directly above the Settings seat inside the foot area. */
			const place = () => {
				const foot = footArea();
				if (foot === void 0) return;
				const settings = foot.querySelector(SETTINGS_AREA_SELECTOR);
				if (settings !== null) {
					if (container.nextElementSibling !== settings) foot.insertBefore(container, settings);
					return;
				}
				if (foot.lastElementChild !== container) foot.append(container);
			};
			place();
			const unsubscribeBody = subscribeBodyInvalidations(place);
			return () => {
				unsubscribeBody();
				root.unmount();
				container.remove();
			};
		}
		//#endregion
		//#region src/client/web-extension-page.ts
		const SETTINGS_SECTION = "settings.section";
		const WEB_EXTENSION_SLOT = "web-ui.extension";
		function serviceOf(ctx) {
			if (typeof ctx.get !== "function") return void 0;
			try {
				const candidate = ctx.get("webUiExtensions");
				return candidate !== null && typeof candidate === "object" && typeof candidate.sectionId === "string" && typeof candidate.registerPage === "function" ? candidate : void 0;
			} catch {
				return;
			}
		}
		function warn(seat, error) {
			try {
				console.warn(`[dsh-web-settings] page "${seat}" could not be mounted`, error);
			} catch {}
		}
		/**
		* Keep exactly one reachable page contribution while the parent loads or
		* unloads. The parent service owns integrated mounting; only the fallback uses
		* this plugin's own slot registry. Slot disposal is synchronous, so the latch
		* prevents a move from recursively registering a duplicate.
		*/
		function installWebExtensionPage(ctx, page) {
			let dispose;
			let current;
			let reconciling = false;
			let disposed = false;
			const present = (seat) => {
				if (typeof ctx.slots.entries !== "function") return current === seat;
				const slot = seat === "integrated" ? WEB_EXTENSION_SLOT : SETTINGS_SECTION;
				return ctx.slots.entries(slot).some((entry) => entry.component === page.component && (seat === "integrated" ? entry.options.key : entry.options.id) === page.key);
			};
			const registerSeat = (seat) => {
				if (seat === "integrated") {
					const service = serviceOf(ctx);
					if (service === void 0) throw new Error("webUiExtensions service is unavailable");
					return service.registerPage(page);
				}
				return ctx.slots.register({
					name: SETTINGS_SECTION,
					id: page.key,
					order: page.order,
					label: page.label,
					locale: page.locale,
					inject: page.inject,
					...page.children === void 0 ? {} : { children: page.children }
				}, page.component);
			};
			const reconcile = () => {
				if (disposed || reconciling) return;
				const target = serviceOf(ctx) === void 0 ? "legacy" : "integrated";
				if (current === target && present(target)) return;
				const slot = target === "integrated" ? WEB_EXTENSION_SLOT : SETTINGS_SECTION;
				if (typeof ctx.slots.spec === "function" && ctx.slots.spec(slot) === void 0) return;
				reconciling = true;
				const previous = current;
				const disposePrevious = dispose;
				current = void 0;
				dispose = void 0;
				disposePrevious?.();
				try {
					dispose = registerSeat(target);
					current = target;
				} catch (error) {
					warn(target, error);
					if (previous !== void 0 && previous !== target) try {
						dispose = registerSeat(previous);
						current = previous;
					} catch (restoreError) {
						warn(previous, restoreError);
					}
				} finally {
					reconciling = false;
				}
			};
			if (typeof ctx.on === "function") try {
				ctx.on("slots/changed", reconcile);
			} catch {}
			reconcile();
			return () => {
				if (disposed) return;
				disposed = true;
				dispose?.();
				dispose = void 0;
				current = void 0;
			};
		}
		//#endregion
		//#region src/client/section-integration.ts
		/**
		* Optional integration with the family Web Extensions parent.
		*
		* The parent service owns page mounting; this module contributes one page
		* contract and keeps the original first-level section as the standalone
		* fallback. Deep links still resolve the parent service first.
		*/
		const USAGE_SECTION_ID = "dsh-usage";
		/** Read the optional service without assuming a particular cordis test double. */
		function getWebUiExtensions(ctx) {
			if (typeof ctx.get !== "function") return void 0;
			try {
				const service = ctx.get("webUiExtensions");
				return service?.sectionId === "web-ui-plugins" && typeof service.label === "function" && typeof service.open === "function" ? service : void 0;
			} catch {
				return;
			}
		}
		/** Register the one usage page; disposal is owned by the calling plugin fiber. */
		function installUsageSection(ctx, registration) {
			return installWebExtensionPage(ctx, {
				key: USAGE_SECTION_ID,
				order: registration.order,
				locale: registration.locale,
				label: registration.label,
				inject: registration.inject,
				component: registration.component
			});
		}
		/**
		* Open usage through the family service first. If it declines, fall back to the
		* native settings shell on the family section (or on the original usage row
		* when the service is absent), preserving the matching localized nav label.
		*/
		function openIntegratedUsageSettings(ctx) {
			const service = getWebUiExtensions(ctx);
			if (service?.open("dsh-usage") === true) return;
			openUsageSettings({
				id: service?.sectionId ?? "dsh-usage",
				label: service === void 0 ? () => t("usage.title") : () => service.label(),
				store: settingsShellStore(ctx.slots)
			});
		}
		//#endregion
		//#region src/client/settings-entry-form.ts
		/** The snapshot a form reports before the Host has answered with this entry. */
		function pendingSnapshot() {
			return {
				status: "loading",
				value: void 0,
				base: void 0,
				user: void 0,
				revision: void 0,
				writable: false
			};
		}
		/**
		* Create a settings form bound to the profile entry id this Host serves, and
		* rebound whenever the shared describe mirror names a different one of this
		* package's rows.
		* @param options - the shared forms service and this package's candidate row ids.
		* @returns a form delegating to the currently resolved entry's own form.
		*/
		function createServedEntryForm(options) {
			const { forms, entryIds } = options;
			const fallbackId = entryIds[0];
			const namespaceId = entryIds[entryIds.length - 1];
			const listeners = /* @__PURE__ */ new Set();
			let boundId;
			let bound;
			let offBound;
			let snapshot = pendingSnapshot();
			/** Republish: the delegated snapshot when one is bound, the pending one otherwise. */
			const publish = () => {
				if (bound !== void 0) snapshot = bound.getSnapshot();
				for (const listener of [...listeners]) listener();
			};
			/**
			* The entry id the mirror currently justifies. An unanswered or empty mirror
			* is not evidence of absence, so it keeps the first candidate; a mirror that
			* answers without any of this package's rows leaves the namespace itself.
			* @returns the entry id to bind.
			*/
			const resolve = () => {
				let served;
				try {
					served = forms.describe().getSnapshot().view?.namespaces.map((row) => row.ns);
				} catch {
					served = void 0;
				}
				if (served === void 0 || served.length === 0) return fallbackId;
				return entryIds.find((id) => served.includes(id)) ?? namespaceId;
			};
			/** Bind (or rebind) the resolved entry's form; a no-op while it is unchanged. */
			const bind = () => {
				const target = resolve();
				if (target === boundId) return;
				offBound?.();
				offBound = void 0;
				let form;
				try {
					form = forms.get(target);
				} catch {
					boundId = void 0;
					return;
				}
				boundId = target;
				bound = form;
				offBound = form.subscribe(() => {
					publish();
				});
				publish();
			};
			try {
				forms.describe().subscribe(() => {
					bind();
				});
			} catch {}
			bind();
			return {
				getSnapshot: () => snapshot,
				subscribe: (listener) => {
					listeners.add(listener);
					return () => {
						listeners.delete(listener);
					};
				},
				set: (field, value) => bound?.set(field, value) ?? Promise.resolve(false),
				unset: (field) => bound?.unset(field) ?? Promise.resolve(false),
				mutate: (ops, expectedRevision) => bound?.mutate(ops, expectedRevision) ?? Promise.resolve(false)
			};
		}
		//#endregion
		//#region src/client/index.ts
		/** Hard ceiling for one usage API call; a stalled host must not pile up requests. */
		const USAGE_FETCH_TIMEOUT_MS = 2e4;
		async function usageFetch(path, method) {
			const response = await fetch(path, {
				...method === "POST" ? { method: "POST" } : {},
				signal: AbortSignal.timeout(USAGE_FETCH_TIMEOUT_MS)
			});
			if (!response.ok) throw new Error("usage " + path + " failed: " + response.status);
			return await response.json();
		}
		const usageApi = {
			overview: () => usageFetch("api/dsh-usage/overview", "GET"),
			day: async (date) => (await usageFetch("api/dsh-usage/day?date=" + encodeURIComponent(date), "GET")).day,
			refresh: () => usageFetch("api/dsh-usage/refresh", "POST"),
			rescan: () => usageFetch("api/dsh-usage/rescan", "POST")
		};
		/**
		* Settings namespace the section edits: the family identity of this plugin's
		* own settings form, and the row id a standalone bundle install carries.
		*/
		const USAGE_SETTINGS_NS = "dsh-usage";
		/** Profile entry ids this package's patch rows carry, most likely first. */
		const USAGE_ENTRY_IDS = [
			"web-ui-usage",
			"usage",
			USAGE_SETTINGS_NS
		];
		/** First-level nav position: directly below the Workshop section (order 150). */
		const SECTION_ORDER = 151;
		/** Required services. */
		const inject = [
			"slots",
			"locale",
			"connection",
			"configForms",
			"remote"
		];
		/**
		* Client plugin body: register dictionaries and seat the settings section.
		* The overview poll loop and the store live with the section component's
		* mount cycle, so no background traffic exists while the page is closed.
		* @param ctx - client root context.
		*/
		function apply(ctx) {
			ctx.effect(() => {
				try {
					return ctx.locale.register(NS, {
						zh,
						en
					});
				} catch {
					return () => {};
				}
			}, "dsh-usage: dictionaries");
			const binder = ctx.get("webUiSettings");
			const settingsForm = binder !== void 0 ? binder.bind({ namespace: USAGE_SETTINGS_NS }) : createServedEntryForm({
				forms: ctx.configForms,
				entryIds: USAGE_ENTRY_IDS
			});
			const store = createUsageStore().create();
			let pollSeq = 0;
			const poll = () => {
				const seq = pollSeq + 1;
				pollSeq = seq;
				usageApi.overview().then((snapshot) => {
					if (seq !== pollSeq) return;
					store.actions.setSnapshot(snapshot);
				}, (error) => {
					if (seq !== pollSeq) return;
					store.actions.setState("error", error instanceof Error ? error.message : String(error));
				});
			};
			const refresh = () => {
				const seq = pollSeq + 1;
				pollSeq = seq;
				usageApi.refresh().then((snapshot) => {
					pollSeq = seq;
					store.actions.setSnapshot(snapshot);
				}, (error) => {
					if (seq !== pollSeq) return;
					store.actions.setState("error", error instanceof Error ? error.message : String(error));
				});
			};
			const rescan = () => {
				const seq = pollSeq + 1;
				pollSeq = seq;
				usageApi.rescan().then((snapshot) => {
					pollSeq = seq;
					store.actions.setSnapshot(snapshot);
				}, (error) => {
					if (seq !== pollSeq) return;
					store.actions.setState("error", error instanceof Error ? error.message : String(error));
				});
			};
			const loadDay = (date) => usageApi.day(date);
			const settingsCard = new UsageSettingsCardController(settingsForm);
			ctx.effect(() => () => {
				settingsCard.dispose();
			}, "dsh-usage: settings card");
			const settingsCardFace = settingsCard.inject();
			const face = () => ({
				store,
				poll,
				refresh,
				rescan,
				loadDay,
				settingsCard: settingsCardFace
			});
			const disposeFootCard = mountUsageFootCard({
				store,
				poll,
				settings: settingsForm,
				onOpen: () => {
					openIntegratedUsageSettings(ctx);
				},
				locale: ctx.locale
			});
			ctx.effect(() => () => {
				try {
					disposeFootCard();
				} catch {}
			}, "dsh-usage: sidebar foot card");
			ctx.effect(() => installUsageSection(ctx, {
				order: SECTION_ORDER,
				label: () => ctx.locale.bind(NS)("usage.title"),
				locale: NS,
				inject: face,
				component: UsageSectionCard
			}), "dsh-usage: settings page");
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map