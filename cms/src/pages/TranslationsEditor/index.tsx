import React, { useEffect, useState } from 'react';
import { Save, CheckCircle, Loader2, Globe } from 'lucide-react';
import { loadPageJson, savePageJson } from '../../lib/cmsStorage';
import { useCmsLanguage } from '../../context/CmsLanguageContext';
import './index.css';

export const TranslationsEditor: React.FC = () => {
  const { language: lang, currentLangInfo } = useCmsLanguage();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchDictionary = (l: string) => {
    setLoading(true);
    loadPageJson(`locales/${l}.json`)
      .then((res) => setData(res))
      .catch((err) => {
        console.error(`Failed to load locales/${l}.json:`, err);
        setData({});
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDictionary(lang);
  }, [lang]);

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    setMessage(null);

    const result = await savePageJson(`locales/${lang}.json`, data);
    setSaving(false);
    setMessage(`Successfully saved locales/${lang}.json (${currentLangInfo.flag} ${currentLangInfo.label})!`);
    setTimeout(() => setMessage(null), 4000);
  };

  const handleTextChange = (pathKey: string, val: string) => {
    const updateNested = (obj: any, keys: string[]): any => {
      const [head, ...tail] = keys;
      if (tail.length === 0) {
        return { ...obj, [head]: val };
      }
      return {
        ...obj,
        [head]: updateNested(obj[head] || {}, tail),
      };
    };

    const keys = pathKey.split('.');
    setData(updateNested(data, keys));
  };

  const renderDictionaryFields = (obj: any, prefix = ''): React.ReactNode[] => {
    if (!obj || typeof obj !== 'object') return [];

    let fields: React.ReactNode[] = [];

    Object.entries(obj).forEach(([key, val]) => {
      const fullPath = prefix ? `${prefix}.${key}` : key;

      if (typeof val === 'string') {
        fields.push(
          <div key={fullPath} className="p-4 bg-[#18271a] border border-[#2d402f] rounded-xl space-y-1.5 shadow-sm">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#c8a962] font-bold">
              <span>{fullPath}</span>
            </div>
            <textarea
              rows={val.length > 50 ? 2 : 1}
              value={val}
              onChange={(e) => handleTextChange(fullPath, e.target.value)}
              className="w-full bg-[#121c13] border border-[#2d402f] text-neutral-100 text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-[#c8a962] font-sans"
            />
          </div>
        );
      } else if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
        fields = fields.concat(renderDictionaryFields(val, fullPath));
      }
    });

    return fields;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#2d402f] pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-neutral-100 font-serif tracking-wide flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#c8a962]" />
              Multi-Language Dictionaries (i18n)
            </h1>
            <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-[#c8a962]/15 text-[#e5c158] border border-[#c8a962]/30 flex items-center gap-1 font-mono">
              <span>{currentLangInfo.flag}</span>
              <span>{currentLangInfo.short}</span>
            </span>
          </div>
          <p className="text-xs text-[#a9ca96] font-mono mt-1">Editing Frontend/public/locales/{lang}.json</p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#c8a962] hover:bg-[#b39a62] text-black px-4 py-2 rounded-xl text-xs font-bold transition shadow-lg shadow-[#c8a962]/10 disabled:opacity-50 shrink-0"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : `Save Dictionary (${currentLangInfo.short})`}
        </button>
      </div>

      {message && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2 font-medium">
          <CheckCircle className="w-4 h-4 shrink-0" />
          {message}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48 text-neutral-400 gap-2 font-mono text-xs">
          <Loader2 className="w-5 h-5 animate-spin text-[#c8a962]" />
          Loading {lang}.json translation dictionary...
        </div>
      ) : (
        <div className="space-y-3">
          {renderDictionaryFields(data)}
        </div>
      )}
    </div>
  );
};
