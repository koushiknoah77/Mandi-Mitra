import React, { useState, useMemo } from 'react';
import { UserProfile, Listing, UserRole } from '../types';
import { MOCK_LISTINGS } from '../data/mockData';
import { ListingCard } from './ListingCard';
import { NegotiationView } from './NegotiationView';
import { getLabel } from '../utils/translations';
import { calculateDistance, formatDistance } from '../utils/location';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';
import { VoiceIndicator } from './VoiceIndicator';
import { LiveMarketTicker } from './LiveMarketTicker';

interface BuyerDashboardProps {
  user: UserProfile;
}

const CATEGORY_KEYS = ['All', 'Rice', 'Wheat', 'Onion', 'Spices'];

export const BuyerDashboard: React.FC<BuyerDashboardProps> = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeNegotiation, setActiveNegotiation] = useState<Listing | null>(null);
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'distance' | 'price' | 'recent'>('distance');

  const { state: voiceState, listen, cancel } = useVoiceAssistant(user.language);

  const userLat = user.location?.lat || 20.5937;
  const userLng = user.location?.lng || 78.9629;

  const processedListings = useMemo(() => {
    let results = MOCK_LISTINGS.filter(l => 
      (l.produceName.toLowerCase().includes(searchTerm.toLowerCase()) || 
       l.location.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterCategory === 'All' || l.produceName.toLowerCase().includes(filterCategory.toLowerCase().slice(0, -1)))
    );

    const withDistance = results.map(l => {
      let dist = 0;
      if (l.coordinates) {
        dist = calculateDistance(userLat, userLng, l.coordinates.lat, l.coordinates.lng);
      }
      return { ...l, distanceKm: dist };
    });

    return withDistance.sort((a, b) => {
      if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
      if (sortBy === 'price') return a.pricePerUnit - b.pricePerUnit;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [searchTerm, filterCategory, sortBy, userLat, userLng]);

  const handleVoiceSearch = async () => {
    if (voiceState.isListening) {
      cancel();
      return;
    }
    const transcript = await listen();
    if (transcript) {
      setSearchTerm(transcript);
    }
  };

  return (
    <div className="space-y-12">
      {/* Hero Search Area */}
      <div className="flex flex-col items-center justify-center pt-12 pb-4">
        <h2 className="text-4xl md:text-6xl font-black text-slate-900 text-center mb-10 tracking-tighter leading-tight">
          {getLabel('heroTitle', user.language)}
        </h2>
        
        <div className="relative w-full max-w-3xl">
          {/* Clean Search Bar */}
          <div className="relative flex items-center bg-white rounded-full shadow-lg shadow-slate-200/50 hover:shadow-xl transition-all duration-300 h-20 border border-slate-200 group focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-50">
            <div className="pl-8 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input 
              type="text" 
              placeholder={getLabel('searchPlaceholder', user.language)}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-full px-6 bg-transparent border-none outline-none focus:ring-0 text-xl placeholder-slate-300 text-slate-900 font-bold tracking-tight"
            />
            <div className="pr-4">
               <div className="scale-90 hover:scale-100 transition-transform">
                 <VoiceIndicator state={voiceState} onClick={handleVoiceSearch} />
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 sticky top-28 z-30 py-4 bg-white/80 backdrop-blur-xl -mx-4 px-4 border-y border-white/50 shadow-sm">
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide w-full md:w-auto items-center px-2">
          {CATEGORY_KEYS.map((catKey) => (
            <button 
              key={catKey} 
              onClick={() => setFilterCategory(catKey)}
              className={`px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap border active:scale-95 ${
                filterCategory === catKey 
                  ? 'bg-slate-900 text-white border-slate-900' 
                  : 'bg-white text-slate-500 border-slate-200 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              {getLabel(`cat${catKey}`, user.language)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-full shadow-sm border border-slate-200 hover:border-emerald-300 transition-colors">
          <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">{getLabel('sort', user.language)}</span>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-transparent text-sm font-bold text-slate-900 outline-none border-none focus:ring-0 cursor-pointer p-0 tracking-tight"
          >
            <option value="distance">{getLabel('sortNearest', user.language)}</option>
            <option value="price">{getLabel('sortPriceLowHigh', user.language)}</option>
            <option value="recent">{getLabel('sortRecent', user.language)}</option>
          </select>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-2">
        {processedListings.map(listing => (
          <ListingCard 
            key={listing.id} 
            listing={listing} 
            language={user.language}
            distance={listing.distanceKm > 0 ? formatDistance(listing.distanceKm) : undefined}
            onNegotiate={setActiveNegotiation} 
          />
        ))}
      </div>

      {processedListings.length === 0 && (
         <div className="text-center py-40 bg-white rounded-[40px] border border-dashed border-slate-300">
           <div className="inline-block p-8 rounded-full bg-slate-50 mb-6 text-5xl">
             🧐
           </div>
           <h3 className="text-2xl font-black text-slate-900 tracking-tight">{getLabel('noResults', user.language)}</h3>
           <p className="text-slate-500 mt-2 font-medium">{getLabel('noResultsDesc', user.language)}</p>
         </div>
      )}

      {/* Live Market Rates Section */}
      <LiveMarketTicker language={user.language} />

      {/* Negotiation Modal */}
      {activeNegotiation && (
        <NegotiationView 
          listing={activeNegotiation} 
          userLanguage={user.language}
          userRole={UserRole.BUYER}
          onClose={() => setActiveNegotiation(null)} 
        />
      )}
    </div>
  );
};