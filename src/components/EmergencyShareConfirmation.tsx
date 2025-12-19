import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle,
  FileText,
  MapPin,
  Users,
  Shield,
  X
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

interface EmergencyShareConfirmationProps {
  show: boolean;
  onDismiss: () => void;
}

export const EmergencyShareConfirmation: React.FC<EmergencyShareConfirmationProps> = ({
  show,
  onDismiss,
}) => {
  const { trustedContacts, digiLockerDocuments } = useApp();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onDismiss();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onDismiss]);

  if (!visible) return null;

  const sharedDocuments = digiLockerDocuments.filter(
    d => d.accessLevel === 'emergency_only' || d.accessLevel === 'trusted_contacts'
  );
  const notifiedContacts = trustedContacts.filter(c => c.isPrimary);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
      <Card className="w-full max-w-sm p-6 rounded-3xl bg-background animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-safe/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-safe" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Emergency Shared</h3>
              <p className="text-sm text-muted-foreground">Contacts notified</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onDismiss}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Shared Items */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-safe/5 border border-safe/20">
            <CheckCircle className="w-5 h-5 text-safe" />
            <div className="flex-1">
              <p className="font-medium">Live Location</p>
              <p className="text-sm text-muted-foreground">Real-time GPS shared</p>
            </div>
            <MapPin className="w-5 h-5 text-muted-foreground" />
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-safe/5 border border-safe/20">
            <CheckCircle className="w-5 h-5 text-safe" />
            <div className="flex-1">
              <p className="font-medium">Emergency Documents</p>
              <p className="text-sm text-muted-foreground">
                {sharedDocuments.length} documents accessible
              </p>
            </div>
            <FileText className="w-5 h-5 text-muted-foreground" />
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-safe/5 border border-safe/20">
            <CheckCircle className="w-5 h-5 text-safe" />
            <div className="flex-1">
              <p className="font-medium">Contacts Notified</p>
              <p className="text-sm text-muted-foreground">
                {notifiedContacts.map(c => c.name.split(' ')[0]).join(', ')}
              </p>
            </div>
            <Users className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-center text-muted-foreground">
          This message will close automatically
        </p>
      </Card>
    </div>
  );
};
