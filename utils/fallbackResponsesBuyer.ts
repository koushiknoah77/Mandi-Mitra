import type { SupportedLanguageCode } from '../types';
import type { FallbackResponse } from './fallbackResponses';

// BUYER PERSONA RESPONSES (When the Bot is acting as the BUYER)
export const FALLBACK_RESPONSES_BUYER: FallbackResponse[] = [
    // Numeric price offers (e.g., "3000") - Buyer reaction
    {
        pattern: /^\d+$/,
        weight: 1.0,
        responses: {
            en: [
                '₹{price}? That fits my budget. I need {quantity} {unit}.',
                '₹{price} is a bit high given the market rate. Can you do ₹{counterPrice}?',
                'Okay, ₹{price} sounds fair. How about delivery?',
                'I see. If I take {quantity} {unit}, can you give a discount on ₹{price}?'
            ],
            hi: [
                '₹{price}? यह मेरे बजट में है। मुझे {quantity} {unit} चाहिए।',
                'बाजार दर को देखते हुए ₹{price} थोड़ा ज्यादा है। क्या आप ₹{counterPrice} कर सकते हैं?',
                'ठीक है, ₹{price} उचित लगता है। डिलीवरी के बारे में क्या?',
                'मैं समझता हूं। अगर मैं {quantity} {unit} लेता हूं, तो क्या आप ₹{price} पर छूट दे सकते हैं?'
            ],
            bn: [
                '₹{price}? এটা আমার বাজেটে ফিট করে। আমার {quantity} {unit} দরকার।',
                'বাজার দর বিবেচনা করে ₹{price} একটু বেশি। আপনি কি ₹{counterPrice} করতে পারবেন?'
            ],
            te: [
                '₹{price}? అది నా బడ్జెట్‌కు సరిపోతుంది. నాకు {quantity} {unit} కావాలి.',
                'మార్కెట్ రేటును బట్టి ₹{price} కొంచెం ఎక్కువ. మీరు ₹{counterPrice} చేయగలరా?'
            ],
            ta: [
                '₹{price}? அது என் பட்ஜெட்டுக்கு பொருந்துகிறது. எனக்கு {quantity} {unit} தேவை.',
                'சந்தை விலையைக் கருத்தில் கொண்டு ₹{price} கொஞ்சம் அதிகம். நீங்கள் ₹{counterPrice} செய்ய முடியுமா?'
            ]
        }
    },
    // Greetings (Buyer initiating)
    {
        pattern: /^(hello|hi|hey|namaste|namaskar)/i,
        weight: 1.0,
        responses: {
            en: [
                'Hello! Is this {produceName} still available?',
                'Hi! I saw your listing for {produceName}. Is the stock available?',
                'Namaste! What is the price for your {produceName}?'
            ],
            hi: [
                'नमस्ते! क्या यह {produceName} अभी भी उपलब्ध है?',
                'नमस्ते! मैंने {produceName} के लिए आपकी लिस्टिंग देखी। क्या स्टॉक उपलब्ध है?',
                'नमस्ते! आपके {produceName} की कीमत क्या है?'
            ],
            bn: ['নমস্কার! এই {produceName} কি এখনও পাওয়া যাচ্ছে?', 'হাই! আপনার {produceName} এর দাম কত?'],
            te: ['నమస్తే! ఈ {produceName} ఇంకా అందుబాటులో ఉందా?', 'హాయ్! మీ {produceName} ధర ఎంత?'],
            ta: ['வணக்கம்! இந்த {produceName} இன்னும் கிடைக்கிறதா?', 'ஹாய்! உங்கள் {produceName} விலை என்ன?']
        }
    },
    // Price inquiry (User asks "What is your offer?" or similar, but if User just asks "Price?", Bot Buyer should answer "How much are you selling for?")
    {
        pattern: /(price|cost|rate|kitna|kya|daam)/i,
        weight: 0.9,
        responses: {
            en: [
                'I am looking to buy at around ₹{marketPrice}. What is your best price?',
                'How much are you asking per {unit}?',
                'What is your final rate for {quantity} {unit}?'
            ],
            hi: [
                'मैं लगभग ₹{marketPrice} पर खरीदना चाहता हूं। आपकी सबसे अच्छी कीमत क्या है?',
                'आप प्रति {unit} कितना मांग रहे हैं?',
                '{quantity} {unit} के लिए आपकी अंतिम दर क्या है?'
            ],
            bn: ['আমি প্রায় ₹{marketPrice} এ কিনতে চাই। আপনার সেরা দাম কত?', 'আপনি প্রতি {unit} কত চাইছেন?'],
            te: ['నేను దాదాపు ₹{marketPrice} వద్ద కొనాలనుకుంటున్నాను. మీ ఉత్తమ ధర ఎంత?', 'మీరు {unit} కు ఎంత అడుగుతున్నారు?'],
            ta: ['நான் சுமார் ₹{marketPrice} இல் வாங்க விரும்புகிறேன். உங்கள் சிறந்த விலை என்ன?', 'நீங்கள் {unit} க்கு எவ்வளவு கேட்கிறீர்கள்?']
        }
    },
    // Availability (User says "I have stock")
    {
        pattern: /(available|stock|quantity|hai|stock hai|maujud)/i,
        weight: 0.9,
        responses: {
            en: [
                'Great! I need {quantity} {unit}.',
                'Good to hear. I am interested in buying {quantity} {unit}.',
                'Okay, I would like to place an order for {quantity} {unit}.'
            ],
            hi: [
                'बढ़िया! मुझे {quantity} {unit} चाहिए।',
                'सुनकर अच्छा लगा। मैं {quantity} {unit} खरीदने में रुचि रखता हूं।',
                'ठीक है, मैं {quantity} {unit} के लिए ऑर्डर देना चाहूंगा।'
            ],
            bn: ['দুর্দান্ত! আমার {quantity} {unit} দরকার।', 'শুনে ভালো লাগলো। আমি {quantity} {unit} কিনতে আগ্রহী।'],
            te: ['గొప్ప! నాకు {quantity} {unit} కావాలి.', 'వినడానికి బాగుంది. నేను {quantity} {unit} కొనడానికి ఆసక్తి కలిగి ఉన్నాను.'],
            ta: ['அருமை! எனக்கு {quantity} {unit} தேவை.', 'கேட்க நன்றாக இருக்கிறது. நான் {quantity} {unit} வாங்க ஆர்வமாக உள்ளேன்.']
        }
    },
    // Agreement
    {
        pattern: /(^ok$|^okay$|^yes$|^han$|^haan$|^thik$|^agree$|^deal$)/i,
        weight: 1.0,
        responses: {
            en: [
                'Perfect! Please confirm the final amount.',
                'Great! When can you deliver?',
                'Okay, send me the invoice please.'
            ],
            hi: [
                'बढ़िया! कृपया अंतिम राशि की पुष्टि करें।',
                'शानदार! आप कब डिलीवरी कर सकते हैं?',
                'ठीक है, कृपया मुझे चालान भेजें।'
            ],
            bn: ['নিখুঁত! অনুগ্রহ করে চূড়ান্ত পরিমাণ নিশ্চিত করুন।', 'ঠিক আছে, আমাকে চালান পাঠান।'],
            te: ['పర్ఫెక్ట్! దయచేసి తుది మొత్తాన్ని నిర్ధారించండి.', 'సరే, దయచేసి నాకు ఇన్వాయిస్ పంపండి.'],
            ta: ['சரியானது! இறுதி தொகையை உறுதிப்படுத்தவும்.', 'சரி, எனக்கு விலைப்பட்டியல் அனுப்பவும்.']
        }
    }
];

export const DEFAULT_FALLBACK_BUYER: Partial<Record<SupportedLanguageCode, string[]>> = {
    en: [
        'I am interested in your {produceName}. What is the price?',
        'I need {quantity} {unit}. Is it available?',
        'What is your best rate for {quantity} {unit}?',
        'Can you tell me more about the quality?'
    ],
    hi: [
        'मैं आपकी {produceName} में रुचि रखता हूं। कीमत क्या है?',
        'मुझे {quantity} {unit} चाहिए। क्या यह उपलब्ध है?',
        '{quantity} {unit} के लिए आपकी सबसे अच्छी दर क्या है?',
        'क्या आप मुझे गुणवत्ता के बारे में और बता सकते हैं?'
    ],
    bn: ['আমি আপনার {produceName} এ আগ্রহী। দাম কত?', 'আমার {quantity} {unit} দরকার। এটা কি পাওয়া যাচ্ছে?'],
    te: ['నేను మీ {produceName} పై ఆసక్తి కలిగి ఉన్నాను. ధర ఎంత?', 'నాకు {quantity} {unit} కావాలి. ఇది అందుబాటులో ఉందా?'],
    ta: ['உங்கள் {produceName} இல் நான் ஆர்வமாக உள்ளேன். விலை என்ன?', 'எனக்கு {quantity} {unit} தேவை. இது கிடைக்கிறதா?']
};
