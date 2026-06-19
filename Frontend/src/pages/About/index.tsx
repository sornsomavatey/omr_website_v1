import React, { useEffect, useState } from 'react';
import { getAboutData } from '@/lib/api';

type AboutData = {
  header: {
    title: string;
    subtitle: string;
  };
  paragraphs: string[];
  teamImage: {
    src: string;
    alt: string;
  };
  mission: {
    title: string;
    desc: string;
  };
};

export default function About() {
  const [data, setData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAboutData()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load about data.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="pt-28 pb-20 text-center text-olive font-serif text-xl">
        Loading story...
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

  const { header, paragraphs, teamImage, mission } = data;

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold font-serif text-dark-green mb-4">{header.title}</h1>
        <p className="text-gold font-serif italic text-lg mb-8">{header.subtitle}</p>
        <div className="text-olive/90 space-y-6 text-left leading-relaxed">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-16 items-center">
        <img
          src={teamImage.src}
          alt={teamImage.alt}
          className="rounded-lg shadow-lg aspect-4/3 object-cover"
        />
        <div className="space-y-4">
          <h3 className="text-2xl font-bold font-serif text-dark-green">{mission.title}</h3>
          <p className="text-olive text-sm leading-relaxed">
            {mission.desc}
          </p>
        </div>
      </div>
    </div>
  );
}
