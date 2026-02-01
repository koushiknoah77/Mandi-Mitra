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
      <div className="flex items-center justify-between mb-8 px-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping absolute inset-0"></div>
            <div className="w-3 h-3 rounded-full bg-rose-600 relative z-10"></div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">{getLabel('liveRates', language)}</h3>
        </div>
        <div className="bg-slate-100/80 px-4 py-1.5 rounded-full backdrop-blur-sm border border-slate-200/50">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{getLabel('indiaRealtime', language)}</span>
        </div>
      </div>

      <div className="relative w-full overflow-hidden group">
        {/* Left Fade Gradient */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#FDFDFD] via-[#FDFDFD]/90 to-transparent z-10 pointer-events-none"></div>

        {/* Right Fade Gradient */}
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#FDFDFD] via-[#FDFDFD]/90 to-transparent z-10 pointer-events-none"></div>

        {/* Scrolling Track */}
        <div
          className="flex gap-4 w-max hover:[animation-play-state:paused]"
          style={{ animation: 'marquee 60s linear infinite' }}
        >
          {displayRates.map((rate, index) => (
            <div
              key={`${rate.commodity}-${index}`}
              className="min-w-[240px] bg-white rounded-[28px] p-5 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.03)] border border-slate-100/80 hover:border-emerald-200 transition-all duration-300 flex flex-col justify-between h-36 group/card"
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-2 flex-nowrap">
                  <h4 className="font-extrabold text-slate-800 text-[13px] leading-tight group-hover/card:text-emerald-700 transition-colors truncate flex-1">{rate.commodity}</h4>
                  <div className={`text-[10px] font-black px-2 py-1 rounded-full flex items-center gap-1 shadow-sm shrink-0 whitespace-nowrap ${rate.trend === 'up' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                      rate.trend === 'down' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                        'bg-slate-50 text-slate-500 border border-slate-100'
                    }`}>
                    {rate.trend === 'up' && (
                      <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4l-8 8h16l-8-8z" /></svg>
                    )}
                    {rate.trend === 'down' && (
                      <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 20l8-8H4l8 8z" /></svg>
                    )}
                    {rate.trend === 'stable' && <span className="w-2 h-0.5 bg-current rounded-full"></span>}
                    <span>{Math.abs(rate.change || 0).toFixed(1)}%</span>
                  </div>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate mb-4">{rate.market || 'India'}</p>
              </div>

              <div className="flex items-baseline gap-1.5 flex-nowrap">
                <span className="text-xl font-black text-slate-900 tracking-tighter whitespace-nowrap">₹{rate.modalPrice}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">{getLabel('per', language)} q</span>
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