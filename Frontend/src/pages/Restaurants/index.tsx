import React, { useEffect, useState } from 'react';
import { Phone, MapPin, Clock } from 'lucide-react';
import { getRestaurantsData } from '@/lib/api';

type LocationItem = {
  name: string;
  address: string;
  phone: string;
  hours: string;
  image: string;
};

type RestaurantsData = {
  header: {
    title: string;
    desc: string;
  };
  locations: LocationItem[];
};

export default function Restaurants() {
  const [data, setData] = useState<RestaurantsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getRestaurantsData()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load locations.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="pt-28 pb-20 text-center text-olive font-serif text-xl">
        Loading locations...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="pt-28 pb-20 text-center text-red-500 font-serif text-xl">
        {error || 'No data available.'}
      </div>
    );
  }

  const { header, locations } = data;

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold font-serif text-dark-green mb-4">{header.title}</h1>
        <p className="text-olive">
          {header.desc}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {locations.map((loc) => (
          <div key={loc.name} className="border border-gold/15 bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all">
            <div className="h-64 overflow-hidden relative">
              <img src={loc.image} alt={loc.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold font-serif text-dark-green mb-4">{loc.name}</h3>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-gold shrink-0 mt-1" />
                  <span className="text-sm text-olive/90">{loc.address}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={18} className="text-gold shrink-0" />
                  <span className="text-sm text-olive/90">{loc.phone}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Clock size={18} className="text-gold shrink-0" />
                  <span className="text-sm text-olive/90">{loc.hours}</span>
                </li>
              </ul>
              <div className="grid grid-cols-2 gap-4">
                <button className="bg-gold hover:bg-gold-hover text-dark-green font-bold text-sm tracking-wider uppercase py-2 px-4 rounded text-center transition-colors">
                  Contact
                </button>
                <button className="border border-gold hover:bg-gold/10 text-dark-green font-bold text-sm tracking-wider uppercase py-2 px-4 rounded text-center transition-colors">
                  View Map
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
