import { Link } from 'react-router-dom';
import { SignatureDish } from '@/pages/Home/homeTypes';
import SectionHeader from '@/components/SectionHeader';

export default function SignatureDishes({ dishes }: { dishes: SignatureDish[] }) {
  return (
    <section id="menu" className="featured-cuisine-section">
      <div className="featured-cuisine-pattern" aria-hidden="true" />

      <div className="featured-cuisine-container">
        <SectionHeader
          eyebrow="Our Signature Dishes"
          title="Featured Khmer Cuisine"
          description="Each dish tells a story of Cambodia's culinary heritage, crafted with heirloom recipes and seasonal ingredients."
        />

        <div className="featured-cuisine-collage">
          {Array.from({ length: 8 }).map((_, index) => {
            const dish = dishes[index % dishes.length];

            return (
              <div
                key={`${dish.name}-${index}`}
                className={`cuisine-tile cuisine-tile-${index + 1}`}
              >
                <img src={dish.img} alt={dish.name} />
              </div>
            );
          })}

          <svg
            className="cuisine-decoration cuisine-decoration-left"
            viewBox="0 0 110 110"
            width="110"
            height="110"
            aria-hidden="true"
          >
            <path
              fill="#6b9158"
              d="M55 0 C55 24 31 55 0 55 C31 55 55 86 55 110 C55 86 79 55 110 55 C79 55 55 24 55 0 Z"
            />
          </svg>

          <svg
            className="cuisine-decoration cuisine-decoration-right"
            viewBox="0 0 110 110"
            width="110"
            height="110"
            aria-hidden="true"
          >
            <path
              fill="#6b9158"
              d="M55 0 C55 24 31 55 0 55 C31 55 55 86 55 110 C55 86 79 55 110 55 C79 55 55 24 55 0 Z"
            />
          </svg>

          <div className="cuisine-center-circle">
            <img
              src={dishes[0]?.img}
              alt={dishes[0]?.name}
            />
          </div>
        </div>

        <Link to="/menu" className="custom-btn-outline-green">
          View all menu
        </Link>
      </div>
    </section>
  );
}
