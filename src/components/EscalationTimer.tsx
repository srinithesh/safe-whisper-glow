import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle,
  Phone,
  Users,
  Shield,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EscalationTimerProps {
  isActive: boolean;
  totalTime: number;
  currentTime: number;
  onConfirmSafe: () => void;
  onEscalate: () => void;
}

export const EscalationTimer: React.FC<EscalationTimerProps> = ({
  isActive,
  totalTime,
  currentTime,
  onConfirmSafe,
  onEscalate,
}) => {
  const progress = (currentTime / totalTime) * 100;
  const isUrgent = currentTime <= 15;

  // Stages of escalation
  const getStage = () => {
    if (currentTime > 45) return 'family';
    if (currentTime > 15) return 'trusted';
    return 'emergency';
  };

  const stage = getStage();

  if (!isActive) return null;

  return (
    <Card className={cn(
      "p-6 rounded-3xl border-2 animate-fade-in",
      isUrgent ? "border-emergency bg-emergency/5" : "border-warning bg-warning/5"
    )}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <AlertTriangle className={cn(
          "w-6 h-6 animate-pulse",
          isUrgent ? "text-emergency" : "text-warning"
        )} />
        <div>
          <h3 className="font-bold text-lg">Emergency Verification</h3>
          <p className="text-sm text-muted-foreground">
            Waiting for confirmation
          </p>
        </div>
      </div>

      {/* Countdown Circle */}
      <div className="relative w-32 h-32 mx-auto mb-6">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-muted/20"
          />
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={351.86}
            strokeDashoffset={351.86 * (1 - progress / 100)}
            className={cn(
              "transition-all duration-1000",
              isUrgent ? "text-emergency" : "text-warning"
            )}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn(
            "text-4xl font-bold",
            isUrgent ? "text-emergency" : "text-warning"
          )}>
            {currentTime}
          </span>
          <span className="text-sm text-muted-foreground">seconds</span>
        </div>
      </div>

      {/* Escalation Message */}
      <div className={cn(
        "p-3 rounded-2xl text-center mb-4",
        isUrgent ? "bg-emergency/10" : "bg-warning/10"
      )}>
        <p className="text-sm font-medium">
          {stage === 'family' && (
            <>Waiting for family confirmation before alerting trusted contacts</>
          )}
          {stage === 'trusted' && (
            <>Alerting trusted contacts... Waiting before emergency services</>
          )}
          {stage === 'emergency' && (
            <>⚠️ Auto-escalating to emergency services in {currentTime}s</>
          )}
        </p>
      </div>

      {/* Escalation Progress */}
      <div className="flex items-center justify-between mb-6 px-2">
        <div className="flex flex-col items-center">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center",
            stage === 'family' ? "bg-warning text-white" : "bg-muted text-muted-foreground"
          )}>
            <Users className="w-4 h-4" />
          </div>
          <span className="text-xs mt-1">Family</span>
        </div>
        <div className="flex-1 h-1 bg-muted mx-2">
          <div className={cn(
            "h-full transition-all",
            stage !== 'family' ? "bg-warning w-full" : "bg-warning w-0"
          )} />
        </div>
        <div className="flex flex-col items-center">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center",
            stage === 'trusted' ? "bg-warning text-white" : 
            stage === 'emergency' ? "bg-muted text-muted-foreground" : "bg-muted/50 text-muted-foreground"
          )}>
            <Phone className="w-4 h-4" />
          </div>
          <span className="text-xs mt-1">Contacts</span>
        </div>
        <div className="flex-1 h-1 bg-muted mx-2">
          <div className={cn(
            "h-full transition-all",
            stage === 'emergency' ? "bg-emergency w-full" : "bg-muted w-0"
          )} />
        </div>
        <div className="flex flex-col items-center">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center",
            stage === 'emergency' ? "bg-emergency text-white animate-pulse" : "bg-muted/50 text-muted-foreground"
          )}>
            <Shield className="w-4 h-4" />
          </div>
          <span className="text-xs mt-1">911</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button 
          onClick={onConfirmSafe}
          className="flex-1 h-14 rounded-2xl bg-safe hover:bg-safe/90 text-white"
        >
          <CheckCircle className="w-5 h-5 mr-2" />
          I AM SAFE
        </Button>
        <Button 
          variant="outline"
          onClick={onEscalate}
          className="flex-1 h-14 rounded-2xl border-2 border-emergency text-emergency hover:bg-emergency hover:text-white"
        >
          <Phone className="w-5 h-5 mr-2" />
          Call 911 Now
        </Button>
      </div>
    </Card>
  );
};
