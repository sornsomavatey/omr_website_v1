import React from 'react';
import { CmsBackToPagesLink } from '../../components/CmsPageSwitcher';

export const MenuEditor: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 text-[#1c2819]">
      <div>
        <CmsBackToPagesLink />
      </div>

      <div className="bg-white border border-[#d6e0d0] rounded-2xl p-12 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-gray-500 font-serif tracking-wide">
          Menu Management Coming Soon
        </h1>
      </div>
    </div>
  );
};


