import type { Language } from '@/app/store';

type Dictionary = Record<string, unknown>;
type TranslationParams = Record<string, string | number>;

const cache: Partial<Record<Language, Dictionary>> = {};

const languageFiles: Record<Language, string> = {
  EN: '/locales/en.json',
  KH: '/locales/kh.json',
};

export async function loadDictionary(language: Language): Promise<Dictionary> {
  if (cache[language]) {
    return cache[language]!;
  }

  const response = await fetch(languageFiles[language]);

  if (!response.ok) {
    throw new Error(`Failed to load ${language} translation file`);
  }

  const dictionary = (await response.json()) as Dictionary;

  cache[language] = dictionary;

  return dictionary;
}

function getNestedValue(source: unknown, key: string): unknown {
  return key.split('.').reduce<unknown>((current, part) => {
    if (!current || typeof current !== 'object') {
      return undefined;
    }

    return (current as Record<string, unknown>)[part];
  }, source);
}

export function translate(
  dictionary: Dictionary,
  key: string,
  params?: TranslationParams,
  fallback = key
): string {
  const value = getNestedValue(dictionary, key);

  if (typeof value !== 'string') {
    return fallback;
  }

  if (!params) {
    return value;
  }

  return value.replace(/\{(\w+)\}/g, (_, paramName: string) => {
    const replacement = params[paramName];

    return replacement === undefined ? `{${paramName}}` : String(replacement);
  });
}
