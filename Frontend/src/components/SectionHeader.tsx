import React from 'react';

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  dark?: boolean;
};

export default function SectionHeader({
  eyebrow,
  title,
  description,
  dark = false,
}: SectionHeaderProps) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-4 mb-4 text-[#6b9158] font-sans text-xs font-bold uppercase tracking-widest">
        <span className="w-10 h-[1px] bg-[#6b9158]" />
        {eyebrow}
        <span className="w-10 h-[1px] bg-[#6b9158]" />
      </div>

      <h2
        className={`font-serif text-4xl md:text-5xl font-normal tracking-wide mb-6 ${
          dark ? 'text-[#f6fdf2]' : 'text-[#212d1b]'
        }`}
      >
        {title}
      </h2>

      {description && (
        <p
          className={`text-base md:text-lg font-sans font-light max-w-2xl mx-auto mb-16 leading-relaxed ${
            dark ? 'text-[#e7f6df]/80' : 'text-[#646860]'
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
