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
    <div className={`flex items-center gap-1 p-1 bg-[#f8faf6] border border-[#e2e8df] rounded-xl ${className}`}>
      {variant === 'full' && (
        <span className="hidden lg:flex items-center gap-1.5 px-2 text-[11px] font-bold text-[#5b8045] uppercase tracking-wider font-mono">
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
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#5b8045] text-white shadow-xs font-bold scale-[1.02]'
                  : 'text-[#606e5c] hover:text-[#212d1b] hover:bg-[#eef3eb]'
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
