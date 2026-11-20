# dsh-usage · DeepSeek Harness 用量统计插件

[English](README.md) | 中文

> **DeepSeek Harness (DSH) 的独立用量插件。** 以 `@legifyx/dsh-usage` 发布，是
> `@linxin666/dsh-usage`（Apache-2.0）的分支：移除了 Token 银行，新增按提供方
> 选择显示货币、提供方排序与用量端点自动发现。禁用 `dsh-web` 套装自带的用量行后，
> 即可与本插件并存安装。与上游的差异见 [CHANGELOG.md](CHANGELOG.md)。

<p align="center">
  <img src="https://img.shields.io/badge/DSH-%3E%3D0.2.2--rc.1-4c6ef5?style=flat-square&amp;labelColor=454a54" alt="DSH">
  &nbsp;
  <img src="https://img.shields.io/badge/license-Apache--2.0-blue?style=flat-square" alt="License">
</p>

## 安装

本包是一个 bundle：`dsh.bundle.patch` 指向 `cordis.patch.yml`，由它自行插入
`dsh-usage` 行；`dsh.client` 声明 Web 扩展页面。可在 Web UI 的插件管理器中安装，
或在命令行执行：

```bash
dsh plugin --profile web add github:LegifyX/dsh-usage#<commit>
```

然后在 设置 → 插件 中启用 `dsh-usage` bundle。固定到具体 commit，升级时更可控。

若已安装 `dsh-web` 套装，它自带一个用量行（`web-ui-usage`），请禁用以避免页面
重复挂载：

```yaml
- id: web-ui-usage
  disabled: true
```

如果以前的手动安装留下过 `- insert: dsh-usage` 行或 link 依赖，请删除：现在由
bundle patch 自行插入该行，同 id 的第二行会让插件挂载两次。

安装后需重启一次宿主，以加载补丁行与客户端模块清单。之后修改 `lib/client.js`
只需刷新页面，修改 `lib/index.js` 仍需重启。

无需其它配置：余额与套餐来自 profile 中 `llm-pi-ai` 的路由及其凭据引用，并按
API origin 匹配。

## 功能

页面位于 **设置 → Web 扩展 → Usage Statistics**（没有 Web 扩展父级时作为一级
"用量统计" 页面），包含三个标签页。

**Usage（用量）**
- 今日各 token 桶（输入 / 输出 / 缓存读 / 缓存写）不重叠统计、当前峰谷计费时段与
  估算花费。
- 日期选择器：可切换到保留期内任意有用量的日期。
- 每个已配置提供方一行余额，并显示账户报告的所有币种；可逐个显隐与排序。
- 提供方自身的消费上限（如 AMD Cloud 的每日美元上限、中转密钥的美元限额）。
- 最近 30 天的按提供方、按模型的横向条形图。
- 货币卡片：总计显示货币与汇率，以及每个提供方单独的 原生 / CNY / USD / 双币 选择。

**Plans（套餐）**
- 每个报告订阅的提供方一张卡片：套餐窗口（Kimi For Coding、OpenCode Go、
  Codex/ChatGPT）或 token 配额计量（deeprelay），同样可逐个显隐与排序。

**Sidebar（侧边栏）**
- 侧边栏卡片的实时预览、轮询间隔，以及全部卡片开关（主数字、tokens/调用次数、
  余额、套餐计量、峰谷时钟、更新时间、紧凑间距），还有各提供方卡片的显隐与排序。

**侧边栏速览卡片**
- 顶部为今日花费（没有计价记录时显示今日 tokens），下方依次是 tokens/调用次数、
  每个可见余额一行、每个可见套餐一块计量条、峰谷时钟和最后更新时间。整张卡片可点击
  打开用量页面；右侧箭头可折叠为一行摘要。

探测全部在宿主侧按轮询周期执行（默认 60 秒，另有 **刷新** 与 **重新扫描限额**）。
API key 通过 harness 的凭据接缝（`llm-pi-ai` 记录、`apiKeyEnv` 引用）解析，永不
下发到浏览器。

### 支持的套餐

只有适配器已知端点形状的提供方才会被探测，因此下面就是完整列表，其余保持不探测。

| 套餐 | 端点 | 窗口 |
| --- | --- | --- |
| Codex / ChatGPT 订阅 | OAuth 授权，ChatGPT 后端 | 5 小时、周 |
| deeprelay | `GET /v1/billing/subscription` | 月（加权输入/输出）、滚动 7 天（加权输入/输出）、重置日期 |
| GLM Coding Plan（国内/国际） | `GET /api/monitor/usage/quota/limit`（open.bigmodel.cn 或 api.z.ai） | 5 小时、周、月 |
| Kimi For Coding | `GET /coding/v1/usages`（api.kimi.com） | 5 小时、周 |
| MiniMax Coding Plan（国内/国际） | `GET /v1/api/openplatform/coding_plan/remains` | 5 小时、周 |
| OpenCode Go | `GET /zen/go/v1/usage`（opencode.ai） | 滚动、周、月 |

套餐与余额按路由的 API origin 匹配，而不是名字：任何指向提供方域名的路由都能识别，
无论它叫什么；base URL 匹配不到任何适配器的路由会被视为其它提供方，而不会按 id 误认。

套餐端点的形状与访问方式各不相同，我们也无法看到别人账户里的套餐数据。如需新增套餐，
请提交 issue 或 PR，附上该提供方端点的示例响应（脱敏后）与路由 id：新增一个套餐只需
一条适配器条目，但只能基于我们能够观察到的端点来实现。

## 提供方

内置适配器按路由的 **API origin** 匹配。只有未配置 base URL 时才回退到路由 id，因此改了名字的路由（如 `deeprelay-dshflash`）只要指向提供方自己的域名就能识别：

| 类型 | 提供方 |
| --- | --- |
| 余额 | DeepSeek 账户（CNY + USD）、Moonshot（国内/国际）、OpenRouter、SiliconFlow（国内/国际）、ZenMux、refuseless |
| 套餐窗口 | Kimi For Coding、GLM Coding Plan（国内/国际）、MiniMax Coding Plan（国内/国际）、OpenCode Go、Codex / ChatGPT 订阅（OAuth 授权） |
| 套餐配额 | deeprelay 套餐：名称/价格、每月与滚动 7 天的加权输入/输出、重置日期 |
| 消费上限 | AMD Cloud（`/v1/usage`：每日美元上限）、numes（密钥限额） |

**自动发现。** 没有手写适配器的已配置提供方，会针对其自身 base URL 探测一次已知
形状：`/usage`（每日消费上限）、`/key`（OpenRouter 风格密钥）、`/credits`（钱包）。
只接受字段符合的 JSON，并拒绝重定向，因此对所有路径都返回 HTML 的应用会被排除。
命中的形状缓存在 `provider-probes.json` 中复用；失败一周后重试，**重新扫描限额**
会清空缓存。没有任何程序化端点的提供方（如 NVIDIA、本地 llama.cpp、局域网
Open WebUI）保持不探测。

## 配置

| 键 | 默认 | 含义 |
| --- | --- | --- |
| `enabled` | `true` | 总开关；关闭后无监听、无探测、无路由 |
| `pollIntervalSec` | `60` | 探测周期（秒，30-3600） |
| `retainDays` | `180` | 账本保留天数（本地日，7-730） |
| `spendCurrency` | `CNY` | 总计花费的显示货币（`CNY` / `USD`） |
| `cnyPerUsd` | `7.2` | 以 USD 显示 CNY 计价花费时使用的汇率 |
| `providerCurrency` | `''` | 各提供方花费显示货币（`provider:choice,...`） |
| `footShowSpend` | `true` | 侧边栏主数字行 |
| `footShowUsage` | `true` | 侧边栏 tokens/调用次数行 |
| `footShowBalances` | `true` | 侧边栏余额行 |
| `footShowMeters` | `true` | 侧边栏套餐计量块 |
| `footMeterWindow` | `week` | 侧边栏套餐窗口（`week` / `month`） |
| `footShowPeak` | `true` | 侧边栏峰谷时钟 |
| `footShowUpdated` | `true` | 侧边栏更新时间 |
| `footCompact` | `false` | 侧边栏紧凑间距 |
| `hiddenBalances` | `''` | 从余额卡片隐藏的提供方 id |
| `hiddenPlans` | `''` | 从套餐页隐藏的提供方 id |
| `balanceOrder` | `''` | 用户设定的余额顺序（提供方 id） |
| `planOrder` | `''` | 用户设定的套餐顺序（提供方 id） |

## 花费估算

费用在入库时按 DeepSeek 公布的峰谷价格表计价。维护两套价格表：CNY（账本存储值）与
USD（`costUsd`，独立计价而非换算）。峰时为北京时间工作日 09:00-12:00 与
14:00-18:00；公布的中国法定节假日表会把节假日工作日按谷时计价。仅官方 DeepSeek
系列计价；中转流量保持未计价（`0`），未知 DeepSeek 模型 id 按 flash 档计价。价格表
变更自发布起生效，不追溯调整。

## 数据文件

位于 `$DSH_HOME/dsh-usage/`：

| 文件 | 内容 |
| --- | --- |
| `usage-ledger.json` | 按日 / 提供方 / 模型的 token 总量与费用 |
| `provider-snapshots.json` | 最近一次成功的余额、套餐、配额与消费上限快照 |
| `provider-probes.json` | 无适配器提供方的自动发现结果 |

## HTTP 接口

全部限制在回环地址、带同源标记的局域网，或已配对的远程会话：

| 方法 | 路径 | 用途 |
| --- | --- | --- |
| GET | `/api/dsh-usage/overview` | 完整概览文档 |
| GET | `/api/dsh-usage/day?date=YYYY-MM-DD` | 单个保留日 |
| POST | `/api/dsh-usage/refresh` | 立即执行一次探测 |
| POST | `/api/dsh-usage/rescan` | 清空发现缓存并重新探测 |

## 限制

- 从首次启用插件开始计数，不回填历史会话。
- OAuth 路由会被识别但不会探测；插件不会消耗第三方 OAuth 预算。
- 探测失败时保留上一次结果并显示错误行。
- 套餐页只显示报告了有效订阅且至少有一个正数 token 限额的提供方；免费或过期套餐
  不会显示。
- 自动发现只能报告提供方实际暴露的内容；没有用量端点的提供方保持不探测。
- 日期选择器只列出账本记录过用量的日期。

## 来源

分支自 `@linxin666/dsh-usage`（上游：`zhu1090093659/dsh-web` 的
`packages/dsh-usage`），Apache-2.0。见 [LICENSE](LICENSE)。
