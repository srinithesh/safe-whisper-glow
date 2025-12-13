// User types
export type UserRole = 'pregnant_woman' | 'trusted_contact';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  phone: string;
  avatar?: string;
}

export interface TrustedContact extends User {
  relationship: string;
  isPrimary: boolean;
}

export interface PregnantUser extends User {
  dueDate: string;
  weeksPregnant: number;
  trustedContacts: TrustedContact[];
}

// Emergency types
export type EmergencyStatus = 'safe' | 'monitoring' | 'alert' | 'emergency' | 'resolved';

export interface EmergencyEvent {
  id: string;
  userId: string;
  triggeredAt: Date;
  status: EmergencyStatus;
  triggerType: 'voice' | 'manual' | 'inactivity';
  keyword?: string;
  location: Location;
  verificationAttempts: VerificationAttempt[];
  resolvedAt?: Date;
  resolvedBy?: string;
}

export interface VerificationAttempt {
  type: 'voice' | 'button' | 'activity';
  timestamp: Date;
  success: boolean;
}

// Location types
export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  timestamp: Date;
}

// Reminder types
export type ReminderType = 'medicine' | 'food' | 'water' | 'exercise' | 'rest';

export interface Reminder {
  id: string;
  type: ReminderType;
  title: string;
  description?: string;
  scheduledTime: Date;
  isCompleted: boolean;
  completedAt?: Date;
  completionMethod?: 'button' | 'voice';
}

// Hospital types
export interface Hospital {
  id: string;
  name: string;
  address: string;
  phone: string;
  distance: number;
  estimatedTime: number;
  location: Location;
  hasEmergencyUnit: boolean;
}

// Alert types
export interface Alert {
  id: string;
  type: 'emergency' | 'reminder' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionRequired?: boolean;
}
