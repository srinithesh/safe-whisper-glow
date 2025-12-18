import React from 'react';
import { Card } from '@/components/ui/card';
import { Activity, Wind, PersonStanding, Battery, Watch } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VitalsCardProps {
  heartRate?: number;
  oxygen?: number;
  movement?: 'stationary' | 'walking' | 'active';
  movementDuration?: string;
  phoneBattery?: number;
  watchBattery?: number;
  className?: string;
}

export const VitalsCard: React.FC<VitalsCardProps> = ({
  heartRate = 78,
  oxygen = 98,
  movement = 'stationary',
  movementDuration = '10 mins',
  phoneBattery = 84,
  watchBattery = 62,
  className,
}) => {
  // Generate mock heart rate bars
  const bars = Array.from({ length: 12 }, (_, i) => ({
    height: Math.random() * 60 + 20,
  }));

  const movementLabels = {
    stationary: 'Stationary',
    walking: 'Walking',
    active: 'Active',
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Heart Rate */}
      <Card className="p-4 rounded-3xl shadow-card">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">HEART RATE</span>
          <span className="text-safe font-medium">Normal</span>
        </div>
        <div className="flex items-end gap-1 mb-3">
          <span className="text-4xl font-bold">{heartRate}</span>
          <span className="text-muted-foreground mb-1">bpm</span>
        </div>
        <div className="flex items-end gap-1 h-12">
          {bars.map((bar, i) => (
            <div
              key={i}
              className="flex-1 bg-muted rounded-t bar-animate"
              style={{ 
                height: `${bar.height}%`,
                animationDelay: `${i * 50}ms`,
              }}
            />
          ))}
        </div>
      </Card>

      {/* Movement & Oxygen */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4 rounded-3xl shadow-card">
          <div className="flex items-center gap-2 mb-2">
            <PersonStanding className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">MOVEMENT</span>
          </div>
          <p className="font-bold">{movementLabels[movement]}</p>
          <p className="text-xs text-muted-foreground">Since {movementDuration} ago</p>
        </Card>

        <Card className="p-4 rounded-3xl shadow-card">
          <div className="flex items-center gap-2 mb-2">
            <Wind className="w-4 h-4 text-emergency" />
            <span className="text-xs font-medium text-muted-foreground">OXYGEN</span>
          </div>
          <p className="font-bold">{oxygen}%</p>
          <p className="text-xs text-muted-foreground">SpO2</p>
        </Card>
      </div>

      {/* Device Status */}
      <Card className="p-4 rounded-3xl shadow-card">
        <h4 className="text-sm font-medium text-muted-foreground mb-3">DEVICE STATUS</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Battery className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Phone Battery</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all",
                    phoneBattery > 50 ? "bg-safe" : phoneBattery > 20 ? "bg-warning" : "bg-emergency"
                  )}
                  style={{ width: `${phoneBattery}%` }}
                />
              </div>
              <span className={cn(
                "text-sm font-medium",
                phoneBattery > 50 ? "text-safe" : phoneBattery > 20 ? "text-warning" : "text-emergency"
              )}>
                {phoneBattery}%
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Watch className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Watch Battery</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all",
                    watchBattery > 50 ? "bg-safe" : watchBattery > 20 ? "bg-warning" : "bg-emergency"
                  )}
                  style={{ width: `${watchBattery}%` }}
                />
              </div>
              <span className={cn(
                "text-sm font-medium",
                watchBattery > 50 ? "text-safe" : watchBattery > 20 ? "text-warning" : "text-emergency"
              )}>
                {watchBattery}%
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
