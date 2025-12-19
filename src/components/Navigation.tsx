import React from 'react';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Bell, 
  MapPin, 
  Users, 
  Settings,
  FolderOpen
} from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'reminders', label: 'Reminders', icon: Bell },
  { id: 'digilocker', label: 'DigiLocker', icon: FolderOpen },
  { id: 'location', label: 'Location', icon: MapPin },
  { id: 'contacts', label: 'Contacts', icon: Users },
];

export const Navigation: React.FC<NavigationProps> = ({
  currentPage,
  onNavigate,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border z-50 safe-area-bottom">
      <div className="max-w-lg mx-auto px-2 py-2">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  'flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-300',
                  isActive 
                    ? 'text-primary bg-primary/10' 
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className={cn(
                  'w-5 h-5 transition-transform',
                  isActive && 'scale-110'
                )} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
