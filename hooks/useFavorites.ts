import { useState, useEffect } from 'react';
import type { Listing } from '../types';

const FAVORITES_KEY = 'mandi_favorites';

export const useFavorites = (userId: string) => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    const stored = localStorage.getItem(`${FAVORITES_KEY}_${userId}`);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(`${FAVORITES_KEY}_${userId}`, JSON.stringify(favorites));
  }, [favorites, userId]);

  const addFavorite = (listingId: string) => {
    setFavorites(prev => {
      if (prev.includes(listingId)) return prev;
      return [...prev, listingId];
    });
  };

  const removeFavorite = (listingId: string) => {
    setFavorites(prev => prev.filter(id => id !== listingId));
  };

  const toggleFavorite = (listingId: string) => {
    if (favorites.includes(listingId)) {
      removeFavorite(listingId);
    } else {
      addFavorite(listingId);
    }
  };

  const isFavorite = (listingId: string) => favorites.includes(listingId);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    favoritesCount: favorites.length
  };
};
