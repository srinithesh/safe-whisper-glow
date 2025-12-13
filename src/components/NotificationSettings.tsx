import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Bell,
  Volume2,
  Vibrate,
  MessageSquare,
  Phone,
  Clock,
  Moon,
  Shield
} from 'lucide-react';

interface NotificationSettingsProps {
  settings: {
    pushEnabled: boolean;
    soundEnabled: boolean;
    vibrationEnabled: boolean;
    smsEnabled: boolean;
    callEnabled: boolean;
    quietHoursEnabled: boolean;
    quietHoursStart: string;
    quietHoursEnd: string;
  };
  onSettingsChange: (key: string, value: boolean | string) => void;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  settings,
  onSettingsChange,
}) => {
  return (
    <div className="space-y-4">
      <Card className="p-4 shadow-soft">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          Alert Preferences
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Bell className="w-4 h-4 text-primary" />
              </div>
              <div>
                <Label className="font-medium">Push Notifications</Label>
                <p className="text-xs text-muted-foreground">Receive alerts on your device</p>
              </div>
            </div>
            <Switch
              checked={settings.pushEnabled}
              onCheckedChange={(checked) => onSettingsChange('pushEnabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-safe/10 flex items-center justify-center">
                <Volume2 className="w-4 h-4 text-safe" />
              </div>
              <div>
                <Label className="font-medium">Sound Alerts</Label>
                <p className="text-xs text-muted-foreground">Play sound for emergencies</p>
              </div>
            </div>
            <Switch
              checked={settings.soundEnabled}
              onCheckedChange={(checked) => onSettingsChange('soundEnabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-warning/10 flex items-center justify-center">
                <Vibrate className="w-4 h-4 text-warning" />
              </div>
              <div>
                <Label className="font-medium">Vibration</Label>
                <p className="text-xs text-muted-foreground">Vibrate on alerts</p>
              </div>
            </div>
            <Switch
              checked={settings.vibrationEnabled}
              onCheckedChange={(checked) => onSettingsChange('vibrationEnabled', checked)}
            />
          </div>
        </div>
      </Card>

      <Card className="p-4 shadow-soft">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Emergency Contact Methods
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-primary" />
              </div>
              <div>
                <Label className="font-medium">SMS Alerts</Label>
                <p className="text-xs text-muted-foreground">Send text messages to contacts</p>
              </div>
            </div>
            <Switch
              checked={settings.smsEnabled}
              onCheckedChange={(checked) => onSettingsChange('smsEnabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emergency/10 flex items-center justify-center">
                <Phone className="w-4 h-4 text-emergency" />
              </div>
              <div>
                <Label className="font-medium">Auto-Call</Label>
                <p className="text-xs text-muted-foreground">Call primary contact on emergency</p>
              </div>
            </div>
            <Switch
              checked={settings.callEnabled}
              onCheckedChange={(checked) => onSettingsChange('callEnabled', checked)}
            />
          </div>
        </div>
      </Card>

      <Card className="p-4 shadow-soft">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Moon className="w-5 h-5 text-primary" />
          Quiet Hours
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent/50 flex items-center justify-center">
                <Clock className="w-4 h-4 text-accent-foreground" />
              </div>
              <div>
                <Label className="font-medium">Enable Quiet Hours</Label>
                <p className="text-xs text-muted-foreground">Silence non-emergency alerts</p>
              </div>
            </div>
            <Switch
              checked={settings.quietHoursEnabled}
              onCheckedChange={(checked) => onSettingsChange('quietHoursEnabled', checked)}
            />
          </div>

          {settings.quietHoursEnabled && (
            <div className="grid grid-cols-2 gap-3 pl-12">
              <div>
                <Label className="text-xs text-muted-foreground">Start</Label>
                <input
                  type="time"
                  value={settings.quietHoursStart}
                  onChange={(e) => onSettingsChange('quietHoursStart', e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">End</Label>
                <input
                  type="time"
                  value={settings.quietHoursEnd}
                  onChange={(e) => onSettingsChange('quietHoursEnd', e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm"
                />
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
