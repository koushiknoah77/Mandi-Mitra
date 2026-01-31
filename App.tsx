import React, { useState, useEffect } from 'react';
import { SUPPORTED_LANGUAGES } from './constants';
import type { UserProfile, SupportedLanguageCode, Deal, ConversationHistory } from './types';
import { OnboardingFlow } from './components/OnboardingFlow';
import { BuyerDashboard } from './components/BuyerDashboard';
import { SellerDashboard } from './components/SellerDashboard';
import { SupportChatbot } from './components/SupportChatbot';
import { ProfileHistory } from './components/ProfileHistory';
import { ListingsProvider } from './contexts/ListingsContext';
import { analyticsService } from './services/analyticsService';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { ErrorBoundary } from './components/ErrorBoundary';
import { getLabel } from './utils/translations';

const SESSION_KEY = 'mandi_user';
const SESSION_TIMESTAMP_KEY = 'mandi_session_ts';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showProfileHistory, setShowProfileHistory] = useState(false);
  const isOnline = useOnlineStatus();

  // Session Persistence & Expiration (Requirement 13)
  useEffect(() => {
    const savedUser = localStorage.getItem(SESSION_KEY);
    const savedTimestamp = localStorage.getItem(SESSION_TIMESTAMP_KEY);
    
    if (savedUser && savedTimestamp) {
      const now = Date.now();
      const sessionAge = now - parseInt(savedTimestamp, 10);

      if (sessionAge > SESSION_DURATION) {
        // Session expired
        localStorage.removeItem(SESSION_KEY);
        localStorage.removeItem(SESSION_TIMESTAMP_KEY);
        console.log("Session expired. Please log in again.");
      } else {
        // Restore session
        try {
          const parsed = JSON.parse(savedUser);
          setUser(parsed);
        } catch (e) {
          console.error("Failed to restore session", e);
          localStorage.removeItem(SESSION_KEY);
          localStorage.removeItem(SESSION_TIMESTAMP_KEY);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      if (!localStorage.getItem(SESSION_TIMESTAMP_KEY)) {
        localStorage.setItem(SESSION_TIMESTAMP_KEY, Date.now().toString());
      }
    } else {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(SESSION_TIMESTAMP_KEY);
    }
  }, [user]);

  const handleLanguageChange = (code: SupportedLanguageCode) => {
    if (user) {
      const updatedUser = { ...user, language: code };
      setUser(updatedUser);
      analyticsService.logEvent('language_change', user.id, { newLanguage: code });
    }
  };

  const handleLogin = (profile: UserProfile) => {
    setUser(profile);
    localStorage.setItem(SESSION_TIMESTAMP_KEY, Date.now().toString());
    analyticsService.logEvent('login', profile.id, { role: profile.role });
  };

  const handleLogout = () => {
    analyticsService.logEvent('logout', user?.id);
    setUser(null);
  };

  const currentLang = user?.language || 'en';

  const renderDashboard = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-emerald-50 text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Offline Indicator */}
      {!isOnline && (
        <div className="bg-rose-500 text-white text-center py-2 text-xs font-bold tracking-widest uppercase animate-pulse sticky top-0 z-[60] shadow-sm">
          {getLabel('offlineMode', currentLang)}
        </div>
      )}

      {/* Navbar - Clean Floating Pill */}
      <div className="sticky top-6 z-40 px-4 mb-8">
        <header className="max-w-6xl mx-auto bg-white/80 backdrop-blur-xl border border-white shadow-sm rounded-full px-3 py-2 flex justify-between items-center transition-all duration-300">
          <div className="flex items-center gap-3 pl-2">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-xl border border-emerald-100">
              🌾
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">
                Mandi Mitra
              </h1>
              <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-600">
                 {user?.role === 'seller' ? getLabel('farmerStudio', currentLang) : getLabel('marketplace', currentLang)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Chip */}
            <div className="relative group">
              <select 
                value={user?.language}
                onChange={(e) => handleLanguageChange(e.target.value as SupportedLanguageCode)}
                className="appearance-none bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-bold py-2.5 pl-4 pr-10 rounded-full focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all cursor-pointer border border-transparent"
              >
                {Object.values(SUPPORTED_LANGUAGES).map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nativeName}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>

            {/* Profile History Button */}
            <button 
              onClick={() => setShowProfileHistory(true)}
              className="hidden sm:flex items-center gap-2 text-sm font-bold text-slate-600 hover:bg-slate-100 px-5 py-2.5 rounded-full transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {getLabel('profileHistory', currentLang)}
            </button>

            {/* Logout Chip */}
            <button 
              onClick={handleLogout}
              className="hidden sm:block text-sm font-bold text-slate-500 hover:bg-rose-50 hover:text-rose-600 px-5 py-2.5 rounded-full transition-all"
            >
              {getLabel('logout', currentLang)}
            </button>
            
            {/* User Avatar - Click to open Profile */}
            <button 
              onClick={() => setShowProfileHistory(true)}
              className="w-11 h-11 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold shadow-sm ring-2 ring-white hover:ring-4 hover:ring-emerald-200 transition-all cursor-pointer"
              aria-label={getLabel('profileHistory', currentLang)}
            >
               {user?.phoneNumber.slice(-2)}
            </button>
          </div>
        </header>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pb-24 w-full">
        <ErrorBoundary>
          {user?.role === 'buyer' ? (
            <BuyerDashboard user={user} />
          ) : (
            user && <SellerDashboard user={user} />
          )}
        </ErrorBoundary>
      </main>

      {/* Support Bot */}
      <SupportChatbot language={currentLang} />

      {/* Profile History Modal */}
      {showProfileHistory && user && (
        <ProfileHistory
          user={user}
          onClose={() => setShowProfileHistory(false)}
        />
      )}
    </div>
  );

  return (
    <ErrorBoundary>
      <ListingsProvider>
        {user ? renderDashboard() : <OnboardingFlow onComplete={handleLogin} />}
      </ListingsProvider>
    </ErrorBoundary>
  );
}

export default App;