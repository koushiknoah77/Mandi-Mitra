import React, { useState } from 'react';
import { UserProfile, Deal, ConversationHistory, SupportedLanguageCode, UserRole } from '../types';
import { useListings } from '../contexts/ListingsContext';
import { getLabel } from '../utils/translations';
import { NegotiationView } from './NegotiationView';

interface ProfileHistoryProps {
  user: UserProfile;
  onClose: () => void;
}

export const ProfileHistory: React.FC<ProfileHistoryProps> = ({
  user,
  onClose
}) => {
  const { transactions, conversations } = useListings();
  const [activeTab, setActiveTab] = useState<'transactions' | 'conversations'>('transactions');
  const [selectedConversation, setSelectedConversation] = useState<ConversationHistory | null>(null);

  // Filter deals and conversations for the current user
  const userTransactions = transactions.filter(t => t.buyerId === user.id || t.sellerId === user.id);
  const userConversations = conversations.filter(c => c.participants.buyerId === user.id || c.participants.sellerId === user.id);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
        <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[32px] shadow-2xl flex flex-col overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold text-white border-2 border-white/30">
                {user.phoneNumber.slice(-2)}
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">{user.name}</h2>
                <p className="text-emerald-100 text-sm font-medium">{user.phoneNumber} • {user.state}</p>
              </div>
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

          {/* Tab Navigation */}
          <div className="flex border-b border-slate-200 bg-slate-50">
            <button
              onClick={() => setActiveTab('transactions')}
              className={`flex-1 py-4 px-6 font-bold text-sm transition-all relative ${activeTab === 'transactions'
                ? 'text-emerald-600'
                : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              {getLabel('transactionHistory', user.language)}
              {userTransactions.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-black">
                  {userTransactions.length}
                </span>
              )}
              {activeTab === 'transactions' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600 rounded-t-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('conversations')}
              className={`flex-1 py-4 px-6 font-bold text-sm transition-all relative ${activeTab === 'conversations'
                ? 'text-emerald-600'
                : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              {getLabel('conversationHistory', user.language)}
              {userConversations.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-black">
                  {userConversations.length}
                </span>
              )}
              {activeTab === 'conversations' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600 rounded-t-full" />
              )}
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'transactions' && (
              <div className="space-y-4">
                {userTransactions.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="w-20 h-20 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">{getLabel('noTransactions', user.language)}</h3>
                    <p className="text-slate-500 text-sm">
                      {user.role === UserRole.SELLER
                        ? getLabel('soldItems', user.language)
                        : getLabel('purchasedItems', user.language)
                      } will appear here
                    </p>
                  </div>
                ) : (
                  userTransactions.map((deal) => (
                    <div
                      key={deal.id}
                      className="bg-white border border-slate-200 rounded-[24px] p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-black text-slate-900 mb-1">
                            {deal.produceName || 'Product'}
                          </h3>
                          <p className="text-xs text-slate-500 font-medium">
                            {formatDate(deal.timestamp)} • {formatTime(deal.timestamp)}
                          </p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${deal.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-orange-100 text-orange-700'
                          }`}>
                          {deal.status === 'completed' ? '✓ Completed' : 'Pending'}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
                            {getLabel('quantity', user.language)}
                          </p>
                          <p className="text-sm font-bold text-slate-700">
                            {deal.finalQuantity} {deal.unit || 'units'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
                            {getLabel('price', user.language)}
                          </p>
                          <p className="text-sm font-bold text-emerald-600">
                            ₹{deal.finalPrice}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
                            {getLabel('total', user.language)}
                          </p>
                          <p className="text-sm font-bold text-slate-900">
                            ₹{deal.totalAmount}
                          </p>
                        </div>
                      </div>

                      {deal.invoiceUrl && (
                        <a
                          href={deal.invoiceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          {getLabel('viewInvoice', user.language)}
                        </a>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'conversations' && (
              <div className="space-y-4">
                {userConversations.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="w-20 h-20 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">{getLabel('noConversations', user.language)}</h3>
                    <p className="text-slate-500 text-sm">Your negotiation chats will appear here</p>
                  </div>
                ) : (
                  userConversations.map((conv) => (
                    <div
                      key={conv.id}
                      className="bg-white border border-slate-200 rounded-[24px] p-6 hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => setSelectedConversation(conv)}
                    >
                      <div className="flex items-start gap-4">
                        {conv.listing.images && conv.listing.images[0] ? (
                          <img
                            src={conv.listing.images[0]}
                            alt={conv.listing.produceName}
                            className="w-16 h-16 rounded-2xl object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center shrink-0">
                            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="text-lg font-black text-slate-900 truncate">
                                {conv.listing.produceName}
                              </h3>
                              <p className="text-sm text-slate-600">
                                {user.role === UserRole.SELLER
                                  ? conv.participants.buyerName
                                  : conv.participants.sellerName
                                }
                              </p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ml-2 ${conv.dealStatus === 'completed'
                              ? 'bg-emerald-100 text-emerald-700'
                              : conv.dealStatus === 'cancelled'
                                ? 'bg-slate-100 text-slate-600'
                                : 'bg-orange-100 text-orange-700'
                              }`}>
                              {conv.dealStatus === 'completed' ? '✓ Closed' :
                                conv.dealStatus === 'cancelled' ? 'Cancelled' : 'Active'}
                            </div>
                          </div>

                          <p className="text-sm text-slate-500 mb-3 line-clamp-2">
                            {conv.messages[conv.messages.length - 1]?.text || 'No messages'}
                          </p>

                          <div className="flex items-center justify-between">
                            <p className="text-xs text-slate-400 font-medium">
                              {formatDate(conv.lastMessageAt)} • {formatTime(conv.lastMessageAt)}
                            </p>
                            <button className="text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
                              {getLabel('continueChat', user.language)} →
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reopen Conversation */}
      {selectedConversation && (
        <NegotiationView
          listing={selectedConversation.listing}
          userLanguage={user.language}
          userRole={user.role!}
          user={user}
          onClose={() => setSelectedConversation(null)}
          existingConversation={selectedConversation}
        />
      )}
    </>
  );
};
