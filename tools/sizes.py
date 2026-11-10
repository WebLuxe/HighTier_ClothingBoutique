"""Make the smaller copies of every cut-out (run after adding cut-outs):
   python tools/sizes.py
   assets/img/cut/<id>.webp      full size (about 1500 tall), kept as is
   assets/img/cut/m/<id>.webp    900 tall
   assets/img/cut/s/<id>.webp    480 tall
   assets/img/cut/b/<id>.webp    360 tall and blurred, for models far back on the runway
"""
import pathlib
from PIL import Image, ImageFilter
CUT = pathlib.Path(__file__).resolve().parents[1] / 'assets/img/cut'
for d in 'msb': (CUT / d).mkdir(exist_ok=True)
for f in sorted(CUT.glob('*.webp')):
    im = Image.open(f).convert('RGBA')
    for d, h, blur in (('m', 900, 0), ('s', 480, 0), ('b', 360, 10)):
        out = CUT / d / f.name
        if out.exists() and out.stat().st_mtime > max(f.stat().st_mtime, pathlib.Path(__file__).stat().st_mtime): continue
        h = min(h, im.height)
        w = round(im.width * h / im.height)
        r = im.resize((w, h), Image.LANCZOS)
        if blur:
            pad = blur * 3   # room for the blur to spread past the edges
            c = Image.new('RGBA', (w + 2 * pad, h + 2 * pad), (0, 0, 0, 0)); c.paste(r, (pad, pad))
            # blur colour premultiplied so edges do not go dark
            pre = c.convert('RGBa').filter(ImageFilter.GaussianBlur(blur)).convert('RGBA')
            r = pre   # keeps a margin of 3 x blur all round (the site allows for it)
        r.save(out, 'WEBP', quality=80 if d != 'b' else 70, method=4)
    print(f.name)
