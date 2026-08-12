import type { Language } from '@/app/store';

type Dictionary = Record<string, unknown>;
type TranslationParams = Record<string, string | number>;

const cache: Partial<Record<Language, Dictionary>> = {};
const pendingLoads: Partial<Record<Language, Promise<Dictionary>>> = {};

const languageFiles: Record<Language, string> = {
  KH: '/locales/kh.json',
  EN: '/locales/en.json',
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

export function clearDictionaryCache(language?: Language) {
  if (language) {
    delete cache[language];
    delete pendingLoads[language];
  } else {
    (Object.keys(cache) as Language[]).forEach((k) => delete cache[k]);
    (Object.keys(pendingLoads) as Language[]).forEach((k) => delete pendingLoads[k]);
  }
}

function getLocalStorageLocaleData(language: Language): Dictionary | null {
  if (typeof window === 'undefined') return null;
  const langLower = language.toLowerCase();
  const keysToTry = [
    `omr_cms_data_locales/${langLower}.json`,
    `omr_cms_data_${langLower}.json`,
    `omr_cms_data_locales/${language}.json`,
  ];
  for (const key of keysToTry) {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // Ignore JSON parse errors
    }
  }
  return null;
}

export async function loadDictionary(language: Language): Promise<Dictionary> {
  const localOverride = getLocalStorageLocaleData(language);

  if (cache[language]) {
    if (localOverride) {
      return mergeDictionaries(cache[language]!, localOverride);
    }
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
      const dictionary = localOverride ? mergeDictionaries(localizedDictionary, localOverride) : localizedDictionary;
      cache[language] = dictionary;

      return dictionary;
    })
    .finally(() => {
      delete pendingLoads[language];
    });

  pendingLoads[language] = load;

  return load;
}

if (typeof window !== 'undefined') {
  const handleCmsUpdate = (e: any) => {
    const fn = e?.detail?.filename || e?.filename || '';
    if (fn.includes('locales/') || fn.includes('.json')) {
      clearDictionaryCache();
      window.dispatchEvent(new CustomEvent('i18n_dictionary_updated', { detail: { filename: fn } }));
    }
  };
  window.addEventListener('cms_data_updated', handleCmsUpdate);
  window.addEventListener('storage', (e: StorageEvent) => {
    if (e.key && e.key.includes('omr_cms_data_')) {
      clearDictionaryCache();
      window.dispatchEvent(new CustomEvent('i18n_dictionary_updated'));
    }
  });
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
