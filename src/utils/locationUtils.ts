import { Location, Hospital } from '@/types';

// Calculate distance between two points using Haversine formula
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

// Estimate travel time based on distance (rough estimate)
export const estimateTravelTime = (distanceMiles: number): number => {
  // Assume average city speed of 25 mph
  const avgSpeedMph = 25;
  return Math.ceil((distanceMiles / avgSpeedMph) * 60); // Returns minutes
};

// Calculate distances for all hospitals from user location
export const calculateHospitalDistances = (
  userLocation: Location,
  hospitals: Hospital[]
): Hospital[] => {
  return hospitals.map((hospital) => {
    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      hospital.location.latitude,
      hospital.location.longitude
    );
    const estimatedTime = estimateTravelTime(distance);

    return {
      ...hospital,
      distance: Math.round(distance * 10) / 10, // Round to 1 decimal
      estimatedTime,
    };
  }).sort((a, b) => a.distance - b.distance);
};

// Format distance for display
export const formatDistance = (miles: number): string => {
  if (miles < 0.1) {
    return 'Less than 0.1 mi';
  }
  return `${miles.toFixed(1)} mi`;
};

// Format time for display
export const formatDuration = (minutes: number): string => {
  if (minutes < 1) {
    return 'Less than 1 min';
  }
  if (minutes < 60) {
    return `${Math.round(minutes)} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours}h ${mins}m`;
};
