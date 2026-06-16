import React, { useState } from 'react';
import DishCard from '@/components/ui/dish-card';

// Background assets
import imgHeroBg from '@/assets/home-v2/9589c143859fce389be35b08b186282f736d9245.png';

// Breakfast assets
import imgBreakfast1 from '@/assets/Food/Breakfast/khmer-noodle-soup.png';
import imgBreakfast2 from '@/assets/Food/Breakfast/bean-sprout-fried-noodle.png';
import imgBreakfast3 from '@/assets/Food/Breakfast/beef-fried-noodle.png';
import imgBreakfast4 from '@/assets/Food/Breakfast/seafood-fried-noodle.png';
import imgBreakfast5 from '@/assets/Food/Breakfast/pork-bone-soup.png';
import imgBreakfast6 from '@/assets/Food/Breakfast/meatball-kuyteav.png';

// Lunch & Dinner assets
import imgLunch1 from '@/assets/Food/Lunch and Dinner/fish-amok-coconut.png';
import imgLunch2 from '@/assets/Food/Lunch and Dinner/banana-blossom-chicken-salad.png';
import imgLunch3 from '@/assets/Food/Lunch and Dinner/stir-fried-cockles-tamarind.png';
import imgLunch4 from '@/assets/Food/Lunch and Dinner/britian-loklak.png';
import imgLunch5 from '@/assets/Food/Lunch and Dinner/curry-lobster.png';
import imgLunch6 from '@/assets/Food/Lunch and Dinner/samlor-korko-catfish.png';

// Dessert assets
import imgDessert1 from '@/assets/Food/Dessert/five-signature-dessert.png';

// Fallback high-res food images for visual variety
import imgDish2 from '@/assets/home-v2/35b5b5843bc3a879390cc05c8e6b33eae70c2a8a.png';
import imgDish3 from '@/assets/home-v2/7ce88d9bf1af040daf36af037fc63627a61522c9.png';

type MenuCategory = 'Breakfast' | 'Lunch' | 'Dinner' | 'Dessert' | 'Drinks';

type MenuItem = {
  name: string;
  category: string;
  desc: string;
  img: string;
  price: string;
  badge?: string;
};

const menuItemsData: Record<MenuCategory, MenuItem[]> = {
  Breakfast: [
    {
      name: 'Kuyteav Phnom Penh',
      category: 'BREAKFAST · SOUP',
      desc: 'A classic Cambodian breakfast noodle soup featuring chewy rice noodles in a rich pork broth, topped with sliced pork, meatballs, and fresh herbs.',
      img: imgBreakfast1,
      price: '$18',
      badge: "Chef's Choice ✦",
    },
    {
      name: 'Bean Sprout Fried Noodles',
      category: 'BREAKFAST · PAN-FRIED',
      desc: 'Stir-fried yellow noodles tossed with crisp bean sprouts, garlic, green chives, and savory soy seasoning, served with a house sweet chili sauce.',
      img: imgBreakfast2,
      price: '$12',
      badge: "Chef's Choice ✦",
    },
    {
      name: 'Beef Fried Kuyteav',
      category: 'BREAKFAST · WOK-FIRED',
      desc: 'Stir-fried flat rice noodles cooked in a roaring wok with tender slices of beef, Chinese broccoli, eggs, and a caramelized sweet soy sauce.',
      img: imgBreakfast3,
      price: '$16',
      badge: "Chef's Choice ✦",
    },
    {
      name: 'Seafood Fried Noodles',
      category: 'BREAKFAST · SEAFOOD',
      desc: 'A delightful mix of fresh river shrimp, squid, and seasonal vegetables stir-fried with wheat noodles in a savory oyster-garlic sauce.',
      img: imgBreakfast4,
      price: '$18',
      badge: "Chef's Choice ✦",
    },
    {
      name: 'Pork Bone Kuyteav Soup',
      category: 'BREAKFAST · HEARTY SOUP',
      desc: 'Comforting rice noodle soup served with slow-simmered meaty pork ribs, roasted garlic oil, scallions, and crisp bean sprouts.',
      img: imgBreakfast5,
      price: '$15',
      badge: "Chef's Choice ✦",
    },
    {
      name: 'Meatball Kuyteav',
      category: 'BREAKFAST · COMFORT',
      desc: 'Savory Khmer noodle soup loaded with house-made beef meatballs, fresh herbs, lime, and chili paste in a clear, sweet bone broth.',
      img: imgBreakfast6,
      price: '$14',
      badge: "Chef's Choice ✦",
    },
  ],
  Lunch: [
    {
      name: 'Fish Amok in Coconut',
      category: 'LUNCH · SIGNATURE',
      desc: 'Tender snakehead fish fillets coated in a rich Lemongrass Kroeung curry paste and coconut cream, gently steamed inside a fresh young coconut.',
      img: imgLunch1,
      price: '$24',
      badge: "Chef's Choice ✦",
    },
    {
      name: 'Banana Blossom Chicken Salad',
      category: 'LUNCH · LIGHT & FRESH',
      desc: 'Shredded chicken breast tossed with crisp banana blossom, red bell peppers, fragrant Khmer herbs, and a tangy lime-chili dressing.',
      img: imgLunch2,
      price: '$15',
    },
    {
      name: 'Stir-Fried Cockles in Tamarind',
      category: 'LUNCH · SAVORY',
      desc: 'Fresh local cockles wok-tossed in a sweet, sour, and mildly spicy tamarind sauce, garnished with aromatic holy basil.',
      img: imgLunch3,
      price: '$18',
      badge: "Chef's Choice ✦",
    },
    {
      name: 'Beef Lok Lak',
      category: 'LUNCH · CLASSIC',
      desc: 'Stir-fried marinated beef cubes served on a bed of fresh lettuce, tomatoes, and onions, accompanied by a traditional Kampot pepper-lime dipping sauce.',
      img: imgLunch4,
      price: '$22',
    },
  ],
  Dinner: [
    {
      name: 'Charred Chili Lobster',
      category: 'DINNER · LUXURY SEAFOOD',
      desc: 'Fresh local lobster wok-fried with garlic, chili, sweet onions, and a rich oyster-tamarind reduction, served with Kampot pepper lime dip.',
      img: imgLunch5,
      price: '$38',
      badge: "Chef's Choice ✦",
    },
    {
      name: 'Samlor Korko with Catfish',
      category: 'DINNER · TRADITIONAL',
      desc: 'A nourishing traditional Khmer green stew with catfish fillets, roasted ground rice, green papaya, pumpkin, eggplant, and mixed organic leafy greens.',
      img: imgLunch6,
      price: '$19',
    },
    {
      name: 'Traditional Fish Amok',
      category: 'DINNER · CLASSIC',
      desc: 'A timeless Cambodian treasure — tender river fish steamed within a banana leaf parcel, enveloped in a velvety coconut-lemongrass curry mousse.',
      img: imgDish2,
      price: '$24',
      badge: "Chef's Choice ✦",
    },
  ],
  Dessert: [
    {
      name: 'Five Signature Dessert Platter',
      category: 'DESSERT · PLATTER',
      desc: 'A beautiful platter featuring a selection of classic Cambodian sweet treats, including pumpkin custard, sticky rice, and coconut jellies.',
      img: imgDessert1,
      price: '$14',
      badge: "Chef's Choice ✦",
    },
    {
      name: 'Nom Krok (Coconut Pancakes)',
      category: 'DESSERT · TRADITIONAL',
      desc: 'Crispy, sweet, and custardy coconut rice pancakes made in a traditional cast-iron mold, served hot with a sweet coconut dipping cream.',
      img: imgDish2,
      price: '$8',
    },
  ],
  Drinks: [
    {
      name: 'Lemongrass Infused Iced Tea',
      category: 'DRINKS · INFUSION',
      desc: 'Chilled house-brewed black tea infused with fresh lemongrass stalks, kaffir lime leaves, and organic honey.',
      img: imgDish2,
      price: '$5',
      badge: "Chef's Choice ✦",
    },
    {
      name: 'Angkor Beer',
      category: 'DRINKS · LOCAL BEER',
      desc: 'The signature local lager of Cambodia. Crisp, clean, and refreshing, the perfect pairing for savory Khmer dishes.',
      img: imgDish3,
      price: '$4',
    },
  ],
};

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('Breakfast');

  const categories: MenuCategory[] = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Drinks'];

  return (
    <div className="bg-white flex flex-col items-center w-full min-h-screen">
      {/* Hero Header Section */}
      <section className="relative w-full h-[520px] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <img
            alt="Menu Header Background"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
            src={imgHeroBg}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/75" />
        </div>

        <div className="relative z-10 text-center text-white max-w-[1260px] px-6 pt-16 flex flex-col items-center">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-[70px] leading-tight mb-4 font-normal tracking-wide drop-shadow-md">
            Our Menu
          </h1>

          <p className="text-white/80 text-base md:text-lg font-sans font-light max-w-xl mx-auto leading-relaxed mb-12">
            Freshly crafted dishes made with love.
          </p>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl">
            {categories.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`px-8 py-3 rounded-full text-xs font-sans font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-[#6b9158] text-white shadow-md border border-[#6b9158]'
                      : 'border border-white/40 text-white/85 hover:border-white hover:text-white hover:bg-white/5'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Menu Grid Section */}
      <section className="w-full py-24 bg-white flex flex-col items-center">
        <div className="max-w-[1440px] w-full px-6 md:px-[64px] text-center flex flex-col items-center">
          {/* Section Header */}
          <div className="flex items-center justify-center gap-4 mb-10 text-[#6b9158] font-sans text-xs font-bold uppercase tracking-widest">
            <span className="w-10 h-[1px] bg-[#6b9158]" />
            Seasonal Selection
            <span className="w-10 h-[1px] bg-[#6b9158]" />
          </div>

          <h2 className="font-serif text-4xl md:text-5xl font-normal tracking-wide mb-16 text-[#212d1b]">
            {activeCategory}
          </h2>

          {/* Transition grid */}
          <div 
            key={activeCategory} 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 w-full animate-fade-in"
          >
            {menuItemsData[activeCategory].map((dish, index) => (
              <DishCard
                key={`${dish.name}-${index}`}
                index={index}
                name={dish.name}
                category={dish.category}
                description={dish.desc}
                image={dish.img}
                price={dish.price}
                badge={dish.badge}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
