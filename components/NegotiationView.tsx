import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Listing, UserRole, SupportedLanguageCode, Message, Deal, ConversationHistory } from '../types';
import { getLabel } from '../utils/translations';
import { geminiService } from '../services/geminiService';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';
import { VoiceIndicator } from './VoiceIndicator';
import { analyticsService } from '../services/analyticsService';
import { useListings } from '../contexts/ListingsContext';
import { RatingModal } from './RatingModal';
import { invoiceService } from '../services/invoiceService';
import type { UserProfile } from '../types';

interface NegotiationViewProps {
    listing: Listing;
    userLanguage: SupportedLanguageCode;
    userRole: UserRole;
    user: UserProfile;
    onClose: () => void;
    existingConversation?: ConversationHistory | null;
}

export const NegotiationView: React.FC<NegotiationViewProps> = ({ listing, userLanguage, userRole, user, onClose, existingConversation }) => {
    const [messages, setMessages] = useState<Message[]>(existingConversation?.messages || []);
    const [inputText, setInputText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [dealStatus, setDealStatus] = useState<'active' | 'agreed' | 'rejected'>(
        existingConversation?.dealStatus === 'completed' ? 'agreed' : 'active'
    );
    const [negotiatedPrice, setNegotiatedPrice] = useState<number>(listing.pricePerUnit);
    const [negotiatedQuantity, setNegotiatedQuantity] = useState<number>(listing.quantity);
    const [buyerAsk, setBuyerAsk] = useState<string>('');
    const [finalDeal, setFinalDeal] = useState<Deal | null>(null);
    const [invoiceUrl, setInvoiceUrl] = useState<string>('');
    const [showRating, setShowRating] = useState(false);
    const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { addTransaction, addConversation, conversations, updateConversation } = useListings(); // Using correct context methods

    const { state: voiceState, listen, cancel } = useVoiceAssistant(userLanguage);

    const otherRole = userRole === UserRole.BUYER ? UserRole.SELLER : UserRole.BUYER;
    const otherName = userRole === UserRole.BUYER ? listing.sellerName : "Buyer";

    // Unused but kept for structure if needed later
    // const conversationId = useMemo(() => `${listing.id}-${userRole === UserRole.BUYER ? 'user' : 'other'}`, [listing.id, userRole]);

    // Load existing conversation if not passed as prop (e.g. fresh navigation)
    useEffect(() => {
        if (!existingConversation) {
            const found = conversations.find(c => c.listingId === listing.id && (c.participants.buyerId === user.id || c.participants.sellerId === user.id));
            if (found && messages.length === 0) {
                setMessages(found.messages);
                if (found.dealStatus === 'completed') {
                    setDealStatus('agreed');
                }
            }
        }
    }, [listing.id, conversations, existingConversation, user.id]);

    // Save conversation on updates
    useEffect(() => {
        if (messages.length > 0) {
            const existing = conversations.find(c => c.listingId === listing.id);
            if (existing) {
                updateConversation(existing.id, {
                    messages,
                    lastMessageAt: Date.now(),
                    dealStatus: dealStatus === 'agreed' ? 'completed' : 'active'
                });
            } else {
                addConversation({
                    id: Date.now().toString(),
                    listingId: listing.id,
                    listing,
                    messages,
                    participants: {
                        buyerId: userRole === UserRole.BUYER ? user.id : 'bot-user',
                        buyerName: userRole === UserRole.BUYER ? user.name : 'Buyer',
                        sellerId: listing.sellerId,
                        sellerName: listing.sellerName
                    },
                    lastMessageAt: Date.now(),
                    dealStatus: 'active'
                });
            }
        }
    }, [messages, dealStatus]); // Removed unnecessary deps, conversations handled via check

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!inputText.trim()) return;

        // 1. User Message
        const userMsg: Message = {
            id: Date.now().toString(),
            senderId: userRole,
            text: inputText,
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMsg]);
        const currentInput = inputText;
        setInputText("");
        setIsTyping(true);

        // Check if user is confirming a deal (YES, OK, AGREE, etc.)
        // Check if user is confirming a deal (Comprehensive patterns for Indian languages and slang)
        const confirmationPattern = /\b(yes|ok|okay|han|haan|thik|theek|agree|accept|done|pakka|bilkul|zaroor|confirm|manjur|manzoor|sahi|ji|haa|ha|sahi hai|thik hai|thik ache|thik ache bhaiya|done|accept|agree|perfect|fine|good|okay ji|bilkul ji|sure|definitely|absolutely|ready|yep|yeah|yea|yh|k|kk|y|acha|achha|hanya|hange|shari|sari|aam|am|hoyi|haoo|manjur aahe|manzoor hai|unite|ha|hange|shari|sari|yo|yup)\b/i;
        const isUserConfirming = confirmationPattern.test(currentInput.trim());

        try {
            // Determine responder role: AI plays the OTHER role
            console.log('🔍 Debug - userRole:', userRole, 'UserRole.BUYER:', UserRole.BUYER, 'Match:', userRole === UserRole.BUYER);
            const responderRole = userRole === UserRole.BUYER ? 'seller' : 'buyer';
            console.log('🔍 Debug - responderRole:', responderRole);

            // Build context for fallback system - Smarter extraction
            // priceHint: Look for numbers not immediately followed by weight/quantity units
            const priceHintMatch = currentInput.match(/(?:₹|Rs\.?|price|rate|dar)?\s?(\d{2,})\b(?!\s*(?:kg|kilo|quintal|qtl|ton|tonnes|bori|bag|units|pc|piece))/i);
            const priceHint = priceHintMatch ? priceHintMatch[1] : null;

            // quantityHint: Specifically look for numbers followed by units
            const quantityHintMatch = currentInput.match(/(\d+)\s*(kg|kilo|quintal|qtl|ton|tonnes|bori|bag|units|pc|piece|bori)/i);
            const quantityHint = quantityHintMatch ? quantityHintMatch[1] : null;

            console.log('📊 Hints detected - Price:', priceHint, 'Quantity:', quantityHint);

            const context = {
                listingPrice: listing.pricePerUnit,
                quantity: negotiatedQuantity,
                unit: listing.unit,
                produceName: listing.produceName,
                marketPrice: listing.pricePerUnit,
                offeredPrice: priceHint ? parseInt(priceHint) : negotiatedPrice,
                mentionedQuantity: quantityHint ? parseInt(quantityHint) : negotiatedQuantity,
                mentionedUnit: listing.unit,
                agreedPrice: negotiatedPrice,
                estimatedTotal: negotiatedPrice * (quantityHint ? parseInt(quantityHint) : negotiatedQuantity)
            };

            let aiText = "";

            // Try AI first
            try {
                const aiResponse = await geminiService.negotiate(
                    messages,
                    currentInput,
                    userLanguage,
                    { role: userRole, listing }
                );

                // Fallback for empty text but valid intent
                aiText = aiResponse.text ||
                    (aiResponse.intent === 'accept' ? getLabel('dealConfirmed', userLanguage) : "");

                // If AI returned a response but no text, we still need something to show
                if (!aiText) {
                    throw new Error("Empty AI response text");
                }

                // Check for deal closure intent
                if (aiResponse.intent === 'accept' || aiResponse.intent === 'deal_closure') {
                    setDealStatus('agreed');
                    if (aiResponse.proposedPrice) {
                        setNegotiatedPrice(aiResponse.proposedPrice);
                    }
                    if (aiResponse.proposedQuantity) {
                        setNegotiatedQuantity(aiResponse.proposedQuantity);
                    }
                    analyticsService.logEvent('deal_agreed', userRole === UserRole.BUYER ? 'buyer' : 'seller');
                } else {
                    if (aiResponse.proposedPrice) {
                        setNegotiatedPrice(aiResponse.proposedPrice);
                    }
                    if (aiResponse.proposedQuantity) {
                        setNegotiatedQuantity(aiResponse.proposedQuantity);
                    }
                }

                if (userRole === UserRole.BUYER) {
                    setBuyerAsk(currentInput);
                }
            } catch (aiError) {
                console.warn("AI negotiation failed, using fallback system:", aiError);

                // Use your existing fallback system
                const { getFallbackResponse } = await import('../utils/fallbackResponses');
                aiText = getFallbackResponse(currentInput, userLanguage, context, responderRole);

                // Update negotiated quantity if hinted in input during fallback
                if (quantityHint) {
                    setNegotiatedQuantity(parseInt(quantityHint));
                }
            }

            // Sync negotiated state with input hints if not already set by AI
            if (quantityHint && !aiText.includes('{')) {
                setNegotiatedQuantity(parseInt(quantityHint));
            }
            if (priceHint && !aiText.includes('{')) {
                let parsedPrice = parseInt(priceHint);
                const currentQty = quantityHint ? parseInt(quantityHint) : negotiatedQuantity;

                // MATH LOGIC FIX: Check if the mentioned price is actually a total amount
                // If the mentioned number is much larger than the listing price (e.g. > 3x)
                // but is close to the expected total (Price * Quantity), treat it as total.
                if (parsedPrice > (listing.pricePerUnit * 3) && currentQty > 1) {
                    const expectedTotal = listing.pricePerUnit * currentQty;
                    // within 20% margin of the expected total or if it's an exact round number
                    if (Math.abs(parsedPrice - expectedTotal) / expectedTotal < 0.2 || parsedPrice % 1000 === 0) {
                        console.log('🧮 Mentioned number looks like a total amount. Converting to per-unit price.');
                        parsedPrice = Math.round(parsedPrice / currentQty);
                    }
                }

                // Safety: Only sync if price is reasonable (not just "1" or "10" unless it's a tiny item)
                if (parsedPrice > (listing.pricePerUnit * 0.1)) {
                    setNegotiatedPrice(parsedPrice);
                }
            }

            // If user confirmed with YES/OK or AI detected acceptance, trigger deal
            if (isUserConfirming) {
                setDealStatus('agreed');
                // Try to extract price from the conversation history if needed, 
                // but for now we use the latest negotiatedPrice
                analyticsService.logEvent('deal_agreed', userRole === UserRole.BUYER ? 'buyer' : 'seller');
            }

            // Simulate network delay
            setTimeout(() => {
                const aiMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    senderId: otherRole,
                    text: aiText,
                    timestamp: Date.now()
                };

                setMessages(prev => [...prev, aiMsg]);
                setIsTyping(false);
            }, 1500);

        } catch (e) {
            console.error("Negotiation error:", e);
            setIsTyping(false);
        }
    };

    const handleVoiceData = async () => {
        if (voiceState.isSpeaking) {
            cancel();
            return;
        }
        const text = await listen();
        if (text) {
            setInputText(text);
        }
    };

    const finalizeDeal = async () => {
        setIsGeneratingInvoice(true);
        // Create a deal record
        const deal: Deal = {
            id: `DEAL-${Date.now()}`,
            listingId: listing.id,
            buyerId: userRole === UserRole.BUYER ? user.id : 'other-party',
            sellerId: userRole === UserRole.SELLER ? user.id : listing.sellerId,
            finalPrice: negotiatedPrice,
            finalQuantity: negotiatedQuantity,
            totalAmount: negotiatedPrice * negotiatedQuantity,
            status: 'completed',
            timestamp: Date.now(),
            produceName: listing.produceName,
            notes: buyerAsk
        };

        try {
            const url = await invoiceService.generateInvoice(deal);
            setInvoiceUrl(url);
            addTransaction(deal);

            // Update conversation to completed
            const existing = conversations.find(c => c.listingId === listing.id);
            if (existing) {
                updateConversation(existing.id, {
                    dealStatus: 'completed',
                    deal: deal
                });
            }

            setFinalDeal(deal);
            analyticsService.logEvent('deal_finalized', userRole, { amount: deal.totalAmount });
        } catch (error) {
            console.error("Failed to finalize deal:", error);
            alert("Error finalizing deal. Please try again.");
        } finally {
            setIsGeneratingInvoice(false);
        }
    };

    if (finalDeal) {
        return (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex items-center justify-center p-4 sm:p-6 animate-fade-in font-sans">
                <div className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl flex flex-col items-center p-8 text-center animate-scale-in">
                    <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-5xl mb-6 shadow-inner animate-bounce">
                        ✅
                    </div>

                    <h2 className="text-3xl font-black text-slate-900 mb-2">
                        {getLabel('dealCompleted', userLanguage)}
                    </h2>
                    <p className="text-slate-500 mb-8 font-medium">
                        Your transaction for <strong>{finalDeal.produceName}</strong> has been processed successfully.
                    </p>

                    <div className="w-full bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100 space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Total Amount</span>
                            <span className="font-black text-slate-900 text-lg">₹{finalDeal.totalAmount}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Deal ID</span>
                            <span className="font-mono text-slate-600 text-[10px]">{finalDeal.id}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full mb-6">
                        <a
                            href={invoiceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white border-2 border-slate-100 py-4 px-6 rounded-full font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            Bill
                        </a>
                        <button
                            onClick={() => setShowRating(true)}
                            className="bg-emerald-50 text-emerald-700 py-4 px-6 rounded-full font-bold hover:bg-emerald-100 transition-all flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                            Rating
                        </button>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full bg-slate-900 text-white py-5 rounded-full font-bold hover:bg-black transition-all shadow-xl active:scale-95"
                    >
                        Done
                    </button>
                </div>

                {showRating && (
                    <RatingModal
                        deal={finalDeal}
                        currentUserId={user.id}
                        otherUserId={userRole === UserRole.BUYER ? listing.sellerId : 'other-party'}
                        otherUserName={userRole === UserRole.BUYER ? listing.sellerName : 'Buyer'}
                        language={userLanguage}
                        onClose={() => {
                            setShowRating(false);
                            onClose();
                        }}
                    />
                )}
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in font-sans">
            <div className="bg-white w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl flex flex-col h-[85vh] border border-white/20">

                {/* Modern Glass Header */}
                <div className="bg-slate-50/80 backdrop-blur-md p-6 border-b border-slate-200 flex justify-between items-center sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onClose}
                            className="mr-2 p-2 rounded-full hover:bg-slate-200 transition-colors"
                            title={getLabel('back', userLanguage)}
                        >
                            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <div className="relative">
                            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-xl shadow-inner uppercase font-black text-emerald-700">
                                {otherName.charAt(0)}
                            </div>
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div>
                            <h3 className="font-bold text-xl text-slate-900 leading-tight">{listing.produceName}</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                                {userRole === UserRole.SELLER ? 'Buyer' : 'Seller'}: {otherName}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col items-end">
                        <span className="font-black text-emerald-600 text-lg">₹{listing.pricePerUnit}</span>
                        <span className="text-xs text-slate-400 font-bold">/{listing.unit}</span>
                    </div>
                </div>

                {/* Chat Area with Pattern Background */}
                <div className="flex-1 bg-slate-100 p-6 overflow-y-auto space-y-6 relative" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}>

                    {/* Listing Summary Card in Chat */}
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 mx-auto max-w-sm">
                        <div className="flex gap-4">
                            {listing.imageUrl && <img src={listing.imageUrl} className="w-16 h-16 rounded-xl object-cover bg-slate-100" alt="product" />}
                            <div>
                                <p className="font-bold text-slate-900">{listing.produceName}</p>
                                <p className="text-sm text-slate-500">{listing.quantity} {listing.unit} • {listing.quality}</p>
                                <p className="text-xs text-slate-400 mt-1">{listing.location}</p>
                            </div>
                        </div>
                    </div>

                    {messages.length === 0 && (
                        <div className="text-center py-10 opacity-60">
                            <p className="text-slate-500 font-medium">Start the negotiation by sending a prompt or price offer.</p>
                        </div>
                    )}

                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.senderId === userRole ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                            <div className={`max-w-[85%] p-5 rounded-[24px] shadow-sm relative group transition-all ${msg.senderId === userRole
                                ? 'bg-emerald-600 text-white rounded-br-none shadow-emerald-200'
                                : 'bg-white text-slate-800 rounded-bl-none border border-slate-100'
                                }`}>
                                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                <div className={`flex items-center gap-1 mt-2 text-[10px] font-bold opacity-70 ${msg.senderId === userRole ? 'justify-end text-emerald-100' : 'text-slate-400'}`}>
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    {msg.senderId === userRole && <span>• Sent</span>}
                                </div>
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex justify-start animate-fade-in">
                            <div className="bg-white px-5 py-4 rounded-[24px] rounded-bl-none shadow-sm border border-slate-100 flex gap-1.5 items-center">
                                <span className="text-xs font-bold text-slate-400 mr-2">{otherName} is typing</span>
                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                            </div>
                        </div>
                    )}

                    {/* Deal Agreement Banner */}
                    {dealStatus === 'agreed' && (
                        <div className="my-6 p-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-3xl shadow-xl mx-4 sm:mx-8 animate-fade-in-up">
                            <div className="bg-white rounded-[24px] p-6 sm:p-8">
                                <div className="flex items-center justify-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl shadow-inner animate-bounce">
                                        🎉
                                    </div>
                                    <h4 className="font-black text-slate-900 text-2xl tracking-tight">
                                        {getLabel('dealAgreed', userLanguage) || 'Deal Summary'}
                                    </h4>
                                </div>

                                {/* Deal Summary Details */}
                                <div className="bg-slate-50 rounded-2xl p-6 mb-6 border border-slate-100 space-y-4">
                                    <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                                        <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Final Price</span>
                                        <span className="text-xl font-black text-emerald-600">₹{negotiatedPrice} <span className="text-xs text-slate-400 font-normal">/ {listing.unit}</span></span>
                                    </div>
                                    <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                                        <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Quantity</span>
                                        <span className="text-xl font-black text-slate-900">{negotiatedQuantity} {listing.unit}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                                        <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Total Amount</span>
                                        <span className="text-2xl font-black text-slate-900">₹{negotiatedPrice * negotiatedQuantity}</span>
                                    </div>
                                    {buyerAsk && (
                                        <div className="pt-2">
                                            <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest block mb-2">Buyer's Final Note/Ask</span>
                                            <div className="bg-white p-3 rounded-xl border border-slate-200 italic text-sm text-slate-600">
                                                "{buyerAsk}"
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setDealStatus('active')}
                                        className="flex-1 py-4 text-slate-500 font-bold rounded-full border-2 border-slate-100 hover:bg-slate-50 transition-all active:scale-95"
                                    >
                                        Change
                                    </button>
                                    <button
                                        onClick={finalizeDeal}
                                        className="flex-[2] bg-slate-900 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <span>{getLabel('finalizeDeal', userLanguage) || 'Confirm Deal'}</span>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-slate-100">
                    <div className="flex gap-3 items-end">
                        <div className="mb-2">
                            <VoiceIndicator state={voiceState} onClick={handleVoiceData} />
                        </div>

                        <div className="flex-1 relative bg-slate-100 rounded-[28px] focus-within:ring-2 focus-within:ring-emerald-500 focus-within:bg-white transition-all border border-transparent focus-within:border-emerald-100 flex items-center">
                            <textarea
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                                placeholder={getLabel('typeMessage', userLanguage) || "Type your offer..."}
                                rows={1}
                                className="w-full bg-transparent border-none rounded-[28px] px-6 py-4 focus:ring-0 outline-none text-slate-800 font-medium resize-none max-h-32"
                                style={{ minHeight: '56px' }}
                            />
                        </div>

                        <button
                            onClick={handleSend}
                            disabled={!inputText.trim() || isTyping}
                            className="mb-1 w-12 h-12 flex items-center justify-center bg-slate-900 text-white rounded-full hover:bg-black transition-all shadow-lg shadow-slate-300 disabled:opacity-50 disabled:shadow-none active:scale-90"
                        >
                            <svg className="w-5 h-5 transform rotate-90 translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
