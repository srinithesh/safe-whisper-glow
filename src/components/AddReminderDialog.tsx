import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Reminder, ReminderType } from '@/types';
import { Plus, Pill, Utensils, Droplets, Footprints, Moon, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddReminderDialogProps {
  onAdd: (type: ReminderType, title: string, scheduledTime: Date, description?: string) => void;
  trigger?: React.ReactNode;
}

const reminderTypes: { value: ReminderType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: 'medicine', label: 'Medicine', icon: Pill },
  { value: 'food', label: 'Meal/Snack', icon: Utensils },
  { value: 'water', label: 'Hydration', icon: Droplets },
  { value: 'exercise', label: 'Exercise', icon: Footprints },
  { value: 'rest', label: 'Rest/Sleep', icon: Moon },
];

export const AddReminderDialog: React.FC<AddReminderDialogProps> = ({ onAdd, trigger }) => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<ReminderType>('medicine');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !time) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in the title and time.',
        variant: 'destructive',
      });
      return;
    }

    // Parse time and create date for today
    const [hours, minutes] = time.split(':').map(Number);
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);
    
    // If time has passed today, schedule for tomorrow
    if (scheduledTime < new Date()) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    onAdd(type, title.trim(), scheduledTime, description.trim() || undefined);

    toast({
      title: 'Reminder Added',
      description: `${title} has been scheduled.`,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setTime('');
    setType('medicine');
    setOpen(false);
  };

  const SelectedIcon = reminderTypes.find(t => t.value === type)?.icon || Pill;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-1">
            <Plus className="w-4 h-4" />
            Add
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Add Reminder
            </DialogTitle>
            <DialogDescription>
              Create a new health or activity reminder.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Type *</Label>
              <div className="grid grid-cols-5 gap-2">
                {reminderTypes.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setType(value)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
                      type === value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-[10px] font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <div className="relative">
                <SelectedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="title"
                  placeholder="e.g., Take prenatal vitamins"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time *</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Add any additional notes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Reminder</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
