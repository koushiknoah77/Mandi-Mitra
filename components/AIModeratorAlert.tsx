import React, { useState } from 'react';
import { ModerationResult } from '../types';

interface AIModeratorAlertProps {
  result: ModerationResult;
  onDismiss: () => void;
}

export const AIModeratorAlert: React.FC<AIModeratorAlertProps> = ({ result, onDismiss }) => {
  const [visible, setVisible] = useState(true);

  if (!visible || (!result.flagged && !result.advisory)) return null;

  const isSevere = result.reason === 'Inappropriate language';

  const handleDismiss = () => {
    setVisible(false);
    onDismiss();
  };

  return (
    <div className={`mx-4 mb-4 rounded-lg border p-4 flex gap-3 animate-fade-in-up ${
      isSevere ? 'bg-red-50 border-red-200 text-red-800' : 'bg-yellow-50 border-yellow-200 text-yellow-800'
    }`}>
      <div className="text-2xl">
        {isSevere ? '⚠️' : '🛡️'}
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-sm">AI Moderator Alert</h4>
        <p className="text-xs mt-1">
          {result.advisory || result.reason}
        </p>
        {result.priceDeviationPct !== undefined && result.priceDeviationPct > 15 && (
          <p className="text-xs font-semibold mt-1">
            Price deviation: {Math.round(result.priceDeviationPct)}%
          </p>
        )}
      </div>
      <button onClick={handleDismiss} className="text-lg opacity-60 hover:opacity-100 px-2">
        ×
      </button>
    </div>
  );
};