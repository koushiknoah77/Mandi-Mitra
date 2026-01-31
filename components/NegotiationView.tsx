import React, { useState, useEffect, useRef } from 'react';
import { Listing, Message, SupportedLanguageCode, Deal, ModerationResult, UserRole, ConversationHistory } from '../types';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';
import { useListings } from '../contexts/ListingsContext';
import { VoiceIndicator } from './VoiceIndicator';
import { RatingModal } from './RatingModal';
import { geminiService } from '../services/geminiService';
import { invoiceService } from '../services/invoiceService';
import { mandiService } from '../services/mandiService';
import { pdfExport } from '../utils/pdfExport';
import { getFallbackResponse, shouldFinalizeDeal, extractPriceFromMessage, extractQuantityFromMessage } from '../utils/fallbackResponses';
import { MandiPulse } from './MandiPulse';
import { AIModeratorAlert } from './AIModeratorAlert';
import { getLabel } from '../utils/translations';

interface NegotiationViewProps {
  listing: Listing;
  userLanguage: SupportedLanguageCode;
  userRole: UserRole;
  onClose: () => void;
}

export const NegotiationView: React.FC<NegotiationViewProps> = ({ listing, userLanguage, userRole, onClose }) => {
  const { addTransaction, addConversation, updateConversation } = useListings();
  const myId = userRole === UserRole.SELLER ? 'seller' : 'user';
  const otherId = userRole === UserRole.SELLER ? 'user' : 'seller';
  const otherName = userRole === UserRole.SELLER ? getLabel('potentialBuyer', userLanguage) : listing.sellerName;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: 'system',
      text: userRole === UserRole.BUYER 
        ? `${getLabel('negotiationStart', userLanguage)} ${listing.produceName}.`
        : `${getLabel('negotiationInquiry', userLanguage)} ${listing.produceName}.`,
      timestamp: Date.now()
    },
    ...(userRole === UserRole.SELLER ? [{
      id: '2',
      senderId: 'user',
      text: getLabel('sellerInitialMsg', userLanguage).replace('{0}', listing.produceName),
      timestamp: Date.now() + 100
    }] : [])
  ]);

  const [inputText, setInputText] = useState("");
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [moderationAlert, setModerationAlert] = useState<ModerationResult | null>(null);
  const [dealStage, setDealStage] = useState<'chat' | 'confirming' | 'finalized'>('chat');
  const [finalOffer, setFinalOffer] = useState({ price: listing.pricePerUnit, quantity: listing.quantity });
  const [generatedInvoiceUrl, setGeneratedInvoiceUrl] = useState<string | null>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [completedDeal, setCompletedDeal] = useState<Deal | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { state: voiceState, listen, cancel } = useVoiceAssistant(userLanguage);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, dealStage, moderationAlert]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    setModerationAlert(null);
    
    const userMsg: Message = { id: Date.now().toString(), senderId: myId, text, timestamp: Date.now() };
    setMessages((prev: Message[]) => [...prev, userMsg]);
    setIsAiProcessing(true);
    setInputText("");

    try {
      // Moderate first
      try {
        const marketData = await mandiService.getMarketPrice(listing.produceName, listing.location);
        const benchmarkPrice = marketData?.modalPrice || listing.pricePerUnit;
        const moderation = await geminiService.moderateMessage(text, finalOffer.price, benchmarkPrice);
        if (moderation.flagged) {
          setModerationAlert(moderation);
          if (moderation.reason === 'Inappropriate language') {
            setIsAiProcessing(false);
            return;
          }
        }
      } catch (e) { 
        console.warn("Moderation check failed", e); 
      }

      // Try AI negotiation first
      let aiResponse;
      let usedFallback = false;
      
      try {
        aiResponse = await geminiService.negotiate(listing, [...messages, userMsg], userRole, finalOffer, userLanguage);
      } catch (aiError) {
        console.warn("AI negotiation failed, using fallback:", aiError);
        usedFallback = true;
        
        // Check if user wants to finalize deal
        if (shouldFinalizeDeal(text)) {
          aiResponse = {
            text: getFallbackResponse(text, userLanguage),
            status: 'agreed' as const
          };
        } else {
          // Extract price/quantity if mentioned
          const mentionedPrice = extractPriceFromMessage(text);
          const mentionedQuantity = extractQuantityFromMessage(text);
          
          // Use fallback response system
          const fallbackText = getFallbackResponse(text, userLanguage);
          aiResponse = {
            text: fallbackText,
            status: 'ongoing' as const,
            proposedPrice: mentionedPrice || undefined,
            proposedQuantity: mentionedQuantity || undefined
          };
        }
      }

      setIsAiProcessing(false);

      if (aiResponse.text) {
        setMessages((prev: Message[]) => [...prev, {
          id: (Date.now() + 1).toString(),
          senderId: otherId,
          text: aiResponse.text,
          timestamp: Date.now()
        }]);
      }

      // Update prices/status (works with both AI and fallback)
      if (aiResponse.proposedPrice) setFinalOffer((prev) => ({ ...prev, price: aiResponse.proposedPrice! }));
      if (aiResponse.proposedQuantity) setFinalOffer((prev) => ({ ...prev, quantity: aiResponse.proposedQuantity! }));
      if (aiResponse.status === 'agreed') setTimeout(() => setDealStage('confirming'), 1000);

    } catch (e) {
      console.error("Message handling error:", e);
      setIsAiProcessing(false);
      
      // Final fallback - show error message in user's language
      const errorMessages: Record<SupportedLanguageCode, string> = {
        en: 'Sorry, I\'m having trouble responding. Please try again.',
        hi: 'क्षमा करें, मुझे जवाब देने में परेशानी हो रही है। कृपया पुन: प्रयास करें।',
        bn: 'দুঃখিত, আমার উত্তর দিতে সমস্যা হচ্ছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
        te: 'క్షమించండి, నాకు ప్రతిస్పందించడంలో సమస్య ఉంది. దయచేసి మళ్లీ ప్రయత్నించండి.',
        mr: 'क्षमस्व, मला प्रतिसाद देण्यात अडचण येत आहे. कृपया पुन्हा प्रयत्न करा.',
        ta: 'மன்னிக்கவும், எனக்கு பதிலளிப்பதில் சிக்கல் உள்ளது. மீண்டும் முயற்சிக்கவும்.',
        gu: 'માફ કરશો, મને જવાબ આપવામાં મુશ્કેલી આવી રહી છે. કૃપા કરીને ફરી પ્રયાસ કરો.',
        kn: 'ಕ್ಷಮಿಸಿ, ನನಗೆ ಪ್ರತಿಕ್ರಿಯಿಸಲು ತೊಂದರೆಯಾಗುತ್ತಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
        ml: 'ക്ഷമിക്കണം, എനിക്ക് പ്രതികരിക്കാൻ പ്രശ്നമുണ്ട്. ദയവായി വീണ്ടും ശ്രമിക്കുക.',
        pa: 'ਮਾਫ਼ ਕਰਨਾ, ਮੈਨੂੰ ਜਵਾਬ ਦੇਣ ਵਿੱਚ ਮੁਸ਼ਕਲ ਆ ਰਹੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',
        ur: 'معذرت، مجھے جواب دینے میں پریشانی ہو رہی ہے۔ براہ کرم دوبارہ کوشش کریں۔',
        or: 'କ୍ଷମା କରନ୍ତୁ, ମୋତେ ଉତ୍ତର ଦେବାରେ ଅସୁବିଧା ହେଉଛି। ଦୟାକରି ପୁନର୍ବାର ଚେଷ୍ଟା କରନ୍ତୁ।'
      };
      
      setMessages((prev: Message[]) => [...prev, {
        id: (Date.now() + 1).toString(),
        senderId: 'system',
        text: errorMessages[userLanguage] || errorMessages.en,
        timestamp: Date.now()
      }]);
    }
  };

  const handleTextSubmit = () => handleSendMessage(inputText);
  const handleVoiceInteraction = async () => {
    if (voiceState.isSpeaking) { cancel(); return; }
    const transcript = await listen();
    if (transcript) handleSendMessage(transcript);
  };

  const finalizeDeal = async () => {
    const deal: Deal = {
      id: `DEAL-${Date.now().toString().slice(-6)}`,
      listingId: listing.id,
      sellerId: listing.sellerId,
      buyerId: userRole === UserRole.BUYER ? 'currentUser' : 'simulatedBuyer',
      produceName: listing.produceName,
      unit: listing.unit,
      finalPrice: finalOffer.price,
      finalQuantity: finalOffer.quantity,
      totalAmount: finalOffer.price * finalOffer.quantity,
      status: 'completed',
      timestamp: Date.now()
    };
    
    // Generate invoice
    const url = await invoiceService.generateInvoice(deal);
    deal.invoiceUrl = url;
    
    // Save transaction to history
    addTransaction(deal);
    
    // Save conversation to history
    const conversation: ConversationHistory = {
      id: `CONV-${Date.now()}`,
      listing,
      participants: {
        sellerId: listing.sellerId,
        sellerName: listing.sellerName,
        buyerId: userRole === UserRole.BUYER ? 'currentUser' : 'simulatedBuyer',
        buyerName: userRole === UserRole.BUYER ? 'You' : getLabel('potentialBuyer', userLanguage)
      },
      messages,
      dealStatus: 'completed',
      lastMessageAt: Date.now()
    };
    addConversation(conversation);
    
    setGeneratedInvoiceUrl(url);
    setCompletedDeal(deal);
    setDealStage('finalized');
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      senderId: 'system',
      text: getLabel('dealConfirmed', userLanguage),
      timestamp: Date.now()
    }]);
    
    // Show rating modal after 2 seconds
    setTimeout(() => {
      setShowRatingModal(true);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-fade-in font-sans">
      <div className="bg-[#f2f4f1] w-full sm:max-w-lg h-[95vh] sm:h-[850px] rounded-t-[28px] sm:rounded-[28px] shadow-2xl flex flex-col overflow-hidden relative border border-white/20">
        
        {/* Header - M3 Top Bar Style */}
        <div className="bg-[#fdfdf5] p-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <button 
            onClick={onClose} 
            className="w-10 h-10 flex items-center justify-center bg-[#ecefe9] rounded-full text-[#414942] hover:bg-[#e2e7e0] transition-colors"
            title={getLabel('back', userLanguage)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center gap-4 flex-1 ml-2">
             <div className="w-10 h-10 rounded-full bg-[#c4eed0] text-[#072114] flex items-center justify-center text-xl overflow-hidden font-bold">
                {userRole === UserRole.SELLER ? '👤' : <img src={listing.imageUrl || "https://via.placeholder.com/50"} className="w-full h-full object-cover" />}
             </div>
             <div>
               <h3 className="font-bold text-[#191c1a] text-lg leading-tight">{otherName}</h3>
               <p className="text-xs font-semibold text-[#4e6356] uppercase tracking-wide">{listing.produceName} • ₹{listing.pricePerUnit}</p>
             </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-[#ecefe9] rounded-full text-[#414942] hover:bg-[#e2e7e0] transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Pulse Bar */}
        <div className="px-4 py-2 bg-[#fdfdf5]/80 backdrop-blur-sm z-10 border-b border-[#c3c8bc]/30">
           <MandiPulse listing={listing} />
        </div>

        {/* Chat Area - M3 Conversation */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-28 bg-[#f0f4f1]">
          {messages.map((msg: Message) => (
            <div 
              key={msg.id} 
              className={`flex w-full ${msg.senderId === myId ? 'justify-end' : 'justify-start'} ${msg.senderId === 'system' ? 'justify-center' : ''}`}
            >
              {msg.senderId === 'system' ? (
                <span className="text-[11px] font-bold text-[#414942] bg-[#e2e2e2] px-3 py-1 rounded-full uppercase tracking-wider mt-4">
                  {msg.text}
                </span>
              ) : (
                <div 
                  className={`max-w-[80%] px-5 py-3.5 text-[15px] shadow-sm leading-relaxed ${
                    msg.senderId === myId 
                      ? 'bg-[#1b6b33] text-white rounded-t-[20px] rounded-bl-[20px] rounded-br-[4px]' 
                      : 'bg-[#fdfdf5] text-[#191c1a] rounded-t-[20px] rounded-br-[20px] rounded-bl-[4px] border border-[#c3c8bc]/20'
                  }`}
                >
                  {msg.text}
                </div>
              )}
            </div>
          ))}
          
          {isAiProcessing && (
            <div className="flex justify-start">
               <div className="bg-[#fdfdf5] px-5 py-4 rounded-t-[20px] rounded-br-[20px] rounded-bl-[4px] shadow-sm flex items-center gap-1.5 border border-[#c3c8bc]/20">
                 <div className="w-2 h-2 bg-[#1b6b33] rounded-full animate-bounce"></div>
                 <div className="w-2 h-2 bg-[#1b6b33] rounded-full animate-bounce delay-75"></div>
                 <div className="w-2 h-2 bg-[#1b6b33] rounded-full animate-bounce delay-150"></div>
               </div>
            </div>
          )}

          {moderationAlert && (
            <AIModeratorAlert result={moderationAlert} onDismiss={() => setModerationAlert(null)} />
          )}

          {/* Deal Actions Card */}
          {dealStage === 'confirming' && (
            <div className="mx-2 bg-[#e7f8ed] rounded-[24px] p-6 shadow-md border border-[#c4eed0] animate-fade-in-up">
              <h4 className="font-bold text-[#072114] mb-4 text-center text-lg">{getLabel('confirmDealTerms', userLanguage)}</h4>
              <div className="bg-white/60 rounded-[16px] p-5 mb-5 space-y-3">
                <div className="flex justify-between text-sm items-center">
                  <span className="text-[#414942] font-medium">{getLabel('agreedPrice', userLanguage)}</span>
                  <span className="font-bold text-lg text-[#191c1a]">₹{finalOffer.price}</span>
                </div>
                <div className="flex justify-between text-sm items-center">
                  <span className="text-[#414942] font-medium">{getLabel('quantity', userLanguage)}</span>
                  <span className="font-bold text-lg text-[#191c1a]">{finalOffer.quantity} {listing.unit}</span>
                </div>
                <div className="border-t border-dashed border-[#c3c8bc] pt-3 mt-1 flex justify-between font-bold text-[#1b6b33] text-xl">
                  <span>{getLabel('total', userLanguage)}</span>
                  <span>₹{finalOffer.price * finalOffer.quantity}</span>
                </div>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setDealStage('chat')} 
                  className="flex-1 py-4 text-[#414942] font-bold bg-white border border-[#c3c8bc] rounded-full hover:bg-[#ecefe9] transition-colors"
                >
                  {getLabel('edit', userLanguage)}
                </button>
                <button 
                  onClick={finalizeDeal} 
                  className="flex-1 py-4 bg-[#1b6b33] text-white font-bold rounded-full shadow-md hover:bg-[#145226] transition-colors"
                >
                  {getLabel('acceptDeal', userLanguage)}
                </button>
              </div>
            </div>
          )}

          {dealStage === 'finalized' && (
            <div className="bg-[#c4eed0] text-[#072114] rounded-[24px] p-8 text-center shadow-md mx-2 animate-fade-in-up">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="font-bold text-2xl mb-2">{getLabel('dealClosed', userLanguage)}</h3>
              <p className="opacity-80 text-sm mb-6 font-medium">{getLabel('dealSuccessMsg', userLanguage)}</p>
              {generatedInvoiceUrl && completedDeal && (
                <div className="flex gap-3 justify-center">
                  <a 
                    href={generatedInvoiceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-block bg-[#072114] text-white px-8 py-4 rounded-full font-bold shadow-md hover:bg-black transition-colors"
                  >
                    {getLabel('viewInvoice', userLanguage)}
                  </a>
                  <button
                    onClick={() => pdfExport.exportInvoicePDF(completedDeal)}
                    className="inline-block bg-white text-[#072114] px-8 py-4 rounded-full font-bold shadow-md hover:bg-slate-50 transition-colors border-2 border-[#072114]"
                  >
                    📥 Download PDF
                  </button>
                </div>
              )}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Floating Input Bar */}
        {dealStage === 'chat' && (
          <div className="absolute bottom-6 left-4 right-4 z-20">
             <div className="bg-[#fdfdf5] rounded-full p-2 shadow-lg border border-[#c3c8bc]/50 flex items-center gap-3 pr-2">
                <div className="transform scale-90 origin-center">
                   <VoiceIndicator state={voiceState} onClick={handleVoiceInteraction} />
                </div>
                <input 
                  type="text"
                  value={inputText}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputText(e.target.value)}
                  placeholder={getLabel('messagePlaceholder', userLanguage)}
                  className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-base py-3 placeholder-[#72796f] text-[#191c1a]"
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleTextSubmit()}
                />
                <button 
                  onClick={handleTextSubmit}
                  disabled={!inputText.trim()}
                  className="bg-[#c4eed0] text-[#072114] w-12 h-12 rounded-full hover:bg-[#b0eac0] disabled:opacity-50 disabled:bg-[#ecefe9] transition-colors flex items-center justify-center"
                >
                  <svg className="w-5 h-5 transform rotate-90 translate-x-[2px]" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                </button>
             </div>
          </div>
        )}
      </div>

      {/* Rating Modal */}
      {showRatingModal && completedDeal && (
        <RatingModal
          deal={completedDeal}
          currentUserId={myId}
          otherUserId={otherId}
          otherUserName={otherName}
          language={userLanguage}
          onClose={() => setShowRatingModal(false)}
        />
      )}
    </div>
  );
};