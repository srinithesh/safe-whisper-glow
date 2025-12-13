import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGoogleMapsKey } from '@/contexts/GoogleMapsContext';
import { useApp } from '@/contexts/AppContext';
import { NotificationSettings } from '@/components/NotificationSettings';
import { AddKeywordDialog } from '@/components/AddKeywordDialog';
import { Settings, Map, Key, Check, ExternalLink, AlertCircle, Mic, X } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { apiKey, setApiKey, isKeySet } = useGoogleMapsKey();
  const { emergencyKeywords, addEmergencyKeyword, removeEmergencyKeyword, notificationSettings, updateNotificationSetting } = useApp();
  const [inputKey, setInputKey] = useState(apiKey || '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setApiKey(inputKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 mx-auto rounded-full gradient-primary flex items-center justify-center shadow-glow">
          <Settings className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-bold">Settings</h2>
      </div>

      {/* Emergency Keywords */}
      <Card className="p-5 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Emergency Keywords</h3>
          </div>
          <AddKeywordDialog keywords={emergencyKeywords} onAdd={addEmergencyKeyword} />
        </div>
        <div className="flex flex-wrap gap-2">
          {emergencyKeywords.map((kw) => (
            <span key={kw} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
              {kw}
              <button onClick={() => removeEmergencyKeyword(kw)} className="hover:bg-primary/20 rounded-full p-0.5">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </Card>

      {/* Notifications */}
      <NotificationSettings settings={notificationSettings} onSettingsChange={updateNotificationSetting} />

      {/* Google Maps */}
      <Card className="p-5 shadow-soft">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Map className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Google Maps API</h3>
            <p className="text-sm text-muted-foreground">For live location tracking</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="relative">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input type="password" placeholder="Enter API key" value={inputKey} onChange={(e) => setInputKey(e.target.value)} className="pl-10" />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={!inputKey || inputKey === apiKey} className="flex-1">
              {saved ? <><Check className="w-4 h-4 mr-1" /> Saved!</> : 'Save'}
            </Button>
            <Button variant="outline" onClick={() => window.open('https://console.cloud.google.com/apis/credentials', '_blank')}>
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
          {isKeySet && <p className="text-sm text-safe flex items-center gap-1"><Check className="w-4 h-4" /> API key configured</p>}
        </div>
      </Card>
    </div>
  );
};
