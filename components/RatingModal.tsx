import React, { useState } from 'react';
import type { Deal, SupportedLanguageCode } from '../types';
import { useRatings } from '../hooks/useRatings';
import { getLabel } from '../utils/translations';

interface RatingModalProps {
  deal: Deal;
  currentUserId: string;
  otherUserId: string;
  otherUserName: string;
  language: SupportedLanguageCode;
  onClose: () => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  deal,
  currentUserId,
  otherUserId,
  otherUserName,
  language,
  onClose
}) => {
  const { addRating } = useRatings();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    
    setIsSubmitting(true);
    try {
      addRating({
        dealId: deal.id,
        raterId: currentUserId,
        ratedUserId: otherUserId,
        rating,
        review: review.trim() || undefined
      });
      
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      console.error('Failed to submit rating:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-[28px] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-6 text-center">
          <h2 className="text-2xl font-black text-white mb-2">Rate Your Experience</h2>
          <p className="text-emerald-100 text-sm">How was your deal with {otherUserName}?</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Star Rating */}
          <div className="text-center">
            <div className="flex justify-center gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110 active:scale-95"
                >
                  <svg
                    className={`w-12 h-12 ${
                      star <= (hoveredRating || rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-slate-300'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </button>
              ))}
            </div>
            <p className="text-sm font-bold text-slate-600">
              {rating === 0 && 'Tap to rate'}
              {rating === 1 && '😞 Poor'}
              {rating === 2 && '😐 Fair'}
              {rating === 3 && '🙂 Good'}
              {rating === 4 && '😊 Very Good'}
              {rating === 5 && '🤩 Excellent'}
            </p>
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Share your experience (optional)
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="What went well? Any suggestions?"
              className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
              rows={4}
              maxLength={500}
            />
            <p className="text-xs text-slate-400 mt-1 text-right">
              {review.length}/500
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-4 text-slate-600 font-bold bg-slate-100 rounded-full hover:bg-slate-200 transition-colors disabled:opacity-50"
            >
              Skip
            </button>
            <button
              onClick={handleSubmit}
              disabled={rating === 0 || isSubmitting}
              className="flex-1 py-4 bg-emerald-600 text-white font-bold rounded-full hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Rating'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
