import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BellRing,
  Eye,
  KeyRound,
  PartyPopper,
  Target,
  UtensilsCrossed,
  Users,
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

import heroImage from '@/assets/home-v2/43310dd2158ca5c7f7d098abf280dc14124d42de.webp';
import toulKorkImage from '@/assets/home-v2/3ec2cb399ae1a979be0576b7024f314c93994687.webp';
import boeungKakImage from '@/assets/home-v2/9589c143859fce389be35b08b186282f736d9245.webp';
import signatureDishImage from '@/assets/home-v2/36191a3943135f3542a0fe8b80adee304f122115.webp';
import privateRoomImage from '@/assets/home-v2/480cb1d76af2706b9692b726ad26ec2bf396f8c8.webp';
import celebrationImage from '@/assets/home-v2/e900cacb721f9c81cd07b8415a03f20f42a39856.webp';
import cateringImage from '@/assets/home-v2/07e47044152ad38cdbb1bda5ae392fb848e3a37a.webp';
import communityImage from '@/assets/home-v2/9826b8c118c911c852174f3c0d0204245fd0da48.webp';
import kidsImage from '@/assets/home-v2/e8f4b56e423777f3f6c3df39c6ef78914b278e17.webp';
import hospitalityImage from '@/assets/Event & Celebrations card-2.webp';
import finalCtaImage from '@/assets/home-v2/31b0910d38c033be0ce5292cf4a1d68688308c6b.webp';
import headChefImage from '@/assets/about/hor-chanthan.png';
import serviceTeamImage from '@/assets/about/service-team.png';
import chefTeamImage from '@/assets/about/chef-team.png';
import operationsTeamImage from '@/assets/about/operations-team.png';
import careersTeamImage from '@/assets/about/careers-team.png';
import './index.css';

const timeline = [
  { year: '2008', image: toulKorkImage, title: 'Our Story Begins', text: 'One More Restaurant begins with a vision to preserve Khmer flavors.' },
  { year: '2018', image: boeungKakImage, title: 'Expanding Roots', text: 'Our second home opens, bringing our signature hospitality to a vibrant neighborhood.' },
  { year: '2023', image: privateRoomImage, title: 'A New Chapter', text: 'Private dining and celebrations grow into an important part of the One More experience.' },
  { year: 'Today', image: signatureDishImage, title: 'Serving Phnom Penh', text: 'We continue serving families, businesses, and celebrations across Phnom Penh.' },
];

const reasons = [
  { icon: UtensilsCrossed, title: 'Authentic Khmer Cuisine', text: 'Traditional recipes prepared with care, quality ingredients, and contemporary refinement.' },
  { icon: Users, title: 'Spaces For Every Occasion', text: 'Welcoming dining rooms, private rooms, and flexible event spaces.' },
  { icon: PartyPopper, title: 'Trusted Event Destination', text: 'Experienced planning and thoughtful service for intimate or large celebrations.' },
  { icon: BellRing, title: 'Hospitality Since 2008', text: 'A dedicated team delivering warm and memorable Khmer dining experiences.' },
];

const people = [
  { image: headChefImage, title: 'Hor Chanthan', role: 'Head Chef', text: 'A kitchen built on precision, respect for ingredients, and the joy of sharing heritage recipes.' },
  { image: serviceTeamImage, title: 'Service Team', role: '', text: 'Warm, attentive, and genuinely invested in making every guest feel at home.' },
  { image: chefTeamImage, title: 'Our Chef Team', role: '', text: 'Khmer cuisine is an art form that tells the story of our land. Our mission is to elevate these ancient flavors while remaining fiercely loyal to the techniques passed down through generations.' },
  { image: operationsTeamImage, title: 'Operations Team', role: '', text: 'Behind every celebration is a team that cares for every detail, from planning to execution.' },
];

const toKhmerDigits = (value: string) =>
  value.replace(/\d/g, (digit) => '០១២៣៤៥៦៧៨៩'[Number(digit)]);

const khmerCopy: Record<string, string> = {
  'Our Story Since 2008': 'រឿងរ៉ាវរបស់យើង តាំងពីឆ្នាំ ២០០៨',
  'More Than a Restaurant': 'លើសពីភោជនីយដ្ឋានមួយ',
  'Since 2008, One More Restaurant has brought people together through authentic Khmer cuisine, warm hospitality, and memorable celebrations.': 'ចាប់តាំងពីឆ្នាំ ២០០៨ ភោជនីយដ្ឋាន វ័ន ម័រ បាននាំមនុស្សមកជួបជុំគ្នា តាមរយៈម្ហូបខ្មែរដ៏ពិតប្រាកដ បដិសណ្ឋារកិច្ចដ៏កក់ក្តៅ និងការប្រារព្ធពិធីដែលមិនអាចបំភ្លេចបាន។',
  'Reserve a Table': 'កក់តុ',
  'Explore Our Story': 'ស្វែងយល់ពីរឿងរ៉ាវរបស់យើង',
  'Our Story': 'រឿងរ៉ាវរបស់យើង',
  'Our Journey': 'ដំណើររបស់យើង',
  'Our Story Begins': 'រឿងរ៉ាវរបស់យើងចាប់ផ្តើម',
  'One More Restaurant begins with a vision to preserve Khmer flavors.': 'ភោជនីយដ្ឋាន វ័ន ម័រ ចាប់ផ្តើមជាមួយចក្ខុវិស័យក្នុងការថែរក្សារសជាតិខ្មែរ។',
  'Expanding Roots': 'ពង្រីកមូលដ្ឋាន',
  'Our second home opens, bringing our signature hospitality to a vibrant neighborhood.': 'សាខាទីពីររបស់យើងបើកដំណើរការ ដោយនាំយកបដិសណ្ឋារកិច្ចដ៏ពិសេសរបស់យើងទៅកាន់សហគមន៍ដ៏រស់រវើក។',
  'A New Chapter': 'ជំពូកថ្មី',
  'Private dining and celebrations grow into an important part of the One More experience.': 'ការទទួលទានអាហារឯកជន និងការប្រារព្ធពិធី បានក្លាយជាផ្នែកសំខាន់នៃបទពិសោធន៍ វ័ន ម័រ។',
  'Today': 'បច្ចុប្បន្ន',
  'Serving Phnom Penh': 'បម្រើរាជធានីភ្នំពេញ',
  'We continue serving families, businesses, and celebrations across Phnom Penh.': 'យើងបន្តបម្រើគ្រួសារ អាជីវកម្ម និងកម្មវិធីអបអរសាទរនានាទូទាំងរាជធានីភ្នំពេញ។',
  'Our Guiding Principles': 'គោលការណ៍ណែនាំរបស់យើង',
  'Vision and Mission': 'ចក្ខុវិស័យ និងបេសកកម្ម',
  'Vision': 'ចក្ខុវិស័យ',
  'To become a leading Khmer restaurant brand while preserving the cuisine and hospitality of Cambodia.': 'ក្លាយជាម៉ាកភោជនីយដ្ឋានខ្មែរឈានមុខគេ ខណៈពេលថែរក្សាម្ហូបអាហារ និងបដិសណ្ឋារកិច្ចរបស់កម្ពុជា។',
  'Mission': 'បេសកកម្ម',
  'To serve excellent Khmer food with thoughtful choices, warm service, and memorable experiences.': 'បម្រើម្ហូបខ្មែរដ៏ល្អឥតខ្ចោះ ជាមួយជម្រើសដ៏យកចិត្តទុកដាក់ សេវាកម្មកក់ក្តៅ និងបទពិសោធន៍ដែលគួរឱ្យចងចាំ។',
  "Guests' Choice": 'ជម្រើសរបស់ភ្ញៀវ',
  'Why Guests Choose One More': 'ហេតុអ្វីភ្ញៀវជ្រើសរើស វ័ន ម័រ',
  'Authentic Khmer Cuisine': 'ម្ហូបខ្មែរដ៏ពិតប្រាកដ',
  'Traditional recipes prepared with care, quality ingredients, and contemporary refinement.': 'រូបមន្តប្រពៃណីរៀបចំដោយការយកចិត្តទុកដាក់ គ្រឿងផ្សំមានគុណភាព និងការច្នៃប្រឌិតបែបទំនើប។',
  'Spaces For Every Occasion': 'ទីកន្លែងសម្រាប់គ្រប់ឱកាស',
  'Welcoming dining rooms, private rooms, and flexible event spaces.': 'បន្ទប់ទទួលទានអាហារ បន្ទប់ឯកជន និងទីធ្លាកម្មវិធីដែលអាចបត់បែនបាន។',
  'Trusted Event Destination': 'គោលដៅកម្មវិធីដែលគួរឱ្យទុកចិត្ត',
  'Experienced planning and thoughtful service for intimate or large celebrations.': 'ការរៀបចំប្រកបដោយបទពិសោធន៍ និងសេវាកម្មយកចិត្តទុកដាក់ សម្រាប់កម្មវិធីតូច ឬធំ។',
  'Hospitality Since 2008': 'បដិសណ្ឋារកិច្ចតាំងពីឆ្នាំ ២០០៨',
  'A dedicated team delivering warm and memorable Khmer dining experiences.': 'ក្រុមការងារដែលប្តេជ្ញាផ្តល់បទពិសោធន៍ម្ហូបខ្មែរដ៏កក់ក្តៅ និងគួរឱ្យចងចាំ។',
  'Our Promise': 'ការសន្យារបស់យើង',
  "Preserving Cambodia's culinary traditions.": 'ថែរក្សាប្រពៃណីម្ហូបអាហាររបស់កម្ពុជា។',
  'Warm Hospitality': 'បដិសណ្ឋារកិច្ចដ៏កក់ក្តៅ',
  'Welcoming every guest with genuine care.': 'ស្វាគមន៍ភ្ញៀវគ្រប់រូបដោយការយកចិត្តទុកដាក់ពិតប្រាកដ។',
  'Memorable Experiences': 'បទពិសោធន៍ដែលគួរឱ្យចងចាំ',
  'Creating moments worth remembering.': 'បង្កើតពេលវេលាដ៏មានតម្លៃសម្រាប់ការចងចាំ។',
  'Our People': 'ក្រុមការងាររបស់យើង',
  'The People Behind One More': 'មនុស្សនៅពីក្រោយ វ័ន ម័រ',
  'Hor Chanthan': 'ហ័រ ចាន់ថាន់',
  'Head Chef': 'មេចុងភៅ',
  'A kitchen built on precision, respect for ingredients, and the joy of sharing heritage recipes.': 'ផ្ទះបាយមួយដែលផ្អែកលើភាពម៉ត់ចត់ ការគោរពចំពោះគ្រឿងផ្សំ និងសេចក្តីរីករាយក្នុងការចែករំលែករូបមន្តបេតិកភណ្ឌ។',
  'Our Culinary Team': 'ក្រុមចុងភៅរបស់យើង',
  'Our Chef Team': 'ក្រុមចុងភៅរបស់យើង',
  'Khmer cuisine is an art form that tells the story of our land. Our mission is to elevate these ancient flavors while remaining fiercely loyal to the techniques passed down through generations.': 'ម្ហូបខ្មែរគឺជាសិល្បៈមួយដែលបង្ហាញពីរឿងរ៉ាវនៃទឹកដីរបស់យើង។ បេសកកម្មរបស់យើងគឺលើកកម្ពស់រសជាតិបុរាណទាំងនេះ ខណៈពេលរក្សាភាពស្មោះត្រង់ចំពោះបច្ចេកទេសដែលបានបន្តពីមួយជំនាន់ទៅមួយជំនាន់។',
  'Guardians of Khmer Flavor': 'អ្នកថែរក្សារសជាតិខ្មែរ',
  'Precision, respect for ingredients, and the joy of sharing heritage recipes.': 'ភាពម៉ត់ចត់ ការគោរពគ្រឿងផ្សំ និងសេចក្តីរីករាយក្នុងការចែករំលែករូបមន្តបេតិកភណ្ឌ។',
  'Service Team': 'ក្រុមសេវាកម្ម',
  'Warm, attentive, and genuinely invested in making every guest feel at home.': 'កក់ក្តៅ យកចិត្តទុកដាក់ និងខិតខំធ្វើឱ្យភ្ញៀវគ្រប់រូបមានអារម្មណ៍ដូចនៅផ្ទះ។',
  'Genuine Khmer Hospitality': 'បដិសណ្ឋារកិច្ចខ្មែរដ៏ពិតប្រាកដ',
  'Warm, attentive, and invested in making every guest feel at home.': 'កក់ក្តៅ យកចិត្តទុកដាក់ និងធ្វើឱ្យភ្ញៀវគ្រប់រូបមានអារម្មណ៍ដូចនៅផ្ទះ។',
  'Our Event Team': 'ក្រុមរៀបចំកម្មវិធីរបស់យើង',
  'Celebrations With Heart': 'ការប្រារព្ធពិធីដោយយកចិត្តទុកដាក់',
  'Creative, experienced, and ready to make every gathering feel personal.': 'ច្នៃប្រឌិត មានបទពិសោធន៍ និងត្រៀមធ្វើឱ្យគ្រប់ការជួបជុំមានភាពពិសេស។',
  'Operations Team': 'ក្រុមប្រតិបត្តិការ',
  'Behind every celebration is a team that cares for every detail, from planning to execution.': 'នៅពីក្រោយរាល់កម្មវិធីអបអរសាទរ មានក្រុមការងារដែលយកចិត្តទុកដាក់លើគ្រប់ព័ត៌មានលម្អិត ចាប់ពីការរៀបចំផែនការរហូតដល់ការអនុវត្ត។',
  'The People Behind It All': 'អ្នកនៅពីក្រោយភាពជោគជ័យ',
  'Caring for every detail, from planning and sourcing to daily service.': 'យកចិត្តទុកដាក់លើគ្រប់ព័ត៌មានលម្អិត ចាប់ពីការរៀបចំ និងការផ្គត់ផ្គង់ ដល់សេវាកម្មប្រចាំថ្ងៃ។',
  'Our Number': 'តួលេខរបស់យើង',
  'One More In Numbers': 'វ័ន ម័រ ជាតួលេខ',
  'Menu Items': 'មុខម្ហូប',
  'Rooms & Event Spaces': 'បន្ទប់ និងទីធ្លាកម្មវិធី',
  'Maximum Capacity': 'សមត្ថភាពទទួលអតិបរមា',
  'Branches': 'សាខា',
  'Team Members': 'សមាជិកក្រុមការងារ',
  'Khmer Culture': 'វប្បធម៌ខ្មែរ',
  'The Spirit of Khmer Hospitality': 'ស្មារតីនៃបដិសណ្ឋារកិច្ចខ្មែរ',
  'In Khmer culture, dining is more than a meal—it is a sincere ritual of togetherness. We believe hospitality begins with the warmth of the host.': 'ក្នុងវប្បធម៌ខ្មែរ ការទទួលទានអាហារមានន័យលើសពីអាហារមួយពេល—វាជាពិធីនៃការជួបជុំដោយស្មោះស្ម័គ្រ។ យើងជឿថាបដិសណ្ឋារកិច្ចចាប់ផ្តើមពីភាពកក់ក្តៅរបស់ម្ចាស់ផ្ទះ។',
  'From fresh local ingredients to the careful presentation of every dish, we honor this tradition in every moment.': 'ចាប់ពីគ្រឿងផ្សំក្នុងស្រុកស្រស់ៗ ដល់ការរៀបចំមុខម្ហូបនីមួយៗដោយយកចិត្តទុកដាក់ យើងគោរពប្រពៃណីនេះគ្រប់ពេលវេលា។',
  'Learn More': 'ស្វែងយល់បន្ថែម',
  'Moments': 'ពេលវេលា',
  'Moments That Matter': 'ពេលវេលាដែលមានអត្ថន័យ',
  'events hosted with care and excellence.': 'កម្មវិធីដែលបានរៀបចំដោយការយកចិត្តទុកដាក់ និងឧត្តមភាព។',
  'Careers': 'ការងារ',
  'Grow With One More': 'រីកចម្រើនជាមួយ វ័ន ម័រ',
  'We are a team of storytellers, chefs, and hosts dedicated to preserving Khmer heritage through exceptional hospitality.': 'យើងជាក្រុមអ្នកនិទានរឿង ចុងភៅ និងអ្នកបដិសណ្ឋារកិច្ច ដែលប្តេជ្ញាថែរក្សាបេតិកភណ្ឌខ្មែរ តាមរយៈសេវាកម្មដ៏ល្អឥតខ្ចោះ។',
  'Career opportunities across culinary, service, and events.': 'ឱកាសការងារផ្នែកចុងភៅ សេវាកម្ម និងការរៀបចំកម្មវិធី។',
  'A supportive team environment built on respect and excellence.': 'បរិយាកាសក្រុមការងារគាំទ្រគ្នា ដែលកសាងឡើងលើការគោរព និងឧត្តមភាព។',
  'View Careers': 'មើលឱកាសការងារ',
  'Send Your CV': 'ផ្ញើប្រវត្តិរូប',
  'Experience One More For Yourself': 'មកទទួលបទពិសោធន៍ វ័ន ម័រ ដោយខ្លួនអ្នក',
  'Whether you are joining us for a family dinner, business meeting, or special celebration, we look forward to welcoming you.': 'មិនថាអ្នកមកទទួលទានអាហារជាមួយគ្រួសារ ប្រជុំអាជីវកម្ម ឬប្រារព្ធកម្មវិធីពិសេស យើងរង់ចាំស្វាគមន៍អ្នកជានិច្ច។',
  'Plan Your Event': 'រៀបចំកម្មវិធីរបស់អ្នក',
  'Guests sharing a meal at One More Restaurant': 'ភ្ញៀវកំពុងទទួលទានអាហាររួមគ្នានៅភោជនីយដ្ឋាន វ័ន ម័រ',
  'A celebration at One More': 'កម្មវិធីអបអរសាទរនៅ វ័ន ម័រ',
  'Event catering': 'សេវាម្ហូបអាហារសម្រាប់កម្មវិធី',
  'A family activity': 'សកម្មភាពគ្រួសារ',
  'Khmer cooking experience': 'បទពិសោធន៍ធ្វើម្ហូបខ្មែរ',
  'The One More Restaurant team': 'ក្រុមការងារភោជនីយដ្ឋាន វ័ន ម័រ',
};

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="about-section-heading">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
    </div>
  );
}

function CountUpNumber({ value, suffix = '', isKhmer }: { value: number; suffix?: string; isKhmer: boolean }) {
  const [displayValue, setDisplayValue] = useState(0);
  const numberRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const number = numberRef.current;
    if (!number) return;

    let animationFrame = 0;
    let observer: IntersectionObserver | undefined;

    const startCounting = () => {
      const startedAt = performance.now();
      const duration = 1500;

      const updateCount = (now: number) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        setDisplayValue(Math.round(value * easedProgress));

        if (progress < 1) animationFrame = requestAnimationFrame(updateCount);
      };

      animationFrame = requestAnimationFrame(updateCount);
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayValue(value);
    } else if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        observer?.disconnect();
        startCounting();
      }, { threshold: 0.4 });
      observer.observe(number);
    } else {
      startCounting();
    }

    return () => {
      observer?.disconnect();
      cancelAnimationFrame(animationFrame);
    };
  }, [value]);

  const text = `${displayValue}${suffix}`;
  return <strong ref={numberRef}>{isKhmer ? toKhmerDigits(text) : text}</strong>;
}

export default function About() {
  const { isKhmer } = useTranslation();
  const tr = (text: string) => isKhmer ? (khmerCopy[text] || text) : text;
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const images = Array.from(page.querySelectorAll<HTMLImageElement>('img'));
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      images.forEach((image) => image.classList.add('about-image-visible'));
      return;
    }

    page.classList.add('about-image-motion-ready');
    images.forEach((image, index) => {
      image.style.setProperty('--about-image-delay', `${(index % 4) * 90}ms`);
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add('about-image-visible');
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -8% 0px',
    });

    images.forEach((image) => observer.observe(image));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="about-page" ref={pageRef}>
      <section className="about-hero" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="about-hero-overlay" />
        <div className="about-hero-content">
          <h1 className="page-hero-title">{tr('More Than a Restaurant')}</h1>
          <p className="about-hero-description">
            {tr('Since 2008, One More Restaurant has brought people together through authentic Khmer cuisine, warm hospitality, and memorable celebrations.')}
          </p>
          <div className="about-hero-actions">
            <Link to="/reservations" className="about-button about-button-primary">{tr('Reserve a Table')}</Link>
            <a href="#our-journey" className="about-button about-button-outline">{tr('Explore Our Story')}</a>
          </div>
        </div>
      </section>

      <section id="our-journey" className="about-section about-journey">
        <SectionHeading eyebrow={tr('Our Story')} title={tr('Our Journey')} />
        <div className="about-timeline">
          {timeline.map((item) => (
            <article className="about-timeline-card" key={item.year}>
              <strong>{isKhmer ? toKhmerDigits(tr(item.year)) : tr(item.year)}</strong>
              <img src={item.image} alt={tr(item.title)} />
              <h3>{tr(item.title)}</h3>
              <p>{tr(item.text)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-section about-principles">
        <SectionHeading eyebrow={tr('Our Guiding Principles')} title={tr('Vision and Mission')} />
        <div className="about-principles-grid">
          <article>
            <span><Eye size={20} /></span>
            <div><h3>{tr('Vision')}</h3><p>{tr('To become a leading Khmer restaurant brand while preserving the cuisine and hospitality of Cambodia.')}</p></div>
          </article>
          <article>
            <span><Target size={20} /></span>
            <div><h3>{tr('Mission')}</h3><p>{tr('To serve excellent Khmer food with thoughtful choices, warm service, and memorable experiences.')}</p></div>
          </article>
        </div>
      </section>

      <section className="about-section about-reasons">
        <SectionHeading eyebrow={tr("Guests' Choice")} title={tr('Why Guests Choose One More')} />
        <div className="about-reasons-grid">
          {reasons.map(({ icon: Icon, title, text }) => (
            <article key={title}>
              <span><Icon size={21} /></span>
              <div><h3>{tr(title)}</h3><p>{tr(text)}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="about-promise">
        <SectionHeading eyebrow={tr('Our Promise')} title={tr('Our Promise')} />
        <div className="about-promise-grid">
          <article><span /><h3>{tr('Authentic Khmer Cuisine')}</h3><p>{tr("Preserving Cambodia's culinary traditions.")}</p></article>
          <article><span /><h3>{tr('Warm Hospitality')}</h3><p>{tr('Welcoming every guest with genuine care.')}</p></article>
          <article><span /><h3>{tr('Memorable Experiences')}</h3><p>{tr('Creating moments worth remembering.')}</p></article>
        </div>
      </section>

      <section className="about-section about-people">
        <SectionHeading eyebrow={tr('Our People')} title={tr('The People Behind One More')} />
        <div className="about-people-grid">
          {people.map((person) => (
            <article key={person.title}>
              <img src={person.image} alt={tr(person.title)} />
              <div><h3>{tr(person.title)}</h3>{person.role && <span>{tr(person.role)}</span>}<p>{tr(person.text)}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="about-section about-numbers">
        <SectionHeading eyebrow={tr('Our Number')} title={tr('One More In Numbers')} />
        <div className="about-number-grid">
          <div><CountUpNumber value={300} suffix="+" isKhmer={isKhmer} /><span>{tr('Menu Items')}</span></div>
          <div><CountUpNumber value={22} isKhmer={isKhmer} /><span>{tr('Rooms & Event Spaces')}</span></div>
          <div><CountUpNumber value={516} isKhmer={isKhmer} /><span>{tr('Maximum Capacity')}</span></div>
          <div><CountUpNumber value={2} isKhmer={isKhmer} /><span>{tr('Branches')}</span></div>
          <div><CountUpNumber value={200} suffix="+" isKhmer={isKhmer} /><span>{tr('Team Members')}</span></div>
        </div>
      </section>

      <section className="about-section about-spirit">
        <img src={hospitalityImage} alt={tr('Guests sharing a meal at One More Restaurant')} />
        <div>
          <p className="about-eyebrow">{tr('Khmer Culture')}</p>
          <h2>{tr('The Spirit of Khmer Hospitality')}</h2>
          <p>{tr('In Khmer culture, dining is more than a meal—it is a sincere ritual of togetherness. We believe hospitality begins with the warmth of the host.')}</p>
          <p>{tr('From fresh local ingredients to the careful presentation of every dish, we honor this tradition in every moment.')}</p>
          <Link to="/menu" className="about-button about-button-primary">{tr('Learn More')}</Link>
        </div>
      </section>

      <section className="about-section about-moments">
        <SectionHeading eyebrow={tr('Moments')} title={tr('Moments That Matter')} />
        <div className="about-moments-grid">
          <img className="about-moment-main" src={celebrationImage} alt={tr('A celebration at One More')} />
          <img src={cateringImage} alt={tr('Event catering')} />
          <img src={kidsImage} alt={tr('A family activity')} />
          <img src={communityImage} alt={tr('Khmer cooking experience')} />
          <div><strong>{isKhmer ? `ជាង ${toKhmerDigits('1,000+')}` : 'Over 1,000+'}</strong><span>{tr('events hosted with care and excellence.')}</span></div>
        </div>
      </section>

      <section id="careers" className="about-section about-careers">
        <SectionHeading eyebrow={tr('Careers')} title={tr('Grow With One More')} />
        <div className="about-careers-grid">
          <div>
            <p>{tr('We are a team of storytellers, chefs, and hosts dedicated to preserving Khmer heritage through exceptional hospitality.')}</p>
            <ul className="about-careers-list">
              <li><Users size={17} /><span>{tr('Career opportunities across culinary, service, and events.')}</span></li>
              <li><KeyRound size={17} /><span>{tr('A supportive team environment built on respect and excellence.')}</span></li>
            </ul>
          </div>
          <img src={careersTeamImage} alt={tr('The One More Restaurant team')} />
        </div>
      </section>

      <section className="about-final-cta" style={{ backgroundImage: `url(${finalCtaImage})` }}>
        <div>
          <h2>{tr('Experience One More For Yourself')}</h2>
          <p>{tr('Whether you are joining us for a family dinner, business meeting, or special celebration, we look forward to welcoming you.')}</p>
          <div>
            <Link to="/reservations" className="about-button about-button-primary">{tr('Reserve a Table')}</Link>
            <Link to="/events" className="about-button about-button-outline">{tr('Plan Your Event')}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
