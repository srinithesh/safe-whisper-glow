import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrustedContactCard } from '@/components/TrustedContactCard';
import { AddContactDialog } from '@/components/AddContactDialog';
import { useApp } from '@/contexts/AppContext';
import { Users, Shield, Bell } from 'lucide-react';

export const ContactsPage: React.FC = () => {
  const { trustedContacts, addContact, deleteContact } = useApp();

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 mx-auto rounded-full gradient-primary flex items-center justify-center shadow-glow">
          <Users className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-bold">Trusted Contacts</h2>
        <p className="text-muted-foreground">
          {trustedContacts.length} contact{trustedContacts.length !== 1 ? 's' : ''} will be notified in emergencies
        </p>
      </div>

      <AddContactDialog onAdd={addContact} />

      <div className="space-y-3">
        {trustedContacts.map((contact) => (
          <TrustedContactCard
            key={contact.id}
            contact={contact}
            onCall={() => window.location.href = `tel:${contact.phone}`}
            onMessage={() => window.location.href = `sms:${contact.phone}`}
            onDelete={() => deleteContact(contact.id)}
          />
        ))}
      </div>

      <Card className="p-4 bg-safe/10 border-safe/20">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-safe mt-0.5" />
          <div>
            <h4 className="font-semibold">Emergency Notification</h4>
            <p className="text-sm text-muted-foreground mt-1">
              All contacts receive alerts with your live location. Primary contacts get priority.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
