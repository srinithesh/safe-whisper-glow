import React from 'react';
import { Card } from '@/components/ui/card';
import { Activity, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HealthCheckCardProps {
  status: 'normal' | 'warning' | 'critical';
  lastActivity?: string;
  className?: string;
}

export const HealthCheckCard: React.FC<HealthCheckCardProps> = ({
  status = 'normal',
  lastActivity = 'Based on activity & voice',
  className,
}) => {
  const statusConfig = {
    normal: {
      label: 'Normal',
      icon: Check,
      color: 'text-safe',
      bg: 'bg-safe/10',
    },
    warning: {
      label: 'Attention',
      icon: Activity,
      color: 'text-warning',
      bg: 'bg-warning/10',
    },
    critical: {
      label: 'Critical',
      icon: Activity,
      color: 'text-emergency',
      bg: 'bg-emergency/10',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Card className={cn("p-4 rounded-3xl shadow-card", className)}>
      <div className="flex items-center gap-4">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", config.bg)}>
          <Activity className={cn("w-6 h-6", config.color)} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">Health Check: {config.label}</h3>
          <p className="text-sm text-muted-foreground">{lastActivity}</p>
        </div>
        <Icon className={cn("w-6 h-6", config.color)} />
      </div>
    </Card>
  );
};
