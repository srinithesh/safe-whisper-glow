import React from 'react';
import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickActionCardProps {
  icon: LucideIcon;
  label: string;
  variant?: 'default' | 'emergency' | 'primary';
  onClick?: () => void;
  className?: string;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  icon: Icon,
  label,
  variant = 'default',
  onClick,
  className,
}) => {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "p-6 rounded-3xl shadow-card cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]",
        variant === 'default' && "bg-card hover:bg-muted/50",
        variant === 'emergency' && "bg-emergency/10 hover:bg-emergency/20 border-emergency/30",
        variant === 'primary' && "bg-primary/10 hover:bg-primary/20 border-primary/30",
        className
      )}
    >
      <div className="flex flex-col items-center gap-3">
        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center",
          variant === 'default' && "bg-primary/10",
          variant === 'emergency' && "bg-emergency/20",
          variant === 'primary' && "bg-primary/20"
        )}>
          <Icon className={cn(
            "w-6 h-6",
            variant === 'default' && "text-primary",
            variant === 'emergency' && "text-emergency",
            variant === 'primary' && "text-primary"
          )} />
        </div>
        <span className={cn(
          "font-medium text-sm",
          variant === 'emergency' && "text-emergency"
        )}>
          {label}
        </span>
      </div>
    </Card>
  );
};
