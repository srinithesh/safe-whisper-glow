import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer, Circle } from '@react-google-maps/api';
import { Location, Hospital } from '@/types';
import { useGoogleMapsKey } from '@/contexts/GoogleMapsContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Loader2 } from 'lucide-react';

interface LiveMapProps {
  userLocation: Location;
  hospitals?: Hospital[];
  selectedHospital?: Hospital | null;
  onHospitalSelect?: (hospital: Hospital) => void;
  showDirections?: boolean;
  className?: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060,
};

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#a8d4e6' }],
    },
    {
      featureType: 'landscape',
      elementType: 'geometry',
      stylers: [{ color: '#f5f5f5' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#ffffff' }],
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#9ca5b3' }],
    },
  ],
};

export const LiveMap: React.FC<LiveMapProps> = ({
  userLocation,
  hospitals = [],
  selectedHospital,
  onHospitalSelect,
  showDirections = false,
  className,
}) => {
  const { apiKey, isKeySet } = useGoogleMapsKey();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [distance, setDistance] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey || '',
    libraries: ['places'],
  });

  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onMapUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Calculate directions when hospital is selected
  useEffect(() => {
    if (!isLoaded || !selectedHospital || !showDirections || !map) return;

    const directionsService = new google.maps.DirectionsService();

    directionsService.route(
      {
        origin: { lat: userLocation.latitude, lng: userLocation.longitude },
        destination: { 
          lat: selectedHospital.location.latitude, 
          lng: selectedHospital.location.longitude 
        },
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          setDirections(result);
          const route = result.routes[0];
          if (route && route.legs[0]) {
            setDistance(route.legs[0].distance?.text || null);
            setDuration(route.legs[0].duration?.text || null);
          }
        }
      }
    );
  }, [isLoaded, selectedHospital, showDirections, map, userLocation]);

  if (!isKeySet) {
    return (
      <Card className={`flex items-center justify-center p-8 ${className}`}>
        <div className="text-center text-muted-foreground">
          <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Google Maps API key required</p>
          <p className="text-xs mt-1">Go to Settings to add your key</p>
        </div>
      </Card>
    );
  }

  if (loadError) {
    return (
      <Card className={`flex items-center justify-center p-8 ${className}`}>
        <div className="text-center text-destructive">
          <p className="text-sm">Failed to load Google Maps</p>
          <p className="text-xs mt-1">Check your API key</p>
        </div>
      </Card>
    );
  }

  if (!isLoaded) {
    return (
      <Card className={`flex items-center justify-center p-8 ${className}`}>
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </Card>
    );
  }

  return (
    <div className={`relative rounded-xl overflow-hidden ${className}`}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={{ lat: userLocation.latitude, lng: userLocation.longitude }}
        zoom={14}
        options={mapOptions}
        onLoad={onMapLoad}
        onUnmount={onMapUnmount}
      >
        {/* User location marker with pulse effect */}
        <Circle
          center={{ lat: userLocation.latitude, lng: userLocation.longitude }}
          radius={100}
          options={{
            fillColor: '#e8a0b8',
            fillOpacity: 0.3,
            strokeColor: '#e8a0b8',
            strokeOpacity: 0.6,
            strokeWeight: 2,
          }}
        />
        <Marker
          position={{ lat: userLocation.latitude, lng: userLocation.longitude }}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: '#e8a0b8',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 3,
          }}
          title="Your Location"
        />

        {/* Hospital markers */}
        {hospitals.map((hospital) => (
          <Marker
            key={hospital.id}
            position={{ 
              lat: hospital.location.latitude, 
              lng: hospital.location.longitude 
            }}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: selectedHospital?.id === hospital.id ? '#dc4a4a' : '#4a9eda',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
            }}
            title={hospital.name}
            onClick={() => onHospitalSelect?.(hospital)}
          />
        ))}

        {/* Directions route */}
        {directions && showDirections && (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: '#e8a0b8',
                strokeWeight: 4,
                strokeOpacity: 0.8,
              },
            }}
          />
        )}
      </GoogleMap>

      {/* Distance info overlay */}
      {distance && duration && showDirections && (
        <div className="absolute bottom-4 left-4 right-4">
          <Card className="p-3 bg-card/95 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">{selectedHospital?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {distance} • {duration} drive
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => {
                  const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedHospital?.location.latitude},${selectedHospital?.location.longitude}`;
                  window.open(url, '_blank');
                }}
              >
                <Navigation className="w-4 h-4 mr-1" />
                Go
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
