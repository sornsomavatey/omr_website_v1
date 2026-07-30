from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
FRONTEND = ROOT / "Frontend"
ASSETS = FRONTEND / "src" / "assets"
TEXT_EXTENSIONS = {".ts", ".tsx", ".js", ".jsx", ".css", ".json", ".html"}
SOURCE_EXTENSIONS = {".png", ".jpg", ".jpeg"}


def convert_image(source: Path, destination: Path) -> bool:
    with Image.open(source) as image:
        image.load()
        has_alpha = image.mode in {"RGBA", "LA"} or (
            image.mode == "P" and "transparency" in image.info
        )

        if has_alpha:
            converted = image.convert("RGBA")
            converted.save(destination, "WEBP", lossless=True, method=6)
        else:
            converted = image.convert("RGB")
            converted.save(
                destination,
                "WEBP",
                quality=84,
                method=6,
                optimize=True,
            )

    if destination.stat().st_size >= source.stat().st_size:
        destination.unlink()
        return False

    return True


def update_references(replacements: dict[str, str]) -> int:
    changed_files = 0
    source_root = FRONTEND / "src"

    for path in source_root.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in TEXT_EXTENSIONS:
            continue

        original = path.read_text(encoding="utf-8")
        updated = original
        for old_path, new_path in replacements.items():
            updated = updated.replace(old_path, new_path)

        if updated != original:
            path.write_text(updated, encoding="utf-8", newline="")
            changed_files += 1

    return changed_files


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--delete-originals",
        action="store_true",
        help="Delete converted PNG/JPEG sources after references are updated.",
    )
    args = parser.parse_args()

    sources = sorted(
        path
        for path in ASSETS.rglob("*")
        if path.is_file() and path.suffix.lower() in SOURCE_EXTENSIONS
    )
    replacements: dict[str, str] = {}
    converted_sources: list[Path] = []
    before_bytes = 0
    after_bytes = 0

    for source in sources:
        destination = source.with_suffix(".webp")
        source_size = source.stat().st_size

        if destination.exists() or convert_image(source, destination):
            relative_source = source.relative_to(FRONTEND / "src").as_posix()
            relative_destination = destination.relative_to(FRONTEND / "src").as_posix()
            replacements[relative_source] = relative_destination
            converted_sources.append(source)
            before_bytes += source_size
            after_bytes += destination.stat().st_size

    changed_files = update_references(replacements)

    if args.delete_originals:
        for source in converted_sources:
            source.unlink()

    saved_mb = (before_bytes - after_bytes) / (1024 * 1024)
    print(
        f"Converted {len(converted_sources)} images; updated {changed_files} files; "
        f"saved {saved_mb:.2f} MB"
    )
    if args.delete_originals:
        print(f"Removed {len(converted_sources)} original PNG/JPEG files")


if __name__ == "__main__":
    main()
