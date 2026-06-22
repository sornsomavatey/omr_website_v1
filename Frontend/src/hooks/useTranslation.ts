import { useCallback, useEffect, useState } from 'react';

import { useAppStore } from '@/app/store';
import { loadDictionary, translate } from '@/lib/i18n';

type Dictionary = Record<string, unknown>;
type TranslationParams = Record<string, string | number>;

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

    document.documentElement.lang = language === 'KH' ? 'km' : 'en';
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

  return {
    t,
    language,
    isKhmer: language === 'KH',
  };
}