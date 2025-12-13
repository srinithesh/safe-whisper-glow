import { useState, useCallback, useEffect } from 'react';
import { Reminder, ReminderType } from '@/types';

// Mock initial reminders
const createInitialReminders = (): Reminder[] => {
  const now = new Date();
  
  return [
    {
      id: 'reminder-1',
      type: 'medicine',
      title: 'Prenatal Vitamins',
      description: 'Take your daily prenatal vitamins with breakfast',
      scheduledTime: new Date(now.getTime() + 30 * 60000), // 30 min from now
      isCompleted: false,
    },
    {
      id: 'reminder-2',
      type: 'water',
      title: 'Hydration Check',
      description: 'Drink a glass of water',
      scheduledTime: new Date(now.getTime() + 60 * 60000), // 1 hour from now
      isCompleted: false,
    },
    {
      id: 'reminder-3',
      type: 'food',
      title: 'Healthy Snack',
      description: 'Time for a nutritious snack',
      scheduledTime: new Date(now.getTime() + 2 * 60 * 60000), // 2 hours from now
      isCompleted: false,
    },
    {
      id: 'reminder-4',
      type: 'rest',
      title: 'Rest Break',
      description: 'Take a 15-minute rest break',
      scheduledTime: new Date(now.getTime() + 3 * 60 * 60000), // 3 hours from now
      isCompleted: false,
    },
    {
      id: 'reminder-5',
      type: 'exercise',
      title: 'Gentle Stretching',
      description: 'Do some light stretching exercises',
      scheduledTime: new Date(now.getTime() + 4 * 60 * 60000), // 4 hours from now
      isCompleted: false,
    },
  ];
};

interface UseRemindersOptions {
  onReminderCompleted?: (reminder: Reminder) => void;
  onActivityDetected?: () => void;
}

export const useReminders = (options?: UseRemindersOptions) => {
  const [reminders, setReminders] = useState<Reminder[]>(createInitialReminders);
  const [activeReminder, setActiveReminder] = useState<Reminder | null>(null);

  const completeReminder = useCallback((reminderId: string, method: 'button' | 'voice') => {
    setReminders((prev) =>
      prev.map((r) =>
        r.id === reminderId
          ? {
              ...r,
              isCompleted: true,
              completedAt: new Date(),
              completionMethod: method,
            }
          : r
      )
    );

    const reminder = reminders.find((r) => r.id === reminderId);
    if (reminder) {
      options?.onReminderCompleted?.(reminder);
      options?.onActivityDetected?.();
    }

    if (activeReminder?.id === reminderId) {
      setActiveReminder(null);
    }
  }, [reminders, activeReminder, options]);

  const addReminder = useCallback((type: ReminderType, title: string, scheduledTime: Date, description?: string) => {
    const newReminder: Reminder = {
      id: `reminder-${Date.now()}`,
      type,
      title,
      description,
      scheduledTime,
      isCompleted: false,
    };

    setReminders((prev) => [...prev, newReminder]);
    return newReminder;
  }, []);

  const getUpcomingReminders = useCallback(() => {
    const now = new Date();
    return reminders
      .filter((r) => !r.isCompleted && r.scheduledTime > now)
      .sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime());
  }, [reminders]);

  const getPastDueReminders = useCallback(() => {
    const now = new Date();
    return reminders.filter((r) => !r.isCompleted && r.scheduledTime <= now);
  }, [reminders]);

  // Check for reminders that are due
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const dueReminders = reminders.filter(
        (r) => !r.isCompleted && r.scheduledTime <= now && !activeReminder
      );
      
      if (dueReminders.length > 0) {
        setActiveReminder(dueReminders[0]);
      }
    };

    const interval = setInterval(checkReminders, 30000); // Check every 30 seconds
    checkReminders(); // Initial check

    return () => clearInterval(interval);
  }, [reminders, activeReminder]);

  return {
    reminders,
    activeReminder,
    completeReminder,
    addReminder,
    getUpcomingReminders,
    getPastDueReminders,
  };
};
