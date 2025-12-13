import React from 'react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { EmergencyStatus, UserRole } from '@/types';
import { Heart, ArrowLeftRight, Settings } from 'lucide-react';

interface HeaderProps {
  userName: string;
  status: EmergencyStatus;
  currentRole: UserRole;
  onSwitchRole: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userName,
  status,
  currentRole,
  onSwitchRole,
}) => {
  const roleLabel = currentRole === 'pregnant_woman' ? 'Mother' : 'Trusted Contact';

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
      <div className="max-w-lg mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground" fill="currentColor" />
            </div>
            <div>
              <h1 className="text-lg font-bold">MotherGuard</h1>
              <p className="text-xs text-muted-foreground">{roleLabel} View</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge status={status} size="sm" />
            <Button
              variant="ghost"
              size="icon"
              onClick={onSwitchRole}
              title="Switch Role"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
