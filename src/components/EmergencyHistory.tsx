import React from 'react';
import { Card } from '@/components/ui/card';
import { EmergencyEvent } from '@/types';
import { format, formatDistanceToNow } from 'date-fns';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Mic, 
  Hand,
  Timer
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmergencyHistoryProps {
  events: EmergencyEvent[];
  className?: string;
}

const statusConfig = {
  safe: { icon: CheckCircle, color: 'text-safe', bg: 'bg-safe/10' },
  monitoring: { icon: Timer, color: 'text-accent-foreground', bg: 'bg-accent/10' },
  alert: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10' },
  emergency: { icon: AlertTriangle, color: 'text-emergency', bg: 'bg-emergency/10' },
  resolved: { icon: CheckCircle, color: 'text-safe', bg: 'bg-safe/10' },
};

const triggerConfig = {
  voice: { icon: Mic, label: 'Voice detected' },
  manual: { icon: Hand, label: 'Manual trigger' },
  inactivity: { icon: Timer, label: 'Inactivity detected' },
};

export const EmergencyHistory: React.FC<EmergencyHistoryProps> = ({ events, className }) => {
  if (events.length === 0) {
    return (
      <Card className={cn('p-6 text-center', className)}>
        <CheckCircle className="w-10 h-10 mx-auto text-safe mb-3" />
        <p className="font-semibold">No Emergency History</p>
        <p className="text-sm text-muted-foreground mt-1">
          All clear! No emergency events recorded.
        </p>
      </Card>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {events.map((event) => {
        const statusCfg = statusConfig[event.status];
        const triggerCfg = triggerConfig[event.triggerType];
        const StatusIcon = statusCfg.icon;
        const TriggerIcon = triggerCfg.icon;

        return (
          <Card key={event.id} className="p-4">
            <div className="flex items-start gap-3">
              <div className={cn('w-10 h-10 rounded-full flex items-center justify-center', statusCfg.bg)}>
                <StatusIcon className={cn('w-5 h-5', statusCfg.color)} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={cn('font-semibold capitalize', statusCfg.color)}>
                    {event.status}
                  </span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <TriggerIcon className="w-3 h-3" />
                    {triggerCfg.label}
                    {event.keyword && ` ("${event.keyword}")`}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{format(event.triggeredAt, 'MMM d, h:mm a')}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(event.triggeredAt, { addSuffix: true })}</span>
                </div>

                {event.resolvedAt && (
                  <p className="text-xs text-safe mt-1">
                    Resolved {formatDistanceToNow(event.resolvedAt, { addSuffix: true })}
                    {event.resolvedBy && ` by ${event.resolvedBy}`}
                  </p>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
