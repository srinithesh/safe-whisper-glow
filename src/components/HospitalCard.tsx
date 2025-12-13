import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Hospital } from '@/types';
import { Building2, Phone, Clock, Navigation, Car } from 'lucide-react';

interface HospitalCardProps {
  hospital: Hospital;
  onCall: () => void;
  onNavigate: () => void;
}

export const HospitalCard: React.FC<HospitalCardProps> = ({
  hospital,
  onCall,
  onNavigate,
}) => {
  return (
    <Card className="p-4 shadow-soft">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-emergency/10 flex items-center justify-center flex-shrink-0">
          <Building2 className="w-6 h-6 text-emergency" />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold truncate">{hospital.name}</h4>
          <p className="text-sm text-muted-foreground truncate">
            {hospital.address}
          </p>
          
          <div className="flex items-center gap-4 mt-2 text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Car className="w-4 h-4" />
              <span>{hospital.distance} mi</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>~{hospital.estimatedTime} min</span>
            </div>
          </div>

          <div className="flex gap-2 mt-3">
            <Button
              variant="emergency"
              size="sm"
              className="flex-1 gap-1"
              onClick={onCall}
            >
              <Phone className="w-4 h-4" />
              Call
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-1"
              onClick={onNavigate}
            >
              <Navigation className="w-4 h-4" />
              Navigate
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
