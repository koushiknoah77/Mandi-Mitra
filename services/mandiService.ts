import type { MandiRecord, PriceInsight } from "../types";
import { geminiService } from "./geminiService";

/**
 * Mandi Service - Fetches live agricultural commodity prices using AI
 * 
 * Uses Gemini AI with Google Search to fetch real-time prices
 * Caches prices for 1 hour to avoid excessive API calls
 * Falls back to mock data if AI fetch fails
 * 
 * No extra API keys needed - uses existing Gemini API key!
 */

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds
const PRICE_CACHE_KEY = 'mandi_price_cache';

interface PriceCache {
  [commodity: string]: {
    data: MandiRecord;
    timestamp: number;
  };
}

class MandiService {
  // Mock Database - fallback when AI fails
  private mockDatabase: Record<string, number> = {
    'onion': 1200,
    'onion (red)': 1250,
    'tomato': 1500,
    'potato': 900,
    'rice': 3200,
    'rice (ponni)': 3600,
    'wheat': 2100,
    'wheat (sharbati)': 2300,
    'chilli': 8000,
    'cotton': 6000,
    'soybean': 4800,
    'mustard': 5400
  };

  /**
   * Get cached price if available and not expired
   */
  private getCachedPrice(commodity: string): MandiRecord | null {
    try {
      const cacheStr = localStorage.getItem(PRICE_CACHE_KEY);
      if (!cacheStr) return null;

      const cache: PriceCache = JSON.parse(cacheStr);
      const key = commodity.toLowerCase();
      const cached = cache[key];

      if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
        console.log(`✅ Using cached price for ${commodity} (${Math.round((Date.now() - cached.timestamp) / 60000)} min old)`);
        return cached.data;
      }
    } catch (e) {
      console.error('Cache read error:', e);
    }
    return null;
  }

  /**
   * Save price to cache
   */
  private setCachedPrice(commodity: string, data: MandiRecord): void {
    try {
      const cacheStr = localStorage.getItem(PRICE_CACHE_KEY);
      const cache: PriceCache = cacheStr ? JSON.parse(cacheStr) : {};
      
      cache[commodity.toLowerCase()] = {
        data,
        timestamp: Date.now()
      };

      localStorage.setItem(PRICE_CACHE_KEY, JSON.stringify(cache));
    } catch (e) {
      console.error('Cache write error:', e);
    }
  }

  /**
   * Fetches live price using Gemini AI with Google Search
   */
  private async fetchAIPrice(commodity: string, region: string): Promise<MandiRecord | null> {
    try {
      console.log(`🤖 Fetching AI price for ${commodity} in ${region}...`);

      const prompt = `Search Google for the current wholesale market price (mandi price) of ${commodity} in ${region}, India.

Find the most recent price information from reliable sources like:
- AGMARKNET (agmarknet.gov.in)
- Government agriculture portals
- Major agricultural market websites
- Recent news articles about mandi prices

Return ONLY a JSON object with this exact format (no markdown, no explanation):
{
  "commodity": "${commodity}",
  "market": "Market Name, State",
  "modalPrice": 0,
  "minPrice": 0,
  "maxPrice": 0,
  "lastUpdated": "YYYY-MM-DD",
  "source": "Source name"
}

Prices should be in Rupees per quintal (100 kg).
If you cannot find reliable current data, return null.`;

      const response = await geminiService.searchAndRespond(prompt);
      
      // Try to parse JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]);
        
        // Validate the data
        if (data && data.modalPrice && data.modalPrice > 0) {
          const priceData: MandiRecord = {
            commodity: data.commodity || commodity,
            market: data.market || region,
            modalPrice: data.modalPrice,
            minPrice: data.minPrice || data.modalPrice * 0.9,
            maxPrice: data.maxPrice || data.modalPrice * 1.1,
            lastUpdated: data.lastUpdated || new Date().toISOString()
          };

          console.log(`✅ AI fetched price: ₹${priceData.modalPrice} from ${data.source || 'web search'}`);
          return priceData;
        }
      }

      console.warn('⚠️ AI could not find reliable price data');
      return null;
    } catch (error) {
      console.error('❌ AI price fetch error:', error);
      return null;
    }
  }

  /**
   * Fetches the current market price for a commodity in a region
   * Uses AI with caching, falls back to mock data
   */
  async getMarketPrice(commodity: string, region: string): Promise<MandiRecord | null> {
    // Check cache first
    const cached = this.getCachedPrice(commodity);
    if (cached) {
      return cached;
    }

    // Try AI fetch
    const aiPrice = await this.fetchAIPrice(commodity, region);
    if (aiPrice) {
      this.setCachedPrice(commodity, aiPrice);
      return aiPrice;
    }

    // Fallback to mock data
    console.log(`📦 Using mock price for ${commodity}`);
    const key = commodity.toLowerCase();
    const match = Object.keys(this.mockDatabase).find(k => key.includes(k) || k.includes(key));
    
    if (match) {
      const price = this.mockDatabase[match];
      const mockData: MandiRecord = {
        commodity: commodity,
        market: region,
        modalPrice: price,
        minPrice: price * 0.9,
        maxPrice: price * 1.1,
        lastUpdated: new Date().toISOString()
      };
      
      // Cache mock data too (for 1 hour)
      this.setCachedPrice(commodity, mockData);
      return mockData;
    }
    
    return null;
  }

  /**
   * Returns a list of live mandi rates across India
   * Uses AI to fetch multiple commodity prices
   */
  async getLiveRates(): Promise<MandiRecord[]> {
    try {
      console.log('🤖 Fetching live rates using AI...');

      const prompt = `Search Google for the current wholesale market prices (mandi prices) of major agricultural commodities in India today.

Find prices for these commodities from reliable sources:
- Onion, Potato, Tomato
- Wheat, Rice
- Cotton, Soybean, Mustard
- Chilli

Return ONLY a JSON array with this exact format (no markdown, no explanation):
[
  {
    "commodity": "Commodity Name",
    "market": "Market, State",
    "modalPrice": 0,
    "minPrice": 0,
    "maxPrice": 0,
    "trend": "up/down/stable",
    "change": 0
  }
]

Prices in Rupees per quintal. Include at least 8-10 commodities.`;

      const response = await geminiService.searchAndRespond(prompt);
      
      // Try to parse JSON array from response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]);
        
        if (Array.isArray(data) && data.length > 0) {
          const rates: MandiRecord[] = data.map(item => ({
            commodity: item.commodity,
            market: item.market,
            modalPrice: item.modalPrice,
            minPrice: item.minPrice || item.modalPrice * 0.9,
            maxPrice: item.maxPrice || item.modalPrice * 1.1,
            lastUpdated: new Date().toISOString(),
            trend: item.trend || 'stable',
            change: item.change || 0
          }));

          console.log(`✅ AI fetched ${rates.length} live rates`);
          return rates;
        }
      }

      console.warn('⚠️ AI could not fetch live rates, using mock data');
    } catch (error) {
      console.error('❌ AI live rates error:', error);
    }

    // Fallback to mock data
    return this.getMockRates();
  }

  /**
   * Returns mock rates as fallback
   */
  private getMockRates(): MandiRecord[] {
    return [
      { commodity: "Onion (Red)", market: "Lasalgaon, MH", modalPrice: 1250, minPrice: 1100, maxPrice: 1400, lastUpdated: new Date().toISOString(), trend: 'up', change: 2.5 },
      { commodity: "Potato", market: "Agra, UP", modalPrice: 900, minPrice: 850, maxPrice: 950, lastUpdated: new Date().toISOString(), trend: 'stable', change: 0.1 },
      { commodity: "Tomato", market: "Kolar, KA", modalPrice: 1500, minPrice: 1200, maxPrice: 1800, lastUpdated: new Date().toISOString(), trend: 'down', change: -5.2 },
      { commodity: "Wheat", market: "Khanna, PB", modalPrice: 2150, minPrice: 2100, maxPrice: 2200, lastUpdated: new Date().toISOString(), trend: 'up', change: 1.2 },
      { commodity: "Rice (Basmati)", market: "Karnal, HR", modalPrice: 3800, minPrice: 3600, maxPrice: 4000, lastUpdated: new Date().toISOString(), trend: 'stable', change: 0 },
      { commodity: "Cotton", market: "Rajkot, GJ", modalPrice: 6200, minPrice: 6000, maxPrice: 6500, lastUpdated: new Date().toISOString(), trend: 'up', change: 3.8 },
      { commodity: "Chilli (Dry)", market: "Guntur, AP", modalPrice: 8500, minPrice: 8000, maxPrice: 9000, lastUpdated: new Date().toISOString(), trend: 'down', change: -1.5 },
      { commodity: "Mustard", market: "Jaipur, RJ", modalPrice: 5400, minPrice: 5300, maxPrice: 5500, lastUpdated: new Date().toISOString(), trend: 'up', change: 0.8 },
      { commodity: "Soybean", market: "Indore, MP", modalPrice: 4800, minPrice: 4600, maxPrice: 5000, lastUpdated: new Date().toISOString(), trend: 'down', change: -2.1 },
    ];
  }

  /**
   * Clear price cache (useful for testing or forcing refresh)
   */
  clearCache(): void {
    localStorage.removeItem(PRICE_CACHE_KEY);
    console.log('🗑️ Price cache cleared');
  }

  /**
   * Calculates deviation of listing price from market price
   */
  calculateInsight(listingPrice: number, marketPrice: number): PriceInsight {
    const diff = listingPrice - marketPrice;
    const percentage = (diff / marketPrice) * 100;
    
    let status: 'fair' | 'high' | 'low' = 'fair';
    if (percentage > 15) status = 'high';
    if (percentage < -15) status = 'low';

    return {
      marketPrice,
      deviationPercentage: percentage,
      status
    };
  }
}

export const mandiService = new MandiService();
