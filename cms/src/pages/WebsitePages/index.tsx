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
      editPath: '/reservations',
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
                <tr key={page.id} className="hover:bg-[#f8faf6] transition">
                  {/* Page Name */}
                  <td className="py-4 px-6 font-bold text-[#1c2819] text-sm">
                    <div className="flex items-center gap-2.5">
                      <span className="text-black shrink-0">
                        {getPageIcon(page.id)}
                      </span>
                      <span>{page.name}</span>
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

                      <Link
                        to={page.editPath}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:text-[#5b8045] hover:bg-[#f0f5ed] font-semibold flex items-center gap-1.5 transition"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </Link>

                      <button
                        onClick={() => toggleStatus(page.id)}
                        className={`px-3 py-1.5 rounded-lg text-white font-bold transition cursor-pointer ${
                          page.status === 'Published'
                            ? 'bg-[#5b8045] hover:bg-[#4a6b37]'
                            : 'bg-[#5b8045] hover:bg-[#4a6b37]'
                        }`}
                      >
                        {page.status === 'Published' ? 'Unpublish' : 'Publish'}
                      </button>
                    </div>
                  </td>
                </tr>
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
