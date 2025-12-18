import React from 'react';
import { Card } from '@/components/ui/card';
import { ChevronDown, Shield, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIStatusCardProps {
  isMonitoring: boolean;
  status: 'safe' | 'alert' | 'emergency' | 'resolved';
  className?: string;
}

export const AIStatusCard: React.FC<AIStatusCardProps> = ({
  isMonitoring,
  status,
  className,
}) => {
  return (
    <Card 
      className={cn(
        "p-4 rounded-3xl shadow-card transition-all duration-300",
        status === 'safe' && "bg-safe/10 border-safe/30",
        status === 'alert' && "bg-warning/10 border-warning/30",
        status === 'emergency' && "bg-emergency/10 border-emergency/30 pulse-emergency",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            "status-dot",
            status === 'safe' && "status-dot-safe",
            status === 'alert' && "status-dot-warning",
            status === 'emergency' && "status-dot-emergency"
          )} />
          <div>
            <h3 className="font-semibold text-foreground">AI Safety Check</h3>
            <p className="text-sm text-muted-foreground">
              {isMonitoring ? 'System Active & Monitoring' : 'System Paused'}
            </p>
          </div>
        </div>
        <ChevronDown className="w-5 h-5 text-muted-foreground" />
      </div>
    </Card>
  );
};
