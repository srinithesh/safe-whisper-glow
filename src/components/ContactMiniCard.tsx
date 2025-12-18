import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ContactMiniCardProps {
  name: string;
  initials?: string;
  isOnline?: boolean;
  onClick?: () => void;
  className?: string;
}

export const ContactMiniCard: React.FC<ContactMiniCardProps> = ({
  name,
  initials,
  isOnline = true,
  onClick,
  className,
}) => {
  const displayInitials = initials || name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <Card
      onClick={onClick}
      className={cn(
        "p-3 rounded-2xl shadow-soft cursor-pointer transition-all duration-200 hover:shadow-card",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
          {displayInitials}
        </div>
        <div>
          <p className="font-medium text-sm">{name}</p>
          <div className="flex items-center gap-1.5">
            <div className={cn(
              "w-2 h-2 rounded-full",
              isOnline ? "bg-safe" : "bg-muted"
            )} />
            <span className={cn(
              "text-xs",
              isOnline ? "text-safe" : "text-muted-foreground"
            )}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
