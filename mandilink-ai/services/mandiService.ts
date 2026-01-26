import { MandiRecord, PriceInsight } from "../types";

class MandiService {
  // Mock Database of current market prices (per unit, e.g., Quintal)
  private mockDatabase: Record<string, number> = {
    'onion': 1200,
    'onion (red)': 1250,
    'tomato': 1500,
    'potato': 900,
    'rice': 3200,
    'rice (ponni)': 3600,
    'wheat': 2100,
    'chilli': 8000,
    'cotton': 6000
  };

  /**
   * Fetches the current market price for a commodity in a region
   */
  async getMarketPrice(commodity: string, region: string): Promise<MandiRecord | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const key = commodity.toLowerCase();
    // Simple partial match
    const match = Object.keys(this.mockDatabase).find(k => key.includes(k) || k.includes(key));
    
    if (match) {
      const price = this.mockDatabase[match];
      return {
        commodity: commodity,
        market: region,
        modalPrice: price,
        minPrice: price * 0.9,
        maxPrice: price * 1.1,
        lastUpdated: new Date().toISOString()
      };
    }
    
    return null;
  }

  /**
   * Returns a list of live mandi rates across India
   */
  async getLiveRates(): Promise<MandiRecord[]> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const data: MandiRecord[] = [
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

    return data;
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