# AI 替你办事，权限由谁决定？

`film.html`：119 秒，1920×1080，纸面 / 贴纸 / 连续相机。

## 结构

| 时间 | station | 内容 |
| --- | --- | --- |
| 0–17s | 演示 | Sierra Summit 原片、两次 Allow、问题 |
| 17–41s | Poppy | 35 家设计伙伴、Draft 0.1、网页/API/企业代理 |
| 41–54s | Scopes | read / write、企业按操作检查 |
| 54–71s | Operations | 条款版本、重试、至多一次 |
| 71–93s | 证明 | Dino 原帖、§8、企业自己的网站 |
| 93–119s | 结果 | 预批信、≠ 贷款已发放、三处核对 |

## 素材

- `assets/summit-*.jpg`：Sierra Summit 演示原片定格；
- `assets/partner-diagram.jpg`、`speaker.png`、`poppy-section.png`：Poppy 发布与 35 家伙伴；
- `assets/spec-scopes.png`、`ops-intro.png`、`ops-trust.png`：协议原文；
- `assets/x-demo.png`、`x-dino.png`：官方/安全从业者原帖；
- `assets/summit-result.jpg`：预批信画面。

来源与事实边界见 `SOURCES.md`；旁白沿用原 `narration.wav` / `timeline.js`。

## 视觉

- 字体：Alibaba PuHuiTi / Inter / JetBrains Mono / Cormorant Garamond / Noto Serif SC；
- 纸纹、washi、grain、dust、ink、manicule、kraft 来自 `mg-styles-15` 的可复用资产；
- 颜料划线为 `assets/paint-stroke.png`；
- 相机在 station 内不动，只在换站时移动。

## 运行

```zsh
cd video_media/pap-agent-film
python3 -m http.server 8932
# http://localhost:8932/film.html
```

## 已知不足

- 41–93 秒三段仍以「截图 + 文字卡」为主，没到 0–17 / 17–41 两段的构图密度；
- 没有声音设计；
- 贴纸是白边纸卡，不是逐物件抠图；
- 这是一版用新资产系统做的重剪，不是最终成片。
