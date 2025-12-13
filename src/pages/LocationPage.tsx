import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LocationCard } from '@/components/LocationCard';
import { HospitalCard } from '@/components/HospitalCard';
import { useApp } from '@/contexts/AppContext';
import { mockHospitals, mockPregnantUser } from '@/data/mockData';
import { 
  MapPin, 
  Navigation,
  Building2,
  Share2,
  RefreshCw
} from 'lucide-react';

export const LocationPage: React.FC = () => {
  const { currentLocation, currentRole } = useApp();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Location',
        text: `I'm at ${currentLocation.address}`,
        url: `https://www.google.com/maps/search/?api=1&query=${currentLocation.latitude},${currentLocation.longitude}`,
      });
    }
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 mx-auto rounded-full gradient-primary flex items-center justify-center shadow-glow">
          <MapPin className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-bold">Location</h2>
        <p className="text-muted-foreground">
          {currentRole === 'pregnant_woman' 
            ? 'Your location is shared with trusted contacts'
            : `Tracking ${mockPregnantUser.name.split(' ')[0]}'s location`}
        </p>
      </div>

      {/* Location card */}
      <LocationCard
        location={currentLocation}
        userName={currentRole === 'pregnant_woman' ? 'Your' : mockPregnantUser.name.split(' ')[0]}
        showNavigation={currentRole === 'trusted_contact'}
      />

      {/* Actions */}
      {currentRole === 'pregnant_woman' && (
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 gap-2" onClick={handleShare}>
            <Share2 className="w-4 h-4" />
            Share Location
          </Button>
          <Button variant="outline" className="flex-1 gap-2">
            <RefreshCw className="w-4 h-4" />
            Update
          </Button>
        </div>
      )}

      {/* Nearby hospitals */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Nearby Hospitals</h3>
        </div>
        {mockHospitals.map((hospital) => (
          <HospitalCard
            key={hospital.id}
            hospital={hospital}
            onCall={() => window.location.href = `tel:${hospital.phone}`}
            onNavigate={() => {
              window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${hospital.location.latitude},${hospital.location.longitude}`,
                '_blank'
              );
            }}
          />
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
              This helps them respond quickly in case of an emergency.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
