# AI 替你办事，权限谁说了算？

成片：`film.html`，120 秒，16:9。中文旁白、逐句字幕与真实素材均保存在本目录。直接打开即可自动播放；如浏览器阻止有声自动播放，画面与字幕仍自动推进，右上角可开启旁白。支持暂停、重播、全屏和底部拖动进度。

本次依据提供的 2026-10-12 素材包，重新读取官方页面并补取真实浏览器截图。没有复用旧制作模板或经验文件。实时动画由 requestAnimationFrame 驱动，源视频由浏览器原生播放，页面不依赖网络。

## 官方事实与补取素材

- [Sierra 首次公告，2026-10-06](https://sierra.ai/uk/blog/introducing-personal-agent-protocol)：Meta、Sierra 与行业合作伙伴开发协议，用户授予访问权限，企业规定可执行动作。
- [Sierra 草案公告，2026-10-09](https://sierra.ai/blog/poppy)：公开 Poppy 草案、新增 35 家设计伙伴、Rocket/Muse 峰会演示的公司描述。`draft-head.png` 为本次真实 Chrome 页面截图；`partners.webp`、`architecture.webp` 来自该页官方原图，缩小保存。
- [Personal Agent Protocol / Draft 0.1](https://personalagentprotocol.org/docs/spec)：发现文档 `/.well-known/poppy.json`；会话与身份；直接登录；相互独立的 `poppy:read` 和 `poppy:write`；企业按渠道执行权限。`spec-*.png` 为本次真实 Chrome 原文截图。`session-guest.png` 为 Sierra 草案公告中的访客会话原文。
- [Operations extension](https://personalagentprotocol.org/docs/extensions/operations)：可选扩展。确认对应条款版本，同一 operation ID 至多执行一次。新版本须有覆盖该版本的批准，既可以当次取得，也可以来自仍覆盖所有条款的既有许可。第 8 节明确：代理的确认不能证明用户实际看到或同意。`ops-intro.png`、`ops-trust.png` 为本次原文截图。片中不能把这部分继续称为“只有未来规划”。
- [Path to 1.0](https://personalagentprotocol.org/docs/path-to-1)：当前仍为草案，可发生不兼容变化；支付、主动通知、附件列为开放议题。`path-open.png` 为本次原文截图。
- 官方原图：[伙伴](https://cdn.sanity.io/images/ca4jck6w/production/f149dfc1c5458978488d042d20b7687f7cdb9e48-3840x2160.png)、[机制](https://cdn.sanity.io/images/ca4jck6w/production/2df3c42011c348fe619d4dc8d3b1cbc1fd5e8584-3840x2160.png)。

## 提供素材包中采用的真实素材

- [Meta Muse Shopping 官方演示](https://about.fb.com/wp-content/uploads/2026/09/Muse_Shopping.mp4)：开头使用原片约 6–22 秒；79.95–91.96 秒返回购物确认流程，使用原片约 16.2–22.8 秒并慢放，为 9 月购物产品场景，**不作为 Poppy 峰会、房贷演示或真实交易完成的证据**。原声静音，由中文解说推进。
- [CNBC 2026-10-06 报道](https://www.cnbc.com/video/2026/10/06/meta-walmart-stripe-and-sierra-partner-to-establish-rules-for-personal-ai-agents.html)：使用约 31–35 秒真实报道画面。画面上的股票数字属于来源画面，不作当前行情展示或解说依据。
- [Sierra 演示原帖](https://x.com/SierraPlatform/status/2108245197440307584)：静态真实原帖含活动缩略图；**没有将缩略图伪装为已取得的峰会原片**。与公司文章共同支持“公司公布了演示”的表述，不证明产品已部署或贷款发放。
- [Alex McGillis 官方讲者页](https://sierra.ai/events/sierra-summit-2026-register)：讲者肖像，非现场新闻照片。
- [Dino A. Dai Zovi：人的确认](https://x.com/dinodaizovi/status/2109096066746380721)：真实原帖讨论，仅表示该观点的存在。
- [Dino A. Dai Zovi：假设性 OAuth 风险](https://x.com/dinodaizovi/status/2109280806078165198)：作者明确表示不了解具体系统。片中标注为担忧，**没有当作已验证的协议漏洞**。

社交帖截图为提供素材包中 10 月 12 日取得的原帖截图，互动数字仅是当时状态。

## 交付与播放

- `film.html` / `film.js` / `timeline.js`：成片与确定性时间轴。
- `assets/`：本地图片、源视频与 120 秒中文旁白录音。语音由 macOS Tingting 合成，未调用外部密钥。
- `research/` 与 `tools/`：本次取材坐标、原文快照、制作脚本与内部取景稿，播放不依赖它们。

本片是基于来源进行的新闻解释制作。引用来源不等于取得转载授权；所给素材包对 CNBC、社交截图、肖像等的公开传播权利未完成核清。

## 字体编排更新

成片现随包提供三套字体，均来自 Google Fonts 官方仓库并附 OFL 许可。字体按本片实际用字做子集，播放时不请求外网。

- **Noto Sans SC**：主标题用高字重和较紧字距；字幕、说明和来源使用较轻字重。
- **Noto Serif SC**：用于关键追问、引语与结论，让它们与流程说明形成可辨认的字形差异。
- **Barlow Condensed Bold**：用于核心数字和片中 Poppy 字样。

这套搭配借鉴参考片按信息角色分配字体的做法，不声称复原了参考片实际采用的字体。素材截图内部的原文字体保持原样。原始下载地址见 `assets/fonts/sources.json`，本次更新前的 HTML/JS 留在 `research/before-typography/`。
