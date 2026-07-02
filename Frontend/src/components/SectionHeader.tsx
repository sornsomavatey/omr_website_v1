import React from 'react';

type SectionHeaderProps = {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  dark?: boolean;
  align?: 'center' | 'left';
};

export default function SectionHeader({
  eyebrow,
  title,
  description,
  dark = false,
  align = 'center',
}: SectionHeaderProps) {
  const isLeft = align === 'left';

  return (
    <div className={isLeft ? 'text-left' : 'text-center'}>
      {/* Eyebrow */}
      <div
        className={`flex items-center gap-4 mb-4 text-[#6b9158] font-sans text-xs font-bold uppercase tracking-widest ${
          isLeft ? 'justify-start' : 'justify-center'
        }`}
      >
        {!isLeft && <span className="w-10 h-[1px] bg-[#6b9158]" />}
        {eyebrow}
        <span className="w-10 h-[1px] bg-[#6b9158]" />
      </div>

      {/* Title */}
      <h2
        className={`font-serif text-4xl md:text-5xl font-normal tracking-wide mb-3 ${
          dark ? 'text-[#f6fdf2]' : 'text-[#212d1b]'
        }`}
      >
        {title}
      </h2>

      {/* Left-align decorative underline under title */}
      {isLeft && (
        <span className="block w-12 h-[2px] bg-[#6b9158] mb-6" />
      )}

      {description && (
        <p
          className={`text-base md:text-lg font-sans font-light mb-10 leading-relaxed ${
            isLeft ? '' : 'max-w-2xl mx-auto mb-16'
          } ${
            dark ? 'text-[#e7f6df]/80' : 'text-[#646860]'
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
