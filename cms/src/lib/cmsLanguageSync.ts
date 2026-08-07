import { loadPageJson, savePageJson } from './cmsStorage';
import { CmsLanguage } from '../context/CmsLanguageContext';

/**
 * Load page mock JSON combined with localized translation dictionary for active language
 */
export async function loadPageWithLanguage(pageFilename: string, language: CmsLanguage): Promise<{ pageData: any; localeDict: any }> {
  try {
    const pageData = await loadPageJson(pageFilename);
    let localeDict = {};
    try {
      localeDict = await loadPageJson(`locales/${language}.json`);
    } catch {
      // If language file doesn't exist yet, default to empty
    }
    return { pageData, localeDict };
  } catch (err) {
    console.error(`Failed to load ${pageFilename} for language ${language}:`, err);
    throw err;
  }
}

/**
 * Save page mock JSON AND sync localized translations to locales/{language}.json
 */
export async function savePageWithLanguage(
  pageFilename: string,
  language: CmsLanguage,
  pageData: any,
  localeKeyPath?: string,
  localeDataToUpdate?: any
): Promise<{ success: boolean; message: string }> {
  // 1. Save page mock file
  const pageResult = await savePageJson(pageFilename, pageData);

  // 2. Also update locales/{language}.json if localeDataToUpdate is provided
  if (localeKeyPath && localeDataToUpdate) {
    try {
      let localeDict = await loadPageJson(`locales/${language}.json`).catch(() => ({}));
      
      const updateNested = (obj: any, keys: string[], val: any): any => {
        const [head, ...tail] = keys;
        if (!head) return val;
        if (tail.length === 0) {
          return { ...obj, [head]: val };
        }
        return {
          ...obj,
          [head]: updateNested(obj[head] || {}, tail, val),
        };
      };

      const keys = localeKeyPath.split('.');
      localeDict = updateNested(localeDict, keys, localeDataToUpdate);
      await savePageJson(`locales/${language}.json`, localeDict);
    } catch (err) {
      console.warn(`Could not sync locales/${language}.json:`, err);
    }
  }

  const langUpper = language.toUpperCase();
  return {
    success: true,
    message: `Saved ${pageFilename} (${langUpper}) & updated locales/${language}.json!`,
  };
}
