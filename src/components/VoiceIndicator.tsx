import React from 'react';
import { cn } from '@/lib/utils';
import { Mic, MicOff } from 'lucide-react';

interface VoiceIndicatorProps {
  isListening: boolean;
  isSupported: boolean;
  lastTranscript?: string;
}

export const VoiceIndicator: React.FC<VoiceIndicatorProps> = ({
  isListening,
  isSupported,
  lastTranscript,
}) => {
  if (!isSupported) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted text-muted-foreground text-sm">
        <MicOff className="w-4 h-4" />
        <span>Voice not supported</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        className={cn(
          'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300',
          isListening
            ? 'bg-primary/10 border-2 border-primary shadow-glow'
            : 'bg-muted border-2 border-transparent'
        )}
      >
        <div className="relative">
          <div
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center transition-all',
              isListening ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/20 text-muted-foreground'
            )}
          >
            {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </div>
          {isListening && (
            <>
              <div className="absolute inset-0 rounded-full bg-primary animate-ripple" />
              <div className="absolute inset-0 rounded-full bg-primary animate-ripple" style={{ animationDelay: '0.5s' }} />
            </>
          )}
        </div>
        <div className="flex-1">
          <p className={cn(
            'font-semibold',
            isListening ? 'text-primary' : 'text-muted-foreground'
          )}>
            {isListening ? 'Listening for keywords...' : 'Voice detection off'}
          </p>
          <p className="text-sm text-muted-foreground">
            {isListening ? 'Say "help", "pain", or "emergency"' : 'Tap to enable voice monitoring'}
          </p>
        </div>
      </div>

      {lastTranscript && isListening && (
        <div className="px-4 py-2 rounded-lg bg-muted/50 text-sm text-muted-foreground italic">
          "{lastTranscript}"
        </div>
      )}
    </div>
  );
};
