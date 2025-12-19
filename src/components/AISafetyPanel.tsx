import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain,
  Mic, 
  MicOff,
  Smartphone,
  MapPin,
  Clock,
  Activity,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { format } from 'date-fns';

export const AISafetyPanel: React.FC = () => {
  const { 
    voiceEnabled, 
    isListening, 
    emergencyStatus, 
    emergencyHistory,
    currentLocation 
  } = useApp();

  const lastActivity = emergencyHistory[0];
  const lastConfirmation = emergencyHistory.find(e => e.status === 'resolved');

  const getStatusColor = (isActive: boolean, isWarning: boolean = false) => {
    if (isWarning) return 'text-warning';
    return isActive ? 'text-safe' : 'text-muted-foreground';
  };

  const getStatusBg = (isActive: boolean, isWarning: boolean = false) => {
    if (isWarning) return 'bg-warning/10';
    return isActive ? 'bg-safe/10' : 'bg-muted/50';
  };

  return (
    <Card className="p-4 rounded-3xl shadow-card">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Brain className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">AI Safety Status</h3>
          <p className="text-sm text-muted-foreground">Real-time monitoring</p>
        </div>
        <Badge 
          variant={emergencyStatus === 'emergency' ? 'destructive' : 'outline'} 
          className="ml-auto"
        >
          {emergencyStatus === 'safe' || emergencyStatus === 'monitoring' ? 'Active' : emergencyStatus.toUpperCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Voice Activity */}
        <div className={`p-3 rounded-2xl ${getStatusBg(voiceEnabled && isListening)}`}>
          <div className="flex items-center gap-2 mb-1">
            {voiceEnabled && isListening ? (
              <Mic className={`w-4 h-4 ${getStatusColor(true)}`} />
            ) : (
              <MicOff className={`w-4 h-4 ${getStatusColor(false)}`} />
            )}
            <span className="text-sm font-medium">Voice</span>
          </div>
          <p className={`text-xs ${getStatusColor(voiceEnabled && isListening)}`}>
            {voiceEnabled && isListening ? 'Listening' : voiceEnabled ? 'Waiting...' : 'Disabled'}
          </p>
        </div>

        {/* Phone Activity */}
        <div className={`p-3 rounded-2xl ${getStatusBg(true)}`}>
          <div className="flex items-center gap-2 mb-1">
            <Smartphone className={`w-4 h-4 ${getStatusColor(true)}`} />
            <span className="text-sm font-medium">Phone</span>
          </div>
          <p className={`text-xs ${getStatusColor(true)}`}>Active</p>
        </div>

        {/* Last Confirmation */}
        <div className={`p-3 rounded-2xl ${getStatusBg(!!lastConfirmation)}`}>
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className={`w-4 h-4 ${getStatusColor(!!lastConfirmation)}`} />
            <span className="text-sm font-medium">Confirmed</span>
          </div>
          <p className={`text-xs ${getStatusColor(!!lastConfirmation)}`}>
            {lastConfirmation 
              ? format(lastConfirmation.resolvedAt || lastConfirmation.triggeredAt, 'h:mm a')
              : 'Not yet'}
          </p>
        </div>

        {/* Location Stability */}
        <div className={`p-3 rounded-2xl ${getStatusBg(true)}`}>
          <div className="flex items-center gap-2 mb-1">
            <MapPin className={`w-4 h-4 ${getStatusColor(true)}`} />
            <span className="text-sm font-medium">Location</span>
          </div>
          <p className={`text-xs ${getStatusColor(true)}`}>Stable</p>
        </div>
      </div>

      {/* Explanation */}
      <div className="mt-4 p-3 rounded-2xl bg-info/5 border border-info/20">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-info mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground">
            AI monitors your voice and activity patterns. If distress is detected, a verification countdown begins before alerting contacts.
          </p>
        </div>
      </div>
    </Card>
  );
};
