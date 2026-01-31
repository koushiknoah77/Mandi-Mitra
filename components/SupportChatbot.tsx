import React, { useState, useRef, useEffect } from 'react';
import { SupportMessage, SupportedLanguageCode } from '../types';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';
import { VoiceIndicator } from './VoiceIndicator';
import { geminiService } from '../services/geminiService';
import { analyticsService } from '../services/analyticsService';
import { getFallbackResponse } from '../utils/fallbackResponses';
import { getLabel } from '../utils/translations';

interface SupportChatbotProps {
  language: SupportedLanguageCode;
}

export const SupportChatbot: React.FC<SupportChatbotProps> = ({ language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<SupportMessage[]>([
    { id: '0', sender: 'bot', text: '', timestamp: Date.now() }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { state: voiceState, listen, cancel } = useVoiceAssistant(language);

  // Update greeting when language changes if conversation hasn't started
  useEffect(() => {
    // If it's the initial state (only 1 bot message), update it to the new language
    if (messages.length === 1 && messages[0].sender === 'bot') {
       setMessages([{
         id: '0',
         sender: 'bot',
         text: getLabel('supportWelcome', language),
         timestamp: Date.now()
       }]);
    }
  }, [language, messages.length]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: SupportMessage = { id: Date.now().toString(), sender: 'user', text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      let responseText;
      try {
        responseText = await geminiService.generateSupportResponse(text, language);
      } catch (aiError) {
        console.warn("AI support failed, using fallback:", aiError);
        // Use fallback response system
        responseText = getFallbackResponse(text, language);
      }
      
      const botMsg: SupportMessage = { id: (Date.now()+1).toString(), sender: 'bot', text: responseText, timestamp: Date.now() };
      setMessages(prev => [...prev, botMsg]);
      analyticsService.logEvent('support_query_success', undefined, { language });
    } catch (error) {
      console.error("Support chat error:", error);
      // Final fallback - error message in user's language
      const errorMessages: Record<SupportedLanguageCode, string> = {
        en: 'Sorry, I\'m having trouble right now. Please try again.',
        hi: 'क्षमा करें, मुझे अभी परेशानी हो रही है। कृपया पुन: प्रयास करें।',
        bn: 'দুঃখিত, আমার এখন সমস্যা হচ্ছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
        te: 'క్షమించండి, నాకు ఇప్పుడు సమస్య ఉంది. దయచేసి మళ్లీ ప్రయత్నించండి.',
        mr: 'क्षमस्व, मला आत्ता अडचण येत आहे. कृपया पुन्हा प्रयत्न करा.',
        ta: 'மன்னிக்கவும், எனக்கு இப்போது சிக்கல் உள்ளது. மீண்டும் முயற்சிக்கவும்.',
        gu: 'માફ કરશો, મને અત્યારે મુશ્કેલી આવી રહી છે. કૃપા કરીને ફરી પ્રયાસ કરો.',
        kn: 'ಕ್ಷಮಿಸಿ, ನನಗೆ ಈಗ ತೊಂದರೆಯಾಗುತ್ತಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
        ml: 'ക്ഷമിക്കണം, എനിക്ക് ഇപ്പോൾ പ്രശ്നമുണ്ട്. ദയവായി വീണ്ടും ശ്രമിക്കുക.',
        pa: 'ਮਾਫ਼ ਕਰਨਾ, ਮੈਨੂੰ ਹੁਣ ਮੁਸ਼ਕਲ ਆ ਰਹੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',
        ur: 'معذرت، مجھے ابھی پریشانی ہو رہی ہے۔ براہ کرم دوبارہ کوشش کریں۔',
        or: 'କ୍ଷମା କରନ୍ତୁ, ମୋତେ ବର୍ତ୍ତମାନ ଅସୁବିଧା ହେଉଛି। ଦୟାକରି ପୁନର୍ବାର ଚେଷ୍ଟା କରନ୍ତୁ।'
      };
      const botMsg: SupportMessage = { 
        id: (Date.now()+1).toString(), 
        sender: 'bot', 
        text: errorMessages[language] || errorMessages.en, 
        timestamp: Date.now() 
      };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleVoiceInput = async () => {
    if (voiceState.isSpeaking) { cancel(); return; }
    const text = await listen();
    if (text) handleSend(text);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-black text-white rounded-[1.5rem] shadow-2xl hover:scale-110 transition-transform flex items-center justify-center z-50 group"
      >
        <span className="text-3xl group-hover:animate-bounce">💬</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 h-[30rem] bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-gray-100 flex flex-col overflow-hidden z-50 animate-fade-in-up">
      {/* Header */}
      <div className="bg-white p-6 border-b border-gray-50 flex justify-between items-center">
        <button 
          onClick={() => setIsOpen(false)} 
          className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 mr-3"
          title={getLabel('back', language)}
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
           <h3 className="font-bold text-xl text-gray-900">{getLabel('support', language)}</h3>
           <p className="text-xs text-gray-500 font-medium">{getLabel('aiAssistant', language)}</p>
        </div>
        <button onClick={() => setIsOpen(false)} className="bg-gray-100 p-2 rounded-full hover:bg-gray-200">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50" ref={scrollRef}>
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 text-[15px] shadow-sm leading-relaxed ${msg.sender === 'user' ? 'bg-black text-white rounded-[1.5rem] rounded-tr-sm' : 'bg-white text-gray-800 rounded-[1.5rem] rounded-tl-sm'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
           <div className="flex justify-start">
             <div className="bg-white px-4 py-3 rounded-[1.5rem] rounded-tl-sm shadow-sm flex gap-1.5">
               <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
               <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></div>
               <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></div>
             </div>
           </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
        <div className="transform scale-75 origin-center">
           <VoiceIndicator state={voiceState} onClick={handleVoiceInput} />
        </div>
        <input 
          type="text" 
          placeholder={getLabel('askHelp', language)}
          className="flex-1 text-sm bg-gray-100 border-none rounded-full px-4 py-3 focus:ring-0 outline-none"
          onKeyDown={(e) => {
             if (e.key === 'Enter') {
                handleSend(e.currentTarget.value);
                e.currentTarget.value = '';
             }
          }}
        />
      </div>
    </div>
  );
};