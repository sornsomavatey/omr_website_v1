import { useTranslation } from '@/hooks/useTranslation';
import './index.css';

const englishSections = [
  {
    title: 'Cancellation',
    paragraphs: [
      'Thirty percent (30%) of menu price will be charged if cancellation takes place from seven to three (7 to 3) days before booked date. One hundred percent (100%) of menu price will be charged if cancellation takes place less than 3 days before booked date. One hundred percent (100%) of menu price will be charged for “no shows”.',
    ],
  },
  {
    title: 'Payment Policy',
    paragraphs: [
      'Payment needs to be made after meal. One More Restaurant will issue receipt from POS system only after getting full payment. Either party must inform the other, in writing, 7 days in advance in order to terminate contract.',
    ],
  },
  {
    title: 'Confirming Your Booking',
    paragraphs: [
      'The official confirmation should be completed and signed by the client at least 15 days prior to the date of the event. You are requested to settle the Initial deposit 30% upon signing of the confirmation or at least 15 days prior to the date of the event. Any breakage or loss during catering items is subjected to charge at its market price.',
    ],
  },
];

const khmerSections = [
  {
    title: 'ការលុបចោលកម្មវិធី',
    paragraphs: [
      'កែប្រែ​ឬលុបចោលកម្មវិធីចន្លោះពី ៧ ទៅ ៣ ថ្ងៃមុនកាលបរិច្ឆេទដែលបានកក់ តម្រូវអោយបង់ថ្លៃសេវា ៣០% នៃតម្លៃម៉ឺនុយសរុបដែលបានកក់។ កែប្រែ​ឬលុបចោលកម្មវិធីតិចជាង ៣ ថ្ងៃ (ពី ៣ ទៅ ១ ថ្ងៃ)៖ តម្រូវអោយបង់ថ្លៃសេវា ៧០% នៃតម្លៃម៉ឺនុយសរុបដែលបានកក់។ ប្រសិនបើការលុបចោលកម្មវិធីធ្វើឡើងក្នុងថ្ងៃកម្មវិធីតែម្តង៖ តម្រូវអោយបង់ថ្លៃសេវា ១០០% នៃតម្លៃម៉ឺនុយសរុបដែលបានកក់។',
    ],
  },
  {
    title: 'គោលការណ៍ទូទាត់',
    paragraphs: [
      'ការទូទាត់ត្រូវធ្វើឡើងបន្ទាប់ពីបញ្ចប់កម្មវិធីនិងការទទួលទានអាហាររួចរាល់។ ភោជនីយដ្ឋាន វ័នម៉រ នឹងចេញវិក្កយបត្រជូនពីប្រព័ន្ធគិតលុយ លុះត្រាតែទទួលបានការទូទាត់រួចរាល់ប៉ុណ្ណោះ។ ភាគីណាមួយត្រូវជូនដំណឹងជាលាយលក្ខណ៍អក្សរទៅកាន់ភាគីម្ខាងទៀតប្រសិនបើចង់លុបចោលកម្មវិធីអោយបានរយះពេល ៧ ថ្ងៃមុនកម្មវិធី។',
    ],
  },
  {
    title: 'ការបញ្ជាក់ការកក់ និងកិច្ចព្រមព្រៀងសេវាកម្ម',
    paragraphs: [
      'ការបញ្ជាក់ការកក់ ការកក់សំរាប់កម្មវិធីនឹងត្រូវចាត់ជាផ្លូវការ បន្ទាប់ពីយើងខ្ញុំទទួលបានកិច្ចសន្យាដែលបានចុះហត្ថលេខា រួមជាមួយប្រាក់កក់ដំបូងចំនួន ៣០%​ យ៉ាងហោចណាស់ ១៥ ថ្ងៃមុនថ្ងៃរៀបចំកម្មវិធី។ ការថែរក្សាសម្ភារៈ ករណីមានការខូចខាត ឬបាត់បង់សម្ភារៈណាមួយ អតិថិជន តំរូវអោយទូទាត់សំណងទៅតាមតម្លៃទីផ្សារជាក់ស្តែង។',
    ],
  },
];

export default function TermsPage() {
  const { getObject, isKhmer, language } = useTranslation();
  const translatedTerms = getObject('termsInline', {
    eyebrow: 'Important Booking Information',
    title: 'TEARMS AND CONDITIONS “EVENT AND CATERING”',
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
        <h1 className="page-hero-title">
          {isKhmer
            ? (
                <>
                  <span className="terms-title-main">លក្ខខណ្ឌ</span>
                  <span className="terms-title-subtitle">
                    សំរាប់រៀបចំកម្មវិធី​ក្នុងហាង​ និងសេវាកម្មដល់ទីកន្លែង
                  </span>
                </>
              )
            : language === 'EN'
              ? (
                  <>
                    <span className="terms-title-main">TEARMS AND CONDITIONS</span>
                    <span className="terms-title-subtitle">“EVENT AND CATERING”</span>
                  </>
                )
              : language === 'KO'
                ? (
                    <>
                      <span className="terms-title-main">{translatedTerms.title}</span>
                      <span className="terms-title-subtitle">“이벤트 및 케이터링”</span>
                    </>
                  )
                : language === 'ZH'
                  ? (
                      <>
                        <span className="terms-title-main">{translatedTerms.title}</span>
                        <span className="terms-title-subtitle">“活动与餐饮服务”</span>
                      </>
                    )
                  : translatedTerms.title}
        </h1>
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
