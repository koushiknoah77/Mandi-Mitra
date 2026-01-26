import React from 'react';
import { VoiceState } from '../types';

interface VoiceIndicatorProps {
  state: VoiceState;
  onClick: () => void;
}

export const VoiceIndicator: React.FC<VoiceIndicatorProps> = ({ state, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={`relative flex items-center justify-center w-20 h-20 rounded-full shadow-lg transition-all duration-300 ${
        state.isListening 
          ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
          : state.isSpeaking 
            ? 'bg-blue-500 hover:bg-blue-600'
            : state.isProcessing
              ? 'bg-yellow-500'
              : 'bg-green-600 hover:bg-green-700'
      }`}
    >
      {/* Ripple effects */}
      {state.isListening && (
        <>
          <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping"></span>
          <span className="absolute inline-flex h-24 w-24 rounded-full bg-red-400 opacity-30"></span>
        </>
      )}

      {/* Icon */}
      <div className="z-10 text-white">
        {state.isProcessing ? (
           <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
           </svg>
        ) : state.isListening ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 1.5a6 6 0 00-6 6v1.5a6 6 0 006 6 6 6 0 006-6v-1.5a6 6 0 00-6-6z" />
          </svg>
        ) : state.isSpeaking ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
             <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 1.5a6 6 0 00-6 6v1.5a6 6 0 006 6 6 6 0 006-6v-1.5a6 6 0 00-6-6z" />
          </svg>
        )}
      </div>
      
      <span className="absolute -bottom-10 text-xs font-medium text-gray-500 whitespace-nowrap">
        {state.isListening ? "Listening..." : state.isSpeaking ? "Speaking..." : "Tap to Speak"}
      </span>
    </button>
  );
};