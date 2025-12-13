import { PregnantUser, TrustedContact, Hospital, Location } from '@/types';

export const mockPregnantUser: PregnantUser = {
  id: 'user-1',
  name: 'Sarah Johnson',
  role: 'pregnant_woman',
  phone: '+1 (555) 123-4567',
  dueDate: '2024-06-15',
  weeksPregnant: 28,
  trustedContacts: [],
};

export const mockTrustedContacts: TrustedContact[] = [
  {
    id: 'contact-1',
    name: 'Michael Johnson',
    role: 'trusted_contact',
    phone: '+1 (555) 234-5678',
    relationship: 'Husband',
    isPrimary: true,
  },
  {
    id: 'contact-2',
    name: 'Emily Davis',
    role: 'trusted_contact',
    phone: '+1 (555) 345-6789',
    relationship: 'Mother',
    isPrimary: false,
  },
  {
    id: 'contact-3',
    name: 'Dr. Amanda Wilson',
    role: 'trusted_contact',
    phone: '+1 (555) 456-7890',
    relationship: 'OB-GYN',
    isPrimary: false,
  },
];

export const mockLocation: Location = {
  latitude: 40.7128,
  longitude: -74.0060,
  address: '123 Maple Street, Brooklyn, NY 11201',
  timestamp: new Date(),
};

export const mockHospitals: Hospital[] = [
  {
    id: 'hospital-1',
    name: 'Brooklyn Medical Center',
    address: '456 Hospital Drive, Brooklyn, NY 11215',
    phone: '+1 (555) 911-1111',
    distance: 1.2,
    estimatedTime: 5,
    location: {
      latitude: 40.6892,
      longitude: -73.9442,
      timestamp: new Date(),
    },
    hasEmergencyUnit: true,
  },
  {
    id: 'hospital-2',
    name: "St. Mary's Women's Hospital",
    address: '789 Care Lane, Brooklyn, NY 11220',
    phone: '+1 (555) 911-2222',
    distance: 2.5,
    estimatedTime: 10,
    location: {
      latitude: 40.6782,
      longitude: -74.0095,
      timestamp: new Date(),
    },
    hasEmergencyUnit: true,
  },
  {
    id: 'hospital-3',
    name: 'Maternal Health Center',
    address: '321 Wellness Blvd, Brooklyn, NY 11225',
    phone: '+1 (555) 911-3333',
    distance: 3.8,
    estimatedTime: 15,
    location: {
      latitude: 40.6602,
      longitude: -73.9553,
      timestamp: new Date(),
    },
    hasEmergencyUnit: true,
  },
];

export const emergencyServices = {
  ambulance: {
    name: 'Emergency Ambulance',
    phone: '911',
    description: 'For immediate medical emergencies',
  },
  transport: {
    name: 'Quick Medical Transport',
    phone: '+1 (555) 777-8888',
    description: 'Fast transport to hospital (Uber-style)',
  },
  hotline: {
    name: 'Pregnancy Helpline',
    phone: '+1 (800) 672-2296',
    description: '24/7 pregnancy support',
  },
};
