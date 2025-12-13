import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ReminderCard } from '@/components/ReminderCard';
import { useApp } from '@/contexts/AppContext';
import { 
  Bell, 
  CheckCircle, 
  Clock,
  Plus,
  Pill,
  Utensils,
  Droplets
} from 'lucide-react';

export const RemindersPage: React.FC = () => {
  const { reminders, completeReminder } = useApp();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('pending');

  const filteredReminders = reminders.filter((r) => {
    if (filter === 'pending') return !r.isCompleted;
    if (filter === 'completed') return r.isCompleted;
    return true;
  });

  const pendingCount = reminders.filter((r) => !r.isCompleted).length;
  const completedCount = reminders.filter((r) => r.isCompleted).length;

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 mx-auto rounded-full gradient-primary flex items-center justify-center shadow-glow">
          <Bell className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-bold">Reminders</h2>
        <p className="text-muted-foreground">
          Stay on track with your health routine
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 text-center bg-warning/10 border-warning/20">
          <Clock className="w-6 h-6 mx-auto text-warning mb-2" />
          <div className="text-2xl font-bold">{pendingCount}</div>
          <div className="text-sm text-muted-foreground">Pending</div>
        </Card>
        <Card className="p-4 text-center bg-safe/10 border-safe/20">
          <CheckCircle className="w-6 h-6 mx-auto text-safe mb-2" />
          <div className="text-2xl font-bold">{completedCount}</div>
          <div className="text-sm text-muted-foreground">Completed</div>
        </Card>
      </div>

      {/* Quick add */}
      <Card className="p-4 shadow-soft">
        <h3 className="font-semibold mb-3">Quick Add</h3>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" className="gap-1">
            <Pill className="w-4 h-4" />
            Medicine
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Utensils className="w-4 h-4" />
            Meal
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Droplets className="w-4 h-4" />
            Water
          </Button>
          <Button variant="ghost" size="sm" className="gap-1">
            <Plus className="w-4 h-4" />
            Custom
          </Button>
        </div>
      </Card>

      {/* Filter tabs */}
      <div className="flex gap-2 p-1 bg-muted rounded-xl">
        {(['pending', 'completed', 'all'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              filter === f
                ? 'bg-card text-foreground shadow-soft'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Reminders list */}
      <div className="space-y-3">
        {filteredReminders.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-muted flex items-center justify-center mb-3">
              <CheckCircle className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">
              {filter === 'pending' 
                ? 'All caught up! No pending reminders.'
                : filter === 'completed'
                ? 'No completed reminders yet.'
                : 'No reminders to show.'}
            </p>
          </Card>
        ) : (
          filteredReminders.map((reminder) => (
            <ReminderCard
              key={reminder.id}
              reminder={reminder}
              onComplete={(method) => completeReminder(reminder.id, method)}
            />
          ))
        )}
      </div>
    </div>
  );
};
