import json
import re
import zipfile
from datetime import datetime, timezone
from pathlib import Path
from xml.sax.saxutils import escape
from xml.etree import ElementTree


ROOT = Path(__file__).resolve().parents[1]
MOCKS = ROOT / "Frontend" / "src" / "mocks"
OUTPUT_DIR = ROOT / "mock-translations"


MANUAL = {
    "Celebrate Every Special Moment": "អបអររាល់ពេលវេលាពិសេស",
    "Event Inquiry": "សាកសួរអំពីកម្មវិធី",
    "8 guests": "ភ្ញៀវ ៨ នាក់",
    "Garden Views": "ទិដ្ឋភាពសួនច្បារ",
    "Our Story": "រឿងរ៉ាវរបស់យើង",
    "Elevating Cambodian culinary art since 2008": "លើកស្ទួយសិល្បៈម្ហូបអាហារកម្ពុជាតាំងពីឆ្នាំ ២០០៨",
    "One More Restaurant was born out of a deep-seated love for Cambodia's traditional recipes and a desire to elevate them to a world-class dining experience. Our name, \"One More,\" comes from the hospitable Khmer culture where hosts always offer \"one more\" plate of rice, representing warmth, generosity, and abundance.": "ភោជនីយដ្ឋាន One More កើតចេញពីក្តីស្រឡាញ់យ៉ាងជ្រាលជ្រៅចំពោះរូបមន្តម្ហូបបែបប្រពៃណីកម្ពុជា និងបំណងលើកកម្ពស់ម្ហូបទាំងនោះឱ្យក្លាយជាបទពិសោធន៍ទទួលទានអាហារលំដាប់ពិភពលោក។ ឈ្មោះ «One More» របស់យើងមានប្រភពពីវប្បធម៌បដិសណ្ឋារកិច្ចខ្មែរ ដែលម្ចាស់ផ្ទះតែងតែជូនបាយ «មួយចានទៀត» ដល់ភ្ញៀវ ជានិមិត្តរូបនៃភាពកក់ក្តៅ ចិត្តទូលាយ និងភាពសម្បូរបែប។",
    "We collaborate closely with local farmers, sourcing organic ingredients from the fertile plains of Tonle Sap and the highlands of Battambang. Our chefs combine traditional cooking methods with contemporary presentation techniques to create dishes that pay homage to Cambodia’s history while appealing to modern culinary tastes.": "យើងសហការយ៉ាងជិតស្និទ្ធជាមួយកសិករក្នុងស្រុក ដោយជ្រើសរើសគ្រឿងផ្សំសរីរាង្គពីវាលទំនាបដ៏មានជីជាតិជុំវិញបឹងទន្លេសាប និងតំបន់ខ្ពង់រាបនៃខេត្តបាត់ដំបង។ មេចុងភៅរបស់យើងបញ្ចូលគ្នានូវវិធីចម្អិនបែបប្រពៃណី និងបច្ចេកទេសរៀបចំម្ហូបបែបទំនើប ដើម្បីបង្កើតមុខម្ហូបដែលគោរពដល់ប្រវត្តិសាស្ត្រកម្ពុជា និងសមស្របនឹងរសនិយមសម័យថ្មី។",
    "Whether it is our signature Amok Trey, cooked gently in fresh banana leaves, or our signature cocktails infused with lemongrass and Kaffir lime, every detail is curated to deliver an authentic Khmer dining experience.": "មិនថាជាអាម៉ុកត្រីប្រចាំហាងដែលចម្អិនយ៉ាងផ្ចិតផ្ចង់ក្នុងស្លឹកចេកស្រស់ ឬស្រាក្រឡុកពិសេសដែលផ្សំក្លិនស្លឹកគ្រៃ និងស្លឹកក្រូចសើចនោះទេ រាល់ព័ត៌មានលម្អិតត្រូវបានរៀបចំយ៉ាងយកចិត្តទុកដាក់ ដើម្បីផ្តល់បទពិសោធន៍ទទួលទានម្ហូបខ្មែរដ៏ពិតប្រាកដ។",
    "Culinary Team": "ក្រុមចុងភៅ",
    "Our Mission": "បេសកកម្មរបស់យើង",
    "To preserve the culinary traditions of Cambodia, support our local farming communities, and present the refined flavors of Khmer cuisine to the global community with genuine warmth and excellence.": "ថែរក្សាប្រពៃណីម្ហូបអាហារកម្ពុជា គាំទ្រសហគមន៍កសិករក្នុងស្រុក និងបង្ហាញរសជាតិដ៏ប្រណីតនៃម្ហូបខ្មែរទៅកាន់សហគមន៍ពិភពលោក ដោយភាពកក់ក្តៅស្មោះត្រង់ និងឧត្តមភាព។",
    "Join Our Team": "ចូលរួមជាមួយក្រុមរបស់យើង",
    "We are always looking for passionate individuals who share our love for Khmer culinary traditions and premium service.": "យើងតែងតែស្វែងរកបុគ្គលដែលមានឆន្ទៈ និងចែករំលែកក្តីស្រឡាញ់ចំពោះប្រពៃណីម្ហូបខ្មែរ និងសេវាកម្មលំដាប់ខ្ពស់។",
    "Sous Chef": "ចុងភៅជំនួយ",
    "Full-time": "ពេញម៉ោង",
    "Assist in kitchen operations, crafting authentic Khmer cuisine under the Head Chef.": "ជួយក្នុងប្រតិបត្តិការផ្ទះបាយ និងរៀបចំម្ហូបខ្មែរដ៏ពិតប្រាកដក្រោមការដឹកនាំរបស់មេចុងភៅ។",
    "Server / Hospitality Specialist": "អ្នកបម្រើ / អ្នកជំនាញបដិសណ្ឋារកិច្ច",
    "Full-time / Part-time": "ពេញម៉ោង / ក្រៅម៉ោង",
    "Provide warm, professional hospitality in an upscale dining environment.": "ផ្តល់សេវាបដិសណ្ឋារកិច្ចប្រកបដោយភាពកក់ក្តៅ និងវិជ្ជាជីវៈក្នុងបរិយាកាសទទួលទានអាហារប្រណីត។",
    "Host / Hostess": "អ្នកទទួលភ្ញៀវ",
    "Welcome guests, manage seating charts, and coordinate reservation flows.": "ស្វាគមន៍ភ្ញៀវ គ្រប់គ្រងប្លង់កន្លែងអង្គុយ និងសម្របសម្រួលដំណើរការកក់តុ។",
    "Contact Us": "ទាក់ទងមកយើង",
    "Have questions or want to host a private event? Get in touch with us and we will get back to you shortly.": "មានសំណួរ ឬចង់រៀបចំកម្មវិធីឯកជនមែនទេ? សូមទាក់ទងមកយើង ហើយយើងនឹងឆ្លើយតបក្នុងពេលឆាប់ៗនេះ។",
    "Get in Touch": "ទាក់ទងមកយើង",
    "No. 37, Street 315, Boeung Kak I, Tuol Kork, Phnom Penh, Cambodia": "ផ្ទះលេខ ៣៧ ផ្លូវ ៣១៥ បឹងកក់ទី១ ទួលគោក រាជធានីភ្នំពេញ ប្រទេសកម្ពុជា",
    "Send a Message": "ផ្ញើសារ",
    "Message": "សារ",
    "Send Message": "ផ្ញើសារ",
    "Special Events & Celebrations": "កម្មវិធីពិសេស និងពិធីអបអរសាទរ",
    "Host your memorable moments at One More Restaurant or join our exclusive culinary events.": "រៀបចំពេលវេលាដ៏គួរឱ្យចងចាំរបស់អ្នកនៅភោជនីយដ្ឋាន One More ឬចូលរួមកម្មវិធីម្ហូបអាហារផ្តាច់មុខរបស់យើង។",
    "Khmer New Year Banquet": "ពិធីជប់លៀងចូលឆ្នាំខ្មែរ",
    "April 14 - 16, 2026": "ថ្ងៃទី ១៤ - ១៦ ខែមេសា ឆ្នាំ ២០២៦",
    "A festive three-day culinary celebration featuring traditional dances and special family set menus.": "ពិធីអបអរម្ហូបអាហាររយៈពេលបីថ្ងៃ ដោយមានរបាំប្រពៃណី និងឈុតម្ហូបគ្រួសារពិសេស។",
    "Exclusive Wine Pairing Dinner": "អាហារពេលល្ងាចផ្គូផ្គងស្រាវ៉ាញផ្តាច់មុខ",
    "Every First Friday": "រៀងរាល់ថ្ងៃសុក្រដំបូងនៃខែ",
    "A curated 5-course Khmer fusion menu paired with premium French and Australian wines.": "ម៉ឺនុយម្ហូបខ្មែរច្នៃប្រឌិត ៥ វគ្គ ដែលជ្រើសរើសយ៉ាងពិសេស និងផ្គូផ្គងជាមួយស្រាវ៉ាញបារាំង និងអូស្ត្រាលីលំដាប់ខ្ពស់។",
    "Private Cooking Workshop": "សិក្ខាសាលាចម្អិនអាហារឯកជន",
    "By Request": "តាមការស្នើសុំ",
    "Learn heirloom Khmer recipes directly from our master chefs in our professional kitchen.": "រៀនរូបមន្តម្ហូបខ្មែរបុរាណដោយផ្ទាល់ពីមេចុងភៅជំនាញរបស់យើងនៅក្នុងផ្ទះបាយស្តង់ដារវិជ្ជាជីវៈ។",
    "Our Gallery": "វិចិត្រសាលរបស់យើង",
    "Take a visual journey through the elegant spaces, fine dining setups, cooking workshops, and exquisite Khmer dishes of One More Restaurant.": "ធ្វើដំណើរតាមរយៈរូបភាពនៃទីធ្លាដ៏ប្រណីត ការរៀបចំអាហារលំដាប់ខ្ពស់ សិក្ខាសាលាចម្អិនអាហារ និងម្ហូបខ្មែរដ៏ល្អវិចិត្ររបស់ភោជនីយដ្ឋាន One More។",
    "OMR Moments": "អនុស្សាវរីយ៍ OMR",
    "Elegance and ambience": "ភាពប្រណីត និងបរិយាកាស",
    "Gourmet dining setups": "ការរៀបចំតុអាហារប្រណីត",
    "Elegant restaurant interior": "ផ្នែកខាងក្នុងភោជនីយដ្ឋានដ៏ប្រណីត",
    "Exquisite plates and presentation": "ចានម្ហូប និងការរៀបចំដ៏ល្អវិចិត្រ",
    "Culinary creations close-up": "ទិដ្ឋភាពជិតនៃស្នាដៃម្ហូបអាហារ",
    "Kitchen operations and cooking": "ប្រតិបត្តិការផ្ទះបាយ និងការចម្អិនអាហារ",
    "Experience Authentic Khmer Cuisine": "ស្វែងយល់បទពិសោធន៍ម្ហូបខ្មែរដ៏ពិតប្រាកដ",
    "Traditional Cambodian flavors served in a modern dining experience. Crafted with passion, fresh local organic produce, and heirloom recipes.": "រសជាតិប្រពៃណីកម្ពុជា បម្រើក្នុងបទពិសោធន៍ទទួលទានអាហារបែបទំនើប។ ចម្អិនដោយក្តីស្រឡាញ់ ប្រើបន្លែសរីរាង្គស្រស់ក្នុងស្រុក និងរូបមន្តបុរាណ។",
    "Amok Trey": "អាម៉ុកត្រី",
    "SIGNATURE · MAIN COURSE": "មុខម្ហូបពិសេស · ម្ហូបចម្បង",
    "A timeless Cambodian treasure — tender river fish steamed within a banana leaf parcel, enveloped in a velvety coconut-lemongrass curry mousse, perfumed with galangal and kaffir lime.": "កេរដំណែលកម្ពុជាដ៏មិនចេះសាបសូន្យ — ត្រីទន្លេសាច់ទន់ចំហុយក្នុងស្លឹកចេក ស្រោបដោយគ្រឿងការីខ្ទិះដូង និងស្លឹកគ្រៃដ៏រលោង ព្រមជាមួយក្លិនរំដេង និងស្លឹកក្រូចសើច។",
    "Chef's Choice ✦": "ជម្រើសមេចុងភៅ ✦",
    "Up to 10 guests": "រហូតដល់ ១០ នាក់",
    "Spacious tables for 4-10, high chairs available, playful sharing platters designed for togetherness.": "តុធំទូលាយសម្រាប់ ៤-១០ នាក់ មានកៅអីខ្ពស់សម្រាប់កុមារ និងចានម្ហូបចែករំលែកដែលរៀបចំឡើងសម្រាប់ភាពស្និទ្ធស្នាល។",
    "8–20 guests · AV ready": "៨–២០ នាក់ · មានឧបករណ៍សោតទស្សន៍រួចជាស្រេច",
    "An intimate enclosed dining room for 8–20, with dedicated staff, custom menus and AV capabilities.": "បន្ទប់ទទួលទានអាហារឯកជនសម្រាប់ ៨–២០ នាក់ មានបុគ្គលិកផ្តាច់មុខ ម៉ឺនុយតាមតម្រូវការ និងឧបករណ៍សោតទស្សន៍។",
    "Full-day packages available": "មានកញ្ចប់សេវាពេញមួយថ្ងៃ",
    "Quiet, professional atmosphere with private tables, power outlets, screen connectivity and curated lunch sets.": "បរិយាកាសស្ងប់ស្ងាត់ និងវិជ្ជាជីវៈ ជាមួយតុឯកជន ព្រីភ្លើង ការតភ្ជាប់អេក្រង់ និងឈុតអាហារថ្ងៃត្រង់ដែលបានជ្រើសរើស។",
    "Kid Zone": "តំបន់កុមារ",
    "Ages 2–12 · Supervised": "អាយុ ២–១២ ឆ្នាំ · មានអ្នកមើលថែ",
    "A dedicated play corner with gentle Khmer-inspired activities, kid-friendly menu and attentive family hosts.": "កន្លែងលេងផ្តាច់មុខ មានសកម្មភាពបែបខ្មែរសមស្របសម្រាប់កុមារ ម៉ឺនុយកុមារ និងអ្នកទទួលភ្ញៀវដែលយកចិត្តទុកដាក់ចំពោះគ្រួសារ។",
    "Event & Gala": "កម្មវិធី និងពិធីជប់លៀង",
    "Up to 150 guests": "រហូតដល់ ១៥០ នាក់",
    "Expansive layout options with custom decor, state-of-the-art sound systems, and dedicated banquet planners.": "ជម្រើសប្លង់ធំទូលាយជាមួយការតុបតែងតាមតម្រូវការ ប្រព័ន្ធសំឡេងទំនើប និងអ្នករៀបចំពិធីជប់លៀងផ្តាច់មុខ។",
    "Daily: 06:00 AM – 10:00 PM": "រៀងរាល់ថ្ងៃ៖ ៦:០០ ព្រឹក – ១០:០០ យប់",
    "63 Street R11, Phnom Penh 120210": "ផ្ទះលេខ ៦៣ ផ្លូវ R11 រាជធានីភ្នំពេញ ១២០២១០",
    "Sophea Prak": "សុភា ប្រាក់",
    "The Fish Amok here is absolute perfection! Steamed in a banana leaf with rich coconut cream and lemongrass paste. The garden setting makes you feel so relaxed.": "អាម៉ុកត្រីនៅទីនេះល្អឥតខ្ចោះ! ចំហុយក្នុងស្លឹកចេកជាមួយខ្ទិះដូងដ៏ឈ្ងុយឆ្ងាញ់ និងគ្រឿងស្លឹកគ្រៃ។ បរិយាកាសសួនច្បារធ្វើឱ្យមានអារម្មណ៍ធូរស្រាលណាស់។",
    "David Chen": "ដេវីដ ចិន",
    "3 weeks ago": "៣ សប្តាហ៍មុន",
    "We ordered the Khmer BBQ Platter and Beef Lok Lak. The beef was incredibly tender and flavorful, and the Kampot pepper sauce was out of this world.": "យើងបានកុម្ម៉ង់ឈុតសាច់អាំងខ្មែរ និងឡុកឡាក់សាច់គោ។ សាច់គោទន់ និងមានរសជាតិឆ្ងាញ់ខ្លាំង ហើយទឹកជ្រលក់ម្រេចកំពតពិតជាអស្ចារ្យ។",
    "Piseth Bun": "ពិសិដ្ឋ ប៊ុន",
    "A truly beautiful restaurant serving authentic Khmer cuisine. The soup is delicious, and their commitment to local farmers and sustainability is inspiring.": "ភោជនីយដ្ឋានដ៏ស្រស់ស្អាតដែលបម្រើម្ហូបខ្មែរពិតប្រាកដ។ សម្លមានរសជាតិឆ្ងាញ់ ហើយការប្តេជ្ញាចិត្តរបស់ពួកគេចំពោះកសិករក្នុងស្រុក និងនិរន្តរភាពគួរឱ្យកោតសរសើរ។",
    "Emma Watson": "អេម៉ា វ៉ាត់សុន",
    "1 week ago": "១ សប្តាហ៍មុន",
    "Outstanding service and presentation! Every dish felt like a work of art. The Toul Kork branch is absolutely gorgeous and perfect for business meetings.": "សេវាកម្ម និងការរៀបចំម្ហូបល្អឥតខ្ចោះ! មុខម្ហូបនីមួយៗប្រៀបដូចជាស្នាដៃសិល្បៈ។ សាខាទួលគោកពិតជាស្រស់ស្អាត និងស័ក្តិសមសម្រាប់កិច្ចប្រជុំអាជីវកម្ម។",
    "Gallery 1": "វិចិត្រសាល ១", "Gallery 2": "វិចិត្រសាល ២", "Gallery 3": "វិចិត្រសាល ៣",
    "Gallery 4": "វិចិត្រសាល ៤", "Gallery 5": "វិចិត្រសាល ៥", "Gallery 6": "វិចិត្រសាល ៦",
    "Freshly crafted dishes made with love.": "មុខម្ហូបចម្អិនថ្មីៗដោយក្តីស្រឡាញ់។",
    "Kuyteav Phnom Penh": "គុយទាវភ្នំពេញ",
    "BREAKFAST · SOUP": "អាហារពេលព្រឹក · ស៊ុប",
    "A classic Cambodian breakfast noodle soup featuring chewy rice noodles in a rich pork broth, topped with sliced pork, meatballs, and fresh herbs.": "គុយទាវអាហារពេលព្រឹកបែបកម្ពុជាបុរាណ មានសរសៃគុយទាវទន់ល្មើយក្នុងទឹកស៊ុបឆ្អឹងជ្រូកដ៏ឈ្ងុយឆ្ងាញ់ ដាក់សាច់ជ្រូកហាន់ ប្រហិត និងបន្លែជីរស្រស់។",
    "Bean Sprout Fried Noodles": "មីឆាសណ្តែកបណ្តុះ",
    "BREAKFAST · PAN-FRIED": "អាហារពេលព្រឹក · ឆាខ្ទះ",
    "Stir-fried yellow noodles tossed with crisp bean sprouts, garlic, green chives, and savory soy seasoning, served with a house sweet chili sauce.": "មីលឿងឆាជាមួយសណ្តែកបណ្តុះស្រួយ ខ្ទឹមស គូឆាយ និងទឹកស៊ីអ៊ីវ បម្រើជាមួយទឹកម្ទេសផ្អែមប្រចាំហាង។",
    "Beef Fried Kuyteav": "គុយទាវឆាសាច់គោ",
    "BREAKFAST · WOK-FIRED": "អាហារពេលព្រឹក · ឆាភ្លើងខ្លាំង",
    "Stir-fried flat rice noodles cooked in a roaring wok with tender slices of beef, Chinese broccoli, eggs, and a caramelized sweet soy sauce.": "សរសៃគុយទាវសំប៉ែតឆាភ្លើងខ្លាំងជាមួយសាច់គោទន់ ខាត់ណា ស៊ុត និងទឹកស៊ីអ៊ីវផ្អែមដែលឆាឡើងពណ៌ក្រហមត្នោត។",
    "Seafood Fried Noodles": "មីឆាគ្រឿងសមុទ្រ",
    "BREAKFAST · SEAFOOD": "អាហារពេលព្រឹក · គ្រឿងសមុទ្រ",
    "A delightful mix of fresh river shrimp, squid, and seasonal vegetables stir-fried with wheat noodles in a savory oyster-garlic sauce.": "បង្គាទន្លេស្រស់ មឹក និងបន្លែតាមរដូវ ឆាជាមួយមីស្រូវសាលីក្នុងទឹកជ្រលក់ប្រេងខ្យង និងខ្ទឹមសដ៏ឈ្ងុយឆ្ងាញ់។",
    "Pork Bone Kuyteav Soup": "គុយទាវស៊ុបឆ្អឹងជ្រូក",
    "BREAKFAST · HEARTY SOUP": "អាហារពេលព្រឹក · ស៊ុបឆ្អែតឆ្អន់",
    "Comforting rice noodle soup served with slow-simmered meaty pork ribs, roasted garlic oil, scallions, and crisp bean sprouts.": "គុយទាវទឹកស៊ុបកក់ក្តៅ បម្រើជាមួយឆ្អឹងជំនីជ្រូកដែលរំងាស់យូរ ប្រេងខ្ទឹមលីង ស្លឹកខ្ទឹម និងសណ្តែកបណ្តុះស្រួយ។",
    "BREAKFAST · COMFORT": "អាហារពេលព្រឹក · រសជាតិកក់ក្តៅ",
    "Savory Khmer noodle soup loaded with house-made beef meatballs, fresh herbs, lime, and chili paste in a clear, sweet bone broth.": "គុយទាវខ្មែររសជាតិឆ្ងាញ់ មានប្រហិតសាច់គោធ្វើផ្ទាល់ ជីរស្រស់ ក្រូចឆ្មារ និងគ្រឿងម្ទេសក្នុងទឹកស៊ុបឆ្អឹងថ្លាផ្អែមឆ្ងាញ់។",
    "Fish Amok in Coconut": "អាម៉ុកត្រីក្នុងផ្លែដូង",
    "LUNCH · SIGNATURE": "អាហារថ្ងៃត្រង់ · មុខម្ហូបពិសេស",
    "Tender snakehead fish fillets coated in a rich Lemongrass Kroeung curry paste and coconut cream, gently steamed inside a fresh young coconut.": "សាច់ត្រីរ៉ស់ទន់ស្រោបដោយគ្រឿងការីស្លឹកគ្រៃ និងខ្ទិះដូងដ៏ឈ្ងុយឆ្ងាញ់ ចំហុយថ្នមៗក្នុងផ្លែដូងខ្ចីស្រស់។",
    "LUNCH · LIGHT & FRESH": "អាហារថ្ងៃត្រង់ · ស្រាល និងស្រស់",
    "Shredded chicken breast tossed with crisp banana blossom, red bell peppers, fragrant Khmer herbs, and a tangy lime-chili dressing.": "សាច់ទ្រូងមាន់ហែកលាយជាមួយត្រយូងចេកស្រួយ ម្ទេសប្លោកក្រហម ជីរខ្មែរឈ្ងុយ និងទឹកជ្រលក់ក្រូចឆ្មារម្ទេសរសជាតិជូរហឹរ។",
    "Stir-Fried Cockles in Tamarind": "ងាវឆាអំពិលទុំ",
    "LUNCH · SAVORY": "អាហារថ្ងៃត្រង់ · រសជាតិឆ្ងាញ់",
    "Fresh local cockles wok-tossed in a sweet, sour, and mildly spicy tamarind sauce, garnished with aromatic holy basil.": "ងាវស្រស់ក្នុងស្រុកឆាជាមួយទឹកជ្រលក់អំពិលទុំរសជាតិផ្អែម ជូរ និងហឹរតិចៗ លម្អដោយម្រះព្រៅក្រអូប។",
    "LUNCH · CLASSIC": "អាហារថ្ងៃត្រង់ · បែបបុរាណ",
    "Stir-fried marinated beef cubes served on a bed of fresh lettuce, tomatoes, and onions, accompanied by a traditional Kampot pepper-lime dipping sauce.": "សាច់គោជ្រលក់គ្រឿងកាត់ជាដុំៗឆា បម្រើលើសាឡាត់ ប៉េងប៉ោះ និងខ្ទឹមបារាំងស្រស់ ជាមួយទឹកជ្រលក់ម្រេចកំពត និងក្រូចឆ្មារបែបប្រពៃណី។",
    "Charred Chili Lobster": "បង្កងឆាម្ទេស",
    "DINNER · LUXURY SEAFOOD": "អាហារពេលល្ងាច · គ្រឿងសមុទ្រប្រណីត",
    "Fresh local lobster wok-fried with garlic, chili, sweet onions, and a rich oyster-tamarind reduction, served with Kampot pepper lime dip.": "បង្កងស្រស់ក្នុងស្រុកឆាជាមួយខ្ទឹមស ម្ទេស ខ្ទឹមបារាំងផ្អែម និងទឹកជ្រលក់ប្រេងខ្យងអំពិលទុំខាប់ បម្រើជាមួយទឹកជ្រលក់ម្រេចកំពតក្រូចឆ្មារ។",
    "Samlor Korko with Catfish": "សម្លកកូរត្រីអណ្តែង",
    "DINNER · TRADITIONAL": "អាហារពេលល្ងាច · បែបប្រពៃណី",
    "A nourishing traditional Khmer green stew with catfish fillets, roasted ground rice, green papaya, pumpkin, eggplant, and mixed organic leafy greens.": "សម្លខ្មែរបែបប្រពៃណីដ៏មានជីវជាតិ ផ្សំពីសាច់ត្រីអណ្តែង អង្ករលីងបុក ល្ហុងខ្ចី ល្ពៅ ត្រប់ និងបន្លែស្លឹកសរីរាង្គចម្រុះ។",
    "Traditional Fish Amok": "អាម៉ុកត្រីបែបប្រពៃណី",
    "DINNER · CLASSIC": "អាហារពេលល្ងាច · បែបបុរាណ",
    "A timeless Cambodian treasure — tender river fish steamed within a banana leaf parcel, enveloped in a velvety coconut-lemongrass curry mousse.": "កេរដំណែលកម្ពុជាដ៏មិនចេះសាបសូន្យ — ត្រីទន្លេសាច់ទន់ចំហុយក្នុងស្លឹកចេក ស្រោបដោយគ្រឿងការីខ្ទិះដូង និងស្លឹកគ្រៃដ៏រលោង។",
    "Five Signature Dessert Platter": "ឈុតបង្អែមពិសេស ៥ មុខ",
    "DESSERT · PLATTER": "បង្អែម · ឈុតចែករំលែក",
    "A beautiful platter featuring a selection of classic Cambodian sweet treats, including pumpkin custard, sticky rice, and coconut jellies.": "ចានបង្អែមដ៏ស្រស់ស្អាតដែលមានបង្អែមកម្ពុជាបុរាណជាច្រើនមុខ រួមមានសង់ខ្យាល្ពៅ បាយដំណើប និងចាហួយដូង។",
    "Nom Krok (Coconut Pancakes)": "នំគ្រក់ (នំខ្ទិះដូង)",
    "DESSERT · TRADITIONAL": "បង្អែម · បែបប្រពៃណី",
    "Crispy, sweet, and custardy coconut rice pancakes made in a traditional cast-iron mold, served hot with a sweet coconut dipping cream.": "នំអង្ករខ្ទិះដូងស្រួយ ផ្អែម និងទន់ល្មើយ ធ្វើក្នុងពុម្ពដែកបុរាណ បម្រើក្តៅៗជាមួយខ្ទិះដូងផ្អែមសម្រាប់ជ្រលក់។",
    "Lemongrass Infused Iced Tea": "តែទឹកកកក្លិនស្លឹកគ្រៃ",
    "DRINKS · INFUSION": "ភេសជ្ជៈ · តែផ្សំក្លិន",
    "Chilled house-brewed black tea infused with fresh lemongrass stalks, kaffir lime leaves, and organic honey.": "តែខ្មៅឆុងប្រចាំហាងដាក់ត្រជាក់ ផ្សំក្លិនស្លឹកគ្រៃស្រស់ ស្លឹកក្រូចសើច និងទឹកឃ្មុំសរីរាង្គ។",
    "Wine": "ស្រាវ៉ាញ",
    "DRINKS · WINE": "ភេសជ្ជៈ · ស្រាវ៉ាញ",
    "Discover our curated selection of wines, carefully chosen to complement the rich flavors of Cambodian cuisine.": "ស្វែងយល់ពីជម្រើសស្រាវ៉ាញរបស់យើង ដែលត្រូវបានជ្រើសរើសយ៉ាងផ្ចិតផ្ចង់ឱ្យស៊ីគ្នាជាមួយរសជាតិដ៏សម្បូរបែបនៃម្ហូបកម្ពុជា។",
    "Experience our hospitality in our beautifully designed spaces, perfect for family dining or business gatherings.": "ទទួលបទពិសោធន៍បដិសណ្ឋារកិច្ចរបស់យើងក្នុងទីធ្លាដែលរចនាយ៉ាងស្រស់ស្អាត ស័ក្តិសមសម្រាប់អាហារជួបជុំគ្រួសារ ឬជំនួបអាជីវកម្ម។",
    "Event Space Capacity": "សមត្ថភាពទីធ្លាកម្មវិធី",
    "Up to 120 guests": "រហូតដល់ ១២០ នាក់",
    "Outdoor Garden Seating": "កន្លែងអង្គុយក្នុងសួនខាងក្រៅ",
    "Valet Parking": "សេវាចតរថយន្ត",
    "Live Traditional Music": "តន្ត្រីប្រពៃណីផ្ទាល់",
    "Weekends only": "តែចុងសប្តាហ៍ប៉ុណ្ណោះ",
    "Daily": "រៀងរាល់ថ្ងៃ",
    "11:00 AM - 10:00 PM Daily": "រៀងរាល់ថ្ងៃ ម៉ោង ១១:០០ ព្រឹក - ១០:០០ យប់",
    "Flagship": "សាខាគោល",
    "Heritage": "បេតិកភណ្ឌ",
    "Our original flagship branch offering an immersive journey into traditional Cambodian architecture and culinary arts.": "សាខាគោលដំបូងរបស់យើង ផ្តល់ដំណើរបទពិសោធន៍ដ៏ស៊ីជម្រៅទៅក្នុងស្ថាបត្យកម្មប្រពៃណីកម្ពុជា និងសិល្បៈម្ហូបអាហារ។",
    "Curved wood interior design": "ការរចនាផ្នែកខាងក្នុងដោយឈើកោង",
    "Extensive garden views": "ទិដ្ឋភាពសួនច្បារធំទូលាយ",
    "Exclusive VVIP halls": "សាល VVIP ផ្តាច់មុខ",
    "Boeung Kak Lake Area, Phnom Penh": "តំបន់បឹងកក់ រាជធានីភ្នំពេញ",
    "Modern": "ទំនើប",
    "A modern take on our classic heritage, offering expansive event halls and contemporary dining experiences.": "ការបកស្រាយបែបទំនើបលើបេតិកភណ្ឌបុរាណរបស់យើង ដោយផ្តល់សាលកម្មវិធីធំទូលាយ និងបទពិសោធន៍ទទួលទានអាហារសហសម័យ។",
    "Large event space for up to 150 guests": "ទីធ្លាកម្មវិធីធំសម្រាប់ភ្ញៀវរហូតដល់ ១៥០ នាក់",
    "Modern minimalist aesthetic": "សោភ័ណភាពទំនើបបែបសាមញ្ញ",
    "Premium corporate meeting rooms": "បន្ទប់ប្រជុំក្រុមហ៊ុនលំដាប់ខ្ពស់",
}


def pair_locale(en, kh, result):
    if isinstance(en, str) and isinstance(kh, str):
        result.setdefault(en, kh)
    elif isinstance(en, list) and isinstance(kh, list):
        for index, value in enumerate(en):
            if index < len(kh):
                pair_locale(value, kh[index], result)
    elif isinstance(en, dict) and isinstance(kh, dict):
        for key, value in en.items():
            if key in kh:
                pair_locale(value, kh[key], result)


def collect_strings(value, output):
    if isinstance(value, str):
        output.append(value)
    elif isinstance(value, list):
        for item in value:
            collect_strings(item, output)
    elif isinstance(value, dict):
        for item in value.values():
            collect_strings(item, output)


def translatable(value):
    text = value.strip()
    if not text or re.match(r"^(?:@/|https?://)", text, re.I):
        return False
    if re.match(r"^[+$\d\s:./-]+$", text):
        return False
    if re.match(r"^[\w.+-]+@[\w.-]+\.[a-z]{2,}$", text, re.I):
        return False
    if re.match(r"^(?:address|phone|email|hours|time|policy|toulKork|boeungKak)$", text, re.I):
        return False
    if text in {"family", "engagement", "catering", "corporate"}:
        return False
    return bool(re.search(r"[A-Za-z]", text))


def inline_cell(ref, text, style):
    safe = escape(text)
    return f'<c r="{ref}" s="{style}" t="inlineStr"><is><t xml:space="preserve">{safe}</t></is></c>'


def build_workbook(rows, output):
    sheet_rows = [
        f'<row r="1" ht="24" customHeight="1">{inline_cell("A1", "English", 1)}{inline_cell("B1", "Khmer", 1)}</row>'
    ]
    for index, (english, khmer) in enumerate(rows, start=2):
        max_len = max(len(english), len(khmer))
        height = min(90, max(21, 15 * (1 + max_len // 85)))
        cells = inline_cell(f"A{index}", english, 2) + inline_cell(f"B{index}", khmer, 3)
        sheet_rows.append(f'<row r="{index}" ht="{height}" customHeight="1">{cells}</row>')

    last = len(rows) + 1
    sheet_xml = f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <dimension ref="A1:B{last}"/>
  <sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/><selection pane="bottomLeft" activeCell="A2" sqref="A2"/></sheetView></sheetViews>
  <sheetFormatPr defaultRowHeight="18"/>
  <cols><col min="1" max="1" width="72" customWidth="1"/><col min="2" max="2" width="72" customWidth="1"/></cols>
  <sheetData>{''.join(sheet_rows)}</sheetData>
  <autoFilter ref="A1:B{last}"/>
</worksheet>'''

    files = {
        "[Content_Types].xml": '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>''',
        "_rels/.rels": '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>''',
        "docProps/app.xml": '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>Codex</Application><TitlesOfParts><vt:vector size="1" baseType="lpstr"><vt:lpstr>Translations</vt:lpstr></vt:vector></TitlesOfParts></Properties>''',
        "docProps/core.xml": f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>Mock Translations EN-KH</dc:title><dc:creator>Codex</dc:creator><dcterms:created xsi:type="dcterms:W3CDTF">{datetime.now(timezone.utc).isoformat()}</dcterms:created></cp:coreProperties>''',
        "xl/workbook.xml": '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Translations" sheetId="1" r:id="rId1"/></sheets></workbook>''',
        "xl/_rels/workbook.xml.rels": '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>''',
        "xl/styles.xml": '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="3"><font><sz val="11"/><name val="Aptos"/></font><font><b/><color rgb="FFFFFFFF"/><sz val="12"/><name val="Aptos"/></font><font><sz val="11"/><name val="Khmer OS Battambang"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF6B2F2F"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="2"><border><left/><right/><top/><bottom/><diagonal/></border><border><left style="thin"><color rgb="FFD9D9D9"/></left><right style="thin"><color rgb="FFD9D9D9"/></right><top style="thin"><color rgb="FFD9D9D9"/></top><bottom style="thin"><color rgb="FFD9D9D9"/></bottom><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="4"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf><xf numFmtId="0" fontId="2" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>''',
        "xl/worksheets/sheet1.xml": sheet_xml,
    }

    with zipfile.ZipFile(output, "w", zipfile.ZIP_DEFLATED) as workbook:
        for name, content in files.items():
            workbook.writestr(name, content.encode("utf-8"))

    with zipfile.ZipFile(output) as workbook:
        if workbook.testzip() is not None:
            raise RuntimeError("Workbook ZIP validation failed")
        for name in workbook.namelist():
            if name.endswith(".xml"):
                ElementTree.fromstring(workbook.read(name))
        sheet_text = workbook.read("xl/worksheets/sheet1.xml").decode("utf-8")
        if not any("\u1780" <= char <= "\u17ff" for char in sheet_text):
            raise RuntimeError("Khmer Unicode validation failed")


def main():
    en_locale = json.loads((ROOT / "Frontend/public/locales/en.json").read_text(encoding="utf-8"))
    kh_locale = json.loads((ROOT / "Frontend/public/locales/kh.json").read_text(encoding="utf-8"))
    locale_pairs = {}
    pair_locale(en_locale, kh_locale, locale_pairs)

    OUTPUT_DIR.mkdir(exist_ok=True)
    generated = []
    for mock_file in sorted(MOCKS.glob("*.json")):
        values = []
        collect_strings(json.loads(mock_file.read_text(encoding="utf-8")), values)
        unique = []
        seen = set()
        for value in values:
            if translatable(value) and value not in seen:
                seen.add(value)
                unique.append(value)

        rows = [(english, locale_pairs.get(english) or MANUAL.get(english, "")) for english in unique]
        missing = [english for english, khmer in rows if not khmer]
        if missing:
            raise RuntimeError(f"Missing Khmer translations in {mock_file.name}:\n" + "\n".join(missing))

        output = OUTPUT_DIR / f"{mock_file.stem}.xlsx"
        build_workbook(rows, output)
        generated.append((output, len(rows)))

    archive = ROOT / "mock-translations.zip"
    with zipfile.ZipFile(archive, "w", zipfile.ZIP_DEFLATED) as bundle:
        for output, _ in generated:
            bundle.write(output, output.name)

    for output, row_count in generated:
        print(f"Created {output.relative_to(ROOT)} with {row_count} translation rows.")
    print(f"Bundled {len(generated)} workbooks into {archive.name}.")


if __name__ == "__main__":
    main()
