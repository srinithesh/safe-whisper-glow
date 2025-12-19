import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SafetyVerification } from '@/components/SafetyVerification';
import { ReminderCard } from '@/components/ReminderCard';
import { AIStatusCard } from '@/components/AIStatusCard';
import { HealthCheckCard } from '@/components/HealthCheckCard';
import { QuickActionCard } from '@/components/QuickActionCard';
import { ContactMiniCard } from '@/components/ContactMiniCard';
import { RoleToggle } from '@/components/RoleToggle';
import { DailyCheckinDialog } from '@/components/DailyCheckinDialog';
import { AISafetyPanel } from '@/components/AISafetyPanel';
import { EscalationTimer } from '@/components/EscalationTimer';
import { EnhancedActivityLog } from '@/components/EnhancedActivityLog';
import { EmergencyShareConfirmation } from '@/components/EmergencyShareConfirmation';
import { VoiceIndicator } from '@/components/VoiceIndicator';
import { useApp } from '@/contexts/AppContext';
import { mockPregnantUser } from '@/data/mockData';
import { ActivityLogEntry } from '@/types';
import { 
  Settings, 
  Info, 
  Mic, 
  MicOff, 
  Pill, 
  AlertCircle,
  FolderOpen,
  Shield
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
    activityLog,
    addActivityLog,
  } = useApp();

  const [checkinOpen, setCheckinOpen] = useState(false);
  const [showShareConfirmation, setShowShareConfirmation] = useState(false);
  const upcomingReminder = reminders.find((r) => !r.isCompleted);
  const primaryContacts = trustedContacts.slice(0, 2);

  // Show confirmation when emergency is triggered
  useEffect(() => {
    if (emergencyStatus === 'emergency') {
      setShowShareConfirmation(true);
    }
  }, [emergencyStatus]);

  // Generate activity log from emergency history and reminders
  const combinedActivityLog: ActivityLogEntry[] = [
    ...activityLog,
    ...emergencyHistory.slice(0, 5).map((e): ActivityLogEntry => ({
      id: e.id,
      type: e.status === 'resolved' ? 'emergency_resolved' as const : 'emergency_triggered' as const,
      title: e.status === 'resolved' ? 'Emergency Resolved' : 'Emergency Triggered',
      description: e.keyword ? `Detected: "${e.keyword}"` : `Trigger: ${e.triggerType}`,
      timestamp: e.triggeredAt,
    })),
    ...reminders.filter(r => r.isCompleted && r.completedAt).slice(0, 5).map((r): ActivityLogEntry => ({
      id: r.id,
      type: 'reminder_confirmed' as const,
      title: 'Reminder Confirmed',
      description: `${r.title} - via ${r.completionMethod}`,
      timestamp: r.completedAt!,
    })),
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10);

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

      {/* Escalation Timer - Shows during alert */}
      {emergencyStatus === 'alert' && timeRemaining && (
        <div className="px-4 mb-4">
          <EscalationTimer
            isActive={true}
            totalTime={60}
            currentTime={timeRemaining}
            onConfirmSafe={() => verifySafe('button')}
            onEscalate={() => window.location.href = 'tel:911'}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="px-4 space-y-4">
        {/* AI Safety Panel */}
        <AISafetyPanel />

        {/* Health Check Card */}
        <HealthCheckCard 
          status={emergencyStatus === 'safe' ? 'normal' : emergencyStatus === 'alert' ? 'warning' : 'critical'}
          lastActivity="Based on activity & voice"
        />

        {/* Active Reminder with Voice Confirmation */}
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
                onClick={() => {
                  completeReminder(upcomingReminder.id, 'button');
                  addActivityLog({
                    type: 'reminder_confirmed',
                    title: 'Reminder Confirmed',
                    description: `${upcomingReminder.title} - confirmed via button`,
                  });
                }}
                className="flex-1 rounded-2xl bg-primary hover:bg-primary/90"
              >
                Yes, I took them
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  completeReminder(upcomingReminder.id, 'voice');
                  addActivityLog({
                    type: 'reminder_confirmed',
                    title: 'Reminder Confirmed',
                    description: `${upcomingReminder.title} - confirmed via voice`,
                  });
                }}
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
            onClick={() => setCheckinOpen(true)}
          />
          <QuickActionCard 
            icon={AlertCircle}
            label="Need Help?"
            variant="emergency"
            onClick={() => triggerEmergency('manual')}
          />
        </div>

        {/* DigiLocker Quick Access */}
        <Card className="p-4 rounded-3xl shadow-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">DigiLocker</h3>
                <p className="text-sm text-muted-foreground">Secure emergency documents</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-2xl"
              onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'digilocker' }))}
            >
              <Shield className="w-4 h-4 mr-1" />
              Open
            </Button>
          </div>
        </Card>

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

        {/* Enhanced Activity Log */}
        <EnhancedActivityLog entries={combinedActivityLog} />

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

      {/* Daily Checkin Dialog */}
      <DailyCheckinDialog
        open={checkinOpen}
        onOpenChange={setCheckinOpen}
        onComplete={(id) => console.log('Completed:', id)}
      />

      {/* Emergency Share Confirmation */}
      <EmergencyShareConfirmation
        show={showShareConfirmation}
        onDismiss={() => setShowShareConfirmation(false)}
      />
    </div>
  );
};
