import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrustedContactCard } from '@/components/TrustedContactCard';
import { useApp } from '@/contexts/AppContext';
import { 
  Users, 
  Plus,
  Shield,
  Bell
} from 'lucide-react';

export const ContactsPage: React.FC = () => {
  const { trustedContacts } = useApp();

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 mx-auto rounded-full gradient-primary flex items-center justify-center shadow-glow">
          <Users className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-bold">Trusted Contacts</h2>
        <p className="text-muted-foreground">
          People who will be notified in emergencies
        </p>
      </div>

      {/* Add contact button */}
      <Button variant="outline" className="w-full gap-2 border-dashed h-14">
        <Plus className="w-5 h-5" />
        Add Trusted Contact
      </Button>

      {/* Contacts list */}
      <div className="space-y-3">
        {trustedContacts.map((contact) => (
          <TrustedContactCard
            key={contact.id}
            contact={contact}
            onCall={() => window.location.href = `tel:${contact.phone}`}
            onMessage={() => window.location.href = `sms:${contact.phone}`}
          />
        ))}
      </div>

      {/* Info cards */}
      <div className="space-y-3">
        <Card className="p-4 bg-safe/10 border-safe/20">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-safe mt-0.5" />
            <div>
              <h4 className="font-semibold">Emergency Notification</h4>
              <p className="text-sm text-muted-foreground mt-1">
                In case of emergency, all contacts will receive an alert with your 
                live location and can confirm your safety status.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-primary/10 border-primary/20">
          <div className="flex items-start gap-3">
            <Bell className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-semibold">Location Sharing</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Your trusted contacts can view your location at any time to ensure 
                your safety. Primary contacts receive priority alerts.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
