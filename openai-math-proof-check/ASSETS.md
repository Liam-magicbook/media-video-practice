# 资产清单与来源

## 从 `mg-styles-15` 复制来的

| 文件 | 来源 | 用途 | 授权 |
| --- | --- | --- | --- |
| `assets/textures/paper.jpg` | `assets/textures/paper/Paper001_4K_color.jpg` | 纸面 multiply | CC0（仓库 README 注明） |
| `assets/textures/washi.png` | `assets/textures/washi/washi_solid_12.png` | 胶带纹理 | CC0 |
| `assets/textures/grain.png` | `assets/textures/grain/grain_film35_2048.png` | 胶片颗粒 | CC0 |
| `assets/textures/dust.png` | `assets/textures/dust/dust_03_3840x2160.png` | 灰尘 | CC0 |
| `assets/manicule.png` | `demos/06-collage/assets/gen/manicule.png` | 版画手指批注 | 随仓库，CC0/PD 素材 |
| `assets/kraft.jpg` | `demos/06-collage/assets/gen/page_kraft.jpg` | 牛皮纸相框 | 随仓库 |
| `assets/ink.png` | `demos/05-cel-boil/assets/dust_ink_01.png` | 墨点/纸纤维 | 随仓库 |
| `assets/sfx/*.wav` | `demos/06-collage/assets/sfx/` | 翻页、揉纸、剪刀等，先存着 | 随仓库 |

纸纹、washi、grain、dust 已经接进 `film-v2.html`：纸面 14% multiply、grain 12%、dust 7%、ink 12%；所有胶带改成 washi。

## 本片生成的

| 文件 | 生成方式 | 用途 |
| --- | --- | --- |
| `assets/paint-stroke.png` | `python` 像素画笔（起伏中心线 + 干刷缺口 + 浓淡） | 淡黄颜料划线 |
| `assets/paint-mask.svg` | 早期 SVG 版，保留 | 备用 |
| `assets/readme-719-strip.png` | 从 `assets/readme.png` 裁 719 那一句 | 证据纸条 |
| `assets/stickers/x-card.png` | `tools/make_stickers.py card` | 白边圆角贴纸成品 |
| `assets/stickers/readme-card.png` | 同上 | README 纸条成品 |

## 贴纸工具

`tools/make_stickers.py` 是从仓库 `demos/19-paperclip/tools/stickers.py` 简化的版本。

```zsh
# 截图/照片 -> 白边圆角纸卡
.venv-assets/bin/python tools/make_stickers.py card \
  assets/x-openai.png assets/stickers/x-card.png --border 10 --radius 6

# 带背景的人/物 -> rembg 抠图 + 白描边
.venv-assets/bin/python tools/make_stickers.py cutout \
  assets/some-photo.jpg assets/stickers/some-photo.png \
  --model birefnet-general --outline 10
```

- `card` 只用 Pillow，不需要模型；
- `cutout` 用 rembg + onnxruntime，模型首次运行会下载；
- 已用 `u2netp` 做过一次实测（`/tmp/cutout-test.png`），`birefnet-general` 质量更好但更大。
- `.venv-assets/` 是本地资产环境，462MB，不必随成片交付；换机器时重建即可：

```zsh
python3.12 -m venv .venv-assets
.venv-assets/bin/pip install "rembg[cpu]" pillow numpy scipy
```

## 没有复制的

- **19-paperclip 的 7 张贴纸**（手机、电池、PCB…）：资产在仓库里，但题材是手机拆解，和 OpenAI 数学稿无关；只学了白描边/投影的做法。
- **HDRI / 3D 序列帧**：本片是 2D 纸面，不需要。
- **`lib/audio` 56MB**：声音库，脚本在仓库；本次没有接声音。
- **字体**：单独在 `FONTS.md` 里列。
