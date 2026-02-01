import React, { useState } from 'react';
import type { UserProfile, ListingData, Listing } from '../types';
import { UserRole } from '../types';
import { geminiService } from '../services/geminiService';
import { cloudinaryService } from '../services/cloudinaryService';
import { analyticsService } from '../services/analyticsService';
import { useListings } from '../contexts/ListingsContext';
import { VoiceIndicator } from './VoiceIndicator';
import { NegotiationView } from './NegotiationView';
import { ProfileHistory } from './ProfileHistory';
import { LiveMarketTicker } from './LiveMarketTicker';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { ErrorBoundary } from './ErrorBoundary';
import { getLabel } from '../utils/translations';
import { extractListingFallback, getExtractionErrorMessage } from '../utils/fallbackListingExtraction';
import { useVoiceCommands, useRegisterVoiceCommands, VoiceCommand } from '../contexts/VoiceCommandContext';


interface SellerDashboardProps {
  user: UserProfile;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({ user }) => {
  const [listingText, setListingText] = useState("");
  const [extractedData, setExtractedData] = useState<ListingData | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionError, setExtractionError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'create' | 'my-listings'>('create');
  const [showProfileHistory, setShowProfileHistory] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [activeNegotiationListing, setActiveNegotiationListing] = useState<Listing | null>(null);

  // Use shared listings from context
  const { listings, addListing, removeListing } = useListings();

  // Filter to show only this seller's listings
  const myListings = listings.filter(l => l.sellerId === user.id);

  const handleDeleteListing = (listingId: string) => {
    if (window.confirm(getLabel('confirmDelete', user.language))) {
      removeListing(listingId);
      analyticsService.logEvent('listing_deleted', user.id, { listingId });
    }
  };

  const handleExtract = async (text: string) => {
    if (!text.trim()) {
      setExtractionError(getLabel('emptyInput', user.language));
      return;
    }

    setIsExtracting(true);
    setExtractionError(null);

    try {
      // Try AI extraction first
      let data;
      try {
        data = await geminiService.extractListingData(text, user.language);
      } catch (aiError) {
        console.warn("AI extraction failed, using fallback:", aiError);
        // Use fallback extraction
        data = extractListingFallback(text, user.language);

        if (!data) {
          throw new Error("Fallback extraction also failed");
        }
      }

      setExtractedData(data);
      setExtractionError(null);
      analyticsService.logEvent('listing_extract_success', user.id);
    } catch (e: any) {
      console.error("Listing extraction error:", e);
      setExtractionError(getExtractionErrorMessage(user.language));
      analyticsService.logEvent('listing_extract_fail', user.id);
    } finally {
      setIsExtracting(false);
    }
  };

  const { startGlobalListen, voiceState: globalVoiceState, stopGlobalListen } = useVoiceCommands();

  const handleVoiceInput = async () => {
    if (globalVoiceState.isListening) {
      stopGlobalListen();
      return;
    }
    const transcript = await startGlobalListen();
    if (transcript) {
      setListingText(transcript);
      handleExtract(transcript);
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsUploading(true);
      try {
        const url = await cloudinaryService.uploadImage(file);
        setUploadedImages(prev => [...prev, url]);
        analyticsService.logEvent('image_upload_success', user.id);
      } catch (err) {
        console.error("Upload failed", err);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreate = () => {
    if (!extractedData) return;
    const newListing: Listing = {
      id: Date.now().toString(),
      sellerId: user.id,
      sellerName: user.name,
      location: user.location?.address || user.state,
      coordinates: user.location ? { lat: user.location.lat, lng: user.location.lng } : undefined,
      produceName: extractedData.produceName,
      quantity: extractedData.quantity,
      unit: extractedData.unit,
      pricePerUnit: extractedData.pricePerUnit,
      currency: extractedData.currency || 'INR',
      quality: extractedData.quality || 'Standard',
      description: extractedData.description || '',
      images: uploadedImages,
      imageUrl: uploadedImages[0] || '',
      createdAt: new Date().toISOString()
    };

    // Add to global listings context
    addListing(newListing);
    analyticsService.logEvent('listing_created', user.id, { produce: extractedData?.produceName });
    setExtractedData(null);
    setListingText("");
    setUploadedImages([]);
    setActiveTab('my-listings');
  };

  // Voice Commands Registry
  const voiceCommands = React.useMemo<VoiceCommand[]>(() => {
    const commands: VoiceCommand[] = [
      { id: 'tab-create', keywords: [getLabel('createListing', user.language), 'create', 'sell', 'new listing'], callback: () => setActiveTab('create'), description: 'Go to Create' },
      { id: 'tab-my-listings', keywords: [getLabel('myListings', user.language), 'my listings', 'listings', 'my produce'], callback: () => setActiveTab('my-listings'), description: 'Go to My Listings' },
      { id: 'open-analytics-seller', keywords: ['analytics', 'stats', 'how am I doing'], callback: () => setShowAnalytics(true), description: 'Open Analytics' },
      { id: 'open-profile-seller', keywords: [getLabel('profileHistory', user.language), 'profile', 'history', 'account'], callback: () => setShowProfileHistory(true), description: 'Open Profile' }
    ];

    if (activeTab === 'create' && extractedData) {
      commands.push(
        { id: 'confirm-publish', keywords: [getLabel('publishListing', user.language), 'publish', 'confirm', 'finish'], callback: handleCreate, description: 'Publish Listing' },
        { id: 'discard-listing', keywords: [getLabel('discard', user.language), 'discard', 'cancel', 'delete this'], callback: () => { setExtractedData(null); setUploadedImages([]); }, description: 'Discard Listing' }
      );
    }

    return commands;
  }, [user.language, activeTab, extractedData]);

  useRegisterVoiceCommands(voiceCommands);


  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto font-sans">
      {/* Modern Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
        <div className="bg-white p-1.5 rounded-full inline-flex relative shadow-sm border border-slate-200">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 z-10 flex items-center gap-2 ${activeTab === 'create'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-500 hover:text-slate-700'
              }`}
          >
            {activeTab === 'create' && <span className="text-emerald-400">●</span>}
            {getLabel('createListing', user.language)}
          </button>
          <button
            onClick={() => setActiveTab('my-listings')}
            className={`px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 z-10 flex items-center gap-2 ${activeTab === 'my-listings'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-500 hover:text-slate-700'
              }`}
          >
            {getLabel('myListings', user.language)}
            {myListings.length > 0 && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${activeTab === 'my-listings' ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
                {myListings.length}
              </span>
            )}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAnalytics(true)}
            className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-sm border border-slate-200 text-slate-500 hover:text-emerald-600 hover:border-emerald-200 transition-all active:scale-95"
            title="Analytics"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </button>
        </div>
      </div>

      {activeTab === 'create' && (
        <div className="space-y-10 animate-fade-in-up">
          {/* Hero Card - Solid Deep Emerald */}
          <div className="bg-[#064e3b] p-12 rounded-[48px] shadow-2xl shadow-emerald-900/20 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <h3 className="text-4xl font-black mb-4 relative z-10 tracking-tight text-white">{getLabel('sellInSeconds', user.language)}</h3>
            <p className="text-emerald-100 mb-10 relative z-10 max-w-lg mx-auto text-lg font-medium leading-relaxed">
              {getLabel('tapMic', user.language)} <br /><span className="text-white font-bold bg-white/10 px-3 py-1 rounded-xl inline-block mt-3 border border-white/20">{getLabel('voiceExample', user.language)}</span>
            </p>

            <div className="flex justify-center relative z-10">
              <div className="bg-white/10 p-4 rounded-full backdrop-blur-sm border border-white/20 group-hover:scale-105 transition-transform duration-300">
                <VoiceIndicator state={globalVoiceState} onClick={handleVoiceInput} />
              </div>
            </div>

            {globalVoiceState.isListening && <p className="mt-8 text-white font-bold animate-pulse tracking-widest text-xs uppercase bg-black/20 inline-block px-4 py-1 rounded-full">{getLabel('listening', user.language)}</p>}
          </div>

          <div className="flex items-center gap-6 text-slate-400 text-xs font-bold tracking-widest uppercase">
            <div className="h-px bg-slate-200 flex-1"></div>
            <span>{getLabel('orType', user.language)}</span>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>

          {/* Modern Input Area */}
          <div className="relative group">
            <div className="bg-white rounded-[32px] border-2 border-slate-100 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-50 transition-all shadow-sm hover:shadow-md">
              <textarea
                value={listingText}
                onChange={(e) => {
                  setListingText(e.target.value);
                  setExtractionError(null);
                }}
                placeholder={getLabel('placeholderListing', user.language)}
                rows={3}
                className="w-full p-8 bg-transparent border-none outline-none focus:ring-0 resize-none text-2xl text-slate-900 placeholder-slate-300 font-medium rounded-[32px]"
              />
            </div>
            <button
              onClick={() => handleExtract(listingText)}
              disabled={!listingText || isExtracting}
              className="absolute bottom-6 right-6 bg-slate-900 text-white p-4 rounded-2xl hover:bg-black transition-all disabled:opacity-50 shadow-lg active:scale-95"
            >
              {isExtracting ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              )}
            </button>
          </div>

          {/* Error Message */}
          {extractionError && (
            <div className="bg-red-50 border-2 border-red-200 rounded-[24px] p-6 animate-fade-in-up">
              <div className="flex items-start gap-4">
                <div className="bg-red-100 p-2 rounded-full shrink-0">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-red-900 mb-1">{getLabel('extractionError', user.language)}</h4>
                  <p className="text-red-700 text-sm">{extractionError}</p>
                  <p className="text-red-600 text-xs mt-2 font-medium">{getLabel('exampleFormat', user.language)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Review Card */}
          {extractedData && (
            <div className="bg-white rounded-[40px] shadow-xl shadow-slate-200 border border-slate-100 overflow-hidden animate-fade-in-up">
              <div className="bg-slate-50 p-8 border-b border-slate-100">
                <h3 className="font-black text-slate-900 text-2xl">{getLabel('confirmListing', user.language)}</h3>
              </div>
              <div className="p-8 sm:p-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 mb-12">
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2 block">{getLabel('produce', user.language)}</label>
                    <p className="font-black text-3xl sm:text-4xl text-slate-900 tracking-tight break-words">{extractedData.produceName}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2 block">{getLabel('askingPrice', user.language)}</label>
                    <p className="font-black text-3xl sm:text-4xl text-emerald-600 tracking-tight">₹{extractedData.pricePerUnit}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2 block">{getLabel('quantity', user.language)}</label>
                    <p className="font-bold text-xl sm:text-2xl text-slate-700">{extractedData.quantity} {extractedData.unit}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2 block">{getLabel('quality', user.language)}</label>
                    <div className="inline-block bg-orange-50 text-orange-700 text-sm font-bold px-5 py-2 rounded-full mt-1 border border-orange-100">
                      {extractedData.quality || getLabel('standard', user.language)}
                    </div>
                  </div>
                </div>

                <div className="mb-12">
                  <label className="block text-sm font-bold text-slate-900 mb-4">{getLabel('addPhotos', user.language)}</label>
                  <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {uploadedImages.map((url, idx) => (
                      <div key={idx} className="relative w-36 h-36 shrink-0 rounded-[24px] overflow-hidden shadow-lg group">
                        <img src={url} alt="produce" className="w-full h-full object-cover" />
                        <button
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                        >
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    ))}
                    <label className="w-36 h-36 shrink-0 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[24px] flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600 transition-all group">
                      {isUploading ? (
                        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <svg className="w-10 h-10 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                      )}
                      <input type="file" accept="image/*" onChange={handleImageSelect} disabled={isUploading} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="flex gap-6">
                  <button
                    onClick={() => { setExtractedData(null); setUploadedImages([]); }}
                    className="flex-1 py-5 text-slate-600 font-bold border-2 border-slate-200 rounded-full hover:bg-slate-50 transition-colors"
                  >
                    {getLabel('discard', user.language)}
                  </button>
                  <button
                    onClick={handleCreate}
                    className="flex-1 py-5 bg-emerald-600 text-white font-bold rounded-full shadow-lg hover:bg-emerald-700 transition-all active:scale-[0.98]"
                  >
                    {getLabel('publishListing', user.language)}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* My Listings Tab */}
      {activeTab === 'my-listings' && (
        <div className="space-y-6 animate-fade-in-up">
          {myListings.length === 0 ? (
            <div className="bg-white rounded-[40px] p-16 text-center shadow-lg">
              <div className="w-24 h-24 bg-slate-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3">{getLabel('noListings', user.language)}</h3>
              <p className="text-slate-500 mb-8">{getLabel('createFirstListing', user.language)}</p>
              <button
                onClick={() => setActiveTab('create')}
                className="px-8 py-4 bg-emerald-600 text-white font-bold rounded-full hover:bg-emerald-700 transition-all shadow-lg"
              >
                {getLabel('createListing', user.language)}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {myListings.map((listing) => (
                <div key={listing.id} className="bg-white rounded-[32px] shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="flex flex-col sm:flex-row">
                    {/* Image Section */}
                    {listing.images && listing.images.length > 0 ? (
                      <div className="sm:w-48 h-48 sm:h-auto shrink-0">
                        <img
                          src={listing.images[0]}
                          alt={listing.produceName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="sm:w-48 h-48 sm:h-auto shrink-0 bg-slate-100 flex items-center justify-center">
                        <svg className="w-16 h-16 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}

                    {/* Content Section */}
                    <div className="flex-1 p-6 sm:p-8">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-black text-slate-900 mb-1">{listing.produceName}</h3>
                          <p className="text-sm text-slate-500">{listing.location}</p>
                        </div>
                        <div className="bg-orange-50 text-orange-700 text-xs font-bold px-3 py-1 rounded-full border border-orange-100">
                          {listing.quality}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">{getLabel('quantity', user.language)}</p>
                          <p className="text-lg font-bold text-slate-700">{listing.quantity} {listing.unit}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">{getLabel('price', user.language)}</p>
                          <p className="text-lg font-bold text-emerald-600">₹{listing.pricePerUnit}/{listing.unit}</p>
                        </div>
                      </div>

                      {listing.description && (
                        <p className="text-sm text-slate-600 mb-4">{listing.description}</p>
                      )}

                      <div className="flex gap-3">
                        <button
                          onClick={() => setActiveNegotiationListing(listing)}
                          className="flex-1 py-3 bg-slate-900 text-white font-bold rounded-full hover:bg-black transition-all"
                        >
                          {getLabel('viewOffers', user.language)}
                        </button>
                        <button
                          onClick={() => handleDeleteListing(listing.id)}
                          className="px-6 py-3 border-2 border-red-200 text-red-600 font-bold rounded-full hover:bg-red-50 transition-all"
                          title={getLabel('deleteListing', user.language)}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Live Market Rates Section */}
      <LiveMarketTicker language={user.language} />

      {activeNegotiationListing && (
        <ErrorBoundary>
          <NegotiationView
            listing={activeNegotiationListing}
            userLanguage={user.language}
            userRole={UserRole.SELLER}
            user={user}
            onClose={() => setActiveNegotiationListing(null)}
          />
        </ErrorBoundary>
      )}

      {/* Profile History Modal */}
      {showProfileHistory && (
        <ProfileHistory
          user={user}
          onClose={() => setShowProfileHistory(false)}
        />
      )}

      {/* Analytics Dashboard Modal */}
      {showAnalytics && (
        <AnalyticsDashboard
          userId={user.id}
          userRole={UserRole.SELLER}
          language={user.language}
          onClose={() => setShowAnalytics(false)}
        />
      )}
    </div>
  );
};