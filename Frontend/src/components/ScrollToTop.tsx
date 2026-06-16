import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-10 right-10 z-50 bg-emerald-500 text-white rounded-full p-3.75 shadow-2xl ring-2 ring-emerald-200 cursor-pointer transition-transform duration-150 hover:scale-110 hover:bg-emerald-600"
      aria-label="Scroll to top"
    >
      <ChevronUp size={24} />
    </button>
  );
}
