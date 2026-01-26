import React, { useEffect, useState } from 'react';
import { mandiService } from '../services/mandiService';
import { MandiRecord, SupportedLanguageCode } from '../types';
import { getLabel } from '../utils/translations';

interface LiveMarketTickerProps {
  language: SupportedLanguageCode;
}

export const LiveMarketTicker: React.FC<LiveMarketTickerProps> = ({ language }) => {
  const [rates, setRates] = useState<MandiRecord[]>([]);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const data = await mandiService.getLiveRates();
        setRates(data);
      } catch (e) {
        console.error("Failed to load market rates", e);
      }
    };
    fetchRates();
  }, []);

  if (rates.length === 0) return null;

  // We duplicate the array to create a seamless infinite loop
  const displayRates = [...rates, ...rates];

  return (
    <div className="mt-16 mb-8 animate-fade-in-up w-full">
      <div className="flex items-center justify-between mb-6 px-2">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">{getLabel('liveRates', language)}</h3>
        </div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{getLabel('indiaRealtime', language)}</span>
      </div>

      <div className="relative w-full overflow-hidden group">
        {/* Left Fade Gradient */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#fdfdf5] via-[#fdfdf5]/80 to-transparent z-10 pointer-events-none"></div>
        
        {/* Right Fade Gradient */}
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#fdfdf5] via-[#fdfdf5]/80 to-transparent z-10 pointer-events-none"></div>

        {/* Scrolling Track */}
        <div 
          className="flex gap-4 w-max hover:[animation-play-state:paused]"
          style={{ animation: 'marquee 60s linear infinite' }}
        >
          {displayRates.map((rate, index) => (
            <div 
              key={`${rate.commodity}-${index}`}
              className="min-w-[200px] bg-white rounded-[24px] p-5 shadow-sm border border-slate-100 hover:border-emerald-200 transition-colors flex flex-col justify-between h-32"
            >
              <div>
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-slate-900 text-lg leading-none">{rate.commodity.split(' ')[0]}</h4>
                  <div className={`text-[10px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
                    rate.trend === 'up' ? 'bg-green-50 text-green-700' : 
                    rate.trend === 'down' ? 'bg-red-50 text-red-700' : 
                    'bg-slate-50 text-slate-500'
                  }`}>
                    {rate.trend === 'up' && '▲'}
                    {rate.trend === 'down' && '▼'}
                    {rate.trend === 'stable' && '—'}
                    {Math.abs(rate.change || 0)}%
                  </div>
                </div>
                <p className="text-xs font-semibold text-slate-400 truncate">{rate.market}</p>
              </div>

              <div>
                <span className="text-2xl font-black text-slate-900 tracking-tight">₹{rate.modalPrice}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase ml-1">/q</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inline Styles for Keyframes */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};