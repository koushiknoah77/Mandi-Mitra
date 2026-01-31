import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Listing, Deal, ConversationHistory } from '../types';
import { MOCK_LISTINGS } from '../data/mockData';

interface ListingsContextType {
  listings: Listing[];
  addListing: (listing: Listing) => void;
  removeListing: (listingId: string) => void;
  updateListing: (listingId: string, updates: Partial<Listing>) => void;
  
  // Transaction & Conversation History
  transactions: Deal[];
  addTransaction: (transaction: Deal) => void;
  
  conversations: ConversationHistory[];
  addConversation: (conversation: ConversationHistory) => void;
  updateConversation: (conversationId: string, updates: Partial<ConversationHistory>) => void;
}

const ListingsContext = createContext<ListingsContextType | undefined>(undefined);

const STORAGE_KEY = 'mandi_listings';
const TRANSACTIONS_KEY = 'mandi_transactions';
const CONVERSATIONS_KEY = 'mandi_conversations';

export const ListingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with mock data + any stored listings
  const [listings, setListings] = useState<Listing[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const userListings = JSON.parse(stored);
        // Combine mock listings with user-created listings
        return [...MOCK_LISTINGS, ...userListings];
      } catch (e) {
        console.error('Failed to parse stored listings', e);
        return MOCK_LISTINGS;
      }
    }
    return MOCK_LISTINGS;
  });

  const [transactions, setTransactions] = useState<Deal[]>(() => {
    const stored = localStorage.getItem(TRANSACTIONS_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse stored transactions', e);
        return [];
      }
    }
    return [];
  });

  const [conversations, setConversations] = useState<ConversationHistory[]>(() => {
    const stored = localStorage.getItem(CONVERSATIONS_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse stored conversations', e);
        return [];
      }
    }
    return [];
  });

  // Persist user-created listings (exclude mock listings)
  useEffect(() => {
    const userListings = listings.filter(l => !MOCK_LISTINGS.find(m => m.id === l.id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userListings));
  }, [listings]);

  // Persist transactions
  useEffect(() => {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  }, [transactions]);

  // Persist conversations
  useEffect(() => {
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
  }, [conversations]);

  const addListing = (listing: Listing) => {
    setListings(prev => [listing, ...prev]);
  };

  const removeListing = (listingId: string) => {
    setListings(prev => prev.filter(l => l.id !== listingId));
  };

  const updateListing = (listingId: string, updates: Partial<Listing>) => {
    setListings(prev => prev.map(l => l.id === listingId ? { ...l, ...updates } : l));
  };

  const addTransaction = (transaction: Deal) => {
    setTransactions(prev => [transaction, ...prev]);
  };

  const addConversation = (conversation: ConversationHistory) => {
    setConversations(prev => [conversation, ...prev]);
  };

  const updateConversation = (conversationId: string, updates: Partial<ConversationHistory>) => {
    setConversations(prev => prev.map(c => c.id === conversationId ? { ...c, ...updates } : c));
  };

  return (
    <ListingsContext.Provider value={{
      listings,
      addListing,
      removeListing,
      updateListing,
      transactions,
      addTransaction,
      conversations,
      addConversation,
      updateConversation
    }}>
      {children}
    </ListingsContext.Provider>
  );
};

export const useListings = () => {
  const context = useContext(ListingsContext);
  if (!context) {
    throw new Error('useListings must be used within ListingsProvider');
  }
  return context;
};
