import React, { useEffect, useState } from 'react';
import { Layers, ArrowUp } from 'lucide-react';

export interface CmsSectionItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

export interface CmsSectionNavProps {
  sections: CmsSectionItem[];
  activeSection: string;
  onSelectSection: (id: string) => void;
  viewMode?: 'tab' | 'scroll';
  onToggleViewMode?: (mode: 'tab' | 'scroll') => void;
}

export const CmsSectionNav: React.FC<CmsSectionNavProps> = ({
  sections,
  activeSection,
  onSelectSection,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const mainEl = document.querySelector('main');
      const scrollTop = mainEl ? mainEl.scrollTop : window.scrollY;
      setIsScrolled(scrollTop > 20);
    };

    handleScroll();

    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.addEventListener('scroll', handleScroll, { passive: true });
    }
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (mainEl) {
        mainEl.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSelect = (id: string) => {
    onSelectSection(id);
    if (id !== 'all') {
      const el = document.getElementById(`section-${id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const scrollToTop = () => {
    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.scrollTo({ top: 0, behavior: 'smooth' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div
        className={`sticky -top-4 sm:-top-6 md:-top-8 z-30 transition-all duration-200 flex flex-wrap items-center justify-between gap-2 mb-6 px-4 py-2.5 bg-white rounded-2xl border border-[#e2e8df] ${
          isScrolled ? 'shadow-md border-[#5b8045]/40' : 'shadow-xs'
        }`}
      >
        {/* Section Tabs Row */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar max-w-full">
          <button
            onClick={() => handleSelect('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeSection === 'all'
                ? 'bg-[#5b8045] text-white shadow-xs'
                : 'bg-[#f4f7f2] text-gray-700 hover:bg-[#eaf0e7] hover:text-[#5b8045]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Sections</span>
          </button>

          <div className="h-4 w-px bg-gray-200 mx-1 shrink-0" />

          {sections.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => handleSelect(sec.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#5b8045] text-white shadow-xs font-bold'
                    : 'bg-[#f4f4f2] text-gray-700 hover:bg-[#eaf0e7] hover:text-[#5b8045]'
                }`}
              >
                <span>{sec.label}</span>
                {sec.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {sec.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating Scroll to Top button down on the bottom-right side of the page */}
      {isScrolled && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 bg-[#5b8045] hover:bg-[#4a6b37] text-white p-3.5 rounded-full shadow-xl transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95 flex items-center justify-center border border-white/20 group"
          title="Scroll to top"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5 stroke-[2.5] group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}
    </>
  );
};
