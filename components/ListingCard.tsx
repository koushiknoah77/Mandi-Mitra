import React, { useState } from 'react';
import { Listing, SupportedLanguageCode } from '../types';
import { getLabel } from '../utils/translations';
import { MandiPulse } from './MandiPulse';
import { ImageGallery } from './ImageGallery';
import { shareUtils } from '../utils/shareUtils';

interface ListingCardProps {
  listing: Listing;
  language: SupportedLanguageCode;
  distance?: string;
  isFavorite?: boolean;
  onNegotiate: (listing: Listing) => void;
  onToggleFavorite?: (listingId: string) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ 
  listing, 
  language, 
  distance, 
  isFavorite = false,
  onNegotiate,
  onToggleFavorite
}) => {
  const [isSharing, setIsSharing] = useState(false);
  const displayImages = listing.images || (listing.imageUrl ? [listing.imageUrl] : []);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSharing(true);
    try {
      await shareUtils.shareListing(listing);
    } catch (error) {
      console.error('Share failed:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(listing.id);
  };

  return (
    <div className="group bg-white rounded-[32px] overflow-hidden shadow-[0_10px_30px_-10px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_-12px_rgba(5,150,105,0.1)] transition-all duration-300 flex flex-col h-full border border-slate-100 hover:border-emerald-200 hover:-translate-y-1">
      {/* Image Area - Aspect Ratio 4:3 */}
      <div className="aspect-[4/3] relative bg-slate-50 overflow-hidden">
        <ImageGallery images={displayImages} alt={listing.produceName} />
        
        {/* Badges & Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
           <div className="bg-white/95 backdrop-blur-md text-slate-900 text-[10px] font-black px-3 py-1.5 rounded-full shadow-sm uppercase tracking-widest border border-white/20">
             {listing.quality}
           </div>
        </div>
        
        {/* Action Buttons */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          {onToggleFavorite && (
            <button
              onClick={handleFavorite}
              className="w-10 h-10 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform active:scale-95 border border-white/20"
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <svg 
                className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-slate-600'}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          )}
          <button
            onClick={handleShare}
            disabled={isSharing}
            className="w-10 h-10 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform active:scale-95 border border-white/20 disabled:opacity-50"
            title="Share listing"
          >
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>
        
        {distance && (
          <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm border border-white/10">
            <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            {distance}
          </div>
        )}
      </div>
      
      {/* Content Area */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-emerald-700 transition-colors line-clamp-1">
            {listing.produceName}
          </h3>
        </div>
        <div className="mb-5">
             <MandiPulse listing={listing} compact={true} />
        </div>
        
        <p className="text-sm text-slate-500 font-medium mb-6 flex items-center gap-1.5">
           <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
           {listing.location}
        </p>

        <div className="mt-auto space-y-4">
          <div className="flex items-end justify-between bg-slate-50 p-4 rounded-[20px] border border-slate-100">
            <div>
               <p className="text-2xl font-black text-slate-900 tracking-tight">₹{listing.pricePerUnit}</p>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{getLabel('per', language)} {listing.unit}</p>
            </div>
            <div className="text-right">
               <p className="text-lg font-bold text-slate-600">{listing.quantity}</p>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{listing.unit} {getLabel('avail', language)}</p>
            </div>
          </div>

          {/* Action Button - Solid Color */}
          <button 
            onClick={() => onNegotiate(listing)}
            className="w-full bg-emerald-600 text-white hover:bg-emerald-700 font-bold py-4 rounded-[24px] transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-[0.98]"
          >
            <span>{getLabel('buyNow', language)}</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.013 8.013 0 01-5.45-2.125L3 19l2-5c-1.8-1.35-3-3.8-3-6.5 0-5.523 4.477-10 10-10s10 4.477 10 10z" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};