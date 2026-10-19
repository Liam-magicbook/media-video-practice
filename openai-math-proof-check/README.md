# film.html / film-v2.html

OpenAI 数学稿件 / Lean 检查边界 · 1920×1080 · 约 107 秒。

- `film.html`：旧版，暗色信息卡 + 截图证据。
- `film-v2.html`：v2，纸面 / 贴纸 / 连续相机系统，107 秒全片，复用 `mg-styles-15` 的视觉语言（非代码）。

## v2 说明

`film-v2.html` 是一个 4900×4200 的纸面世界，7 个 station 按 2D 路径排列，相机按旁白 cue 做右 / 下 / 左 / 下 / 右 / 下的移动，不是一路向上；证据截图变成白描边贴纸，配橙色强调、点阵纸面、纸胶带、撕纸边、颗粒、章节 HUD。旁白与 `timeline.js` 共用，无额外音效。

## v2 字体与效果

- 字体（本地文件在 `assets/fonts/`）：Alibaba PuHuiTi（900/700/500/400，中文标题与正文）、Inter（大数字）、JetBrains Mono（数据/标签）、Chakra Petch（章节 HUD）、Cormorant Garamond + Noto Serif SC（英文/中文衬线）。
- 效果参考：19-paperclip（贴纸白边/纸胶带/点阵/相机/数字滚动）、22-hud（四角锁定括号、等宽数据）、02-line-art（stroke-dashoffset 手绘线）、06-collage（撕纸边/拼贴层）、09-bauhaus（结论网格）。
- 蒙版：arXiv 摘录条和陶哲轩/AGMAI 引语卡用 `clip-path: inset()` 从左向右揭示。
- station 定制图表：翻译链底部的“语义对应（人）/ 翻译 / 推导（机器）”三段 rail；修订段 10.06 → 10.07 → 之后的横向时间线；结论段 01/02/03 包豪斯编号块与细线网格。

## 运行

```zsh
cd video_media/openai-math-proof-check
python3 -m http.server 8931
# 打开 http://localhost:8931/film.html
```

不要用 `file://` 直接打开：本地视频的 seek 与音频加载在部分浏览器会被文件协议限制。

- 空格：播放/暂停；←/→：5 秒；拖动进度条可跳转。
- 浏览器拦截有声自动播放时点“开启旁白”；画面与字幕仍会继续。
- `?review&t=30` 直接停在 30 秒；`?shot&t=30` 为 1920×1080 无控件截图模式（QA 用）。`?still` 用静态帧替代视频，仅用于版式核对。

## 逐帧滑块

```zsh
python3 -m http.server 8931
# http://localhost:8931/scrub.html
# http://localhost:8931/scrub.html?t=35
```

滑块页功能：拖动任意时刻、cue 刻度点击跳转、上一句/下一句、空格播放、←/→ 单帧、Shift+←/→ 1 秒、存当前帧 PNG。

秒数显示：画面右下角显示 `CUE 09  00:35.0 / 01:47.4`；底部显示 `当前 / 总时长`，以及当前 cue 的 `34.2–37.6s`；拖动时滑块上方气泡显示秒；展开“全部 27 句”可看每句起始秒并点击跳转。截图时加 `&clean` 可隐藏画面内时间码。
视频段在滑块页里用代表帧代替，拖动时立即到位；成片 `film.html` 本身仍播放原视频。

## 文件

- `film.html`：入口与播放器。
- `film.js`：时间轴、镜头、标注、字幕；对 `seek(t)` 是纯函数。
- `craft.js`：归一化源坐标取景 / 蒙版 / 直角框 / 页脚。
- `timeline.js`：Tingting 旁白的实际时码（由 `make_voice.py` 生成）。
- `edit-script.json`：文案、语速、停顿。
- `SOURCES.md`：来源、事实边界、素材权利。
- `visual_plan.md`：逐镜 effect id 与证据框坐标。
- `measure_boxes.py`：从源图像素测量文字框，避免按缩略图估坐标。

## 重新生成旁白

```zsh
python3 make_voice.py   # 需要 macOS say + Tingting + ffmpeg
```

## 版式核对

证据框的坐标来自源图像素（`measure_boxes.py`），先离线叠框确认，再进浏览器看版式。`?shot` 截图只用于检查文字重叠、字号与对比度，不用于测量框。
