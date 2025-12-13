import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AlertTriangle } from 'lucide-react';

interface EmergencyButtonProps {
  onTrigger: () => void;
  disabled?: boolean;
}

export const EmergencyButton: React.FC<EmergencyButtonProps> = ({
  onTrigger,
  disabled = false,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);

  const handlePressStart = () => {
    if (disabled) return;
    setIsPressed(true);
    
    // Require 1 second hold to trigger
    const startTime = Date.now();
    const holdDuration = 1000;
    
    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / holdDuration, 1);
      setHoldProgress(progress);
      
      if (progress >= 1) {
        onTrigger();
        setIsPressed(false);
        setHoldProgress(0);
      } else if (isPressed) {
        requestAnimationFrame(updateProgress);
      }
    };
    
    requestAnimationFrame(updateProgress);
  };

  const handlePressEnd = () => {
    setIsPressed(false);
    setHoldProgress(0);
  };

  return (
    <div className="relative">
      <Button
        variant="emergency"
        size="icon-xl"
        className={cn(
          'relative overflow-hidden w-32 h-32 rounded-full text-2xl',
          isPressed && 'scale-95'
        )}
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        disabled={disabled}
      >
        {/* Progress ring */}
        <svg
          className="absolute inset-0 w-full h-full -rotate-90"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray={`${holdProgress * 301.59} 301.59`}
            className="opacity-50"
          />
        </svg>
        
        <div className="flex flex-col items-center gap-1 z-10">
          <AlertTriangle className="w-10 h-10" />
          <span className="text-sm font-bold">SOS</span>
        </div>
      </Button>
      
      <p className="text-center text-sm text-muted-foreground mt-3">
        Hold for 1 second to trigger
      </p>
    </div>
  );
};
