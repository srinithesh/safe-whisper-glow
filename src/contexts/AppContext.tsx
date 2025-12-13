import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { UserRole, EmergencyStatus, Location, Reminder } from '@/types';
import { mockPregnantUser, mockTrustedContacts, mockLocation } from '@/data/mockData';
import { useVoiceDetection } from '@/hooks/useVoiceDetection';
import { useEmergencyState } from '@/hooks/useEmergencyState';
import { useReminders } from '@/hooks/useReminders';
import { useToast } from '@/hooks/use-toast';

interface AppContextType {
  // User state
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  userName: string;
  
  // Emergency state
  emergencyStatus: EmergencyStatus;
  isListening: boolean;
  isVoiceSupported: boolean;
  lastTranscript: string;
  timeRemaining: number | null;
  triggerEmergency: (type: 'voice' | 'manual' | 'inactivity', keyword?: string) => void;
  verifySafe: (method: 'voice' | 'button' | 'activity') => void;
  confirmDanger: (confirmedBy: string) => void;
  resolveEmergency: (resolvedBy: string) => void;
  
  // Location
  currentLocation: Location;
  
  // Reminders
  reminders: Reminder[];
  activeReminder: Reminder | null;
  completeReminder: (id: string, method: 'button' | 'voice') => void;
  
  // Trusted contacts
  trustedContacts: typeof mockTrustedContacts;
  
  // Voice control
  toggleVoiceDetection: () => void;
  voiceEnabled: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('pregnant_woman');
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const { toast } = useToast();

  const {
    status: emergencyStatus,
    timeRemaining,
    triggerEmergency,
    verifySafe,
    confirmDanger,
    resolveEmergency,
  } = useEmergencyState({
    onStatusChange: (status) => {
      if (status === 'alert') {
        toast({
          title: '⚠️ Emergency Alert Detected',
          description: 'Please confirm you are safe by pressing the button or speaking.',
          variant: 'destructive',
        });
      } else if (status === 'emergency') {
        toast({
          title: '🚨 EMERGENCY MODE ACTIVATED',
          description: 'Trusted contacts have been notified.',
          variant: 'destructive',
        });
      } else if (status === 'safe') {
        toast({
          title: '✅ Status: Safe',
          description: 'Everything is okay. Monitoring continues.',
        });
      }
    },
    onEscalate: () => {
      toast({
        title: '🏥 Emergency Services Recommended',
        description: 'No response received. Consider calling emergency services.',
        variant: 'destructive',
      });
    },
  });

  const {
    isListening,
    isSupported: isVoiceSupported,
    lastTranscript,
  } = useVoiceDetection({
    onEmergencyDetected: (keyword) => {
      triggerEmergency('voice', keyword);
    },
    onSpeechDetected: (transcript) => {
      // If in alert mode and user speaks, verify safe
      if (emergencyStatus === 'alert' && transcript.length > 10) {
        verifySafe('voice');
      }
    },
    enabled: voiceEnabled,
  });

  const {
    reminders,
    activeReminder,
    completeReminder,
  } = useReminders({
    onReminderCompleted: (reminder) => {
      toast({
        title: '✓ Reminder Completed',
        description: `${reminder.title} has been marked as done.`,
      });
    },
    onActivityDetected: () => {
      // If in monitoring mode, activity resets the timer
      if (emergencyStatus === 'monitoring') {
        verifySafe('activity');
      }
    },
  });

  const toggleVoiceDetection = useCallback(() => {
    setVoiceEnabled((prev) => !prev);
    toast({
      title: voiceEnabled ? '🎤 Voice Detection Off' : '🎤 Voice Detection On',
      description: voiceEnabled 
        ? 'Voice monitoring has been disabled.'
        : 'Say "help", "pain", or "emergency" to trigger an alert.',
    });
  }, [voiceEnabled, toast]);

  const value: AppContextType = {
    currentRole,
    setCurrentRole,
    userName: currentRole === 'pregnant_woman' ? mockPregnantUser.name : mockTrustedContacts[0].name,
    emergencyStatus,
    isListening,
    isVoiceSupported,
    lastTranscript,
    timeRemaining,
    triggerEmergency,
    verifySafe,
    confirmDanger,
    resolveEmergency,
    currentLocation: mockLocation,
    reminders,
    activeReminder,
    completeReminder,
    trustedContacts: mockTrustedContacts,
    toggleVoiceDetection,
    voiceEnabled,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
