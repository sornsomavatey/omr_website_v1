"""Synchronize translations for every product displayed by the live website menu."""

from __future__ import annotations

import json
import time
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

from translate_locales import translate_one


ROOT = Path(__file__).resolve().parents[1]
LOCALES = ROOT / "Frontend" / "public" / "locales"
PRODUCTS_URL = "https://omd.a2hosted.com/api/website/products"
VISIBLE_CATEGORY_IDS = {10, 11, 12, 15, 17}


def fetch_products() -> list[dict]:
    request = urllib.request.Request(
        PRODUCTS_URL,
        headers={"Accept": "application/json", "User-Agent": "OMR menu locale sync"},
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.loads(response.read().decode("utf-8")).get("data", [])


def translated_names(products: list[dict], target: str) -> dict[str, str]:
    names = {str(product["id"]): product.get("name", "").strip() for product in products}
    output: dict[str, str] = {}
    with ThreadPoolExecutor(max_workers=8) as executor:
        futures = {
            executor.submit(translate_one, name, target): product_id
            for product_id, name in names.items()
            if name
        }
        for completed, future in enumerate(as_completed(futures), start=1):
            product_id = futures[future]
            for attempt in range(3):
                try:
                    output[product_id] = future.result()
                    break
                except Exception:
                    if attempt == 2:
                        raise
                    time.sleep(attempt + 1)
            if completed % 50 == 0:
                print(f"{target}: {completed}/{len(futures)}", flush=True)
    return output


def write_locale(code: str, names: dict[str, str]) -> None:
    path = LOCALES / f"{code}.json"
    locale = json.loads(path.read_text(encoding="utf-8"))
    locale["menu"]["liveItems"] = names
    path.write_text(json.dumps(locale, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {path}", flush=True)


def main() -> None:
    products = [
        product
        for product in fetch_products()
        if VISIBLE_CATEGORY_IDS.intersection(
            int(category["id"]) for category in product.get("categories", [])
        )
    ]
    # A product can belong to several menu categories; translate it only once by stable ID.
    products = list({str(product["id"]): product for product in products}.values())
    print(f"Found {len(products)} visible menu products", flush=True)

    write_locale("en", {str(p["id"]): p.get("name", "").strip() for p in products})
    write_locale(
        "kh",
        {
            str(p["id"]): (p.get("name_kh") or p.get("name") or "").strip()
            for p in products
        },
    )
    write_locale("zh", translated_names(products, "zh-CN"))
    write_locale("ko", translated_names(products, "ko"))


if __name__ == "__main__":
    main()
