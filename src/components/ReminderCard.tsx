import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Reminder, ReminderType } from '@/types';
import { Pill, Utensils, Droplets, Footprints, Moon, Check, Clock } from 'lucide-react';
import { format, formatDistanceToNow, isPast } from 'date-fns';

interface ReminderCardProps {
  reminder: Reminder;
  onComplete: (method: 'button' | 'voice') => void;
  isActive?: boolean;
}

const reminderIcons: Record<ReminderType, React.ComponentType<{ className?: string }>> = {
  medicine: Pill,
  food: Utensils,
  water: Droplets,
  exercise: Footprints,
  rest: Moon,
};

const reminderColors: Record<ReminderType, string> = {
  medicine: 'bg-primary/10 text-primary border-primary/20',
  food: 'bg-safe/10 text-safe border-safe/20',
  water: 'bg-accent/10 text-accent-foreground border-accent/20',
  exercise: 'bg-warning/10 text-warning border-warning/20',
  rest: 'bg-secondary/50 text-secondary-foreground border-secondary/20',
};

export const ReminderCard: React.FC<ReminderCardProps> = ({
  reminder,
  onComplete,
  isActive = false,
}) => {
  const Icon = reminderIcons[reminder.type];
  const isDue = isPast(reminder.scheduledTime);

  return (
    <Card
      className={cn(
        'p-4 transition-all duration-300',
        reminder.isCompleted && 'opacity-60',
        isActive && 'ring-2 ring-primary shadow-glow',
        !reminder.isCompleted && isDue && 'ring-2 ring-warning animate-pulse'
      )}
    >
      <div className="flex items-center gap-4">
        <div
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center border',
            reminderColors[reminder.type]
          )}
        >
          <Icon className="w-6 h-6" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className={cn(
              'font-semibold truncate',
              reminder.isCompleted && 'line-through'
            )}>
              {reminder.title}
            </h4>
            {reminder.isCompleted && (
              <Check className="w-4 h-4 text-safe flex-shrink-0" />
            )}
          </div>
          {reminder.description && (
            <p className="text-sm text-muted-foreground truncate">
              {reminder.description}
            </p>
          )}
          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {reminder.isCompleted ? (
              <span>Completed {reminder.completedAt && formatDistanceToNow(reminder.completedAt, { addSuffix: true })}</span>
            ) : isDue ? (
              <span className="text-warning font-medium">Due now</span>
            ) : (
              <span>{formatDistanceToNow(reminder.scheduledTime, { addSuffix: true })}</span>
            )}
          </div>
        </div>

        {!reminder.isCompleted && (
          <Button
            variant={isDue ? 'default' : 'outline'}
            size="sm"
            onClick={() => onComplete('button')}
            className="flex-shrink-0"
          >
            <Check className="w-4 h-4 mr-1" />
            Done
          </Button>
        )}
      </div>
    </Card>
  );
};
