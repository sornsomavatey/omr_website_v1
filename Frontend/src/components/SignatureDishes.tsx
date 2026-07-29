import { Link } from 'react-router-dom';
import { SignatureDish } from '@/pages/Home/homeTypes';
import SectionHeader from '@/components/SectionHeader';
import { useTranslation } from '@/hooks/useTranslation';

export default function SignatureDishes({ dishes }: { dishes: SignatureDish[] }) {
  const { t } = useTranslation();
  const collageDishOrder = [
    'kuyteavOneMore',
    'fishAmokCoconut',
    'panFriedFishPaste',
    'kuyteavMincedPork',
    'sourSeafoodSoup',
    'grilledChickenSiemReap',
    'hainanChickenRice',
    'porkBloodPorridge',
  ];
  const collageDishes = collageDishOrder
    .map((key) => dishes.find((dish) => dish.key === key))
    .filter((dish): dish is SignatureDish => Boolean(dish));

  return (
    <section id="menu" className="featured-cuisine-section">

      <div className="featured-cuisine-container">
        <SectionHeader
          eyebrow={t('home.signature.eyebrow')}
          title={t('home.signature.title')}
          description={t('home.signature.description')}
        />

        <div className="featured-cuisine-collage">
          {Array.from({ length: 8 }).map((_, index) => {
            const dish = collageDishes[index % collageDishes.length];
            const translatedName = dish?.key
              ? t(`home.signature.items.${dish.key}.name`, undefined, dish.name)
              : dish?.name;

            return (
              <div
                key={`${dish?.name}-${index}`}
                className={`cuisine-tile cuisine-tile-${index + 1}`}
              >
                <img src={dish?.img} alt={translatedName} />
                <div className="cuisine-tile-overlay">
                  <div className="cuisine-tile-overlay-content">
                    <h4>{translatedName}</h4>
                  </div>
                </div>
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
            {(() => {
              const centerDish = dishes.find((d) => d.key === 'friedRicePineapple') || dishes[0];
              const centerName = centerDish?.key
                ? t(`home.signature.items.${centerDish.key}.name`, undefined, centerDish.name)
                : centerDish?.name;
              return (
                <>
                  <img src={centerDish?.img} alt={centerName} />
                  <div className="cuisine-circle-overlay">
                    <div className="cuisine-circle-overlay-content">
                      <h4>{centerName}</h4>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>

        <Link to="/menu" className="custom-btn-outline-green">
          {t('home.signature.viewAll')}
        </Link>
      </div>
    </section>
  );
}
