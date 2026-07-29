import type { Language } from '@/app/store';

type Dictionary = Record<string, unknown>;
type TranslationParams = Record<string, string | number>;

const cache: Partial<Record<Language, Dictionary>> = {};
const pendingLoads: Partial<Record<Language, Promise<Dictionary>>> = {};

const languageFiles: Record<Language, string> = {
  EN: '/locales/en.json',
  KH: '/locales/kh.json',
  ZH: '/locales/zh.json',
  KO: '/locales/ko.json',
};

function mergeDictionaries(base: Dictionary, localized: Dictionary): Dictionary {
  const merged: Dictionary = { ...base };

  Object.entries(localized).forEach(([key, value]) => {
    const baseValue = merged[key];

    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      baseValue &&
      typeof baseValue === 'object' &&
      !Array.isArray(baseValue)
    ) {
      merged[key] = mergeDictionaries(
        baseValue as Dictionary,
        value as Dictionary
      );
      return;
    }

    merged[key] = value;
  });

  return merged;
}

export async function loadDictionary(language: Language): Promise<Dictionary> {
  if (cache[language]) {
    return cache[language]!;
  }

  if (pendingLoads[language]) {
    return pendingLoads[language]!;
  }

  const cacheBuster = import.meta.env.DEV ? String(Date.now()) : __APP_BUILD_VERSION__;
  const load = fetch(`${languageFiles[language]}?v=${cacheBuster}`)
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Failed to load ${language} translation file`);
      }

      const localizedDictionary = (await response.json()) as Dictionary;
      const dictionary = language === 'EN'
        ? localizedDictionary
        : mergeDictionaries(await loadDictionary('EN'), localizedDictionary);
      cache[language] = dictionary;

      return dictionary;
    })
    .finally(() => {
      delete pendingLoads[language];
    });

  pendingLoads[language] = load;

  return load;
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
