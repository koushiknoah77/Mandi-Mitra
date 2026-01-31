import type { ListingData, SupportedLanguageCode } from '../types';

/**
 * Convert Bengali/Devanagari numerals to Arabic numerals
 */
function normalizeNumbers(text: string): string {
  const bengaliToArabic: Record<string, string> = {
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
  };
  
  const devanagariToArabic: Record<string, string> = {
    '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
    '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'
  };
  
  let normalized = text;
  
  // Convert Bengali numerals
  Object.entries(bengaliToArabic).forEach(([bengali, arabic]) => {
    normalized = normalized.replace(new RegExp(bengali, 'g'), arabic);
  });
  
  // Convert Devanagari numerals
  Object.entries(devanagariToArabic).forEach(([devanagari, arabic]) => {
    normalized = normalized.replace(new RegExp(devanagari, 'g'), arabic);
  });
  
  return normalized;
}

/**
 * Fallback listing extraction when AI fails
 * Extracts listing data from text using pattern matching
 */
export function extractListingFallback(
  text: string,
  language: SupportedLanguageCode
): ListingData | null {
  if (!text || text.trim().length < 5) {
    return null;
  }

  // Normalize numbers first (convert Bengali/Devanagari to Arabic numerals)
  const normalizedText = normalizeNumbers(text);
  console.log('Original text:', text);
  console.log('Normalized text:', normalizedText);

  // Extract price (₹, rupees, rs, টাকা, रुपये, etc.)
  const pricePatterns = [
    /₹\s*(\d+)/,
    /(\d+)\s*(rupees?|rs|inr|টাকা|টাকায়|টাকার|रुपये|रुपया|రూపాయలు|ரூபாய்|રૂપિયા|روپے)/i,
    /price\s*(\d+)/i,
    /(\d+)\s*per/i,
    /(\d+)\s*rate/i,
    /(\d+)\s*(taka|takay|takar)/i
  ];

  let price = 0;
  for (const pattern of pricePatterns) {
    const match = normalizedText.match(pattern);
    if (match && match[1]) {
      price = parseInt(match[1], 10);
      console.log('Price match found:', price, 'from pattern:', pattern);
      if (price > 0 && price < 1000000) break;
    }
  }

  // If no price found, try to find any number that could be price (usually larger number)
  if (price === 0) {
    const numbers = normalizedText.match(/\d+/g);
    console.log('All numbers found:', numbers);
    if (numbers && numbers.length > 0) {
      // Take the largest number as potential price
      const sortedNumbers = numbers.map(n => parseInt(n, 10)).sort((a, b) => b - a);
      if (sortedNumbers[0] > 100 && sortedNumbers[0] < 1000000) {
        price = sortedNumbers[0];
        console.log('Using largest number as price:', price);
      }
    }
  }

  // Extract quantity
  const quantityPatterns = [
    /(\d+)\s*(quintal|quintals|क्विंटल|কুইন্টাল|কুইন্টাল|క్వింటాళ్ల|குவிண்டால்)/i,
    /(\d+)\s*(kg|kgs|kilogram|किलो|কেজি|కిలో|கிலோ)/i,
    /(\d+)\s*(ton|tons|টন|टन|టన్|டன்)/i,
    /(\d+)\s*(bag|bags|बोरी|বস্তা|సంచులు)/i,
    /(\d+)\s*(quintal|kwintal)/i
  ];

  let quantity = 0;
  let unit = 'quintal';
  
  for (const pattern of quantityPatterns) {
    const match = normalizedText.match(pattern);
    if (match && match[1] && match[2]) {
      quantity = parseInt(match[1], 10);
      const unitText = match[2].toLowerCase();
      console.log('Quantity match found:', quantity, unitText);
      
      if (unitText.includes('kg') || unitText.includes('किलो') || unitText.includes('কেজি') || unitText.includes('కిలో') || unitText.includes('கிலோ')) {
        unit = 'kg';
      } else if (unitText.includes('ton') || unitText.includes('टन') || unitText.includes('টন') || unitText.includes('టన్') || unitText.includes('டன்')) {
        unit = 'ton';
      } else if (unitText.includes('bag') || unitText.includes('बोरी') || unitText.includes('বস্তা') || unitText.includes('సంচులు')) {
        unit = 'bags';
      } else {
        unit = 'quintal';
      }
      
      if (quantity > 0 && quantity < 100000) break;
    }
  }

  // If no quantity found, try to find smaller number (usually quantity)
  if (quantity === 0) {
    const numbers = normalizedText.match(/\d+/g);
    console.log('Looking for quantity in numbers:', numbers);
    if (numbers && numbers.length > 1) {
      // Take the smallest number as potential quantity
      const sortedNumbers = numbers.map(n => parseInt(n, 10)).sort((a, b) => a - b);
      if (sortedNumbers[0] > 0 && sortedNumbers[0] < 10000) {
        quantity = sortedNumbers[0];
        unit = 'quintal'; // default unit
        console.log('Using smallest number as quantity:', quantity);
      }
    }
  }

  // Extract produce name (common crops)
  const producePatterns = [
    { pattern: /(rice|चावल|ধান|চাল|বিক্রি|బియ్యం|அரிசி|ચોખા|چاول|ಅಕ್ಕಿ|ଚାଉଳ)/i, name: 'Rice' },
    { pattern: /(wheat|गेहूं|গম|గోధుమ|கோதுமை|ઘઉં|گندم|ಗೋಧಿ|ଗହମ)/i, name: 'Wheat' },
    { pattern: /(onion|प्याज|পেঁয়াজ|ఉల్లిపాయ|வெங்காயம்|ડુંગળી|پیاز|ಈರುಳ್ಳಿ|ପିଆଜ)/i, name: 'Onion' },
    { pattern: /(potato|आलू|আলু|బంగాళాదుంప|உருளைக்கிழங்கு|બટાકા|آلو|ಆಲೂಗಡ್ಡೆ|ଆଳୁ)/i, name: 'Potato' },
    { pattern: /(tomato|टमाटर|টমেটো|టమోటా|தக்காளி|ટામેટા|ٹماٹر|ಟೊಮ್ಯಾಟೊ|ଟମାଟୋ)/i, name: 'Tomato' },
    { pattern: /(cotton|कपास|তুলা|పత్తి|பருத்தி|કપાસ|کپاس|ಹತ್ತಿ|କପା)/i, name: 'Cotton' },
    { pattern: /(soybean|सोयाबीन|সয়াবিন|సోయాబీన్|சோயாபீன்|સોયાબીન|سویابین|ಸೋಯಾಬೀನ್|ସୋୟାବିନ)/i, name: 'Soybean' },
    { pattern: /(maize|corn|मक्का|ভুট্টা|మొక్కజొన్న|சோளம்|મકાઈ|مکئی|ಜೋಳ|ମକା)/i, name: 'Maize' },
    { pattern: /(sugarcane|गन्ना|আখ|చెরకు|கரும்பு|શેરડી|گنا|ಕಬ್ಬು|ଆଖୁ)/i, name: 'Sugarcane' },
    { pattern: /(turmeric|हल्दी|হলুদ|పసుపు|மஞ்சள்|હળદર|ہلدی|ಅರಿಶಿನ|ହଳଦୀ)/i, name: 'Turmeric' }
  ];

  let produceName = 'Agricultural Produce';
  for (const { pattern, name } of producePatterns) {
    if (pattern.test(text)) {
      produceName = name;
      console.log('Produce name found:', name);
      break;
    }
  }

  // Validate we have minimum required data
  if (price === 0 || quantity === 0) {
    console.log('Extraction failed - missing data. Price:', price, 'Quantity:', quantity);
    return null;
  }
  
  console.log('Extraction successful:', { produceName, quantity, unit, price });

  // Return extracted listing data
  return {
    produceName,
    quantity,
    unit,
    pricePerUnit: price,
    currency: 'INR',
    quality: 'Standard',
    description: `${quantity} ${unit} of ${produceName} at ₹${price} per ${unit}`
  };
}

/**
 * Get error message in user's language
 */
export function getExtractionErrorMessage(language: SupportedLanguageCode): string {
  const errorMessages: Record<SupportedLanguageCode, string> = {
    en: 'Please include: crop name, quantity, and price. Example: "50 quintal rice for 3000 rupees"',
    hi: 'कृपया शामिल करें: फसल का नाम, मात्रा और कीमत। उदाहरण: "3000 रुपये में 50 क्विंटल चावल"',
    bn: 'অনুগ্রহ করে অন্তর্ভুক্ত করুন: ফসলের নাম, পরিমাণ এবং দাম। উদাহরণ: "৩০০০ টাকায় ৫০ কুইন্টাল চাল"',
    te: 'దయచేసి చేర్చండి: పంట పేరు, పరిమాణం మరియు ధర. ఉదాహరణ: "3000 రూపాయలకు 50 క్వింటాళ్ల బియ్యం"',
    mr: 'कृपया समाविष्ट करा: पीक नाव, प्रमाण आणि किंमत. उदाहरण: "३००० रुपयांमध्ये ५० क्विंटल तांदूळ"',
    ta: 'தயவுசெய்து சேர்க்கவும்: பயிர் பெயர், அளவு மற்றும் விலை. உதாரணம்: "3000 ரூபாய்க்கு 50 குவிண்டால் அரிசி"',
    gu: 'કૃપા કરીને શામેલ કરો: પાકનું નામ, જથ્થો અને કિંમત. ઉદાહરણ: "૩૦૦૦ રૂપિયામાં ૫૦ ક્વિન્ટલ ચોખા"',
    ur: 'براہ کرم شامل کریں: فصل کا نام، مقدار اور قیمت۔ مثال: "3000 روپے میں 50 کوئنٹل چاول"',
    kn: 'ದಯವಿಟ್ಟು ಸೇರಿಸಿ: ಬೆಳೆ ಹೆಸರು, ಪ್ರಮಾಣ ಮತ್ತು ಬೆಲೆ. ಉದಾಹರಣೆ: "೩೦೦೦ ರೂಪಾಯಿಗೆ ೫೦ ಕ್ವಿಂಟಾಲ್ ಅಕ್ಕಿ"',
    or: 'ଦୟାକରି ଅନ୍ତର୍ଭୁକ୍ତ କରନ୍ତୁ: ଫସଲ ନାମ, ପରିମାଣ ଏବଂ ମୂଲ୍ୟ। ଉଦାହରଣ: "3000 ଟଙ୍କାରେ 50 କ୍ୱିଣ୍ଟାଲ ଚାଉଳ"',
    ml: 'ദയവായി ഉൾപ്പെടുത്തുക: വിള പേര്, അളവ്, വില. ഉദാഹരണം: "3000 രൂപയ്ക്ക് 50 ക്വിന്റൽ അരി"',
    pa: 'ਕਿਰਪਾ ਕਰਕੇ ਸ਼ਾਮਲ ਕਰੋ: ਫਸਲ ਦਾ ਨਾਮ, ਮਾਤਰਾ ਅਤੇ ਕੀਮਤ। ਉਦਾਹਰਣ: "3000 ਰੁਪਏ ਵਿੱਚ 50 ਕੁਇੰਟਲ ਚੌਲ"',
    as: 'অনুগ্ৰহ কৰি অন্তৰ্ভুক্ত কৰক: শস্যৰ নাম, পৰিমাণ আৰু মূল্য। উদাহৰণ: "৩০০০ টকাত ৫০ কুইণ্টেল চাউল"',
    mai: 'कृपया शामिल करू: फसलक नाम, मात्रा आ दाम। उदाहरण: "3000 रुपैया मे 50 क्विंटल चाउर"',
    sa: 'कृपया अन्तर्भूतं करोतु: शस्यनाम, परिमाणं, मूल्यं। उदाहरणम्: "3000 रूप्यकेषु 50 क्विण्टल तण्डुलः"',
    kok: 'कृपया धरा: पिकाचें नांव, प्रमाण आनी किंमत। उदाहरण: "3000 रुपयांनी 50 क्विंटल तांदूळ"',
    mni: 'Please include: crop name, quantity, price. Example: "50 quintal rice for 3000 rupees"',
    ne: 'कृपया समावेश गर्नुहोस्: बाली नाम, मात्रा र मूल्य। उदाहरण: "3000 रुपैयाँमा 50 क्विन्टल चामल"',
    brx: 'Please include: crop name, quantity, price. Example: "50 quintal rice for 3000 rupees"',
    doi: 'कृपया शामल करो: फसल दा नांऽ, मात्रा ते कीमत। उदाहरण: "3000 रुपये च 50 क्विंटल चावल"',
    ks: 'براہ کرم شامل کریں: فصل کا نام، مقدار اور قیمت۔ مثال: "3000 روپے میں 50 کوئنٹل چاول"',
    sat: 'Please include: crop name, quantity, price. Example: "50 quintal rice for 3000 rupees"',
    sd: 'مهرباني ڪري شامل ڪريو: فصل جو نالو، مقدار ۽ قيمت۔ مثال: "3000 رپين ۾ 50 ڪوئنٽل چانور"'
  };

  return errorMessages[language] || errorMessages.en;
}
