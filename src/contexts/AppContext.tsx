import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { UserRole, EmergencyStatus, Location, Reminder, TrustedContact, Hospital, EmergencyEvent, DigiLockerDocument, DigiLockerAccess, ActivityLogEntry } from '@/types';
import { mockPregnantUser, mockTrustedContacts, mockLocation, mockHospitals } from '@/data/mockData';
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
  emergencyHistory: EmergencyEvent[];
  emergencyKeywords: string[];
  triggerEmergency: (type: 'voice' | 'manual' | 'inactivity', keyword?: string) => void;
  verifySafe: (method: 'voice' | 'button' | 'activity') => void;
  confirmDanger: (confirmedBy: string) => void;
  resolveEmergency: (resolvedBy: string) => void;
  addEmergencyKeyword: (keyword: string) => void;
  removeEmergencyKeyword: (keyword: string) => void;
  
  // Location
  currentLocation: Location;
  
  // Reminders
  reminders: Reminder[];
  activeReminder: Reminder | null;
  completeReminder: (id: string, method: 'button' | 'voice') => void;
  addReminder: (type: Reminder['type'], title: string, scheduledTime: Date, description?: string) => void;
  deleteReminder: (id: string) => void;
  
  // Trusted contacts
  trustedContacts: TrustedContact[];
  addContact: (contact: Omit<TrustedContact, 'id'>) => void;
  deleteContact: (id: string) => void;
  updateContact: (id: string, updates: Partial<TrustedContact>) => void;
  
  // Hospitals
  hospitals: Hospital[];
  addHospital: (hospital: Omit<Hospital, 'id' | 'distance' | 'estimatedTime'>) => void;
  deleteHospital: (id: string) => void;
  
  // Voice control
  toggleVoiceDetection: () => void;
  voiceEnabled: boolean;

  // Notification settings
  notificationSettings: {
    pushEnabled: boolean;
    soundEnabled: boolean;
    vibrationEnabled: boolean;
    smsEnabled: boolean;
    callEnabled: boolean;
    quietHoursEnabled: boolean;
    quietHoursStart: string;
    quietHoursEnd: string;
  };
  updateNotificationSetting: (key: string, value: boolean | string) => void;

  // DigiLocker
  digiLockerDocuments: DigiLockerDocument[];
  addDocument: (doc: Omit<DigiLockerDocument, 'id' | 'uploadedAt'>) => void;
  deleteDocument: (id: string) => void;
  digiLockerAccess: DigiLockerAccess[];
  updateDocumentAccess: (userId: string, accessType: DigiLockerAccess['accessType'], canView: boolean) => void;
  emergencyAccessEnabled: boolean;
  toggleEmergencyAccess: () => void;

  // Activity Log
  activityLog: ActivityLogEntry[];
  addActivityLog: (entry: Omit<ActivityLogEntry, 'id' | 'timestamp'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('pregnant_woman');
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [trustedContacts, setTrustedContacts] = useState<TrustedContact[]>(mockTrustedContacts);
  const [hospitals, setHospitals] = useState<Hospital[]>(mockHospitals);
  const [emergencyHistory, setEmergencyHistory] = useState<EmergencyEvent[]>([]);
  const [emergencyKeywords, setEmergencyKeywords] = useState<string[]>([
    'help', 'pain', 'emergency', 'hurt', 'fall', 'bleeding', 'faint', 'dizzy'
  ]);
  const [notificationSettings, setNotificationSettings] = useState({
    pushEnabled: true,
    soundEnabled: true,
    vibrationEnabled: true,
    smsEnabled: true,
    callEnabled: false,
    quietHoursEnabled: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '07:00',
  });
  
  const { toast } = useToast();

  const {
    status: emergencyStatus,
    currentEvent,
    timeRemaining,
    triggerEmergency: triggerEmergencyBase,
    verifySafe: verifySafeBase,
    confirmDanger,
    resolveEmergency: resolveEmergencyBase,
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

  const triggerEmergency = useCallback((type: 'voice' | 'manual' | 'inactivity', keyword?: string) => {
    triggerEmergencyBase(type, keyword);
    // Add to history
    const event: EmergencyEvent = {
      id: `event-${Date.now()}`,
      userId: 'user-1',
      triggeredAt: new Date(),
      status: 'alert',
      triggerType: type,
      keyword,
      location: mockLocation,
      verificationAttempts: [],
    };
    setEmergencyHistory(prev => [event, ...prev].slice(0, 50));
  }, [triggerEmergencyBase]);

  const verifySafe = useCallback((method: 'voice' | 'button' | 'activity') => {
    verifySafeBase(method);
    // Update last event in history
    setEmergencyHistory(prev => {
      if (prev.length === 0) return prev;
      const [latest, ...rest] = prev;
      return [{
        ...latest,
        status: 'resolved',
        resolvedAt: new Date(),
        resolvedBy: 'self',
      }, ...rest];
    });
  }, [verifySafeBase]);

  const resolveEmergency = useCallback((resolvedBy: string) => {
    resolveEmergencyBase(resolvedBy);
    setEmergencyHistory(prev => {
      if (prev.length === 0) return prev;
      const [latest, ...rest] = prev;
      return [{
        ...latest,
        status: 'resolved',
        resolvedAt: new Date(),
        resolvedBy,
      }, ...rest];
    });
  }, [resolveEmergencyBase]);

  const {
    isListening,
    isSupported: isVoiceSupported,
    lastTranscript,
  } = useVoiceDetection({
    onEmergencyDetected: (keyword) => {
      if (emergencyKeywords.includes(keyword.toLowerCase())) {
        triggerEmergency('voice', keyword);
      }
    },
    onSpeechDetected: (transcript) => {
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
    addReminder,
    deleteReminder,
  } = useReminders({
    onReminderCompleted: (reminder) => {
      toast({
        title: '✓ Reminder Completed',
        description: `${reminder.title} has been marked as done.`,
      });
    },
    onActivityDetected: () => {
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

  const addEmergencyKeyword = useCallback((keyword: string) => {
    setEmergencyKeywords(prev => [...prev, keyword.toLowerCase()]);
  }, []);

  const removeEmergencyKeyword = useCallback((keyword: string) => {
    setEmergencyKeywords(prev => prev.filter(k => k !== keyword));
  }, []);

  const addContact = useCallback((contact: Omit<TrustedContact, 'id'>) => {
    const newContact: TrustedContact = {
      ...contact,
      id: `contact-${Date.now()}`,
    };
    setTrustedContacts(prev => [...prev, newContact]);
  }, []);

  const deleteContact = useCallback((id: string) => {
    setTrustedContacts(prev => prev.filter(c => c.id !== id));
    toast({
      title: 'Contact Removed',
      description: 'The contact has been removed from your trusted list.',
    });
  }, [toast]);

  const updateContact = useCallback((id: string, updates: Partial<TrustedContact>) => {
    setTrustedContacts(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }, []);

  const addHospital = useCallback((hospital: Omit<Hospital, 'id' | 'distance' | 'estimatedTime'>) => {
    const newHospital: Hospital = {
      ...hospital,
      id: `hospital-${Date.now()}`,
      distance: Math.random() * 5 + 0.5,
      estimatedTime: Math.floor(Math.random() * 15) + 5,
    };
    setHospitals(prev => [...prev, newHospital]);
  }, []);

  const deleteHospital = useCallback((id: string) => {
    setHospitals(prev => prev.filter(h => h.id !== id));
  }, []);

  const updateNotificationSetting = useCallback((key: string, value: boolean | string) => {
    setNotificationSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  // DigiLocker state
  const [digiLockerDocuments, setDigiLockerDocuments] = useState<DigiLockerDocument[]>([]);
  const [digiLockerAccess, setDigiLockerAccess] = useState<DigiLockerAccess[]>([]);
  const [emergencyAccessEnabled, setEmergencyAccessEnabled] = useState(false);
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);

  const addDocument = useCallback((doc: Omit<DigiLockerDocument, 'id' | 'uploadedAt'>) => {
    const newDoc: DigiLockerDocument = { ...doc, id: `doc-${Date.now()}`, uploadedAt: new Date() };
    setDigiLockerDocuments(prev => [...prev, newDoc]);
    addActivityLog({ type: 'documents_shared', title: 'Document Added', description: `Added ${doc.name}` });
  }, []);

  const deleteDocument = useCallback((id: string) => {
    setDigiLockerDocuments(prev => prev.filter(d => d.id !== id));
  }, []);

  const updateDocumentAccess = useCallback((userId: string, accessType: DigiLockerAccess['accessType'], canView: boolean) => {
    setDigiLockerAccess(prev => {
      const existing = prev.find(a => a.userId === userId);
      if (existing) {
        return prev.map(a => a.userId === userId ? { ...a, canView } : a);
      }
      return [...prev, { userId, accessType, canView, grantedAt: new Date() }];
    });
  }, []);

  const toggleEmergencyAccess = useCallback(() => {
    setEmergencyAccessEnabled(prev => !prev);
  }, []);

  const addActivityLog = useCallback((entry: Omit<ActivityLogEntry, 'id' | 'timestamp'>) => {
    const newEntry: ActivityLogEntry = { ...entry, id: `log-${Date.now()}`, timestamp: new Date() };
    setActivityLog(prev => [newEntry, ...prev].slice(0, 100));
  }, []);

  const value: AppContextType = {
    currentRole,
    setCurrentRole,
    userName: currentRole === 'pregnant_woman' ? mockPregnantUser.name : trustedContacts[0]?.name || 'User',
    emergencyStatus,
    isListening,
    isVoiceSupported,
    lastTranscript,
    timeRemaining,
    emergencyHistory,
    emergencyKeywords,
    triggerEmergency,
    verifySafe,
    confirmDanger,
    resolveEmergency,
    addEmergencyKeyword,
    removeEmergencyKeyword,
    currentLocation: mockLocation,
    reminders,
    activeReminder,
    completeReminder,
    addReminder,
    deleteReminder,
    trustedContacts,
    addContact,
    deleteContact,
    updateContact,
    hospitals,
    addHospital,
    deleteHospital,
    toggleVoiceDetection,
    voiceEnabled,
    notificationSettings,
    updateNotificationSetting,
    digiLockerDocuments,
    addDocument,
    deleteDocument,
    digiLockerAccess,
    updateDocumentAccess,
    emergencyAccessEnabled,
    toggleEmergencyAccess,
    activityLog,
    addActivityLog,
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
