import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Eye,
  Edit,
  Plus,
  Globe,
  FileText,
  Home,
  UtensilsCrossed,
  Calendar,
  MapPin,
  Image as ImageIcon,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { loadPageJson } from '../../lib/cmsStorage';
import { useCmsRealtimeListener } from '../../lib/cmsRealtimeSync';
import { LivePreviewModal } from '../../components/LivePreviewModal';
import { CmsLanguageDropdown } from '../../components/CmsLanguageDropdown';
import './index.css';

interface SubPageItem {
  id: string;
  name: string;
  slug: string;
  status: 'Published' | 'Draft';
  lastUpdated: string;
  author: string;
  editPath: string;
  previewPath: string;
  metricsText?: string;
}

interface PageItem {
  id: string;
  name: string;
  slug: string;
  status: 'Published' | 'Draft';
  lastUpdated: string;
  author: string;
  editPath: string;
  previewPath: string;
  jsonFilename?: string;
  metricsText?: string;
  subPages?: SubPageItem[];
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
  const [isBranchesExpanded, setIsBranchesExpanded] = useState(false);
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
      jsonFilename: 'home.json',
      metricsText: 'Hero + Signature Dishes & Spaces',
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
      jsonFilename: 'menu.json',
      metricsText: 'Dishes & Menu Categories',
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
      jsonFilename: 'reservations.json',
      metricsText: 'Booking Form & Hours Settings',
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
      jsonFilename: 'restaurants.json',
      metricsText: '2 Active Branches',
      subPages: [
        {
          id: 'boeung-kak',
          name: 'Boeung Kak Branch',
          slug: '/branches/boeung-kak',
          status: 'Published',
          lastUpdated: 'Jul 20, 2026',
          author: 'Content Editor',
          editPath: '/branches?branch=boeung-kak',
          previewPath: '/branches#boeung-kak',
          metricsText: '300+ Capacity • Event Space',
        },
        {
          id: 'toul-kork',
          name: 'Toul Kork Branch',
          slug: '/branches/toul-kork',
          status: 'Published',
          lastUpdated: 'Jul 20, 2026',
          author: 'Content Editor',
          editPath: '/branches?branch=toul-kork',
          previewPath: '/branches#toul-kork',
          metricsText: '200+ Capacity • Garden Dining',
        },
      ],
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
      jsonFilename: 'gallery.json',
      metricsText: 'Photo Gallery & Albums',
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
      jsonFilename: 'about.json',
      metricsText: 'Our Story & Brand Values',
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
      metricsText: 'Legal & Privacy Policies',
    },
  ]);

  // Load real JSON content metrics
  const loadAllRealtimeData = useCallback(async () => {
    try {
      const [homeData, menuData, resData, restData, galleryData, aboutData] = await Promise.all([
        loadPageJson('home.json').catch(() => null),
        loadPageJson('menu.json').catch(() => null),
        loadPageJson('reservations.json').catch(() => null),
        loadPageJson('restaurants.json').catch(() => null),
        loadPageJson('gallery.json').catch(() => null),
        loadPageJson('about.json').catch(() => null),
      ]);

      const nowStr = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      setPages((prevPages) =>
        prevPages.map((page) => {
          if (page.id === 'home' && homeData) {
            const dishesCount = homeData.signatureDishes?.length || 0;
            const spacesCount = homeData.diningSpaces?.length || 0;
            return {
              ...page,
              metricsText: `${dishesCount} Dishes • ${spacesCount} Dining Spaces`,
            };
          }

          if (page.id === 'menu' && menuData) {
            const catCount = menuData.categories?.length || 5;
            let totalItems = 0;
            if (menuData.items) {
              Object.values(menuData.items).forEach((arr: any) => {
                if (Array.isArray(arr)) totalItems += arr.length;
              });
            }
            return {
              ...page,
              metricsText: totalItems > 0 ? `${totalItems} Items • ${catCount} Categories` : 'Menu Catalog',
            };
          }

          if (page.id === 'reservations' && resData) {
            const maxGuests = resData.maxGuests || '10+';
            return {
              ...page,
              metricsText: `Max ${maxGuests} Guests • Hours Config`,
            };
          }

          if (page.id === 'branches' && restData) {
            const locs = restData.locations || [];
            const locCount = locs.length || 2;
            const updatedSubPages: SubPageItem[] = locs.map((loc: any) => {
              const isBoeung = loc.id === 'boeungKak' || loc.id === 'boeung-kak';
              const slugKey = isBoeung ? 'boeung-kak' : 'toul-kork';
              const nameStr = loc.name || (isBoeung ? 'Boeung Kak Branch' : 'Toul Kork Branch');
              const highlightsCount = loc.highlights?.length || 0;
              return {
                id: slugKey,
                name: nameStr,
                slug: `/branches/${slugKey}`,
                status: 'Published',
                lastUpdated: nowStr,
                author: 'Content Editor',
                editPath: `/branches?branch=${slugKey}`,
                previewPath: `/branches#${slugKey}`,
                metricsText: `${highlightsCount} Highlights • ${loc.address || 'Phnom Penh'}`,
              };
            });

            return {
              ...page,
              metricsText: `${locCount} Locations Active`,
              subPages: updatedSubPages.length > 0 ? updatedSubPages : page.subPages,
            };
          }

          if (page.id === 'gallery' && galleryData) {
            const list = Array.isArray(galleryData) ? galleryData : galleryData.images || [];
            return {
              ...page,
              metricsText: `${list.length || 12} Photos in Gallery`,
            };
          }

          if (page.id === 'about' && aboutData) {
            const timelineCount = aboutData.timeline?.length || 4;
            return {
              ...page,
              metricsText: `${timelineCount} Timeline Milestones`,
            };
          }

          return page;
        })
      );
    } catch (err) {
      console.warn('Realtime sync fetch notice:', err);
    }
  }, []);

  useEffect(() => {
    loadAllRealtimeData();
  }, [loadAllRealtimeData]);

  // Subscribe to real-time events across tabs & devices
  useCmsRealtimeListener((evt) => {
    loadAllRealtimeData();
    if (evt.filename) {
      setPages((prevPages) =>
        prevPages.map((p) => {
          if (p.jsonFilename === evt.filename) {
            return {
              ...p,
              lastUpdated: 'Just now',
            };
          }
          return p;
        })
      );
    }
  });

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
                  <tr className={`hover:bg-[#f8faf6] transition ${page.id === 'branches' && isBranchesExpanded ? 'bg-[#f8faf6]/50' : ''}`}>
                    {/* Page Name */}
                    <td className="py-4 px-6 font-bold text-[#1c2819] text-sm">
                      <div className="flex items-center gap-2">
                        {/* Left-side arrow / bracket toggle for pages with subpages */}
                        {page.id === 'branches' ? (
                          <button
                            onClick={() => setIsBranchesExpanded(!isBranchesExpanded)}
                            className="w-6 h-6 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer flex items-center justify-center shrink-0"
                            title={isBranchesExpanded ? "Collapse sub-pages" : "Expand sub-pages"}
                          >
                            <ChevronRight
                              className={`w-4 h-4 transition-transform duration-200 ${
                                isBranchesExpanded ? 'rotate-90 text-gray-600' : ''
                              }`}
                            />
                          </button>
                        ) : (
                          <div className="w-6 h-6 shrink-0" />
                        )}

                        <span className="text-black shrink-0">
                          {getPageIcon(page.id)}
                        </span>
                        <div className="flex flex-col">
                          <span className="text-[#1c2819] font-bold">{page.name}</span>
                          {page.metricsText && (
                            <span className="text-[11px] font-normal text-gray-500 font-mono">
                              {page.metricsText}
                            </span>
                          )}
                        </div>
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
                                {page.subPages?.map((sub) => (
                                  <Link
                                    key={sub.id}
                                    to={sub.editPath}
                                    onClick={() => setShowBranchesDropdown(false)}
                                    className="px-3.5 py-2 hover:bg-[#f4f7f2] flex items-center gap-2 font-semibold text-gray-700"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#5b8045]" />
                                    <span>{sub.name}</span>
                                  </Link>
                                ))}
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

                  {/* Dynamic Sub-Pages Rows for Branches */}
                  {page.id === 'branches' && isBranchesExpanded && page.subPages && (
                    <>
                      {page.subPages.map((subPage, index) => {
                        const isLast = index === page.subPages!.length - 1;
                        return (
                          <tr key={subPage.id} className="bg-[#f9faf7]/70 hover:bg-[#f2f6f0] transition">
                            <td className="py-3 px-6 font-semibold text-gray-800 text-xs">
                              <div className="flex items-center">
                                {/* Tree Connector Line (├─ or └─) in subtle grey */}
                                <div className="w-6 flex justify-center items-center shrink-0 text-gray-300">
                                  <svg className="w-5 h-8 text-gray-300 fill-none stroke-current" viewBox="0 0 20 32">
                                    {isLast ? (
                                      <path d="M 10 0 V 16 H 20" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                                    ) : (
                                      <path d="M 10 0 V 32 M 10 16 H 20" strokeWidth="1.75" strokeLinecap="round" />
                                    )}
                                  </svg>
                                </div>

                                <div className="flex items-center gap-2 pl-2">
                                  <span className="p-1 rounded-md bg-[#eaf0e7] text-[#5b8045] shrink-0">
                                    <MapPin className="w-3.5 h-3.5" />
                                  </span>
                                  <div className="flex flex-col">
                                    <span className="font-bold text-[#1c2819]">{subPage.name}</span>
                                    {subPage.metricsText && (
                                      <span className="text-[10px] text-gray-400 font-mono font-normal">
                                        {subPage.metricsText}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2.5 py-1 rounded-md bg-[#eef3eb] text-gray-600 font-mono text-[11px] border border-[#d8e3d3]">
                                {subPage.slug}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {subPage.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-600 font-medium">{subPage.lastUpdated}</td>
                            <td className="py-3 px-4 text-gray-700 font-medium">{subPage.author}</td>
                            <td className="py-3 px-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handlePreview(subPage.previewPath)}
                                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-semibold flex items-center gap-1.5 transition cursor-pointer text-xs"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Preview</span>
                                </button>
                                <Link
                                  to={subPage.editPath}
                                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:text-[#5b8045] hover:bg-[#f0f5ed] font-semibold flex items-center gap-1.5 transition text-xs"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                  <span>Edit</span>
                                </Link>
                                <button
                                  onClick={() => toggleStatus('branches')}
                                  className="px-3 py-1.5 rounded-lg text-white font-bold transition cursor-pointer bg-[#5b8045] hover:bg-[#4a6b37] text-xs"
                                >
                                  Unpublish
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
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
