import { useTranslation } from '@/hooks/useTranslation';
import './index.css';

const englishSections = [
  {
    title: 'Cancellation and No Show',
    paragraphs: [
      'Thirty percent (30%) of menu price will be charged if cancellation takes place from seven to three (7 to 3) days before booked date. One hundred percent (100%) of menu price will be charged if cancellation takes place less than 3 days before booked date. One hundred percent (100%) of menu price will be charged for “no shows”.',
    ],
  },
  {
    title: 'Payment & Termination Policy',
    paragraphs: [
      'Payment needs to be made after meal. One More Restaurant will issue receipt from POS system only after getting payment. Either party must inform the other, in writing, 7 days in advance in order to terminate contract.',
    ],
  },
  {
    title: 'Confirming Your Booking',
    paragraphs: [
      'Once we receive your signed contract and applicable deposit we will confirm you’re booking at the same time. Any breakage or loss during catering items is subjected to charge at its market price. The confirmation should be completed and signed by the client at least 15 days prior to the date of the event. You are requested to settle the Initial deposit 30% upon signing of the confirmation or at least 15 days prior to the date of the function.',
    ],
  },
];

const khmerSections = [
  {
    title: 'ការលុបចោល និងការមិនមកបង្ហាញខ្លួន',
    paragraphs: [
      'ថ្លៃសេវាចំនួន ៣០% នៃតម្លៃក្នុងម៉ឺនុយនឹងត្រូវគិតថ្លៃ ប្រសិនបើការលុបចោលធ្វើឡើងក្នុងរយៈពេលពី ៧ ទៅ ៣ ថ្ងៃមុនកាលបរិច្ឆេទដែលបានកក់។ ថ្លៃសេវាចំនួន ៧០% នៃតម្លៃក្នុងម៉ឺនុយនឹងត្រូវគិតថ្លៃ ប្រសិនបើការលុបចោលធ្វើឡើងក្នុងរយៈពេលតិចជាង ៣ ថ្ងៃ (ពី ៣ ទៅ ១ ថ្ងៃ) មុនកាលបរិច្ឆេទដែលបានកក់។ ថ្លៃសេវាចំនួន ១០០% នៃតម្លៃក្នុងម៉ឺនុយនឹងត្រូវគិតថ្លៃ ក្នុងករណីមិនមកបង្ហាញខ្លួន។',
    ],
  },
  {
    title: 'គោលការណ៍ទូទាត់ និងការបញ្ចប់កិច្ចសន្យា',
    paragraphs: [
      'ការទូទាត់ត្រូវធ្វើឡើងបន្ទាប់ពីការទទួលទានអាហាររួច។ ភោជនីយដ្ឋាន វ័នម៉រ នឹងចេញវិក្កយបត្រពីប្រព័ន្ធ គិតលុយ លុះត្រាតែទទួលបានការទូទាត់រួចរាល់ប៉ុណ្ណោះ។ ភាគីណាមួយត្រូវជូនដំណឹងជាលាយលក្ខណ៍អក្សរទៅកាន់ភាគីម្ខាងទៀតជាមុនរយៈពេល ៧ ថ្ងៃ ប្រសិនបើចង់បញ្ចប់កិច្ចសន្យា។',
    ],
  },
  {
    title: 'ការបញ្ជាក់ការកក់',
    paragraphs: [
      'នៅពេលដែលយើងទទួលបានកិច្ចសន្យាដែលបានចុះហត្ថលេខា និងប្រាក់កក់ដែលពាក់ព័ន្ធ យើងនឹងធ្វើការបញ្ជាក់ការកក់ជូនលោកអ្នកភ្លាមៗ។ រាល់ការខូចខាត ឬការបាត់បង់សម្ភារៈបម្រើសេវាកម្មអាហារ នឹងត្រូវគិតថ្លៃតាមតម្លៃទីផ្សារ។ អតិថិជនត្រូវបំពេញ និងចុះហត្ថលេខាលើការបញ្ជាក់នេះយ៉ាងហោចណាស់ ១៥ ថ្ងៃមុនថ្ងៃរៀបចំព្រឹត្តិការណ៍។ លោកអ្នកតម្រូវឱ្យបង់ប្រាក់កក់ដំបូងចំនួន ៣០% នៅពេលចុះហត្ថលេខាលើការបញ្ជាក់ ឬយ៉ាងហោចណាស់ ១៥ ថ្ងៃមុនថ្ងៃកម្មវិធីចាប់ផ្តើម។',
    ],
  },
];

export default function TermsPage() {
  const { getObject, isKhmer, language } = useTranslation();
  const translatedTerms = getObject('termsInline', {
    eyebrow: 'Important Booking Information',
    title: 'Terms and Conditions',
    intro: 'Please review the following terms before confirming your booking.',
    sections: englishSections,
  });
  const sections = isKhmer
    ? khmerSections
    : language === 'EN'
      ? englishSections
      : translatedTerms.sections;

  return (
    <div className="terms-page">
      <header className="terms-hero">
        <p>{isKhmer ? 'ព័ត៌មានសំខាន់អំពីការកក់' : translatedTerms.eyebrow}</p>
        <h1 className="page-hero-title">{isKhmer ? 'គោលការណ៍និងលក្ខខណ្ឌ' : translatedTerms.title}</h1>
        <span>
          {isKhmer
            ? 'សូមអានលក្ខខណ្ឌខាងក្រោមមុនពេលបញ្ជាក់ការកក់របស់លោកអ្នក។'
            : translatedTerms.intro}
        </span>
      </header>

      <div className="terms-content">
        {sections.map((section, index) => (
          <section className="terms-section" key={section.title}>
            <div className="terms-section-number">{String(index + 1).padStart(2, '0')}</div>
            <div>
              <h2>{section.title}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
