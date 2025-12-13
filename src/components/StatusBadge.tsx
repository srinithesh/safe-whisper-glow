import React from 'react';
import { cn } from '@/lib/utils';
import { EmergencyStatus } from '@/types';
import { Shield, AlertTriangle, Siren, CheckCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: EmergencyStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const statusConfig = {
  safe: {
    label: 'Safe',
    icon: Shield,
    className: 'bg-safe/20 text-safe border-safe/30',
  },
  monitoring: {
    label: 'Monitoring',
    icon: Shield,
    className: 'bg-accent/20 text-accent-foreground border-accent/30',
  },
  alert: {
    label: 'Alert',
    icon: AlertTriangle,
    className: 'bg-warning/20 text-warning border-warning/30 animate-pulse',
  },
  emergency: {
    label: 'Emergency',
    icon: Siren,
    className: 'bg-emergency/20 text-emergency border-emergency/30 pulse-emergency',
  },
  resolved: {
    label: 'Resolved',
    icon: CheckCircle,
    className: 'bg-safe/20 text-safe border-safe/30',
  },
};

const sizeConfig = {
  sm: 'px-2 py-1 text-xs gap-1',
  md: 'px-3 py-1.5 text-sm gap-1.5',
  lg: 'px-4 py-2 text-base gap-2',
};

const iconSizeConfig = {
  sm: 12,
  md: 16,
  lg: 20,
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showLabel = true,
}) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border font-medium',
        config.className,
        sizeConfig[size]
      )}
    >
      <Icon size={iconSizeConfig[size]} />
      {showLabel && <span>{config.label}</span>}
    </div>
  );
};
