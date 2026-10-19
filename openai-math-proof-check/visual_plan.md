# 视觉计划 · AI 的数学稿，Lean 检查了什么？

本片在 `video_media` 的 canvas 管线内实现：`craft.js` 用一套归一化源坐标同时服务取景、蒙版和证据框；`film.js` 是时间轴纯函数。`production/reusable-forms/effects.json` 与 `showcase.html` 已完整阅读，下列 effect id 作为视觉语法参照，具体动效由 canvas 同构实现（未直接引入 `forms.js`，因为该表单是 9:16 DOM 结构，本片为 1920×1080 canvas）。

| 镜头 / cue | effect id | 画面动作 | 证据框（源图归一化） |
| --- | --- | --- | --- |
| 0–2 发布规模 | `floating-social-post` + `source-panel` + `number-card` | X 帖浮入 → README 面板推入 → 719/372/42% 数字 | README `[.149,.825,.383,.017]` |
| 3 核心问题 | `status-stamp`（红斜线替代“=”） | 纸面大字：Lean 通过 ≠ 数学成立 | 无（非证据镜头） |
| 4–6 翻译链 | `evidence-highlight`（语义缺口） | 三卡片逐张出现；红线标出“翻译 ≠ 等价” | 无（机制示意，明示） |
| 7–9 Lean 画面 | `source-panel` + `evidence-highlight` | 教学演示；`sorry` 红框；目标栏放大 | `sorry [.100,.270,.049,.032]`；goal `[.710,.128,.240,.045]` |
| 10–13 arXiv | `source-panel` + `evidence-highlight` + `status-stamp` | 标题条 → 摘要整页 → “不裁定原证明”印章 | 标题 `[.014,.121,.738,.058]`；摘要 `[.025,.404,.780,.044]` |
| 14–15 TechCrunch | `evidence-highlight` | 段落红框；第二句琥珀框 | `[.156,.763,.451,.082]`；`[.338,.792,.232,.022]` |
| 16–17 数学界 | `stacked-quotes`（双卡）+ `evidence-highlight` | 陶哲轩卡 → AGMAI 卡叠入；两次证据框 | Tao `[.156,.687,.455,.112]`；AGMAI `[.196,.629,.412,.047]` |
| 18 SMF 讲座 | `floating-speaker-inset` + `source-panel` | 幻灯片 + 讲者浮窗 + 中文标题释义 | 视频镜头，免框 |
| 19–21 修订 | `timeline` + `number-card` + `status-stamp` | 日期锚点；3/14/+6/300/719 逐项出现；“NOT LEAN”印章 | 日期 `[.253,.555,.220,.085]`；sign error `[.253,.666,.640,.058]` |
| 22 思维链 | `number-card` + `evidence-highlight` | 10/719 大数字 + 原句框 | `[.157,.418,.450,.045]` |
| 23–24 结论 | `progressive-checklist` | 纸面推导链；三项“不能保证”逐项划线 | 无（机制示意） |
| 25–26 三处 | `progressive-checklist`（三卡） | 三张来源缩略图按解说依次高亮 | 缩略图内不重复框 |

未采用：

- `portrait-frame`：本片为横版 1920×1080，固定竖屏画框不适用。
- `soft-focus-zoom`：没有人物到证据的注意力转移需求；用硬切 + 推近更直接。
- `caption-breath`：字幕由音频时码驱动，语义停顿已写入旁白 pause；不再额外清空字幕，避免信息断档。

## 坐标校验方法

不再按缩略图估坐标。`measure_boxes.py` 在源图像素上找文字行带，输出归一化矩形；`/tmp` 的离线叠框图用于逐框确认，确认后才写入 `film.js`。浏览器截图只用于检查版式（文字重叠、字号、对比度），不用于测量证据框。

## 2026-10-17 视觉修订

- 自制图解去掉“圆角/粗边/填充卡片”的元件感：翻译链改为三栏 + 顶部细线 + 极淡的纵向渐变 wash；新出现的第三栏用自上而下的 clip 揭示，而不是整块弹入。
- 引语卡与结尾三卡去掉整框：用 2–3px 顶部线、文字层级和淡 wash 表示 active；截图保留 1px 边 + 投影。
- 全片 cue 边界统一加 0.52s 的内容区交叉淡入（只混合 y=110–890，避开顶栏与字幕），不再出现整屏硬切；字幕本身 0.22s 淡入。
- 修订记录在同一张 history 截图内做轻微推近（crop 从 .50 到 .56），日期框与 sign error 框交叉淡入，不再换版式。
- 没有为了“动”而加无意义运镜；仍保留问题卡片、结论纸面等静止镜头的阅读时间。

## 复用 mg-styles-15 的哪些东西（2026-10-17）

参考仓库：`/Users/oceann/Desktop/workspace/mg-styles-15`（MIT；19-paperclip 等 15 支片子的源码与 prompt）。

**借了语法，没有借皮：**

- **大画布 + 连续相机**：所有证据面板不再静止，`pushCrop()` 在镜头内做 1.5–3.5% 的慢推/轻移；背景图做 1.5–2% 的 drift。对应 19-paperclip 的“相机层平移缩放串联信息点”，但保留我们自己的截图取景和源坐标框。
- **元素带转场**：arXiv 的标题条、摘要面板不再整块切换，改为从下方 26–30px 滑入 + 轻微推近；历史段同一张截图内推近，日期框与 sign error 框交叉淡入。对应 prompt 里的 “transitions carried by elements, not crossfades”。
- **finish**：纸面镜头加 44px 点阵（`dotGrid`），暗色镜头加径向暗角（`vignette`）；来自 19-paperclip 的点阵屏幕和 prompt 的 “texture and finishing (grain, glow, vignette) only where the style wants it”。
- **结构 HUD**：顶部加 `01 / 04` 章节号，和右侧 `发布 / 机制 / 证据 / 结论` 标签并置；对应 19-paperclip 底部的章节 rail。
- **节奏**：42% 从 0 滚到 42（0.85s），数字与进度条同步；来自“数字滚动计数”的技法，但只用在数据句，不滥用。

**没借的：**

- 贴纸白描边、贴纸人、巨型手机世界：题材是证据型新闻，贴纸化会削弱可信度。
- 10 秒一镜到底的节奏：本片是 107 秒、27 句的论证结构。
- `render.mjs` 管线：本片仍是 `video_media` 的 canvas 管线；如要导出 MP4，可给 `film.js` 补 `window.__ready` 别名和 `window.DEMO`，再用该仓库的 harness，属于下一步。
- 字体：仓库字体未随包分发，本片仍用 PingFang / Songti / SF Mono。
