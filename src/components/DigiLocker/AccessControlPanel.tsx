import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  User, 
  Shield, 
  Check, 
  X,
  Info
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

interface AccessControlPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AccessControlPanel: React.FC<AccessControlPanelProps> = ({
  open,
  onOpenChange,
}) => {
  const { trustedContacts, digiLockerAccess, updateDocumentAccess } = useApp();

  const getAccessStatus = (contactId: string) => {
    return digiLockerAccess.find(a => a.userId === contactId);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md rounded-l-3xl">
        <SheetHeader className="mb-6">
          <SheetTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Document Access Control
          </SheetTitle>
        </SheetHeader>

        {/* Info Card */}
        <Card className="p-4 rounded-2xl bg-info/5 border-info/20 mb-6">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-info">Privacy First</p>
              <p className="text-sm text-muted-foreground">
                Control who can access your documents. Emergency responders only get access during active emergencies.
              </p>
            </div>
          </div>
        </Card>

        {/* Access Categories */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Trusted Contacts
          </h3>

          {trustedContacts.map(contact => {
            const access = getAccessStatus(contact.id);
            const hasAccess = access?.canView ?? false;

            return (
              <Card key={contact.id} className="p-4 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {contact.relationship}
                        </Badge>
                        {contact.isPrimary && (
                          <Badge className="text-xs bg-primary/10 text-primary">
                            Primary
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Switch 
                    checked={hasAccess}
                    onCheckedChange={(checked) => 
                      updateDocumentAccess(contact.id, 
                        contact.relationship.toLowerCase() === 'husband' ? 'husband' : 'relative',
                        checked
                      )
                    }
                  />
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm">
                  {hasAccess ? (
                    <>
                      <Check className="w-4 h-4 text-safe" />
                      <span className="text-safe">Can view documents</span>
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">No access</span>
                    </>
                  )}
                </div>
              </Card>
            );
          })}

          {/* Emergency Responders */}
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide pt-4">
            Emergency Responders
          </h3>
          
          <Card className="p-4 rounded-2xl border-warning/20 bg-warning/5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="font-medium">Emergency Services</p>
                <p className="text-sm text-muted-foreground">Hospitals, Ambulance, 911</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-warning">
              <Info className="w-4 h-4" />
              <span>Auto-access during active emergencies only</span>
            </div>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
};
