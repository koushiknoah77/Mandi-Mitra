import React from 'react';
import type { SupportedLanguageCode } from '../types';
import { UserRole } from '../types';
import { useAnalytics } from '../hooks/useAnalytics';
import { useListings } from '../contexts/ListingsContext';
import { getLabel } from '../utils/translations';

interface AnalyticsDashboardProps {
  userId: string;
  userRole: UserRole;
  language: SupportedLanguageCode;
  onClose: () => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  userId,
  userRole,
  language,
  onClose
}) => {
  const { transactions, listings } = useListings();
  const analytics = useAnalytics(transactions, listings, userId, userRole);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white w-full max-w-6xl max-h-[90vh] rounded-[32px] shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-6 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-black text-white mb-1">📊 Analytics Dashboard</h2>
            <p className="text-emerald-100 text-sm">
              {userRole === UserRole.SELLER ? 'Sales' : 'Purchase'} Statistics
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-[24px] border border-blue-200">
              <div className="text-blue-600 text-3xl mb-2">📈</div>
              <div className="text-3xl font-black text-blue-900 mb-1">
                {analytics.totalDeals}
              </div>
              <div className="text-sm font-bold text-blue-700">Total Deals</div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-[24px] border border-emerald-200">
              <div className="text-emerald-600 text-3xl mb-2">💰</div>
              <div className="text-3xl font-black text-emerald-900 mb-1">
                ₹{(analytics.totalRevenue / 1000).toFixed(1)}K
              </div>
              <div className="text-sm font-bold text-emerald-700">
                Total {userRole === UserRole.SELLER ? 'Revenue' : 'Spent'}
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-[24px] border border-orange-200">
              <div className="text-orange-600 text-3xl mb-2">📦</div>
              <div className="text-3xl font-black text-orange-900 mb-1">
                {analytics.totalQuantitySold}
              </div>
              <div className="text-sm font-bold text-orange-700">
                Total Quantity
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-[24px] border border-purple-200">
              <div className="text-purple-600 text-3xl mb-2">💵</div>
              <div className="text-3xl font-black text-purple-900 mb-1">
                ₹{(analytics.averageDealValue / 1000).toFixed(1)}K
              </div>
              <div className="text-sm font-bold text-purple-700">Avg Deal Value</div>
            </div>
          </div>

          {/* Top Commodities */}
          <div className="bg-white border border-slate-200 rounded-[24px] p-6">
            <h3 className="text-xl font-black text-slate-900 mb-4">
              🏆 Top Commodities
            </h3>
            {analytics.topCommodities.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No data yet</p>
            ) : (
              <div className="space-y-3">
                {analytics.topCommodities.map((commodity, index) => (
                  <div
                    key={commodity.name}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-black">
                        #{index + 1}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{commodity.name}</div>
                        <div className="text-sm text-slate-500">{commodity.count} deals</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-emerald-600">
                        ₹{(commodity.revenue / 1000).toFixed(1)}K
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity Chart */}
          <div className="bg-white border border-slate-200 rounded-[24px] p-6">
            <h3 className="text-xl font-black text-slate-900 mb-4">
              📅 Last 7 Days Activity
            </h3>
            <div className="space-y-2">
              {analytics.recentActivity.map((day) => {
                const maxRevenue = Math.max(...analytics.recentActivity.map(d => d.revenue));
                const barWidth = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0;
                
                return (
                  <div key={day.date} className="flex items-center gap-4">
                    <div className="w-24 text-sm font-bold text-slate-600">
                      {new Date(day.date).toLocaleDateString('en-IN', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="flex-1 bg-slate-100 rounded-full h-8 relative overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-3"
                        style={{ width: `${barWidth}%` }}
                      >
                        {day.revenue > 0 && (
                          <span className="text-xs font-bold text-white">
                            ₹{(day.revenue / 1000).toFixed(1)}K
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="w-16 text-sm font-bold text-slate-600 text-right">
                      {day.deals} deals
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Deal Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-[24px] p-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-black text-emerald-900">✅ Completed</h4>
                <span className="text-3xl font-black text-emerald-600">
                  {analytics.dealsByStatus.completed}
                </span>
              </div>
              <div className="text-sm text-emerald-700">Successfully closed deals</div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-[24px] p-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-black text-orange-900">⏳ Pending</h4>
                <span className="text-3xl font-black text-orange-600">
                  {analytics.dealsByStatus.pending}
                </span>
              </div>
              <div className="text-sm text-orange-700">Awaiting completion</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
