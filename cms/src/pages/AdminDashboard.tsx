import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  UtensilsCrossed,
  MapPin,
  Image as ImageIcon,
  Plus,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Download,
  Users,
  Eye,
  Loader2,
} from 'lucide-react';
import { loadPageJson } from '../lib/cmsStorage';

export const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [menuData, setMenuData] = useState<any>(null);
  const [restaurantsData, setRestaurantsData] = useState<any>(null);
  const [hoveredSegmentIndex, setHoveredSegmentIndex] = useState<number | null>(null);
  const [hoveredDayIndex, setHoveredDayIndex] = useState<number | null>(null);
  const [hoveredVisitorIndex, setHoveredVisitorIndex] = useState<number | null>(null);
  const [hoveredPreorderIndex, setHoveredPreorderIndex] = useState<number | null>(null);

  const pieSegments = [
    { label: '/menu', percentage: '58%', visits: '8,236 visits', color: '#213816', pageName: 'Menu Page' },
    { label: '/ (Home)', percentage: '26%', visits: '3,692 visits', color: '#5b8045', pageName: 'Home Page' },
    { label: '/reservations', percentage: '16%', visits: '2,272 visits', color: '#9ec090', pageName: 'Reservations' },
  ];

  const weeklyReservationTrend = [
    { day: 'Mo', fullDate: 'Aug 4, 2026', count: 22, x: 20, y: 55 },
    { day: 'Tu', fullDate: 'Aug 5, 2026', count: 14, x: 60, y: 70 },
    { day: 'We', fullDate: 'Aug 6, 2026 (Today)', count: 34, x: 100, y: 32 },
    { day: 'Th', fullDate: 'Aug 7, 2026', count: 20, x: 140, y: 58 },
    { day: 'Fr', fullDate: 'Aug 8, 2026', count: 26, x: 180, y: 46 },
    { day: 'Sa', fullDate: 'Aug 9, 2026', count: 42, x: 220, y: 16 },
    { day: 'Su', fullDate: 'Aug 10, 2026', count: 32, x: 260, y: 36 },
  ];

  const weeklyVisitorTrend = [
    { day: 'M', fullDay: 'Monday', visits: 420 },
    { day: 'T', fullDay: 'Tuesday', visits: 640 },
    { day: 'W', fullDay: 'Wednesday', visits: 520 },
    { day: 'T', fullDay: 'Thursday', visits: 780 },
    { day: 'F', fullDay: 'Friday', visits: 710 },
    { day: 'S', fullDay: 'Saturday', visits: 850 },
    { day: 'S', fullDay: 'Sunday', visits: 922 },
  ];

  const preorderDishes = [
    { rank: '#1', name: 'Wagyu Beef Lok Lak', orders: 420, pct: '34%', color: '#1e4620' },
    { rank: '#2', name: 'Signature Amok Curry', orders: 310, pct: '25%', color: '#365c2a' },
    { rank: '#3', name: 'Khmer Fried Rice', orders: 280, pct: '22%', color: '#5b8045' },
    { rank: '#4', name: 'Mango Sticky Rice', orders: 238, pct: '19%', color: '#84ab6d' },
  ];

  const currentSegment = hoveredSegmentIndex !== null ? pieSegments[hoveredSegmentIndex] : pieSegments[0];
  const activeResDay = hoveredDayIndex !== null ? weeklyReservationTrend[hoveredDayIndex] : null;
  const activeVisitorPoint = hoveredVisitorIndex !== null ? weeklyVisitorTrend[hoveredVisitorIndex] : null;
  const activePreorder = hoveredPreorderIndex !== null ? preorderDishes[hoveredPreorderIndex] : preorderDishes[0];

  useEffect(() => {
    setLoading(true);
    Promise.all([
      loadPageJson('menu.json').catch(() => null),
      loadPageJson('restaurants.json').catch(() => null),
    ])
      .then(([menu, restaurants]) => {
        setMenuData(menu);
        setRestaurantsData(restaurants);
      })
      .finally(() => setLoading(false));
  }, []);

  const calculateTotalDishes = () => {
    if (!menuData?.items) return 86;
    let count = 0;
    Object.values(menuData.items).forEach((arr: any) => {
      if (Array.isArray(arr)) count += arr.length;
    });
    return count;
  };

  const totalDishes = calculateTotalDishes();
  const locationCount = restaurantsData?.locations?.length || 2;

  // Top 4 Cards matching screenshot layout with green primary accents
  const kpis = [
    {
      title: 'RESERVATIONS TODAY',
      value: '34',
      change: '↗ +12% vs yesterday',
      icon: Calendar,
      isPositive: true,
      showGraph: true,
      graphType: 'reservations',
    },
    {
      title: 'MOST VISITED PAGE',
      value: '',
      change: '',
      icon: Eye,
      isPositive: true,
      showGraph: true,
      graphType: 'pie',
    },
    {
      title: 'WEBSITE VISITS',
      value: '',
      change: '',
      icon: Users,
      isPositive: true,
      showGraph: true,
      graphType: 'visitors',
    },
    {
      title: 'MOST PRE-ORDERED MENU',
      value: '1,248',
      change: '↑ +18% pre-order rate',
      icon: UtensilsCrossed,
      isPositive: true,
      showGraph: true,
      graphType: 'preorders',
    },
  ];

  // Today's Reservations mock table matching screenshot
  const todaysReservations = [
    {
      name: 'Sophea Meas',
      phone: '+855 12 345 678',
      time: '7:00 PM',
      guests: 4,
      branch: 'Boeung Kak',
      preorder: [
        { name: 'Signature Amok Curry', qty: 2 },
        { name: 'Wagyu Beef Lok Lak', qty: 1 },
      ],
      status: 'Confirmed',
    },
    {
      name: 'Dara Chhan',
      phone: '+855 17 876 543',
      time: '7:30 PM',
      guests: 2,
      branch: 'Toul Kork',
      preorder: null,
      status: 'Pending',
    },
    {
      name: 'Vannak Ken',
      phone: '+855 92 112 334',
      time: '8:00 PM',
      guests: 6,
      branch: 'Boeung Kak',
      preorder: [
        { name: 'Khmer Fried Rice', qty: 3 },
        { name: 'Mango Sticky Rice', qty: 2 },
      ],
      status: 'Confirmed',
    },
    {
      name: 'Bopha Roth',
      phone: '+855 88 901 223',
      time: '8:30 PM',
      guests: 3,
      branch: 'Toul Kork',
      preorder: [
        { name: 'Grilled River Prawns', qty: 2 },
      ],
      status: 'Confirmed',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 gap-2 text-xs font-medium">
        <Loader2 className="w-5 h-5 animate-spin text-[#5b8045]" />
        Loading Dashboard Overview...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 text-[#1c2819]">
      {/* ── Top Dashboard Title & Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-sans text-[#1c2819] tracking-tight">
            Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3.5 py-2 rounded-xl bg-white border border-[#e2e8df] text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-xs flex items-center gap-1.5 transition cursor-pointer">
            <Download className="w-3.5 h-3.5 text-gray-500" />
            <span>Export Report</span>
          </button>
          <Link
            to="/reservations"
            className="px-4 py-2 rounded-xl bg-[#5b8045] hover:bg-[#4a6b37] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>New Reservation</span>
          </Link>
        </div>
      </div>

      {/* ── 4 Top KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-[#e2e8df] shadow-xs flex flex-col justify-between space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 font-mono">
                    {kpi.title}
                  </span>
                  {kpi.value ? (
                    <div className="text-xl font-extrabold text-[#1c2819] tracking-tight">
                      {kpi.value}
                    </div>
                  ) : null}
                  {kpi.change ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                      {kpi.change}
                    </span>
                  ) : null}
                </div>

                <div className="w-10 h-10 rounded-2xl bg-[#5b8045]/10 text-[#5b8045] flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              {/* Interactive Weekly Reservation Trend Line Chart matching user reference design */}
              {kpi.graphType === 'reservations' ? (
                <div className="pt-2 border-t border-gray-100 space-y-2 relative">
                  <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 font-mono">
                    <span>WEEKLY TREND</span>
                    {hoveredDayIndex !== null && activeResDay ? (
                      <span className="text-[#5b8045] font-extrabold">{activeResDay.day}: {activeResDay.count} Bookings</span>
                    ) : (
                      <span className="text-gray-400 font-normal">Hover column to inspect</span>
                    )}
                  </div>

                  <div
                    className="relative w-full h-24 pt-3 pb-1 overflow-visible"
                    onMouseLeave={() => setHoveredDayIndex(null)}
                  >
                    {/* Sleek Compact Tooltip Callout shown ONLY on hover (Unobstructed & boundary-safe) */}
                    {hoveredDayIndex !== null && activeResDay ? (
                      <div
                        className={`absolute -top-1 z-30 transform ${
                          hoveredDayIndex === 0
                            ? 'translate-x-0'
                            : hoveredDayIndex === weeklyReservationTrend.length - 1
                            ? '-translate-x-full'
                            : '-translate-x-1/2'
                        } bg-[#1c2819] text-white text-[9px] font-bold px-2 py-0.5 rounded-lg shadow-md border border-gray-800 pointer-events-none flex items-center gap-1.5 whitespace-nowrap transition-all duration-150`}
                        style={{ left: `${(activeResDay.x / 280) * 100}%` }}
                      >
                        <span className="text-white font-extrabold">{activeResDay.count} Res</span>
                        <span className="text-[#84ab6d] font-normal">• {activeResDay.fullDate}</span>
                      </div>
                    ) : null}

                    <svg className="w-full h-full overflow-visible" viewBox="0 0 280 110" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="resGreenAreaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#5b8045" stopOpacity="0.32" />
                          <stop offset="100%" stopColor="#5b8045" stopOpacity="0.02" />
                        </linearGradient>
                      </defs>

                      {/* Dotted Y-Axis Grid Lines matching reference image */}
                      {[15, 35, 55, 75, 95].map((yVal, i) => (
                        <line
                          key={i}
                          x1="15"
                          y1={yVal}
                          x2="265"
                          y2={yVal}
                          stroke="#e5e7eb"
                          strokeWidth="1"
                          strokeDasharray="3 3"
                        />
                      ))}

                      {/* Vertical Column Hover Overlay */}
                      {weeklyReservationTrend.map((item, i) =>
                        hoveredDayIndex === i ? (
                          <rect
                            key={i}
                            x={item.x - 14}
                            y="10"
                            width="28"
                            height="85"
                            rx="8"
                            className="fill-[#5b8045]/20 transition-all pointer-events-none"
                          />
                        ) : null
                      )}

                      {/* Area Fill */}
                      <path
                        d="M 20,95 L 20,55 C 40,55 40,70 60,70 C 80,70 80,32 100,32 C 120,32 120,58 140,58 C 160,58 160,46 180,46 C 200,46 200,16 220,16 C 240,16 240,36 260,36 L 260,95 Z"
                        fill="url(#resGreenAreaGrad)"
                        className="pointer-events-none"
                      />

                      {/* Smooth Line Trend Curve */}
                      <path
                        d="M 20,55 C 40,55 40,70 60,70 C 80,70 80,32 100,32 C 120,32 120,58 140,58 C 160,58 160,46 180,46 C 200,46 200,16 220,16 C 240,16 240,36 260,36"
                        fill="none"
                        stroke="#5b8045"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        className="pointer-events-none"
                      />

                      {/* Interactive Data Nodes */}
                      {weeklyReservationTrend.map((item, i) => {
                        const isHovered = hoveredDayIndex === i;
                        return (
                          <circle
                            key={i}
                            cx={item.x}
                            cy={item.y}
                            r={isHovered ? 5.5 : 3.5}
                            fill={isHovered ? '#5b8045' : '#213816'}
                            stroke="#ffffff"
                            strokeWidth="2"
                            className="transition-all duration-150 pointer-events-none"
                          />
                        );
                      })}

                      {/* Full Column Transparent Hitboxes for Smooth Unobstructed Hovering */}
                      {weeklyReservationTrend.map((item, i) => (
                        <rect
                          key={`hitbox-${i}`}
                          x={item.x - 20}
                          y="0"
                          width="40"
                          height="110"
                          fill="transparent"
                          className="cursor-pointer"
                          onMouseEnter={() => setHoveredDayIndex(i)}
                        />
                      ))}
                    </svg>
                  </div>

                  {/* Mo Tu We Th Fr Sa Su Days Row */}
                  <div className="flex items-center justify-between text-[10px] font-bold text-gray-500 font-mono px-2 pt-1">
                    {weeklyReservationTrend.map((item, i) => (
                      <span
                        key={i}
                        className={`cursor-pointer transition-colors ${
                          hoveredDayIndex === i ? 'text-[#5b8045] font-extrabold scale-110' : 'hover:text-gray-900'
                        }`}
                        onMouseEnter={() => setHoveredDayIndex(i)}
                      >
                        {item.day}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Solid Monochrome Green Pie Chart Graph for Card #2 */}
              {kpi.graphType === 'pie' ? (
                <div className="pt-0.5 flex flex-col items-center justify-center space-y-1.5">
                  <div className="relative w-32 h-32 flex items-center justify-center group overflow-visible">
                    <svg className="w-full h-full stroke-none fill-none -rotate-90 overflow-visible" viewBox="0 0 100 100">
                      {/* Background circle */}
                      <circle cx="50" cy="50" r="22.5" className="fill-gray-100" />

                      {/* 1st Slice: Dark Forest Green (#213816) - Menu 58% */}
                      <circle
                        cx="50"
                        cy="50"
                        r="22.5"
                        className="stroke-[#213816] cursor-pointer transition-all duration-200"
                        strokeDasharray="82.00 141.37"
                        strokeDashoffset="0"
                        strokeWidth={hoveredSegmentIndex === 0 ? '48' : '45'}
                        opacity={hoveredSegmentIndex === null || hoveredSegmentIndex === 0 ? 1 : 0.45}
                        fill="none"
                        onMouseEnter={() => setHoveredSegmentIndex(0)}
                        onMouseLeave={() => setHoveredSegmentIndex(null)}
                      />

                      {/* 2nd Slice: Medium Leaf Green (#5b8045) - Home 26% */}
                      <circle
                        cx="50"
                        cy="50"
                        r="22.5"
                        className="stroke-[#5b8045] cursor-pointer transition-all duration-200"
                        strokeDasharray="36.76 141.37"
                        strokeDashoffset="-82.00"
                        strokeWidth={hoveredSegmentIndex === 1 ? '48' : '45'}
                        opacity={hoveredSegmentIndex === null || hoveredSegmentIndex === 1 ? 1 : 0.45}
                        fill="none"
                        onMouseEnter={() => setHoveredSegmentIndex(1)}
                        onMouseLeave={() => setHoveredSegmentIndex(null)}
                      />

                      {/* 3rd Slice: Light Sage Green (#9ec090) - Reservations 16% */}
                      <circle
                        cx="50"
                        cy="50"
                        r="22.5"
                        className="stroke-[#9ec090] cursor-pointer transition-all duration-200"
                        strokeDasharray="22.61 141.37"
                        strokeDashoffset="-118.76"
                        strokeWidth={hoveredSegmentIndex === 2 ? '48' : '45'}
                        opacity={hoveredSegmentIndex === null || hoveredSegmentIndex === 2 ? 1 : 0.45}
                        fill="none"
                        onMouseEnter={() => setHoveredSegmentIndex(2)}
                        onMouseLeave={() => setHoveredSegmentIndex(null)}
                      />
                    </svg>
                  </div>

                  {/* Live Hover Info Badge under Pie Chart */}
                  <div className="flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#f8faf6] border border-[#e2e8df] text-[10px] font-bold text-gray-700 transition-all">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: currentSegment.color }} />
                    <span className="font-mono">{currentSegment.label}</span>
                  </div>
                </div>
              ) : null}

              {/* Interactive Weekly Bar Graph for Card #3 matching user reference image 2 */}
              {kpi.graphType === 'visitors' ? (
                <div className="pt-1 space-y-3">
                  {/* Bar Graph Canvas */}
                  <div
                    className="relative w-full h-32 pt-1 overflow-visible flex flex-col justify-end"
                    onMouseLeave={() => setHoveredVisitorIndex(null)}
                  >
                    {/* 7 Vertical Sharp Bars for M T W T F S S */}
                    <div className="flex items-end justify-between gap-2.5 h-24 w-full px-1">
                      {weeklyVisitorTrend.map((item, i) => {
                        const heightPct = (item.visits / 922) * 100;
                        const isSelected = hoveredVisitorIndex === i || (hoveredVisitorIndex === null && i === 6);

                        return (
                          <div
                            key={i}
                            className="flex-1 flex flex-col items-center h-full justify-end cursor-pointer group"
                            onMouseEnter={() => setHoveredVisitorIndex(i)}
                          >
                            <div
                              className="w-full rounded-none transition-all duration-200"
                              style={{
                                height: `${Math.max(heightPct, 22)}%`,
                                backgroundColor: isSelected ? '#5b8045' : '#e8efe5',
                                transform: isSelected ? 'scaleY(1.04)' : 'scaleY(1)',
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>

                    {/* M T W T F S S Day Labels */}
                    <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 font-mono px-1 pt-2">
                      {weeklyVisitorTrend.map((item, i) => {
                        const isSelected = hoveredVisitorIndex === i || (hoveredVisitorIndex === null && i === 6);
                        return (
                          <span
                            key={i}
                            className={`cursor-pointer transition-colors ${
                              isSelected ? 'text-[#5b8045] font-extrabold scale-110' : 'hover:text-gray-700'
                            }`}
                            onMouseEnter={() => setHoveredVisitorIndex(i)}
                          >
                            {item.day}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Bottom Border Separator & Summary Row matching reference image 2 */}
                  <div className="pt-2.5 border-t border-[#e2e8df] flex items-center justify-between text-xs">
                    <span className="text-gray-500 font-medium">
                      {hoveredVisitorIndex !== null && activeVisitorPoint ? activeVisitorPoint.fullDay : 'This week'}
                    </span>
                    <span className="font-extrabold text-[#1c2819] font-sans text-sm">
                      {hoveredVisitorIndex !== null && activeVisitorPoint
                        ? `${activeVisitorPoint.visits.toLocaleString()} visits`
                        : '3,842 visits'}
                    </span>
                  </div>
                </div>
              ) : null}

              {/* Interactive Ranked Horizontal Progress Bar Graph for Most Pre-Ordered Menu Card #4 (Sharp Edges) */}
              {kpi.graphType === 'preorders' ? (
                <div className="pt-2 border-t border-gray-100 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 font-mono">
                    <span>TOP DISH RANKING</span>
                    <span style={{ color: activePreorder.color }}>{activePreorder.rank} {activePreorder.name.split(' ')[0]}</span>
                  </div>

                  {/* 4 Horizontal Progress Bars with Sharp Edges */}
                  <div className="space-y-1.5 pt-0.5">
                    {preorderDishes.map((item, i) => {
                      const widthPct = (item.orders / 420) * 100;
                      const isHovered = hoveredPreorderIndex === i;
                      const isDefault = hoveredPreorderIndex === null;
                      return (
                        <div
                          key={i}
                          className="space-y-0.5 cursor-pointer group"
                          onMouseEnter={() => setHoveredPreorderIndex(i)}
                          onMouseLeave={() => setHoveredPreorderIndex(null)}
                        >
                          <div className="flex items-center justify-between text-[9px] font-bold font-mono">
                            <span
                              className="truncate max-w-[150px] transition-colors"
                              style={{ color: isHovered ? item.color : '#374151' }}
                            >
                              {item.rank} {item.name}
                            </span>
                            <span style={{ color: item.color }}>{item.orders} ({item.pct})</span>
                          </div>
                          <div className="w-full h-2.5 rounded-none bg-gray-100 overflow-hidden">
                            <div
                              className="h-full rounded-none transition-all duration-200"
                              style={{
                                width: `${widthPct}%`,
                                backgroundColor: item.color,
                                opacity: isHovered || isDefault ? 1 : 0.45,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* ── QUICK ACTIONS BAR ── */}
      <div className="bg-white rounded-2xl p-5 border border-[#e2e8df] shadow-xs space-y-4.5">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-black font-sans">
          QUICK ACTIONS
        </h3>
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/menu"
            className="px-4 py-2 rounded-full bg-[#5b8045] hover:bg-[#4a6b37] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Menu Item</span>
          </Link>
          <Link
            to="/gallery"
            className="px-4 py-2 rounded-full bg-white border border-[#e2e8df] text-xs font-bold text-gray-700 hover:bg-[#f4f7f2] transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-gray-400" />
            <span>Upload Photos</span>
          </Link>
          <Link
            to="/home"
            className="px-4 py-2 rounded-full bg-white border border-[#e2e8df] text-xs font-bold text-gray-700 hover:bg-[#f4f7f2] transition flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-gray-400" />
            <span>Edit Homepage</span>
          </Link>
          <Link
            to="/reservations"
            className="px-4 py-2 rounded-full bg-white border border-[#e2e8df] text-xs font-bold text-gray-700 hover:bg-[#f4f7f2] transition flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <span>View Reservations</span>
          </Link>
        </div>
      </div>

      {/* ── Bottom Grid: Today's Reservations (2/3) & Outlet Branches (1/3) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Reservations Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[#e2e8df] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h2 className="text-base font-bold text-[#1c2819] font-sans">Today's Reservations</h2>
            <Link to="/reservations" className="text-xs font-bold text-[#5b8045] hover:underline flex items-center gap-1">
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase font-mono text-[10px] tracking-wider">
                  <th className="pb-3">GUEST</th>
                  <th className="pb-3">TIME</th>
                  <th className="pb-3">GUESTS</th>
                  <th className="pb-3">BRANCH</th>
                  <th className="pb-3">PRE-ORDERED DISHES</th>
                  <th className="pb-3 text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {todaysReservations.map((res, i) => (
                  <tr key={i} className="hover:bg-[#f8faf6] transition">
                    <td className="py-3">
                      <div className="font-bold text-[#1c2819]">{res.name}</div>
                      <div className="text-[11px] text-gray-400 font-mono">{res.phone}</div>
                    </td>
                    <td className="py-3 font-semibold text-gray-700">{res.time}</td>
                    <td className="py-3 font-bold text-[#1c2819]">{res.guests}</td>
                    <td className="py-3 font-medium text-gray-600">{res.branch}</td>
                    <td className="py-3">
                      {res.preorder && res.preorder.length > 0 ? (
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-[#213816]">
                            <UtensilsCrossed className="w-3.5 h-3.5 text-[#5b8045]" />
                            <span>
                              {res.preorder.reduce((acc, item) => acc + item.qty, 0)}{' '}
                              {res.preorder.reduce((acc, item) => acc + item.qty, 0) === 1 ? 'Dish' : 'Dishes'}
                            </span>
                          </div>
                          <div className="text-[11px] text-gray-500 font-medium truncate max-w-[240px]" title={res.preorder.map((item) => `${item.name} (x${item.qty})`).join(', ')}>
                            {res.preorder.map((item) => `${item.name} (x${item.qty})`).join(', ')}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-[11px] font-mono italic">No pre-orders</span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          res.status === 'Confirmed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {res.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Content Updates Overview */}
        <div className="bg-white rounded-2xl p-6 border border-[#e2e8df] shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="text-base font-bold text-[#1c2819] font-sans">Recent Content Updates</h2>
              <Link to="/pages" className="text-xs font-bold text-[#5b8045] hover:underline flex items-center gap-1">
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3 mt-4 text-xs">
              <div className="p-3 rounded-xl bg-[#f8faf6] border border-[#e2e8df] space-y-1 hover:border-[#5b8045]/40 transition">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-[#1c2819] flex items-center gap-1.5 font-sans">
                    <FileText className="w-3.5 h-3.5 text-[#5b8045]" />
                    <span>Signature Amok Curry</span>
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">12m ago</span>
                </div>
                <p className="text-[11px] text-gray-500 pl-5">Price updated to $12.50 & photo refreshed</p>
                <div className="pl-5 pt-0.5 flex items-center gap-2">
                  <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                    Menu Page
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">• Published</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#f8faf6] border border-[#e2e8df] space-y-1 hover:border-[#5b8045]/40 transition">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-[#1c2819] flex items-center gap-1.5 font-sans">
                    <FileText className="w-3.5 h-3.5 text-[#5b8045]" />
                    <span>Hero Promotion Banner</span>
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">1h ago</span>
                </div>
                <p className="text-[11px] text-gray-500 pl-5">Added Water Festival Special Menu promo</p>
                <div className="pl-5 pt-0.5 flex items-center gap-2">
                  <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                    Homepage
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">• Published</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#f8faf6] border border-[#e2e8df] space-y-1 hover:border-[#5b8045]/40 transition">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-[#1c2819] flex items-center gap-1.5 font-sans">
                    <FileText className="w-3.5 h-3.5 text-[#5b8045]" />
                    <span>Fine Dining Gallery Album</span>
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">3h ago</span>
                </div>
                <p className="text-[11px] text-gray-500 pl-5">Uploaded 6 high-res interior photos</p>
                <div className="pl-5 pt-0.5 flex items-center gap-2">
                  <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                    Gallery Page
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">• Published</span>
                </div>
              </div>
            </div>
          </div>

          <Link
            to="/pages"
            className="w-full py-2.5 rounded-xl bg-[#5b8045] hover:bg-[#4a6b37] text-white text-xs font-bold text-center shadow-xs transition block mt-4"
          >
            Manage Website Pages & Content
          </Link>
        </div>
      </div>
    </div>
  );
};




