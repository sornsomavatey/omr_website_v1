from collections import deque
from math import exp, sin
from pathlib import Path

from PIL import Image, ImageChops, ImageFilter, ImageOps


ROOT = Path(__file__).resolve().parents[1] / "Frontend" / "src" / "assets"
WIDTH, HEIGHT, OVERLAP = 1920, 720, 180
PANEL = (WIDTH + OVERLAP) // 2

bk_source = Image.open(ROOT / "Bk.webp").convert("RGB")
tk_source = Image.open(ROOT / "compressed_OMR TK.webp").convert("RGB")

bk = ImageOps.fit(
    bk_source,
    (PANEL, HEIGHT),
    method=Image.Resampling.LANCZOS,
    centering=(0.5, 0.5),
)
tk = ImageOps.fit(
    tk_source,
    (PANEL, HEIGHT),
    method=Image.Resampling.LANCZOS,
    centering=(0.5, 0.5),
)

right_x = PANEL - OVERLAP
left_layer = Image.new("RGB", (WIDTH, HEIGHT))
left_layer.paste(bk, (0, 0))
right_layer = Image.new("RGB", (WIDTH, HEIGHT))
right_layer.paste(tk, (right_x, 0))

# Follow the outer edge of the center tree with a narrow feather. This avoids
# double-exposing unrelated architecture while still concealing a straight join.
join_mask = Image.new("L", (WIDTH, HEIGHT), 0)
join_pixels = join_mask.load()
for y in range(HEIGHT):
    tree_bulge = 30 * exp(-((y - 300) / 190) ** 2)
    trunk_bulge = 10 * exp(-((y - 560) / 125) ** 2)
    foliage_texture = 5 * sin(y * 0.11) + 3 * sin(y * 0.037)
    seam_x = int(WIDTH / 2 + tree_bulge + trunk_bulge + foliage_texture)
    foliage_feather = 30 * exp(-((y - 270) / 210) ** 2)
    feather = max(8, int(8 + foliage_feather))
    for x in range(max(0, seam_x - feather), min(WIDTH, seam_x + feather + 1)):
        join_pixels[x, y] = int(255 * (seam_x + feather - x) / (2 * feather))
    for x in range(0, max(0, seam_x - feather)):
        join_pixels[x, y] = 255

base = Image.composite(left_layer, right_layer, join_mask)

# Stretch a clean section of the original Boeung Kak sky across the full hero,
# so both buildings sit beneath one continuous photographic sky.
shared_sky = bk_source.crop((0, 0, int(bk_source.width * 0.23), int(bk_source.height * 0.34)))
shared_sky = shared_sky.resize((WIDTH, HEIGHT), Image.Resampling.LANCZOS)

pixels = base.load()
candidate = bytearray(WIDTH * HEIGHT)
max_y = int(HEIGHT * 0.44)
for y in range(max_y):
    for x in range(WIDTH):
        r, g, b = pixels[x, y]
        high = max(r, g, b)
        low = min(r, g, b)
        blue_sky = b > r + 8 and b > g + 3 and high > 105
        bright_cloud = y < int(HEIGHT * 0.41) and high > 172 and high - low < 88
        if blue_sky or bright_cloud:
            candidate[y * WIDTH + x] = 1

# Keep only sky-colored pixels connected to the top edge, protecting roofs,
# walls, trees, and signage from the replacement.
mask_data = bytearray(WIDTH * HEIGHT)
queue: deque[tuple[int, int]] = deque()
for x in range(WIDTH):
    if candidate[x]:
        mask_data[x] = 255
        queue.append((x, 0))

while queue:
    x, y = queue.popleft()
    for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
        if 0 <= nx < WIDTH and 0 <= ny < max_y:
            idx = ny * WIDTH + nx
            if candidate[idx] and not mask_data[idx]:
                mask_data[idx] = 255
                queue.append((nx, ny))

mask = Image.frombytes("L", (WIDTH, HEIGHT), bytes(mask_data))
vertical_fade = Image.new("L", (WIDTH, HEIGHT), 0)
fade_pixels = vertical_fade.load()
fade_start = max_y - 90
for y in range(max_y):
    opacity = 255 if y <= fade_start else int(255 * (max_y - y) / (max_y - fade_start))
    for x in range(WIDTH):
        fade_pixels[x, y] = opacity
mask = ImageChops.multiply(mask, vertical_fade)
mask = mask.filter(ImageFilter.GaussianBlur(2.2))
result = Image.composite(shared_sky, base, mask)

# Enrich the center foliage so it stays visibly green beneath the hero overlay.
result_pixels = result.load()
for y in range(30, 380):
    for x in range(700, 1080):
        r, g, b = result_pixels[x, y]
        if g > r + 10 and g > b + 12 and g > 45:
            result_pixels[x, y] = (
                max(0, min(255, int(r * 0.98))),
                max(0, min(255, int(g * 1.08))),
                max(0, min(255, int(b * 0.95))),
            )

# Keep the transparent edge of the foliage green instead of letting the bright
# background turn the fade into a pale/white halo.
left_pixels = left_layer.load()
for y in range(35, 510):
    tree_bulge = 30 * exp(-((y - 300) / 190) ** 2)
    trunk_bulge = 10 * exp(-((y - 560) / 125) ** 2)
    foliage_texture = 5 * sin(y * 0.11) + 3 * sin(y * 0.037)
    seam_x = int(WIDTH / 2 + tree_bulge + trunk_bulge + foliage_texture)
    foliage_feather = 30 * exp(-((y - 270) / 210) ** 2)
    feather = max(8, int(8 + foliage_feather))
    for x in range(max(0, seam_x - feather), min(WIDTH, seam_x + feather + 1)):
        lr, lg, lb = left_pixels[x, y]
        if lg > lr + 7 and lg > lb + 9:
            r, g, b = result_pixels[x, y]
            weight = 0.62
            result_pixels[x, y] = (
                int(r * (1 - weight) + lr * weight),
                int(g * (1 - weight) + lg * weight),
                int(b * (1 - weight) + lb * weight),
            )

result.save(
    ROOT / "about" / "both-outlets-side-by-side.webp",
    "WEBP",
    quality=92,
    method=6,
)
