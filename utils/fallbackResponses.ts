import type { SupportedLanguageCode } from '../types';
import { EXTENDED_FALLBACK_RESPONSES, getExtendedFallbackResponse } from './fallbackResponsesExtended';
import { FALLBACK_RESPONSES_BUYER, DEFAULT_FALLBACK_BUYER } from './fallbackResponsesBuyer';

export interface FallbackResponse {
  pattern: RegExp;
  responses: Partial<Record<SupportedLanguageCode, string[]>>;
  weight?: number; // Probability weight for response selection
  role?: 'seller' | 'buyer' | 'any'; // Restrict response to specific responder role
}

// ... existing interfaces ...

// SELLER PERSONA RESPONSES (Existing)
export const FALLBACK_RESPONSES_SELLER: FallbackResponse[] = [
  // ... existing content move here or keep FALLBACK_RESPONSES as generic and filter?
  // It's better to keep FALLBACK_RESPONSES as is, but mark them as role='seller' implicitly if not specified? 
  // No, that's messy.
  // I will create a new default set for BUYER.
];

// ...


interface ConversationContext {
  messageCount: number;
  priceOffered: boolean;
  agreementCount: number;
  lastIntent: 'greeting' | 'price_inquiry' | 'negotiation' | 'agreement' | 'rejection' | 'finalization' | 'other';
}

// Track conversation context for smarter responses
let conversationContext: ConversationContext = {
  messageCount: 0,
  priceOffered: false,
  agreementCount: 0,
  lastIntent: 'other'
};

export function resetConversationContext() {
  conversationContext = {
    messageCount: 0,
    priceOffered: false,
    agreementCount: 0,
    lastIntent: 'other'
  };
}

export function updateConversationContext(intent: ConversationContext['lastIntent']) {
  conversationContext.messageCount++;
  conversationContext.lastIntent = intent;
}

// Common negotiation patterns and responses with probabilistic selection
export const FALLBACK_RESPONSES: FallbackResponse[] = [
  // Numeric price offers (e.g., "1500", "2000", "3200")
  {
    pattern: /^\d+$/,
    weight: 1.0,
    responses: {
      en: [
        'I see your offer of ₹{price}. Let me evaluate this against the market rate.',
        'Your offer is ₹{price}. That\'s interesting - let me consider it.',
        '₹{price} is your proposal. I need to check if this works for me.',
        'You\'re offering ₹{price}. Let me think about this price point.'
      ],
      hi: [
        'मैं आपका ₹{price} का प्रस्ताव देख रहा हूं। मुझे बाजार दर के साथ इसका मूल्यांकन करने दें।',
        'आपका प्रस्ताव ₹{price} है। यह दिलचस्प है - मुझे इस पर विचार करने दें।',
        '₹{price} आपका प्रस्ताव है। मुझे देखना होगा कि यह मेरे लिए काम करता है या नहीं।',
        'आप ₹{price} की पेशकश कर रहे हैं। मुझे इस कीमत के बारे में सोचने दें।'
      ],
      bn: [
        'আমি আপনার ₹{price} অফার দেখছি। আমাকে বাজার মূল্যের সাথে এটি মূল্যায়ন করতে দিন।',
        'আপনার অফার ₹{price}। এটি আকর্ষণীয় - আমাকে বিবেচনা করতে দিন।',
        '₹{price} আপনার প্রস্তাব। আমাকে দেখতে হবে এটি আমার জন্য কাজ করে কিনা।'
      ],
      te: [
        'నేను మీ ₹{price} ఆఫర్ చూస్తున్నాను. మార్కెట్ రేటుతో దీన్ని అంచనా వేయనివ్వండి।',
        'మీ ఆఫర్ ₹{price}. ఇది ఆసక్తికరంగా ఉంది - నేను దీన్ని పరిగణించనివ్వండి।',
        '₹{price} మీ ప్రతిపాదన. ఇది నాకు పని చేస్తుందో లేదో నేను తనిఖీ చేయాలి।'
      ],
      mr: [
        'मी तुमची ₹{price} ऑफर पाहत आहे. मला बाजार दराशी याचे मूल्यांकन करू द्या।',
        'तुमची ऑफर ₹{price} आहे. हे मनोरंजक आहे - मला विचार करू द्या।'
      ],
      ta: [
        'உங்கள் ₹{price} சலுகையைப் பார்க்கிறேன். சந்தை விலையுடன் இதை மதிப்பீடு செய்ய அனுமதிக்கவும்.',
        'உங்கள் சலுகை ₹{price}. இது சுவாரஸ்யமானது - நான் பரிசீலிக்கட்டும்.'
      ],
      gu: [
        'હું તમારી ₹{price} ઓફર જોઉં છું. મને બજાર દર સાથે આનું મૂલ્યાંકન કરવા દો।',
        'તમારી ઓફર ₹{price} છે. આ રસપ્રદ છે - મને વિચારવા દો।'
      ],
      kn: [
        'ನಾನು ನಿಮ್ಮ ₹{price} ಆಫರ್ ನೋಡುತ್ತಿದ್ದೇನೆ. ಮಾರುಕಟ್ಟೆ ದರದೊಂದಿಗೆ ಇದನ್ನು ಮೌಲ್ಯಮಾಪನ ಮಾಡಲು ನನಗೆ ಅವಕಾಶ ನೀಡಿ।',
        'ನಿಮ್ಮ ಆಫರ್ ₹{price}. ಇದು ಆಸಕ್ತಿದಾಯಕವಾಗಿದೆ - ನಾನು ಪರಿಗಣಿಸಲಿ।'
      ],
      ml: ['ഞാൻ നിങ്ങളുടെ ₹{price} ഓഫർ കാണുന്നു. മാർക്കറ്റ് നിരക്കുമായി ഇത് വിലയിരുത്താൻ എന്നെ അനുവദിക്കൂ.'],
      pa: ['ਮੈਂ ਤੁਹਾਡੀ ₹{price} ਪੇਸ਼ਕਸ਼ ਦੇਖ ਰਿਹਾ ਹਾਂ। ਮੈਨੂੰ ਮਾਰਕੀਟ ਰੇਟ ਨਾਲ ਇਸਦਾ ਮੁਲਾਂਕਣ ਕਰਨ ਦਿਓ।'],
      ur: ['میں آپ کی ₹{price} پیشکش دیکھ رہا ہوں۔ مجھے مارکیٹ ریٹ کے ساتھ اس کا جائزہ لینے دیں۔'],
      or: ['ମୁଁ ତୁମର ₹{price} ଅଫର୍ ଦେଖୁଛି। ମୋତେ ବଜାର ମୂଲ୍ୟ ସହିତ ଏହାର ମୂଲ୍ୟାଙ୍କନ କରିବାକୁ ଦିଅ।']
    }
  },
  // Greetings
  {
    pattern: /^(hello|hi|hey|namaste|namaskar|vanakkam|sat sri akal|assalam|salaam)/i,
    weight: 1.0,
    responses: {
      en: [
        'Hello! I\'m glad you\'re interested in this listing. What would you like to know?',
        'Hi there! Thanks for reaching out. How can I help you today?',
        'Hey! Great to hear from you. Are you interested in purchasing?',
        'Hello! Welcome. Feel free to ask me anything about this product.'
      ],
      hi: [
        'नमस्ते! मुझे खुशी है कि आप इस लिस्टिंग में रुचि रखते हैं। आप क्या जानना चाहेंगे?',
        'नमस्ते! संपर्क करने के लिए धन्यवाद। मैं आज आपकी कैसे मदद कर सकता हूं?',
        'अरे! आपसे सुनकर अच्छा लगा। क्या आप खरीदने में रुचि रखते हैं?',
        'नमस्ते! स्वागत है। इस उत्पाद के बारे में मुझसे कुछ भी पूछने के लिए स्वतंत्र महसूस करें।'
      ],
      bn: [
        'নমস্কার! আমি খুশি যে আপনি এই তালিকায় আগ্রহী। আপনি কী জানতে চান?',
        'হাই! যোগাযোগ করার জন্য ধন্যবাদ। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?',
        'হেই! আপনার কাছ থেকে শুনে ভালো লাগলো। আপনি কি কিনতে আগ্রহী?'
      ],
      te: [
        'నమస్తే! మీరు ఈ లిస్టింగ్‌లో ఆసక్తి చూపడం నాకు సంతోషంగా ఉంది। మీరు ఏమి తెలుసుకోవాలనుకుంటున్నారు?',
        'హాయ్! చేరుకున్నందుకు ధన్యవాదాలు। ఈరోజు నేను మీకు ఎలా సహాయపడగలను?',
        'హే! మీ నుండి వినడం చాలా బాగుంది. మీరు కొనుగోలు చేయడానికి ఆసక్తి ఉందా?'
      ],
      mr: [
        'नमस्कार! मला आनंद आहे की तुम्हाला या यादीत रस आहे। तुम्हाला काय जाणून घ्यायचे आहे?',
        'नमस्ते! संपर्क केल्याबद्दल धन्यवाद। आज मी तुम्हाला कशी मदत करू शकतो?'
      ],
      ta: [
        'வணக்கம்! இந்த பட்டியலில் நீங்கள் ஆர்வமாக இருப்பதில் மகிழ்ச்சி. நீங்கள் என்ன தெரிந்து கொள்ள விரும்புகிறீர்கள்?',
        'ஹாய்! தொடர்பு கொண்டதற்கு நன்றி. இன்று நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?'
      ],
      gu: [
        'નમસ્તે! મને આનંદ છે કે તમને આ સૂચિમાં રસ છે। તમે શું જાણવા માંગો છો?',
        'હાય! સંપર્ક કરવા બદલ આભાર. આજે હું તમને કેવી રીતે મદદ કરી શકું?'
      ],
      kn: [
        'ನಮಸ್ಕಾರ! ಈ ಪಟ್ಟಿಯಲ್ಲಿ ನೀವು ಆಸಕ್ತಿ ಹೊಂದಿರುವುದು ನನಗೆ ಸಂತೋಷವಾಗಿದೆ. ನೀವು ಏನು ತಿಳಿದುಕೊಳ್ಳಲು ಬಯಸುತ್ತೀರಿ?',
        'ಹಾಯ್! ಸಂಪರ್ಕಿಸಿದ್ದಕ್ಕಾಗಿ ಧನ್ಯವಾದಗಳು. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?'
      ],
      ml: ['നമസ്കാരം! ഈ ലിസ്റ്റിംഗിൽ നിങ്ങൾക്ക് താൽപ്പര്യമുണ്ടെന്നതിൽ എനിക്ക് സന്തോഷമുണ്ട്. നിങ്ങൾ എന്താണ് അറിയാൻ ആഗ്രഹിക്കുന്നത്?'],
      pa: ['ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਨੂੰ ਖੁਸ਼ੀ ਹੈ ਕਿ ਤੁਸੀਂ ਇਸ ਸੂਚੀ ਵਿਚ ਦਿਲਚਸਪੀ ਰੱਖਦੇ ਹੋ। ਤੁਸੀਂ ਕੀ ਜਾਣਨਾ ਚਾਹੋਗੇ?'],
      ur: ['السلام علیکم! مجھے خوشی ہے کہ آپ اس فہرست میں دلچسپی رکھتے ہیں۔ آپ کیا جاننا چاہیں گے؟'],
      or: ['ନମସ୍କାର! ମୁଁ ଖୁସି ଯେ ଆପଣ ଏହି ତାଲିକାରେ ଆଗ୍ରହୀ। ଆପଣ କଣ ଜାଣିବାକୁ ଚାହାଁନ୍ତି?']
    }
  },
  // Price inquiry
  {
    pattern: /(price|cost|rate|kitna|kya|daam|kimat|kharcha|mulya)/i,
    weight: 0.9,
    responses: {
      en: [
        'The listed price is ₹{listingPrice} per {unit}. I have {quantity} {unit} available. I\'m open to reasonable offers.',
        'Current price is ₹{listingPrice} per {unit}. The market rate is around ₹{marketPrice}. What\'s your budget?',
        'It\'s priced at ₹{listingPrice} per {unit}. I have {quantity} {unit} in stock. Would you like to make an offer?',
        'The price is ₹{listingPrice} per {unit}. This is competitive with current market rates. Interested?',
        'I\'m selling at ₹{listingPrice} per {unit}. Available quantity: {quantity} {unit}. Fair price?',
        'Rate is ₹{listingPrice} per {unit}. Stock: {quantity} {unit}. Market average is ₹{marketPrice}. Good deal?'
      ],
      hi: [
        'सूचीबद्ध कीमत ₹{listingPrice} प्रति {unit} है। मेरे पास {quantity} {unit} उपलब्ध है। मैं उचित प्रस्तावों के लिए खुला हूं।',
        'वर्तमान कीमत ₹{listingPrice} प्रति {unit} है। बाजार दर लगभग ₹{marketPrice} है। आपका बजट क्या है?',
        'यह ₹{listingPrice} प्रति {unit} पर है। मेरे पास {quantity} {unit} स्टॉक में है। क्या आप प्रस्ताव देना चाहेंगे?',
        'कीमत ₹{listingPrice} प्रति {unit} है। यह वर्तमान बाजार दरों के साथ प्रतिस्पर्धी है। रुचि है?',
        'मैं ₹{listingPrice} प्रति {unit} पर बेच रहा हूं। उपलब्ध मात्रा: {quantity} {unit}। उचित कीमत?',
        'दर ₹{listingPrice} प्रति {unit} है। स्टॉक: {quantity} {unit}। बाजार औसत ₹{marketPrice} है। अच्छा सौदा?'
      ],
      bn: [
        'তালিকাভুক্ত মূল্য ₹{listingPrice} প্রতি {unit}। আমি যুক্তিসঙ্গত অফারের জন্য উন্মুক্ত।',
        'বর্তমান মূল্য ₹{listingPrice}। বাজার মূল্য প্রায় ₹{marketPrice}। আপনার বাজেট কত?',
        'এটি ₹{listingPrice} প্রতি {unit} মূল্যে। আপনি কি অফার করতে চান?'
      ],
      te: [
        'జాబితా ధర ₹{listingPrice} ప్రతి {unit}. నేను సహేతుకమైన ఆఫర్‌లకు సిద్ధంగా ఉన్నాను.',
        'ప్రస్తుత ధర ₹{listingPrice}. మార్కెట్ రేటు దాదాపు ₹{marketPrice}. మీ బడ్జెట్ ఎంత?',
        'ఇది ₹{listingPrice} ప్రతి {unit} ధరలో ఉంది. మీరు ఆఫర్ చేయాలనుకుంటున్నారా?'
      ],
      mr: [
        'सूचीबद्ध किंमत ₹{listingPrice} प्रति {unit} आहे। मी वाजवी ऑफरसाठी खुला आहे।',
        'सध्याची किंमत ₹{listingPrice} आहे। बाजार दर सुमारे ₹{marketPrice} आहे। तुमचा बजेट काय आहे?'
      ],
      ta: [
        'பட்டியல் விலை ₹{listingPrice} ஒன்றுக்கு {unit}. நான் நியாயமான சலுகைகளுக்கு திறந்திருக்கிறேன்.',
        'தற்போதைய விலை ₹{listingPrice}. சந்தை விலை சுமார் ₹{marketPrice}. உங்கள் பட்ஜெட் என்ன?'
      ],
      gu: [
        'સૂચિબદ્ધ કિંમત ₹{listingPrice} પ્રતિ {unit} છે. હું વાજબી ઓફર માટે ખુલ્લો છું।',
        'વર્તમાન કિંમત ₹{listingPrice} છે. બજાર દર લગભગ ₹{marketPrice} છે. તમારું બજેટ શું છે?'
      ],
      kn: [
        'ಪಟ್ಟಿ ಬೆಲೆ ₹{listingPrice} ಪ್ರತಿ {unit}. ನಾನು ಸಮಂಜಸವಾದ ಆಫರ್‌ಗಳಿಗೆ ತೆರೆದಿದ್ದೇನೆ.',
        'ಪ್ರಸ್ತುತ ಬೆಲೆ ₹{listingPrice}. ಮಾರುಕಟ್ಟೆ ದರ ಸುಮಾರು ₹{marketPrice}. ನಿಮ್ಮ ಬಜೆಟ್ ಎಷ್ಟು?'
      ],
      ml: ['പട്ടികപ്പെടുത്തിയ വില ₹{listingPrice} ഒന്നിന് {unit}. ഞാൻ ന്യായമായ ഓഫറുകൾക്കായി തുറന്നിരിക്കുന്നു.'],
      pa: ['ਸੂਚੀਬੱਧ ਕੀਮਤ ₹{listingPrice} ਪ੍ਰਤੀ {unit} ਹੈ। ਮੈਂ ਵਾਜਬ ਪੇਸ਼ਕਸ਼ਾਂ ਲਈ ਖੁੱਲ੍ਹਾ ਹਾਂ।'],
      ur: ['فہرست شدہ قیمت ₹{listingPrice} فی {unit} ہے۔ میں معقول پیشکشوں کے لیے کھلا ہوں۔'],
      or: ['ତାଲିକାଭୁକ୍ତ ମୂଲ୍ୟ ₹{listingPrice} ପ୍ରତି {unit}। ମୁଁ ଯୁକ୍ତିଯୁକ୍ତ ଅଫର୍ ପାଇଁ ଖୋଲା ଅଛି।']
    }
  },
  // "How much" questions with quantity - MAXIMUM VARIATIONS (20+ responses per language)
  {
    pattern: /(how much|kitna|kitne|kya rate|what price|what cost|kya daam|price kya|cost kya).*(\d+)/i,
    weight: 1.0,
    responses: {
      en: [
        'For {mentionedQuantity} {mentionedUnit}, the price would be ₹{estimatedTotal}. The rate is ₹{listingPrice} per {unit}. Interested?',
        '{mentionedQuantity} {mentionedUnit} would cost ₹{estimatedTotal} at ₹{listingPrice} per {unit}. Shall we proceed?',
        'At ₹{listingPrice} per {unit}, {mentionedQuantity} {mentionedUnit} comes to ₹{estimatedTotal}. Good deal?',
        'The cost for {mentionedQuantity} {mentionedUnit} is ₹{estimatedTotal}. Rate: ₹{listingPrice}/{unit}. Want it?',
        'Let me calculate: {mentionedQuantity} {mentionedUnit} × ₹{listingPrice}/{unit} = ₹{estimatedTotal}. Sounds good?',
        '{mentionedQuantity} {mentionedUnit}? That\'ll be ₹{estimatedTotal} total. Price per {unit} is ₹{listingPrice}. Deal?',
        'Sure! {mentionedQuantity} {mentionedUnit} costs ₹{estimatedTotal}. I\'m selling at ₹{listingPrice} per {unit}. Interested?',
        'The total for {mentionedQuantity} {mentionedUnit} is ₹{estimatedTotal} (₹{listingPrice}/{unit}). Ready to buy?',
        '{mentionedQuantity} {mentionedUnit} will be ₹{estimatedTotal}. My rate: ₹{listingPrice} per {unit}. Good price?',
        'Price for {mentionedQuantity} {mentionedUnit}: ₹{estimatedTotal}. That\'s ₹{listingPrice} per {unit}. Fair deal?',
        'You need {mentionedQuantity} {mentionedUnit}? Total comes to ₹{estimatedTotal} at my rate of ₹{listingPrice}/{unit}. Acceptable?',
        'For that quantity ({mentionedQuantity} {mentionedUnit}), you\'re looking at ₹{estimatedTotal}. Rate is ₹{listingPrice} per {unit}. Works for you?',
        'Quick calculation: {mentionedQuantity} {mentionedUnit} = ₹{estimatedTotal}. My price: ₹{listingPrice}/{unit}. Shall we finalize?',
        '{mentionedQuantity} {mentionedUnit} at ₹{listingPrice} per {unit} equals ₹{estimatedTotal}. This is a fair market price. Agree?',
        'The amount for {mentionedQuantity} {mentionedUnit} would be ₹{estimatedTotal}. I\'m offering ₹{listingPrice} per {unit}. Deal?',
        'Let me break it down: {mentionedQuantity} {mentionedUnit} × ₹{listingPrice} = ₹{estimatedTotal}. Competitive price! Interested?',
        'You want {mentionedQuantity} {mentionedUnit}? That\'s ₹{estimatedTotal} at ₹{listingPrice} per {unit}. Ready to proceed?',
        'Total cost: ₹{estimatedTotal} for {mentionedQuantity} {mentionedUnit}. Rate: ₹{listingPrice}/{unit}. Good for you?',
        'For {mentionedQuantity} {mentionedUnit}, I can do ₹{estimatedTotal} (₹{listingPrice} per {unit}). Fair price?',
        '{mentionedQuantity} {mentionedUnit} comes out to ₹{estimatedTotal}. That\'s at ₹{listingPrice} per {unit}. Shall we close this?'
      ],
      hi: [
        '{mentionedQuantity} {mentionedUnit} के लिए कीमत ₹{estimatedTotal} होगी। दर ₹{listingPrice} प्रति {unit} है। रुचि है?',
        '{mentionedQuantity} {mentionedUnit} की कीमत ₹{estimatedTotal} होगी, ₹{listingPrice} प्रति {unit} पर। आगे बढ़ें?',
        '₹{listingPrice} प्रति {unit} पर, {mentionedQuantity} {mentionedUnit} ₹{estimatedTotal} होगा। अच्छा सौदा?',
        '{mentionedQuantity} {mentionedUnit} के लिए लागत ₹{estimatedTotal} है। दर: ₹{listingPrice}/{unit}। चाहिए?',
        'मैं गणना करता हूं: {mentionedQuantity} {mentionedUnit} × ₹{listingPrice}/{unit} = ₹{estimatedTotal}। ठीक लगता है?',
        '{mentionedQuantity} {mentionedUnit}? यह कुल ₹{estimatedTotal} होगा। प्रति {unit} कीमत ₹{listingPrice} है। सौदा?',
        'ज़रूर! {mentionedQuantity} {mentionedUnit} की कीमत ₹{estimatedTotal} है। मैं ₹{listingPrice} प्रति {unit} पर बेच रहा हूं। रुचि है?',
        '{mentionedQuantity} {mentionedUnit} के लिए कुल ₹{estimatedTotal} है (₹{listingPrice}/{unit})। खरीदने के लिए तैयार हैं?',
        '{mentionedQuantity} {mentionedUnit} ₹{estimatedTotal} होगा। मेरी दर: ₹{listingPrice} प्रति {unit}। अच्छी कीमत?',
        '{mentionedQuantity} {mentionedUnit} की कीमत: ₹{estimatedTotal}। यह ₹{listingPrice} प्रति {unit} है। उचित सौदा?',
        'आपको {mentionedQuantity} {mentionedUnit} चाहिए? कुल ₹{estimatedTotal} होगा, मेरी दर ₹{listingPrice}/{unit} पर। स्वीकार्य?',
        'उस मात्रा ({mentionedQuantity} {mentionedUnit}) के लिए, ₹{estimatedTotal} होगा। दर ₹{listingPrice} प्रति {unit} है। आपके लिए ठीक है?',
        'त्वरित गणना: {mentionedQuantity} {mentionedUnit} = ₹{estimatedTotal}। मेरी कीमत: ₹{listingPrice}/{unit}। अंतिम रूप दें?',
        '{mentionedQuantity} {mentionedUnit}, ₹{listingPrice} प्रति {unit} पर = ₹{estimatedTotal}। यह उचित बाजार मूल्य है। सहमत?',
        '{mentionedQuantity} {mentionedUnit} के लिए राशि ₹{estimatedTotal} होगी। मैं ₹{listingPrice} प्रति {unit} दे रहा हूं। सौदा?',
        'मैं विवरण देता हूं: {mentionedQuantity} {mentionedUnit} × ₹{listingPrice} = ₹{estimatedTotal}। प्रतिस्पर्धी कीमत! रुचि है?',
        'आप {mentionedQuantity} {mentionedUnit} चाहते हैं? यह ₹{estimatedTotal} है, ₹{listingPrice} प्रति {unit} पर। आगे बढ़ने के लिए तैयार?',
        'कुल लागत: {mentionedQuantity} {mentionedUnit} के लिए ₹{estimatedTotal}। दर: ₹{listingPrice}/{unit}। आपके लिए अच्छा?',
        '{mentionedQuantity} {mentionedUnit} के लिए, मैं ₹{estimatedTotal} दे सकता हूं (₹{listingPrice} प्रति {unit})। उचित कीमत?',
        '{mentionedQuantity} {mentionedUnit} ₹{estimatedTotal} होता है। यह ₹{listingPrice} प्रति {unit} पर है। क्या हम इसे बंद करें?'
      ],
      bn: [
        '{mentionedQuantity} {mentionedUnit} এর জন্য দাম ₹{estimatedTotal} হবে। হার ₹{listingPrice} প্রতি {unit}। আগ্রহী?',
        '{mentionedQuantity} {mentionedUnit} খরচ হবে ₹{estimatedTotal}, ₹{listingPrice} প্রতি {unit} এ। এগিয়ে যাব?'
      ],
      te: [
        '{mentionedQuantity} {mentionedUnit} కోసం ధర ₹{estimatedTotal} అవుతుంది। రేటు ₹{listingPrice} ప్రతి {unit}. ఆసక్తి ఉందా?',
        '{mentionedQuantity} {mentionedUnit} ఖర్చు ₹{estimatedTotal}, ₹{listingPrice} ప్రతి {unit} వద్ద. కొనసాగించాలా?'
      ],
      mr: [
        '{mentionedQuantity} {mentionedUnit} साठी किंमत ₹{estimatedTotal} असेल। दर ₹{listingPrice} प्रति {unit}. रस आहे का?'
      ],
      ta: [
        '{mentionedQuantity} {mentionedUnit} க்கு விலை ₹{estimatedTotal} ஆகும். விலை ₹{listingPrice} ஒன்றுக்கு {unit}. ஆர்வமா?'
      ],
      gu: [
        '{mentionedQuantity} {mentionedUnit} માટે કિંમત ₹{estimatedTotal} હશે। દર ₹{listingPrice} પ્રતિ {unit}. રસ છે?'
      ],
      kn: [
        '{mentionedQuantity} {mentionedUnit} ಗೆ ಬೆಲೆ ₹{estimatedTotal} ಆಗುತ್ತದೆ. ದರ ₹{listingPrice} ಪ್ರತಿ {unit}. ಆಸಕ್ತಿ ಇದೆಯೇ?'
      ],
      ml: ['{mentionedQuantity} {mentionedUnit} ന് വില ₹{estimatedTotal} ആയിരിക്കും. നിരക്ക് ₹{listingPrice} ഒന്നിന് {unit}. താൽപ്പര്യമുണ്ടോ?'],
      pa: ['{mentionedQuantity} {mentionedUnit} ਲਈ ਕੀਮਤ ₹{estimatedTotal} ਹੋਵੇਗੀ। ਦਰ ₹{listingPrice} ਪ੍ਰਤੀ {unit}। ਦਿਲਚਸਪੀ ਹੈ?'],
      ur: ['{mentionedQuantity} {mentionedUnit} کے لیے قیمت ₹{estimatedTotal} ہوگی۔ شرح ₹{listingPrice} فی {unit}۔ دلچسپی ہے؟'],
      or: ['{mentionedQuantity} {mentionedUnit} ପାଇଁ ମୂଲ୍ୟ ₹{estimatedTotal} ହେବ। ହାର ₹{listingPrice} ପ୍ରତି {unit}। ଆଗ୍ରହ ଅଛି କି?']
    }
  },
  // "I want" with quantity - EXPANDED VARIATIONS
  {
    pattern: /(i want|i need|mujhe chahiye|chahiye|lena hai|dena).*(\d+)/i,
    weight: 1.0,
    responses: {
      en: [
        'Perfect! {mentionedQuantity} {mentionedUnit} is available. At ₹{listingPrice} per {unit}, total is ₹{estimatedTotal}. Deal?',
        'Sure! I can provide {mentionedQuantity} {mentionedUnit}. Cost: ₹{estimatedTotal} (₹{listingPrice}/{unit}). Proceed?',
        'Great choice! {mentionedQuantity} {mentionedUnit} = ₹{estimatedTotal}. Rate: ₹{listingPrice}/{unit}. Confirm?',
        'Absolutely! {mentionedQuantity} {mentionedUnit} available. Total: ₹{estimatedTotal}. Shall we finalize?',
        'Excellent! You want {mentionedQuantity} {mentionedUnit}. That\'s ₹{estimatedTotal} at ₹{listingPrice} per {unit}. Ready?',
        'No problem! {mentionedQuantity} {mentionedUnit} in stock. Price: ₹{estimatedTotal}. Rate: ₹{listingPrice}/{unit}. Good?',
        'Of course! {mentionedQuantity} {mentionedUnit} costs ₹{estimatedTotal}. I\'m selling at ₹{listingPrice} per {unit}. Interested?',
        'Wonderful! {mentionedQuantity} {mentionedUnit} = ₹{estimatedTotal} total. My rate: ₹{listingPrice} per {unit}. Deal?',
        'Certainly! I have {mentionedQuantity} {mentionedUnit} ready. Total: ₹{estimatedTotal} (₹{listingPrice}/{unit}). Proceed?',
        'Great! {mentionedQuantity} {mentionedUnit} available at ₹{listingPrice} per {unit}. Total: ₹{estimatedTotal}. Confirm?',
        'Perfect timing! {mentionedQuantity} {mentionedUnit} in stock. Cost: ₹{estimatedTotal}. Rate: ₹{listingPrice}/{unit}. Deal?',
        'You got it! {mentionedQuantity} {mentionedUnit} = ₹{estimatedTotal}. Selling at ₹{listingPrice} per {unit}. Ready to buy?'
      ],
      hi: [
        'बिल्कुल! {mentionedQuantity} {mentionedUnit} उपलब्ध है। ₹{listingPrice} प्रति {unit} पर, कुल ₹{estimatedTotal} है। सौदा?',
        'ज़रूर! मैं {mentionedQuantity} {mentionedUnit} दे सकता हूं। लागत: ₹{estimatedTotal} (₹{listingPrice}/{unit})। आगे बढ़ें?',
        'बढ़िया चुनाव! {mentionedQuantity} {mentionedUnit} = ₹{estimatedTotal}। दर: ₹{listingPrice}/{unit}। पुष्टि करें?',
        'बिल्कुल! {mentionedQuantity} {mentionedUnit} उपलब्ध। कुल: ₹{estimatedTotal}। अंतिम रूप दें?',
        'उत्कृष्ट! आप {mentionedQuantity} {mentionedUnit} चाहते हैं। यह ₹{estimatedTotal} है, ₹{listingPrice} प्रति {unit} पर। तैयार?',
        'कोई समस्या नहीं! {mentionedQuantity} {mentionedUnit} स्टॉक में। कीमत: ₹{estimatedTotal}। दर: ₹{listingPrice}/{unit}। ठीक है?',
        'बेशक! {mentionedQuantity} {mentionedUnit} की कीमत ₹{estimatedTotal} है। मैं ₹{listingPrice} प्रति {unit} पर बेच रहा हूं। रुचि है?',
        'शानदार! {mentionedQuantity} {mentionedUnit} = ₹{estimatedTotal} कुल। मेरी दर: ₹{listingPrice} प्रति {unit}। सौदा?',
        'निश्चित रूप से! मेरे पास {mentionedQuantity} {mentionedUnit} तैयार है। कुल: ₹{estimatedTotal} (₹{listingPrice}/{unit})। आगे बढ़ें?',
        'बढ़िया! {mentionedQuantity} {mentionedUnit} उपलब्ध, ₹{listingPrice} प्रति {unit} पर। कुल: ₹{estimatedTotal}। पुष्टि करें?',
        'सही समय! {mentionedQuantity} {mentionedUnit} स्टॉक में। लागत: ₹{estimatedTotal}। दर: ₹{listingPrice}/{unit}। सौदा?',
        'आपको मिल गया! {mentionedQuantity} {mentionedUnit} = ₹{estimatedTotal}। ₹{listingPrice} प्रति {unit} पर बेच रहा हूं। खरीदने के लिए तैयार?'
      ],
      bn: [
        'নিখুঁত! {mentionedQuantity} {mentionedUnit} উপলব্ধ। ₹{listingPrice} প্রতি {unit} এ, মোট ₹{estimatedTotal}। চুক্তি?',
        'অবশ্যই! আমি {mentionedQuantity} {mentionedUnit} দিতে পারি। খরচ: ₹{estimatedTotal} (₹{listingPrice}/{unit})। এগিয়ে যাব?'
      ],
      te: [
        'పర్ఫెక్ట్! {mentionedQuantity} {mentionedUnit} అందుబాటులో ఉంది. ₹{listingPrice} ప్రతి {unit} వద్ద, మొత్తం ₹{estimatedTotal}. డీల్?',
        'ఖచ్చితంగా! నేను {mentionedQuantity} {mentionedUnit} అందించగలను. ఖర్చు: ₹{estimatedTotal} (₹{listingPrice}/{unit}). కొనసాగించాలా?'
      ],
      mr: [
        'परिपूर्ण! {mentionedQuantity} {mentionedUnit} उपलब्ध आहे। ₹{listingPrice} प्रति {unit} वर, एकूण ₹{estimatedTotal}. डील?'
      ],
      ta: [
        'சரியானது! {mentionedQuantity} {mentionedUnit} கிடைக்கிறது. ₹{listingPrice} ஒன்றுக்கு {unit} இல், மொத்தம் ₹{estimatedTotal}. ஒப்பந்தமா?'
      ],
      gu: [
        'સંપૂર્ણ! {mentionedQuantity} {mentionedUnit} ઉપલબ્ધ છે. ₹{listingPrice} પ્રતિ {unit} પર, કુલ ₹{estimatedTotal}. ડીલ?'
      ],
      kn: [
        'ಪರಿಪೂರ್ಣ! {mentionedQuantity} {mentionedUnit} ಲಭ್ಯವಿದೆ. ₹{listingPrice} ಪ್ರತಿ {unit} ನಲ್ಲಿ, ಒಟ್ಟು ₹{estimatedTotal}. ಡೀಲ್?'
      ],
      ml: ['പെർഫെക്റ്റ്! {mentionedQuantity} {mentionedUnit} ലഭ്യമാണ്. ₹{listingPrice} ഒന്നിന് {unit} ൽ, ആകെ ₹{estimatedTotal}. ഡീൽ?'],
      pa: ['ਸੰਪੂਰਨ! {mentionedQuantity} {mentionedUnit} ਉਪਲਬਧ ਹੈ। ₹{listingPrice} ਪ੍ਰਤੀ {unit} ਤੇ, ਕੁੱਲ ₹{estimatedTotal}। ਡੀਲ?'],
      ur: ['کامل! {mentionedQuantity} {mentionedUnit} دستیاب ہے۔ ₹{listingPrice} فی {unit} پر، کل ₹{estimatedTotal}۔ ڈیل?'],
      or: ['ସମ୍ପୂର୍ଣ୍ଣ! {mentionedQuantity} {mentionedUnit} ଉପଲବ୍ଧ। ₹{listingPrice} ପ୍ରତି {unit} ରେ, ମୋଟ ₹{estimatedTotal}। ଡିଲ୍?']
    }
  },
  // Purchase intent with quantity mentioned
  {
    pattern: /(want to (buy|purchase)|need|chahiye|lena hai|kharidna hai).*(\d+)/i,
    weight: 1.0,
    responses: {
      en: [
        'Great! You want {mentionedQuantity} {mentionedUnit}. I have {quantity} {unit} available. The price is ₹{listingPrice} per {unit}. Does that work for you?',
        'Perfect! {mentionedQuantity} {mentionedUnit} is available. At ₹{listingPrice} per {unit}, that would be ₹{estimatedTotal}. Interested?',
        'Excellent! I can sell you {mentionedQuantity} {mentionedUnit}. The rate is ₹{listingPrice} per {unit}. Would you like to proceed?',
        'Sure! {mentionedQuantity} {mentionedUnit} is no problem. Price is ₹{listingPrice} per {unit}. Shall we finalize this?'
      ],
      hi: [
        'बढ़िया! आप {mentionedQuantity} {mentionedUnit} चाहते हैं। मेरे पास {quantity} {unit} उपलब्ध है। कीमत ₹{listingPrice} प्रति {unit} है। क्या यह आपके लिए काम करता है?',
        'बिल्कुल! {mentionedQuantity} {mentionedUnit} उपलब्ध है। ₹{listingPrice} प्रति {unit} पर, यह ₹{estimatedTotal} होगा। रुचि है?',
        'उत्कृष्ट! मैं आपको {mentionedQuantity} {mentionedUnit} बेच सकता हूं। दर ₹{listingPrice} प्रति {unit} है। क्या आप आगे बढ़ना चाहेंगे?',
        'ज़रूर! {mentionedQuantity} {mentionedUnit} कोई समस्या नहीं है। कीमत ₹{listingPrice} प्रति {unit} है। क्या हम इसे अंतिम रूप दें?'
      ],
      bn: [
        'দুর্দান্ত! আপনি {mentionedQuantity} {mentionedUnit} চান। আমার কাছে {quantity} {unit} উপলব্ধ আছে। দাম ₹{listingPrice} প্রতি {unit}। এটা কি আপনার জন্য কাজ করে?',
        'নিখুঁত! {mentionedQuantity} {mentionedUnit} উপলব্ধ। ₹{listingPrice} প্রতি {unit} এ, এটি ₹{estimatedTotal} হবে। আগ্রহী?'
      ],
      te: [
        'గొప్ప! మీకు {mentionedQuantity} {mentionedUnit} కావాలి. నా దగ్గర {quantity} {unit} అందుబాటులో ఉంది. ధర ₹{listingPrice} ప్రతి {unit}. అది మీకు పని చేస్తుందా?',
        'పర్ఫెక్ట్! {mentionedQuantity} {mentionedUnit} అందుబాటులో ఉంది. ₹{listingPrice} ప్రతి {unit} వద్ద, అది ₹{estimatedTotal} అవుతుంది. ఆసక్తి ఉందా?'
      ],
      mr: [
        'छान! तुम्हाला {mentionedQuantity} {mentionedUnit} हवे आहे। माझ्याकडे {quantity} {unit} उपलब्ध आहे। किंमत ₹{listingPrice} प्रति {unit} आहे। ते तुमच्यासाठी काम करते का?'
      ],
      ta: [
        'அருமை! உங்களுக்கு {mentionedQuantity} {mentionedUnit} வேண்டும். என்னிடம் {quantity} {unit} கிடைக்கிறது. விலை ₹{listingPrice} ஒன்றுக்கு {unit}. அது உங்களுக்கு வேலை செய்யுமா?'
      ],
      gu: [
        'સરસ! તમને {mentionedQuantity} {mentionedUnit} જોઈએ છે। મારી પાસે {quantity} {unit} ઉપલબ્ધ છે। કિંમત ₹{listingPrice} પ્રતિ {unit} છે। તે તમારા માટે કામ કરે છે?'
      ],
      kn: [
        'ಅದ್ಭುತ! ನಿಮಗೆ {mentionedQuantity} {mentionedUnit} ಬೇಕು. ನನ್ನ ಬಳಿ {quantity} {unit} ಲಭ್ಯವಿದೆ. ಬೆಲೆ ₹{listingPrice} ಪ್ರತಿ {unit}. ಅದು ನಿಮಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆಯೇ?'
      ],
      ml: ['മികച്ചത്! നിങ്ങൾക്ക് {mentionedQuantity} {mentionedUnit} വേണം. എന്റെ പക്കൽ {quantity} {unit} ലഭ്യമാണ്. വില ₹{listingPrice} ഒന്നിന് {unit}. അത് നിങ്ങൾക്ക് പ്രവർത്തിക്കുമോ?'],
      pa: ['ਵਧੀਆ! ਤੁਹਾਨੂੰ {mentionedQuantity} {mentionedUnit} ਚਾਹੀਦਾ ਹੈ। ਮੇਰੇ ਕੋਲ {quantity} {unit} ਉਪਲਬਧ ਹੈ। ਕੀਮਤ ₹{listingPrice} ਪ੍ਰਤੀ {unit} ਹੈ। ਕੀ ਇਹ ਤੁਹਾਡੇ ਲਈ ਕੰਮ ਕਰਦਾ ਹੈ?'],
      ur: ['بہترین! آپ کو {mentionedQuantity} {mentionedUnit} چاہیے۔ میرے پاس {quantity} {unit} دستیاب ہے۔ قیمت ₹{listingPrice} فی {unit} ہے۔ کیا یہ آپ کے لیے کام کرتا ہے؟'],
      or: ['ଉତ୍କୃଷ୍ଟ! ଆପଣ {mentionedQuantity} {mentionedUnit} ଚାହୁଁଛନ୍ତି। ମୋ ପାଖରେ {quantity} {unit} ଉପଲବ୍ଧ ଅଛି। ମୂଲ୍ୟ ₹{listingPrice} ପ୍ରତି {unit}। ଏହା ଆପଣଙ୍କ ପାଇଁ କାମ କରେ କି?']
    }
  },
  // Purchase intent with quantity
  {
    pattern: /(want to (buy|purchase)|need|chahiye|lena hai|kharidna hai)/i,
    weight: 0.95,
    responses: {
      en: [
        'Great! I\'d be happy to sell to you. How much quantity do you need?',
        'Excellent! I have {quantity} {unit} available. How much would you like?',
        'Perfect! What quantity are you looking for? I have {quantity} {unit} in stock.',
        'Wonderful! Let\'s discuss the quantity and price. What amount do you need?'
      ],
      hi: [
        'बढ़िया! मुझे आपको बेचने में खुशी होगी। आपको कितनी मात्रा चाहिए?',
        'उत्कृष्ट! मेरे पास {quantity} {unit} उपलब्ध है। आप कितना चाहेंगे?',
        'बिल्कुल! आप कितनी मात्रा की तलाश में हैं? मेरे पास {quantity} {unit} स्टॉक में है।',
        'शानदार! चलिए मात्रा और कीमत पर चर्चा करते हैं। आपको कितनी मात्रा चाहिए?'
      ],
      bn: [
        'দুর্দান্ত! আমি আপনার কাছে বিক্রি করতে খুশি হব। আপনার কত পরিমাণ দরকার?',
        'চমৎকার! আমার কাছে {quantity} {unit} উপলব্ধ আছে। আপনি কতটা চান?',
        'নিখুঁত! আপনি কত পরিমাণ খুঁজছেন? আমার স্টকে {quantity} {unit} আছে।'
      ],
      te: [
        'గొప్ప! నేను మీకు అమ్మడానికి సంతోషిస్తాను. మీకు ఎంత పరిమాణం కావాలి?',
        'అద్భుతం! నా దగ్గర {quantity} {unit} అందుబాటులో ఉంది. మీరు ఎంత కావాలి?',
        'పర్ఫెక్ట్! మీరు ఎంత పరిమాణం కోసం చూస్తున్నారు? నా స్టాక్‌లో {quantity} {unit} ఉంది.'
      ],
      mr: [
        'छान! मला तुम्हाला विकायला आनंद होईल। तुम्हाला किती प्रमाण हवे आहे?',
        'उत्कृष्ट! माझ्याकडे {quantity} {unit} उपलब्ध आहे। तुम्हाला किती हवे आहे?'
      ],
      ta: [
        'அருமை! நான் உங்களுக்கு விற்க மகிழ்ச்சியாக இருப்பேன். உங்களுக்கு எவ்வளவு அளவு தேவை?',
        'சிறப்பு! என்னிடம் {quantity} {unit} கிடைக்கிறது. நீங்கள் எவ்வளவு விரும்புகிறீர்கள்?'
      ],
      gu: [
        'સરસ! મને તમને વેચવામાં આનંદ થશે. તમને કેટલું જથ્થો જોઈએ છે?',
        'ઉત્કૃષ્ટ! મારી પાસે {quantity} {unit} ઉપલબ્ધ છે. તમને કેટલું જોઈએ છે?'
      ],
      kn: [
        'ಅದ್ಭುತ! ನಾನು ನಿಮಗೆ ಮಾರಾಟ ಮಾಡಲು ಸಂತೋಷಪಡುತ್ತೇನೆ. ನಿಮಗೆ ಎಷ್ಟು ಪ್ರಮಾಣ ಬೇಕು?',
        'ಅತ್ಯುತ್ತಮ! ನನ್ನ ಬಳಿ {quantity} {unit} ಲಭ್ಯವಿದೆ. ನೀವು ಎಷ್ಟು ಬಯಸುತ್ತೀರಿ?'
      ],
      ml: ['മികച്ചത്! ഞാൻ നിങ്ങൾക്ക് വിൽക്കാൻ സന്തോഷിക്കുന്നു. നിങ്ങൾക്ക് എത്ര അളവ് വേണം?'],
      pa: ['ਵਧੀਆ! ਮੈਨੂੰ ਤੁਹਾਨੂੰ ਵੇਚਣ ਵਿਚ ਖੁਸ਼ੀ ਹੋਵੇਗੀ। ਤੁਹਾਨੂੰ ਕਿੰਨੀ ਮਾਤਰਾ ਚਾਹੀਦੀ ਹੈ?'],
      ur: ['بہترین! مجھے آپ کو فروخت کرنے میں خوشی ہوگی۔ آپ کو کتنی مقدار چاہیے؟'],
      or: ['ଉତ୍କୃଷ୍ଟ! ମୁଁ ଆପଣଙ୍କୁ ବିକ୍ରୟ କରିବାକୁ ଖୁସି ହେବି। ଆପଣଙ୍କୁ କେତେ ପରିମାଣ ଦରକାର?']
    }
  },
  // Availability
  {
    pattern: /(available|stock|quantity|milega|hai kya|uplabdh|maujud)/i,
    weight: 0.85,
    responses: {
      en: [
        'Yes, I have {quantity} {unit} available right now. How much do you need?',
        'Currently in stock: {quantity} {unit}. All fresh and ready to ship!',
        'Available quantity is {quantity} {unit}. Would you like to take all of it or a portion?',
        'I have {quantity} {unit} ready. When do you need delivery?'
      ],
      hi: [
        'हां, मेरे पास अभी {quantity} {unit} उपलब्ध है। आपको कितना चाहिए?',
        'वर्तमान में स्टॉक में: {quantity} {unit}। सभी ताजा और भेजने के लिए तैयार!',
        'उपलब्ध मात्रा {quantity} {unit} है। क्या आप सब लेना चाहेंगे या कुछ हिस्सा?',
        'मेरे पास {quantity} {unit} तैयार है। आपको डिलीवरी कब चाहिए?'
      ],
      bn: [
        'হ্যাঁ, আমার কাছে এখন {quantity} {unit} উপলব্ধ আছে। আপনার কতটা দরকার?',
        'বর্তমানে স্টকে: {quantity} {unit}। সব তাজা এবং পাঠানোর জন্য প্রস্তুত!',
        'উপলব্ধ পরিমাণ {quantity} {unit}। আপনি কি সব নিতে চান নাকি একটি অংশ?'
      ],
      te: [
        'అవును, నా దగ్గర ప్రస్తుతం {quantity} {unit} అందుబాటులో ఉంది. మీకు ఎంత కావాలి?',
        'ప్రస్తుతం స్టాక్‌లో: {quantity} {unit}. అన్నీ తాజాగా మరియు రవాణా చేయడానికి సిద్ధంగా ఉన్నాయి!',
        'అందుబాటులో ఉన్న పరిమాణం {quantity} {unit}. మీరు అన్నింటినీ తీసుకోవాలనుకుంటున్నారా లేదా కొంత భాగాన్ని?'
      ],
      mr: [
        'होय, माझ्याकडे सध्या {quantity} {unit} उपलब्ध आहे। तुम्हाला किती हवे आहे?',
        'सध्या स्टॉकमध्ये: {quantity} {unit}। सर्व ताजे आणि पाठवण्यासाठी तयार!'
      ],
      ta: [
        'ஆம், என்னிடம் இப்போது {quantity} {unit} கிடைக்கிறது. உங்களுக்கு எவ்வளவு தேவை?',
        'தற்போது இருப்பில்: {quantity} {unit}. அனைத்தும் புதியது மற்றும் அனுப்ப தயாராக உள்ளது!'
      ],
      gu: [
        'હા, મારી પાસે અત્યારે {quantity} {unit} ઉપલબ્ધ છે. તમને કેટલું જોઈએ છે?',
        'હાલમાં સ્ટોકમાં: {quantity} {unit}. બધું તાજું અને મોકલવા માટે તૈયાર!'
      ],
      kn: [
        'ಹೌದು, ನನ್ನ ಬಳಿ ಈಗ {quantity} {unit} ಲಭ್ಯವಿದೆ. ನಿಮಗೆ ಎಷ್ಟು ಬೇಕು?',
        'ಪ್ರಸ್ತುತ ಸ್ಟಾಕ್‌ನಲ್ಲಿ: {quantity} {unit}. ಎಲ್ಲವೂ ತಾಜಾ ಮತ್ತು ಕಳುಹಿಸಲು ಸಿದ್ಧವಾಗಿದೆ!'
      ],
      ml: ['അതെ, എന്റെ പക്കൽ ഇപ്പോൾ {quantity} {unit} ലഭ്യമാണ്. നിങ്ങൾക്ക് എത്ര വേണം?'],
      pa: ['ਹਾਂ, ਮੇਰੇ ਕੋਲ ਹੁਣ {quantity} {unit} ਉਪਲਬਧ ਹੈ। ਤੁਹਾਨੂੰ ਕਿੰਨਾ ਚਾਹੀਦਾ ਹੈ?'],
      ur: ['ہاں، میرے پاس ابھی {quantity} {unit} دستیاب ہے۔ آپ کو کتنا چاہیے؟'],
      or: ['ହଁ, ମୋ ପାଖରେ ବର୍ତ୍ତମାନ {quantity} {unit} ଉପଲବ୍ଧ ଅଛି। ଆପଣଙ୍କୁ କେତେ ଦରକାର?']
    }
  },
  // Quality
  {
    pattern: /(quality|grade|condition|kaisa|accha|gunvatta|taaza|fresh)/i,
    weight: 0.8,
    responses: {
      en: [
        'The quality is excellent - Grade A. I take pride in my produce!',
        'Top quality! This is fresh harvest, properly stored and handled.',
        'Premium grade product. You can inspect it before finalizing if you\'d like.',
        'High quality assured. I\'ve been selling for years and maintain strict standards.'
      ],
      hi: [
        'गुणवत्ता उत्कृष्ट है - ग्रेड A। मुझे अपनी उपज पर गर्व है!',
        'शीर्ष गुणवत्ता! यह ताजा फसल है, ठीक से संग्रहीत और संभाली गई।',
        'प्रीमियम ग्रेड उत्पाद। यदि आप चाहें तो अंतिम रूप देने से पहले इसका निरीक्षण कर सकते हैं।',
        'उच्च गुणवत्ता सुनिश्चित। मैं वर्षों से बेच रहा हूं और सख्त मानक बनाए रखता हूं।'
      ],
      bn: [
        'গুণমান চমৎকার - গ্রেড A। আমি আমার পণ্যে গর্বিত!',
        'শীর্ষ মানের! এটি তাজা ফসল, সঠিকভাবে সংরক্ষিত এবং পরিচালিত।',
        'প্রিমিয়াম গ্রেড পণ্য। আপনি চাইলে চূড়ান্ত করার আগে এটি পরিদর্শন করতে পারেন।'
      ],
      te: [
        'నాణ్యత అద్భుతమైనది - గ్రేడ్ A. నా ఉత్పత్తిపై నాకు గర్వం!',
        'అగ్ర నాణ్యత! ఇది తాజా పంట, సరిగ్గా నిల్వ చేయబడింది మరియు నిర్వహించబడింది.',
        'ప్రీమియం గ్రేడ్ ఉత్పత్తి. మీరు కావాలంటే ఖరారు చేసే ముందు దీన్ని తనిఖీ చేయవచ్చు.'
      ],
      mr: [
        'गुणवत्ता उत्कृष्ट आहे - ग्रेड A. मला माझ्या उत्पादनाचा अभिमान आहे!',
        'उच्च दर्जाचे! हे ताजे कापणी आहे, योग्यरित्या साठवलेले आणि हाताळले आहे.'
      ],
      ta: [
        'தரம் சிறப்பானது - தரம் A. எனது உற்பத்தியில் நான் பெருமை கொள்கிறேன்!',
        'உயர் தரம்! இது புதிய அறுவடை, சரியாக சேமிக்கப்பட்டு கையாளப்பட்டது.'
      ],
      gu: [
        'ગુણવત્તા ઉત્કૃષ્ટ છે - ગ્રેડ A. મને મારા ઉત્પાદન પર ગર્વ છે!',
        'ટોચની ગુણવત્તા! આ તાજી લણણી છે, યોગ્ય રીતે સંગ્રહિત અને સંભાળવામાં આવી છે.'
      ],
      kn: [
        'ಗುಣಮಟ್ಟ ಅತ್ಯುತ್ತಮವಾಗಿದೆ - ಗ್ರೇಡ್ A. ನನ್ನ ಉತ್ಪನ್ನದ ಬಗ್ಗೆ ನನಗೆ ಹೆಮ್ಮೆ!',
        'ಉನ್ನತ ಗುಣಮಟ್ಟ! ಇದು ತಾಜಾ ಸುಗ್ಗಿ, ಸರಿಯಾಗಿ ಸಂಗ್ರಹಿಸಲಾಗಿದೆ ಮತ್ತು ನಿರ್ವಹಿಸಲಾಗಿದೆ.'
      ],
      ml: ['ഗുണനിലവാരം മികച്ചതാണ് - ഗ്രേഡ് A. എന്റെ ഉൽപ്പന്നത്തിൽ ഞാൻ അഭിമാനിക്കുന്നു!'],
      pa: ['ਗੁਣਵੱਤਾ ਸ਼ਾਨਦਾਰ ਹੈ - ਗ੍ਰੇਡ A. ਮੈਨੂੰ ਆਪਣੇ ਉਤਪਾਦ ਤੇ ਮਾਣ ਹੈ!'],
      ur: ['معیار بہترین ہے - گریڈ A۔ مجھے اپنی پیداوار پر فخر ہے!'],
      or: ['ଗୁଣବତ୍ତା ଉତ୍କୃଷ୍ଟ - ଗ୍ରେଡ୍ A। ମୁଁ ମୋର ଉତ୍ପାଦ ଉପରେ ଗର୍ବିତ!']
    }
  },
  // Negotiation / Discount requests
  {
    pattern: /(discount|lower|reduce|kam|ghata|chhoot|bargain|negotiate)/i,
    weight: 0.9,
    responses: {
      en: [
        'I understand you want a better price. What\'s your best offer?',
        'I can be flexible on price for serious buyers. What are you thinking?',
        'Let\'s negotiate! The market rate is ₹{marketPrice}. What can you offer?',
        'I\'m open to discussion. How much quantity are you looking to buy?'
      ],
      hi: [
        'मैं समझता हूं कि आप बेहतर कीमत चाहते हैं। आपका सबसे अच्छा प्रस्ताव क्या है?',
        'मैं गंभीर खरीदारों के लिए कीमत में लचीला हो सकता हूं। आप क्या सोच रहे हैं?',
        'चलिए बातचीत करते हैं! बाजार दर ₹{marketPrice} है। आप क्या दे सकते हैं?',
        'मैं चर्चा के लिए तैयार हूं। आप कितनी मात्रा खरीदना चाहते हैं?'
      ],
      bn: [
        'আমি বুঝতে পারছি আপনি আরও ভালো দাম চান। আপনার সেরা অফার কী?',
        'আমি গুরুতর ক্রেতাদের জন্য দামে নমনীয় হতে পারি। আপনি কী ভাবছেন?',
        'আসুন আলোচনা করি! বাজার মূল্য ₹{marketPrice}। আপনি কী দিতে পারেন?'
      ],
      te: [
        'మీరు మెరుగైన ధర కావాలని నేను అర్థం చేసుకున్నాను. మీ ఉత్తమ ఆఫర్ ఏమిటి?',
        'నేను తీవ్రమైన కొనుగోలుదారుల కోసం ధరలో సరళంగా ఉండగలను. మీరు ఏమి ఆలోచిస్తున్నారు?',
        'చర్చిద్దాం! మార్కెట్ రేటు ₹{marketPrice}. మీరు ఏమి ఇవ్వగలరు?'
      ],
      mr: [
        'मला समजले की तुम्हाला चांगली किंमत हवी आहे। तुमची सर्वोत्तम ऑफर काय आहे?',
        'मी गंभीर खरेदीदारांसाठी किंमतीत लवचिक असू शकतो। तुम्ही काय विचार करत आहात?'
      ],
      ta: [
        'நீங்கள் சிறந்த விலை விரும்புகிறீர்கள் என்பதை நான் புரிந்துகொள்கிறேன். உங்கள் சிறந்த சலுகை என்ன?',
        'நான் தீவிர வாங்குபவர்களுக்கு விலையில் நெகிழ்வாக இருக்க முடியும். நீங்கள் என்ன நினைக்கிறீர்கள்?'
      ],
      gu: [
        'હું સમજું છું કે તમને વધુ સારી કિંમત જોઈએ છે. તમારી શ્રેષ્ઠ ઓફર શું છે?',
        'હું ગંભીર ખરીદદારો માટે કિંમતમાં લવચીક હોઈ શકું છું. તમે શું વિચારી રહ્યા છો?'
      ],
      kn: [
        'ನೀವು ಉತ್ತಮ ಬೆಲೆಯನ್ನು ಬಯಸುತ್ತೀರಿ ಎಂದು ನಾನು ಅರ್ಥಮಾಡಿಕೊಂಡಿದ್ದೇನೆ. ನಿಮ್ಮ ಅತ್ಯುತ್ತಮ ಆಫರ್ ಏನು?',
        'ನಾನು ಗಂಭೀರ ಖರೀದಿದಾರರಿಗೆ ಬೆಲೆಯಲ್ಲಿ ಹೊಂದಿಕೊಳ್ಳಬಹುದು. ನೀವು ಏನು ಯೋಚಿಸುತ್ತಿದ್ದೀರಿ?'
      ],
      ml: ['നിങ്ങൾക്ക് മികച്ച വില വേണമെന്ന് ഞാൻ മനസ്സിലാക്കുന്നു. നിങ്ങളുടെ മികച്ച ഓഫർ എന്താണ്?'],
      pa: ['ਮੈਂ ਸਮਝਦਾ ਹਾਂ ਕਿ ਤੁਸੀਂ ਬਿਹਤਰ ਕੀਮਤ ਚਾਹੁੰਦੇ ਹੋ। ਤੁਹਾਡੀ ਸਭ ਤੋਂ ਵਧੀਆ ਪੇਸ਼ਕਸ਼ ਕੀ ਹੈ?'],
      ur: ['میں سمجھتا ہوں کہ آپ بہتر قیمت چاہتے ہیں۔ آپ کی بہترین پیشکش کیا ہے؟'],
      or: ['ମୁଁ ବୁଝିପାରୁଛି ଯେ ଆପଣ ଏକ ଭଲ ମୂଲ୍ୟ ଚାହୁଁଛନ୍ତି। ଆପଣଙ୍କର ସର୍ବୋତ୍ତମ ଅଫର୍ କଣ?']
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
    pattern: /(^ok$|^okay$|^yes$|^han$|^haan$|^thik$|^theek$|^agree$|^accept$|^done$|^pakka$|^bilkul$|^zaroor$)/i,
    weight: 1.0,
    responses: {
      en: [
        'Excellent! So we\'re agreed on ₹{agreedPrice} for {quantity} {unit}?',
        'Perfect! Let me confirm: ₹{agreedPrice} per {unit}, total {quantity} {unit}. Correct?',
        'Great! Shall we finalize at ₹{agreedPrice} for the full {quantity} {unit}?',
        'Wonderful! Ready to close the deal at ₹{agreedPrice}?'
      ],
      hi: [
        'बढ़िया! तो हम {quantity} {unit} के लिए ₹{agreedPrice} पर सहमत हैं?',
        'बिल्कुल! मुझे पुष्टि करने दें: ₹{agreedPrice} प्रति {unit}, कुल {quantity} {unit}। सही है?',
        'शानदार! क्या हम पूरे {quantity} {unit} के लिए ₹{agreedPrice} पर अंतिम रूप दें?',
        'अद्भुत! ₹{agreedPrice} पर सौदा बंद करने के लिए तैयार हैं?'
      ],
      bn: [
        'চমৎকার! তাহলে আমরা {quantity} {unit} এর জন্য ₹{agreedPrice} এ সম্মত?',
        'নিখুঁত! আমাকে নিশ্চিত করতে দিন: ₹{agreedPrice} প্রতি {unit}, মোট {quantity} {unit}। সঠিক?',
        'দুর্দান্ত! আমরা কি সম্পূর্ণ {quantity} {unit} এর জন্য ₹{agreedPrice} এ চূড়ান্ত করব?'
      ],
      te: [
        'అద్భుతం! కాబట్టి మేము {quantity} {unit} కోసం ₹{agreedPrice} పై అంగీకరించామా?',
        'పర్ఫెక్ట్! నేను నిర్ధారిస్తాను: ₹{agreedPrice} ప్రతి {unit}, మొత్తం {quantity} {unit}. సరైనదా?',
        'గొప్ప! మేము పూర్తి {quantity} {unit} కోసం ₹{agreedPrice} వద్ద ఖరారు చేద్దామా?'
      ],
      mr: [
        'उत्कृष्ट! तर आम्ही {quantity} {unit} साठी ₹{agreedPrice} वर सहमत आहोत?',
        'परिपूर्ण! मला पुष्टी करू द्या: ₹{agreedPrice} प्रति {unit}, एकूण {quantity} {unit}। बरोबर?'
      ],
      ta: [
        'சிறப்பு! எனவே நாம் {quantity} {unit} க்கு ₹{agreedPrice} இல் ஒப்புக்கொண்டோமா?',
        'சரியானது! நான் உறுதிப்படுத்துகிறேன்: ₹{agreedPrice} ஒன்றுக்கு {unit}, மொத்தம் {quantity} {unit}. சரியா?'
      ],
      gu: [
        'ઉત્કૃષ્ટ! તો અમે {quantity} {unit} માટે ₹{agreedPrice} પર સંમત છીએ?',
        'સંપૂર્ણ! મને પુષ્ટિ કરવા દો: ₹{agreedPrice} પ્રતિ {unit}, કુલ {quantity} {unit}. સાચું?'
      ],
      kn: [
        'ಅತ್ಯುತ್ತಮ! ಆದ್ದರಿಂದ ನಾವು {quantity} {unit} ಗೆ ₹{agreedPrice} ನಲ್ಲಿ ಒಪ್ಪಿಕೊಂಡಿದ್ದೇವೆಯೇ?',
        'ಪರಿಪೂರ್ಣ! ನಾನು ದೃಢೀಕರಿಸುತ್ತೇನೆ: ₹{agreedPrice} ಪ್ರತಿ {unit}, ಒಟ್ಟು {quantity} {unit}. ಸರಿಯೇ?'
      ],
      ml: ['മികച്ചത്! അതിനാൽ ഞങ്ങൾ {quantity} {unit} ന് ₹{agreedPrice} ൽ സമ്മതിച്ചോ?'],
      pa: ['ਸ਼ਾਨਦਾਰ! ਤਾਂ ਅਸੀਂ {quantity} {unit} ਲਈ ₹{agreedPrice} ਤੇ ਸਹਿਮਤ ਹਾਂ?'],
      ur: ['بہترین! تو ہم {quantity} {unit} کے لیے ₹{agreedPrice} پر متفق ہیں؟'],
      or: ['ଉତ୍କୃଷ୍ଟ! ତେବେ ଆମେ {quantity} {unit} ପାଇଁ ₹{agreedPrice} ରେ ସହମତ?']
    }
  },
  // Deal finalization - MAXIMUM VARIATIONS (20+ per language)
  // NOTE: These should ask for confirmation BEFORE finalizing
  {
    pattern: /(finalize|complete|confirm|close deal|pakka kar|deal done|book|order|buy|purchase|let'?s do it|go ahead|proceed|seal the deal|lock it|done deal|i'?ll take it|sold|wrap it up|make it final|kharid liya|le liya|ho gaya|theek hai final|bas final kar|sahi hai confirm|yes final|ok final|han pakka|thik final)/i,
    weight: 1.0,
    responses: {
      en: [
        '🎉 Excellent! Let me confirm:\n📦 Quantity: {quantity} {unit}\n💰 Price: ₹{listingPrice} per {unit}\n💵 Total: ₹{totalAmount}\n\nType YES to finalize this deal!',
        '✅ Perfect! Deal Summary:\n• {quantity} {unit} at ₹{listingPrice}/{unit}\n• Total Amount: ₹{totalAmount}\n\nReady to proceed? Type YES to confirm!',
        '🤝 Great! Final Details:\n📊 Quantity: {quantity} {unit}\n💰 Rate: ₹{listingPrice} per {unit}\n💵 Total: ₹{totalAmount}\n\nConfirm with YES to complete!',
        '🎯 Wonderful! Order Summary:\n{quantity} {unit} × ₹{listingPrice} = ₹{totalAmount}\n\nType YES to finalize the deal!',
        '✨ Excellent! Let\'s confirm:\n📦 {quantity} {unit}\n💰 ₹{listingPrice} per {unit}\n💵 Total: ₹{totalAmount}\n\nSay YES to proceed!',
        '🤝 Perfect! Deal Terms:\n• Quantity: {quantity} {unit}\n• Price: ₹{listingPrice}/{unit}\n• Total: ₹{totalAmount}\n\nType YES to finalize!',
        '🎉 Great! Final Check:\n{quantity} {unit} for ₹{totalAmount}\nRate: ₹{listingPrice} per {unit}\n\nConfirm with YES!',
        '✅ Wonderful! Summary:\n📦 {quantity} {unit}\n💰 ₹{listingPrice}/{unit}\n💵 ₹{totalAmount} total\n\nType YES to complete!',
        '🤝 Excellent! Deal Details:\nQuantity: {quantity} {unit}\nPrice: ₹{listingPrice} per {unit}\nTotal: ₹{totalAmount}\n\nSay YES to finalize!',
        '🎯 Perfect! Order:\n{quantity} {unit} at ₹{listingPrice}/{unit}\nTotal: ₹{totalAmount}\n\nType YES to proceed!',
        '✨ Great! Verification:\n📦 {quantity} {unit}\n💰 ₹{listingPrice} per {unit}\n💵 ₹{totalAmount}\n\nConfirm with YES!',
        '🎉 Wonderful! Final Terms:\n{quantity} {unit} × ₹{listingPrice} = ₹{totalAmount}\n\nType YES to finalize!',
        '✅ Excellent! Deal Summary:\nQuantity: {quantity} {unit}\nRate: ₹{listingPrice}/{unit}\nTotal: ₹{totalAmount}\n\nSay YES to complete!',
        '🤝 Perfect! Confirmation:\n📦 {quantity} {unit}\n💰 ₹{listingPrice} per {unit}\n💵 ₹{totalAmount} total\n\nType YES to proceed!',
        '🎯 Great! Final Details:\n{quantity} {unit} at ₹{listingPrice}/{unit}\nTotal: ₹{totalAmount}\n\nConfirm with YES!',
        '✨ Wonderful! Order Summary:\n{quantity} {unit} × ₹{listingPrice} = ₹{totalAmount}\n\nType YES to finalize!',
        '🎉 Excellent! Deal Terms:\n📦 {quantity} {unit}\n💰 ₹{listingPrice}/{unit}\n💵 ₹{totalAmount}\n\nSay YES to complete!',
        '✅ Perfect! Final Check:\nQuantity: {quantity} {unit}\nPrice: ₹{listingPrice} per {unit}\nTotal: ₹{totalAmount}\n\nType YES to proceed!',
        '🤝 Great! Summary:\n{quantity} {unit} for ₹{totalAmount}\nRate: ₹{listingPrice}/{unit}\n\nConfirm with YES!',
        '🎯 Wonderful! Deal Details:\n📦 {quantity} {unit}\n💰 ₹{listingPrice} per {unit}\n💵 ₹{totalAmount} total\n\nType YES to finalize!'
      ],
      hi: [
        '🎉 बढ़िया! मैं पुष्टि करता हूं:\n📦 मात्रा: {quantity} {unit}\n💰 कीमत: ₹{listingPrice} प्रति {unit}\n💵 कुल: ₹{totalAmount}\n\nसौदा पक्का करने के लिए हाँ लिखें!',
        '✅ बिल्कुल! सौदे का सारांश:\n• {quantity} {unit}, ₹{listingPrice}/{unit} पर\n• कुल राशि: ₹{totalAmount}\n\nआगे बढ़ने के लिए तैयार? पुष्टि के लिए हाँ लिखें!',
        '🤝 शानदार! अंतिम विवरण:\n📊 मात्रा: {quantity} {unit}\n💰 दर: ₹{listingPrice} प्रति {unit}\n💵 कुल: ₹{totalAmount}\n\nपूरा करने के लिए हाँ से पुष्टि करें!',
        '🎯 अद्भुत! ऑर्डर सारांश:\n{quantity} {unit} × ₹{listingPrice} = ₹{totalAmount}\n\nसौदा पक्का करने के लिए हाँ लिखें!',
        '✨ उत्कृष्ट! चलिए पुष्टि करें:\n📦 {quantity} {unit}\n💰 ₹{listingPrice} प्रति {unit}\n💵 कुल: ₹{totalAmount}\n\nआगे बढ़ने के लिए हाँ कहें!',
        '🤝 बिल्कुल! सौदे की शर्तें:\n• मात्रा: {quantity} {unit}\n• कीमत: ₹{listingPrice}/{unit}\n• कुल: ₹{totalAmount}\n\nअंतिम रूप देने के लिए हाँ लिखें!',
        '🎉 बढ़िया! अंतिम जांच:\n{quantity} {unit}, ₹{totalAmount} में\nदर: ₹{listingPrice} प्रति {unit}\n\nहाँ से पुष्टि करें!',
        '✅ शानदार! सारांश:\n📦 {quantity} {unit}\n💰 ₹{listingPrice}/{unit}\n💵 कुल ₹{totalAmount}\n\nपूरा करने के लिए हाँ लिखें!',
        '🤝 उत्कृष्ट! सौदे का विवरण:\nमात्रा: {quantity} {unit}\nकीमत: ₹{listingPrice} प्रति {unit}\nकुल: ₹{totalAmount}\n\nअंतिम रूप देने के लिए हाँ कहें!',
        '🎯 बिल्कुल! ऑर्डर:\n{quantity} {unit}, ₹{listingPrice}/{unit} पर\nकुल: ₹{totalAmount}\n\nआगे बढ़ने के लिए हाँ लिखें!',
        '✨ बढ़िया! सत्यापन:\n📦 {quantity} {unit}\n💰 ₹{listingPrice} प्रति {unit}\n💵 ₹{totalAmount}\n\nहाँ से पुष्टि करें!',
        '🎉 अद्भुत! अंतिम शर्तें:\n{quantity} {unit} × ₹{listingPrice} = ₹{totalAmount}\n\nअंतिम रूप देने के लिए हाँ लिखें!',
        '✅ उत्कृष्ट! सौदे का सारांश:\nमात्रा: {quantity} {unit}\nदर: ₹{listingPrice}/{unit}\nकुल: ₹{totalAmount}\n\nपूरा करने के लिए हाँ कहें!',
        '🤝 बिल्कुल! पुष्टि:\n📦 {quantity} {unit}\n💰 ₹{listingPrice} प्रति {unit}\n💵 कुल ₹{totalAmount}\n\nआगे बढ़ने के लिए हाँ लिखें!',
        '🎯 बढ़िया! अंतिम विवरण:\n{quantity} {unit}, ₹{listingPrice}/{unit} पर\nकुल: ₹{totalAmount}\n\nहाँ से पुष्टि करें!',
        '✨ शानदार! ऑर्डर सारांश:\n{quantity} {unit} × ₹{listingPrice} = ₹{totalAmount}\n\nअंतिम रूप देने के लिए हाँ लिखें!',
        '🎉 उत्कृष्ट! सौदे की शर्तें:\n📦 {quantity} {unit}\n💰 ₹{listingPrice}/{unit}\n💵 ₹{totalAmount}\n\nपूरा करने के लिए हाँ कहें!',
        '✅ बिल्कुल! अंतिम जांच:\nमात्रा: {quantity} {unit}\nकीमत: ₹{listingPrice} प्रति {unit}\nकुल: ₹{totalAmount}\n\nआगे बढ़ने के लिए हाँ लिखें!',
        '🤝 बढ़िया! सारांश:\n{quantity} {unit}, ₹{totalAmount} में\nदर: ₹{listingPrice}/{unit}\n\nहाँ से पुष्टि करें!',
        '🎯 अद्भुत! सौदे का विवरण:\n📦 {quantity} {unit}\n💰 ₹{listingPrice} प्रति {unit}\n💵 कुल ₹{totalAmount}\n\nअंतिम रूप देने के लिए हाँ लिखें!'
      ],
      bn: [
        '🎉 চমৎকার! আমি নিশ্চিত করছি:\n📦 পরিমাণ: {quantity} {unit}\n💰 দাম: ₹{listingPrice} প্রতি {unit}\n💵 মোট: ₹{totalAmount}\n\nচুক্তি পাকা করতে হ্যাঁ লিখুন!',
        '✅ নিখুঁত! চুক্তির সারসংক্ষেপ:\n• {quantity} {unit}, ₹{listingPrice}/{unit} এ\n• মোট পরিমাণ: ₹{totalAmount}\n\nএগিয়ে যেতে প্রস্তুত? নিশ্চিত করতে হ্যাঁ লিখুন!',
        '🤝 দুর্দান্ত! চূড়ান্ত বিবরণ:\n📊 পরিমাণ: {quantity} {unit}\n💰 হার: ₹{listingPrice} প্রতি {unit}\n💵 মোট: ₹{totalAmount}\n\nসম্পূর্ণ করতে হ্যাঁ দিয়ে নিশ্চিত করুন!',
        '🎯 অসাধারণ! অর্ডার সারসংক্ষেপ:\n{quantity} {unit} × ₹{listingPrice} = ₹{totalAmount}\n\nচুক্তি পাকা করতে হ্যাঁ লিখুন!',
        '✨ চমৎকার! চলুন নিশ্চিত করি:\n📦 {quantity} {unit}\n💰 ₹{listingPrice} প্রতি {unit}\n💵 মোট: ₹{totalAmount}\n\nএগিয়ে যেতে হ্যাঁ বলুন!',
        '🤝 নিখুঁত! চুক্তির শর্তাবলী:\n• পরিমাণ: {quantity} {unit}\n• দাম: ₹{listingPrice}/{unit}\n• মোট: ₹{totalAmount}\n\nচূড়ান্ত করতে হ্যাঁ লিখুন!',
        '🎉 দুর্দান্ত! চূড়ান্ত পরীক্ষা:\n{quantity} {unit}, ₹{totalAmount} এ\nহার: ₹{listingPrice} প্রতি {unit}\n\nহ্যাঁ দিয়ে নিশ্চিত করুন!'
      ],
      te: [
        '🎉 అద్భుతం! నేను నిర్ధారిస్తున్నాను:\n📦 పరిమాణం: {quantity} {unit}\n💰 ధర: ₹{listingPrice} ప్రతి {unit}\n💵 మొత్తం: ₹{totalAmount}\n\nడీల్ ఖరారు చేయడానికి అవును రాయండి!',
        '✅ పర్ఫెక్ట్! డీల్ సారాంశం:\n• {quantity} {unit}, ₹{listingPrice}/{unit} వద్ద\n• మొత్తం మొత్తం: ₹{totalAmount}\n\nకొనసాగడానికి సిద్ధంగా ఉన్నారా? నిర్ధారించడానికి అవును రాయండి!',
        '🤝 గొప్ప! చివరి వివరాలు:\n📊 పరిమాణం: {quantity} {unit}\n💰 రేటు: ₹{listingPrice} ప్రతి {unit}\n💵 మొత్తం: ₹{totalAmount}\n\nపూర్తి చేయడానికి అవునుతో నిర్ధారించండి!',
        '🎯 అద్భుతం! ఆర్డర్ సారాంశం:\n{quantity} {unit} × ₹{listingPrice} = ₹{totalAmount}\n\nడీల్ ఖరారు చేయడానికి అవును రాయండి!',
        '✨ అద్భుతం! నిర్ధారిద్దాం:\n📦 {quantity} {unit}\n💰 ₹{listingPrice} ప్రతి {unit}\n💵 మొత్తం: ₹{totalAmount}\n\nకొనసాగడానికి అవును చెప్పండి!'
      ],
      mr: [
        '🎉 उत्कृष्ट! मी पुष्टी करतो:\n📦 प्रमाण: {quantity} {unit}\n💰 किंमत: ₹{listingPrice} प्रति {unit}\n💵 एकूण: ₹{totalAmount}\n\nडील पक्की करण्यासाठी होय लिहा!',
        '✅ परिपूर्ण! डीलचा सारांश:\n• {quantity} {unit}, ₹{listingPrice}/{unit} वर\n• एकूण रक्कम: ₹{totalAmount}\n\nपुढे जाण्यासाठी तयार? पुष्टी करण्यासाठी होय लिहा!',
        '🤝 छान! अंतिम तपशील:\n📊 प्रमाण: {quantity} {unit}\n💰 दर: ₹{listingPrice} प्रति {unit}\n💵 एकूण: ₹{totalAmount}\n\nपूर्ण करण्यासाठी होय ने पुष्टी करा!',
        '🎯 अप्रतिम! ऑर्डर सारांश:\n{quantity} {unit} × ₹{listingPrice} = ₹{totalAmount}\n\nडील पक्की करण्यासाठी होय लिहा!',
        '✨ उत्कृष्ट! चला पुष्टी करूया:\n📦 {quantity} {unit}\n💰 ₹{listingPrice} प्रति {unit}\n💵 एकूण: ₹{totalAmount}\n\nपुढे जाण्यासाठी होय म्हणा!'
      ],
      ta: [
        '🎉 சிறப்பு! நான் உறுதிப்படுத்துகிறேன்:\n📦 அளவு: {quantity} {unit}\n💰 விலை: ₹{listingPrice} ஒன்றுக்கு {unit}\n💵 மொத்தம்: ₹{totalAmount}\n\nஒப்பந்தத்தை உறுதிப்படுத்த ஆம் என்று எழுதுங்கள்!',
        '✅ சரியானது! ஒப்பந்த சுருக்கம்:\n• {quantity} {unit}, ₹{listingPrice}/{unit} இல்\n• மொத்த தொகை: ₹{totalAmount}\n\nதொடர தயாரா? உறுதிப்படுத்த ஆம் என்று எழுதுங்கள்!',
        '🤝 அருமை! இறுதி விவரங்கள்:\n📊 அளவு: {quantity} {unit}\n💰 விலை: ₹{listingPrice} ஒன்றுக்கு {unit}\n💵 மொத்தம்: ₹{totalAmount}\n\nமுடிக்க ஆம் என்று உறுதிப்படுத்துங்கள்!',
        '🎯 அற்புதம்! ஆர்டர் சுருக்கம்:\n{quantity} {unit} × ₹{listingPrice} = ₹{totalAmount}\n\nஒப்பந்தத்தை உறுதிப்படுத்த ஆம் என்று எழுதுங்கள்!',
        '✨ சிறப்பு! உறுதிப்படுத்துவோம்:\n📦 {quantity} {unit}\n💰 ₹{listingPrice} ஒன்றுக்கு {unit}\n💵 மொத்தம்: ₹{totalAmount}\n\nதொடர ஆம் என்று சொல்லுங்கள்!'
      ],
      gu: [
        '🎉 ઉત્કૃષ્ટ! હું પુષ્ટિ કરું છું:\n📦 જથ્થો: {quantity} {unit}\n💰 કિંમત: ₹{listingPrice} પ્રતિ {unit}\n💵 કુલ: ₹{totalAmount}\n\nડીલ પાકી કરવા હા લખો!',
        '✅ સંપૂર્ણ! ડીલનો સારાંશ:\n• {quantity} {unit}, ₹{listingPrice}/{unit} પર\n• કુલ રકમ: ₹{totalAmount}\n\nઆગળ વધવા તૈયાર? પુષ્ટિ કરવા હા લખો!',
        '🤝 સરસ! અંતિમ વિગતો:\n📊 જથ્થો: {quantity} {unit}\n💰 દર: ₹{listingPrice} પ્રતિ {unit}\n💵 કુલ: ₹{totalAmount}\n\nપૂર્ણ કરવા હા થી પુષ્ટિ કરો!',
        '🎯 અદ્ભુત! ઓર્ડર સારાંશ:\n{quantity} {unit} × ₹{listingPrice} = ₹{totalAmount}\n\nડીલ પાકી કરવા હા લખો!',
        '✨ ઉત્કૃષ્ટ! ચાલો પુષ્ટિ કરીએ:\n📦 {quantity} {unit}\n💰 ₹{listingPrice} પ્રતિ {unit}\n💵 કુલ: ₹{totalAmount}\n\nઆગળ વધવા હા કહો!'
      ],
      kn: [
        '🎉 ಅತ್ಯುತ್ತಮ! ನಾನು ದೃಢೀಕರಿಸುತ್ತೇನೆ:\n📦 ಪ್ರಮಾಣ: {quantity} {unit}\n💰 ಬೆಲೆ: ₹{listingPrice} ಪ್ರತಿ {unit}\n💵 ಒಟ್ಟು: ₹{totalAmount}\n\nಡೀಲ್ ಖರಾರು ಮಾಡಲು ಹೌದು ಎಂದು ಬರೆಯಿರಿ!',
        '✅ ಪರಿಪೂರ್ಣ! ಡೀಲ್ ಸಾರಾಂಶ:\n• {quantity} {unit}, ₹{listingPrice}/{unit} ನಲ್ಲಿ\n• ಒಟ್ಟು ಮೊತ್ತ: ₹{totalAmount}\n\nಮುಂದುವರಿಯಲು ಸಿದ್ಧವಿದ್ದೀರಾ? ದೃಢೀಕರಿಸಲು ಹೌದು ಎಂದು ಬರೆಯಿರಿ!',
        '🤝 ಅದ್ಭುತ! ಅಂತಿಮ ವಿವರಗಳು:\n📊 ಪ್ರಮಾಣ: {quantity} {unit}\n💰 ದರ: ₹{listingPrice} ಪ್ರತಿ {unit}\n💵 ಒಟ್ಟು: ₹{totalAmount}\n\nಪೂರ್ಣಗೊಳಿಸಲು ಹೌದು ಎಂದು ದೃಢೀಕರಿಸಿ!',
        '🎯 ಅದ್ಭುತ! ಆರ್ಡರ್ ಸಾರಾಂಶ:\n{quantity} {unit} × ₹{listingPrice} = ₹{totalAmount}\n\nಡೀಲ್ ಖರಾರು ಮಾಡಲು ಹೌದು ಎಂದು ಬರೆಯಿರಿ!',
        '✨ ಅತ್ಯುತ್ತಮ! ದೃಢೀಕರಿಸೋಣ:\n📦 {quantity} {unit}\n💰 ₹{listingPrice} ಪ್ರತಿ {unit}\n💵 ಒಟ್ಟು: ₹{totalAmount}\n\nಮುಂದುವರಿಯಲು ಹೌದು ಎಂದು ಹೇಳಿ!'
      ],
      ml: [
        '🎉 മികച്ചത്! ഞാൻ സ്ഥിരീകരിക്കുന്നു:\n📦 അളവ്: {quantity} {unit}\n💰 വില: ₹{listingPrice} ഒന്നിന് {unit}\n💵 ആകെ: ₹{totalAmount}\n\nഡീൽ സ്ഥിരീകരിക്കാൻ അതെ എന്ന് എഴുതുക!',
        '✅ പെർഫെക്റ്റ്! ഡീൽ സംഗ്രഹം:\n• {quantity} {unit}, ₹{listingPrice}/{unit} ൽ\n• ആകെ തുക: ₹{totalAmount}\n\nമുന്നോട്ട് പോകാൻ തയ്യാറാണോ? സ്ഥിരീകരിക്കാൻ അതെ എന്ന് എഴുതുക!',
        '🤝 മികച്ചത്! അന്തിമ വിശദാംശങ്ങൾ:\n📊 അളവ്: {quantity} {unit}\n💰 നിരക്ക്: ₹{listingPrice} ഒന്നിന് {unit}\n💵 ആകെ: ₹{totalAmount}\n\nപൂർത്തിയാക്കാൻ അതെ എന്ന് സ്ഥിരീകരിക്കുക!',
        '🎯 അത്ഭുതം! ഓർഡർ സംഗ്രഹം:\n{quantity} {unit} × ₹{listingPrice} = ₹{totalAmount}\n\nഡീൽ സ്ഥിരീകരിക്കാൻ അതെ എന്ന് എഴുതുക!',
        '✨ മികച്ചത്! സ്ഥിരീകരിക്കാം:\n📦 {quantity} {unit}\n💰 ₹{listingPrice} ഒന്നിന് {unit}\n💵 ആകെ: ₹{totalAmount}\n\nമുന്നോട്ട് പോകാൻ അതെ എന്ന് പറയുക!'
      ],
      pa: [
        '🎉 ਸ਼ਾਨਦਾਰ! ਮੈਂ ਪੁਸ਼ਟੀ ਕਰਦਾ ਹਾਂ:\n📦 ਮਾਤਰਾ: {quantity} {unit}\n💰 ਕੀਮਤ: ₹{listingPrice} ਪ੍ਰਤੀ {unit}\n💵 ਕੁੱਲ: ₹{totalAmount}\n\nਡੀਲ ਪੱਕੀ ਕਰਨ ਲਈ ਹਾਂ ਲਿਖੋ!',
        '✅ ਸੰਪੂਰਨ! ਡੀਲ ਸਾਰ:\n• {quantity} {unit}, ₹{listingPrice}/{unit} ਤੇ\n• ਕੁੱਲ ਰਕਮ: ₹{totalAmount}\n\nਅੱਗੇ ਵਧਣ ਲਈ ਤਿਆਰ? ਪੁਸ਼ਟੀ ਕਰਨ ਲਈ ਹਾਂ ਲਿਖੋ!',
        '🤝 ਵਧੀਆ! ਅੰਤਿਮ ਵੇਰਵੇ:\n📊 ਮਾਤਰਾ: {quantity} {unit}\n💰 ਦਰ: ₹{listingPrice} ਪ੍ਰਤੀ {unit}\n💵 ਕੁੱਲ: ₹{totalAmount}\n\nਪੂਰਾ ਕਰਨ ਲਈ ਹਾਂ ਨਾਲ ਪੁਸ਼ਟੀ ਕਰੋ!',
        '🎯 ਸ਼ਾਨਦਾਰ! ਆਰਡਰ ਸਾਰ:\n{quantity} {unit} × ₹{listingPrice} = ₹{totalAmount}\n\nਡੀਲ ਪੱਕੀ ਕਰਨ ਲਈ ਹਾਂ ਲਿਖੋ!',
        '✨ ਸ਼ਾਨਦਾਰ! ਪੁਸ਼ਟੀ ਕਰੀਏ:\n📦 {quantity} {unit}\n💰 ₹{listingPrice} ਪ੍ਰਤੀ {unit}\n💵 ਕੁੱਲ: ₹{totalAmount}\n\nਅੱਗੇ ਵਧਣ ਲਈ ਹਾਂ ਕਹੋ!'
      ],
      ur: [
        '🎉 بہترین! میں تصدیق کرتا ہوں:\n📦 مقدار: {quantity} {unit}\n💰 قیمت: ₹{listingPrice} فی {unit}\n💵 کل: ₹{totalAmount}\n\nڈیل پکی کرنے کے لیے ہاں لکھیں!',
        '✅ کامل! ڈیل کا خلاصہ:\n• {quantity} {unit}, ₹{listingPrice}/{unit} پر\n• کل رقم: ₹{totalAmount}\n\nآگے بڑھنے کے لیے تیار؟ تصدیق کے لیے ہاں لکھیں!',
        '🤝 زبردست! حتمی تفصیلات:\n📦 مقدار: {quantity} {unit}\n💰 شرح: ₹{listingPrice} فی {unit}\n💵 کل: ₹{totalAmount}\n\nمکمل کرنے کے لیے ہاں سے تصدیق کریں!',
        '🎯 شاندار! آرڈر کا خلاصہ:\n{quantity} {unit} × ₹{listingPrice} = ₹{totalAmount}\n\nڈیل پکی کرنے کے لیے ہاں لکھیں!',
        '✨ بہترین! تصدیق کریں:\n📦 {quantity} {unit}\n💰 ₹{listingPrice} فی {unit}\n💵 کل: ₹{totalAmount}\n\nآگے بڑھنے کے لیے ہاں کہیں!'
      ],
      or: [
        '🎉 ଉତ୍କୃଷ୍ଟ! ମୁଁ ନିଶ୍ଚିତ କରୁଛି:\n📦 ପରିମାଣ: {quantity} {unit}\n💰 ମୂଲ୍ୟ: ₹{listingPrice} ପ୍ରତି {unit}\n💵 ମୋଟ: ₹{totalAmount}\n\nଡିଲ୍ ନିଶ୍ଚିତ କରିବାକୁ ହଁ ଲେଖନ୍ତୁ!',
        '✅ ସମ୍ପୂର୍ଣ୍ଣ! ଡିଲ୍ ସାରାଂଶ:\n• {quantity} {unit}, ₹{listingPrice}/{unit} ରେ\n• ମୋଟ ରାଶି: ₹{totalAmount}\n\nଆଗକୁ ବଢ଼ିବାକୁ ପ୍ରସ୍ତୁତ? ନିଶ୍ଚିତ କରିବାକୁ ହଁ ଲେଖନ୍ତୁ!',
        '🤝 ଉତ୍କୃଷ୍ଟ! ଅନ୍ତିମ ବିବରଣୀ:\n📊 ପରିମାଣ: {quantity} {unit}\n💰 ହାର: ₹{listingPrice} ପ୍ରତି {unit}\n💵 ମୋଟ: ₹{totalAmount}\n\nସମ୍ପୂର୍ଣ୍ଣ କରିବାକୁ ହଁ ଦ୍ୱାରା ନିଶ୍ଚିତ କରନ୍ତୁ!',
        '🎯 ଅଦ୍ଭୁତ! ଅର୍ଡର ସାରାଂଶ:\n{quantity} {unit} × ₹{listingPrice} = ₹{totalAmount}\n\nଡିଲ୍ ନିଶ୍ଚିତ କରିବାକୁ ହଁ ଲେଖନ୍ତୁ!',
        '✨ ଉତ୍କୃଷ୍ଟ! ନିଶ୍ଚିତ କରିବା:\n📦 {quantity} {unit}\n💰 ₹{listingPrice} ପ୍ରତି {unit}\n💵 ମୋଟ: ₹{totalAmount}\n\nଆଗକୁ ବଢ଼ିବାକୁ ହଁ କୁହନ୍ତୁ!'
      ]
    }
  },
  // Delivery/logistics questions
  {
    pattern: /(delivery|transport|shipping|kab milega|delivery kahan|bhejoge)/i,
    weight: 0.75,
    responses: {
      en: [
        'Delivery can be arranged once we finalize the deal. Where do you need it delivered?',
        'I can arrange transport. What\'s your location? Let\'s first agree on price and quantity.',
        'Shipping is available. First, let\'s confirm the quantity and price, then we\'ll discuss delivery.',
        'We can discuss delivery details after finalizing the deal. What quantity are you interested in?'
      ],
      hi: [
        'सौदा अंतिम होने के बाद डिलीवरी की व्यवस्था की जा सकती है। आपको कहां डिलीवरी चाहिए?',
        'मैं परिवहन की व्यवस्था कर सकता हूं। आपका स्थान क्या है? पहले कीमत और मात्रा पर सहमत हो जाएं।',
        'शिपिंग उपलब्ध है। पहले, मात्रा और कीमत की पुष्टि करें, फिर हम डिलीवरी पर चर्चा करेंगे।'
      ],
      bn: [
        'চুক্তি চূড়ান্ত হওয়ার পরে ডেলিভারির ব্যবস্থা করা যেতে পারে। আপনার কোথায় ডেলিভারি দরকার?',
        'আমি পরিবহনের ব্যবস্থা করতে পারি। আপনার অবস্থান কী? প্রথমে দাম এবং পরিমাণে সম্মত হন।'
      ],
      te: [
        'డీల్ ఖరారైన తర్వాత డెలివరీ ఏర్పాటు చేయవచ్చు. మీకు ఎక్కడ డెలివరీ కావాలి?',
        'నేను రవాణా ఏర్పాటు చేయగలను. మీ స్థానం ఏమిటి? ముందుగా ధర మరియు పరిమాణంపై అంగీకరించండి.'
      ],
      mr: [
        'डील अंतिम झाल्यानंतर डिलिव्हरीची व्यवस्था केली जाऊ शकते। तुम्हाला कुठे डिलिव्हरी हवी आहे?'
      ],
      ta: [
        'ஒப்பந்தம் இறுதி செய்யப்பட்டதும் டெலிவரி ஏற்பாடு செய்யலாம். உங்களுக்கு எங்கு டெலிவரி வேண்டும்?'
      ],
      gu: [
        'ડીલ અંતિમ થયા પછી ડિલિવરીની વ્યવસ્થા કરી શકાય છે. તમને ક્યાં ડિલિવરી જોઈએ છે?'
      ],
      kn: [
        'ಡೀಲ್ ಅಂತಿಮಗೊಳಿಸಿದ ನಂತರ ಡೆಲಿವರಿ ಏರ್ಪಡಿಸಬಹುದು. ನಿಮಗೆ ಎಲ್ಲಿ ಡೆಲಿವರಿ ಬೇಕು?'
      ],
      ml: ['ഡീൽ അന്തിമമാക്കിയ ശേഷം ഡെലിവറി ക്രമീകരിക്കാം. നിങ്ങൾക്ക് എവിടെ ഡെലിവറി വേണം?'],
      pa: ['ਡੀਲ ਅੰਤਿਮ ਹੋਣ ਤੋਂ ਬਾਅਦ ਡਿਲੀਵਰੀ ਦਾ ਪ੍ਰਬੰਧ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ। ਤੁਹਾਨੂੰ ਕਿੱਥੇ ਡਿਲੀਵਰੀ ਚਾਹੀਦੀ ਹੈ?'],
      ur: ['ڈیل کے حتمی ہونے کے بعد ڈیلیوری کا بندوبست کیا جا سکتا ہے۔ آپ کو کہاں ڈیلیوری چاہیے؟'],
      or: ['ଡିଲ୍ ଅନ୍ତିମ ହେବା ପରେ ଡେଲିଭରି ବ୍ୟବସ୍ଥା କରାଯାଇପାରିବ। ଆପଣଙ୍କୁ କେଉଁଠାରେ ଡେଲିଭରି ଦରକାର?']
    }
  },
  // Payment questions
  {
    pattern: /(payment|pay|paisa|paise kaise|payment method|cash)/i,
    weight: 0.75,
    responses: {
      en: [
        'Payment can be discussed once we agree on the deal. Cash or bank transfer both work.',
        'We\'ll finalize payment terms after agreeing on price. What payment method do you prefer?',
        'Let\'s first confirm the quantity and price, then we can discuss payment details.',
        'Payment is flexible - cash, UPI, or bank transfer. First, let\'s agree on the deal terms.'
      ],
      hi: [
        'सौदे पर सहमति के बाद भुगतान पर चर्चा की जा सकती है। नकद या बैंक ट्रांसफर दोनों काम करते हैं।',
        'कीमत पर सहमति के बाद हम भुगतान की शर्तें अंतिम करेंगे। आप कौन सी भुगतान विधि पसंद करते हैं?',
        'पहले मात्रा और कीमत की पुष्टि करें, फिर हम भुगतान विवरण पर चर्चा कर सकते हैं।',
        'भुगतान लचीला है - नकद, UPI, या बैंक ट्रांसफर। पहले, सौदे की शर्तों पर सहमत हो जाएं।'
      ],
      bn: [
        'চুক্তিতে সম্মত হওয়ার পরে পেমেন্ট নিয়ে আলোচনা করা যেতে পারে। নগদ বা ব্যাংক ট্রান্সফার উভয়ই কাজ করে।',
        'দামে সম্মত হওয়ার পরে আমরা পেমেন্ট শর্তাবলী চূড়ান্ত করব। আপনি কোন পেমেন্ট পদ্ধতি পছন্দ করেন?'
      ],
      te: [
        'డీల్‌పై అంగీకరించిన తర్వాత చెల్లింపు గురించి చర్చించవచ్చు. నగదు లేదా బ్యాంక్ బదిలీ రెండూ పని చేస్తాయి.',
        'ధరపై అంగీకరించిన తర్వాత మేము చెల్లింపు నిబంధనలను ఖరారు చేస్తాము. మీరు ఏ చెల్లింపు పద్ధతిని ఇష్టపడతారు?'
      ],
      mr: [
        'डीलवर सहमती झाल्यानंतर पेमेंटवर चर्चा केली जाऊ शकते। रोख किंवा बँक ट्रान्सफर दोन्ही काम करतात.'
      ],
      ta: [
        'ஒப்பந்தத்தில் ஒப்புக்கொண்ட பிறகு பணம் செலுத்துதல் பற்றி விவாதிக்கலாம். பணம் அல்லது வங்கி பரிமாற்றம் இரண்டும் வேலை செய்யும்.'
      ],
      gu: [
        'ડીલ પર સંમત થયા પછી પેમેન્ટ વિશે ચર્ચા કરી શકાય છે. રોકડ અથવા બેંક ટ્રાન્સફર બંને કામ કરે છે.'
      ],
      kn: [
        'ಡೀಲ್‌ನಲ್ಲಿ ಒಪ್ಪಿಕೊಂಡ ನಂತರ ಪಾವತಿಯನ್ನು ಚರ್ಚಿಸಬಹುದು. ನಗದು ಅಥವಾ ಬ್ಯಾಂಕ್ ವರ್ಗಾವಣೆ ಎರಡೂ ಕೆಲಸ ಮಾಡುತ್ತವೆ.'
      ],
      ml: ['ഡീലിൽ സമ്മതിച്ചതിന് ശേഷം പേയ്‌മെന്റ് ചർച്ച ചെയ്യാം. പണമോ ബാങ്ക് ട്രാൻസ്ഫറോ രണ്ടും പ്രവർത്തിക്കുന്നു.'],
      pa: ['ਡੀਲ ਤੇ ਸਹਿਮਤ ਹੋਣ ਤੋਂ ਬਾਅਦ ਭੁਗਤਾਨ ਬਾਰੇ ਚਰਚਾ ਕੀਤੀ ਜਾ ਸਕਦੀ ਹੈ। ਨਕਦ ਜਾਂ ਬੈਂਕ ਟ੍ਰਾਂਸਫਰ ਦੋਵੇਂ ਕੰਮ ਕਰਦੇ ਹਨ।'],
      ur: ['ڈیل پر اتفاق کے بعد ادائیگی پر بات کی جا سکتی ہے۔ نقد یا بینک ٹرانسفر دونوں کام کرتے ہیں۔'],
      or: ['ଡିଲ୍ ଉପରେ ସହମତ ହେବା ପରେ ପେମେଣ୍ଟ ବିଷୟରେ ଆଲୋଚନା କରାଯାଇପାରିବ। ନଗଦ କିମ୍ବା ବ୍ୟାଙ୍କ ଟ୍ରାନ୍ସଫର ଉଭୟ କାମ କରେ।']
    }
  },
  // Rejection
  {
    pattern: /(^no$|^nahi$|^nope$|refuse|reject|not interested)/i,
    weight: 0.7,
    responses: {
      en: [
        'No problem. Feel free to make a counter offer if you change your mind.',
        'That\'s okay. What would work better for you?',
        'I understand. If you have a different proposal, I\'m open to hearing it.',
        'No worries. Let me know if there\'s anything I can adjust to make this work.'
      ],
      hi: [
        'कोई बात नहीं। यदि आप अपना मन बदलते हैं तो बेझिझक प्रतिप्रस्ताव दें।',
        'ठीक है। आपके लिए क्या बेहतर काम करेगा?',
        'मैं समझता हूं। यदि आपके पास कोई अलग प्रस्ताव है, तो मैं सुनने के लिए तैयार हूं।',
        'कोई चिंता नहीं। मुझे बताएं कि क्या मैं कुछ समायोजित कर सकता हूं।'
      ],
      bn: [
        'কোন সমস্যা নেই। আপনি মন পরিবর্তন করলে পাল্টা অফার করতে দ্বিধা করবেন না।',
        'ঠিক আছে। আপনার জন্য কী ভাল কাজ করবে?'
      ],
      te: [
        'సమస్య లేదు. మీరు మీ మనసు మార్చుకుంటే కౌంటర్ ఆఫర్ చేయడానికి సంకోచించకండి।',
        'పర్లేదు. మీకు ఏది మంచిగా పని చేస్తుంది?'
      ],
      mr: ['काही हरकत नाही। तुम्ही तुमचा विचार बदलला तर प्रतिप्रस्ताव द्या।'],
      ta: ['பரவாயில்லை. நீங்கள் உங்கள் மனதை மாற்றினால் எதிர் சலுகை செய்ய தயங்க வேண்டாம்.'],
      gu: ['કોઈ વાંધો નહીં. તમે તમારો વિચાર બદલો તો પ્રતિપ્રસ્તાવ કરવામાં સંકોચ ન કરો.'],
      kn: ['ಸಮಸ್ಯೆ ಇಲ್ಲ. ನೀವು ನಿಮ್ಮ ಮನಸ್ಸು ಬದಲಾಯಿಸಿದರೆ ಕೌಂಟರ್ ಆಫರ್ ಮಾಡಲು ಹಿಂಜರಿಯಬೇಡಿ.'],
      ml: ['കുഴപ്പമില്ല. നിങ്ങൾ മനസ്സ് മാറ്റിയാൽ എതിർ ഓഫർ നൽകാൻ മടിക്കേണ്ടതില്ല.'],
      pa: ['ਕੋਈ ਸਮੱਸਿਆ ਨਹੀਂ। ਜੇ ਤੁਸੀਂ ਆਪਣਾ ਮਨ ਬਦਲਦੇ ਹੋ ਤਾਂ ਵਿਰੋਧੀ ਪੇਸ਼ਕਸ਼ ਕਰਨ ਵਿਚ ਸੰਕੋਚ ਨਾ ਕਰੋ।'],
      ur: ['کوئی مسئلہ نہیں۔ اگر آپ اپنا ذہن بدلتے ہیں تو جوابی پیشکش کرنے میں ہچکچاہٹ محسوس نہ کریں۔'],
      or: ['କୌଣସି ସମସ୍ୟା ନାହିଁ। ଯଦି ଆପଣ ଆପଣଙ୍କର ମନ ପରିବର୍ତ୍ତନ କରନ୍ତି ତେବେ ପ୍ରତି ଅଫର୍ କରିବାକୁ ଦ୍ୱିଧା କରନ୍ତୁ ନାହିଁ।']
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

// Default fallback when no pattern matches - MORE HELPFUL
export const DEFAULT_FALLBACK: Partial<Record<SupportedLanguageCode, string[]>> = {
  en: [
    'I have {quantity} {unit} available at ₹{listingPrice} per {unit}. How much would you like?',
    'The price is ₹{listingPrice} per {unit}. I have {quantity} {unit} in stock. Interested?',
    'Available: {quantity} {unit} at ₹{listingPrice}/{unit}. What quantity do you need?',
    'Rate: ₹{listingPrice} per {unit}. Stock: {quantity} {unit}. How can I help you?',
    'I can offer {quantity} {unit} at ₹{listingPrice} per {unit}. What would you like to know?'
  ],
  hi: [
    'मेरे पास {quantity} {unit} उपलब्ध है, ₹{listingPrice} प्रति {unit} पर। आपको कितना चाहिए?',
    'कीमत ₹{listingPrice} प्रति {unit} है। मेरे पास {quantity} {unit} स्टॉक में है। रुचि है?',
    'उपलब्ध: {quantity} {unit}, ₹{listingPrice}/{unit} पर। आपको कितनी मात्रा चाहिए?',
    'दर: ₹{listingPrice} प्रति {unit}। स्टॉक: {quantity} {unit}। मैं आपकी कैसे मदद कर सकता हूं?',
    'मैं {quantity} {unit} दे सकता हूं, ₹{listingPrice} प्रति {unit} पर। आप क्या जानना चाहेंगे?'
  ],
  bn: [
    'আমার কাছে {quantity} {unit} আছে ₹{listingPrice} প্রতি {unit} এ। আপনার কত লাগবে?',
    'দাম ₹{listingPrice} প্রতি {unit}। আমার স্টকে {quantity} {unit} আছে। আগ্রহী?',
    'উপলব্ধ: {quantity} {unit}, ₹{listingPrice}/{unit} এ। আপনার কত পরিমাণ দরকার?',
    'হার: ₹{listingPrice} প্রতি {unit}। স্টক: {quantity} {unit}। আমি আপনাকে কীভাবে সাহায্য করতে পারি?'
  ],
  te: [
    'నా దగ్గర {quantity} {unit} ఉంది ₹{listingPrice} ప్రతి {unit} కి। మీకు ఎంత కావాలి?',
    'ధర ₹{listingPrice} ప్రతి {unit}. నా స్టాక్‌లో {quantity} {unit} ఉంది. ఆసక్తి ఉందా?',
    'అందుబాటులో: {quantity} {unit}, ₹{listingPrice}/{unit} వద్ద. మీకు ఎంత పరిమాణం కావాలి?',
    'రేటు: ₹{listingPrice} ప్రతి {unit}. స్టాక్: {quantity} {unit}. నేను మీకు ఎలా సహాయపడగలను?'
  ],
  mr: [
    'माझ्याकडे {quantity} {unit} उपलब्ध आहे ₹{listingPrice} प्रति {unit} वर। तुम्हाला किती हवे आहे?',
    'किंमत ₹{listingPrice} प्रति {unit} आहे। माझ्याकडे {quantity} {unit} स्टॉकमध्ये आहे। रस आहे का?',
    'उपलब्ध: {quantity} {unit}, ₹{listingPrice}/{unit} वर। तुम्हाला किती प्रमाण हवे आहे?'
  ],
  ta: [
    'என்னிடம் {quantity} {unit} உள்ளது ₹{listingPrice} ஒன்றுக்கு {unit} இல். உங்களுக்கு எவ்வளவு வேண்டும்?',
    'விலை ₹{listingPrice} ஒன்றுக்கு {unit}. என் பங்கில் {quantity} {unit} உள்ளது. ஆர்வமா?',
    'கிடைக்கிறது: {quantity} {unit}, ₹{listingPrice}/{unit} இல். உங்களுக்கு எவ்வளவு அளவு தேவை?'
  ],
  gu: [
    'મારી પાસે {quantity} {unit} ઉપલબ્ધ છે ₹{listingPrice} પ્રતિ {unit} પર। તમને કેટલું જોઈએ છે?',
    'કિંમત ₹{listingPrice} પ્રતિ {unit} છે। મારી પાસે {quantity} {unit} સ્ટોકમાં છે। રસ છે?',
    'ઉપલબ્ધ: {quantity} {unit}, ₹{listingPrice}/{unit} પર। તમને કેટલું જથ્થો જોઈએ છે?'
  ],
  kn: [
    'ನನ್ನ ಬಳಿ {quantity} {unit} ಲಭ್ಯವಿದೆ ₹{listingPrice} ಪ್ರತಿ {unit} ಗೆ. ನಿಮಗೆ ಎಷ್ಟು ಬೇಕು?',
    'ಬೆಲೆ ₹{listingPrice} ಪ್ರತಿ {unit}. ನನ್ನ ಸ್ಟಾಕ್‌ನಲ್ಲಿ {quantity} {unit} ಇದೆ. ಆಸಕ್ತಿ ಇದೆಯೇ?',
    'ಲಭ್ಯವಿದೆ: {quantity} {unit}, ₹{listingPrice}/{unit} ನಲ್ಲಿ. ನಿಮಗೆ ಎಷ್ಟು ಪ್ರಮಾಣ ಬೇಕು?'
  ],
  ml: [
    'എന്റെ പക്കൽ {quantity} {unit} ലഭ്യമാണ് ₹{listingPrice} ഒന്നിന് {unit} ൽ. നിങ്ങൾക്ക് എത്ര വേണം?',
    'വില ₹{listingPrice} ഒന്നിന് {unit}. എന്റെ സ്റ്റോക്കിൽ {quantity} {unit} ഉണ്ട്. താൽപ്പര്യമുണ്ടോ?'
  ],
  pa: [
    'ਮੇਰੇ ਕੋਲ {quantity} {unit} ਉਪਲਬਧ ਹੈ ₹{listingPrice} ਪ੍ਰਤੀ {unit} ਤੇ। ਤੁਹਾਨੂੰ ਕਿੰਨਾ ਚਾਹੀਦਾ ਹੈ?',
    'ਕੀਮਤ ₹{listingPrice} ਪ੍ਰਤੀ {unit} ਹੈ। ਮੇਰੇ ਕੋਲ {quantity} {unit} ਸਟਾਕ ਵਿਚ ਹੈ। ਦਿਲਚਸਪੀ ਹੈ?'
  ],
  ur: [
    'میرے پاس {quantity} {unit} دستیاب ہے ₹{listingPrice} فی {unit} پر۔ آپ کو کتنا چاہیے؟',
    'قیمت ₹{listingPrice} فی {unit} ہے۔ میرے پاس {quantity} {unit} اسٹاک میں ہے۔ دلچسپی ہے؟'
  ],
  or: [
    'ମୋ ପାଖରେ {quantity} {unit} ଉପଲବ୍ଧ ଅଛି ₹{listingPrice} ପ୍ରତି {unit} ରେ। ଆପଣଙ୍କୁ କେତେ ଦରକାର?',
    'ମୂଲ୍ୟ ₹{listingPrice} ପ୍ରତି {unit}। ମୋ ଷ୍ଟକରେ {quantity} {unit} ଅଛି। ଆଗ୍ରହ ଅଛି କି?'
  ]
};

/**
 * Detect if user wants to finalize the deal - MAXIMUM COVERAGE
 * Enhanced with more patterns and multilingual support
 */
export function shouldFinalizeDeal(message: string): boolean {
  const finalizePatterns = [
    // Single word confirmations (most common)
    /^(done|sold|deal|final|confirm|book|order|buy|purchase|take it|yes deal|ok deal)$/i,

    // Explicit finalization phrases
    /\b(finalize|complete|confirm deal|close deal|seal deal|lock deal|wrap up|make it final|let'?s finalize|ready to finalize)\b/i,

    // Action phrases
    /\b(let'?s (do it|go|finalize|complete|close|seal)|go ahead|do it|make it happen|i'?m ready|ready to buy)\b/i,
    /\b(proceed|continue|move forward|move ahead|next step)\b/i,

    // Agreement with finalization
    /\b(yes.*(finalize|complete|confirm|done)|ok.*(done|finalize)|okay.*(done|finalize))\b/i,
    /\b(agree.*(terms|deal)|accept.*(terms|deal|offer)|ready to (buy|finalize|complete|proceed))\b/i,

    // Strong purchase intent
    /\b(i'?ll take it|i want to buy|i'?m buying|purchase now|buy now|book now|confirm order)\b/i,

    // Hindi/Urdu
    /\b(pakka|pakka kar|deal done|sahi hai|theek hai|ho gaya|le liya|kharid liya|bas final|final kar|confirm kar)\b/i,
    /\b(bilkul|zaroor|haan pakka|thik final|theek hai final|bas done|sahi hai confirm)\b/i,

    // Bengali
    /\b(hobe|thik ache|thik aache|kinbo|nibo|done|pakka|confirm)\b/i,

    // Tamil
    /\b(konukkiren|vaanguren|sari|okay|done|confirm)\b/i,

    // Telugu
    /\b(konugutanu|teesukuntanu|avunu|sare|done|confirm)\b/i,

    // Marathi
    /\b(gheto|thik ahe|pakka|done|confirm)\b/i,

    // Kannada
    /\b(lidisu|thik ide|okay|done|confirm)\b/i,

    // Gujarati
    /\b(laishu|thik che|okay|done|confirm)\b/i,

    // Punjabi
    /\b(le langa|theek hai|okay|done|confirm)\b/i,

    // Malayalam
    /\b(vaangam|seri|okay|done|confirm)\b/i,

    // Time-based finalization
    /\b(time to (finalize|complete|close)|shall we (finalize|complete|close))\b/i,

    // Casual confirmations that indicate deal closure
    /^(yep|yup|sure|absolutely|definitely|of course|sounds good|perfect|great|excellent)$/i
  ];

  return finalizePatterns.some(pattern => pattern.test(message));
}

/**
 * Extract price from message if mentioned
 */
export function extractPriceFromMessage(message: string): number | null {
  // First check if message is just a number (common for price offers)
  const trimmed = message.trim();
  if (/^\d+$/.test(trimmed)) {
    const price = parseInt(trimmed, 10);
    if (price > 0 && price < 1000000) {
      return price;
    }
  }

  // Match patterns like: "₹50", "50 rupees", "50rs"
  const pricePatterns = [
    /₹\s*(\d+)/,
    /(\d+)\s*(rupees|rupee|rs|inr)/i,
    /price\s*(\d+)/i,
    /(\d+)\s*per/i,
    /offer\s*(\d+)/i,
    /(\d+)\s*only/i
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
  // Match patterns like: "50 quintal", "100 kg", "50 ton", "50 kg", "50 quintals"
  const quantityPatterns = [
    /(\d+)\s*(quintal|quintals|kg|kgs|kilogram|kilograms|ton|tons|tonne|tonnes)/i,
    /quantity\s*(\d+)/i,
    /(\d+)\s*units?/i,
    /(\d+)\s*(kilo|kilos)/i
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
 * Extract unit from message if mentioned
 */
export function extractUnitFromMessage(message: string): string | null {
  const unitPatterns = [
    /(quintal|quintals)/i,
    /(kg|kgs|kilogram|kilograms|kilo|kilos)/i,
    /(ton|tons|tonne|tonnes)/i
  ];

  for (const pattern of unitPatterns) {
    const match = message.match(pattern);
    if (match && match[1]) {
      const unit = match[1].toLowerCase();
      // Normalize units
      if (unit.includes('kg') || unit.includes('kilo')) return 'kg';
      if (unit.includes('quintal')) return 'Quintal';
      if (unit.includes('ton')) return 'Ton';
    }
  }

  return null;
}

/**
 * Get a fallback response based on user message, language, and context
 */
export function getFallbackResponse(
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
    produceName?: string;
  },
  responderRole: 'seller' | 'buyer' = 'seller'
): string {
  updateConversationContext('other');

  console.log('🔧 getFallbackResponse called with:', { message, language, context, responderRole });

  const responsesList = responderRole === 'buyer' ? FALLBACK_RESPONSES_BUYER : FALLBACK_RESPONSES;
  const defaultList = responderRole === 'buyer' ? DEFAULT_FALLBACK_BUYER : DEFAULT_FALLBACK;

  // FIRST: Try extended patterns (only if seller role, as extended might be seller-specific)
  if (responderRole === 'seller') {
    const extendedResponse = getExtendedFallbackResponse(message, language, context);
    if (extendedResponse) {
      console.log('✅ Extended response found:', extendedResponse);
      return extendedResponse;
    }
  }

  // SECOND: Try to match core patterns with weighted probability
  const matchedPatterns: Array<{ response: string; weight: number }> = [];

  for (const fallback of responsesList) {
    if (fallback.pattern.test(message)) {
      const responses = fallback.responses[language] || fallback.responses.en;
      if (responses && responses.length > 0) {
        const weight = fallback.weight || 0.5;
        // Add all matching responses with their weights
        responses.forEach(response => {
          matchedPatterns.push({ response, weight });
        });
      }
    }
  }

  // Select response using weighted random selection
  let selectedResponse: string;

  if (matchedPatterns.length > 0) {
    // Calculate total weight
    const totalWeight = matchedPatterns.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;

    // Select based on weight
    selectedResponse = matchedPatterns[0].response;
    for (const item of matchedPatterns) {
      random -= item.weight;
      if (random <= 0) {
        selectedResponse = item.response;
        break;
      }
    }
  } else {
    // Return default fallback
    const defaults = defaultList[language] || defaultList.en;
    if (defaults && defaults.length > 0) {
      selectedResponse = defaults[Math.floor(Math.random() * defaults.length)];
    } else {
      selectedResponse = 'I understand. Please tell me more.';
    }
  }

  // Replace placeholders with actual values
  if (context) {
    console.log('🔄 Replacing variables with context:', context);
    // Smart unit conversion and price calculation
    let estimatedTotal = 0;
    let effectiveQuantity = context.mentionedQuantity || context.quantity || 0;

    if (context.mentionedQuantity && context.listingPrice) {
      // Check if unit conversion is needed
      const mentionedUnit = (context.mentionedUnit || '').toLowerCase();
      const listingUnit = (context.unit || '').toLowerCase();

      // Convert mentioned quantity to listing unit
      if (mentionedUnit === 'kg' && listingUnit === 'quintal') {
        // 1 Quintal = 100 kg, so 50 kg = 0.5 Quintal
        effectiveQuantity = context.mentionedQuantity / 100;
        estimatedTotal = effectiveQuantity * context.listingPrice;
      } else if (mentionedUnit === 'quintal' && listingUnit === 'kg') {
        // 1 Quintal = 100 kg, so 5 Quintal = 500 kg
        effectiveQuantity = context.mentionedQuantity * 100;
        estimatedTotal = effectiveQuantity * context.listingPrice;
      } else if (mentionedUnit === 'ton' && listingUnit === 'quintal') {
        // 1 Ton = 10 Quintal
        effectiveQuantity = context.mentionedQuantity * 10;
        estimatedTotal = effectiveQuantity * context.listingPrice;
      } else if (mentionedUnit === 'quintal' && listingUnit === 'ton') {
        // 1 Ton = 10 Quintal, so 50 Quintal = 5 Ton
        effectiveQuantity = context.mentionedQuantity / 10;
        estimatedTotal = effectiveQuantity * context.listingPrice;
      } else if (mentionedUnit === 'kg' && listingUnit === 'ton') {
        // 1 Ton = 1000 kg
        effectiveQuantity = context.mentionedQuantity / 1000;
        estimatedTotal = effectiveQuantity * context.listingPrice;
      } else if (mentionedUnit === 'ton' && listingUnit === 'kg') {
        // 1 Ton = 1000 kg
        effectiveQuantity = context.mentionedQuantity * 1000;
        estimatedTotal = effectiveQuantity * context.listingPrice;
      } else {
        // Same unit or no conversion needed
        estimatedTotal = context.mentionedQuantity * context.listingPrice;
      }
    }

    const counterPrice = context.listingPrice ? Math.round(context.listingPrice * 0.9) : undefined;

    // SMART REPLACEMENT: Use actual values if available, otherwise remove placeholder
    // This prevents showing {variable} or incorrect values like ₹0
    selectedResponse = selectedResponse
      .replace(/{price}/g, context.offeredPrice !== undefined && context.offeredPrice !== null ? context.offeredPrice.toString() : '')
      .replace(/{counterPrice}/g, counterPrice ? counterPrice.toString() : '')
      .replace(/{listingPrice}/g, context.listingPrice !== undefined && context.listingPrice !== null && context.listingPrice > 0 ? context.listingPrice.toString() : '')
      .replace(/{marketPrice}/g, context.marketPrice !== undefined && context.marketPrice !== null && context.marketPrice > 0 ? context.marketPrice.toString() : '')
      .replace(/{quantity}/g, context.quantity !== undefined && context.quantity !== null && context.quantity > 0 ? context.quantity.toString() : '')
      .replace(/{unit}/g, context.unit && context.unit.trim() !== '' ? context.unit : '')
      .replace(/{produceName}/g, context.produceName || 'produce')
      .replace(/{agreedPrice}/g, (context.agreedPrice && context.agreedPrice > 0) ? context.agreedPrice.toString() : (context.listingPrice && context.listingPrice > 0) ? context.listingPrice.toString() : '')
      .replace(/{totalAmount}/g, ((context.agreedPrice || context.listingPrice || 0) * (context.quantity || 1)).toString())
      .replace(/{mentionedQuantity}/g, context.mentionedQuantity !== undefined && context.mentionedQuantity !== null && context.mentionedQuantity > 0 ? context.mentionedQuantity.toString() : '')
      .replace(/{mentionedUnit}/g, (context.mentionedUnit && context.mentionedUnit.trim() !== '') ? context.mentionedUnit : (context.unit && context.unit.trim() !== '') ? context.unit : '')
      .replace(/{estimatedTotal}/g, estimatedTotal > 0 ? Math.round(estimatedTotal).toString() : '');

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

    console.log('✨ After replacement:', selectedResponse);
  } else {
    console.log('⚠️ No context provided for variable replacement');
    // CRITICAL FIX: Without context, remove placeholders entirely to prevent showing {variable}
    selectedResponse = selectedResponse
      .replace(/{price}/g, '')
      .replace(/{counterPrice}/g, '')
      .replace(/{listingPrice}/g, '')
      .replace(/{marketPrice}/g, '')
      .replace(/{quantity}/g, '')
      .replace(/{unit}/g, '')
      .replace(/{produceName}/g, '')
      .replace(/{agreedPrice}/g, '')
      .replace(/{totalAmount}/g, '')
      .replace(/{mentionedQuantity}/g, '')
      .replace(/{mentionedUnit}/g, '')
      .replace(/{estimatedTotal}/g, '');
  }

  return selectedResponse;
}
