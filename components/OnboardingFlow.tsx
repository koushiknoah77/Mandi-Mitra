import React, { useState } from 'react';
import { OnboardingStep, SupportedLanguageCode, UserRole, UserProfile } from '../types';
import { SUPPORTED_LANGUAGES } from '../constants';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';
import { VoiceIndicator } from './VoiceIndicator';
import { getLabel } from '../utils/translations';
import { geminiService } from '../services/geminiService';
import { LiveMarketTicker } from './LiveMarketTicker';

interface OnboardingFlowProps {
  onComplete: (profile: UserProfile) => void;
}

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
  "Uttarakhand", "West Bengal"
];

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [language, setLanguage] = useState<SupportedLanguageCode>('en');
  const [role, setRole] = useState<UserRole | null>(null);
  
  // Profile Details State
  const [name, setName] = useState('');
  const [userState, setUserState] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  
  // Voice assistant initialized with selected language
  const { state: voiceState, listen, cancel } = useVoiceAssistant(language);

  const handleStart = () => {
    setStep('language');
  };

  const handleBack = () => {
    if (step === 'language') setStep('welcome');
    else if (step === 'role') setStep('language');
    else if (step === 'details') setStep('role');
  };

  const handleLanguageSelect = (langCode: SupportedLanguageCode) => {
    setLanguage(langCode);
    setStep('role');
  };

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setStep('details');
  };

  const handleSubmit = () => {
    if (name && userState && phoneNumber.length === 10) {
      const profile: UserProfile = {
        id: crypto.randomUUID(),
        name,
        state: userState,
        phoneNumber,
        role,
        language,
        location: {
           address: userState,
           lat: 20.5937, // Default center of India
           lng: 78.9629
        }
      };
      // Small delay for UI feedback
      setTimeout(() => {
        onComplete(profile);
      }, 500);
    }
  };

  const handleVoiceInteraction = async () => {
    if (voiceState.isListening) { cancel(); return; }
    
    // If on landing page, voice triggers start
    if (step === 'welcome') {
      const transcript = await listen();
      if (transcript) {
        handleStart();
      }
      return;
    }
    
    const transcript = await listen();
    if (!transcript) return;
    const lower = transcript.toLowerCase();

    if (step === 'language') {
      // Basic language detection from voice
      if (lower.includes('hindi') || lower.includes('हिंदी')) handleLanguageSelect('hi');
      else if (lower.includes('english')) handleLanguageSelect('en');
      else if (lower.includes('marathi') || lower.includes('मराठी')) handleLanguageSelect('mr');
      else if (lower.includes('tamil') || lower.includes('தமிழ்')) handleLanguageSelect('ta');
      else if (lower.includes('telugu') || lower.includes('తెలుగు')) handleLanguageSelect('te');
      else if (lower.includes('gujarati') || lower.includes('ગુજરાતી')) handleLanguageSelect('gu');
      else if (lower.includes('kannada') || lower.includes('ಕನ್ನಡ')) handleLanguageSelect('kn');
      else if (lower.includes('malayalam') || lower.includes('മലയാളം')) handleLanguageSelect('ml');
      else if (lower.includes('punjabi') || lower.includes('ਪੰਜਾਬੀ')) handleLanguageSelect('pa');
      else if (lower.includes('odia') || lower.includes('ଓଡ଼ିଆ')) handleLanguageSelect('or');
      else if (lower.includes('bengali') || lower.includes('বাংলা')) handleLanguageSelect('bn');
      
    } else if (step === 'role') {
      if (lower.includes('sell') || lower.includes('farmer') || lower.includes('बेच') || lower.includes('किसान') || lower.includes('vikri')) handleRoleSelect(UserRole.SELLER);
      else if (lower.includes('buy') || lower.includes('trader') || lower.includes('खरीद') || lower.includes('व्यापारी') || lower.includes('kharedi')) handleRoleSelect(UserRole.BUYER);
    } else if (step === 'details') {
      setIsProcessingVoice(true);
      try {
        const extracted = await geminiService.extractUserProfile(transcript);
        
        if (extracted.name) setName(extracted.name);
        
        if (extracted.state) {
          const foundState = INDIAN_STATES.find(s => 
            s.toLowerCase() === extracted.state?.toLowerCase() || 
            extracted.state?.toLowerCase().includes(s.toLowerCase())
          );
          if (foundState) setUserState(foundState);
          else setUserState(extracted.state);
        }
      } finally {
        setIsProcessingVoice(false);
      }
    }
  };

  const isFormValid = name.trim().length > 0 && userState !== '' && phoneNumber.length === 10;

  // --- LANDING PAGE (SIMPLE ENGLISH & FLOATING ELEMENTS) ---
  if (step === 'welcome') {
    return (
      <div className="min-h-screen bg-[#FDFDFD] text-slate-900 selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden flex flex-col font-[Inter] relative">
        
        {/* Background Image Layer - SABJI MARKET */}
        <div className="absolute top-0 left-0 right-0 h-[100vh] z-0 overflow-hidden pointer-events-none">
           <img 
             src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop" 
             alt="Vegetable Market Background" 
             className="w-full h-full object-cover opacity-[0.08]"
           />
           {/* Downside Blending Fade - Fully Faded at Bottom */}
           <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-[#FDFDFD]/80 to-[#FDFDFD] via-70%"></div>
           
           {/* Floating Language Letters */}
           <div className="absolute inset-0 overflow-hidden">
             <span className="absolute top-[15%] left-[10%] text-6xl font-bold text-emerald-600/10 animate-float" style={{ animationDelay: '0s' }}>हिं</span>
             <span className="absolute top-[25%] right-[15%] text-5xl font-bold text-orange-600/10 animate-float" style={{ animationDelay: '1s' }}>த</span>
             <span className="absolute top-[45%] left-[20%] text-7xl font-bold text-teal-600/10 animate-float" style={{ animationDelay: '2s' }}>বা</span>
             <span className="absolute top-[60%] right-[25%] text-6xl font-bold text-emerald-600/10 animate-float" style={{ animationDelay: '3s' }}>తె</span>
             <span className="absolute top-[35%] right-[8%] text-5xl font-bold text-orange-600/10 animate-float" style={{ animationDelay: '1.5s' }}>ગુ</span>
             <span className="absolute top-[70%] left-[15%] text-6xl font-bold text-teal-600/10 animate-float" style={{ animationDelay: '2.5s' }}>ಕ</span>
             <span className="absolute top-[20%] left-[35%] text-5xl font-bold text-emerald-600/10 animate-float" style={{ animationDelay: '0.5s' }}>മ</span>
             <span className="absolute top-[55%] right-[35%] text-7xl font-bold text-orange-600/10 animate-float" style={{ animationDelay: '3.5s' }}>ਪੰ</span>
           </div>
        </div>

        {/* Navbar */}
        <nav className="w-full max-w-[1400px] mx-auto px-6 py-8 flex justify-between items-center z-50 relative">
           <div className="flex items-center gap-3 cursor-pointer">
              <span className="text-2xl">🌾</span>
              <span className="text-lg font-bold tracking-tight font-display text-slate-800">Mandi Mitra</span>
           </div>
           <div className="flex items-center gap-6">
              <button onClick={handleStart} className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors hidden sm:block">Login</button>
              <button 
                onClick={handleStart}
                className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-black hover:shadow-lg transition-all"
              >
                Start Trading
              </button>
           </div>
        </nav>

        {/* Main Hero */}
        <main className="flex-1 flex flex-col items-center justify-start px-4 pt-12 pb-20 text-center max-w-[1200px] mx-auto relative z-10 w-full">
           
           {/* Badge */}
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50/80 backdrop-blur-sm border border-emerald-100/50 text-emerald-700 text-[11px] font-semibold uppercase tracking-wider mb-8 animate-fade-in-up shadow-sm">
              Voice-First Marketplace
           </div>

           {/* Headline - Properly Aligned */}
           <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-bold tracking-tight text-slate-900 mb-6 leading-[1.2] animate-fade-in-up max-w-4xl mx-auto" style={{ animationDelay: '0.1s' }}>
             Your Voice, Your Price
             <br/>
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600">Your Market</span>
           </h1>

           {/* Subhead - Empowering Message */}
           <p className="text-base sm:text-lg text-slate-600 font-medium max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
             Empowering the Indian Farmer with Voice-First Technology
           </p>

           {/* CTA */}
           <div className="flex flex-col sm:flex-row gap-4 mb-24 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <button 
                onClick={handleStart}
                className="h-12 px-8 rounded-full bg-emerald-600 text-white font-medium text-base flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-200 hover:-translate-y-0.5"
              >
                <span>Try Mandi Mitra</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
           </div>

           {/* Hero Visual - With 2 Floating Elements */}
           <div className="relative w-full aspect-[16/9] sm:aspect-[2.2/1] bg-gradient-to-b from-white to-slate-50 rounded-[32px] sm:rounded-[48px] border border-slate-100 overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] animate-fade-in-up group mx-auto max-w-5xl" style={{ animationDelay: '0.4s' }}>
              
              {/* Background Accents */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-3/4 bg-emerald-50/50 rounded-full blur-[100px] pointer-events-none"></div>

              {/* FLOATING ELEMENT 1: Left Audio Wave */}
              <div className="absolute top-1/4 left-[5%] sm:left-[10%] bg-white p-4 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 animate-float" style={{ animationDelay: '1s' }}>
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-lg">🗣️</div>
                    <div>
                       <div className="flex gap-0.5 h-4 items-center">
                          {[0.4, 0.7, 1, 0.6, 0.4, 0.8, 0.5].map((h, i) => (
                             <div key={i} className="w-1 bg-orange-500 rounded-full animate-pulse" style={{ height: `${h * 100}%`, animationDelay: `${i * 0.1}s` }}></div>
                          ))}
                       </div>
                       <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Listening...</p>
                    </div>
                 </div>
              </div>

              {/* Central Floating Card Interface */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="relative bg-white w-[90%] sm:w-[480px] p-6 sm:p-8 rounded-[24px] shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col items-center gap-6 animate-float pointer-events-auto">
                    
                    {/* Top: User Input */}
                    <div className="w-full flex items-center gap-4">
                       <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-xl shrink-0">👨‍🌾</div>
                       <div className="bg-slate-50 rounded-2xl rounded-tl-sm px-4 py-3 flex-1">
                          <p className="text-slate-600 text-sm font-medium">"I want to sell 50 quintal onion"</p>
                       </div>
                    </div>

                    {/* Middle: Processing Line */}
                    <div className="w-px h-6 bg-slate-200 relative">
                       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-xs shadow-sm z-10">
                         ⚡
                       </div>
                    </div>

                    {/* Bottom: Result */}
                    <div className="w-full flex items-center gap-4">
                       <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-sm font-bold shadow-md shrink-0">AI</div>
                       <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl rounded-bl-sm px-4 py-3 flex-1">
                          <p className="text-slate-900 text-sm font-semibold mb-1">Market Price Found</p>
                          <div className="flex justify-between items-end">
                             <div>
                                <p className="text-2xl font-display font-bold text-slate-900">₹1,250<span className="text-sm font-normal text-slate-500 ml-1">/q</span></p>
                             </div>
                             <div className="text-[10px] font-bold bg-white px-2 py-1 rounded text-emerald-700 shadow-sm border border-emerald-100/50">
                                Best Rate
                             </div>
                          </div>
                       </div>
                    </div>

                 </div>
              </div>

              {/* FLOATING ELEMENT 2: Right Success Check */}
              <div className="absolute bottom-1/4 right-[5%] sm:right-[10%] bg-white p-4 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 animate-float" style={{ animationDelay: '2s' }}>
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-lg text-green-600">✓</div>
                    <div>
                       <p className="text-sm font-bold text-slate-900">Deal Done!</p>
                       <p className="text-[10px] font-medium text-slate-400">Payment Secured</p>
                    </div>
                 </div>
              </div>

           </div>

        </main>

        {/* Minimal Footer Ticker */}
        <div className="border-t border-slate-100 bg-white/50 backdrop-blur-sm z-10 relative">
           <LiveMarketTicker language={language} />
        </div>

      </div>
    );
  }

  // --- EXISTING CARD UI FOR OTHER STEPS (PRESERVED) ---
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Background Blobs - Softer colors */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-100/30 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-100/30 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="relative z-10 w-full max-w-[480px]">
        <div className="bg-white rounded-[40px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.06)] p-8 sm:p-12 transition-all duration-500 ease-out min-h-[640px] flex flex-col justify-between border border-slate-100">
          
          {step === 'language' && (
            <div className="flex flex-col h-full animate-fade-in-up">
              {/* Back Button */}
              <button 
                onClick={handleBack}
                className="absolute top-4 left-4 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all group"
              >
                <svg className="w-5 h-5 text-slate-600 group-hover:text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <h2 className="text-3xl font-display font-bold text-slate-900 mb-2 text-center tracking-tight">Select Language</h2>
              <p className="text-slate-500 text-center mb-10 font-medium">Choose your preferred language</p>
              
              <div className="grid grid-cols-2 gap-4 overflow-y-auto max-h-[400px] pr-1 pb-4 scrollbar-hide">
                {Object.values(SUPPORTED_LANGUAGES).map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageSelect(lang.code)}
                    className="p-6 rounded-[28px] bg-slate-50 hover:bg-emerald-50/50 border border-slate-100 hover:border-emerald-200 transition-all text-center group active:scale-95"
                  >
                    <span className="text-xl font-bold block mb-1 text-slate-800 font-display group-hover:text-emerald-900">{lang.nativeName}</span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 group-hover:text-emerald-600">{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'role' && (
            <div className="flex flex-col h-full justify-center space-y-5 animate-fade-in-up">
              {/* Back Button */}
              <button 
                onClick={handleBack}
                className="absolute top-4 left-4 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all group"
              >
                <svg className="w-5 h-5 text-slate-600 group-hover:text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="text-center mb-8">
                <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Who are you?</h2>
                <p className="text-slate-500 font-medium mt-2">{getLabel('rolePrompt', language)}</p>
              </div>
              
              <button
                onClick={() => handleRoleSelect(UserRole.SELLER)}
                className="w-full p-8 rounded-[32px] bg-emerald-50/50 hover:bg-emerald-50 transition-all flex items-center gap-6 group active:scale-[0.98] border border-emerald-100/50 hover:border-emerald-200"
              >
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm text-emerald-600 shrink-0">👨‍🌾</div>
                <div className="text-left">
                  <h3 className="text-xl font-bold text-slate-900 font-display group-hover:text-emerald-900">{getLabel('roleFarmer', language)}</h3>
                  <p className="text-slate-500 font-medium text-sm mt-1">{getLabel('roleFarmerDesc', language)}</p>
                </div>
              </button>

              <button
                onClick={() => handleRoleSelect(UserRole.BUYER)}
                className="w-full p-8 rounded-[32px] bg-orange-50/50 hover:bg-orange-50 transition-all flex items-center gap-6 group active:scale-[0.98] border border-orange-100/50 hover:border-orange-200"
              >
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm text-orange-600 shrink-0">🛒</div>
                <div className="text-left">
                  <h3 className="text-xl font-bold text-slate-900 font-display group-hover:text-orange-900">{getLabel('roleBuyer', language)}</h3>
                  <p className="text-slate-500 font-medium text-sm mt-1">{getLabel('roleBuyerDesc', language)}</p>
                </div>
              </button>
            </div>
          )}

          {step === 'details' && (
            <div className="flex flex-col h-full space-y-6 animate-fade-in-up pt-4">
              {/* Back Button */}
              <button 
                onClick={handleBack}
                className="absolute top-4 left-4 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all group"
              >
                <svg className="w-5 h-5 text-slate-600 group-hover:text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="text-center mb-2">
                 <h2 className="text-3xl font-display font-bold text-slate-900 mb-2 tracking-tight">{getLabel('detailsTitle', language)}</h2>
                 <p className="text-slate-500 font-medium text-sm">{getLabel('detailsSubtitle', language)}</p>
              </div>
              
              <div className="space-y-4 overflow-y-auto pb-4 max-h-[400px] scrollbar-hide pr-1">
                {/* Name Input */}
                <div className="bg-slate-50 rounded-[24px] px-6 py-5 border border-slate-100 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-50 transition-all">
                   <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{getLabel('labelName', language)}</label>
                   <input
                    type="text"
                    value={name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full bg-transparent border-none outline-none text-lg font-semibold p-0 focus:ring-0 text-slate-900 placeholder-slate-300"
                  />
                </div>

                {/* State Dropdown */}
                <div className="bg-slate-50 rounded-[24px] px-6 py-5 border border-slate-100 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-50 transition-all">
                   <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{getLabel('labelState', language)}</label>
                   <select
                    value={userState}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setUserState(e.target.value)}
                    className="w-full bg-transparent border-none outline-none text-lg font-semibold p-0 focus:ring-0 text-slate-900 cursor-pointer"
                   >
                     <option value="" disabled>Select State</option>
                     {INDIAN_STATES.map(s => (
                       <option key={s} value={s}>{s}</option>
                     ))}
                   </select>
                </div>

                {/* Phone Input */}
                <div className="bg-slate-50 rounded-[24px] px-6 py-5 border border-slate-100 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-50 transition-all">
                   <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{getLabel('labelPhone', language)}</label>
                   <div className="flex items-center">
                     <span className="font-semibold text-slate-400 text-lg mr-2">+91</span>
                     <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="00000 00000"
                      className="flex-1 bg-transparent border-none outline-none text-lg font-semibold p-0 focus:ring-0 text-slate-900 placeholder-slate-300 tracking-wider"
                    />
                   </div>
                </div>
              </div>

              <div className="mt-auto relative">
                {isProcessingVoice && (
                   <div className="absolute -top-10 left-0 right-0 text-center text-xs font-bold text-emerald-600 animate-pulse">
                      ✨ AI is processing your voice...
                   </div>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={!isFormValid || isProcessingVoice}
                  className="w-full bg-slate-900 text-white text-lg font-semibold py-5 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black transition-all active:scale-[0.98] shadow-lg shadow-slate-200"
                >
                  {getLabel('submitButton', language)}
                </button>
              </div>
            </div>
          )}

          {/* Floating Voice Button for Form Steps */}
          <div className="flex justify-center pt-6 relative z-10">
            <VoiceIndicator 
               state={step === 'details' && isProcessingVoice ? { ...voiceState, isProcessing: true } : voiceState} 
               onClick={handleVoiceInteraction} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};