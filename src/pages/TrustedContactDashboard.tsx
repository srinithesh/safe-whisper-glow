import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { LocationCard } from '@/components/LocationCard';
import { useApp } from '@/contexts/AppContext';
import { mockPregnantUser } from '@/data/mockData';
import { 
  Heart, 
  AlertTriangle, 
  CheckCircle, 
  Phone,
  MessageCircle,
  Clock,
  Activity,
  Baby
} from 'lucide-react';
import { format } from 'date-fns';

export const TrustedContactDashboard: React.FC = () => {
  const {
    userName,
    emergencyStatus,
    currentLocation,
    verifySafe,
    confirmDanger,
    resolveEmergency,
    reminders,
  } = useApp();

  const completedToday = reminders.filter((r) => 
    r.isCompleted && 
    r.completedAt && 
    format(r.completedAt, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  ).length;

  const handleCallMother = () => {
    window.location.href = `tel:${mockPregnantUser.phone}`;
  };

  const handleMessageMother = () => {
    window.location.href = `sms:${mockPregnantUser.phone}`;
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      {/* Status header */}
      <Card className={`p-6 text-center ${
        emergencyStatus === 'safe' ? 'bg-safe/10 border-safe/30' :
        emergencyStatus === 'alert' ? 'bg-warning/10 border-warning/30' :
        emergencyStatus === 'emergency' ? 'bg-emergency/10 border-emergency/30 pulse-emergency' :
        'bg-card'
      }`}>
        <div className="w-16 h-16 mx-auto rounded-full bg-card flex items-center justify-center mb-4 shadow-soft">
          <Baby className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-bold">{mockPregnantUser.name}</h2>
        <p className="text-muted-foreground text-sm mb-3">
          Week {mockPregnantUser.weeksPregnant} • Due {mockPregnantUser.dueDate}
        </p>
        <StatusBadge status={emergencyStatus} size="lg" />

        {/* Quick actions */}
        <div className="flex gap-3 mt-4 justify-center">
          <Button variant="default" size="lg" onClick={handleCallMother}>
            <Phone className="w-4 h-4 mr-2" />
            Call
          </Button>
          <Button variant="outline" size="lg" onClick={handleMessageMother}>
            <MessageCircle className="w-4 h-4 mr-2" />
            Message
          </Button>
        </div>
      </Card>

      {/* Emergency actions */}
      {(emergencyStatus === 'alert' || emergencyStatus === 'emergency') && (
        <Card className="p-4 border-2 border-warning bg-warning/5 animate-fade-in">
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
              className="flex-1"
              onClick={() => resolveEmergency('contact')}
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              She is Safe
            </Button>
            <Button
              variant="emergency"
              size="lg"
              className="flex-1"
              onClick={() => confirmDanger('contact')}
            >
              <AlertTriangle className="w-5 h-5 mr-2" />
              Danger Confirmed
            </Button>
          </div>
        </Card>
      )}

      {/* Live location */}
      <div className="space-y-3">
        <h3 className="font-semibold flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Live Location
        </h3>
        <LocationCard
          location={currentLocation}
          userName={mockPregnantUser.name.split(' ')[0]}
        />
      </div>

      {/* Activity summary */}
      <Card className="p-4 shadow-soft">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Today's Activity
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 rounded-xl bg-safe/10">
            <div className="text-3xl font-bold text-safe">{completedToday}</div>
            <div className="text-sm text-muted-foreground">Reminders Done</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-primary/10">
            <div className="text-3xl font-bold text-primary">
              {format(currentLocation.timestamp, 'h:mm')}
            </div>
            <div className="text-sm text-muted-foreground">Last Active</div>
          </div>
        </div>
      </Card>

      {/* Recent activity */}
      <Card className="p-4 shadow-soft">
        <h3 className="font-semibold mb-3">Recent Activity</h3>
        <div className="space-y-3">
          {reminders
            .filter((r) => r.isCompleted)
            .slice(0, 3)
            .map((reminder) => (
              <div 
                key={reminder.id}
                className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
              >
                <CheckCircle className="w-4 h-4 text-safe" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{reminder.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {reminder.completedAt && format(reminder.completedAt, 'h:mm a')}
                  </p>
                </div>
              </div>
            ))}
          {reminders.filter((r) => r.isCompleted).length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No completed activities yet today
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};
