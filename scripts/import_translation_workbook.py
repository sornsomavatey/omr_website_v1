"""Import the approved website translation workbook into locale JSON files.

Terms and Conditions translations are intentionally excluded.
Blank spreadsheet cells preserve the current website value.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

import openpyxl


LANGUAGE_COLUMNS = {
    "en": 0,
    "kh": 1,
    "zh": 2,
    "ko": 3,
}
PROTECTED_PREFIXES = ("termsInline.",)
LITERAL_KEY_NAMESPACES = ("aboutInline", "termsInline")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("workbook", type=Path)
    parser.add_argument(
        "--locales-dir",
        type=Path,
        default=Path("Frontend/public/locales"),
    )
    return parser.parse_args()


def split_translation_key(key: str) -> list[str]:
    namespace, separator, remainder = key.partition(".")
    if separator and namespace in LITERAL_KEY_NAMESPACES:
        return [namespace, remainder]
    return key.split(".")


def set_nested_value(root: dict[str, Any], key: str, value: Any) -> bool:
    parts = split_translation_key(key)
    current: Any = root

    for index, part in enumerate(parts[:-1]):
        next_part = parts[index + 1]
        if isinstance(current, list):
            list_index = int(part)
            while len(current) <= list_index:
                current.append({} if not next_part.isdigit() else [])
            current = current[list_index]
            continue

        if part not in current:
            current[part] = [] if next_part.isdigit() else {}
        current = current[part]

    final_part = parts[-1]
    if isinstance(current, list):
        list_index = int(final_part)
        while len(current) <= list_index:
            current.append(None)
        changed = current[list_index] != value
        current[list_index] = value
        return changed

    changed = current.get(final_part) != value
    current[final_part] = value
    return changed


def main() -> None:
    args = parse_args()
    workbook = openpyxl.load_workbook(
        args.workbook,
        read_only=True,
        data_only=True,
    )
    worksheet = workbook["All Translations"]
    rows = list(worksheet.iter_rows(min_row=2, values_only=True))

    for language, column in LANGUAGE_COLUMNS.items():
        locale_path = args.locales_dir / f"{language}.json"
        locale = json.loads(locale_path.read_text(encoding="utf-8"))
        changed = 0
        skipped_blank = 0
        skipped_protected = 0

        for row in rows:
            value = row[column]
            key = row[4]
            if not isinstance(key, str) or not key:
                continue
            if key.startswith(PROTECTED_PREFIXES):
                skipped_protected += 1
                continue
            if value is None or value == "":
                skipped_blank += 1
                continue
            if set_nested_value(locale, key, value):
                changed += 1

        locale_path.write_text(
            json.dumps(locale, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        print(
            f"{language}: {changed} updated, "
            f"{skipped_blank} blank preserved, "
            f"{skipped_protected} protected"
        )


if __name__ == "__main__":
    main()
