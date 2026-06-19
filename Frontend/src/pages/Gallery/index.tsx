import React, { useEffect, useState } from 'react';
import { getGalleryData } from '@/lib/api';

type GalleryImage = {
  src: string;
  alt: string;
};

type GalleryData = {
  header: {
    title: string;
    desc: string;
  };
  overlayText: string;
  images: GalleryImage[];
};

export default function Gallery() {
  const [data, setData] = useState<GalleryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getGalleryData()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load gallery data.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="pt-28 pb-20 text-center text-olive font-serif text-xl">
        Loading gallery...
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

  const { header, overlayText, images } = data;

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold font-serif text-dark-green mb-4">{header.title}</h1>
        <p className="text-olive">
          {header.desc}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((img, i) => (
          <div key={i} className="group relative overflow-hidden rounded-lg aspect-square shadow-md hover:shadow-xl transition-all duration-300">
            <img src={img.src} alt={img.alt || `Gallery item ${i + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-dark-green/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
              <span className="text-white font-serif tracking-widest text-lg border-b border-gold pb-1 uppercase">{overlayText}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
