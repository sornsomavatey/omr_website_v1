import React from 'react';

export default function Reservations() {
  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold font-serif text-dark-green mb-4">Book Your Table</h1>
        <p className="text-olive">
          Experience authentic Khmer cuisine in an elegant and serene atmosphere. Book your table online for quick seating.
        </p>
      </div>

      <div className="max-w-xl mx-auto bg-white p-8 rounded-lg border border-gold/15 shadow-xl">
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-dark-green uppercase tracking-wider mb-2">First Name</label>
              <input type="text" className="w-full border border-gold/20 rounded-md py-2 px-3 focus:outline-none focus:border-gold" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-dark-green uppercase tracking-wider mb-2">Last Name</label>
              <input type="text" className="w-full border border-gold/20 rounded-md py-2 px-3 focus:outline-none focus:border-gold" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-dark-green uppercase tracking-wider mb-2">Date</label>
              <input type="date" className="w-full border border-gold/20 rounded-md py-2 px-3 focus:outline-none focus:border-gold" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-dark-green uppercase tracking-wider mb-2">Time</label>
              <input type="time" className="w-full border border-gold/20 rounded-md py-2 px-3 focus:outline-none focus:border-gold" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-dark-green uppercase tracking-wider mb-2">Guests</label>
              <select className="w-full border border-gold/20 rounded-md py-2 px-3 focus:outline-none focus:border-gold">
                <option>1 Guest</option>
                <option selected>2 Guests</option>
                <option>3 Guests</option>
                <option>4 Guests</option>
                <option>5+ Guests</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-dark-green uppercase tracking-wider mb-2">Occasion</label>
              <select className="w-full border border-gold/20 rounded-md py-2 px-3 focus:outline-none focus:border-gold">
                <option>Dinner</option>
                <option>Lunch</option>
                <option>Birthday</option>
                <option>Anniversary</option>
                <option>Business Meeting</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-dark-green uppercase tracking-wider mb-2">Special Request</label>
            <textarea rows={3} className="w-full border border-gold/20 rounded-md py-2 px-3 focus:outline-none focus:border-gold" placeholder="Any dietary restrictions or seating preferences?"></textarea>
          </div>

          <button type="submit" className="w-full bg-gold hover:bg-gold-hover text-dark-green font-bold uppercase tracking-wider py-3 rounded-md transition-all duration-300">
            Confirm Reservation
          </button>
        </form>
      </div>
    </div>
  );
}
