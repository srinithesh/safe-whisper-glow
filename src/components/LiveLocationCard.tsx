import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Navigation,
  Clock,
  Signal,
  RefreshCw,
  ExternalLink,
  Car
} from 'lucide-react';
import { Location } from '@/types';
import { format, formatDistanceToNow } from 'date-fns';

interface LiveLocationCardProps {
  location: Location;
  targetName?: string;
  showETA?: boolean;
  estimatedDistance?: number;
  estimatedTime?: number;
  onRefresh?: () => void;
  onNavigate?: () => void;
}

export const LiveLocationCard: React.FC<LiveLocationCardProps> = ({
  location,
  targetName = "Her",
  showETA = true,
  estimatedDistance = 2.4,
  estimatedTime = 8,
  onRefresh,
  onNavigate,
}) => {
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    onRefresh?.();
    await new Promise(r => setTimeout(r, 1000));
    setLastUpdate(new Date());
    setIsRefreshing(false);
  };

  const handleNavigate = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`;
    window.open(url, '_blank');
    onNavigate?.();
  };

  return (
    <Card className="rounded-3xl overflow-hidden shadow-card">
      {/* Map Preview */}
      <div className="relative h-40 bg-gradient-to-br from-primary/20 to-accent/20">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-primary/20 animate-ping absolute" />
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center relative z-10">
              <MapPin className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
        </div>
        
        {/* Live indicator */}
        <div className="absolute top-3 left-3">
          <Badge className="bg-safe text-white flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            LIVE
          </Badge>
        </div>

        {/* Refresh button */}
        <Button 
          variant="secondary" 
          size="icon"
          className="absolute top-3 right-3 rounded-xl"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Location Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold">{targetName}'s Location</h3>
            <p className="text-sm text-muted-foreground">
              {location.address || `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`}
            </p>
          </div>
          <Signal className="w-5 h-5 text-safe" />
        </div>

        {/* Last Update */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Clock className="w-4 h-4" />
          <span>Updated {formatDistanceToNow(lastUpdate, { addSuffix: true })}</span>
        </div>

        {/* ETA Info */}
        {showETA && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-muted/50">
              <div className="flex items-center gap-2 mb-1">
                <Navigation className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">Distance</span>
              </div>
              <p className="font-semibold">{estimatedDistance} km</p>
            </div>
            <div className="p-3 rounded-2xl bg-muted/50">
              <div className="flex items-center gap-2 mb-1">
                <Car className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">ETA</span>
              </div>
              <p className="font-semibold">{estimatedTime} min</p>
            </div>
          </div>
        )}

        {/* Navigate Button */}
        <Button 
          onClick={handleNavigate}
          className="w-full rounded-2xl h-12"
        >
          <Navigation className="w-4 h-4 mr-2" />
          Get Directions
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </Card>
  );
};
