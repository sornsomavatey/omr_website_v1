import React from 'react';
import { useCmsLanguage, SUPPORTED_LANGUAGES, CmsLanguage } from '../context/CmsLanguageContext';
import { Globe } from 'lucide-react';

interface Props {
  variant?: 'compact' | 'full';
  className?: string;
}

export const CmsLanguageSwitcher: React.FC<Props> = ({ variant = 'full', className = '' }) => {
  const { language, setLanguage } = useCmsLanguage();

  return (
    <div className={`flex items-center gap-1 p-1 bg-[#121c13] border border-[#2d402f] rounded-xl shadow-inner ${className}`}>
      {variant === 'full' && (
        <span className="hidden lg:flex items-center gap-1.5 px-2 text-[11px] font-semibold text-[#c8a962] uppercase tracking-wider font-mono">
          <Globe className="w-3.5 h-3.5" />
          Lang:
        </span>
      )}
      <div className="flex items-center gap-1">
        {SUPPORTED_LANGUAGES.map((l) => {
          const isActive = language === l.code;
          return (
            <button
              key={l.code}
              type="button"
              onClick={() => setLanguage(l.code as CmsLanguage)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#c8a962] text-black shadow-md shadow-[#c8a962]/20 font-bold scale-[1.03]'
                  : 'text-[#8ba38e] hover:text-white hover:bg-[#18271a]'
              }`}
              title={`Switch CMS editing language to ${l.label}`}
            >
              <span className="text-sm leading-none">{l.flag}</span>
              <span className="text-[11px] font-mono">{l.short}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
