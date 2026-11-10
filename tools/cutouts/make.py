"""Cut the people out of the photos.

Runs on GitHub Actions (see .github/workflows/cutouts.yml). For every Unsplash
photo ID in photos.txt it downloads the photo, removes the background and
saves a transparent WebP to assets/img/cut/<id>.webp, trimmed to the person.
It also writes contact sheets to tools/cutouts/out/ so the results can be
checked by eye, and manifest.json with where each person sits in the photo.
Photos that already have a cut-out are skipped; delete a file to redo it.
"""
import io, json, math, pathlib, sys, time, urllib.request

from PIL import Image, ImageDraw
from rembg import new_session, remove

ROOT = pathlib.Path(__file__).resolve().parents[2]
HERE = pathlib.Path(__file__).resolve().parent
CUT = ROOT / 'assets/img/cut'
OUT = HERE / 'out'
CUT.mkdir(parents=True, exist_ok=True)
OUT.mkdir(parents=True, exist_ok=True)

MODEL = sys.argv[1] if len(sys.argv) > 1 else 'birefnet-general-lite'
MAX_H = 1500

ids = [l.strip() for l in (HERE / 'photos.txt').read_text().splitlines() if l.strip() and not l.startswith('#')]
manifest_path = HERE / 'manifest.json'
manifest = json.loads(manifest_path.read_text()) if manifest_path.exists() else {}


def fetch(pid):
    url = f'https://images.unsplash.com/photo-{pid}?fm=jpg&q=90&h=1800&fit=max'
    for attempt in range(4):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'webluxe-cutouts'})
            with urllib.request.urlopen(req, timeout=60) as r:
                return Image.open(io.BytesIO(r.read())).convert('RGB')
        except Exception as e:  # network hiccup: try again
            print('  retry', pid, e)
            time.sleep(2 * (attempt + 1))
    return None


try:
    session = new_session(MODEL)
except Exception as e:
    print('falling back to isnet-general-use:', e)
    session = new_session('isnet-general-use')

thumbs = []
for n, pid in enumerate(ids):
    dest = CUT / f'{pid}.webp'
    src = fetch(pid)
    if src is None:
        print('skip (download failed)', pid)
        continue
    if dest.exists() and pid in manifest:
        cut = Image.open(dest).convert('RGBA')
    else:
        t = time.time()
        mask_img = remove(src, session=session)
        a = mask_img.split()[-1].point(lambda v: 255 if v > 16 else 0)
        box = a.getbbox()
        if not box:
            print('no person found', pid)
            continue
        W, H = src.size
        pad = 6
        crop = (max(0, box[0] - pad), max(0, box[1] - pad), min(W, box[2] + pad), min(H, box[3] + pad))
        cut = mask_img.crop(crop)
        if cut.height > MAX_H:
            cut = cut.resize((round(cut.width * MAX_H / cut.height), MAX_H), Image.LANCZOS)
        cut.save(dest, 'WEBP', quality=82, method=6)
        alpha = mask_img.split()[-1]
        coverage = sum(alpha.crop(box).point(lambda v: 1 if v > 128 else 0).getdata()) / max(1, (box[2] - box[0]) * (box[3] - box[1]))
        manifest[pid] = {
            'w': cut.width, 'h': cut.height, 'src': [W, H], 'box': list(box),
            'cutTop': box[1] <= 3, 'cutBottom': box[3] >= H - 3, 'cutLeft': box[0] <= 3, 'cutRight': box[2] >= W - 3,
            'fill': round(coverage, 3)
        }
        print(f'{n + 1}/{len(ids)} {pid} {time.time() - t:.1f}s', manifest[pid])
        manifest_path.write_text(json.dumps(manifest, indent=1))
    thumbs.append((pid, src, cut))

# contact sheets: original on the left, cut-out on a checker on the right
TH = 260
per = 12
for s in range(math.ceil(len(thumbs) / per)):
    chunk = thumbs[s * per:(s + 1) * per]
    cols = 4
    cell_w = TH * 2 + 20
    sheet = Image.new('RGB', (cols * cell_w, math.ceil(len(chunk) / cols) * (TH + 30)), 'white')
    d = ImageDraw.Draw(sheet)
    for k, (pid, src, cut) in enumerate(chunk):
        x, y = (k % cols) * cell_w, (k // cols) * (TH + 30)
        o = src.copy(); o.thumbnail((TH, TH))
        sheet.paste(o, (x, y))
        c = cut.copy(); c.thumbnail((TH, TH))
        bg = Image.new('RGB', c.size, (246, 237, 227))
        for i in range(0, c.width, 16):
            for j in range(0, c.height, 16):
                if (i // 16 + j // 16) % 2: bg.paste((232, 220, 207), (i, j, i + 16, j + 16))
        bg.paste(c, (0, 0), c)
        sheet.paste(bg, (x + TH + 6, y))
        m = manifest.get(pid, {})
        flags = ''.join(f for f, k2 in (('T', 'cutTop'), ('B', 'cutBottom'), ('L', 'cutLeft'), ('R', 'cutRight')) if m.get(k2))
        d.text((x + 2, y + TH + 4), f'{s * per + k}: {pid}  {flags}', fill='black')
    sheet.save(OUT / f'sheet-{s + 1}.jpg', quality=80)
print('done', len(thumbs))
