import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { VoiceIndicator } from '@/components/VoiceIndicator';
import { EmergencyButton } from '@/components/EmergencyButton';
import { SafetyVerification } from '@/components/SafetyVerification';
import { ReminderCard } from '@/components/ReminderCard';
import { TrustedContactCard } from '@/components/TrustedContactCard';
import { PregnancyTracker } from '@/components/PregnancyTracker';
import { StatsCard } from '@/components/StatsCard';
import { useApp } from '@/contexts/AppContext';
import { mockPregnantUser } from '@/data/mockData';
import { Heart, Mic, MicOff, Shield, Bell, Users, Activity } from 'lucide-react';

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

  const upcomingReminders = reminders.filter((r) => !r.isCompleted).slice(0, 2);
  const completedToday = reminders.filter((r) => r.isCompleted).length;
  const primaryContact = trustedContacts.find((c) => c.isPrimary);

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Hello, {userName.split(' ')[0]}!</h2>
          <p className="text-muted-foreground">Week {mockPregnantUser.weeksPregnant}</p>
        </div>
        <StatusBadge status={emergencyStatus} size="lg" />
      </div>

      {/* Safety verification */}
      {emergencyStatus === 'alert' && timeRemaining && (
        <SafetyVerification timeRemaining={timeRemaining} onConfirmSafe={() => verifySafe('button')} />
      )}

      {/* Pregnancy tracker */}
      <PregnancyTracker weeksPregnant={mockPregnantUser.weeksPregnant} dueDate={mockPregnantUser.dueDate} />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatsCard title="Reminders" value={completedToday} subtitle="done today" icon={Bell} variant="safe" />
        <StatsCard title="Contacts" value={trustedContacts.length} subtitle="trusted" icon={Users} variant="primary" />
        <StatsCard title="Status" value={emergencyStatus === 'safe' ? 'OK' : '!'} icon={Activity} variant={emergencyStatus === 'safe' ? 'safe' : 'warning'} />
      </div>

      {/* Voice detection */}
      <Card className="p-4 shadow-soft">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Voice Safety Monitor</h3>
          </div>
          <Button variant={voiceEnabled ? 'default' : 'outline'} size="sm" onClick={toggleVoiceDetection} disabled={!isVoiceSupported}>
            {voiceEnabled ? <><Mic className="w-4 h-4 mr-1" /> On</> : <><MicOff className="w-4 h-4 mr-1" /> Off</>}
          </Button>
        </div>
        <VoiceIndicator isListening={isListening} isSupported={isVoiceSupported} lastTranscript={lastTranscript} />
      </Card>

      {/* Emergency button */}
      <div className="flex flex-col items-center py-4">
        <EmergencyButton onTrigger={() => triggerEmergency('manual')} disabled={emergencyStatus === 'emergency'} />
      </div>

      {/* Upcoming reminders */}
      {upcomingReminders.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2"><Bell className="w-4 h-4" /> Next Reminders</h3>
          {upcomingReminders.map((r) => (
            <ReminderCard key={r.id} reminder={r} onComplete={(m) => completeReminder(r.id, m)} />
          ))}
        </div>
      )}

      {/* Primary contact */}
      {primaryContact && (
        <div className="space-y-3">
          <h3 className="font-semibold">Primary Contact</h3>
          <TrustedContactCard
            contact={primaryContact}
            onCall={() => window.location.href = `tel:${primaryContact.phone}`}
            onMessage={() => window.location.href = `sms:${primaryContact.phone}`}
            showActions={true}
          />
        </div>
      )}
    </div>
  );
};
