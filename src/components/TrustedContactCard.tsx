import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { TrustedContact } from '@/types';
import { Phone, MessageCircle, Star, User, MoreVertical, Trash2, Edit2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TrustedContactCardProps {
  contact: TrustedContact;
  onCall?: () => void;
  onMessage?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

export const TrustedContactCard: React.FC<TrustedContactCardProps> = ({
  contact,
  onCall,
  onMessage,
  onEdit,
  onDelete,
  showActions = true,
}) => {
  return (
    <Card className={cn(
      'p-4 transition-all duration-300 hover:shadow-md',
      contact.isPrimary && 'ring-2 ring-primary/30 shadow-soft'
    )}>
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
            <User className="w-7 h-7 text-primary" />
          </div>
          {contact.isPrimary && (
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-warning flex items-center justify-center shadow-sm">
              <Star className="w-3 h-3 text-warning-foreground" fill="currentColor" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold truncate">{contact.name}</h4>
            {contact.isPrimary && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                Primary
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{contact.relationship}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{contact.phone}</p>
        </div>

        {showActions && (
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="icon"
              onClick={onCall}
              className="h-10 w-10"
            >
              <Phone className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={onMessage}
              className="h-10 w-10"
            >
              <MessageCircle className="w-4 h-4" />
            </Button>
            
            {(onEdit || onDelete) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-10 w-10">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onEdit && (
                    <DropdownMenuItem onClick={onEdit}>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem onClick={onDelete} className="text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
