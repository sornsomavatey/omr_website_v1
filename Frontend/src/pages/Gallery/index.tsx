import React from 'react';

export default function Gallery() {
  const images = [
    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&q=80&w=800',
  ];

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold font-serif text-dark-green mb-4">Our Gallery</h1>
        <p className="text-olive">
          Take a visual journey through the elegant spaces, fine dining setups, cooking workshops, and exquisite Khmer dishes of One More Restaurant.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((img, i) => (
          <div key={i} className="group relative overflow-hidden rounded-lg aspect-square shadow-md hover:shadow-xl transition-all duration-300">
            <img src={img} alt={`Gallery item ${i + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-dark-green/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
              <span className="text-white font-serif tracking-widest text-lg border-b border-gold pb-1 uppercase">OMR Moments</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
