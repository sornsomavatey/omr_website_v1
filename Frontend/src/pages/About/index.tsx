import React from 'react';

export default function About() {
  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold font-serif text-dark-green mb-4">Our Story</h1>
        <p className="text-gold font-serif italic text-lg mb-8">Elevating Cambodian culinary art since 2008</p>
        <div className="text-olive/90 space-y-6 text-left leading-relaxed">
          <p>
            One More Restaurant was born out of a deep-seated love for Cambodia's traditional recipes and a desire to elevate them to a world-class dining experience. Our name, "One More," comes from the hospitable Khmer culture where hosts always offer "one more" plate of rice, representing warmth, generosity, and abundance.
          </p>
          <p>
            We collaborate closely with local farmers, sourcing organic ingredients from the fertile plains of Tonle Sap and the highlands of Battambang. Our chefs combine traditional cooking methods with contemporary presentation techniques to create dishes that pay homage to Cambodia’s history while appealing to modern culinary tastes.
          </p>
          <p>
            Whether it is our signature Amok Trey, cooked gently in fresh banana leaves, or our signature cocktails infused with lemongrass and Kaffir lime, every detail is curated to deliver an authentic Khmer dining experience.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-16 items-center">
        <img
          src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800"
          alt="Culinary Team"
          className="rounded-lg shadow-lg aspect-4/3 object-cover"
        />
        <div className="space-y-4">
          <h3 className="text-2xl font-bold font-serif text-dark-green">Our Mission</h3>
          <p className="text-olive text-sm leading-relaxed">
            To preserve the culinary traditions of Cambodia, support our local farming communities, and present the refined flavors of Khmer cuisine to the global community with genuine warmth and excellence.
          </p>
        </div>
      </div>
    </div>
  );
}
