import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Baby, Calendar, Heart, Activity } from 'lucide-react';

interface PregnancyTrackerProps {
  weeksPregnant: number;
  dueDate: string;
}

const weeklyInfo: Record<number, { babySize: string; development: string }> = {
  24: { babySize: 'an ear of corn', development: 'Baby can hear sounds from outside' },
  25: { babySize: 'a rutabaga', development: 'Baby is developing their sense of equilibrium' },
  26: { babySize: 'a head of lettuce', development: 'Baby\'s eyes are beginning to open' },
  27: { babySize: 'a cauliflower', development: 'Baby can recognize your voice' },
  28: { babySize: 'a large eggplant', development: 'Baby can blink and has eyelashes' },
  29: { babySize: 'a butternut squash', development: 'Baby\'s bones are hardening' },
  30: { babySize: 'a cabbage', development: 'Baby is gaining weight rapidly' },
  31: { babySize: 'a coconut', development: 'Baby can turn their head side to side' },
  32: { babySize: 'a jicama', development: 'Baby is practicing breathing movements' },
  33: { babySize: 'a pineapple', development: 'Baby\'s bones are fully developed' },
  34: { babySize: 'a cantaloupe', development: 'Baby\'s fingernails reach fingertips' },
  35: { babySize: 'a honeydew melon', development: 'Baby is getting ready for birth' },
  36: { babySize: 'a romaine lettuce', development: 'Baby is considered early term' },
  37: { babySize: 'a bunch of Swiss chard', development: 'Baby is full term!' },
  38: { babySize: 'a leek', development: 'Baby could arrive any day now' },
  39: { babySize: 'a small pumpkin', development: 'Baby is fully developed' },
  40: { babySize: 'a small watermelon', development: 'Due date!' },
};

export const PregnancyTracker: React.FC<PregnancyTrackerProps> = ({ weeksPregnant, dueDate }) => {
  const progress = (weeksPregnant / 40) * 100;
  const trimester = weeksPregnant <= 13 ? 1 : weeksPregnant <= 26 ? 2 : 3;
  const daysRemaining = Math.ceil((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  const info = weeklyInfo[weeksPregnant] || { 
    babySize: 'growing beautifully', 
    development: 'Your baby is developing well' 
  };

  return (
    <Card className="p-5 shadow-soft overflow-hidden">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
          <Baby className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-bold text-lg">Week {weeksPregnant}</h3>
          <p className="text-sm text-muted-foreground">Trimester {trimester}</p>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-semibold">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-3" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Week 1</span>
          <span>Week 40</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 rounded-xl bg-primary/10">
          <div className="flex items-center gap-2 text-primary mb-1">
            <Calendar className="w-4 h-4" />
            <span className="text-xs font-medium">Due Date</span>
          </div>
          <p className="font-semibold text-sm">{new Date(dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
        </div>
        <div className="p-3 rounded-xl bg-safe/10">
          <div className="flex items-center gap-2 text-safe mb-1">
            <Activity className="w-4 h-4" />
            <span className="text-xs font-medium">Days Left</span>
          </div>
          <p className="font-semibold text-sm">{Math.max(0, daysRemaining)} days</p>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-muted/50">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold">Baby Update</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Your baby is about the size of <span className="font-medium text-foreground">{info.babySize}</span>. {info.development}.
        </p>
      </div>
    </Card>
  );
};
