import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Location } from '@/types';
import { MapPin, Navigation, Clock, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

interface LocationCardProps {
  location: Location;
  userName?: string;
  showNavigation?: boolean;
  className?: string;
}

export const LocationCard: React.FC<LocationCardProps> = ({
  location,
  userName,
  showNavigation = true,
  className,
}) => {
  const openInMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;
    window.open(url, '_blank');
  };

  return (
    <Card className={cn('p-4 overflow-hidden', className)}>
      {/* Mock map background */}
      <div className="relative h-40 -mx-4 -mt-4 mb-4 bg-gradient-to-br from-accent/30 to-secondary/30">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-primary/20 animate-ping absolute" />
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center relative z-10">
              <MapPin className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
        </div>
        
        {/* Grid overlay for map effect */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(to right, currentColor 1px, transparent 1px),
              linear-gradient(to bottom, currentColor 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        />
      </div>

      <div className="space-y-3">
        {userName && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-sm font-bold text-primary">
                {userName.charAt(0)}
              </span>
            </div>
            <span className="font-semibold">{userName}'s Location</span>
          </div>
        )}

        <div className="flex items-start gap-2 text-sm">
          <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <span className="text-muted-foreground">
            {location.address || `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>Updated {format(location.timestamp, 'h:mm a')}</span>
        </div>

        {showNavigation && (
          <div className="flex gap-2 pt-2">
            <Button
              variant="default"
              size="sm"
              className="flex-1 gap-2"
              onClick={openInMaps}
            >
              <Navigation className="w-4 h-4" />
              Navigate
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={openInMaps}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};
