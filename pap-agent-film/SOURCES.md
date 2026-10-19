# AI 替你办事，权限由谁决定？

## 成片

`film.html`：1920×1080 横版，120 秒，自动播放。中文旁白、逐句字幕、字体、视频和图片均保存在本地。浏览器拦截有声自动播放时，画面与字幕继续推进，右上角可开启旁白。支持暂停、重播、全屏与拖动进度。

这轮重剪围绕同一次峰会演示，按“请求连接 → 请求账户登录 → 解释授权与动作边界 → 返回预批结果”组织材料。关键画面来自补取得到的真实原片；英文证据由蒙版和局部取景引导，并配中文解释。旧版 HTML、JS、时码与旁白保存在 `research/before-recut/`。

## 新补取的核心原片

**来源**：[Sierra 官方演示原帖](https://x.com/SierraPlatform/status/2108245197440307584)。通过该公开原帖的公开媒体元数据取得原视频，1920×1080，约 196.6 秒。文件：`assets/sierra-summit-demo.mp4`。原始元数据和下载地址保存在 `research/recut/summit-video-source.json`。

实看画面及本片采用的原片区间：

| 原片区间 | 可见内容及用途 |
| --- | --- |
| 00:00–00:05 | Alex McGillis 演示现场，建立人物与事件 |
| 00:54–01:02 | Muse 展示房源，继续房贷任务 |
| 01:32–01:35 | “Allow Muse to contact a Rocket Mortgage agent?” 连接请求及允许按钮 |
| 02:12–02:15 | “Allow Muse to sign in to Rocket Mortgage?” 账户登录请求 |
| 02:46–02:52 | 现场与代理对话画面，作为收束背景 |
| 02:58–03:02 | 聊天中出现预批结果与 Pre-approval letter 文件卡片 |
| 03:08–03:14 | 现场全景，作为结尾核对三个信息位置的背景 |

影片对以上区间做剪辑、局部放大和部分慢放。静态对照中的 `summit-link.jpg`、`summit-login.jpg`、`summit-result.jpg` 分别为原片 94、134、182 秒的定格。它们均为原片派生画面，未伪造界面。

**事实边界**：这证明原片展示了相关演示过程。没有独立验证真实贷款、生产服务效果或大规模部署。连接授权、账户登录、具体动作确认分别解释，不把演示中的两个允许按钮都称为动作批准。

## 官方原文与机制图

- [Sierra 草案公告，2026-10-09](https://sierra.ai/blog/poppy)：公开 Poppy 草案，宣布新增设计伙伴，描述 Muse/Rocket 峰会演示。`draft-head.png` 为真实 Chrome 截图；`partners.webp`、`architecture.webp` 来自该页官方原图。
- [Personal Agent Protocol / Draft 0.1](https://personalagentprotocol.org/docs/spec)：同一会话跨网页、API 与企业代理；`poppy:read` 与 `poppy:write` 相互独立，具体操作所需权限由企业决定并执行。片中 `spec-scopes.png` 为真实原文截图。
- [Operations extension](https://personalagentprotocol.org/docs/extensions/operations)：**可选**扩展；确认绑定条款版本，同一动作 ID 至多执行一次；新条款版本需要覆盖该版本的批准，可能来自当次用户确认，也可能来自仍适用的此前许可。`ops-intro.png`、`ops-trust.png` 为真实原文截图。片中的 v1/v2、重试与确认关系为机制解释，明确标为示意，不冒充产品 UI。
- 同页第 8 节明确：代理声明获准不能证明用户实际看过或同意条款。企业若需更强证明，可让用户回到自己的网站登录批准，该步骤不由该扩展定义。

## 社交讨论

[Dino A. Dai Zovi 10 月 11 日原帖](https://x.com/dinodaizovi/status/2109096066746380721) 提出人的确认应有证明。截图来自用户提供的 10 月 12 日素材包，互动数字只代表当时状态。本片以此呈现问题与观点，没有将它当作已验证漏洞。

## 搜集但未作为本片证据的公开样例

重新读取了 [irvinebroque/poppy-demo](https://github.com/irvinebroque/poppy-demo)，并打开其 caller 与 receiver 网页。它是虚构店铺与模拟账户的开发者样例，非实际交易。由于本轮取得了更贴近故事主线的峰会原片，最终没有把样例界面混入官方演示。网页快照保存在 `research/recut/`。

## 字体、声音与代码

- **Noto Sans SC**：高字重标题、字幕与来源。
- **Noto Serif SC**：关键追问、引语与结论。
- **Barlow Condensed Bold**：核心数字、版本与 Poppy 字样。

三套字体来自 Google Fonts 官方仓库，本地打包 OFL 许可。中文子集覆盖这次片中文字，字体来源见 `assets/fonts/sources.json`。截图内部文字保留原始字形。

中文旁白由 macOS Tingting 合成，根据句子重要程度调整语速与停顿；`edit-script.json` 保存文案和交付参数，`timeline.js` 保存实际录音时码。

`craft.js` 提供源坐标取景、蒙版、标注、连线与字体角色；`film.js` 承担本片具体编排。`DIRECTING.md` 与可调用技能 `real-material-film` 保存本轮形成的制作方法，供以后按新材料重新设计。

本片为基于来源的新闻解释制作。公开视频和引用链接不等于完成转载授权，原素材权利仍需在公开传播前按用途处理。
