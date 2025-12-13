import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { HospitalCard } from '@/components/HospitalCard';
import { cn } from '@/lib/utils';
import { mockHospitals, emergencyServices } from '@/data/mockData';
import { 
  Siren, 
  Phone, 
  Car, 
  HeartPulse, 
  CheckCircle,
  X,
  MapPin
} from 'lucide-react';

interface EmergencyOverlayProps {
  isVisible: boolean;
  onConfirmSafe: () => void;
  onClose: () => void;
}

export const EmergencyOverlay: React.FC<EmergencyOverlayProps> = ({
  isVisible,
  onConfirmSafe,
  onClose,
}) => {
  if (!isVisible) return null;

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleNavigate = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-emergency/95 animate-fade-in overflow-auto">
      <div className="min-h-screen py-6 px-4">
        <div className="max-w-lg mx-auto space-y-6">
          {/* Header */}
          <div className="text-center text-emergency-foreground space-y-2">
            <div className="w-20 h-20 mx-auto rounded-full bg-emergency-foreground/20 flex items-center justify-center pulse-emergency">
              <Siren className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold">EMERGENCY MODE</h1>
            <p className="text-emergency-foreground/80">
              Trusted contacts have been notified
            </p>
          </div>

          {/* Safe button */}
          <Button
            variant="safe"
            size="xl"
            className="w-full gap-3"
            onClick={onConfirmSafe}
          >
            <CheckCircle className="w-6 h-6" />
            I'm Safe - Cancel Emergency
          </Button>

          {/* Emergency services */}
          <Card className="p-4 bg-card/95">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-emergency" />
              Emergency Services
            </h3>
            <div className="space-y-3">
              <Button
                variant="emergency"
                size="lg"
                className="w-full justify-start gap-3"
                onClick={() => handleCall('911')}
              >
                <Siren className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-bold">Call 911</div>
                  <div className="text-xs opacity-80">Immediate emergency</div>
                </div>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full justify-start gap-3 border-emergency text-emergency hover:bg-emergency/10"
                onClick={() => handleCall(emergencyServices.transport.phone)}
              >
                <Car className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-bold">{emergencyServices.transport.name}</div>
                  <div className="text-xs text-muted-foreground">{emergencyServices.transport.description}</div>
                </div>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full justify-start gap-3"
                onClick={() => handleCall(emergencyServices.hotline.phone)}
              >
                <HeartPulse className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-bold">{emergencyServices.hotline.name}</div>
                  <div className="text-xs text-muted-foreground">{emergencyServices.hotline.description}</div>
                </div>
              </Button>
            </div>
          </Card>

          {/* Nearby hospitals */}
          <div className="space-y-3">
            <h3 className="font-bold flex items-center gap-2 text-emergency-foreground">
              <MapPin className="w-5 h-5" />
              Nearby Hospitals
            </h3>
            {mockHospitals.map((hospital) => (
              <HospitalCard
                key={hospital.id}
                hospital={hospital}
                onCall={() => handleCall(hospital.phone)}
                onNavigate={() => handleNavigate(hospital.location.latitude, hospital.location.longitude)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
