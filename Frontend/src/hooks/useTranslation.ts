import { useCallback, useEffect, useState } from 'react';

import { useAppStore } from '@/app/store';
import { loadDictionary, translate } from '@/lib/i18n';

type Dictionary = Record<string, unknown>;
type TranslationParams = Record<string, string | number>;

function getNestedValue(source: unknown, key: string): unknown {
  return key.split('.').reduce<unknown>((current, part) => {
    if (!current || typeof current !== 'object') {
      return undefined;
    }

    return (current as Record<string, unknown>)[part];
  }, source);
}

export function useTranslation() {
  const language = useAppStore((state) => state.language);
  const [dictionary, setDictionary] = useState<Dictionary>({});

  useEffect(() => {
    let mounted = true;

    loadDictionary(language)
      .then((loadedDictionary) => {
        if (mounted) {
          setDictionary(loadedDictionary);
        }
      })
      .catch((error) => {
        console.error(error);

        if (mounted) {
          setDictionary({});
        }
      });

    const htmlLanguages = {
      EN: 'en',
      KH: 'km',
      ZH: 'zh-CN',
      KO: 'ko',
    } as const;

    document.documentElement.lang = htmlLanguages[language];
    document.documentElement.dataset.lang = language.toLowerCase();

    return () => {
      mounted = false;
    };
  }, [language]);

  const t = useCallback(
    (key: string, params?: TranslationParams, fallback?: string) => {
      return translate(dictionary, key, params, fallback);
    },
    [dictionary]
  );

  const getObject = useCallback(
    <T,>(key: string, fallback: T): T => {
      const value = getNestedValue(dictionary, key);

      return value === undefined ? fallback : (value as T);
    },
    [dictionary]
  );

  return {
    t,
    getObject,
    language,
    isKhmer: language === 'KH',
  };
}
