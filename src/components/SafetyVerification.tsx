import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CheckCircle, X, Clock } from 'lucide-react';

interface SafetyVerificationProps {
  timeRemaining: number | null;
  onConfirmSafe: () => void;
  onDismiss?: () => void;
}

export const SafetyVerification: React.FC<SafetyVerificationProps> = ({
  timeRemaining,
  onConfirmSafe,
  onDismiss,
}) => {
  const seconds = timeRemaining ? Math.ceil(timeRemaining / 1000) : 0;
  const progress = timeRemaining ? (timeRemaining / 30000) * 100 : 0;

  return (
    <Card className={cn(
      'p-6 border-2 border-warning bg-warning/5 animate-fade-in',
      'shadow-lg'
    )}>
      <div className="flex items-start gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-warning/20 flex items-center justify-center">
            <Clock className="w-8 h-8 text-warning" />
          </div>
          {/* Circular progress */}
          <svg
            className="absolute inset-0 w-16 h-16 -rotate-90"
            viewBox="0 0 64 64"
          >
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="hsl(var(--warning))"
              strokeWidth="4"
              strokeDasharray={`${progress * 1.759} 175.9`}
              className="transition-all duration-1000"
            />
          </svg>
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-bold text-warning mb-1">
            Are You Okay?
          </h3>
          <p className="text-muted-foreground mb-4">
            An emergency keyword was detected. Please confirm you are safe within{' '}
            <span className="font-bold text-warning">{seconds} seconds</span>.
          </p>

          <div className="flex gap-3">
            <Button
              variant="safe"
              size="lg"
              onClick={onConfirmSafe}
              className="flex-1 gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              I'm Safe
            </Button>
            {onDismiss && (
              <Button
                variant="outline"
                size="lg"
                onClick={onDismiss}
              >
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
