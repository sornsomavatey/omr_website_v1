import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ChevronDown } from 'lucide-react';

export const CMS_PAGES_LIST = [
  { label: 'Home', path: '/home' },
  { label: 'Menu (Disabled)', path: '/menu', disabled: true },
  { label: 'Reservations', path: '/reservations-editor' },
  { label: 'Branches (All)', path: '/branches' },
  { label: '  - Boeung Kak Branch', path: '/branches?branch=boeung-kak' },
  { label: '  - Toul Kork Branch', path: '/branches?branch=toul-kork' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'About Us', path: '/about' },
  { label: 'Terms & Conditions', path: '/terms' },
];

export const CmsBackToPagesLink: React.FC = () => {
  return (
    <Link
      to="/pages"
      className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#5b8045] transition cursor-pointer group mb-1 shrink-0"
      title="Back to Website Pages list"
    >
      <ArrowLeft className="w-4 h-4 text-gray-500 group-hover:-translate-x-0.5 group-hover:text-[#5b8045] transition" />
      <span>Back to Website Pages</span>
    </Link>
  );
};

export const CmsBackButton: React.FC<{ label?: string }> = ({ label }) => {
  return (
    <Link
      to="/pages"
      className="w-8 h-8 rounded-xl bg-white border border-[#e2e8df] text-gray-700 hover:bg-gray-50 hover:text-[#5b8045] hover:border-[#5b8045]/50 shadow-2xs flex items-center justify-center transition cursor-pointer shrink-0"
      title="Back to Website Pages list"
    >
      <ArrowLeft className="w-4 h-4 text-gray-700 font-sans" />
      {label && <span className="text-xs font-bold ml-1.5">{label}</span>}
    </Link>
  );
};

interface Props {
  className?: string;
  size?: 'sm' | 'md';
}

export const CmsPageSelectDropdown: React.FC<Props> = ({ className = '', size = 'md' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname + location.search;

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <select
        value={currentPath}
        onChange={(e) => navigate(e.target.value)}
        className={`w-32 h-9 rounded-xl bg-white border border-[#e2e8df] text-xs font-bold text-gray-800 shadow-2xs hover:border-[#5b8045] focus:outline-none focus:border-[#5b8045] cursor-pointer transition appearance-none ${
          size === 'sm' ? 'py-1 pl-2.5 pr-6 text-[11px]' : 'py-2 pl-3 pr-7 text-xs'
        }`}
        title="Switch to edit another page"
      >
        {CMS_PAGES_LIST.map((page) => (
          <option
            key={page.path}
            value={page.path}
            disabled={(page as any).disabled}
            className={(page as any).disabled ? 'text-gray-400 font-sans py-1' : 'font-sans py-1'}
          >
            {page.label}
          </option>
        ))}
      </select>
      <ChevronDown className="w-3.5 h-3.5 text-gray-500 pointer-events-none absolute right-2.5" />
    </div>
  );
};

export const CmsPageSwitcher: React.FC<Props> = (props) => {
  return <CmsPageSelectDropdown {...props} />;
};
