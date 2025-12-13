import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGoogleMapsKey } from '@/contexts/GoogleMapsContext';
import { 
  Settings, 
  Map, 
  Key, 
  Check, 
  ExternalLink,
  AlertCircle
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { apiKey, setApiKey, isKeySet } = useGoogleMapsKey();
  const [inputKey, setInputKey] = useState(apiKey || '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setApiKey(inputKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 mx-auto rounded-full gradient-primary flex items-center justify-center shadow-glow">
          <Settings className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-muted-foreground">
          Configure your MotherGuard app
        </p>
      </div>

      {/* Google Maps API Key */}
      <Card className="p-5 shadow-soft">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Map className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Google Maps API</h3>
            <p className="text-sm text-muted-foreground">
              Required for real-time location tracking and hospital navigation
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="password"
              placeholder="Enter your Google Maps API key"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleSave} 
              disabled={!inputKey || inputKey === apiKey}
              className="flex-1"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  Saved!
                </>
              ) : (
                'Save API Key'
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open('https://console.cloud.google.com/apis/credentials', '_blank')}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>

          {isKeySet ? (
            <div className="flex items-center gap-2 text-sm text-safe">
              <Check className="w-4 h-4" />
              API key configured
            </div>
          ) : (
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>
                Get your API key from{' '}
                <a 
                  href="https://console.cloud.google.com/apis/credentials" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  Google Cloud Console
                </a>
                . Enable Maps JavaScript API and Places API.
              </span>
            </div>
          )}
        </div>
      </Card>

      {/* Instructions */}
      <Card className="p-4 bg-accent/20 border-accent/30">
        <h4 className="font-semibold mb-2">How to get a Google Maps API key:</h4>
        <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
          <li>Go to Google Cloud Console</li>
          <li>Create a new project or select existing</li>
          <li>Enable "Maps JavaScript API" and "Places API"</li>
          <li>Create credentials → API key</li>
          <li>Paste the key above</li>
        </ol>
      </Card>

      {/* Demo note */}
      <Card className="p-4 bg-warning/10 border-warning/20">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-warning">Demo Mode</h4>
            <p className="text-sm text-muted-foreground">
              For production, connect to Cloud to securely store your API key. 
              The current setup stores the key locally in your browser.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
