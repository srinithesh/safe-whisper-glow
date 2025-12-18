import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ArrowLeft, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CheckinItem {
  id: string;
  title: string;
  time: string;
  emoji: string;
  completed: boolean;
}

interface DailyCheckinDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (id: string) => void;
}

const defaultItems: CheckinItem[] = [
  { id: '1', title: 'Prenatal Vitamins', time: '09:00 AM', emoji: '💊', completed: false },
  { id: '2', title: 'Drink Water (Glass 4)', time: '11:00 AM', emoji: '💧', completed: false },
  { id: '3', title: 'Lunch', time: '01:00 PM', emoji: '🥗', completed: false },
];

export const DailyCheckinDialog: React.FC<DailyCheckinDialogProps> = ({
  open,
  onOpenChange,
  onComplete,
}) => {
  const [items, setItems] = React.useState(defaultItems);

  const handleToggle = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
    onComplete(id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 rounded-3xl bg-background border-0 overflow-hidden">
        <div className="p-6 space-y-6">
          {/* Header */}
          <button 
            onClick={() => onOpenChange(false)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>

          {/* Title */}
          <div>
            <h2 className="text-2xl font-bold text-foreground">Daily Check-in</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Logging your activity confirms you are safe.
            </p>
          </div>

          {/* Checkin Items */}
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => handleToggle(item.id)}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-200",
                  "bg-card border border-border hover:border-primary/30",
                  item.completed && "opacity-60"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                  item.completed ? "bg-safe" : "bg-warning"
                )} />
                <div className="flex-1">
                  <h4 className={cn(
                    "font-medium text-foreground",
                    item.completed && "line-through"
                  )}>
                    {item.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">{item.time}</p>
                </div>
                <span className="text-2xl">{item.emoji}</span>
              </div>
            ))}
          </div>

          {/* Tip */}
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-warning/10 border border-warning/20">
            <Lightbulb className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <p className="text-sm text-foreground">
              <span className="font-medium">Tip:</span> You can also just say "I took my medicine" and the AI will mark it for you.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
