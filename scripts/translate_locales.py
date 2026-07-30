"""Build complete Chinese and Korean locales from the public English locale."""

from __future__ import annotations

import json
import ast
import re
import sys
import time
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "Frontend" / "public" / "locales" / "en.json"
ABOUT_SOURCE = ROOT / "Frontend" / "src" / "pages" / "About" / "index.tsx"
MENU_SOURCE = ROOT / "Frontend" / "src" / "mocks" / "menu.json"
TARGETS = {
    "zh-CN": ROOT / "Frontend" / "public" / "locales" / "zh.json",
    "ko": ROOT / "Frontend" / "public" / "locales" / "ko.json",
}
TERMS_COPY = {
    "eyebrow": "Important Booking Information",
    "title": "Terms and Conditions",
    "intro": "Please review the following terms before confirming your booking.",
    "sections": [
        {
            "title": "Cancellation and No Show",
            "paragraphs": [
                "Thirty percent (30%) of menu price will be charged if cancellation takes place from seven to three (7 to 3) days before booked date. One hundred percent (100%) of menu price will be charged if cancellation takes place less than 3 days before booked date. One hundred percent (100%) of menu price will be charged for “no shows”."
            ],
        },
        {
            "title": "Payment & Termination Policy",
            "paragraphs": [
                "Payment needs to be made after meal. One More Restaurant will issue receipt from POS system only after getting payment. Either party must inform the other, in writing, 7 days in advance in order to terminate contract."
            ],
        },
        {
            "title": "Confirming Your Booking",
            "paragraphs": [
                "Once we receive your signed contract and applicable deposit we will confirm you’re booking at the same time. Any breakage or loss during catering items is subjected to charge at its market price. The confirmation should be completed and signed by the client at least 15 days prior to the date of the event. You are requested to settle the Initial deposit 30% upon signing of the confirmation or at least 15 days prior to the date of the function."
            ],
        },
    ],
}
PROTECTED = re.compile(
    r"(\{[^{}]+\}|https?://\S+|[\w.+-]+@[\w.-]+\.\w+|One More Restaurant|One More)",
    re.IGNORECASE,
)
ASSET = re.compile(r"^(?:/|[A-Za-z]:\\).*\.(?:avif|gif|jpe?g|png|svg|webp)$", re.IGNORECASE)


def flatten(value: Any, path: tuple[str | int, ...] = ()) -> list[tuple[tuple[str | int, ...], str]]:
    result: list[tuple[tuple[str | int, ...], str]] = []
    if isinstance(value, str):
        result.append((path, value))
    elif isinstance(value, dict):
        for key, child in value.items():
            result.extend(flatten(child, (*path, key)))
    elif isinstance(value, list):
        for index, child in enumerate(value):
            result.extend(flatten(child, (*path, index)))
    return result


def assign(root: Any, path: tuple[str | int, ...], value: str) -> None:
    current = root
    for part in path[:-1]:
        current = current[part]
    current[path[-1]] = value


def request_translation(text: str, target: str) -> str:
    query = urllib.parse.urlencode(
        {"client": "gtx", "sl": "en", "tl": target, "dt": "t", "q": text}
    )
    request = urllib.request.Request(
        f"https://translate.googleapis.com/translate_a/single?{query}",
        headers={"User-Agent": "Mozilla/5.0 OMR locale builder"},
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        payload = json.loads(response.read().decode("utf-8"))
    return "".join(segment[0] for segment in payload[0] if segment[0])


def translate_piece(text: str, target: str) -> str:
    for attempt in range(6):
        try:
            return request_translation(text, target)
        except Exception:
            if attempt == 5:
                raise
            time.sleep(1.5 * (attempt + 1))
    raise RuntimeError("Translation failed")


def translate_one(text: str, target: str) -> str:
    if not text.strip() or ASSET.match(text):
        return text

    output: list[str] = []
    for piece in PROTECTED.split(text):
        if not piece:
            continue
        output.append(piece if PROTECTED.fullmatch(piece) else translate_piece(piece, target))
    return "".join(output)


def translate_dictionary(source: dict[str, Any], target: str) -> dict[str, Any]:
    translated = json.loads(json.dumps(source, ensure_ascii=False))
    # Values used as application identifiers must remain stable across locales.
    strings = [
        (path, text)
        for path, text in flatten(source)
        if not path or path[-1] not in {"id"}
    ]

    with ThreadPoolExecutor(max_workers=8) as executor:
        futures = {
            executor.submit(translate_one, text, target): (path, text)
            for path, text in strings
        }
        for completed, future in enumerate(as_completed(futures), start=1):
            path, original = futures[future]
            try:
                assign(translated, path, future.result())
            except Exception as error:
                dotted_path = ".".join(map(str, path))
                raise RuntimeError(f"Failed at {dotted_path}: {original}") from error
            if completed % 100 == 0:
                print(f"{target}: {completed}/{len(strings)}", flush=True)

    return translated


def get_about_copy_keys() -> list[str]:
    source = ABOUT_SOURCE.read_text(encoding="utf-8")
    block = source.split("const khmerCopy", 1)[1].split("\n};", 1)[0]
    keys: list[str] = []
    pattern = re.compile(r"^\s*((?:'(?:\\.|[^'])*')|(?:\"(?:\\.|[^\"])*\"))\s*:", re.MULTILINE)
    for match in pattern.finditer(block):
        keys.append(ast.literal_eval(match.group(1)))
    return keys


def translate_map(strings: list[str], target: str) -> dict[str, str]:
    output: dict[str, str] = {}
    with ThreadPoolExecutor(max_workers=8) as executor:
        futures = {executor.submit(translate_one, text, target): text for text in strings}
        for future in as_completed(futures):
            source = futures[future]
            output[source] = future.result()
    return output


def main() -> None:
    source = json.loads(SOURCE.read_text(encoding="utf-8"))
    menu_source = json.loads(MENU_SOURCE.read_text(encoding="utf-8"))
    source["menu"]["items"] = {
        category.lower(): [
            {
                "name": item["name"],
                "category": item.get("category", category),
                "desc": item.get("desc", ""),
                **({"badge": item["badge"]} if item.get("badge") else {}),
            }
            for item in menu_source["items"].get(category, [])
        ]
        for category in ("Breakfast", "Lunch", "Dinner", "Dessert", "Drinks")
    }
    SOURCE.write_text(
        json.dumps(source, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    about_copy = get_about_copy_keys()
    for target, output_path in TARGETS.items():
        result = translate_dictionary(source, target)
        result["aboutInline"] = translate_map(about_copy, target)
        result["termsInline"] = translate_dictionary(TERMS_COPY, target)
        output_path.write_text(
            json.dumps(result, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        print(f"Wrote {output_path}", flush=True)


if __name__ == "__main__":
    main()
