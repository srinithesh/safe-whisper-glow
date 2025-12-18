import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { VoiceIndicator } from '@/components/VoiceIndicator';
import { EmergencyButton } from '@/components/EmergencyButton';
import { SafetyVerification } from '@/components/SafetyVerification';
import { ReminderCard } from '@/components/ReminderCard';
import { PregnancyTracker } from '@/components/PregnancyTracker';
import { AIStatusCard } from '@/components/AIStatusCard';
import { HealthCheckCard } from '@/components/HealthCheckCard';
import { QuickActionCard } from '@/components/QuickActionCard';
import { ContactMiniCard } from '@/components/ContactMiniCard';
import { RoleToggle } from '@/components/RoleToggle';
import { useApp } from '@/contexts/AppContext';
import { mockPregnantUser } from '@/data/mockData';
import { 
  Settings, 
  Info, 
  Mic, 
  MicOff, 
  Pill, 
  AlertCircle,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';

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
    setCurrentRole,
    emergencyHistory,
  } = useApp();

  const upcomingReminder = reminders.find((r) => !r.isCompleted);
  const primaryContacts = trustedContacts.slice(0, 2);
  const lastCheckIn = emergencyHistory.find(e => e.triggerType === 'voice' || e.triggerType === 'manual');

  return (
    <div className="min-h-screen pb-24 animate-fade-in scrollbar-hide">
      {/* Role Toggle Header */}
      <div className="flex justify-center pt-2 pb-4 sticky top-0 z-10">
        <RoleToggle 
          role="pregnant" 
          onChange={(r) => setCurrentRole(r === 'pregnant' ? 'pregnant_woman' : 'trusted_contact')}
        />
      </div>

      {/* Welcome Header */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Hello, {userName.split(' ')[0]}</h1>
            <button className="p-1 text-muted-foreground hover:text-foreground">
              <Info className="w-4 h-4" />
            </button>
            <button className="p-1 text-muted-foreground hover:text-foreground">
              <Settings className="w-4 h-4" />
            </button>
          </div>
          <span className="text-2xl">🤰</span>
        </div>
        <p className="text-muted-foreground">You are cared for and safe.</p>
      </div>

      {/* Safety verification */}
      {emergencyStatus === 'alert' && timeRemaining && (
        <div className="px-4 mb-4">
          <SafetyVerification 
            timeRemaining={timeRemaining} 
            onConfirmSafe={() => verifySafe('button')} 
          />
        </div>
      )}

      {/* Main Content */}
      <div className="px-4 space-y-4">
        {/* AI Status Card */}
        <AIStatusCard 
          isMonitoring={voiceEnabled && isListening}
          status={emergencyStatus === 'monitoring' ? 'safe' : emergencyStatus}
        />

        {/* Health Check Card */}
        <HealthCheckCard 
          status={emergencyStatus === 'safe' ? 'normal' : emergencyStatus === 'alert' ? 'warning' : 'critical'}
          lastActivity="Based on activity & voice"
        />

        {/* Active Reminder */}
        {upcomingReminder && (
          <Card className="p-4 rounded-3xl shadow-card bg-warning/10 border-warning/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-warning" />
                <span className="font-semibold">Reminder</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {format(upcomingReminder.scheduledTime, 'h:mm a')}
              </span>
            </div>
            <p className="text-sm mb-4">{upcomingReminder.description || `Did you take your ${upcomingReminder.title.toLowerCase()} today?`}</p>
            <div className="flex gap-3">
              <Button 
                onClick={() => completeReminder(upcomingReminder.id, 'button')}
                className="flex-1 rounded-2xl bg-primary hover:bg-primary/90"
              >
                Yes, I took them
              </Button>
              <Button 
                variant="outline"
                onClick={() => completeReminder(upcomingReminder.id, 'voice')}
                className="flex-1 rounded-2xl"
              >
                <Mic className="w-4 h-4 mr-2" />
                Confirm Voice
              </Button>
            </div>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <QuickActionCard 
            icon={Pill}
            label="Log Health"
            variant="primary"
          />
          <QuickActionCard 
            icon={AlertCircle}
            label="Need Help?"
            variant="emergency"
            onClick={() => triggerEmergency('manual')}
          />
        </div>

        {/* Trusted Contacts */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
            Trusted Contacts
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {primaryContacts.map(contact => (
              <ContactMiniCard
                key={contact.id}
                name={contact.relationship}
                initials={contact.name.split(' ').map(n => n[0]).join('')}
                isOnline={true}
                onClick={() => window.location.href = `tel:${contact.phone}`}
              />
            ))}
          </div>
        </div>

        {/* Emergency History */}
        <Card className="p-4 rounded-3xl shadow-card">
          <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
            Emergency History
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-muted" />
                <span className="text-sm">Last check-in</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {lastCheckIn ? format(lastCheckIn.triggeredAt, "'Today,' h:mm a") : 'Today, 10:42 AM'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-4 h-4 text-warning" />
                <span className="text-sm">Last alert</span>
              </div>
              <span className="text-sm text-primary">None</span>
            </div>
          </div>
        </Card>

        {/* Voice Monitor Toggle */}
        <Card className="p-4 rounded-3xl shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Voice Monitor</h3>
              <p className="text-sm text-muted-foreground">
                {voiceEnabled ? 'Listening for emergency keywords' : 'Tap to enable'}
              </p>
            </div>
            <Button 
              variant={voiceEnabled ? 'default' : 'outline'} 
              size="sm" 
              onClick={toggleVoiceDetection} 
              disabled={!isVoiceSupported}
              className="rounded-2xl"
            >
              {voiceEnabled ? <><Mic className="w-4 h-4 mr-1" /> On</> : <><MicOff className="w-4 h-4 mr-1" /> Off</>}
            </Button>
          </div>
          {voiceEnabled && (
            <div className="mt-3 pt-3 border-t border-border">
              <VoiceIndicator 
                isListening={isListening} 
                isSupported={isVoiceSupported} 
                lastTranscript={lastTranscript} 
              />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
