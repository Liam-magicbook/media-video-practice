# AI 的数学稿，Lean 检查了什么？

成片入口：`film.html`（1920×1080，横版，约 107 秒，自动播放；浏览器拦截有声自动播放时点右上角“开启旁白”）。

## 一句话

OpenAI 公开 719 篇 AI 生成的数学稿件，约 42% 的 top-line 结果附 Lean 形式化；Lean 能检查写进形式系统的陈述与推导，但不能替代“这句话是否忠实表达原问题、结果是否重要、同行是否复核”。

## 叙事结构

| 时间 | 段落 | 作用 |
| --- | --- | --- |
| 0–14s | 发布规模 | X 官方帖 + README：719 / 372 / 42% |
| 14–27s | 核心问题 | Lean 通过 ≠ 数学成立；翻译链 |
| 27–38s | Lean 画面 | 教学演示：编译通过、`sorry` 占位、目标栏显示完成 |
| 38–54s | 独立论文 | arXiv:2610.08144：Lean 证明与自然语言证明不对应 |
| 54–69s | 独立报道与数学界 | TechCrunch、陶哲轩转述、AGMAI 声明 |
| 69–73s | 公开讲座 | SMF：数学家在公开场合讨论 |
| 73–90s | 修订记录 | 10 月 7 日：3 撤回、14 修订、300/719 |
| 90–107s | 收束 | Lean 能保证 / 不能保证；三处核对 |

## 来源

- OpenAI 发布说明，2026-10-06：<https://openai.com/index/sharing-ai-progress-in-mathematics/>。发布方自述；本地截图为 Cloudflare 验证页，未用于成片。
- GitHub `openai/math` README（采集于 2026-10-12）：<https://github.com/openai/math>。当前目录 719 篇、372 个结果族；约 42% top-line results 附 Lean formalization；并非全部有形式化。
- GitHub `history.md`，2026-10-07：3 篇因代数几何论证中的 sign error 撤回，14 篇修订，新增 6 个形式化达到 300/719。
- TechCrunch，2026-10-08，Tim Fernholz：<https://techcrunch.com/2026/10/08/openais-math-solutions-arent-meeting-the-fields-standards-yet/>。报道引述 AGMAI 九位研究者的声明与陶哲轩的社媒发言；仅 10/719 稿件附模型思维链；差异不必然推翻任一解法，但不能只靠模型给自身解法做形式化。
- Bastounis / Circelli / Hansen，arXiv:2610.08144，2026-10-06：<https://arxiv.org/abs/2610.08144>。分析 OpenAI 2026 年 9 月公布的 Navier–Stokes 材料，指出形式化 Lean 证明与自然语言证明不对应；明确不是对 719 篇的审计，也不裁定原证明本身。
- X / @OpenAI，2026-10-07：<https://x.com/OpenAI/status/2107596713791767021>。官方如何表述这次发布；互动数字会变化。
- SMF 公开讲座，2026，Hugo Duminil-Copin：“Un grave défaut d'alignement de l'IA en math”。本地视频为研究画面，不是 OpenAI 发布会。
- Lean 4 教学演示（Xena Project）：<https://www.youtube.com/watch?v=POHVMMG7pqE>。仅用于解释 Lean 界面与 `sorry` 占位，不是 OpenAI 的实际操作，也不代表这些稿件。

## 事实边界

- 719 是采集日仓库当前数量；首发传播中的 722 不作为当前数量使用。
- 42% 的分母是 top-line results，不是 719 篇稿件。
- Lean 编译只保证形式系统内的陈述与推导；不保证自然语言语义对应、原创性、重要性或同行复核。
- arXiv 论文针对 9 月 Navier–Stokes 材料，不能据此推断 10 月这 719 篇都有同样问题。
- 陶哲轩与 AGMAI 的表述经 TechCrunch 转述；前者是个人观点，后者是顾问组声明，都不等于数学界共识。
- 本片没有独立运行 Lean、逐篇核验稿件或复现论文结果。

## 素材权利

两段第三方视频（Xena Project 教学、SMF 讲座）与各页面截图的再发布授权未核实；本产物仅作内部审看，公开传播前需按用途处理。
