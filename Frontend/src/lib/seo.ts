export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
}

export const seoMetadataEN: Record<string, SEOMetadata> = {
  '/': {
    title: 'One More Restaurant | Authentic Khmer Cuisine in Phnom Penh',
    description: 'Experience authentic Khmer cuisine at One More Restaurant. Explore our gourmet menu, book private dining rooms, and enjoy premium Cambodian culinary moments.',
    keywords: 'one more restaurant, khmer cuisine, authentic khmer food, phnom penh restaurant, private dining, cambodian cuisine, fine dining phnom penh',
    ogImage: '/logo-share.jpg'
  },
  '/menu': {
    title: 'Authentic Khmer Menu | One More Restaurant',
    description: 'Discover the rich heritage of Cambodian cuisine. Explore our carefully curated menu of traditional Khmer dishes, signature soups, and local delicacies.',
    keywords: 'one more restaurant menu, khmer food menu, cambodian dishes, traditional khmer soup, phnom penh culinary, signature khmer food',
    ogImage: '/images/menu-share.jpg'
  },
  '/events': {
    title: 'Exquisite Events & Catering | One More Restaurant',
    description: 'Host your memorable occasions with us. From corporate dinners to family celebrations, we offer premium event spaces and high-quality Khmer catering services.',
    keywords: 'event catering phnom penh, restaurant event spaces, corporate dinner venue, family celebration hall, khmer food catering',
    ogImage: '/images/events-share.jpg'
  },
  '/branches': {
    title: 'Our Branches in Phnom Penh | One More Restaurant',
    description: 'Visit One More Restaurant. Explore our beautiful Toul Kork and Boeung Kak branches, featuring lush gardens and private VIP dining rooms.',
    keywords: 'one more restaurant branches, toul kork dining, boeung kak restaurant, phnom penh food spots, vip rooms dining',
    ogImage: '/images/branches-share.jpg'
  },
  '/branches/toul-kork': {
    title: 'One More Restaurant - Toul Kork Branch',
    description: 'Experience authentic Cambodian dining at One More Restaurant Toul Kork. Ideal for family gatherings, business meetings, and elegant events in Phnom Penh.',
    keywords: 'one more restaurant toul kork, toul kork dining, toul kork private rooms, family gathering restaurant toul kork',
    ogImage: '/images/toul-kork-share.jpg'
  },
  '/branches/boeung-kak': {
    title: 'One More Restaurant - Boeung Kak Branch',
    description: 'Dine in style at One More Restaurant Boeung Kak. Enjoy our signature Khmer cuisine in a modern architectural setting with premium service and garden views.',
    keywords: 'one more restaurant boeung kak, boeung kak fine dining, boeung kak vip rooms, garden restaurant boeung kak',
    ogImage: '/images/boeung-kak-share.jpg'
  },
  '/gallery': {
    title: 'Photo Gallery & Venue | One More Restaurant',
    description: 'Step into our culinary world. View photos of our traditional Khmer dishes, elegant event spaces, private dining rooms, and garden settings.',
    keywords: 'one more restaurant gallery, khmer food photos, dining rooms pictures, events venue photos, garden restaurant phnom penh',
    ogImage: '/images/gallery-share.jpg'
  },
  '/about': {
    title: 'Our Story & Culinary Heritage | One More Restaurant',
    description: 'Learn about our passion for preserving authentic Cambodian culinary heritage. Read the history and values behind One More Restaurant.',
    keywords: 'one more restaurant history, cambodian food heritage, khmer culinary values, traditional cooking secrets',
    ogImage: '/images/about-share.jpg'
  },
  '/reservations': {
    title: 'Book a Table & VIP Rooms | One More Restaurant',
    description: 'Reserve your dining table or private VIP room at One More Restaurant. Fast, easy booking for family dining, business lunch, or special events.',
    keywords: 'book a table phnom penh, reserve vip room, restaurant reservations phnom penh, group dining booking',
    ogImage: '/images/reservations-share.jpg'
  },
  '/reservation': {
    title: 'Book a Table & VIP Rooms | One More Restaurant',
    description: 'Reserve your dining table or private VIP room at One More Restaurant. Fast, easy booking for family dining, business lunch, or special events.',
    keywords: 'book a table phnom penh, reserve vip room, restaurant reservations phnom penh, group dining booking',
    ogImage: '/images/reservations-share.jpg'
  },
  '/careers': {
    title: 'Careers & Join Our Team | One More Restaurant',
    description: 'Build your career in hospitality with One More Restaurant. Explore job opportunities in culinary arts, dining service, and management.',
    keywords: 'hospitality jobs phnom penh, chef careers cambodia, restaurant service jobs, waitstaff vacancies phnom penh',
    ogImage: '/images/careers-share.jpg'
  },
  '/contact': {
    title: 'Contact Us & Location Map | One More Restaurant',
    description: 'Get in touch with One More Restaurant. Find address details, phone numbers, opening hours, and location maps for our Phnom Penh branches.',
    keywords: 'one more restaurant phone number, restaurant address phnom penh, toul kork opening hours, boeung kak location map',
    ogImage: '/images/contact-share.jpg'
  }
};

export const seoMetadataKH: Record<string, SEOMetadata> = {
  '/': {
    title: 'ភោជនីយដ្ឋាន វ័នម័រ | អាហារខ្មែរពិតៗ ក្នុងរាជធានីភ្នំពេញ',
    description: 'រីករាយជាមួយរសជាតិអាហារខ្មែរពិតៗនៅភោជនីយដ្ឋាន វ័នម័រ។ ស្វែងយល់ពីមុខម្ហូប កក់បន្ទប់ពិសារអាហារឯកជន និងរីករាយជាមួយសេវាកម្មដ៏ល្អឥតខ្ចោះ។',
    keywords: 'ភោជនីយដ្ឋាន វ័នម័រ, អាហារខ្មែរពិតៗ, ម្ហូបខ្មែរភ្នំពេញ, ភោជនីយដ្ឋានលំដាប់ខ្ពស់, បន្ទប់អាហារឯកជន, ម្ហូបប្រពៃណីខ្មែរ, អាហារដ្ឋានភ្នំពេញ',
    ogImage: '/logo-share.jpg'
  },
  '/menu': {
    title: 'បញ្ជីមុខម្ហូបខ្មែរពិតៗ | ភោជនីយដ្ឋាន វ័នម័រ',
    description: 'ស្វែងយល់ពីបេតិកភណ្ឌអាហារខ្មែរដ៏សម្បូរបែប។ រីករាយជាមួយមុខម្ហូបប្រពៃណី ស៊ុបពិសេសៗ និងអាហារសម្រន់ក្នុងស្រុក។',
    keywords: 'មុខម្ហូបភោជនីយដ្ឋានវ័នម័រ, បញ្ជីមុខម្ហូបខ្មែរ, ម្ហូបខ្មែរប្រពៃណី, ស៊ុបខ្មែរពិសេសៗ, អាហារខ្មែររសជាតិដើម',
    ogImage: '/images/menu-share.jpg'
  },
  '/events': {
    title: 'រៀបចំកម្មវិធី និងអាហារសម្រន់ | ភោជនីយដ្ឋាន វ័នម័រ',
    description: 'រៀបចំកម្មវិធីដ៏គួរឱ្យចងចាំរបស់អ្នកជាមួយយើងខ្ញុំ។ ចាប់ពីការប្រជុំធុរកិច្ចរហូតដល់ការជួបជុំគ្រួសារ យើងមានទីកន្លែង និងអាហារសម្រន់ដ៏ល្អបំផុត។',
    keywords: 'សេវាកម្មអាហារសម្រន់ភ្នំពេញ, ទីកន្លែងរៀបចំកម្មវិធី, កម្មវិធីប្រជុំធុរកិច្ច, កម្មវិធីជួបជុំគ្រួសារ, អាហារសម្រន់លំដាប់ខ្ពស់',
    ogImage: '/images/events-share.jpg'
  },
  '/branches': {
    title: 'សាខារបស់យើង ក្នុងភ្នំពេញ | ភោជនីយដ្ឋាន វ័នម័រ',
    description: 'អញ្ជើញមកកាន់ភោជនីយដ្ឋាន វ័នម័រ ក្នុងទីក្រុងភ្នំពេញ។ ស្វែងយល់ពីសាខាទួលគោក និងបឹងកក់ របស់យើង ដែលមានបន្ទប់ VIP ពិសេសៗ។',
    keywords: 'សាខាភោជនីយដ្ឋានវ័នម័រ, វ័នម័រទួលគោក, វ័នម័របឹងកក់, បន្ទប់ VIP ភ្នំពេញ, អាហារដ្ឋានសួនច្បារ',
    ogImage: '/images/branches-share.jpg'
  },
  '/branches/toul-kork': {
    title: 'ភោជនីយដ្ឋាន វ័នម័រ - សាខាទួលគោក',
    description: 'រីករាយជាមួយការពិសាអាហារខ្មែរពិតៗនៅភោជនីយដ្ឋាន វ័នម័រ ទួលគោក។ ស័ក្តិសមសម្រាប់ជំនួបគ្រួសារ ការចរចាអាជីវកម្ម និងកម្មវិធីជប់លៀងផ្សេងៗ។',
    keywords: 'ភោជនីយដ្ឋានវ័នម័រទួលគោក, ទួលគោកអាហារដ្ឋាន, បន្ទប់ឯកជនទួលគោក, ជួបជុំគ្រួសារទួលគោក',
    ogImage: '/images/toul-kork-share.jpg'
  },
  '/branches/boeung-kak': {
    title: 'ភោជនីយដ្ឋាន វ័នម័រ - សាខាបឹងកក់',
    description: 'រីករាយជាមួយរសជាតិអាហារខ្មែរដ៏ឈ្ងុយឆ្ងាញ់នៅភោជនីយដ្ឋាន វ័នម័រ បឹងកក់។ បរិយាកាសស្ងប់ស្ងាត់ បន្ទប់ឯកជនទំនើប និងសួនច្បារដ៏ស្រស់ស្អាត។',
    keywords: 'ភោជនីយដ្ឋានវ័នម័របឹងកក់, បឹងកក់អាហារដ្ឋាន, បន្ទប់ឯកជនបឹងកក់, អាហារដ្ឋានសួនច្បារបឹងកក់',
    ogImage: '/images/boeung-kak-share.jpg'
  },
  '/gallery': {
    title: 'រូបភាព និងវិចិត្រសាល | ភោជនីយដ្ឋាន វ័នម័រ',
    description: 'ទស្សនារូបភាពមុខម្ហូបខ្មែរប្រពៃណី បន្ទប់អាហារឯកជន និងទិដ្ឋភាពទូទៅនៃភោជនីយដ្ឋាន វ័នម័រ។',
    keywords: 'រូបភាពភោជនីយដ្ឋានវ័នម័រ, រូបភាពម្ហូបខ្មែរ, រូបភាពបន្ទប់អាហារ VIP, ទិដ្ឋភាពភោជនីយដ្ឋាន',
    ogImage: '/images/gallery-share.jpg'
  },
  '/about': {
    title: 'ប្រវត្តិនៃការបង្កើត | ភោជនីយដ្ឋាន វ័នម័រ',
    description: 'ស្វែងយល់អំពីឆន្ទៈរបស់យើងក្នុងការថែរក្សាបេតិកភណ្ឌអាហារខ្មែរ។ អានប្រវត្តិ និងតម្លៃស្នូលរបស់ភោជនីយដ្ឋាន វ័នម័រ។',
    keywords: 'ប្រវត្តិភោជនីយដ្ឋានវ័នម័រ, การថែរក្សាម្ហូបខ្មែរ, ស្នាដៃម្ហូបខ្មែរប្រពៃណី, តម្លៃស្នូលវ័នម័រ',
    ogImage: '/images/about-share.jpg'
  },
  '/reservations': {
    title: 'កក់តុ និងបន្ទប់ VIP ទុកមុន | ភោជនីយដ្ឋាន វ័នម័រ',
    description: 'កក់តុ ឬបន្ទប់ VIP ឯកជនរបស់អ្នកនៅភោជនីយដ្ឋាន វ័នម័រ ដោយងាយស្រួល និងរហ័សទាន់ចិត្ត សម្រាប់អាហារជួបជុំផ្សេងៗ។',
    keywords: 'កក់តុភោជនីយដ្ឋានភ្នំពេញ, កក់បន្ទប់ VIP, កក់អាហារជួបជុំ, សេវាកម្មកក់តុអនឡាញ',
    ogImage: '/images/reservations-share.jpg'
  },
  '/reservation': {
    title: 'កក់តុ និងបន្ទប់ VIP ទុកមុន | ភោជនីយដ្ឋាន វ័នម័រ',
    description: 'កក់តុ ឬបន្ទប់ VIP ឯកជនរបស់អ្នកនៅភោជនីយដ្ឋាន វ័នម័រ ដោយងាយស្រួល និងរហ័សទាន់ចិត្ត សម្រាប់អាហារជួបជុំផ្សេងៗ។',
    keywords: 'កក់តុភោជនីយដ្ឋានភ្នំពេញ, កក់បន្ទប់ VIP, កក់អាហារជួបជុំ, សេវាកម្មកក់តុអនឡាញ',
    ogImage: '/images/reservations-share.jpg'
  },
  '/careers': {
    title: 'ឱកាសការងារ និងចូលរួមក្រុមការងារ | ភោជនីយដ្ឋាន វ័នម័រ',
    description: 'កសាងអាជីពរបស់អ្នកក្នុងវិស័យបដិសណ្ឋារកិច្ចជាមួយភោជនីយដ្ឋាន វ័នម័រ។ ស្វែងរកឱកាសការងារផ្នែកចម្អិនអាហារ សេវាកម្ម និងការគ្រប់គ្រង។',
    keywords: 'ការងារភោជនីយដ្ឋានភ្នំពេញ, ឱកាសការងារចុងភៅ, การងារសេវាកម្មអាហារ, ជ្រើសរើសបុគ្គលិកវ័នម័រ',
    ogImage: '/images/careers-share.jpg'
  },
  '/contact': {
    title: 'ទាក់ទងមកយើងខ្ញុំ និងផែនទីទីតាំង | ភោជនីយដ្ឋាន វ័នម័រ',
    description: 'ទំនាក់ទំនងមកកាន់ភោជនីយដ្ឋាន វ័នម័រ។ ស្វែងរកព័ត៌មានលម្អិតអំពីអាសយដ្ឋាន លេខទូរស័ព្ទ ម៉ោងបើកដំណើរការ និងផែនទីទីតាំង។',
    keywords: 'លេខទូរស័ព្ទភោជនីយដ្ឋានវ័នម័រ, អាសយដ្ឋានភោជនីយដ្ឋាន, ម៉ោងបើកដំណើរការ, ផែនទីទីតាំងវ័នម័រ',
    ogImage: '/images/contact-share.jpg'
  }
};

export function getSEOMetadata(pathname: string, isKhmer: boolean): SEOMetadata {
  // Normalize the pathname: strip leading/trailing slashes and query params
  const cleanPath = '/' + pathname.split('?')[0].replace(/^\/|\/$/g, '');
  const dictionary = isKhmer ? seoMetadataKH : seoMetadataEN;
  return dictionary[cleanPath] || dictionary['/'];
}
