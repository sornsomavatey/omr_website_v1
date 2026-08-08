import React, { useState } from 'react';
import {
  Calendar,
  Search,
  Filter,
  Plus,
  Download,
  UtensilsCrossed,
  CheckCircle,
  Clock,
  XCircle,
  Phone,
  User,
  MapPin,
  FileText,
  ChevronDown,
  Trash2,
  Edit,
  Eye,
  Check,
  Sparkles,
  PartyPopper,
  Mail,
  AlertTriangle,
} from 'lucide-react';
import './index.css';

export type BookingType = 'Table Booking' | 'Event Booking';
export type MealType = 'Breakfast' | 'Lunch' | 'Dinner';

export interface PreOrderItem {
  name: string;
  qty: number;
  price?: number;
}

export interface Reservation {
  id: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  branch: string;
  bookingType: BookingType;
  eventType?: string;
  tableType: string;
  preorder: PreOrderItem[] | null;
  specialRequest: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  mealType?: MealType;
  cancellationReason?: string;
}

export const getMealType = (res: { time?: string; mealType?: MealType }): MealType => {
  if (res.mealType) return res.mealType;
  if (!res.time) return 'Dinner';

  const cleanTime = res.time.trim().toUpperCase();

  // Try 12-hour format e.g. "7:00 PM", "11:30 AM", "12:00 PM", "8:30 AM"
  const match12 = cleanTime.match(/^(\d{1,2}):?(\d{2})?\s*(AM|PM)$/);
  if (match12) {
    let hour = parseInt(match12[1], 10);
    const minute = match12[2] ? parseInt(match12[2], 10) : 0;
    const period = match12[3];

    if (period === 'PM' && hour < 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;

    const mins = hour * 60 + minute;
    if (mins >= 360 && mins < 660) return 'Breakfast';
    if (mins >= 660 && mins < 960) return 'Lunch';
    return 'Dinner';
  }

  // Try 24-hour format e.g. "19:00", "08:30"
  const match24 = cleanTime.match(/^(\d{1,2}):(\d{2})$/);
  if (match24) {
    const hour = parseInt(match24[1], 10);
    const minute = parseInt(match24[2], 10);
    const mins = hour * 60 + minute;
    if (mins >= 360 && mins < 660) return 'Breakfast';
    if (mins >= 660 && mins < 960) return 'Lunch';
    return 'Dinner';
  }

  if (cleanTime.includes('AM')) return 'Breakfast';
  if (cleanTime.includes('LUNCH')) return 'Lunch';
  return 'Dinner';
};

const initialReservations: Reservation[] = [
  {
    id: 'RES-8091',
    name: 'Sophea Meas',
    phone: '+855 12 345 678',
    email: 'sophea.m@gmail.com',
    date: '2026-08-07',
    time: '7:00 PM',
    guests: 4,
    branch: 'Boeung Kak',
    bookingType: 'Table Booking',
    tableType: 'VIP Indoor Room',
    preorder: [
      { name: 'Signature Amok Curry', qty: 2, price: 6.50 },
      { name: 'Wagyu Beef Lok Lak', qty: 1, price: 8.50 },
    ],
    specialRequest: 'Birthday celebration setup required',
    status: 'Confirmed',
    mealType: 'Dinner',
  },
  {
    id: 'RES-8092',
    name: 'Dara Chhan',
    phone: '+855 17 876 543',
    email: 'dara.chhan@outlook.com',
    date: '2026-08-07',
    time: '7:30 PM',
    guests: 25,
    branch: 'Toul Kork',
    bookingType: 'Event Booking',
    eventType: 'Corporate Dinner Party',
    tableType: 'Private Banquet Hall',
    preorder: null,
    specialRequest: 'Projector & microphone setup needed',
    status: 'Pending',
    mealType: 'Dinner',
  },
  {
    id: 'RES-8093',
    name: 'Vannak Ken',
    phone: '+855 92 112 334',
    email: 'v.ken@business.kh',
    date: '2026-08-07',
    time: '12:30 PM',
    guests: 6,
    branch: 'Boeung Kak',
    bookingType: 'Table Booking',
    tableType: 'Main Dining Indoor',
    preorder: [
      { name: 'Khmer Fried Rice', qty: 3, price: 5.50 },
      { name: 'Mango Sticky Rice', qty: 2, price: 4.50 },
    ],
    specialRequest: 'Need high chair for toddler',
    status: 'Confirmed',
    mealType: 'Lunch',
  },
  {
    id: 'RES-8094',
    name: 'Bopha Roth',
    phone: '+855 88 901 223',
    email: 'bopha.roth@yahoo.com',
    date: '2026-08-07',
    time: '8:30 AM',
    guests: 4,
    branch: 'Toul Kork',
    bookingType: 'Table Booking',
    tableType: 'Garden Outdoor Terrace',
    preorder: [
      { name: 'Khmer Noodle Soup', qty: 4, price: 4.50 },
    ],
    specialRequest: 'Anniversary & stage floral arrangement',
    status: 'Confirmed',
    mealType: 'Breakfast',
  },
  {
    id: 'RES-8095',
    name: 'Rithy Sok',
    phone: '+855 98 445 112',
    email: 'rithysok@khmer.com',
    date: '2026-08-08',
    time: '6:30 PM',
    guests: 5,
    branch: 'Boeung Kak',
    bookingType: 'Table Booking',
    tableType: 'Main Dining Outdoor',
    preorder: [
      { name: 'Fish Amok', qty: 2, price: 6.50 },
      { name: 'Beef Saraman Curry', qty: 2, price: 9.50 },
    ],
    specialRequest: '',
    status: 'Confirmed',
    mealType: 'Dinner',
  },
  {
    id: 'RES-8096',
    name: 'Chan Sreypov',
    phone: '+855 10 556 778',
    email: 'sreypov.chan@gmail.com',
    date: '2026-08-08',
    time: '7:15 PM',
    guests: 18,
    branch: 'Toul Kork',
    bookingType: 'Event Booking',
    eventType: 'Private Birthday Bash',
    tableType: 'VIP Private Lounge',
    preorder: null,
    specialRequest: 'Custom cake table setup near window',
    status: 'Pending',
    mealType: 'Dinner',
  },
];

export const ReservationsEditor: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newRes, setNewRes] = useState({
    name: '',
    phone: '',
    email: '',
    date: '2026-08-07',
    time: '7:00 PM',
    guests: 2,
    branch: 'Boeung Kak',
    bookingType: 'Table Booking' as BookingType,
    eventType: '',
    tableType: 'Main Dining Indoor',
    specialRequest: '',
  });

  const [cancellingResId, setCancellingResId] = useState<string | null>(null);
  const [cancelReasonInput, setCancelReasonInput] = useState('');

  const handleStatusChange = (id: string, newStatus: 'Confirmed' | 'Pending' | 'Cancelled') => {
    if (newStatus === 'Cancelled') {
      setCancellingResId(id);
      setCancelReasonInput('');
      return;
    }
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  const confirmCancellation = () => {
    if (!cancellingResId) return;
    const reason = cancelReasonInput.trim();
    if (!reason) return; // Strict requirement: reason must be specified!

    setReservations((prev) =>
      prev.map((r) =>
        r.id === cancellingResId
          ? { ...r, status: 'Cancelled', cancellationReason: reason }
          : r
      )
    );
    if (selectedRes && selectedRes.id === cancellingResId) {
      setSelectedRes((prev) =>
        prev ? { ...prev, status: 'Cancelled', cancellationReason: reason } : null
      );
    }
    setCancellingResId(null);
    setCancelReasonInput('');
  };

  const handleAddReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRes.name || !newRes.phone) return;

    const created: Reservation = {
      id: `RES-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newRes.name,
      phone: newRes.phone,
      email: newRes.email || `${newRes.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      date: newRes.date,
      time: newRes.time,
      guests: Number(newRes.guests),
      branch: newRes.branch,
      bookingType: newRes.bookingType,
      eventType: newRes.bookingType === 'Event Booking' ? (newRes.eventType || 'Private Event') : undefined,
      tableType: newRes.tableType,
      preorder: null,
      specialRequest: newRes.specialRequest,
      status: 'Confirmed',
    };

    setReservations([created, ...reservations]);
    setShowAddModal(false);
    setNewRes({
      name: '',
      phone: '',
      email: '',
      date: '2026-08-07',
      time: '7:00 PM',
      guests: 2,
      branch: 'Boeung Kak',
      bookingType: 'Table Booking',
      eventType: '',
      tableType: 'Main Dining Indoor',
      specialRequest: '',
    });
  };

  const filteredReservations = reservations.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.phone.includes(searchTerm) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.eventType && r.eventType.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesBranch = selectedBranch === 'All' || r.branch === selectedBranch;
    const matchesType =
      selectedType === 'All' ||
      (selectedType === 'Table Booking' && r.bookingType === 'Table Booking') ||
      (selectedType === 'Event Booking' && r.bookingType === 'Event Booking');
    const matchesStatus = selectedStatus === 'All' || r.status === selectedStatus;

    return matchesSearch && matchesBranch && matchesType && matchesStatus;
  });

  const totalBookings = reservations.length;
  const tableBookingsCount = reservations.filter((r) => r.bookingType === 'Table Booking').length;
  const eventBookingsCount = reservations.filter((r) => r.bookingType === 'Event Booking').length;
  const confirmedBookings = reservations.filter((r) => r.status === 'Confirmed').length;
  const pendingBookings = reservations.filter((r) => r.status === 'Pending').length;

  return (
    <div className="max-w-7xl mx-auto space-y-6 text-[#1c2819] reservations-page-container">
      {/* ── Top Header Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-sans text-[#1c2819] tracking-tight flex items-center gap-2.5">
            <Calendar className="w-7 h-7 text-black shrink-0" />
            <span>Reservations Management</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1 font-medium">
            Manage table reservations, private event inquiries, and booking status for all branches.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3.5 py-2 rounded-xl bg-white border border-[#e2e8df] text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-xs flex items-center gap-1.5 transition cursor-pointer">
            <Download className="w-3.5 h-3.5 text-gray-500" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-[#5b8045] hover:bg-[#4a6b37] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Reservation</span>
          </button>
        </div>
      </div>

      {/* ── KPI Summary Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-[#d6e0d0] shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-black font-mono">TOTAL BOOKINGS</span>
            <div className="text-xl font-extrabold text-[#1c2819]">{totalBookings}</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-[#5b8045]/10 text-[#5b8045] flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
        </div>

        {/* Table Bookings KPI */}
        <div className="bg-white rounded-2xl p-4 border border-[#d6e0d0] shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 font-mono">TABLE BOOKINGS</span>
            <div className="text-xl font-extrabold text-blue-900">{tableBookingsCount}</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <UtensilsCrossed className="w-4 h-4" />
          </div>
        </div>

        {/* Event Bookings KPI */}
        <div className="bg-white rounded-2xl p-4 border border-[#d6e0d0] shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5b8045] font-mono">EVENT BOOKINGS</span>
            <div className="text-xl font-extrabold text-[#213816]">{eventBookingsCount}</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-[#5b8045]/10 text-[#5b8045] flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#d6e0d0] shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-black font-mono">CONFIRMED</span>
            <div className="text-xl font-extrabold text-[#1c2819]">{confirmedBookings}</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#d6e0d0] shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-black font-mono">PENDING</span>
            <div className="text-xl font-extrabold text-[#1c2819]">{pendingBookings}</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="bg-white rounded-2xl p-4 border border-[#d6e0d0] shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by guest, phone, event, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#f8faf6] border border-[#e2e8df] text-xs font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#5b8045]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Booking Type Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-gray-400 font-bold font-mono text-[10px] uppercase">TYPE:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#f8faf6] border border-[#e2e8df] text-xs font-bold text-gray-700 focus:outline-none focus:border-[#5b8045]"
            >
              <option value="All">All Booking Types</option>
              <option value="Table Booking">Table Bookings</option>
              <option value="Event Booking">Event Bookings</option>
            </select>
          </div>

          {/* Branch Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-gray-400 font-bold font-mono text-[10px] uppercase">BRANCH:</span>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#f8faf6] border border-[#e2e8df] text-xs font-bold text-gray-700 focus:outline-none focus:border-[#5b8045]"
            >
              <option value="All">All Branches</option>
              <option value="Boeung Kak">Boeung Kak</option>
              <option value="Toul Kork">Toul Kork</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-gray-400 font-bold font-mono text-[10px] uppercase">STATUS:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#f8faf6] border border-[#e2e8df] text-xs font-bold text-gray-700 focus:outline-none focus:border-[#5b8045]"
            >
              <option value="All">All Status</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Reservations Table ── */}
      <div className="bg-white rounded-2xl border border-[#d6e0d0] shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f4f7f2] border-b border-[#e2e8df] text-gray-500 font-bold uppercase font-mono text-[10px] tracking-wider">
                <th className="py-3 px-4">RES ID</th>
                <th className="py-3 px-4">BOOKING TYPE</th>
                <th className="py-3 px-4">GUEST</th>
                <th className="py-3 px-4">DATE & TIME</th>
                <th className="py-3 px-4 text-center">GUESTS</th>
                <th className="py-3 px-4">BRANCH</th>
                <th className="py-3 px-4">PRE-ORDERS</th>
                <th className="py-3 px-4 text-center">STATUS</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf2ea]">
              {filteredReservations.map((res) => (
                <tr key={res.id} className="hover:bg-[#f4f7f2]/60 transition-colors">
                  {/* RES ID */}
                  <td className="py-4 px-4 align-middle font-bold font-mono text-gray-500 whitespace-nowrap">
                    {res.id}
                  </td>
                  
                  {/* BOOKING TYPE */}
                  <td className="py-4 px-4 align-middle">
                    {res.bookingType === 'Event Booking' ? (
                      <div className="inline-flex flex-col">
                        <span className="inline-flex items-center justify-center w-[110px] py-1 rounded-lg text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs whitespace-nowrap text-center">
                          <span>Event Booking</span>
                        </span>
                        {res.eventType && (
                          <span className="text-[10px] font-bold text-emerald-800 mt-0.5 pl-0.5 truncate max-w-[110px]" title={res.eventType}>
                            {res.eventType}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="inline-flex items-center justify-center w-[110px] py-1 rounded-lg text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs whitespace-nowrap text-center">
                        <span>Table Booking</span>
                      </span>
                    )}
                  </td>

                  {/* GUEST */}
                  <td className="py-4 px-4 align-middle">
                    <div className="font-bold text-[#1c2819]">{res.name}</div>
                    <a
                      href={`tel:${res.phone.replace(/[^+\d]/g, '')}`}
                      className="inline-flex items-center gap-1 text-[11px] text-[#5b8045] hover:text-[#4a6b37] hover:underline font-mono font-semibold whitespace-nowrap"
                      title={`Click to call ${res.name}`}
                    >
                      <Phone className="w-3 h-3 text-[#5b8045]" />
                      <span>{res.phone}</span>
                    </a>
                  </td>

                  {/* DATE & TIME */}
                  <td className="py-4 px-4 align-middle whitespace-nowrap">
                    <div className="font-bold text-gray-800">{res.time}</div>
                    <div className="text-[11px] text-gray-400 font-mono">{res.date}</div>
                  </td>

                  {/* GUESTS */}
                  <td className="py-4 px-4 align-middle text-center font-extrabold text-[#1c2819] font-mono text-xs">
                    {res.guests}
                  </td>

                  {/* BRANCH */}
                  <td className="py-4 px-4 align-middle whitespace-nowrap font-medium text-gray-700">
                    {res.branch}
                  </td>

                  {/* PRE-ORDERS */}
                  <td className="py-4 px-4 align-middle">
                    {res.preorder && res.preorder.length > 0 ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#1c2819] whitespace-nowrap">
                            {res.preorder.reduce((acc, item) => acc + item.qty, 0)} Dishes
                          </span>
                          <span className="text-[11px] font-mono font-extrabold px-2 py-0.5 rounded-md bg-[#7a1c1c]/10 text-[#7a1c1c] border border-[#7a1c1c]/25 whitespace-nowrap">
                            ${res.preorder.reduce((sum, item) => sum + (item.price || 0) * item.qty, 0).toFixed(2)}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-500 font-medium truncate max-w-[200px]" title={res.preorder.map((item) => `${item.name} (x${item.qty})`).join(', ')}>
                          {res.preorder.map((item) => `${item.name} (x${item.qty})`).join(', ')}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-[11px] font-mono italic whitespace-nowrap">No pre-orders</span>
                    )}
                  </td>

                  {/* STATUS */}
                  <td className="py-4 px-4 align-middle text-center">
                    <select
                      value={res.status}
                      onChange={(e) => handleStatusChange(res.id, e.target.value as 'Confirmed' | 'Pending' | 'Cancelled')}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-bold border cursor-pointer focus:outline-none transition-colors appearance-none pr-5.5 bg-no-repeat bg-[right_0.5rem_center] shadow-2xs ${
                        res.status === 'Confirmed'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : res.status === 'Pending'
                          ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                          : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                      }`}
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23374151'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                        backgroundSize: '0.65rem',
                      }}
                    >
                      <option value="Confirmed" className="bg-white text-emerald-800 font-semibold">Confirmed</option>
                      <option value="Pending" className="bg-white text-amber-800 font-semibold">Pending</option>
                      <option value="Cancelled" className="bg-white text-rose-800 font-semibold">Cancelled</option>
                    </select>
                  </td>

                  {/* ACTIONS */}
                  <td className="py-4 px-4 align-middle text-right">
                    <button
                      onClick={() => setSelectedRes(res)}
                      className="p-1.5 rounded-lg border border-[#e2e8df] hover:bg-[#5b8045]/10 hover:border-[#5b8045]/30 text-gray-600 hover:text-[#5b8045] transition"
                      title="View details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── View Details Modal ── */}
      {selectedRes && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-4 border border-[#e2e8df] shadow-xl text-[#1c2819]">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-bold font-mono text-gray-400">{selectedRes.id}</span>
                <h3 className="text-lg font-bold text-[#1c2819]">{selectedRes.name}</h3>
              </div>
              <button
                onClick={() => setSelectedRes(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Type Header Banner in Modal */}
            {selectedRes.bookingType === 'Event Booking' ? (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#5b8045] text-white shadow-2xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#4a6b37] font-mono">EVENT BOOKING</span>
                    <h4 className="text-xs font-bold text-[#1c2819]">
                      {selectedRes.eventType || 'Private Event Reservation'}
                    </h4>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                  Event
                </span>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-blue-600 text-white shadow-2xs">
                    <UtensilsCrossed className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 font-mono">TABLE BOOKING</span>
                    <h4 className="text-xs font-bold text-blue-950">Standard Table Reservation</h4>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold shadow-2xs ${
                  getMealType(selectedRes) === 'Breakfast'
                    ? 'bg-amber-200 text-amber-900 border border-amber-300'
                    : getMealType(selectedRes) === 'Lunch'
                    ? 'bg-sky-200 text-sky-900 border border-sky-300'
                    : 'bg-blue-200 text-blue-900 border border-blue-300'
                }`}>
                  {getMealType(selectedRes)}
                </span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#f8faf6] border border-[#e2e8df]">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 font-mono">PHONE</span>
                  <div>
                    <a
                      href={`tel:${selectedRes.phone.replace(/[^+\d]/g, '')}`}
                      className="inline-flex items-center gap-1.5 font-bold text-[#5b8045] hover:text-[#4a6b37] hover:underline"
                      title={`Click to call ${selectedRes.phone}`}
                    >
                      <Phone className="w-3.5 h-3.5 text-[#5b8045]" />
                      <span>{selectedRes.phone}</span>
                    </a>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 font-mono">EMAIL</span>
                  <div className="truncate">
                    <a
                      href={`mailto:${selectedRes.email}`}
                      className="inline-flex items-center gap-1.5 font-bold text-[#5b8045] hover:text-[#4a6b37] hover:underline truncate max-w-full"
                      title={`Click to send email to ${selectedRes.email}`}
                    >
                      <Mail className="w-3.5 h-3.5 text-[#5b8045] shrink-0" />
                      <span className="truncate">{selectedRes.email}</span>
                    </a>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 font-mono">DATE & TIME</span>
                  <div className="font-semibold text-gray-800">{selectedRes.date} at {selectedRes.time}</div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 font-mono">BRANCH & AREA</span>
                  <div className="font-semibold text-gray-800">{selectedRes.branch} ({selectedRes.tableType})</div>
                </div>
              </div>

              {selectedRes.preorder && selectedRes.preorder.length > 0 && (
                <div className="p-3.5 rounded-xl bg-[#f4f7f2] border border-[#d6e2d1] space-y-2">
                  <div className="flex items-center justify-between font-bold text-[#213816] pb-2 border-b border-[#d6e2d1]/80">
                    <div className="text-xs">
                      <span>Pre-ordered Dishes</span>
                    </div>
                    <div className="text-xs font-extrabold text-[#7a1c1c] font-mono bg-[#7a1c1c]/10 px-2.5 py-0.5 rounded-lg border border-[#7a1c1c]/25 shadow-2xs">
                      Total: USD ${selectedRes.preorder.reduce((sum, item) => sum + (item.price || 0) * item.qty, 0).toFixed(2)}
                    </div>
                  </div>
                  <ul className="space-y-1.5 text-xs">
                    {selectedRes.preorder.map((item, idx) => {
                      const itemTotal = (item.price || 0) * item.qty;
                      return (
                        <li key={idx} className="flex items-center justify-between text-gray-800">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#5b8045]" />
                            <span className="font-bold text-[#1c2819]">{item.name}</span>
                            <span className="text-[11px] text-gray-500 font-mono">x{item.qty}</span>
                          </div>
                          <div className="font-mono text-xs font-bold text-gray-800">
                            USD ${itemTotal.toFixed(2)}
                            {item.price && item.qty > 1 && (
                              <span className="text-[10px] text-gray-400 font-normal ml-1">
                                (${item.price.toFixed(2)} ea)
                              </span>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {selectedRes.specialRequest && (
                <div>
                  <span className="text-[10px] font-bold text-gray-400 font-mono">SPECIAL REQUEST / EVENT DETAILS</span>
                  <p className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 italic mt-1">
                    "{selectedRes.specialRequest}"
                  </p>
                </div>
              )}

              {selectedRes.cancellationReason && (
                <div>
                  <span className="text-[10px] font-bold text-rose-500 font-mono uppercase">CANCELLATION REASON</span>
                  <p className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs mt-1 font-medium">
                    "{selectedRes.cancellationReason}"
                  </p>
                </div>
              )}

              <div>
                <span className="text-[10px] font-bold text-gray-400 font-mono uppercase">UPDATE STATUS</span>
                <div className="flex gap-2 mt-1">
                  {(['Confirmed', 'Pending', 'Cancelled'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        if (st === 'Cancelled') {
                          handleStatusChange(selectedRes.id, 'Cancelled');
                        } else {
                          handleStatusChange(selectedRes.id, st);
                          setSelectedRes({ ...selectedRes, status: st });
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                        selectedRes.status === st
                          ? st === 'Cancelled'
                            ? 'bg-rose-600 text-white border-rose-600'
                            : 'bg-[#5b8045] text-white border-[#5b8045]'
                          : 'bg-white border-[#e2e8df] text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedRes(null)}
                className="px-4 py-2 rounded-xl bg-[#5b8045] text-white font-bold text-xs hover:bg-[#4a6b37]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Cancellation Reason Modal ── */}
      {cancellingResId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 border border-rose-100 shadow-2xl text-[#1c2819]">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2 text-rose-600">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="text-base font-bold text-[#1c2819]">Cancellation Reason</h3>
              </div>
              <button
                type="button"
                onClick={() => setCancellingResId(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-600 font-medium">
              Please specify the reason for cancelling reservation{' '}
              <span className="font-bold text-gray-900">{cancellingResId}</span> before confirming.
            </p>

            {/* Quick Reasons Chips */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono">QUICK REASONS:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Guest requested cancellation',
                  'Fully booked / No table capacity',
                  'Guest no-show',
                  'Duplicate reservation',
                  'Emergency / Unforeseen closure',
                ].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setCancelReasonInput(preset)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                      cancelReasonInput === preset
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'bg-rose-50/60 text-rose-800 border-rose-200 hover:bg-rose-100'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 font-mono mb-1">
                CANCELLATION DETAILS / NOTES
              </label>
              <textarea
                rows={3}
                value={cancelReasonInput}
                onChange={(e) => setCancelReasonInput(e.target.value)}
                placeholder="Type cancellation reason here..."
                className="w-full p-3 rounded-xl border border-gray-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-xs outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setCancellingResId(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200 transition cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={confirmCancellation}
                disabled={!cancelReasonInput.trim()}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 disabled:opacity-50 transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-rose-600/20"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add New Reservation Modal ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <form onSubmit={handleAddReservation} className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 border border-[#e2e8df] shadow-xl text-[#1c2819]">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-[#1c2819]">New Manual Reservation</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Select Reservation Type */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Reservation Category *</label>
                <select
                  value={newRes.bookingType}
                  onChange={(e) => setNewRes({ ...newRes, bookingType: e.target.value as BookingType })}
                  className="w-full px-3 py-2 rounded-xl bg-[#f8faf6] border border-[#e2e8df] font-bold text-[#1c2819] focus:outline-none focus:border-[#5b8045]"
                >
                  <option value="Table Booking">Table Booking (Dining)</option>
                  <option value="Event Booking">Event Booking (Catering / Hall)</option>
                </select>
              </div>

              {/* Event Name/Type input if Event Booking */}
              {newRes.bookingType === 'Event Booking' && (
                <div>
                  <label className="block font-bold text-purple-800 mb-1">Event Type / Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Corporate Gala, Birthday Party, Wedding Reception"
                    value={newRes.eventType}
                    onChange={(e) => setNewRes({ ...newRes, eventType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-purple-50/50 border border-purple-200 text-purple-900 focus:outline-none focus:border-purple-500 font-medium"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-gray-700 mb-1">Guest Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sophea Meas"
                  value={newRes.name}
                  onChange={(e) => setNewRes({ ...newRes, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#f8faf6] border border-[#e2e8df] focus:outline-none focus:border-[#5b8045]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="+855 12 345 678"
                    value={newRes.phone}
                    onChange={(e) => setNewRes({ ...newRes, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#f8faf6] border border-[#e2e8df] focus:outline-none focus:border-[#5b8045]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Guests Count *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newRes.guests}
                    onChange={(e) => setNewRes({ ...newRes, guests: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#f8faf6] border border-[#e2e8df] focus:outline-none focus:border-[#5b8045]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Branch *</label>
                  <select
                    value={newRes.branch}
                    onChange={(e) => setNewRes({ ...newRes, branch: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#f8faf6] border border-[#e2e8df] focus:outline-none focus:border-[#5b8045]"
                  >
                    <option value="Boeung Kak">Boeung Kak</option>
                    <option value="Toul Kork">Toul Kork</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Time *</label>
                  <input
                    type="text"
                    required
                    value={newRes.time}
                    onChange={(e) => setNewRes({ ...newRes, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#f8faf6] border border-[#e2e8df] focus:outline-none focus:border-[#5b8045]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Special Request / Event Notes</label>
                <textarea
                  rows={2}
                  placeholder="Optional notes or requests..."
                  value={newRes.specialRequest}
                  onChange={(e) => setNewRes({ ...newRes, specialRequest: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#f8faf6] border border-[#e2e8df] focus:outline-none focus:border-[#5b8045]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold text-xs hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#5b8045] text-white font-bold text-xs hover:bg-[#4a6b37]"
              >
                Create Reservation
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
