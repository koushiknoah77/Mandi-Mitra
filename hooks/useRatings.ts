import { useState, useEffect } from 'react';

export interface Rating {
  id: string;
  dealId: string;
  raterId: string;
  ratedUserId: string;
  rating: number; // 1-5
  review?: string;
  timestamp: number;
}

const RATINGS_KEY = 'mandi_ratings';

export const useRatings = () => {
  const [ratings, setRatings] = useState<Rating[]>(() => {
    const stored = localStorage.getItem(RATINGS_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(RATINGS_KEY, JSON.stringify(ratings));
  }, [ratings]);

  const addRating = (rating: Omit<Rating, 'id' | 'timestamp'>) => {
    const newRating: Rating = {
      ...rating,
      id: `RATING-${Date.now()}`,
      timestamp: Date.now()
    };
    setRatings(prev => [...prev, newRating]);
    return newRating;
  };

  const getUserRatings = (userId: string) => {
    return ratings.filter(r => r.ratedUserId === userId);
  };

  const getAverageRating = (userId: string) => {
    const userRatings = getUserRatings(userId);
    if (userRatings.length === 0) return 0;
    const sum = userRatings.reduce((acc, r) => acc + r.rating, 0);
    return sum / userRatings.length;
  };

  const hasRatedDeal = (dealId: string, raterId: string) => {
    return ratings.some(r => r.dealId === dealId && r.raterId === raterId);
  };

  return {
    ratings,
    addRating,
    getUserRatings,
    getAverageRating,
    hasRatedDeal
  };
};
