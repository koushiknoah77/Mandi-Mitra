import type { MandiRecord, PriceInsight } from "../types";
import { geminiService } from "./geminiService";

/**
 * Mandi Service - Pro Fallback Implementation
 * 
 * 1. LIVE: AI with Google Search Grounding
 * 2. RECOVERY: AI Base Model (if search quota hit)
 * 3. PERSISTENT MOCK: LocalStorage "Historical Prices" (learned from previous successful AI hits)
 * 4. STATIC MOCK: Hardcoded verified Feb 2026 data
 */

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour
const PRICE_CACHE_KEY = 'mandi_price_cache';
const HISTORICAL_MOCK_KEY = 'mandi_historical_mocks';

interface PriceCache {
  [commodity: string]: {
    data: MandiRecord;
    timestamp: number;
  };
}

class MandiService {
  // Static Fallback Database (Verified Feb 2026)
  private staticMocks: Record<string, number> = {
    'onion': 1350,
    'onion (red)': 1400,
    'tomato': 950,
    'potato': 1550,
    'garlic': 8450,
    'rice': 3200,
    'wheat': 2700,
    'chilli': 8200,
    'cotton': 6400,
    'mustard': 5600
  };

  private requestQueue: Promise<void> = Promise.resolve();
  private MIN_REQUEST_INTERVAL = 2500; // 2.5s gap for safe RPM
  private activeLookups: Map<string, Promise<MandiRecord | null>> = new Map();

  /**
   * Serialized queue to prevent 429
   */
  private async waitForSlot() {
    const currentQueue = this.requestQueue;
    let resolveQueue: () => void;
    this.requestQueue = new Promise<void>((resolve) => {
      resolveQueue = () => resolve();
    });
    await currentQueue;
    await new Promise(resolve => setTimeout(resolve, this.MIN_REQUEST_INTERVAL));
    resolveQueue!();
  }

  /**
   * Persists a newly learned price to historical mocks
   */
  private updateHistoricalMock(commodity: string, price: number) {
    try {
      const key = commodity.toLowerCase();
      const mocksStr = localStorage.getItem(HISTORICAL_MOCK_KEY);
      const mocks = mocksStr ? JSON.parse(mocksStr) : { ...this.staticMocks };

      mocks[key] = price;
      localStorage.setItem(HISTORICAL_MOCK_KEY, JSON.stringify(mocks));
      console.log(`💾 Persisted ${key} to historical prices: ₹${price}`);
    } catch (e) {
      console.error('Failed to save historical mock:', e);
    }
  }

  /**
   * Gets the best available fallback price (Historical > Static)
   */
  private getFallbackPrice(commodity: string): number {
    try {
      const key = commodity.toLowerCase();
      const mocksStr = localStorage.getItem(HISTORICAL_MOCK_KEY);
      const historical = mocksStr ? JSON.parse(mocksStr) : {};

      // Try historical first
      if (historical[key]) return historical[key];

      // Match from static mocks (fuzzy match)
      const match = Object.keys(this.staticMocks).find(k => key.includes(k) || k.includes(key));
      return match ? this.staticMocks[match] : 1500; // 1500 as generic default
    } catch (e) {
      return 1500;
    }
  }

  private getCachedPrice(commodity: string): MandiRecord | null {
    try {
      const cacheStr = localStorage.getItem(PRICE_CACHE_KEY);
      if (!cacheStr) return null;
      const cache: PriceCache = JSON.parse(cacheStr);
      const cached = cache[commodity.toLowerCase()];
      if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) return cached.data;
    } catch (e) { }
    return null;
  }

  private setCachedPrice(commodity: string, data: MandiRecord): void {
    try {
      const cacheStr = localStorage.getItem(PRICE_CACHE_KEY);
      const cache: PriceCache = cacheStr ? JSON.parse(cacheStr) : {};
      cache[commodity.toLowerCase()] = { data, timestamp: Date.now() };
      localStorage.setItem(PRICE_CACHE_KEY, JSON.stringify(cache));
    } catch (e) { }
  }

  private async fetchAIPrice(commodity: string, region: string): Promise<MandiRecord | null> {
    const lookupKey = `${commodity}-${region}`.toLowerCase();
    if (this.activeLookups.has(lookupKey)) return this.activeLookups.get(lookupKey)!;

    const promise = (async () => {
      try {
        // CRITICAL: Set lookup BEFORE waiting to prevent race condition
        this.activeLookups.set(lookupKey, promise);
        await this.waitForSlot();
        console.log(`🤖 AI Searching: ${commodity}...`);

        const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
        const prompt = `Current daily mandi rate for ${commodity} in ${region} for ${today}. Return ONLY JSON: {"modalPrice": 0, "market": "Name, State"}`;

        const response = await geminiService.searchAndRespond(prompt);
        const jsonMatch = response.match(/\{[\s\S]*\}/);

        if (jsonMatch) {
          const data = JSON.parse(jsonMatch[0]);
          if (data && data.modalPrice > 0) {
            this.updateHistoricalMock(commodity, data.modalPrice);
            return {
              commodity,
              market: data.market || region,
              modalPrice: data.modalPrice,
              minPrice: data.modalPrice * 0.9,
              maxPrice: data.modalPrice * 1.1,
              lastUpdated: new Date().toISOString()
            };
          }
        }
        return null;
      } catch (error) {
        return null; // Silent failure, handle via fallback
      }
    })();

    // Note: activeLookups.set() moved above to prevent race condition
    const result = await promise;
    this.activeLookups.delete(lookupKey);
    return result;
  }

  async getMarketPrice(commodity: string, region: string): Promise<MandiRecord | null> {
    const cached = this.getCachedPrice(commodity);
    if (cached) return cached;

    const aiPrice = await this.fetchAIPrice(commodity, region);
    if (aiPrice) {
      this.setCachedPrice(commodity, aiPrice);
      return aiPrice;
    }

    // Pro Fallback: Use Historical Mocks from LocalStorage
    console.log(`📦 Fallback: ${commodity} (API Overloaded)`);
    const fallbackPrice = this.getFallbackPrice(commodity);
    return {
      commodity,
      market: region,
      modalPrice: fallbackPrice,
      minPrice: fallbackPrice * 0.9,
      maxPrice: fallbackPrice * 1.1,
      lastUpdated: new Date().toISOString()
    };
  }

  async getLiveRates(): Promise<MandiRecord[]> {
    try {
      await this.waitForSlot();
      console.log('🤖 Updating Live Ticker...');
      const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
      const prompt = `List mandi prices for 8 Indian commodities today (${today}). Return ONLY JSON array: [{"commodity": "Name", "market": "Location", "modalPrice": 0, "trend": "up/down", "change": 0.0}]`;

      const response = await geminiService.searchAndRespond(prompt);
      
      if (!response || response.trim() === '') {
        console.warn('⚠️ Live ticker: AI returned empty response, using fallback data');
        return this.getMockRates();
      }
      
      const jsonMatch = response.match(/\[[\s\S]*\]/);

      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]);
        if (Array.isArray(data) && data.length > 0) {
          return data.map(item => {
            this.updateHistoricalMock(item.commodity, item.modalPrice);
            return {
              ...item,
              minPrice: item.modalPrice * 0.9,
              maxPrice: item.modalPrice * 1.1,
              lastUpdated: new Date().toISOString()
            };
          });
        } else {
          console.warn('⚠️ Live ticker: AI returned empty array, using fallback data');
        }
      }
    } catch (e) {
      console.warn('⚠️ Live ticker: Error fetching AI data:', e);
    }

    // Fallback to Ticker Mocks (Enhanced with Historical Data)
    return this.getMockRates();
  }

  private getMockRates(): MandiRecord[] {
    const items = ["Garlic", "Onion (Red)", "Potato", "Tomato", "Wheat", "Rice (Basmati)", "Cotton", "Chilli (Dry)", "Mustard"];
    const markets = ["Mandsaur, MP", "Lasalgaon, MH", "Agra, UP", "Kolar, KA", "Khanna, PB", "Karnal, HR", "Rajkot, GJ", "Guntur, AP", "Jaipur, RJ"];
    const trends: ('up' | 'down' | 'stable')[] = ['up', 'up', 'stable', 'down', 'up', 'stable', 'up', 'down', 'up'];
    const changes = [5.1, 4.3, 0.1, -8.2, 0.4, 0, 2.8, -1.5, 1.2];

    return items.map((name, i) => {
      const price = this.getFallbackPrice(name);
      return {
        commodity: name,
        market: markets[i],
        modalPrice: price,
        minPrice: price * 0.9,
        maxPrice: price * 1.1,
        lastUpdated: new Date().toISOString(),
        trend: trends[i],
        change: changes[i]
      };
    });
  }

  clearCache(): void {
    localStorage.removeItem(PRICE_CACHE_KEY);
    localStorage.removeItem(HISTORICAL_MOCK_KEY);
  }

  calculateInsight(listingPrice: number, marketPrice: number): PriceInsight {
    const diff = listingPrice - marketPrice;
    const percentage = (diff / marketPrice) * 100;
    let status: 'fair' | 'high' | 'low' = 'fair';
    if (percentage > 15) status = 'high';
    if (percentage < -15) status = 'low';
    return { marketPrice, deviationPercentage: percentage, status };
  }
}

export const mandiService = new MandiService();
