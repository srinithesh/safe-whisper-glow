import React from 'react';
import { Card } from '@/components/ui/card';
import { Shield, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface SafeStatusHeaderProps {
  userName: string;
  status: 'safe' | 'alert' | 'emergency';
  verifiedAt?: Date;
  className?: string;
}

export const SafeStatusHeader: React.FC<SafeStatusHeaderProps> = ({
  userName,
  status,
  verifiedAt = new Date(),
  className,
}) => {
  const statusConfig = {
    safe: {
      label: 'is SAFE',
      sublabel: 'VERIFIED BY AI',
      color: 'text-safe',
      icon: CheckCircle,
      bg: 'bg-safe',
    },
    alert: {
      label: 'needs attention',
      sublabel: 'VERIFYING',
      color: 'text-warning',
      icon: Shield,
      bg: 'bg-warning',
    },
    emergency: {
      label: 'EMERGENCY',
      sublabel: 'HELP NEEDED',
      color: 'text-emergency',
      icon: Shield,
      bg: 'bg-emergency',
    },
  };

  const config = statusConfig[status];

  return (
    <Card className={cn(
      "p-4 rounded-3xl shadow-card",
      status === 'emergency' && "pulse-emergency bg-emergency/5",
      className
    )}>
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center",
          config.bg
        )}>
          <Shield className="w-6 h-6 text-card" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg">
            {userName} <span className={config.color}>{config.label}</span>
          </h3>
          <p className="text-xs text-muted-foreground">
            {config.sublabel} • {format(verifiedAt, "'JUST NOW'")}
          </p>
        </div>
        <div className={cn(
          "w-3 h-3 rounded-full",
          status === 'safe' && "bg-safe status-dot-safe",
          status === 'alert' && "bg-warning status-dot-warning",
          status === 'emergency' && "bg-emergency status-dot-emergency"
        )} />
      </div>
    </Card>
  );
};
