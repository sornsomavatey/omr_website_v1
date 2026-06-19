import React from 'react';

export default function Careers() {
  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold font-serif text-dark-green mb-4">Join Our Team</h1>
        <p className="text-olive">
          We are always looking for passionate individuals who share our love for Khmer culinary traditions and premium service.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: 'Sous Chef', type: 'Full-time', desc: 'Assist in kitchen operations, crafting authentic Khmer cuisine under the Head Chef.' },
          { title: 'Server / Hospitality Specialist', type: 'Full-time / Part-time', desc: 'Provide warm, professional hospitality in an upscale dining environment.' },
          { title: 'Host / Hostess', type: 'Full-time', desc: 'Welcome guests, manage seating charts, and coordinate reservation flows.' },
        ].map((job) => (
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
