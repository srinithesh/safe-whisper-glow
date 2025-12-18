import React from 'react';
import { Card } from '@/components/ui/card';
import { MapPin, Pill, Shield, Footprints, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export interface TimelineEvent {
  id: string;
  type: 'location' | 'reminder' | 'safety' | 'movement' | 'alert';
  title: string;
  description: string;
  timestamp: Date;
}

interface ActivityTimelineProps {
  events: TimelineEvent[];
  className?: string;
}

const eventConfig = {
  location: {
    icon: MapPin,
    color: 'text-primary',
    bg: 'bg-primary/20',
  },
  reminder: {
    icon: Pill,
    color: 'text-warning',
    bg: 'bg-warning/20',
  },
  safety: {
    icon: Shield,
    color: 'text-safe',
    bg: 'bg-safe/20',
  },
  movement: {
    icon: Footprints,
    color: 'text-accent-foreground',
    bg: 'bg-accent/40',
  },
  alert: {
    icon: Bell,
    color: 'text-emergency',
    bg: 'bg-emergency/20',
  },
};

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  events,
  className,
}) => {
  if (events.length === 0) {
    return (
      <div className={cn("text-center py-8 text-muted-foreground", className)}>
        No activity recorded yet
      </div>
    );
  }

  return (
    <div className={cn("space-y-1", className)}>
      {events.map((event, index) => {
        const config = eventConfig[event.type];
        const Icon = config.icon;
        
        return (
          <div key={event.id} className="flex gap-3">
            {/* Timeline line and dot */}
            <div className="flex flex-col items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                config.bg
              )}>
                <Icon className={cn("w-4 h-4", config.color)} />
              </div>
              {index < events.length - 1 && (
                <div className="w-0.5 h-full bg-border my-1" />
              )}
            </div>
            
            {/* Content */}
            <div className="flex-1 pb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">
                  {format(event.timestamp, 'h:mm a')}
                </span>
              </div>
              <Card className="p-3 rounded-2xl bg-muted/30">
                <h4 className="font-medium text-sm">{event.title}</h4>
                <p className="text-xs text-muted-foreground">{event.description}</p>
              </Card>
            </div>
          </div>
        );
      })}
    </div>
  );
};
