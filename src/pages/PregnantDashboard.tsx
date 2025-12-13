import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { VoiceIndicator } from '@/components/VoiceIndicator';
import { EmergencyButton } from '@/components/EmergencyButton';
import { SafetyVerification } from '@/components/SafetyVerification';
import { ReminderCard } from '@/components/ReminderCard';
import { TrustedContactCard } from '@/components/TrustedContactCard';
import { useApp } from '@/contexts/AppContext';
import { mockPregnantUser } from '@/data/mockData';
import { 
  Heart, 
  Baby, 
  Calendar,
  Mic,
  MicOff,
  Shield
} from 'lucide-react';

export const PregnantDashboard: React.FC = () => {
  const {
    userName,
    emergencyStatus,
    isListening,
    isVoiceSupported,
    lastTranscript,
    timeRemaining,
    triggerEmergency,
    verifySafe,
    voiceEnabled,
    toggleVoiceDetection,
    reminders,
    completeReminder,
    trustedContacts,
  } = useApp();

  const upcomingReminders = reminders
    .filter((r) => !r.isCompleted)
    .slice(0, 3);

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      {/* Welcome section */}
      <div className="text-center space-y-2">
        <div className="w-20 h-20 mx-auto rounded-full gradient-primary flex items-center justify-center shadow-glow float-animation">
          <Baby className="w-10 h-10 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-bold">Hello, {userName.split(' ')[0]}!</h2>
        <p className="text-muted-foreground">
          Week {mockPregnantUser.weeksPregnant} • Due {mockPregnantUser.dueDate}
        </p>
        <div className="flex justify-center">
          <StatusBadge status={emergencyStatus} size="lg" />
        </div>
      </div>

      {/* Safety verification prompt */}
      {emergencyStatus === 'alert' && timeRemaining && (
        <SafetyVerification
          timeRemaining={timeRemaining}
          onConfirmSafe={() => verifySafe('button')}
        />
      )}

      {/* Voice detection toggle */}
      <Card className="p-4 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Voice Safety Monitor</h3>
          </div>
          <Button
            variant={voiceEnabled ? 'default' : 'outline'}
            size="sm"
            onClick={toggleVoiceDetection}
            disabled={!isVoiceSupported}
          >
            {voiceEnabled ? (
              <>
                <Mic className="w-4 h-4 mr-1" />
                On
              </>
            ) : (
              <>
                <MicOff className="w-4 h-4 mr-1" />
                Off
              </>
            )}
          </Button>
        </div>
        <VoiceIndicator
          isListening={isListening}
          isSupported={isVoiceSupported}
          lastTranscript={lastTranscript}
        />
      </Card>

      {/* Emergency button */}
      <div className="flex flex-col items-center py-4">
        <EmergencyButton
          onTrigger={() => triggerEmergency('manual')}
          disabled={emergencyStatus === 'emergency'}
        />
      </div>

      {/* Upcoming reminders */}
      {upcomingReminders.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Upcoming Reminders</h3>
            <span className="text-sm text-muted-foreground">
              {upcomingReminders.length} pending
            </span>
          </div>
          {upcomingReminders.map((reminder) => (
            <ReminderCard
              key={reminder.id}
              reminder={reminder}
              onComplete={(method) => completeReminder(reminder.id, method)}
            />
          ))}
        </div>
      )}

      {/* Primary contact quick access */}
      <div className="space-y-3">
        <h3 className="font-semibold">Primary Contact</h3>
        {trustedContacts
          .filter((c) => c.isPrimary)
          .map((contact) => (
            <TrustedContactCard
              key={contact.id}
              contact={contact}
              onCall={() => window.location.href = `tel:${contact.phone}`}
              onMessage={() => window.location.href = `sms:${contact.phone}`}
            />
          ))}
      </div>
    </div>
  );
};
