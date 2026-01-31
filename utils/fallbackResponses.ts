import type { SupportedLanguageCode } from '../types';

interface FallbackResponse {
  pattern: RegExp;
  responses: Partial<Record<SupportedLanguageCode, string[]>>;
}

// Common negotiation patterns and responses
export const FALLBACK_RESPONSES: FallbackResponse[] = [
  // Greetings
  {
    pattern: /^(hello|hi|hey|namaste|namaskar|vanakkam|sat sri akal)/i,
    responses: {
      en: ['Hello! How can I help you with this listing?', 'Hi there! Interested in this product?'],
      hi: ['नमस्ते! मैं इस लिस्टिंग में आपकी कैसे मदद कर सकता हूं?', 'नमस्ते! इस उत्पाद में रुचि है?'],
      bn: ['নমস্কার! আমি এই তালিকায় আপনাকে কীভাবে সাহায্য করতে পারি?'],
      te: ['నమస్తే! ఈ లిస్టింగ్‌లో నేను మీకు ఎలా సహాయపడగలను?'],
      mr: ['नमस्कार! या यादीत मी तुम्हाला कशी मदत करू शकतो?'],
      ta: ['வணக்கம்! இந்த பட்டியலில் நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?'],
      gu: ['નમસ્તે! આ સૂચિમાં હું તમને કેવી રીતે મદદ કરી શકું?'],
      kn: ['ನಮಸ್ಕಾರ! ಈ ಪಟ್ಟಿಯಲ್ಲಿ ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?']
    }
  },
  // Price inquiry
  {
    pattern: /(price|cost|rate|kitna|kya|daam|kimat)/i,
    responses: {
      en: ['The listed price is shown above. We can discuss if you have a different offer.'],
      hi: ['सूचीबद्ध कीमत ऊपर दिखाई गई है। यदि आपके पास कोई अलग प्रस्ताव है तो हम चर्चा कर सकते हैं।'],
      te: ['జాబితా చేయబడిన ధర పైన చూపబడింది. మీకు వేరే ఆఫర్ ఉంటే మేము చర్చించవచ్చు.']
    }
  },
  // Availability
  {
    pattern: /(available|stock|quantity|milega|hai kya)/i,
    responses: {
      en: ['Yes, this product is available. The quantity is mentioned in the listing.'],
      hi: ['हां, यह उत्पाद उपलब्ध है। मात्रा लिस्टिंग में उल्लिखित है।'],
      te: ['అవును, ఈ ఉత్పత్తి అందుబాటులో ఉంది. పరిమాణం లిస్టింగ్‌లో పేర్కొనబడింది.']
    }
  },
  // Quality
  {
    pattern: /(quality|grade|condition|kaisa|accha)/i,
    responses: {
      en: ['The quality grade is mentioned in the listing. Feel free to ask specific questions.'],
      hi: ['गुणवत्ता ग्रेड लिस्टिंग में उल्लिखित है। विशिष्ट प्रश्न पूछने के लिए स्वतंत्र महसूस करें।']
    }
  },
  // Negotiation
  {
    pattern: /(discount|lower|reduce|kam)/i,
    responses: {
      en: ['I understand you want a better price. What is your offer?'],
      hi: ['मैं समझता हूं कि आप बेहतर कीमत चाहते हैं। आपका प्रस्ताव क्या है?']
    }
  },
  // Agreement
  {
    pattern: /(ok|okay|yes|han|thik|agree|accept|done|pakka|final)/i,
    responses: {
      en: ['Great! Let\'s proceed with the deal.', 'Perfect! Shall we finalize the terms?'],
      hi: ['बढ़िया! चलिए सौदा आगे बढ़ाते हैं।', 'बिल्कुल! क्या हम शर्तें अंतिम करें?']
    }
  },
  // Deal finalization
  {
    pattern: /(finalize|complete|confirm deal|close deal|pakka kar|deal done)/i,
    responses: {
      en: ['Excellent! Let me confirm the deal terms.'],
      hi: ['बढ़िया! मैं सौदे की शर्तें पक्की करता हूं।'],
      te: ['అద్భుతం! నేను డీల్ నిబంధనలను నిర్ధారిస్తాను.'],
      ta: ['அருமை! ஒப்பந்த விதிமுறைகளை உறுதிப்படுத்துகிறேன்.']
    }
  },
  // Rejection
  {
    pattern: /(no|nahi|nope|refuse|reject)/i,
    responses: {
      en: ['No problem. Feel free to make a counter offer.', 'That\'s okay. What would work for you?'],
      hi: ['कोई बात नहीं। बेझिझक प्रतिप्रस्ताव दें।', 'ठीक है। आपके लिए क्या काम करेगा?']
    }
  },
  // Thank you
  {
    pattern: /(thank|thanks|dhanyavad|shukriya)/i,
    responses: {
      en: ['You\'re welcome! Happy to help.', 'My pleasure! Let me know if you need anything else.'],
      hi: ['आपका स्वागत है! मदद करके खुशी हुई।', 'मेरी खुशी! यदि आपको कुछ और चाहिए तो मुझे बताएं।']
    }
  }
];

// Default fallback when no pattern matches
export const DEFAULT_FALLBACK: Partial<Record<SupportedLanguageCode, string[]>> = {
  en: [
    'I understand. Could you please provide more details?',
    'Let me know what you\'re thinking.',
    'Feel free to share your thoughts on this.'
  ],
  hi: [
    'मैं समझता हूं। क्या आप अधिक विवरण दे सकते हैं?',
    'मुझे बताएं कि आप क्या सोच रहे हैं।',
    'इस पर अपने विचार साझा करने के लिए स्वतंत्र महसूस करें।'
  ],
  bn: [
    'আমি বুঝতে পারছি। আপনি কি আরও বিস্তারিত দিতে পারেন?',
    'আপনি কী ভাবছেন তা আমাকে জানান।'
  ],
  te: [
    'నేను అర్థం చేసుకున్నాను. దయచేసి మరిన్ని వివరాలు అందించగలరా?',
    'మీరు ఏమి ఆలోచిస్తున్నారో నాకు తెలియజేయండి.'
  ],
  mr: [
    'मला समजले. कृपया अधिक तपशील देऊ शकता का?',
    'तुम्ही काय विचार करत आहात ते मला सांगा.'
  ],
  ta: [
    'நான் புரிந்துகொள்கிறேன். மேலும் விவரங்களை வழங்க முடியுமா?',
    'நீங்கள் என்ன நினைக்கிறீர்கள் என்று எனக்குத் தெரியப்படுத்துங்கள்.'
  ],
  gu: [
    'હું સમજું છું. શું તમે વધુ વિગતો આપી શકો છો?',
    'તમે શું વિચારી રહ્યા છો તે મને જણાવો.'
  ],
  kn: [
    'ನಾನು ಅರ್ಥಮಾಡಿಕೊಂಡಿದ್ದೇನೆ. ದಯವಿಟ್ಟು ಹೆಚ್ಚಿನ ವಿವರಗಳನ್ನು ನೀಡಬಹುದೇ?',
    'ನೀವು ಏನು ಯೋಚಿಸುತ್ತಿದ್ದೀರಿ ಎಂದು ನನಗೆ ತಿಳಿಸಿ.'
  ]
};

/**
 * Detect if user wants to finalize the deal
 */
export function shouldFinalizeDeal(message: string): boolean {
  const finalizePatterns = [
    /(finalize|complete|confirm deal|close deal|pakka kar|deal done|sahi hai|theek hai)/i,
    /(yes.*finalize|yes.*complete|yes.*confirm|han.*pakka)/i,
    /(agree.*terms|accept.*terms|ok.*finalize)/i
  ];
  
  return finalizePatterns.some(pattern => pattern.test(message));
}

/**
 * Extract price from message if mentioned
 */
export function extractPriceFromMessage(message: string): number | null {
  // Match patterns like: "50", "₹50", "50 rupees", "50rs"
  const pricePatterns = [
    /₹\s*(\d+)/,
    /(\d+)\s*(rupees|rupee|rs|inr)/i,
    /price\s*(\d+)/i,
    /(\d+)\s*per/i
  ];
  
  for (const pattern of pricePatterns) {
    const match = message.match(pattern);
    if (match && match[1]) {
      const price = parseInt(match[1], 10);
      if (price > 0 && price < 1000000) { // Sanity check
        return price;
      }
    }
  }
  
  return null;
}

/**
 * Extract quantity from message if mentioned
 */
export function extractQuantityFromMessage(message: string): number | null {
  // Match patterns like: "50 quintal", "100 kg", "50 ton"
  const quantityPatterns = [
    /(\d+)\s*(quintal|kg|ton|quintals|kilos)/i,
    /quantity\s*(\d+)/i,
    /(\d+)\s*units?/i
  ];
  
  for (const pattern of quantityPatterns) {
    const match = message.match(pattern);
    if (match && match[1]) {
      const quantity = parseInt(match[1], 10);
      if (quantity > 0 && quantity < 100000) { // Sanity check
        return quantity;
      }
    }
  }
  
  return null;
}

/**
 * Get a fallback response based on user message and language
 */
export function getFallbackResponse(
  message: string,
  language: SupportedLanguageCode
): string {
  // Try to match patterns
  for (const fallback of FALLBACK_RESPONSES) {
    if (fallback.pattern.test(message)) {
      const responses = fallback.responses[language] || fallback.responses.en;
      if (responses && responses.length > 0) {
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }
  }

  // Return default fallback
  const defaults = DEFAULT_FALLBACK[language] || DEFAULT_FALLBACK.en;
  if (defaults && defaults.length > 0) {
    return defaults[Math.floor(Math.random() * defaults.length)];
  }
  
  return 'I understand. Please tell me more.';
}
