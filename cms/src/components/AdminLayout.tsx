import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Home,
  UtensilsCrossed,
  Calendar,
  MapPin,
  Image as ImageIcon,
  MessageSquare,
  Globe,
  Eye,
  ExternalLink,
  GitBranch,
  CheckCircle,
  Menu as MenuIcon,
  X,
} from 'lucide-react';
import { LivePreviewModal } from './LivePreviewModal';
import { CmsLanguageSwitcher } from './CmsLanguageSwitcher';
import { getCMSConfig, saveCMSConfig } from '../lib/cmsStorage';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewPath, setPreviewPath] = useState('/');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const [config, setConfig] = useState(getCMSConfig());
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveCMSConfig(config);
    setSaveMessage('CMS & GitHub settings saved!');
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard, preview: '/' },
    { label: 'Home Page', path: '/home', icon: Home, preview: '/' },
    { label: 'Menu Items', path: '/menu', icon: UtensilsCrossed, preview: '/menu' },
    { label: 'Events & Promos', path: '/events', icon: Calendar, preview: '/events' },
    { label: 'Branches', path: '/branches', icon: MapPin, preview: '/branches' },
    { label: 'Gallery', path: '/gallery', icon: ImageIcon, preview: '/gallery' },
    { label: 'Testimonials', path: '/testimonials', icon: MessageSquare, preview: '/' },
    { label: 'Translations (i18n)', path: '/translations', icon: Globe, preview: '/' },
  ];

  const currentNavItem = navItems.find((item) => item.path === location.pathname) || navItems[0];

  const openPreview = () => {
    setPreviewPath(currentNavItem.preview);
    setIsPreviewOpen(true);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#121c13] text-neutral-100 font-sans overflow-hidden">
      {/* Top Bar - Strictly Fixed Navbar */}
      <header className="h-16 bg-[#18271a] border-b border-[#2d402f] px-4 sm:px-6 flex items-center justify-between shrink-0 z-50 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="p-2 text-neutral-400 hover:text-white md:hidden"
          >
            {isMobileNavOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
          <Link to="/" className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#b39a62] text-black font-serif font-bold flex items-center justify-center text-sm tracking-wider shadow-sm">
              OMR
            </span>
            <div>
              <h1 className="text-sm font-bold text-neutral-100 leading-tight font-serif tracking-wide">
                One More Restaurant
              </h1>
              <span className="text-[10px] uppercase tracking-widest text-[#c8a962] font-mono font-medium">
                Content Management System
              </span>
            </div>
          </Link>
        </div>

        {/* Controls Bar with Language Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          <CmsLanguageSwitcher />

          <button
            onClick={openPreview}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#c8a962]/15 text-[#e5c158] hover:bg-[#c8a962]/25 border border-[#c8a962]/30 transition shadow-sm"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Live Preview</span>
          </button>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1d2f20] hover:bg-[#253b29] text-neutral-300 border border-[#2d402f] transition"
            title="CI/CD & GitHub Settings"
          >
            <GitBranch className="w-4 h-4 text-[#c8a962]" />
            <span className="hidden sm:inline">Settings</span>
          </button>

          <a
            href={config.websiteUrl || 'http://localhost:3001'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1d2f20] hover:bg-[#253b29] text-neutral-300 border border-[#2d402f] transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Visit Site</span>
          </a>
        </div>
      </header>

      {/* Main Container - Non-scrolling body, scrollable content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar Navigation */}
        <aside
          className={`${
            isMobileNavOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          } fixed md:static inset-y-0 left-0 z-40 w-64 bg-[#18271a] border-r border-[#2d402f] p-4 transition-transform duration-200 ease-in-out flex flex-col justify-between overflow-y-auto shrink-0`}
        >
          <div className="space-y-1.5">
            <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#a9ca96] font-mono">
              Content Managers
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileNavOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                    isActive
                      ? 'bg-[#c8a962]/15 text-[#e5c158] font-bold border border-[#c8a962]/30 shadow-sm'
                      : 'text-neutral-300 hover:text-neutral-100 hover:bg-[#1d2f20]/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#e5c158]' : 'text-[#8ba38e]'}`} />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-[#2d402f] space-y-2">
            <div className="bg-[#121c13] p-3 rounded-xl border border-[#2d402f] space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-neutral-400">
                <span>Target:</span>
                <span className="font-mono text-[#a9ca96] text-[11px]">Frontend/public</span>
              </div>
              <div className="flex items-center justify-between text-neutral-400">
                <span>GitHub PAT:</span>
                <span className="font-mono text-[11px] text-[#e5c158]">
                  {config.githubToken ? 'Connected' : 'Local Disk'}
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area - Scrollable */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-[#121c13]">
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#18271a] border border-[#2d402f] rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-neutral-100 flex items-center gap-2 font-serif">
                <GitBranch className="w-5 h-5 text-[#c8a962]" />
                CMS & GitHub CI/CD Settings
              </h2>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="text-neutral-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#a9ca96] mb-1">
                  Public Website Base URL (for Live Preview)
                </label>
                <input
                  type="text"
                  value={config.websiteUrl || ''}
                  onChange={(e) => setConfig({ ...config, websiteUrl: e.target.value })}
                  placeholder="http://localhost:3001"
                  className="w-full bg-[#121c13] border border-[#2d402f] text-neutral-100 text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-[#c8a962] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#a9ca96] mb-1">
                  GitHub Personal Access Token (PAT)
                </label>
                <input
                  type="password"
                  value={config.githubToken || ''}
                  onChange={(e) => setConfig({ ...config, githubToken: e.target.value })}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  className="w-full bg-[#121c13] border border-[#2d402f] text-neutral-100 text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-[#c8a962] font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#a9ca96] mb-1">
                    Repo Owner / Org
                  </label>
                  <input
                    type="text"
                    value={config.githubOwner || ''}
                    onChange={(e) => setConfig({ ...config, githubOwner: e.target.value })}
                    placeholder="e.g. sornsomavatey"
                    className="w-full bg-[#121c13] border border-[#2d402f] text-neutral-100 text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-[#c8a962] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#a9ca96] mb-1">
                    Repository Name
                  </label>
                  <input
                    type="text"
                    value={config.githubRepo || ''}
                    onChange={(e) => setConfig({ ...config, githubRepo: e.target.value })}
                    placeholder="e.g. omr_website_v1"
                    className="w-full bg-[#121c13] border border-[#2d402f] text-neutral-100 text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-[#c8a962] font-mono"
                  />
                </div>
              </div>

              {saveMessage && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium pt-1">
                  <CheckCircle className="w-4 h-4" />
                  {saveMessage}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs bg-[#1d2f20] hover:bg-[#253b29] text-neutral-300 font-medium border border-[#2d402f]"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs bg-[#c8a962] hover:bg-[#b39a62] text-black font-semibold shadow-md"
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
