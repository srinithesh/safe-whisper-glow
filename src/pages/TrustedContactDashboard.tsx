import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SafeStatusHeader } from '@/components/SafeStatusHeader';
import { TabsNavigation } from '@/components/TabsNavigation';
import { StatusCard } from '@/components/StatusCard';
import { VitalsCard } from '@/components/VitalsCard';
import { ActivityTimeline, TimelineEvent } from '@/components/ActivityTimeline';
import { RoleToggle } from '@/components/RoleToggle';
import { useApp } from '@/contexts/AppContext';
import { mockPregnantUser } from '@/data/mockData';
import { 
  AlertTriangle, 
  CheckCircle,
} from 'lucide-react';
import { format } from 'date-fns';

const tabs = [
  { id: 'status', label: 'STATUS' },
  { id: 'vitals', label: 'VITALS' },
  { id: 'history', label: 'HISTORY' },
];

export const TrustedContactDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('status');
  
  const {
    emergencyStatus,
    currentLocation,
    resolveEmergency,
    confirmDanger,
    reminders,
    setCurrentRole,
    emergencyHistory,
  } = useApp();

  // Generate mock timeline events
  const timelineEvents: TimelineEvent[] = [
    {
      id: '1',
      type: 'location' as const,
      title: 'Location Update',
      description: `Arrived at ${currentLocation.address || '123 Maple Ave'}`,
      timestamp: new Date(Date.now() - 15 * 60000),
    },
    ...reminders
      .filter((r) => r.isCompleted && r.completedAt)
      .slice(0, 3)
      .map((r): TimelineEvent => ({
        id: r.id,
        type: 'reminder' as const,
        title: 'Reminder Completed',
        description: `Confirmed: ${r.title}`,
        timestamp: r.completedAt!,
      })),
    {
      id: '3',
      type: 'safety' as const,
      title: 'Safety Check',
      description: 'Routine automated check - Safe',
      timestamp: new Date(Date.now() - 2 * 60 * 60000),
    },
    {
      id: '4',
      type: 'movement' as const,
      title: 'Movement Started',
      description: 'Walking detected (15 mins)',
      timestamp: new Date(Date.now() - 3 * 60 * 60000),
    },
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const handleCallMother = () => {
    window.location.href = `tel:${mockPregnantUser.phone}`;
  };

  return (
    <div className="min-h-screen pb-24 animate-fade-in scrollbar-hide">
      {/* Role Toggle Header */}
      <div className="flex justify-center pt-2 pb-4 sticky top-0 z-10">
        <RoleToggle 
          role="trusted" 
          onChange={(r) => setCurrentRole(r === 'pregnant' ? 'pregnant_woman' : 'trusted_contact')} 
        />
      </div>

      <div className="px-4 space-y-4">
        {/* Safe Status Header */}
        <SafeStatusHeader
          userName={mockPregnantUser.name.split(' ')[0]}
          status={emergencyStatus === 'monitoring' ? 'safe' : emergencyStatus === 'resolved' ? 'safe' : emergencyStatus}
          verifiedAt={new Date()}
        />

        {/* Emergency Actions */}
        {(emergencyStatus === 'alert' || emergencyStatus === 'emergency') && (
          <Card className="p-4 rounded-3xl border-2 border-warning bg-warning/5 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-warning" />
              <div>
                <h3 className="font-bold">Emergency Alert Active</h3>
                <p className="text-sm text-muted-foreground">
                  Please verify the safety status
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="safe"
                size="lg"
                className="flex-1 rounded-2xl"
                onClick={() => resolveEmergency('contact')}
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                She is Safe
              </Button>
              <Button
                variant="emergency"
                size="lg"
                className="flex-1 rounded-2xl"
                onClick={() => confirmDanger('contact')}
              >
                <AlertTriangle className="w-5 h-5 mr-2" />
                Danger Confirmed
              </Button>
            </div>
          </Card>
        )}

        {/* Tabs Navigation */}
        <TabsNavigation
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {/* Tab Content */}
        <div className="mt-4">
          {activeTab === 'status' && (
            <StatusCard
              location={currentLocation.address || '123 Maple Ave, Springfield'}
              accuracy={5}
              battery={84}
              signalStrength="strong"
              userName={mockPregnantUser.name.split(' ')[0]}
              onCall={handleCallMother}
            />
          )}

          {activeTab === 'vitals' && (
            <VitalsCard
              heartRate={78}
              oxygen={98}
              movement="stationary"
              movementDuration="10 mins"
              phoneBattery={84}
              watchBattery={62}
            />
          )}

          {activeTab === 'history' && (
            <ActivityTimeline events={timelineEvents} />
          )}
        </div>
      </div>
    </div>
  );
};
