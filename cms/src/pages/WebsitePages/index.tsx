import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Eye,
  Edit,
  Plus,
  Globe,
  CheckCircle,
  Clock,
  User,
  ShieldCheck,
  Search,
  FileText,
  Home,
  UtensilsCrossed,
  Calendar,
  MapPin,
  Image as ImageIcon,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { LivePreviewModal } from '../../components/LivePreviewModal';
import { CmsLanguageDropdown } from '../../components/CmsLanguageDropdown';
import './index.css';

interface PageItem {
  id: string;
  name: string;
  slug: string;
  status: 'Published' | 'Draft';
  lastUpdated: string;
  author: string;
  editPath: string;
  previewPath: string;
}

const getPageIcon = (id: string) => {
  switch (id) {
    case 'home':
      return <Home className="w-3.5 h-3.5" />;
    case 'menu':
      return <UtensilsCrossed className="w-3.5 h-3.5" />;
    case 'reservations':
      return <Calendar className="w-3.5 h-3.5" />;
    case 'branches':
      return <MapPin className="w-3.5 h-3.5" />;
    case 'gallery':
      return <ImageIcon className="w-3.5 h-3.5" />;
    case 'about':
      return <FileText className="w-3.5 h-3.5" />;
    case 'terms':
      return <ShieldCheck className="w-3.5 h-3.5" />;
    default:
      return <Globe className="w-3.5 h-3.5" />;
  }
};

export const WebsitePages: React.FC = () => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewPath, setPreviewPath] = useState('/');
  const [isBranchesExpanded, setIsBranchesExpanded] = useState(true);
  const [showBranchesDropdown, setShowBranchesDropdown] = useState(false);

  const [pages, setPages] = useState<PageItem[]>([
    {
      id: 'home',
      name: 'Home',
      slug: '/',
      status: 'Published',
      lastUpdated: 'Aug 5, 2026',
      author: 'Sophea Admin',
      editPath: '/home',
      previewPath: '/',
    },
    {
      id: 'menu',
      name: 'Menu',
      slug: '/menu',
      status: 'Published',
      lastUpdated: 'Aug 3, 2026',
      author: 'Content Editor',
      editPath: '/menu',
      previewPath: '/menu',
    },
    {
      id: 'reservations',
      name: 'Reservations',
      slug: '/reservations',
      status: 'Published',
      lastUpdated: 'Jul 28, 2026',
      author: 'Sophea Admin',
      editPath: '/reservations-editor',
      previewPath: '/reservations',
    },
    {
      id: 'branches',
      name: 'Branches',
      slug: '/branches',
      status: 'Published',
      lastUpdated: 'Jul 20, 2026',
      author: 'Content Editor',
      editPath: '/branches',
      previewPath: '/branches',
    },
    {
      id: 'gallery',
      name: 'Gallery',
      slug: '/gallery',
      status: 'Published',
      lastUpdated: 'Aug 4, 2026',
      author: 'Sophea Admin',
      editPath: '/gallery',
      previewPath: '/gallery',
    },
    {
      id: 'about',
      name: 'About Us',
      slug: '/about',
      status: 'Published',
      lastUpdated: 'Jun 15, 2026',
      author: 'Content Editor',
      editPath: '/about',
      previewPath: '/about',
    },
    {
      id: 'terms',
      name: 'Terms & Conditions',
      slug: '/terms',
      status: 'Published',
      lastUpdated: 'Jul 10, 2026',
      author: 'Content Editor',
      editPath: '/terms',
      previewPath: '/terms',
    },
  ]);

  const toggleStatus = (id: string) => {
    setPages((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === 'Published' ? 'Draft' : 'Published' }
          : p
      )
    );
  };

  const handlePreview = (path: string) => {
    setPreviewPath(path);
    setIsPreviewOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 text-[#1c2819] font-sans">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-sans text-[#1c2819] tracking-tight flex items-center gap-2.5">
            <FileText className="w-7 h-7 text-black shrink-0" />
            <span>Website Pages</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1 font-medium">
            Manage and publish content for all public pages
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <CmsLanguageDropdown />
          <button className="px-4 py-2 rounded-xl bg-[#5b8045] hover:bg-[#4a6b37] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition cursor-pointer">
            <Plus className="w-4 h-4" />
            <span>New Page</span>
          </button>
        </div>
      </div>

      {/* ── Pages Table Card Container ── */}
      <div className="bg-white rounded-2xl border border-[#d6e0d0] shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#d6e0d0] text-gray-500 font-bold uppercase font-mono text-[10px] tracking-wider bg-[#f4f7f2]">
                <th className="py-4 px-6">PAGE NAME</th>
                <th className="py-4 px-4">SLUG</th>
                <th className="py-4 px-4">STATUS</th>
                <th className="py-4 px-4">LAST UPDATED</th>
                <th className="py-4 px-4">AUTHOR</th>
                <th className="py-4 px-6 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf2ea]">
              {pages.map((page) => (
                <React.Fragment key={page.id}>
                  <tr className="hover:bg-[#f8faf6] transition">
                    {/* Page Name */}
                    <td className="py-4 px-6 font-bold text-[#1c2819] text-sm">
                      <div className="flex items-center gap-2.5">
                        <span className="text-black shrink-0">
                          {getPageIcon(page.id)}
                        </span>
                        <span>{page.name}</span>
                        {page.id === 'branches' && (
                          <button
                            onClick={() => setIsBranchesExpanded(!isBranchesExpanded)}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#f4f7f2] border border-[#e2e8df] text-[10px] font-bold text-[#5b8045] hover:bg-[#eaf0e7] transition cursor-pointer ml-1"
                            title="Toggle sub-branch pages"
                          >
                            <span>2 Sub-pages</span>
                            <ChevronDown className={`w-3 h-3 transition-transform ${isBranchesExpanded ? 'rotate-180' : ''}`} />
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Slug Badge */}
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-md bg-[#f4f7f2] text-gray-600 font-mono text-xs border border-[#e2e8df]">
                        {page.slug}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${
                          page.status === 'Published'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {page.status}
                      </span>
                    </td>

                    {/* Last Updated */}
                    <td className="py-4 px-4 text-gray-600 font-medium">
                      {page.lastUpdated}
                    </td>

                    {/* Author */}
                    <td className="py-4 px-4 text-gray-700 font-medium">
                      {page.author}
                    </td>

                    {/* Action Buttons */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handlePreview(page.previewPath)}
                          className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-semibold flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Preview</span>
                        </button>

                        {page.id === 'branches' ? (
                          <div className="relative inline-block text-left">
                            <button
                              onClick={() => setShowBranchesDropdown(!showBranchesDropdown)}
                              className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:text-[#5b8045] hover:bg-[#f0f5ed] font-semibold flex items-center gap-1.5 transition cursor-pointer"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>Edit</span>
                              <ChevronDown className="w-3 h-3 text-gray-500" />
                            </button>

                            {showBranchesDropdown && (
                              <div className="absolute right-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-1.5 z-30 text-left text-xs">
                                <Link
                                  to="/branches"
                                  onClick={() => setShowBranchesDropdown(false)}
                                  className="px-3.5 py-2 hover:bg-[#f4f7f2] flex items-center gap-2 font-bold text-[#1c2819]"
                                >
                                  <MapPin className="w-3.5 h-3.5 text-[#5b8045]" />
                                  <span>Edit All Branches</span>
                                </Link>
                                <div className="border-t border-gray-100 my-1" />
                                <Link
                                  to="/branches?branch=boeung-kak"
                                  onClick={() => setShowBranchesDropdown(false)}
                                  className="px-3.5 py-2 hover:bg-[#f4f7f2] flex items-center gap-2 font-semibold text-gray-700"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#5b8045]" />
                                  <span>Boeung Kak Branch</span>
                                </Link>
                                <Link
                                  to="/branches?branch=toul-kork"
                                  onClick={() => setShowBranchesDropdown(false)}
                                  className="px-3.5 py-2 hover:bg-[#f4f7f2] flex items-center gap-2 font-semibold text-gray-700"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#5b8045]" />
                                  <span>Toul Kork Branch</span>
                                </Link>
                              </div>
                            )}
                          </div>
                        ) : (
                          <Link
                            to={page.editPath}
                            className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:text-[#5b8045] hover:bg-[#f0f5ed] font-semibold flex items-center gap-1.5 transition"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </Link>
                        )}

                        <button
                          onClick={() => toggleStatus(page.id)}
                          className="px-3 py-1.5 rounded-lg text-white font-bold transition cursor-pointer bg-[#5b8045] hover:bg-[#4a6b37]"
                        >
                          {page.status === 'Published' ? 'Unpublish' : 'Publish'}
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Sub-Pages Rows for Branches (Boeung Kak & Toul Kork) */}
                  {page.id === 'branches' && isBranchesExpanded && (
                    <>
                      {/* Boeung Kak Branch Sub-Row */}
                      <tr className="bg-[#f8faf6]/70 hover:bg-[#f0f5ed] transition border-l-4 border-l-[#5b8045]">
                        <td className="py-3 px-6 font-semibold text-gray-800 text-xs pl-10">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400 font-mono">-</span>
                            <MapPin className="w-3.5 h-3.5 text-[#5b8045]" />
                            <span className="font-bold text-[#1c2819]">Boeung Kak Branch</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-md bg-[#eef3eb] text-gray-600 font-mono text-[11px] border border-[#d8e3d3]">
                            /branches/boeung-kak
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Published
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-500 font-medium text-[11px]">Jul 20, 2026</td>
                        <td className="py-3 px-4 text-gray-600 font-medium text-[11px]">Content Editor</td>
                        <td className="py-3 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handlePreview('/branches#boeung-kak')}
                              className="px-2.5 py-1 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Preview</span>
                            </button>
                            <Link
                              to="/branches?branch=boeung-kak"
                              className="px-2.5 py-1 rounded-lg border border-gray-200 text-[#5b8045] hover:bg-[#f0f5ed] text-xs font-semibold flex items-center gap-1 transition"
                            >
                              <Edit className="w-3 h-3" />
                              <span>Edit</span>
                            </Link>
                            <button
                              onClick={() => toggleStatus('branches')}
                              className="px-2.5 py-1 rounded-lg text-white text-xs font-bold transition cursor-pointer bg-[#5b8045] hover:bg-[#4a6b37]"
                            >
                              Unpublish
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Toul Kork Branch Sub-Row */}
                      <tr className="bg-[#f8faf6]/70 hover:bg-[#f0f5ed] transition border-l-4 border-l-[#5b8045]">
                        <td className="py-3 px-6 font-semibold text-gray-800 text-xs pl-10">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400 font-mono">-</span>
                            <MapPin className="w-3.5 h-3.5 text-[#5b8045]" />
                            <span className="font-bold text-[#1c2819]">Toul Kork Branch</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-md bg-[#eef3eb] text-gray-600 font-mono text-[11px] border border-[#d8e3d3]">
                            /branches/toul-kork
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Published
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-500 font-medium text-[11px]">Jul 20, 2026</td>
                        <td className="py-3 px-4 text-gray-600 font-medium text-[11px]">Content Editor</td>
                        <td className="py-3 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handlePreview('/branches#toul-kork')}
                              className="px-2.5 py-1 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Preview</span>
                            </button>
                            <Link
                              to="/branches?branch=toul-kork"
                              className="px-2.5 py-1 rounded-lg border border-gray-200 text-[#5b8045] hover:bg-[#f0f5ed] text-xs font-semibold flex items-center gap-1 transition"
                            >
                              <Edit className="w-3 h-3" />
                              <span>Edit</span>
                            </Link>
                            <button
                              onClick={() => toggleStatus('branches')}
                              className="px-2.5 py-1 rounded-lg text-white text-xs font-bold transition cursor-pointer bg-[#5b8045] hover:bg-[#4a6b37]"
                            >
                              Unpublish
                            </button>
                          </div>
                        </td>
                      </tr>
                    </>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Preview Modal */}
      <LivePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        pagePath={previewPath}
      />
    </div>
  );
};
