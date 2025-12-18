import React from 'react';
import { cn } from '@/lib/utils';
import { Baby, Heart } from 'lucide-react';

interface RoleToggleProps {
  role: 'pregnant' | 'trusted';
  onChange: (role: 'pregnant' | 'trusted') => void;
  className?: string;
}

export const RoleToggle: React.FC<RoleToggleProps> = ({
  role,
  onChange,
  className,
}) => {
  return (
    <div className={cn(
      "flex items-center gap-1 p-1 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 shadow-sm",
      className
    )}>
      <button
        onClick={() => onChange('pregnant')}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
          role === 'pregnant' 
            ? "bg-primary text-primary-foreground shadow-sm" 
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Baby className="w-3 h-3" />
        <span className="hidden sm:inline">PREGNANT MOM VIEW</span>
        <span className="sm:hidden">MOM</span>
      </button>
      <button
        onClick={() => onChange('trusted')}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
          role === 'trusted' 
            ? "bg-safe text-safe-foreground shadow-sm" 
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Heart className="w-3 h-3" />
        <span className="hidden sm:inline">HUSBAND VIEW</span>
        <span className="sm:hidden">HUSBAND</span>
      </button>
    </div>
  );
};
