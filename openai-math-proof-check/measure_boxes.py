#!/usr/bin/env python3
"""Measure text-line bands in source screenshots (dark text on light page)."""
from PIL import Image
import sys, json

def bands(path, x0, x1, y0, y1, thresh=150, min_count=10, gap=3):
    im = Image.open(path).convert('L')
    px = im.load()
    rows = []
    for y in range(y0, y1):
        c = sum(1 for x in range(x0, x1) if px[x, y] < thresh)
        rows.append((y, c))
    out = []
    start = None
    last = None
    for y, c in rows:
        if c >= min_count:
            if start is None:
                start = y
            last = y
        else:
            if start is not None and y - last > gap:
                out.append((start, last))
                start = None
    if start is not None:
        out.append((start, last))
    res = []
    for a, b in out:
        xs = [x for x in range(x0, x1) for y in range(a, b + 1) if px[x, y] < thresh]
        if xs:
            res.append({'y0': a, 'y1': b, 'x0': min(xs), 'x1': max(xs),
                        'norm': [round(min(xs)/2160, 4), round(a/1350, 4),
                                 round((max(xs)-min(xs))/2160, 4), round((b-a)/1350, 4)]})
    return res

if __name__ == '__main__':
    path = sys.argv[1]
    x0, x1, y0, y1 = map(int, sys.argv[2:6])
    for r in bands(path, x0, x1, y0, y1):
        print(r)
