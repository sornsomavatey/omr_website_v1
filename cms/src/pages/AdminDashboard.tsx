import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileJson,
  Home,
  UtensilsCrossed,
  Calendar,
  MapPin,
  Image as ImageIcon,
  MessageSquare,
  Globe,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const cards = [
    {
      title: 'Home Page Content',
      desc: 'Hero banner text, call-to-actions, signature dishes highlights.',
      file: 'home.json',
      path: '/home',
      icon: Home,
      color: 'from-[#c8a962]/20 to-[#c8a962]/5 text-[#e5c158] border-[#c8a962]/30',
    },
    {
      title: 'Menu Items',
      desc: 'Dishes, prices, descriptions, category tags, and out-of-stock badges.',
      file: 'menu.json',
      path: '/menu',
      icon: UtensilsCrossed,
      color: 'from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/30',
    },
    {
      title: 'Events & Promotions',
      desc: 'Special dining events, upcoming workshops, banners and dates.',
      file: 'events.json',
      path: '/events',
      icon: Calendar,
      color: 'from-sky-500/20 to-sky-500/5 text-sky-400 border-sky-500/30',
    },
    {
      title: 'Restaurant Branches',
      desc: 'Toul Kork & Boeung Kak location info, operating hours, phone numbers.',
      file: 'restaurants.json',
      path: '/branches',
      icon: MapPin,
      color: 'from-purple-500/20 to-purple-500/5 text-purple-400 border-purple-500/30',
    },
    {
      title: 'Photo Gallery',
      desc: 'Dining room photos, dish presentations, ambience shots.',
      file: 'gallery.json',
      path: '/gallery',
      icon: ImageIcon,
      color: 'from-rose-500/20 to-rose-500/5 text-rose-400 border-rose-500/30',
    },
    {
      title: 'Customer Testimonials',
      desc: 'Guest reviews, ratings, customer comments and quotes.',
      file: 'testimonials.json',
      path: '/testimonials',
      icon: MessageSquare,
      color: 'from-amber-500/20 to-amber-500/5 text-amber-400 border-amber-500/30',
    },
    {
      title: 'Multi-Language Strings',
      desc: 'Translate interface text for English, Khmer, Chinese, and Korean.',
      file: 'locales/*.json',
      path: '/translations',
      icon: Globe,
      color: 'from-teal-500/20 to-teal-500/5 text-teal-400 border-teal-500/30',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#18271a] via-[#1c2e1f] to-[#283d2c] p-6 sm:p-8 border border-[#2d402f] shadow-lg">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c8a962]/15 text-[#e5c158] text-xs font-semibold border border-[#c8a962]/30">
            <Sparkles className="w-3.5 h-3.5" />
            Standalone OMR Content CMS
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-100 font-serif tracking-wide">
            Control Your Website Content & Media
          </h1>
          <p className="text-[#a9ca96] text-sm max-w-2xl leading-relaxed">
            Easily update text, manage multi-language translations, and upload new images. Updates sync directly to Frontend JSON files or commit straight to Git for automated deployment.
          </p>
        </div>
      </div>

      {/* Content Modules Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <Link
              key={card.path}
              to={card.path}
              className="group p-5 bg-[#18271a] hover:bg-[#1f3322] rounded-2xl border border-[#2d402f] hover:border-[#c8a962]/40 transition-all duration-200 flex flex-col justify-between space-y-4 shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br border ${card.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono bg-[#121c13] text-[#8ba38e] px-2 py-0.5 rounded-md border border-[#2d402f] flex items-center gap-1">
                    <FileJson className="w-3 h-3 text-[#c8a962]" />
                    {card.file}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-neutral-100 group-hover:text-[#e5c158] transition">
                    {card.title}
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed mt-1">{card.desc}</p>
                </div>
              </div>

              <div className="flex items-center text-xs font-semibold text-[#c8a962] gap-1 group-hover:translate-x-1 transition-transform">
                <span>Manage Content</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
