import { useState, useEffect, useMemo } from 'react';
import { Deal, Listing, UserRole } from '../types';

export interface AnalyticsData {
  totalDeals: number;
  totalRevenue: number;
  totalQuantitySold: number;
  averageDealValue: number;
  topCommodities: Array<{ name: string; count: number; revenue: number }>;
  recentActivity: Array<{ date: string; deals: number; revenue: number }>;
  dealsByStatus: { completed: number; pending: number };
}

export const useAnalytics = (
  transactions: Deal[],
  listings: Listing[],
  userId: string,
  userRole: UserRole
) => {
  const analytics = useMemo<AnalyticsData>(() => {
    // Filter transactions for current user
    const userTransactions = transactions.filter(t => 
      userRole === UserRole.SELLER ? t.sellerId === userId : t.buyerId === userId
    );

    // Total deals
    const totalDeals = userTransactions.length;

    // Total revenue
    const totalRevenue = userTransactions.reduce((sum, t) => sum + t.totalAmount, 0);

    // Total quantity sold/bought
    const totalQuantitySold = userTransactions.reduce((sum, t) => sum + t.finalQuantity, 0);

    // Average deal value
    const averageDealValue = totalDeals > 0 ? totalRevenue / totalDeals : 0;

    // Top commodities
    const commodityMap = new Map<string, { count: number; revenue: number }>();
    userTransactions.forEach(t => {
      const name = t.produceName || 'Unknown';
      const existing = commodityMap.get(name) || { count: 0, revenue: 0 };
      commodityMap.set(name, {
        count: existing.count + 1,
        revenue: existing.revenue + t.totalAmount
      });
    });
    const topCommodities = Array.from(commodityMap.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Recent activity (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const recentActivity = last7Days.map(date => {
      const dayTransactions = userTransactions.filter(t => {
        const tDate = new Date(t.timestamp).toISOString().split('T')[0];
        return tDate === date;
      });
      return {
        date,
        deals: dayTransactions.length,
        revenue: dayTransactions.reduce((sum, t) => sum + t.totalAmount, 0)
      };
    });

    // Deals by status
    const dealsByStatus = {
      completed: userTransactions.filter(t => t.status === 'completed').length,
      pending: userTransactions.filter(t => t.status === 'pending').length
    };

    return {
      totalDeals,
      totalRevenue,
      totalQuantitySold,
      averageDealValue,
      topCommodities,
      recentActivity,
      dealsByStatus
    };
  }, [transactions, userId, userRole]);

  return analytics;
};
