import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Contact() {
  return (
    <div className="pt-24 sm:pt-28 pb-14 sm:pb-20 max-w-7xl mx-auto px-5 sm:px-6">
      <div className="max-w-2xl mx-auto text-center mb-9 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-dark-green mb-4">Contact Us</h1>
        <p className="text-olive">
          Have questions or want to host a private event? Get in touch with us and we will get back to you shortly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 max-w-5xl mx-auto">
        {/* Contact info */}
        <div className="space-y-8 bg-white border border-gold/15 p-5 sm:p-8 rounded-lg shadow-sm min-w-0">
          <h3 className="text-2xl font-bold font-serif text-dark-green mb-6">Get in Touch</h3>
          <ul className="space-y-6">
            <li className="flex items-start gap-4">
              <MapPin size={24} className="text-gold shrink-0 mt-1" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-gold uppercase tracking-wider">Address</p>
                <p className="text-sm text-olive/90 mt-1">No. 37, Street 315, Boeung Kak I, Tuol Kork, Phnom Penh, Cambodia</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <Phone size={24} className="text-gold shrink-0 mt-1" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-gold uppercase tracking-wider">Phone</p>
                <p className="text-sm text-olive/90 mt-1">+855 23 888 555 / 12 345 678</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <Mail size={24} className="text-gold shrink-0 mt-1" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-gold uppercase tracking-wider">Email</p>
                <p className="text-sm text-olive/90 mt-1 break-all">info@onemore.com.kh</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Message form */}
        <div className="bg-white border border-gold/15 p-5 sm:p-8 rounded-lg shadow-sm min-w-0">
          <h3 className="text-2xl font-bold font-serif text-dark-green mb-6">Send a Message</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-dark-green uppercase tracking-wider mb-2">Name</label>
              <input type="text" className="w-full min-h-11 border border-gold/20 rounded-md py-2 px-3 focus:outline-none focus:border-gold" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-dark-green uppercase tracking-wider mb-2">Email</label>
              <input type="email" className="w-full min-h-11 border border-gold/20 rounded-md py-2 px-3 focus:outline-none focus:border-gold" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-dark-green uppercase tracking-wider mb-2">Message</label>
              <textarea rows={4} className="w-full border border-gold/20 rounded-md py-2 px-3 focus:outline-none focus:border-gold" required></textarea>
            </div>
            <button type="submit" className="w-full bg-gold hover:bg-gold-hover text-dark-green font-bold uppercase tracking-wider py-3 rounded-md transition-all flex items-center justify-center gap-2">
              <Send size={16} /> Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
