#!/usr/bin/env python3
"""Make paper sticker cards / cutouts from source images.

card:   rectangular screenshot/photo -> white border + rounded corners (no background removal)
cutout: photo -> rembg cutout + white die-cut outline

Examples:
  .venv-assets/bin/python tools/make_stickers.py card assets/x-openai.png assets/stickers/x-card.png --border 10
  .venv-assets/bin/python tools/make_stickers.py cutout assets/speaker.jpg assets/stickers/speaker.png --model birefnet-general --outline 12
"""
import argparse, json, os
from PIL import Image, ImageDraw, ImageFilter

S = 2  # asset px per world px

def card(src, out, crop=None, border=9, radius=6, scale=2):
    im = Image.open(src).convert('RGB')
    if crop:
        im = im.crop(tuple(int(v) for v in crop))
    w, h = im.size
    sc = scale
    im = im.resize((max(1, int(w * sc)), max(1, int(h * sc))), Image.LANCZOS)
    b, r = int(border * sc), int(radius * sc)
    W, H = im.width + 2 * b, im.height + 2 * b
    mask = Image.new('L', (W * 4, H * 4), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, W * 4 - 1, H * 4 - 1), r * 4, fill=255)
    mask = mask.resize((W, H), Image.LANCZOS)
    base = Image.new('RGBA', (W, H), (255, 255, 255, 255))
    base.paste(im, (b, b))
    base.putalpha(mask)
    os.makedirs(os.path.dirname(out) or '.', exist_ok=True)
    base.save(out, optimize=True)
    return {'w': round(W / scale, 2), 'h': round(H / scale, 2)}

def cutout(src, out, model='birefnet-general', outline=10, scale=2, crop=None):
    import numpy as np
    from scipy import ndimage as ndi
    from rembg import remove, new_session
    im = Image.open(src).convert('RGB')
    if crop:
        im = im.crop(tuple(int(v) for v in crop))
    sess = new_session(model)
    rgba = remove(im, session=sess)
    a = np.array(rgba)[:, :, 3]
    m = a > 127
    lab, n = ndi.label(m)
    if n > 1:
        sizes = ndi.sum(m, lab, range(1, n + 1))
        keep = [i + 1 for i, s in enumerate(sizes) if s > 0.04 * sizes.max()]
        m = np.isin(lab, keep)
    m = ndi.binary_fill_holes(m)
    ys, xs = np.where(m)
    if len(xs) == 0:
        raise SystemExit('no foreground found')
    pad = 4
    box = (max(xs.min() - pad, 0), max(ys.min() - pad, 0), min(xs.max() + pad, im.width), min(ys.max() + pad, im.height))
    rgb = np.array(im)[box[1]:box[3], box[0]:box[2]].copy()
    soft = a[box[1]:box[3], box[0]:box[2]].astype(np.float32) / 255
    h, w = soft.shape
    sc = scale
    nw, nh = max(1, int(w * sc)), max(1, int(h * sc))
    rgb = np.array(Image.fromarray(rgb).resize((nw, nh), Image.LANCZOS))
    soft = np.array(Image.fromarray((soft * 255).astype(np.uint8)).resize((nw, nh), Image.LANCZOS)).astype(np.float32) / 255
    P = int(outline * sc) + 8
    H, W = nh + 2 * P, nw + 2 * P
    A = np.zeros((H, W), np.float32); A[P:P + nh, P:P + nw] = soft
    RGB = np.ones((H, W, 3), np.float32) * 255; RGB[P:P + nh, P:P + nw] = rgb
    dist = ndi.distance_transform_edt(~(A > 0.5))
    ol = np.clip(int(outline * sc) + 0.75 - dist, 0, 1)
    col = RGB * A[..., None] + 255 * (1 - A[..., None])
    out_img = np.dstack([col, np.maximum(ol, A) * 255]).clip(0, 255).astype(np.uint8)
    os.makedirs(os.path.dirname(out) or '.', exist_ok=True)
    Image.fromarray(out_img, 'RGBA').save(out, optimize=True)
    return {'w': round(W / scale, 2), 'h': round(H / scale, 2)}

if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest='mode', required=True)
    c = sub.add_parser('card'); c.add_argument('src'); c.add_argument('out')
    c.add_argument('--crop', nargs=4, type=int); c.add_argument('--border', type=float, default=9)
    c.add_argument('--radius', type=float, default=6); c.add_argument('--scale', type=float, default=2)
    u = sub.add_parser('cutout'); u.add_argument('src'); u.add_argument('out')
    u.add_argument('--crop', nargs=4, type=int); u.add_argument('--outline', type=float, default=10)
    u.add_argument('--model', default='birefnet-general'); u.add_argument('--scale', type=float, default=2)
    a = ap.parse_args()
    meta = card(a.src, a.out, a.crop, a.border, a.radius, a.scale) if a.mode == 'card' else cutout(a.src, a.out, a.model, a.outline, a.scale, a.crop)
    print(json.dumps({a.out: meta}, ensure_ascii=False, indent=1))
