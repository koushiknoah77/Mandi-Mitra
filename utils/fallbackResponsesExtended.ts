import type { SupportedLanguageCode } from '../types';

/**
 * Extended fallback responses for MAXIMUM probability coverage
 * These are additional patterns beyond the core fallback system
 */

interface ExtendedFallbackResponse {
  pattern: RegExp;
  responses: Partial<Record<SupportedLanguageCode, string[]>>;
  weight?: number;
}

// ADDITIONAL PATTERNS FOR MAXIMUM COVERAGE
export const EXTENDED_FALLBACK_RESPONSES: ExtendedFallbackResponse[] = [
  // Casual quantity mentions without "want" or "how much"
  {
    pattern: /^(\d+)\s*(kg|quintal|ton|kilo|quintals)/i,
    weight: 1.0,
    responses: {
      en: [
        '{mentionedQuantity} {mentionedUnit}? Perfect! That would be ₹{estimatedTotal} at ₹{listingPrice} per {unit}. Interested?',
        'You need {mentionedQuantity} {mentionedUnit}. Total cost: ₹{estimatedTotal}. Rate: ₹{listingPrice}/{unit}. Deal?',
        '{mentionedQuantity} {mentionedUnit} is available! Price: ₹{estimatedTotal} (₹{listingPrice} per {unit}). Want it?',
        'For {mentionedQuantity} {mentionedUnit}, I can do ₹{estimatedTotal}. That\'s ₹{listingPrice} per {unit}. Good?',
        '{mentionedQuantity} {mentionedUnit}? Sure! Total: ₹{estimatedTotal} at ₹{listingPrice} per {unit}. Proceed?',
        'Got it! {mentionedQuantity} {mentionedUnit} = ₹{estimatedTotal}. My rate: ₹{listingPrice}/{unit}. Deal?'
      ],
      hi: [
        '{mentionedQuantity} {mentionedUnit}? बिल्कुल! यह ₹{estimatedTotal} होगा, ₹{listingPrice} प्रति {unit} पर। रुचि है?',
        'आपको {mentionedQuantity} {mentionedUnit} चाहिए। कुल लागत: ₹{estimatedTotal}। दर: ₹{listingPrice}/{unit}। सौदा?',
        '{mentionedQuantity} {mentionedUnit} उपलब्ध है! कीमत: ₹{estimatedTotal} (₹{listingPrice} प्रति {unit})। चाहिए?',
        '{mentionedQuantity} {mentionedUnit} के लिए, मैं ₹{estimatedTotal} दे सकता हूं। यह ₹{listingPrice} प्रति {unit} है। ठीक है?',
        '{mentionedQuantity} {mentionedUnit}? ज़रूर! कुल: ₹{estimatedTotal}, ₹{listingPrice} प्रति {unit} पर। आगे बढ़ें?',
        'समझ गया! {mentionedQuantity} {mentionedUnit} = ₹{estimatedTotal}। मेरी दर: ₹{listingPrice}/{unit}। सौदा?'
      ],
      bn: [
        '{mentionedQuantity} {mentionedUnit}? নিখুঁত! এটি ₹{estimatedTotal} হবে, ₹{listingPrice} প্রতি {unit} এ। আগ্রহী?',
        'আপনার {mentionedQuantity} {mentionedUnit} দরকার। মোট খরচ: ₹{estimatedTotal}। হার: ₹{listingPrice}/{unit}। চুক্তি?',
        '{mentionedQuantity} {mentionedUnit} উপলব্ধ! দাম: ₹{estimatedTotal} (₹{listingPrice} প্রতি {unit})। চান?'
      ],
      te: [
        '{mentionedQuantity} {mentionedUnit}? పర్ఫెక్ట్! అది ₹{estimatedTotal} అవుతుంది, ₹{listingPrice} ప్రతి {unit} వద్ద. ఆసక్తి ఉందా?',
        'మీకు {mentionedQuantity} {mentionedUnit} కావాలి. మొత్తం ఖర్చు: ₹{estimatedTotal}. రేటు: ₹{listingPrice}/{unit}. డీల్?',
        '{mentionedQuantity} {mentionedUnit} అందుబాటులో ఉంది! ధర: ₹{estimatedTotal} (₹{listingPrice} ప్రతి {unit}). కావాలా?'
      ],
      mr: [
        '{mentionedQuantity} {mentionedUnit}? परिपूर्ण! ते ₹{estimatedTotal} असेल, ₹{listingPrice} प्रति {unit} वर। रस आहे का?',
        'तुम्हाला {mentionedQuantity} {mentionedUnit} हवे आहे। एकूण खर्च: ₹{estimatedTotal}। दर: ₹{listingPrice}/{unit}। डील?'
      ],
      ta: [
        '{mentionedQuantity} {mentionedUnit}? சரியானது! அது ₹{estimatedTotal} ஆகும், ₹{listingPrice} ஒன்றுக்கு {unit} இல். ஆர்வமா?',
        'உங்களுக்கு {mentionedQuantity} {mentionedUnit} வேண்டும். மொத்த செலவு: ₹{estimatedTotal}. விலை: ₹{listingPrice}/{unit}. ஒப்பந்தமா?'
      ],
      gu: [
        '{mentionedQuantity} {mentionedUnit}? સંપૂર્ણ! તે ₹{estimatedTotal} હશે, ₹{listingPrice} પ્રતિ {unit} પર। રસ છે?',
        'તમને {mentionedQuantity} {mentionedUnit} જોઈએ છે। કુલ ખર્ચ: ₹{estimatedTotal}। દર: ₹{listingPrice}/{unit}। ડીલ?'
      ],
      kn: [
        '{mentionedQuantity} {mentionedUnit}? ಪರಿಪೂರ್ಣ! ಅದು ₹{estimatedTotal} ಆಗುತ್ತದೆ, ₹{listingPrice} ಪ್ರತಿ {unit} ನಲ್ಲಿ. ಆಸಕ್ತಿ ಇದೆಯೇ?',
        'ನಿಮಗೆ {mentionedQuantity} {mentionedUnit} ಬೇಕು. ಒಟ್ಟು ವೆಚ್ಚ: ₹{estimatedTotal}. ದರ: ₹{listingPrice}/{unit}. ಡೀಲ್?'
      ],
      ml: [
        '{mentionedQuantity} {mentionedUnit}? പെർഫെക്റ്റ്! അത് ₹{estimatedTotal} ആയിരിക്കും, ₹{listingPrice} ഒന്നിന് {unit} ൽ. താൽപ്പര്യമുണ്ടോ?',
        'നിങ്ങൾക്ക് {mentionedQuantity} {mentionedUnit} വേണം. ആകെ ചെലവ്: ₹{estimatedTotal}. നിരക്ക്: ₹{listingPrice}/{unit}. ഡീൽ?'
      ],
      pa: [
        '{mentionedQuantity} {mentionedUnit}? ਸੰਪੂਰਨ! ਇਹ ₹{estimatedTotal} ਹੋਵੇਗਾ, ₹{listingPrice} ਪ੍ਰਤੀ {unit} ਤੇ। ਦਿਲਚਸਪੀ ਹੈ?',
        'ਤੁਹਾਨੂੰ {mentionedQuantity} {mentionedUnit} ਚਾਹੀਦਾ ਹੈ। ਕੁੱਲ ਖਰਚਾ: ₹{estimatedTotal}। ਦਰ: ₹{listingPrice}/{unit}। ਡੀਲ?'
      ],
      ur: [
        '{mentionedQuantity} {mentionedUnit}؟ کامل! یہ ₹{estimatedTotal} ہوگا، ₹{listingPrice} فی {unit} پر۔ دلچسپی ہے؟',
        'آپ کو {mentionedQuantity} {mentionedUnit} چاہیے۔ کل لاگت: ₹{estimatedTotal}۔ شرح: ₹{listingPrice}/{unit}۔ ڈیل؟'
      ],
      or: [
        '{mentionedQuantity} {mentionedUnit}? ସମ୍ପୂର୍ଣ୍ଣ! ଏହା ₹{estimatedTotal} ହେବ, ₹{listingPrice} ପ୍ରତି {unit} ରେ। ଆଗ୍ରହ ଅଛି କି?',
        'ଆପଣଙ୍କୁ {mentionedQuantity} {mentionedUnit} ଦରକାର। ମୋଟ ଖର୍ଚ୍ଚ: ₹{estimatedTotal}। ହାର: ₹{listingPrice}/{unit}। ଡିଲ୍?'
      ]
    }
  },
  
  // "Tell me" variations
  {
    pattern: /(tell me|bata|batao|inform|let me know).*(\d+)/i,
    weight: 0.9,
    responses: {
      en: [
        'Sure! {mentionedQuantity} {mentionedUnit} costs ₹{estimatedTotal}. My rate is ₹{listingPrice} per {unit}. Interested?',
        'Of course! For {mentionedQuantity} {mentionedUnit}, the price is ₹{estimatedTotal}. That\'s ₹{listingPrice}/{unit}. Good?',
        'Absolutely! {mentionedQuantity} {mentionedUnit} = ₹{estimatedTotal} at ₹{listingPrice} per {unit}. Want to buy?'
      ],
      hi: [
        'ज़रूर! {mentionedQuantity} {mentionedUnit} की कीमत ₹{estimatedTotal} है। मेरी दर ₹{listingPrice} प्रति {unit} है। रुचि है?',
        'बेशक! {mentionedQuantity} {mentionedUnit} के लिए, कीमत ₹{estimatedTotal} है। यह ₹{listingPrice}/{unit} है। ठीक है?',
        'बिल्कुल! {mentionedQuantity} {mentionedUnit} = ₹{estimatedTotal}, ₹{listingPrice} प्रति {unit} पर। खरीदना चाहते हैं?'
      ]
    }
  },

  // "Can I get" variations
  {
    pattern: /(can i get|can i have|mil sakta|ho sakta|possible).*(\d+)/i,
    weight: 0.95,
    responses: {
      en: [
        'Yes! {mentionedQuantity} {mentionedUnit} is available. Price: ₹{estimatedTotal} (₹{listingPrice}/{unit}). Shall we proceed?',
        'Definitely! I have {mentionedQuantity} {mentionedUnit}. Total: ₹{estimatedTotal}. Rate: ₹{listingPrice} per {unit}. Deal?',
        'Sure thing! {mentionedQuantity} {mentionedUnit} can be arranged. Cost: ₹{estimatedTotal}. Interested?'
      ],
      hi: [
        'हां! {mentionedQuantity} {mentionedUnit} उपलब्ध है। कीमत: ₹{estimatedTotal} (₹{listingPrice}/{unit})। आगे बढ़ें?',
        'निश्चित रूप से! मेरे पास {mentionedQuantity} {mentionedUnit} है। कुल: ₹{estimatedTotal}। दर: ₹{listingPrice} प्रति {unit}। सौदा?',
        'ज़रूर! {mentionedQuantity} {mentionedUnit} की व्यवस्था की जा सकती है। लागत: ₹{estimatedTotal}। रुचि है?'
      ]
    }
  },

  // "Looking for" variations
  {
    pattern: /(looking for|searching|dhund raha|chahiye tha|need to buy).*(\d+)/i,
    weight: 0.9,
    responses: {
      en: [
        'Great! I have exactly what you need. {mentionedQuantity} {mentionedUnit} for ₹{estimatedTotal}. Rate: ₹{listingPrice}/{unit}. Perfect?',
        'You\'re in luck! {mentionedQuantity} {mentionedUnit} available. Price: ₹{estimatedTotal}. That\'s ₹{listingPrice} per {unit}. Deal?',
        'Found it! {mentionedQuantity} {mentionedUnit} = ₹{estimatedTotal} at ₹{listingPrice}/{unit}. Interested?'
      ],
      hi: [
        'बढ़िया! मेरे पास बिल्कुल वही है जो आपको चाहिए। {mentionedQuantity} {mentionedUnit} ₹{estimatedTotal} में। दर: ₹{listingPrice}/{unit}। बिल्कुल सही?',
        'आप भाग्यशाली हैं! {mentionedQuantity} {mentionedUnit} उपलब्ध। कीमत: ₹{estimatedTotal}। यह ₹{listingPrice} प्रति {unit} है। सौदा?',
        'मिल गया! {mentionedQuantity} {mentionedUnit} = ₹{estimatedTotal}, ₹{listingPrice}/{unit} पर। रुचि है?'
      ]
    }
  },

  // "What about" variations
  {
    pattern: /(what about|how about|kya|aur).*(\d+)/i,
    weight: 0.85,
    responses: {
      en: [
        '{mentionedQuantity} {mentionedUnit}? That works! Total: ₹{estimatedTotal} at ₹{listingPrice} per {unit}. Good for you?',
        'Sure! {mentionedQuantity} {mentionedUnit} is ₹{estimatedTotal}. Rate: ₹{listingPrice}/{unit}. Shall we finalize?',
        '{mentionedQuantity} {mentionedUnit} sounds good! Price: ₹{estimatedTotal} (₹{listingPrice} per {unit}). Deal?'
      ],
      hi: [
        '{mentionedQuantity} {mentionedUnit}? यह काम करता है! कुल: ₹{estimatedTotal}, ₹{listingPrice} प्रति {unit} पर। आपके लिए ठीक है?',
        'ज़रूर! {mentionedQuantity} {mentionedUnit} ₹{estimatedTotal} है। दर: ₹{listingPrice}/{unit}। अंतिम रूप दें?',
        '{mentionedQuantity} {mentionedUnit} अच्छा लगता है! कीमत: ₹{estimatedTotal} (₹{listingPrice} प्रति {unit})। सौदा?'
      ]
    }
  },

  // "Interested in" variations
  {
    pattern: /(interested in|want to know|curious about).*(\d+)/i,
    weight: 0.9,
    responses: {
      en: [
        'Excellent choice! {mentionedQuantity} {mentionedUnit} costs ₹{estimatedTotal}. Rate: ₹{listingPrice} per {unit}. Ready to buy?',
        'Great interest! {mentionedQuantity} {mentionedUnit} = ₹{estimatedTotal} at ₹{listingPrice}/{unit}. Shall we proceed?',
        'Perfect! {mentionedQuantity} {mentionedUnit} available for ₹{estimatedTotal}. That\'s ₹{listingPrice} per {unit}. Deal?'
      ],
      hi: [
        'उत्कृष्ट चुनाव! {mentionedQuantity} {mentionedUnit} की कीमत ₹{estimatedTotal} है। दर: ₹{listingPrice} प्रति {unit}। खरीदने के लिए तैयार हैं?',
        'बढ़िया रुचि! {mentionedQuantity} {mentionedUnit} = ₹{estimatedTotal}, ₹{listingPrice}/{unit} पर। आगे बढ़ें?',
        'बिल्कुल! {mentionedQuantity} {mentionedUnit} ₹{estimatedTotal} में उपलब्ध। यह ₹{listingPrice} प्रति {unit} है। सौदा?'
      ]
    }
  },

  // "Thinking of buying" variations
  {
    pattern: /(thinking of|planning to|considering|soch raha).*(\d+)/i,
    weight: 0.85,
    responses: {
      en: [
        'Good thinking! {mentionedQuantity} {mentionedUnit} would cost ₹{estimatedTotal}. Rate: ₹{listingPrice}/{unit}. Sounds good?',
        'Smart plan! {mentionedQuantity} {mentionedUnit} = ₹{estimatedTotal} at ₹{listingPrice} per {unit}. Ready to decide?',
        'Great idea! {mentionedQuantity} {mentionedUnit} available for ₹{estimatedTotal}. That\'s ₹{listingPrice}/{unit}. Interested?'
      ],
      hi: [
        'अच्छा सोच! {mentionedQuantity} {mentionedUnit} की कीमत ₹{estimatedTotal} होगी। दर: ₹{listingPrice}/{unit}। अच्छा लगता है?',
        'स्मार्ट योजना! {mentionedQuantity} {mentionedUnit} = ₹{estimatedTotal}, ₹{listingPrice} प्रति {unit} पर। निर्णय लेने के लिए तैयार हैं?',
        'बढ़िया विचार! {mentionedQuantity} {mentionedUnit} ₹{estimatedTotal} में उपलब्ध। यह ₹{listingPrice}/{unit} है। रुचि है?'
      ]
    }
  },

  // "Show me" / "Give me price" variations
  {
    pattern: /(show me|give me price|quote|estimate).*(\d+)/i,
    weight: 0.9,
    responses: {
      en: [
        'Here\'s the quote: {mentionedQuantity} {mentionedUnit} = ₹{estimatedTotal}. Rate: ₹{listingPrice} per {unit}. Acceptable?',
        'Price breakdown: {mentionedQuantity} {mentionedUnit} × ₹{listingPrice}/{unit} = ₹{estimatedTotal}. Good deal?',
        'Estimate ready! {mentionedQuantity} {mentionedUnit} costs ₹{estimatedTotal} at ₹{listingPrice} per {unit}. Proceed?'
      ],
      hi: [
        'यहां कोटेशन है: {mentionedQuantity} {mentionedUnit} = ₹{estimatedTotal}। दर: ₹{listingPrice} प्रति {unit}। स्वीकार्य है?',
        'कीमत विवरण: {mentionedQuantity} {mentionedUnit} × ₹{listingPrice}/{unit} = ₹{estimatedTotal}। अच्छा सौदा?',
        'अनुमान तैयार! {mentionedQuantity} {mentionedUnit} की कीमत ₹{estimatedTotal} है, ₹{listingPrice} प्रति {unit} पर। आगे बढ़ें?'
      ]
    }
  },

  // "Will take" / "I'll buy" variations
  {
    pattern: /(will take|i'll buy|i'll get|le lunga|kharid lunga).*(\d+)/i,
    weight: 1.0,
    responses: {
      en: [
        'Excellent decision! {mentionedQuantity} {mentionedUnit} for ₹{estimatedTotal}. Let\'s finalize this deal!',
        'Perfect! {mentionedQuantity} {mentionedUnit} = ₹{estimatedTotal} at ₹{listingPrice}/{unit}. Ready to confirm?',
        'Great! {mentionedQuantity} {mentionedUnit} is yours for ₹{estimatedTotal}. Shall we complete the transaction?'
      ],
      hi: [
        'उत्कृष्ट निर्णय! {mentionedQuantity} {mentionedUnit} ₹{estimatedTotal} में। चलिए इस सौदे को अंतिम रूप दें!',
        'बिल्कुल! {mentionedQuantity} {mentionedUnit} = ₹{estimatedTotal}, ₹{listingPrice}/{unit} पर। पुष्टि करने के लिए तैयार हैं?',
        'बढ़िया! {mentionedQuantity} {mentionedUnit} आपका है ₹{estimatedTotal} में। क्या हम लेनदेन पूरा करें?'
      ]
    }
  },

  // "Is it possible" variations
  {
    pattern: /(is it possible|can you|kya aap|ho sakta hai).*(\d+)/i,
    weight: 0.9,
    responses: {
      en: [
        'Yes, absolutely! {mentionedQuantity} {mentionedUnit} is possible. Price: ₹{estimatedTotal} (₹{listingPrice}/{unit}). Deal?',
        'Of course! I can provide {mentionedQuantity} {mentionedUnit}. Total: ₹{estimatedTotal}. Rate: ₹{listingPrice} per {unit}. Good?',
        'Definitely possible! {mentionedQuantity} {mentionedUnit} = ₹{estimatedTotal} at ₹{listingPrice}/{unit}. Interested?'
      ],
      hi: [
        'हां, बिल्कुल! {mentionedQuantity} {mentionedUnit} संभव है। कीमत: ₹{estimatedTotal} (₹{listingPrice}/{unit})। सौदा?',
        'बेशक! मैं {mentionedQuantity} {mentionedUnit} दे सकता हूं। कुल: ₹{estimatedTotal}। दर: ₹{listingPrice} प्रति {unit}। ठीक है?',
        'निश्चित रूप से संभव! {mentionedQuantity} {mentionedUnit} = ₹{estimatedTotal}, ₹{listingPrice}/{unit} पर। रुचि है?'
      ]
    }
  },

  // DEAL FINALIZATION - ALL POSSIBLE VARIATIONS (Maximum Priority)
  // NOTE: Ask for confirmation BEFORE finalizing
  {
    pattern: /(^done$|^sold$|^deal$|^final$|^confirm$|^book$|^order$|^buy now$|^take it$|^i'?ll take|let'?s go|go ahead|do it|make it happen|seal it|lock it|wrap it|close it|finish it)/i,
    weight: 1.0,
    responses: {
      en: [
        'Perfect! Let me confirm: {quantity} {unit} at ₹{listingPrice} per {unit}. Total: ₹{totalAmount}. Shall we finalize?',
        'Great! Just checking: You want {quantity} {unit} at ₹{listingPrice}/{unit} = ₹{totalAmount}. Correct?',
        'Excellent! Confirming details: {quantity} {unit} × ₹{listingPrice} = ₹{totalAmount}. Ready to proceed?',
        'Wonderful! Final check: {quantity} {unit} for ₹{totalAmount} (₹{listingPrice} per {unit}). Deal?',
        'Perfect! Summary: {quantity} {unit} at ₹{listingPrice}/{unit} = ₹{totalAmount}. Shall I finalize?',
        'Great! Verification: {quantity} {unit} × ₹{listingPrice} = ₹{totalAmount}. Confirm to proceed.',
        'Excellent! Order details: {quantity} {unit} at ₹{listingPrice} per {unit}. Total: ₹{totalAmount}. OK?',
        'Wonderful! Terms: {quantity} {unit} for ₹{totalAmount}. Rate: ₹{listingPrice}/{unit}. Finalize?',
        'Perfect! Checking: {quantity} {unit} at ₹{listingPrice}/{unit} = ₹{totalAmount}. Proceed?',
        'Great! Final terms: {quantity} {unit} × ₹{listingPrice} = ₹{totalAmount}. Ready?'
      ],
      hi: [
        'बिल्कुल! मैं पुष्टि करता हूं: ₹{listingPrice} प्रति {unit} पर {quantity} {unit}। कुल: ₹{totalAmount}। अंतिम रूप दें?',
        'बढ़िया! बस जांच रहा हूं: आप ₹{listingPrice}/{unit} पर {quantity} {unit} चाहते हैं = ₹{totalAmount}। सही है?',
        'उत्कृष्ट! विवरण की पुष्टि: {quantity} {unit} × ₹{listingPrice} = ₹{totalAmount}। आगे बढ़ने के लिए तैयार?',
        'शानदार! अंतिम जांच: ₹{totalAmount} के लिए {quantity} {unit} (₹{listingPrice} प्रति {unit})। सौदा?',
        'बिल्कुल! सारांश: ₹{listingPrice}/{unit} पर {quantity} {unit} = ₹{totalAmount}। क्या मैं अंतिम रूप दूं?',
        'बढ़िया! सत्यापन: {quantity} {unit} × ₹{listingPrice} = ₹{totalAmount}। आगे बढ़ने के लिए पुष्टि करें।',
        'उत्कृष्ट! ऑर्डर विवरण: ₹{listingPrice} प्रति {unit} पर {quantity} {unit}। कुल: ₹{totalAmount}। ठीक है?',
        'शानदार! शर्तें: ₹{totalAmount} के लिए {quantity} {unit}। दर: ₹{listingPrice}/{unit}। अंतिम रूप दें?',
        'बिल्कुल! जांच: ₹{listingPrice}/{unit} पर {quantity} {unit} = ₹{totalAmount}। आगे बढ़ें?',
        'बढ़िया! अंतिम शर्तें: {quantity} {unit} × ₹{listingPrice} = ₹{totalAmount}। तैयार?'
      ],
      bn: [
        '🎉 চমৎকার! চুক্তি সম্পন্ন! {quantity} {unit}, ₹{agreedPrice} প্রতি {unit} এ। মোট: ₹{totalAmount}। নিশ্চিত!',
        '✅ নিখুঁত! অর্ডার নিশ্চিত! আপনি ₹{totalAmount} এ {quantity} {unit} পাচ্ছেন। চুক্তি সিল!',
        '🤝 উৎকৃষ্ট! চুক্তি চূড়ান্ত! {quantity} {unit} × ₹{agreedPrice} = ₹{totalAmount}। এগিয়ে যাই!'
      ],
      te: [
        '🎉 అద్భుతం! డీల్ పూర్తయింది! {quantity} {unit}, ₹{agreedPrice} ప్రతి {unit} వద్ద. మొత్తం: ₹{totalAmount}. నిర్ధారించబడింది!',
        '✅ పర్ఫెక్ట్! ఆర్డర్ నిర్ధారించబడింది! మీరు ₹{totalAmount} కి {quantity} {unit} పొందుతున్నారు. డీల్ సీల్!',
        '🤝 అద్భుతం! డీల్ ఖరారు! {quantity} {unit} × ₹{agreedPrice} = ₹{totalAmount}. కొనసాగిద్దాం!'
      ],
      mr: [
        '🎉 छान! डील झाली! {quantity} {unit}, ₹{agreedPrice} प्रति {unit} वर। एकूण: ₹{totalAmount}। पुष्टी!',
        '✅ परिपूर्ण! ऑर्डर पक्की! तुम्हाला ₹{totalAmount} मध्ये {quantity} {unit} मिळत आहे। डील सील!'
      ],
      ta: [
        '🎉 அருமை! ஒப்பந்தம் முடிந்தது! {quantity} {unit}, ₹{agreedPrice} ஒன்றுக்கு {unit} இல். மொத்தம்: ₹{totalAmount}. உறுதி!',
        '✅ சரியானது! ஆர்டர் உறுதி! நீங்கள் ₹{totalAmount} க்கு {quantity} {unit} பெறுகிறீர்கள். ஒப்பந்தம் சீல்!'
      ],
      gu: [
        '🎉 સરસ! ડીલ થઈ! {quantity} {unit}, ₹{agreedPrice} પ્રતિ {unit} પર। કુલ: ₹{totalAmount}। પુષ્ટિ!',
        '✅ સંપૂર્ણ! ઓર્ડર પુષ્ટિ! તમને ₹{totalAmount} માં {quantity} {unit} મળી રહ્યું છે। ડીલ સીલ!'
      ],
      kn: [
        '🎉 ಅದ್ಭುತ! ಡೀಲ್ ಆಯಿತು! {quantity} {unit}, ₹{agreedPrice} ಪ್ರತಿ {unit} ನಲ್ಲಿ. ಒಟ್ಟು: ₹{totalAmount}. ದೃಢೀಕರಿಸಲಾಗಿದೆ!',
        '✅ ಪರಿಪೂರ್ಣ! ಆರ್ಡರ್ ದೃಢೀಕರಣ! ನೀವು ₹{totalAmount} ಗೆ {quantity} {unit} ಪಡೆಯುತ್ತಿದ್ದೀರಿ. ಡೀಲ್ ಸೀಲ್!'
      ],
      ml: [
        '🎉 മികച്ചത്! ഡീൽ ആയി! {quantity} {unit}, ₹{agreedPrice} ഒന്നിന് {unit} ൽ. ആകെ: ₹{totalAmount}. സ്ഥിരീകരിച്ചു!',
        '✅ പെർഫെക്റ്റ്! ഓർഡർ സ്ഥിരീകരിച്ചു! നിങ്ങൾക്ക് ₹{totalAmount} ന് {quantity} {unit} ലഭിക്കുന്നു. ഡീൽ സീൽ!'
      ],
      pa: [
        '🎉 ਸ਼ਾਨਦਾਰ! ਡੀਲ ਹੋ ਗਈ! {quantity} {unit}, ₹{agreedPrice} ਪ੍ਰਤੀ {unit} ਤੇ। ਕੁੱਲ: ₹{totalAmount}। ਪੁਸ਼ਟੀ!',
        '✅ ਸੰਪੂਰਨ! ਆਰਡਰ ਪੱਕਾ! ਤੁਹਾਨੂੰ ₹{totalAmount} ਵਿਚ {quantity} {unit} ਮਿਲ ਰਿਹਾ ਹੈ। ਡੀਲ ਸੀਲ!'
      ],
      ur: [
        '🎉 بہترین! ڈیل ہو گئی! {quantity} {unit}، ₹{agreedPrice} فی {unit} پر۔ کل: ₹{totalAmount}۔ تصدیق!',
        '✅ کامل! آرڈر کی تصدیق! آپ کو ₹{totalAmount} میں {quantity} {unit} مل رہا ہے۔ ڈیل سیل!'
      ],
      or: [
        '🎉 ଉତ୍କୃଷ୍ଟ! ଡିଲ୍ ହୋଇଗଲା! {quantity} {unit}, ₹{agreedPrice} ପ୍ରତି {unit} ରେ। ମୋଟ: ₹{totalAmount}। ନିଶ୍ଚିତ!',
        '✅ ସମ୍ପୂର୍ଣ୍ଣ! ଅର୍ଡର ନିଶ୍ଚିତ! ଆପଣ ₹{totalAmount} ରେ {quantity} {unit} ପାଉଛନ୍ତି। ଡିଲ୍ ସିଲ୍!'
      ]
    }
  },

  // "Let's finalize" / "Ready to finalize" variations
  {
    pattern: /(let'?s (finalize|complete|close|seal|confirm)|ready to (finalize|complete|close|buy)|time to (finalize|complete|close)|shall we (finalize|complete|close))/i,
    weight: 1.0,
    responses: {
      en: [
        'Absolutely! Let\'s finalize this right now. {quantity} {unit} at ₹{agreedPrice}. Total: ₹{totalAmount}. Deal!',
        'Perfect timing! Finalizing: {quantity} {unit} × ₹{agreedPrice} = ₹{totalAmount}. Confirmed!',
        'Yes! Let\'s close this deal. {quantity} {unit} for ₹{totalAmount}. Done!',
        'Great! I\'m ready too. Final terms: {quantity} {unit} at ₹{agreedPrice}. Let\'s do it!'
      ],
      hi: [
        'बिल्कुल! चलिए अभी अंतिम रूप देते हैं। ₹{agreedPrice} पर {quantity} {unit}। कुल: ₹{totalAmount}। सौदा!',
        'सही समय! अंतिम रूप: {quantity} {unit} × ₹{agreedPrice} = ₹{totalAmount}। पुष्टि!',
        'हां! चलिए इस सौदे को बंद करते हैं। ₹{totalAmount} में {quantity} {unit}। हो गया!',
        'बढ़िया! मैं भी तैयार हूं। अंतिम शर्तें: ₹{agreedPrice} पर {quantity} {unit}। चलिए करते हैं!'
      ]
    }
  },

  // "Okay done" / "Alright done" / "Yes done" variations
  {
    pattern: /(^okay done$|^ok done$|^alright done$|^yes done$|^han done$|^thik done$|^bas done$|^sahi done$|^perfect done$|^good done$)/i,
    weight: 1.0,
    responses: {
      en: [
        '🎉 Awesome! DONE! {quantity} {unit} at ₹{agreedPrice} per {unit}. Total: ₹{totalAmount}. Sealed!',
        '✅ Perfect! Deal is DONE! You\'re getting {quantity} {unit} for ₹{totalAmount}. Confirmed!',
        '🤝 Great! All DONE! {quantity} {unit} × ₹{agreedPrice} = ₹{totalAmount}. Complete!',
        '🎊 Excellent! DONE DEAL! Final: {quantity} {unit} at ₹{agreedPrice}. Total: ₹{totalAmount}!'
      ],
      hi: [
        '🎉 कमाल! हो गया! ₹{agreedPrice} प्रति {unit} पर {quantity} {unit}। कुल: ₹{totalAmount}। सील!',
        '✅ बिल्कुल! सौदा हो गया! आपको ₹{totalAmount} में {quantity} {unit} मिल रहा है। पुष्टि!',
        '🤝 बढ़िया! सब हो गया! {quantity} {unit} × ₹{agreedPrice} = ₹{totalAmount}। पूरा!',
        '🎊 उत्कृष्ट! सौदा पूरा! अंतिम: ₹{agreedPrice} पर {quantity} {unit}। कुल: ₹{totalAmount}!'
      ]
    }
  },

  // "Proceed" / "Continue" / "Move forward" variations
  {
    pattern: /(^proceed$|^continue$|^move forward$|^move ahead|next step|aage badho|aage chalo|continue karo)/i,
    weight: 1.0,
    responses: {
      en: [
        'Perfect! Proceeding with the order. {quantity} {unit} at ₹{agreedPrice}. Total: ₹{totalAmount}. Confirmed!',
        'Great! Moving forward. Final terms: {quantity} {unit} for ₹{totalAmount}. Deal done!',
        'Excellent! Continuing with finalization. {quantity} {unit} × ₹{agreedPrice} = ₹{totalAmount}!',
        'Wonderful! Next step: Order confirmation. {quantity} {unit} at ₹{agreedPrice}. Total: ₹{totalAmount}!'
      ],
      hi: [
        'बिल्कुल! ऑर्डर के साथ आगे बढ़ रहे हैं। ₹{agreedPrice} पर {quantity} {unit}। कुल: ₹{totalAmount}। पुष्टि!',
        'बढ़िया! आगे बढ़ रहे हैं। अंतिम शर्तें: ₹{totalAmount} में {quantity} {unit}। सौदा हो गया!',
        'उत्कृष्ट! अंतिम रूप के साथ जारी। {quantity} {unit} × ₹{agreedPrice} = ₹{totalAmount}!',
        'शानदार! अगला कदम: ऑर्डर पुष्टि। ₹{agreedPrice} पर {quantity} {unit}। कुल: ₹{totalAmount}!'
      ]
    }
  }
];

/**
 * Merge extended patterns with core patterns for maximum coverage
 */
export function getExtendedFallbackResponse(
  message: string,
  language: SupportedLanguageCode,
  context?: {
    listingPrice?: number;
    marketPrice?: number;
    quantity?: number;
    unit?: string;
    agreedPrice?: number;
    offeredPrice?: number;
    mentionedQuantity?: number;
    mentionedUnit?: string;
  }
): string | null {
  console.log('🔍 getExtendedFallbackResponse called with:', { message, language, context });
  
  // Try to match extended patterns
  for (const fallback of EXTENDED_FALLBACK_RESPONSES) {
    if (fallback.pattern.test(message)) {
      console.log('✅ Pattern matched:', fallback.pattern);
      const responses = fallback.responses[language] || fallback.responses.en;
      if (responses && responses.length > 0) {
        let selectedResponse = responses[Math.floor(Math.random() * responses.length)];
        console.log('📝 Selected response (before replacement):', selectedResponse);
        
        // Replace placeholders
        if (context) {
          console.log('🔄 Extended - Replacing with context:', context);
          const estimatedTotal = context.mentionedQuantity && context.listingPrice 
            ? Math.round(calculateWithUnitConversion(
                context.mentionedQuantity,
                context.mentionedUnit || '',
                context.listingPrice,
                context.unit || ''
              ))
            : 0;
          
          // SMART REPLACEMENT: Use actual values if available, otherwise remove placeholder
          // This prevents showing {variable} or incorrect values like ₹0
          selectedResponse = selectedResponse
            .replace(/{price}/g, context.offeredPrice !== undefined && context.offeredPrice !== null ? context.offeredPrice.toString() : '')
            .replace(/{listingPrice}/g, context.listingPrice !== undefined && context.listingPrice !== null && context.listingPrice > 0 ? context.listingPrice.toString() : '')
            .replace(/{marketPrice}/g, context.marketPrice !== undefined && context.marketPrice !== null && context.marketPrice > 0 ? context.marketPrice.toString() : '')
            .replace(/{quantity}/g, context.quantity !== undefined && context.quantity !== null && context.quantity > 0 ? context.quantity.toString() : '')
            .replace(/{unit}/g, context.unit && context.unit.trim() !== '' ? context.unit : '')
            .replace(/{agreedPrice}/g, (context.agreedPrice && context.agreedPrice > 0) ? context.agreedPrice.toString() : (context.listingPrice && context.listingPrice > 0) ? context.listingPrice.toString() : '')
            .replace(/{totalAmount}/g, ((context.agreedPrice || context.listingPrice || 0) * (context.quantity || 1)).toString())
            .replace(/{mentionedQuantity}/g, context.mentionedQuantity !== undefined && context.mentionedQuantity !== null && context.mentionedQuantity > 0 ? context.mentionedQuantity.toString() : '')
            .replace(/{mentionedUnit}/g, (context.mentionedUnit && context.mentionedUnit.trim() !== '') ? context.mentionedUnit : (context.unit && context.unit.trim() !== '') ? context.unit : '')
            .replace(/{estimatedTotal}/g, estimatedTotal > 0 ? estimatedTotal.toString() : '');
          
          // Clean up any remaining empty price placeholders that create weird spacing
          // Remove patterns like "₹ " or "₹ (" when no price follows
          selectedResponse = selectedResponse
            .replace(/₹\s*\(/g, (match, offset, string) => {
              // Check if there's a number after the opening paren within 5 characters
              const nextChars = string.substring(offset + match.length, offset + match.length + 10);
              return /^\d/.test(nextChars) ? match : '(';
            })
            .replace(/₹\s+(?=[^\d])/g, '') // Remove ₹ followed by space and non-digit
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim();
          
          console.log('✨ Extended - After replacement:', selectedResponse);
        } else {
          console.log('⚠️ Extended - No context provided');
          // CRITICAL FIX: Without context, remove placeholders entirely to prevent showing {variable}
          selectedResponse = selectedResponse
            .replace(/{price}/g, '')
            .replace(/{listingPrice}/g, '')
            .replace(/{marketPrice}/g, '')
            .replace(/{quantity}/g, '')
            .replace(/{unit}/g, '')
            .replace(/{agreedPrice}/g, '')
            .replace(/{totalAmount}/g, '')
            .replace(/{mentionedQuantity}/g, '')
            .replace(/{mentionedUnit}/g, '')
            .replace(/{estimatedTotal}/g, '');
        }
        
        return selectedResponse;
      }
    }
  }
  
  console.log('❌ No extended pattern matched');
  return null; // No match found, use core fallback
}

/**
 * Calculate price with unit conversion
 */
function calculateWithUnitConversion(
  quantity: number,
  fromUnit: string,
  pricePerUnit: number,
  toUnit: string
): number {
  const from = fromUnit.toLowerCase();
  const to = toUnit.toLowerCase();
  
  let effectiveQuantity = quantity;
  
  if (from === 'kg' && to === 'quintal') {
    effectiveQuantity = quantity / 100;
  } else if (from === 'ton' && to === 'quintal') {
    effectiveQuantity = quantity * 10;
  } else if (from === 'kg' && to === 'ton') {
    effectiveQuantity = quantity / 1000;
  } else if (from === 'quintal' && to === 'kg') {
    effectiveQuantity = quantity * 100;
  } else if (from === 'ton' && to === 'kg') {
    effectiveQuantity = quantity * 1000;
  } else if (from === 'quintal' && to === 'ton') {
    effectiveQuantity = quantity / 10;
  }
  
  return effectiveQuantity * pricePerUnit;
}
