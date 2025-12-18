import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Battery, Signal, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusCardProps {
  location: string;
  accuracy?: number;
  battery?: number;
  signalStrength?: 'weak' | 'moderate' | 'strong';
  userName: string;
  onCall?: () => void;
  className?: string;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  location,
  accuracy = 5,
  battery = 84,
  signalStrength = 'strong',
  userName,
  onCall,
  className,
}) => {
  const signalConfig = {
    weak: { bars: 1, label: 'Weak' },
    moderate: { bars: 2, label: 'Moderate' },
    strong: { bars: 3, label: 'Strong' },
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Location */}
      <Card className="p-4 rounded-3xl shadow-card">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground font-medium">CURRENT LOCATION</span>
            <p className="font-semibold">{location}</p>
            <p className="text-xs text-muted-foreground">Accurate to {accuracy} meters</p>
          </div>
        </div>
      </Card>

      {/* Battery & Signal */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4 rounded-3xl shadow-card bg-secondary/30">
          <span className="text-xs font-medium text-safe">BATTERY</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-bold">{battery}%</span>
            <Battery className={cn(
              "w-5 h-5",
              battery > 50 ? "text-safe" : battery > 20 ? "text-warning" : "text-emergency"
            )} />
          </div>
        </Card>

        <Card className="p-4 rounded-3xl shadow-card bg-secondary/30">
          <span className="text-xs font-medium text-safe">SIGNAL</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-bold">{signalConfig[signalStrength].label}</span>
            <Signal className="w-5 h-5 text-safe" />
          </div>
        </Card>
      </div>

      {/* Call Button */}
      <Button 
        onClick={onCall}
        className="w-full h-14 rounded-3xl bg-slate text-slate-foreground hover:bg-slate/90 text-base font-medium"
      >
        <Phone className="w-5 h-5 mr-2" />
        Call {userName}
      </Button>
    </div>
  );
};
