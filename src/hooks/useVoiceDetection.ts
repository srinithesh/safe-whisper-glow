import { useState, useEffect, useCallback, useRef } from 'react';

const EMERGENCY_KEYWORDS = ['help', 'pain', 'emergency', 'hurt', 'fall', 'bleeding', 'faint', 'dizzy'];

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface UseVoiceDetectionOptions {
  onEmergencyDetected: (keyword: string) => void;
  onSpeechDetected?: (transcript: string) => void;
  enabled?: boolean;
}

export const useVoiceDetection = ({
  onEmergencyDetected,
  onSpeechDetected,
  enabled = true,
}: UseVoiceDetectionOptions) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [lastTranscript, setLastTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    // Check for Web Speech API support
    const SpeechRecognitionConstructor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognitionConstructor) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognitionConstructor() as SpeechRecognitionInstance;
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
    }
  }, []);

  const checkForEmergency = useCallback((transcript: string) => {
    const lowerTranscript = transcript.toLowerCase();
    for (const keyword of EMERGENCY_KEYWORDS) {
      if (lowerTranscript.includes(keyword)) {
        return keyword;
      }
    }
    return null;
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || !enabled) return;

    recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      
      setLastTranscript(transcript);
      onSpeechDetected?.(transcript);

      // Check for emergency keywords
      const emergencyKeyword = checkForEmergency(transcript);
      if (emergencyKeyword) {
        onEmergencyDetected(emergencyKeyword);
      }
    };

    recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      if (event.error !== 'no-speech') {
        setIsListening(false);
      }
    };

    recognitionRef.current.onend = () => {
      // Restart if still enabled
      if (enabled && isListening) {
        try {
          recognitionRef.current?.start();
        } catch (e) {
          // Already started
        }
      }
    };

    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
    }
  }, [enabled, isListening, onEmergencyDetected, onSpeechDetected, checkForEmergency]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Already stopped
      }
      setIsListening(false);
    }
  }, []);

  useEffect(() => {
    if (enabled && isSupported) {
      startListening();
    } else {
      stopListening();
    }

    return () => {
      stopListening();
    };
  }, [enabled, isSupported]);

  return {
    isListening,
    isSupported,
    lastTranscript,
    startListening,
    stopListening,
  };
};
