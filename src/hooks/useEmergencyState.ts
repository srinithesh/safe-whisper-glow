import { useState, useCallback, useRef, useEffect } from 'react';
import { EmergencyStatus, EmergencyEvent, Location, VerificationAttempt } from '@/types';

const VERIFICATION_TIMEOUT = 30000; // 30 seconds
const ESCALATION_TIMEOUT = 120000; // 2 minutes

interface UseEmergencyStateOptions {
  onStatusChange?: (status: EmergencyStatus) => void;
  onEscalate?: () => void;
}

export const useEmergencyState = (options?: UseEmergencyStateOptions) => {
  const [status, setStatus] = useState<EmergencyStatus>('safe');
  const [currentEvent, setCurrentEvent] = useState<EmergencyEvent | null>(null);
  const [verificationAttempts, setVerificationAttempts] = useState<VerificationAttempt[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  
  const verificationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const escalationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimers = useCallback(() => {
    if (verificationTimerRef.current) clearTimeout(verificationTimerRef.current);
    if (escalationTimerRef.current) clearTimeout(escalationTimerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    setTimeRemaining(null);
  }, []);

  const startCountdown = useCallback((duration: number) => {
    setTimeRemaining(duration);
    countdownRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1000) {
          if (countdownRef.current) clearInterval(countdownRef.current);
          return null;
        }
        return prev - 1000;
      });
    }, 1000);
  }, []);

  const triggerEmergency = useCallback((triggerType: 'voice' | 'manual' | 'inactivity', keyword?: string) => {
    clearTimers();
    
    const mockLocation: Location = {
      latitude: 40.7128,
      longitude: -74.0060,
      address: '123 Main Street, New York, NY',
      timestamp: new Date(),
    };

    const event: EmergencyEvent = {
      id: `emergency-${Date.now()}`,
      userId: 'user-1',
      triggeredAt: new Date(),
      status: 'alert',
      triggerType,
      keyword,
      location: mockLocation,
      verificationAttempts: [],
    };

    setCurrentEvent(event);
    setStatus('alert');
    setVerificationAttempts([]);
    options?.onStatusChange?.('alert');

    // Start verification timer
    startCountdown(VERIFICATION_TIMEOUT);
    verificationTimerRef.current = setTimeout(() => {
      // If not verified, escalate to emergency
      setStatus('emergency');
      options?.onStatusChange?.('emergency');
      
      // Start escalation timer
      startCountdown(ESCALATION_TIMEOUT);
      escalationTimerRef.current = setTimeout(() => {
        options?.onEscalate?.();
      }, ESCALATION_TIMEOUT);
    }, VERIFICATION_TIMEOUT);
  }, [clearTimers, options, startCountdown]);

  const verifySafe = useCallback((method: 'voice' | 'button' | 'activity') => {
    clearTimers();
    
    const attempt: VerificationAttempt = {
      type: method,
      timestamp: new Date(),
      success: true,
    };

    setVerificationAttempts((prev) => [...prev, attempt]);
    setStatus('safe');
    
    if (currentEvent) {
      setCurrentEvent({
        ...currentEvent,
        status: 'resolved',
        resolvedAt: new Date(),
        resolvedBy: 'self',
        verificationAttempts: [...verificationAttempts, attempt],
      });
    }
    
    options?.onStatusChange?.('safe');
  }, [clearTimers, currentEvent, verificationAttempts, options]);

  const confirmDanger = useCallback((confirmedBy: string) => {
    clearTimers();
    setStatus('emergency');
    
    if (currentEvent) {
      setCurrentEvent({
        ...currentEvent,
        status: 'emergency',
      });
    }
    
    options?.onStatusChange?.('emergency');
    options?.onEscalate?.();
  }, [clearTimers, currentEvent, options]);

  const resolveEmergency = useCallback((resolvedBy: string) => {
    clearTimers();
    setStatus('resolved');
    
    if (currentEvent) {
      setCurrentEvent({
        ...currentEvent,
        status: 'resolved',
        resolvedAt: new Date(),
        resolvedBy,
      });
    }
    
    // Reset to safe after a moment
    setTimeout(() => {
      setStatus('safe');
      setCurrentEvent(null);
      options?.onStatusChange?.('safe');
    }, 3000);
  }, [clearTimers, currentEvent, options]);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  return {
    status,
    currentEvent,
    verificationAttempts,
    timeRemaining,
    triggerEmergency,
    verifySafe,
    confirmDanger,
    resolveEmergency,
  };
};
