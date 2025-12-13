import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  variant?: 'default' | 'primary' | 'safe' | 'warning' | 'emergency';
  className?: string;
}

const variantStyles = {
  default: 'bg-card',
  primary: 'bg-primary/10 border-primary/20',
  safe: 'bg-safe/10 border-safe/20',
  warning: 'bg-warning/10 border-warning/20',
  emergency: 'bg-emergency/10 border-emergency/20',
};

const iconStyles = {
  default: 'bg-muted text-muted-foreground',
  primary: 'bg-primary/20 text-primary',
  safe: 'bg-safe/20 text-safe',
  warning: 'bg-warning/20 text-warning',
  emergency: 'bg-emergency/20 text-emergency',
};

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  variant = 'default',
  className,
}) => {
  return (
    <Card className={cn('p-4 transition-all hover:shadow-md', variantStyles[variant], className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          {trend && trendValue && (
            <p className={cn(
              'text-xs font-medium',
              trend === 'up' && 'text-safe',
              trend === 'down' && 'text-emergency',
              trend === 'neutral' && 'text-muted-foreground'
            )}>
              {trend === 'up' && '↑'}
              {trend === 'down' && '↓'}
              {trendValue}
            </p>
          )}
        </div>
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', iconStyles[variant])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </Card>
  );
};
