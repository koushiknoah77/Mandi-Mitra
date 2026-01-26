import React, { useEffect, useState } from 'react';
import { Listing, PriceInsight } from '../types';
import { mandiService } from '../services/mandiService';

interface MandiPulseProps {
  listing: Listing;
  compact?: boolean;
}

export const MandiPulse: React.FC<MandiPulseProps> = ({ listing, compact = false }) => {
  const [insight, setInsight] = useState<PriceInsight | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsight = async () => {
      setLoading(true);
      const marketData = await mandiService.getMarketPrice(listing.produceName, listing.location);
      if (marketData) {
        const result = mandiService.calculateInsight(listing.pricePerUnit, marketData.modalPrice);
        setInsight(result);
      }
      setLoading(false);
    };

    fetchInsight();
  }, [listing.produceName, listing.location, listing.pricePerUnit]);

  if (loading) return <div className="text-xs text-gray-400 animate-pulse">Checking market rates...</div>;
  if (!insight) return null;

  const getColor = () => {
    if (insight.status === 'fair') return 'text-green-600 bg-green-50 border-green-200';
    if (insight.status === 'high') return 'text-red-600 bg-red-50 border-red-200';
    return 'text-blue-600 bg-blue-50 border-blue-200'; // Low price is good for buyer, maybe alert for seller
  };

  const getLabel = () => {
    if (insight.status === 'fair') return 'Fair Market Price';
    if (insight.status === 'high') return `${Math.round(insight.deviationPercentage)}% Above Market`;
    return `${Math.abs(Math.round(insight.deviationPercentage))}% Below Market`;
  };

  if (compact) {
    return (
      <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-block ${getColor()}`}>
        {getLabel()}
      </div>
    );
  }

  return (
    <div className={`p-3 rounded-lg border ${getColor()} flex items-center gap-3`}>
      <div className="text-2xl">
        {insight.status === 'fair' ? '⚖️' : insight.status === 'high' ? '📈' : '📉'}
      </div>
      <div>
        <h4 className="font-bold text-sm">{getLabel()}</h4>
        <p className="text-xs opacity-80">
          Market Avg: ₹{insight.marketPrice}/{listing.unit}
        </p>
      </div>
    </div>
  );
};