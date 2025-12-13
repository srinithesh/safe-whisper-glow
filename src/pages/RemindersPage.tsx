import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ReminderCard } from '@/components/ReminderCard';
import { AddReminderDialog } from '@/components/AddReminderDialog';
import { StatsCard } from '@/components/StatsCard';
import { useApp } from '@/contexts/AppContext';
import { Bell, CheckCircle, Clock, Plus } from 'lucide-react';

export const RemindersPage: React.FC = () => {
  const { reminders, completeReminder, addReminder, deleteReminder } = useApp();
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
      <div className="text-center space-y-2">
        <div className="w-16 h-16 mx-auto rounded-full gradient-primary flex items-center justify-center shadow-glow">
          <Bell className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-bold">Reminders</h2>
        <p className="text-muted-foreground">Stay on track with your health routine</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatsCard title="Pending" value={pendingCount} icon={Clock} variant="warning" />
        <StatsCard title="Completed" value={completedCount} icon={CheckCircle} variant="safe" />
      </div>

      <AddReminderDialog 
        onAdd={addReminder}
        trigger={
          <Button className="w-full gap-2 h-14">
            <Plus className="w-5 h-5" />
            Add New Reminder
          </Button>
        }
      />

      <div className="flex gap-2 p-1 bg-muted rounded-xl">
        {(['pending', 'completed', 'all'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              filter === f ? 'bg-card text-foreground shadow-soft' : 'text-muted-foreground'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredReminders.length === 0 ? (
          <Card className="p-8 text-center">
            <CheckCircle className="w-12 h-12 mx-auto text-safe mb-3" />
            <p className="font-semibold">All caught up!</p>
            <p className="text-sm text-muted-foreground">No {filter} reminders.</p>
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
