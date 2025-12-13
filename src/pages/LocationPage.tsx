import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LiveMap } from '@/components/LiveMap';
import { HospitalCard } from '@/components/HospitalCard';
import { useApp } from '@/contexts/AppContext';
import { useGoogleMapsKey } from '@/contexts/GoogleMapsContext';
import { useGeolocation } from '@/hooks/useGeolocation';
import { calculateHospitalDistances } from '@/utils/locationUtils';
import { mockHospitals, mockPregnantUser, mockLocation } from '@/data/mockData';
import { Hospital } from '@/types';
import { 
  MapPin, 
  Navigation,
  Building2,
  Share2,
  RefreshCw,
  Loader2,
  AlertCircle,
  Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const LocationPage: React.FC = () => {
  const { currentRole } = useApp();
  const { isKeySet } = useGoogleMapsKey();
  const { location: geoLocation, error: geoError, isLoading, refresh } = useGeolocation();
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

  // Use real location if available, otherwise fall back to mock
  const currentLocation = geoLocation || mockLocation;
  
  // Calculate real distances based on current location
  const hospitalsWithDistances = calculateHospitalDistances(currentLocation, mockHospitals);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Location',
        text: `I'm at ${currentLocation.address || `${currentLocation.latitude}, ${currentLocation.longitude}`}`,
        url: `https://www.google.com/maps/search/?api=1&query=${currentLocation.latitude},${currentLocation.longitude}`,
      });
    }
  };

  const handleNavigateToHospital = (hospital: Hospital) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${hospital.location.latitude},${hospital.location.longitude}`,
      '_blank'
    );
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 mx-auto rounded-full gradient-primary flex items-center justify-center shadow-glow">
          <MapPin className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-bold">Live Location</h2>
        <p className="text-muted-foreground">
          {currentRole === 'pregnant_woman' 
            ? 'Your location is shared with trusted contacts'
            : `Tracking ${mockPregnantUser.name.split(' ')[0]}'s location`}
        </p>
      </div>

      {/* Location status */}
      {isLoading && (
        <Card className="p-4 flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="text-sm">Getting your location...</span>
        </Card>
      )}

      {geoError && (
        <Card className="p-4 bg-warning/10 border-warning/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
            <div>
              <p className="text-sm font-medium">Location access denied</p>
              <p className="text-xs text-muted-foreground">
                Using demo location. Enable location access for real tracking.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* API Key prompt */}
      {!isKeySet && (
        <Card className="p-4 bg-primary/10 border-primary/20">
          <div className="flex items-start gap-3">
            <Settings className="w-5 h-5 text-primary mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium">Enable Live Map</p>
              <p className="text-xs text-muted-foreground mb-2">
                Add your Google Maps API key to see the interactive map.
              </p>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => {
                  // Navigate to settings
                  const event = new CustomEvent('navigate', { detail: 'settings' });
                  window.dispatchEvent(event);
                }}
              >
                <Settings className="w-4 h-4 mr-1" />
                Go to Settings
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Live Map */}
      <LiveMap
        userLocation={currentLocation}
        hospitals={hospitalsWithDistances}
        selectedHospital={selectedHospital}
        onHospitalSelect={setSelectedHospital}
        showDirections={!!selectedHospital}
        className="h-64 shadow-soft"
      />

      {/* Current location info */}
      <Card className="p-4 shadow-soft">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-semibold">
              {currentRole === 'pregnant_woman' ? 'Your Location' : `${mockPregnantUser.name.split(' ')[0]}'s Location`}
            </p>
            <p className="text-sm text-muted-foreground">
              {currentLocation.address || `${currentLocation.latitude.toFixed(4)}, ${currentLocation.longitude.toFixed(4)}`}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Updated {new Date(currentLocation.timestamp).toLocaleTimeString()}
            </p>
          </div>
        </div>
      </Card>

      {/* Actions */}
      {currentRole === 'pregnant_woman' && (
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 gap-2" onClick={handleShare}>
            <Share2 className="w-4 h-4" />
            Share Location
          </Button>
          <Button variant="outline" className="flex-1 gap-2" onClick={refresh}>
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      )}

      {/* Nearby hospitals */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Nearby Hospitals</h3>
        </div>
        {hospitalsWithDistances.map((hospital) => (
          <div 
            key={hospital.id}
            className={`transition-all ${selectedHospital?.id === hospital.id ? 'ring-2 ring-primary rounded-xl' : ''}`}
            onClick={() => setSelectedHospital(hospital)}
          >
            <HospitalCard
              hospital={hospital}
              onCall={() => window.location.href = `tel:${hospital.phone}`}
              onNavigate={() => handleNavigateToHospital(hospital)}
            />
          </div>
        ))}
      </div>

      {/* Safety info */}
      <Card className="p-4 bg-accent/20 border-accent/30">
        <div className="flex items-start gap-3">
          <Navigation className="w-5 h-5 text-accent-foreground mt-0.5" />
          <div>
            <h4 className="font-semibold text-accent-foreground">Location Sharing Active</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Your location is continuously shared with your trusted contacts for safety monitoring.
              {geoLocation && ' Using your real GPS location.'}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
