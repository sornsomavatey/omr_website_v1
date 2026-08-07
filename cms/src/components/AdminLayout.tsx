import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Home as HomeIcon,
  UtensilsCrossed,
  MapPin,
  Image as ImageIcon,
  MessageSquare,
  Globe,
  Eye,
  ExternalLink,
  Menu as MenuIcon,
  X,
  Search,
  Settings,
  LogOut,
  Bell,
  MessageCircle,
  FileText,
  Calendar,
  Building2,
  Users,
  ShieldCheck,
  Building,
  GitBranch,
  CheckCircle,
  RotateCcw,
} from 'lucide-react';
import { LivePreviewModal } from './LivePreviewModal';
import { CmsLanguageSwitcher } from './CmsLanguageSwitcher';
import { getCMSConfig, saveCMSConfig } from '../lib/cmsStorage';
import omrLogo from '../assets/one-more-logo-green.webp';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewPath, setPreviewPath] = useState('/');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [globalSearch, setGlobalSearch] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('Boeung Kak');

  const [config, setConfig] = useState(getCMSConfig());
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const handleClearCMSCache = () => {
    if (window.confirm('Are you sure you want to clear local cache and reload fresh data?')) {
      try {
        localStorage.clear();
        sessionStorage.clear();
        if ('caches' in window) {
          caches.keys().then((keys) => {
            keys.forEach((key) => caches.delete(key));
          });
        }
        window.location.reload();
      } catch {
        window.location.reload();
      }
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveCMSConfig(config);
    setSaveMessage('CMS & GitHub settings saved successfully!');
    setTimeout(() => setSaveMessage(null), 3000);
  };

  // Nav Groups matching user request (Gallery replaced by Header, Footer added)
  const navSections = [
    {
      group: 'CONTENT',
      items: [
        { label: 'Website Pages', path: '/pages', icon: FileText, preview: '/' },
        { label: 'Menu Management', path: '/menu', icon: UtensilsCrossed, preview: '/menu' },
        { label: 'Header', path: '/header', icon: Globe, preview: '/' },
        { label: 'Footer', path: '/footer', icon: FileText, preview: '/' },
        { label: 'Testimonials', path: '/testimonials', icon: MessageSquare, preview: '/' },
      ],
    },
    {
      group: 'OPERATIONS',
      items: [
        { label: 'Reservations', path: '/reservations', icon: Calendar, preview: '/reservations' },
        { label: 'Branches', path: '/branches', icon: MapPin, preview: '/branches' },
      ],
    },
    {
      group: 'ADMIN',
      items: [
        { label: 'Translations (i18n)', path: '/translations', icon: Globe, preview: '/' },
      ],
    },
  ];

  const allItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard, preview: '/' },
    ...navSections.flatMap((s) => s.items),
  ];

  const currentNavItem = allItems.find((item) => item.path === location.pathname) || allItems[0];

  const openPreview = () => {
    setPreviewPath(currentNavItem.preview);
    setIsPreviewOpen(true);
  };

  return (
    <div className="h-screen w-screen flex bg-[#f8faf6] text-[#1c2819] font-sans overflow-hidden">
      {/* ── Left Sidebar (Brand Green Background Theme) ── */}
      <aside
        className={`${
          isSidebarVisible
            ? 'w-64 translate-x-0 p-4 border-r border-[#e2e8df] opacity-100'
            : 'w-0 -translate-x-full p-0 border-0 border-transparent opacity-0 pointer-events-none'
        } fixed md:static inset-y-0 left-0 z-40 bg-[#f4f7f2] text-[#1c2819] transition-all duration-300 ease-in-out flex flex-col justify-between shrink-0 shadow-xs overflow-y-auto`}
      >
        <div className="space-y-5 min-w-[224px]">
          {/* Brand Logo & Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#e2e8df]">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                <img src={omrLogo} alt="One More Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-sm font-extrabold text-[#1c2819] leading-tight font-sans tracking-tight">
                  One More Restaurant
                </h1>
                <span className="text-[10px] text-gray-500 font-bold">
                  Content Management System
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Items */}
          <div className="space-y-4">
            {/* Dashboard Link */}
            <Link
              to="/"
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                location.pathname === '/'
                  ? 'bg-white text-[#213816] border border-[#5b8045]/40 font-extrabold shadow-2xs'
                  : 'text-gray-700 hover:bg-white/70 hover:text-black font-semibold'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className={`w-4 h-4 ${location.pathname === '/' ? 'text-[#5b8045] stroke-[2.5]' : 'text-gray-600'}`} />
                <span className={location.pathname === '/' ? 'font-extrabold text-[#213816]' : 'font-semibold text-gray-700'}>Dashboard</span>
              </div>
              {location.pathname === '/' && <span className="w-1.5 h-1.5 rounded-full bg-[#5b8045]" />}
            </Link>

            {/* Nav Groups */}
            {navSections.map((section) => (
              <div key={section.group} className="space-y-1">
                <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono">
                  {section.group}
                </div>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                        isActive
                          ? 'bg-white text-[#213816] border border-[#5b8045]/40 font-extrabold shadow-2xs'
                          : 'text-gray-700 hover:bg-white/70 hover:text-black font-semibold'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[#5b8045] stroke-[2.5]' : 'text-gray-600'}`} />
                        <span className={isActive ? 'font-extrabold text-[#213816]' : 'font-semibold text-gray-700'}>
                          {item.label}
                        </span>
                      </div>
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#5b8045]" />}
                    </Link>
                  );
                })}
              </div>
            ))}

            {/* Settings */}
            <div className="space-y-1 pt-1">
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-gray-700 hover:bg-white/70 hover:text-black transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-4 h-4 text-gray-600" />
                  <span className="font-semibold text-gray-700">Settings</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Logout */}
        <div className="pt-4 border-t border-[#e2e8df] min-w-[224px]">
          <Link
            to="/"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-gray-700 hover:text-rose-700 hover:bg-rose-50 transition"
          >
            <LogOut className="w-4 h-4 text-gray-600" />
            <span className="font-semibold text-gray-700">Logout</span>
          </Link>
        </div>
      </aside>

      {/* ── Main Content Container ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar with Hamburger Toggle */}
        <header className="bg-white border-b border-[#e2e8df] px-4 sm:px-6 py-3 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            {/* Hamburger Button to Hide/Show Sidebar */}
            <button
              onClick={() => setIsSidebarVisible(!isSidebarVisible)}
              className="w-10 h-10 text-black hover:bg-[#f4f7f2] rounded-xl border border-[#e2e8df] transition cursor-pointer flex items-center justify-center shrink-0 shadow-2xs"
              title={isSidebarVisible ? 'Hide Navigation Sidebar' : 'Show Navigation Sidebar'}
            >
              <MenuIcon className="w-5 h-5 text-black" />
            </button>

            {/* Global Search Input matching Hamburger button size and radius */}
            <div className="relative flex-1 h-10 flex items-center">
              <Search className="w-4 h-4 absolute left-3.5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="w-full h-10 pl-9.5 pr-4 rounded-xl bg-[#f4f7f2] border border-transparent focus:border-[#5b8045] focus:bg-white text-xs outline-none transition"
              />
            </div>
          </div>

          {/* Top Bar Actions & Profile */}
          <div className="flex items-center gap-3">
            {/* Clear Cache Button */}
            <button
              onClick={handleClearCMSCache}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 text-xs font-bold border border-amber-500/30 shadow-xs transition cursor-pointer"
              title="Clear local browser cache and reload fresh data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Cache</span>
            </button>

            {/* View Website Button */}
            <button
              onClick={openPreview}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#5b8045]/10 hover:bg-[#5b8045]/20 text-[#5b8045] text-xs font-bold border border-[#5b8045]/30 shadow-xs transition cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>View Website</span>
            </button>

            {/* User Avatar Circle */}
            <div className="w-8 h-8 rounded-full bg-[#5b8045] text-white text-xs font-bold flex items-center justify-center shadow-xs cursor-pointer">
              SM
            </div>
          </div>
        </header>

        {/* Main Content View Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-white">
          <Outlet />
        </main>
      </div>

      {/* Live Preview Modal */}
      <LivePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        pagePath={previewPath}
      />

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border border-[#e2e8df] rounded-3xl p-6 space-y-5 shadow-2xl text-[#1c2819]">
            <div className="flex items-center justify-between pb-3 border-b border-[#e2e8df]">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#5b8045]/10 text-[#5b8045]">
                  <GitBranch className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#212d1b] font-serif">
                    CMS & Repository Settings
                  </h2>
                  <p className="text-xs text-gray-500">Configure deployment targets & GitHub sync</p>
                </div>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="text-gray-400 hover:text-black p-1.5 rounded-xl hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5b8045] mb-1.5">
                  Public Website Base URL (for Live Preview)
                </label>
                <input
                  type="text"
                  value={config.websiteUrl || ''}
                  onChange={(e) => setConfig({ ...config, websiteUrl: e.target.value })}
                  placeholder="http://localhost:3001"
                  className="w-full bg-[#f8faf6] border border-[#e2e8df] text-[#212d1b] text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#5b8045] focus:ring-2 focus:ring-[#5b8045]/20 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5b8045] mb-1.5">
                  GitHub Personal Access Token (PAT)
                </label>
                <input
                  type="password"
                  value={config.githubToken || ''}
                  onChange={(e) => setConfig({ ...config, githubToken: e.target.value })}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  className="w-full bg-[#f8faf6] border border-[#e2e8df] text-[#212d1b] text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#5b8045] focus:ring-2 focus:ring-[#5b8045]/20 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5b8045] mb-1.5">
                    Repo Owner / Org
                  </label>
                  <input
                    type="text"
                    value={config.githubOwner || ''}
                    onChange={(e) => setConfig({ ...config, githubOwner: e.target.value })}
                    placeholder="e.g. sornsomavatey"
                    className="w-full bg-[#f8faf6] border border-[#e2e8df] text-[#212d1b] text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#5b8045] focus:ring-2 focus:ring-[#5b8045]/20 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5b8045] mb-1.5">
                    Repository Name
                  </label>
                  <input
                    type="text"
                    value={config.githubRepo || ''}
                    onChange={(e) => setConfig({ ...config, githubRepo: e.target.value })}
                    placeholder="e.g. omr_website_v1"
                    className="w-full bg-[#f8faf6] border border-[#e2e8df] text-[#212d1b] text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#5b8045] focus:ring-2 focus:ring-[#5b8045]/20 font-mono"
                  />
                </div>
              </div>

              {saveMessage && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl font-medium">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  {saveMessage}
                </div>
              )}

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs bg-[#5b8045] hover:bg-[#4a6b37] text-white font-bold shadow-md shadow-[#5b8045]/20 transition"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

