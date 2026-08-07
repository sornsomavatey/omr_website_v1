import React from 'react';
import { useCmsLanguage, SUPPORTED_LANGUAGES, CmsLanguage } from '../context/CmsLanguageContext';
import { ChevronDown } from 'lucide-react';

interface Props {
  className?: string;
  size?: 'sm' | 'md';
}

export const CmsLanguageDropdown: React.FC<Props> = ({ className = '', size = 'md' }) => {
  const { language, setLanguage } = useCmsLanguage();

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as CmsLanguage)}
        className={`rounded-xl bg-white border border-[#e2e8df] text-xs font-bold text-gray-800 shadow-2xs hover:border-[#5b8045] focus:outline-none focus:border-[#5b8045] cursor-pointer transition appearance-none ${
          size === 'sm' ? 'py-1 pl-2.5 pr-6 text-[11px]' : 'py-1.5 pl-3 pr-7 text-xs'
        }`}
        title="Select CMS Editing Language"
      >
        {SUPPORTED_LANGUAGES.map((l) => (
          <option key={l.code} value={l.code} className="font-sans py-1">
            {l.label} ({l.short})
          </option>
        ))}
      </select>
      <ChevronDown className="w-3.5 h-3.5 text-gray-500 pointer-events-none absolute right-2.5" />
    </div>
  );
};

