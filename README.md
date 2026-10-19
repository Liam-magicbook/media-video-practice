# video_media

三支 1920×1080 的中文科技解释短片，以及它们的素材、旁白和制作工具链。

成片本身就是 HTML：打开页面即自动连续播放，不需要导出 MP4，也不依赖剪辑软件。

## 成片

| 成片 | 主题 | 时长 | 入口 |
| --- | --- | --- | --- |
| AI 替你办事，权限由谁决定？ | Sierra / Poppy 代理协议：连接、登录、动作边界、由谁证明 | ~120s | `film.html` |
| OpenAI 数学稿件与 Lean 检查边界 | 稿件、翻译、形式化验证之间能证明到哪一步 | ~107s | `openai-math-proof-check/film-v2.html`（旧版 `film.html`） |
| 同一题材纸面重剪 | 纸面 / 贴纸 / 连续相机的另一版视觉系统 | ~119s | `pap-agent-film/film.html` |

三支片子共用一套制作方法，但各自独立：素材、文案、时码、字体都在自己的目录里。

## 为什么用 HTML 做成片

- 画面由 `requestAnimationFrame` 驱动，`draw(t)` 是时间的纯函数，任意时刻都能定位和截图，方便逐帧审查。
- 真实素材直接参与构图：源视频原片、官方页面截图、社媒原帖截图，而不是先导出成图片序列再拼。
- 镜头运动、局部放大、蒙版、标注都在归一化源坐标里完成，换分辨率不用重算。
- 改一句文案或一个镜头，只要改 JS 再刷新，不必重新渲染整片。

## 制作流程

### 1. 研究，先定故事

从官方公告、协议原文、原始视频、当事人社媒出发，确认哪些是「官方说发生过」、哪些是「实际看到了过程」、哪些是「已验证的生产效果」。结论写进该项目的 `SOURCES.md`：来源链接、素材时间码、事实边界。素材撑不住的说法不进解说。

### 2. 取真实素材

用 Chrome DevTools Protocol 取页面和原片，不靠缩略图或自制界面：

- `tools/cdp.py`：无头 Chrome 封装，负责导航、执行 JS、按 DOM 坐标截图。
- `tools/capture_sources.py`：按原文小标题定位 DOM 元素，截取真实渲染的段落。
- `tools/capture_guest.py`、`tools/inspect_*.py`：抓特定区块、读取页面结构。
- `tools/explore_demo.py`、`tools/follow_demo.py`：跟随公开演示页面，记录每一步界面状态。
- 源视频从公开原帖的媒体元数据取得，区间与用途记录在 `SOURCES.md` 的时间码表里。

截图落在 `assets/`，原始页面文本落在 `research/`，两边都留，方便回查。

### 3. 写解说

`edit-script.json` 一句一条：

```json
{ "id": 0, "text": "这是一次公开演示：让 AI 帮人申请房贷预批。", "rate": 220, "pause": 0.35 }
```

`rate` 是 macOS `say` 的语速，`pause` 是这句之后的停顿权重。写的时候就想清楚：这句新增了什么事实、观众先看哪里、画面要给什么证据。

### 4. 生成旁白和时码

```zsh
cd video_media
python3 tools/narrate.py --project . --duration 120
```

- 用 macOS Tingting 逐句合成，按 `pause` 权重把停顿铺满目标时长，输出 `assets/narration.wav`。
- 同时写出 `timeline.js`：每句的 `start` / `voiceEnd` / `end`，画面和字幕都以它为准。
- `openai-math-proof-check/make_voice.py` 是同一思路的早期版本（固定停顿、24kHz）。
- 合成前会把 Meta / Sierra / Poppy 等替换成中文读法（`spoken` 字段可覆盖）。

先有真实时长，再分配镜头。不要先排画面再硬塞旁白。

### 5. 编排画面

- `craft.js`：共享的画布工具。源坐标取景 `image(media, box, {crop, focus, marks})`、蒙版、直角框、连线、页脚字幕、字体角色。源位置归一化，镜头缩放和平移共用一套映射。
- `film.js`：本片的具体编排。按 cue 切段，每段决定素材、取景、标注和文字；`draw(t)` 只读时间，不保存播放状态。
- `film.html`：1920×1080 画布、隐藏的 `<video>`、旁白 `<audio>`、进度条和控制按钮。

处理源视频的两个要点：

- 切换片段时才 seek，播放中只在漂移超过约 0.3s 时校正，避免逐帧改 `currentTime` 造成解码抖动。
- 用两个 `<video>` 交替预载下一段，切镜时不等缓冲。

字体按角色分工（标题 / 引语 / 数字 / 字幕），本地打包在 `assets/fonts/`，由 `tools/prepare_fonts.py` 从 Google Fonts 拉取并按片中字符子集化。

### 6. 审查，再改

```zsh
cd video_media
python3 -m http.server 8931
# 成片：http://localhost:8931/film.html
# 拖时间轴核对：http://localhost:8931/scrub.html
```

- `tools/review_recut.py` / `review_edit.py` / `review_typography.py`：在 1920×1080 下逐 cue 截图，拼成联系表检查文字重叠、字号、对比度和取景。
- `tools/watch_playback.py` / `watch_recut.py`：真实连续播放一遍，记录帧间隔、视频 seek 和音画同步。
- `tools/final_look.py`：交付前按时间点截关键帧。
- `?review` 停在片头等审查；`?shot&t=30` 输出无控件的 1080p 截图；`?still` 用静态帧替代视频，只用于版式核对。

审查只看实际播放：不暂停能不能跟上主线、关键动作有没有真的展示、标注有没有落在讲的对象上、缩放窗口后字幕是否还清楚。

## 目录

```
video_media/
├── film.html / film.js / craft.js / timeline.js / edit-script.json
├── assets/                   # 成片素材：原片、截图、字体、旁白
├── tools/                    # CDP 取材、旁白合成、逐帧审查脚本
├── research/                 # 页面原文、来源元数据、旧版与截图记录
├── openai-math-proof-check/  # 第二支片：1080p / 107s / 纸面贴纸视觉
└── pap-agent-film/           # 第三支片：同题材另一版重剪
```

每个子项目都有自己的 `README.md`、`SOURCES.md`、`timeline.js`、`edit-script.json`，可以单独运行和修改。

## 运行

```zsh
# 主片
cd video_media && python3 -m http.server 8931
# 数学核查片
cd video_media/openai-math-proof-check && python3 -m http.server 8932
# 纸面重剪
cd video_media/pap-agent-film && python3 -m http.server 8933
```

不要用 `file://` 直接打开：本地视频的 seek 和音频加载在部分浏览器会被文件协议限制。

操作：空格暂停/播放，←/→ 前后 5 秒，拖动底部进度条跳转。浏览器拦截有声自动播放时，画面和字幕继续走，点右上角「开启旁白」。

## 依赖

- macOS（旁白用 `say -v Tingting`；其他系统需换 TTS）
- Python 3、ffmpeg（或 `afconvert`）
- Google Chrome（取材与审查走 CDP）
- `websocket-client`、`Pillow`、`fonttools`（仅工具脚本需要）

## 来源与权利

每支片的具体来源、时间码和事实边界见各自的 `SOURCES.md`。公开视频和引用链接不等于转载授权，原素材权利需在公开传播前按用途处理。字体为 OFL 许可，许可见 `assets/fonts/*-OFL.txt`。
