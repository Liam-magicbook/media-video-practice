# 字体清单

## 本片正在用的（`assets/fonts/` 根目录）

| 字体 | 文件 | 用途 |
| --- | --- | --- |
| Alibaba PuHuiTi 115 Black | `AlibabaPuHuiTi-3-115-Black.woff2` | 中文最大标题 |
| Alibaba PuHuiTi 105 Heavy | `AlibabaPuHuiTi-3-105-Heavy.woff2` | 中文标题 |
| Alibaba PuHuiTi 85 Bold | `AlibabaPuHuiTi-3-85-Bold.woff2` | 中文小标题 |
| Alibaba PuHuiTi 65 Medium | `AlibabaPuHuiTi-3-65-Medium.woff2` | 中文正文 |
| Alibaba PuHuiTi 55 Regular | `AlibabaPuHuiTi-3-55-Regular.woff2` | 中文正文 |
| Inter | `Inter-VF.ttf` | 大数字 / 英文 |
| JetBrains Mono | `JetBrainsMono-VF.ttf` | 数据、标签、代码 |
| Chakra Petch | `ChakraPetch-SemiBold.ttf` | 章节 HUD |
| Cormorant Garamond | `CormorantGaramond-VF.ttf` | 英文衬线标题/引语 |
| Noto Serif SC | `NotoSerifSC-VF.ttf` | 中文衬线引语 |

## 字体库（`assets/fonts/library/`）

给之后别的风格留的，不一定在本片使用。

### Latin（19 个）

- Anton
- Archivo VF
- Bebas Neue
- Caveat VF
- DM Sans VF
- Fredoka VF
- IBM Plex Mono Medium / SemiBold
- Instrument Serif Regular / Italic
- Michroma
- Poppins Black / SemiBold
- Press Start 2P
- Rajdhani Bold / SemiBold
- Sora VF
- Unbounded VF
- VT323

### CJK（3 个）

- Noto Sans SC VF
- Long Cang
- ZCOOL KuaiLe

## 来源与授权

- **Alibaba PuHuiTi 3.0**：阿里巴巴普惠体，免费商用；文件来自公开镜像。
- **Inter / JetBrains Mono / Chakra Petch / Cormorant Garamond / Noto Serif SC / Noto Sans SC / 其余 Google Fonts**：SIL Open Font License 1.1。
- **Long Cang / ZCOOL KuaiLe**：SIL OFL。
- 仓库的 `assets/fonts/README.md` 还列了 HarmonyOS Sans SC、Alimama ShuHeiTi、Douyin Sans、Resource Han Rounded、LXGW Marker Gothic、Fusion Pixel 等；这些没有随包，本次没有全下，原因是当前纸面风格用不到，且中文字体体积大。要用时按仓库清单的路径补。

## 用法

在 CSS 顶部加 `@font-face`，`src:url('assets/fonts/library/latin/xxx.ttf')`；本片的 `@font-face` 在 `film-v2.html` 的 `<style>` 开头。
