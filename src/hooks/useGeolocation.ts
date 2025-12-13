import React, { useState, useEffect, useCallback } from 'react';
import { Location } from '@/types';

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

interface UseGeolocationReturn {
  location: Location | null;
  error: string | null;
  isLoading: boolean;
  refresh: () => void;
}

export const useGeolocation = (options?: UseGeolocationOptions): UseGeolocationReturn => {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const newLocation: Location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: new Date(),
        };

        // Try to get address using reverse geocoding (if Google Maps API is available)
        try {
          const geocoder = new google.maps.Geocoder();
          const result = await geocoder.geocode({
            location: { lat: position.coords.latitude, lng: position.coords.longitude },
          });
          if (result.results[0]) {
            newLocation.address = result.results[0].formatted_address;
          }
        } catch (e) {
          // Geocoding failed, continue without address
          console.log('Geocoding not available');
        }

        setLocation(newLocation);
        setIsLoading(false);
      },
      (err) => {
        setError(err.message);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: options?.enableHighAccuracy ?? true,
        timeout: options?.timeout ?? 10000,
        maximumAge: options?.maximumAge ?? 60000,
      }
    );
  }, [options?.enableHighAccuracy, options?.timeout, options?.maximumAge]);

  useEffect(() => {
    getLocation();

    // Set up continuous watching
    const watchId = navigator.geolocation?.watchPosition(
      (position) => {
        setLocation((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: new Date(),
        }));
      },
      (err) => {
        console.error('Watch position error:', err);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
      }
    );

    return () => {
      if (watchId !== undefined) {
        navigator.geolocation?.clearWatch(watchId);
      }
    };
  }, [getLocation]);

  return { location, error, isLoading, refresh: getLocation };
};
