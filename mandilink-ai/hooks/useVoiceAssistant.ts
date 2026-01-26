import { useState, useCallback, useEffect, useRef } from 'react';
import { SupportedLanguageCode, VoiceState } from '../types';
import { SPEECH_LANG_MAP } from '../constants';

export const useVoiceAssistant = (language: SupportedLanguageCode) => {
  const [state, setState] = useState<VoiceState>({
    isSpeaking: false,
    isListening: false,
    isProcessing: false,
    lastTranscript: ''
  });
  
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition and Load Voices
  useEffect(() => {
    // Recognition Setup
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.maxAlternatives = 1;
    }

    // Voice Loading
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setAvailableVoices(voices);
      }
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Ensure we start fresh/silent
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  // Text to Speech (TTS) using Browser API
  const speak = useCallback((text: string, forceLanguage?: SupportedLanguageCode) => {
    if (!('speechSynthesis' in window)) {
      console.warn("Text-to-speech not supported in this browser.");
      return;
    }

    // Cancel any ongoing speech to switch instantly
    window.speechSynthesis.cancel();

    const targetLang = forceLanguage || language;
    const langCode = SPEECH_LANG_MAP[targetLang] || 'en-US';
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    utterance.rate = 1.0; 
    utterance.pitch = 1.0;

    // Explicitly find and set the best matching voice
    if (availableVoices.length > 0) {
      // 1. Exact match (e.g., 'hi-IN')
      let selectedVoice = availableVoices.find(v => v.lang === langCode);
      
      // 2. Base language match (e.g., 'hi')
      if (!selectedVoice) {
         const baseLang = langCode.split('-')[0];
         selectedVoice = availableVoices.find(v => v.lang.startsWith(baseLang));
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }

    utterance.onstart = () => {
      setState(prev => ({ ...prev, isSpeaking: true, isProcessing: false }));
    };

    utterance.onend = () => {
      setState(prev => ({ ...prev, isSpeaking: false }));
    };

    utterance.onerror = (e) => {
      console.error("TTS Error", e);
      setState(prev => ({ ...prev, isSpeaking: false }));
    };

    window.speechSynthesis.speak(utterance);
    
  }, [language, availableVoices]);

  // Speech to Text (STT) using Browser API
  const listen = useCallback(async (): Promise<string> => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use Chrome.");
      return "";
    }

    // Stop speaking if currently speaking
    if ('speechSynthesis' in window) {
       window.speechSynthesis.cancel();
    }

    // Request permission explicitly first
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      console.error("Microphone permission denied:", err);
      alert("Please allow microphone access to use voice features.");
      return "";
    }

    return new Promise((resolve) => {
      const recognition = recognitionRef.current;
      
      // Update language dynamically
      recognition.lang = SPEECH_LANG_MAP[language] || 'en-US';

      setState(prev => ({ ...prev, isListening: true, lastTranscript: '', isSpeaking: false }));

      recognition.onstart = () => {
        console.log("Listening started...");
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        console.log("Transcript:", transcript);
        setState(prev => ({ ...prev, isListening: false, lastTranscript: transcript }));
        resolve(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech Recognition Error", event.error);
        if (event.error === 'not-allowed') {
           alert("Microphone access is blocked. Please allow access in your browser settings.");
        }
        setState(prev => ({ ...prev, isListening: false }));
        resolve("");
      };

      recognition.onend = () => {
        setState(prev => ({ ...prev, isListening: false }));
      };

      try {
        // Stop any previous instances to be safe
        try { recognition.abort(); } catch(e) {}
        
        recognition.start();
      } catch (e) {
        console.warn("Recognition already started or failed", e);
        // If it's already started, we might not want to resolve empty immediately, 
        // but for simplicity in this hook structure, we reset.
        // Actually, if it's already started, we probably shouldn't have reached here 
        // because of the isListening check in components, but safety first.
        setState(prev => ({ ...prev, isListening: false }));
        resolve("");
      }
    });
  }, [language]);

  const cancel = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort(); // Use abort instead of stop for immediate cancellation
      } catch (e) { /* ignore */ }
    }
    setState(prev => ({ ...prev, isSpeaking: false, isListening: false, isProcessing: false }));
  }, []);

  return {
    state,
    speak,
    listen,
    cancel
  };
};