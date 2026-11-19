# Makes the web copies of the hero's paper forest (src/assets/forest/) from the
# Runway layer split in design/originals/forest-layers/.
#
# The split gave each layer at its own size and crop, so this puts them back on
# one 16:9 canvas, the same size for all three, so the website can stack them:
#   back    the teal wall, glowing clearing and moon (its edges blended into teal)
#   middle  the trees, deer, mushrooms and bird (position found by matching it
#           against design/originals/forest-b-no-banner.png)
#   front   the frame of leaves, ferns and flowers
# The split's "distant trees" layer is left out (its treetops came out gray) and
# so is its "base" picture (a different forest).
#
# Run (needs uv, see docs/tools-and-setup.md):
#   uv run --with pillow python tools/forest-layers.py
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageStat

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'design/originals/forest-layers'
OUT = ROOT / 'src/assets/forest'
W, H = 2752, 1536  # the front layer's size; everything is placed on this canvas
WEB_W = 2560  # web copies: sharp on a 1440p screen, fine on the TV
QUALITY = 80


def place(name, scale):
    im = Image.open(SRC / name).convert('RGBA')
    return im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)


def back_layer():
    bg = place('1-background.png', 0.9)
    bx, by = 690, 176
    teal = tuple(int(v) for v in ImageStat.Stat(bg.crop((10, 10, 120, 120)).convert('RGB')).median)
    back = Image.new('RGBA', (W, H), teal + (255,))
    mask = Image.new('L', bg.size, 0)
    ImageDraw.Draw(mask).rectangle((90, 90, bg.width - 90, bg.height - 1), fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(45))
    back.paste(bg, (bx, by), mask)
    # Below the picture, carry its floor colour down to the bottom edge.
    if H > by + bg.height:
        floor = bg.crop((0, bg.height - 4, bg.width, bg.height)).resize((bg.width, H - by - bg.height))
        back.paste(floor, (bx, by + bg.height), mask.crop((0, mask.height - 1, mask.width, mask.height)).resize(floor.size))
    return back.convert('RGB'), teal


def on_canvas(layer, x, y):
    canvas = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    canvas.alpha_composite(layer, (x, y))
    return canvas


def save(im, name):
    im = im.resize((WEB_W, round(H * WEB_W / W)), Image.LANCZOS)
    path = OUT / name
    im.save(path, 'WEBP', quality=QUALITY, method=6)
    print(f'{path.relative_to(ROOT)}  {im.size[0]}x{im.size[1]}  {path.stat().st_size // 1024} KB')


OUT.mkdir(parents=True, exist_ok=True)
back, teal = back_layer()
save(back, 'forest-back.webp')
save(on_canvas(place('3-middle.png', 1.03), 296, 398), 'forest-middle.webp')
save(on_canvas(place('4-front.png', 1.0), 0, 0), 'forest-front.webp')
print('teal behind the forest: #%02x%02x%02x' % teal)
