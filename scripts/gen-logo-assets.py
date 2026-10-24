# -*- coding: utf-8 -*-
"""生成 AIOSport 品牌 Logo 资源集（SVG 源 + PNG/JPG/WEBP/ICO 位图）。

用法：
    <bundled-python> scripts/gen-logo-assets.py

输出目录：src/assets/image/logo/
来源图形：_design/previews/onboarding-login/index.html 的顶部双峰 chevron。
"""
from __future__ import annotations

import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "src" / "assets" / "image" / "logo"
SHEET = ROOT.parent / "_design" / "previews" / "logo" / "logo-sheet.png"

GREEN = "#C9F03A"
INK = "#0F1A0B"
DARK_BG = "#0B0F0C"
LIGHT_BG = "#F4F7EE"

CHROME_CANDIDATES = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
]

# 原图几何：viewBox 0 0 48 48，双峰 chevron
# P1: M12 33 L24 12 L36 33  (stroke 3.6)
# P2: M18 33 L24 23 L30 33  (stroke 3)
# 含描边包围盒：x 10.2→37.8, y 10.2→34.8；中心 (24, 22.5)，半宽 13.8，半高 12.3
# 收紧为正方形并留 15% 呼吸位：边长 31.74，起点 (8.13, 6.63)
VB = (8.13, 6.63, 31.74, 31.74)
VB_STR = "8.13 6.63 31.74 31.74"
VB_SIDE = 31.74


def mark_svg(stroke: str, size: int = 512, second_opacity: str = ".35", title: str = "AIOSport logo mark",
             second_width: str = "3") -> str:
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="{VB_STR}" fill="none" role="img" aria-label="AIOSport">
  <title>{title}</title>
  <path d="M12 33 24 12 36 33" stroke="{stroke}" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M18 33 24 23 30 33" stroke="{stroke}" stroke-opacity="{second_opacity}" stroke-width="{second_width}" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
'''


def badge_svg(size: int = 1024, mark_ratio: float = 0.64, inner_opacity: str = ".35", inner_width: str = "3") -> str:
    span = mark_ratio * 1024.0
    scale = span / VB_SIDE
    off = (1024.0 - span) / 2.0
    # viewBox 原点不在 0,0，translate 必须先扣掉 scale*原点，否则图形整体右下偏移
    tx = off - VB[0] * scale
    ty = off - VB[1] * scale
    r = 232
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 1024 1024" fill="none" role="img" aria-label="AIOSport">
  <title>AIOSport app icon</title>
  <defs>
    <linearGradient id="aio-bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#151C11"/>
      <stop offset=".55" stop-color="#0B0F0C"/>
      <stop offset="1" stop-color="#050806"/>
    </linearGradient>
    <radialGradient id="aio-glow" cx="512" cy="452" r="520" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="{GREEN}" stop-opacity=".20"/>
      <stop offset=".55" stop-color="{GREEN}" stop-opacity=".06"/>
      <stop offset="1" stop-color="{GREEN}" stop-opacity="0"/>
    </radialGradient>
    <clipPath id="aio-clip"><rect width="1024" height="1024" rx="{r}"/></clipPath>
  </defs>
  <g clip-path="url(#aio-clip)">
    <rect width="1024" height="1024" fill="url(#aio-bg)"/>
    <rect width="1024" height="1024" fill="url(#aio-glow)"/>
    <g transform="translate({tx:.4f} {ty:.4f}) scale({scale:.4f})" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 33 24 12 36 33" stroke="{GREEN}" stroke-width="3.6"/>
      <path d="M18 33 24 23 30 33" stroke="{GREEN}" stroke-opacity="{inner_opacity}" stroke-width="{inner_width}"/>
    </g>
  </g>
  <rect x="1" y="1" width="1022" height="1022" rx="{r - 1}" stroke="#FFFFFF" stroke-opacity=".09" stroke-width="2"/>
</svg>
'''


def find_chrome() -> str:
    for c in CHROME_CANDIDATES:
        if Path(c).exists():
            return c
    raise SystemExit("找不到 Chrome / Edge，无法栅格化 SVG")


def rasterize(chrome: str, svg_text: str, out_png: Path, px: int) -> None:
    """用无头浏览器把 SVG 渲染成透明底 PNG。"""
    out_png.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="aio-logo-") as tmp:
        tmpd = Path(tmp)
        html = tmpd / "r.html"
        html.write_text(
            "<!doctype html><meta charset='utf-8'><style>"
            "html,body{margin:0;padding:0;background:transparent;overflow:hidden}"
            f"svg{{display:block;width:{px}px;height:{px}px}}"
            f"</style>{svg_text}",
            encoding="utf-8",
        )
        profile = tmpd / "profile"
        base = [
            chrome,
            "--headless=new",
            "--disable-gpu",
            "--no-first-run",
            "--no-default-browser-check",
            "--disable-extensions",
            "--hide-scrollbars",
            "--force-device-scale-factor=1",
            f"--window-size={px},{px}",
            "--default-background-color=00000000",
            f"--user-data-dir={profile}",
            f"--screenshot={out_png}",
            html.as_uri(),
        ]
        proc = subprocess.run(base, capture_output=True, text=True, timeout=120)
        if not out_png.exists():
            # 老版本 Chrome 没有 --headless=new
            alt = [x if x != "--headless=new" else "--headless" for x in base]
            subprocess.run(alt, capture_output=True, text=True, timeout=120)
        if not out_png.exists():
            raise SystemExit(f"渲染失败: {out_png}\n{proc.stderr[-800:]}")


def fit(img: Image.Image, px: int) -> Image.Image:
    if img.size == (px, px):
        return img
    return img.resize((px, px), Image.LANCZOS)


def sharpen_rgba(img: Image.Image, radius: float = 0.6, percent: int = 60) -> Image.Image:
    """对透明图锐化：先预乘 alpha 再锐化 RGB，alpha 单独锐化，避免边缘泛灰。

    预览/位图降采样会带出一圈半透明灰边，这里把 alpha 也收紧一格。
    """
    alpha = img.getchannel("A").filter(ImageFilter.UnsharpMask(radius=radius, percent=percent, threshold=0))
    premul = img.convert("RGBa").filter(ImageFilter.UnsharpMask(radius=radius, percent=percent, threshold=0))
    out = premul.convert("RGBA")
    out.putalpha(alpha)
    return out


def write_ico(path: Path, frames: list[tuple[int, Image.Image]]) -> None:
    """手写 ICO（PNG 帧），保留每帧的原生渲染结果，不让 Pillow 再重采样一遍。"""
    import struct

    payloads = []
    for size, im in frames:
        buf = tempfile.SpooledTemporaryFile()
        im.save(buf, "PNG", optimize=True)
        buf.seek(0)
        payloads.append((size, buf.read()))

    n = len(payloads)
    offset = 6 + 16 * n
    head = struct.pack("<HHH", 0, 1, n)
    entries = b""
    blob = b""
    for size, png in payloads:
        dim = 0 if size >= 256 else size
        entries += struct.pack("<BBBBHHII", dim, dim, 0, 0, 1, 32, len(png), offset + len(blob))
        blob += png
    path.write_bytes(head + entries + blob)


def main() -> None:
    chrome = find_chrome()
    OUT.mkdir(parents=True, exist_ok=True)
    for sub in ("png", "jpg", "webp"):
        (OUT / sub).mkdir(exist_ok=True)

    # ---------- 1. SVG 源文件 ----------
    (OUT / "logo-mark.svg").write_text(mark_svg(GREEN), encoding="utf-8")
    (OUT / "logo-mark-mono.svg").write_text(mark_svg("currentColor", title="AIOSport logo mark (monochrome)"), encoding="utf-8")
    (OUT / "logo-mark-ink.svg").write_text(mark_svg(INK, title="AIOSport logo mark (light background)"), encoding="utf-8")
    # ≤48px 用的小尺寸版：内峰提亮加粗，避免缩到 favicon 后糊成一团
    (OUT / "logo-mark-compact.svg").write_text(
        mark_svg(GREEN, title="AIOSport logo mark (small size / favicon)", second_opacity=".68", second_width="3.4"),
        encoding="utf-8",
    )
    (OUT / "logo-badge.svg").write_text(badge_svg(), encoding="utf-8")

    # ---------- 2. 按目标尺寸逐级原生渲染 ----------
    # 关键：不从 1024 母版缩小。LANCZOS 会在真边缘外拖出一圈半透明灰晕（毛边），
    # 每个尺寸都用矢量在目标像素上直接渲染，边缘只有 1px 抗锯齿。
    tmp = OUT / ".master"
    tmp.mkdir(exist_ok=True)

    def svg_for(key: str) -> str:
        return {
            "mark": lambda: mark_svg(GREEN),
            "mono": lambda: mark_svg("#D6E3C9"),
            "ink": lambda: mark_svg(INK),
            "compact": lambda: mark_svg(GREEN, second_opacity=".68", second_width="3.4"),
            "badge": badge_svg,
            "badge_sm": lambda: badge_svg(inner_opacity=".68", inner_width="3.4"),
        }[key]()

    # 小尺寸额外锐化；badge 是整片渐变底，锐化会把渐变色阶放大成噪点，不锐化
    SHARPEN = {"mark": (0.6, 55), "compact": (0.6, 85), "ink": (0.6, 55), "mono": (0.6, 55)}
    cache: dict[tuple[str, int], Image.Image] = {}

    def render(key: str, px: int) -> Image.Image:
        if (key, px) in cache:
            return cache[(key, px)]
        p = tmp / f"{key}-{px}.png"
        rasterize(chrome, svg_for(key), p, px)
        im = Image.open(p).convert("RGBA")
        if im.size != (px, px):
            im = fit(im, px)
        if px <= 128 and key in SHARPEN:
            im = sharpen_rgba(im, *SHARPEN[key])
        cache[(key, px)] = im
        print(f"render {key}@{px}")
        return im

    def save_png(img: Image.Image, name: str) -> None:
        img.save(OUT / "png" / name, "PNG", optimize=True)

    def save_jpg(img: Image.Image, name: str, bg: str = DARK_BG) -> None:
        flat = Image.new("RGBA", img.size, bg + "FF")
        flat.alpha_composite(img)
        flat.convert("RGB").save(
            OUT / "jpg" / name, "JPEG", quality=94, subsampling=0, optimize=True, progressive=True
        )

    def save_webp(img: Image.Image, name: str, lossless: bool = False) -> None:
        if lossless:
            img.save(OUT / "webp" / name, "WEBP", lossless=True, quality=100, method=6)
        else:
            img.save(OUT / "webp" / name, "WEBP", quality=92, method=6)

    # ---------- 3. PNG（每档都是原生渲染）----------
    for s in (1024, 512, 256, 128):
        save_png(render("mark", s), f"logo-mark-{s}.png")
    for s in (64, 32):
        save_png(render("compact", s), f"logo-mark-{s}.png")
    for s in (1024, 512, 256):
        save_png(render("badge", s), f"logo-badge-{s}.png")
    for s in (64, 32):
        save_png(render("badge_sm", s), f"logo-badge-{s}.png")
    save_png(render("ink", 512), "logo-mark-ink-512.png")
    render("badge_sm", 32).save(OUT / "favicon-32.png", "PNG", optimize=True)
    render("badge", 180).save(OUT / "apple-touch-icon-180.png", "PNG", optimize=True)

    # ---------- 4. JPG（透明区压暗底） ----------
    for s in (1024, 512):
        save_jpg(render("mark", s), f"logo-mark-{s}.jpg")
    save_jpg(render("badge", 1024), "logo-badge-1024.jpg")

    # ---------- 5. WEBP ----------
    for s in (1024, 512, 256):
        save_webp(render("mark", s), f"logo-mark-{s}.webp")
    save_webp(render("badge", 1024), "logo-badge-1024.webp")

    # ---------- 6. ICO（16/32/48/64 四帧，各自原生渲染）----------
    write_ico(OUT / "favicon.ico", [(s, render("badge_sm", s)) for s in (16, 32, 48, 64)])

    # ---------- 7. 预览联系表 ----------
    build_sheet(render("mark", 1024), render("mono", 1024), render("ink", 1024), render("badge", 1024))

    shutil.rmtree(tmp, ignore_errors=True)
    print("done ->", OUT)


def font(px: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    for name in ("msyhbd.ttc" if bold else "msyh.ttc", "segoeui.ttf"):
        p = Path(r"C:\Windows\Fonts") / name
        if p.exists():
            try:
                return ImageFont.truetype(str(p), px)
            except OSError:
                continue
    return ImageFont.load_default()


def build_sheet(mark: Image.Image, mono: Image.Image, ink: Image.Image, badge: Image.Image) -> None:
    W, H = 1320, 620
    sheet = Image.new("RGBA", (W, H), DARK_BG + "FF")
    d = ImageDraw.Draw(sheet)
    d.text((48, 38), "AIOSPORT  ·  Logo 资源", font=font(34, True), fill="#E9F5D8")
    d.text((48, 86), "源文件：src/assets/image/logo/   │   品牌色 #C9F03A", font=font(18), fill="#7E8C74")

    tiles = [
        (mark, "logo-mark", "#12160F", "品牌绿 · 透明底", "#DCEBD0", "#8A9A80"),
        (mono, "logo-mark-mono", "#12160F", "单色 · currentColor", "#DCEBD0", "#8A9A80"),
        (ink, "logo-mark-ink", LIGHT_BG, "深墨 · 浅色底用", "#26301F", "#6E7A66"),
        (badge, "logo-badge", "#12160F", "应用图标 · 圆角底", "#DCEBD0", "#8A9A80"),
    ]
    x0, y0, tw, th, gap = 48, 138, 291, 402, 24
    for i, (img, name, bg, desc, c1, c2) in enumerate(tiles):
        x = x0 + i * (tw + gap)
        tile = Image.new("RGBA", (tw, th), "rgba(0,0,0,0)")
        ImageDraw.Draw(tile).rounded_rectangle([0, 0, tw - 1, th - 1], radius=20, fill=bg + "FF")
        ic = fit(img, 200)
        tile.alpha_composite(ic, ((tw - 200) // 2, (th - 200) // 2 - 22))
        sheet.alpha_composite(tile, (x, y0))
        td = ImageDraw.Draw(sheet)
        td.text((x + 18, y0 + th - 78), name, font=font(21, True), fill=c1)
        td.text((x + 18, y0 + th - 44), desc, font=font(16), fill=c2)

    SHEET.parent.mkdir(parents=True, exist_ok=True)
    sheet.convert("RGB").save(SHEET, "PNG")
    print("sheet ->", SHEET)


if __name__ == "__main__":
    sys.exit(main())
