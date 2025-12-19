import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle,
  Shield,
  AlertTriangle,
  FileText,
  MapPin,
  Mic,
  Activity,
  Clock,
  Pill
} from 'lucide-react';
import { ActivityLogEntry, ActivityType } from '@/types';
import { format, formatDistanceToNow } from 'date-fns';

interface EnhancedActivityLogProps {
  entries: ActivityLogEntry[];
  maxEntries?: number;
}

const getActivityIcon = (type: ActivityType) => {
  const icons: Record<ActivityType, React.ElementType> = {
    reminder_confirmed: Pill,
    safety_verified: Shield,
    emergency_triggered: AlertTriangle,
    emergency_resolved: CheckCircle,
    documents_shared: FileText,
    location_updated: MapPin,
    voice_detected: Mic,
    check_in: Activity,
    movement_detected: Activity,
  };
  return icons[type] || Activity;
};

const getActivityColor = (type: ActivityType) => {
  const colors: Record<ActivityType, string> = {
    reminder_confirmed: 'text-primary bg-primary/10',
    safety_verified: 'text-safe bg-safe/10',
    emergency_triggered: 'text-emergency bg-emergency/10',
    emergency_resolved: 'text-safe bg-safe/10',
    documents_shared: 'text-info bg-info/10',
    location_updated: 'text-info bg-info/10',
    voice_detected: 'text-primary bg-primary/10',
    check_in: 'text-safe bg-safe/10',
    movement_detected: 'text-muted-foreground bg-muted',
  };
  return colors[type] || 'text-muted-foreground bg-muted';
};

const getActivityBadge = (type: ActivityType): { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' } => {
  const badges: Record<ActivityType, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    reminder_confirmed: { label: 'Reminder', variant: 'default' },
    safety_verified: { label: 'Safety', variant: 'secondary' },
    emergency_triggered: { label: 'Emergency', variant: 'destructive' },
    emergency_resolved: { label: 'Resolved', variant: 'secondary' },
    documents_shared: { label: 'Documents', variant: 'outline' },
    location_updated: { label: 'Location', variant: 'outline' },
    voice_detected: { label: 'Voice', variant: 'default' },
    check_in: { label: 'Check-in', variant: 'secondary' },
    movement_detected: { label: 'Movement', variant: 'outline' },
  };
  return badges[type] || { label: 'Activity', variant: 'outline' };
};

export const EnhancedActivityLog: React.FC<EnhancedActivityLogProps> = ({ 
  entries, 
  maxEntries = 10 
}) => {
  const displayEntries = entries.slice(0, maxEntries);

  return (
    <Card className="p-4 rounded-3xl shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Activity Log</h3>
        </div>
        <Badge variant="outline" className="text-xs">
          {entries.length} events
        </Badge>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />

        <div className="space-y-4">
          {displayEntries.map((entry, index) => {
            const Icon = getActivityIcon(entry.type);
            const colorClass = getActivityColor(entry.type);
            const badge = getActivityBadge(entry.type);

            return (
              <div key={entry.id} className="relative flex gap-4 pl-2">
                {/* Icon */}
                <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${colorClass}`}>
                  <Icon className="w-4 h-4" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pb-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-sm">{entry.title}</p>
                        <Badge variant={badge.variant} className="text-xs">
                          {badge.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {entry.description}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDistanceToNow(entry.timestamp, { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {entries.length > maxEntries && (
        <button className="w-full text-center text-sm text-primary font-medium mt-2 hover:underline">
          View all {entries.length} events
        </button>
      )}
    </Card>
  );
};
