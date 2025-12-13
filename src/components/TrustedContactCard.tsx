import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { TrustedContact } from '@/types';
import { Phone, MessageCircle, Star, User } from 'lucide-react';

interface TrustedContactCardProps {
  contact: TrustedContact;
  onCall?: () => void;
  onMessage?: () => void;
}

export const TrustedContactCard: React.FC<TrustedContactCardProps> = ({
  contact,
  onCall,
  onMessage,
}) => {
  return (
    <Card className={cn(
      'p-4 transition-all duration-300',
      contact.isPrimary && 'ring-2 ring-primary/30 shadow-soft'
    )}>
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-7 h-7 text-primary" />
          </div>
          {contact.isPrimary && (
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-warning flex items-center justify-center">
              <Star className="w-3 h-3 text-warning-foreground" fill="currentColor" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold truncate">{contact.name}</h4>
            {contact.isPrimary && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                Primary
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{contact.relationship}</p>
          <p className="text-xs text-muted-foreground mt-1">{contact.phone}</p>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            variant="default"
            size="icon"
            onClick={onCall}
          >
            <Phone className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onMessage}
          >
            <MessageCircle className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
