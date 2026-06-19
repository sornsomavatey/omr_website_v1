import React, { useEffect, useState } from 'react';
import { getCareersData } from '@/lib/api';

type Job = {
  title: string;
  type: string;
  desc: string;
};

type CareersData = {
  header: {
    title: string;
    desc: string;
  };
  jobs: Job[];
};

export default function Careers() {
  const [data, setData] = useState<CareersData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCareersData()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load careers data.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="pt-28 pb-20 text-center text-olive font-serif text-xl">
        Loading careers...
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

  const { header, jobs } = data;

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold font-serif text-dark-green mb-4">{header.title}</h1>
        <p className="text-olive">
          {header.desc}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {jobs.map((job) => (
          <div key={job.title} className="border border-gold/15 bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all">
            <span className="text-[10px] uppercase font-bold text-gold tracking-widest">{job.type}</span>
            <h3 className="text-xl font-bold font-serif text-dark-green mt-1 mb-3">{job.title}</h3>
            <p className="text-sm text-olive/80 mb-6">{job.desc}</p>
            <button className="text-xs uppercase font-bold tracking-wider text-dark-green hover:text-gold transition-colors">
              Apply Now &rarr;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
