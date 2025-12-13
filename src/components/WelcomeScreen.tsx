import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { UserRole } from '@/types';
import heroImage from '@/assets/hero-protection.png';
import { 
  Heart, 
  Shield, 
  MapPin, 
  Bell, 
  Mic,
  Users,
  ArrowRight,
  Baby
} from 'lucide-react';

interface WelcomeScreenProps {
  onSelectRole: (role: UserRole) => void;
}

const features = [
  {
    icon: Mic,
    title: 'Voice Detection',
    description: 'Automatically detects distress keywords',
  },
  {
    icon: Shield,
    title: 'Smart Verification',
    description: 'Multi-layer safety confirmation',
  },
  {
    icon: MapPin,
    title: 'Live Location',
    description: 'Real-time location sharing',
  },
  {
    icon: Bell,
    title: 'Smart Reminders',
    description: 'Health & activity tracking',
  },
];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSelectRole }) => {
  const [step, setStep] = useState(0);

  if (step === 0) {
    return (
      <div className="min-h-screen gradient-calm flex flex-col">
        {/* Hero section */}
        <div className="relative h-[50vh] overflow-hidden">
          <img 
            src={heroImage} 
            alt="MotherGuard - Pregnancy Safety" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="flex-1 px-6 py-8 -mt-16 relative z-10">
          <div className="max-w-lg mx-auto space-y-6">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Heart className="w-4 h-4" fill="currentColor" />
                AI-Powered Safety
              </div>
              <h1 className="text-4xl font-bold">MotherGuard</h1>
              <p className="text-lg text-muted-foreground">
                Intelligent pregnancy safety and emergency alert system
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {features.map((feature) => (
                <Card 
                  key={feature.title}
                  className="p-4 bg-card/80 backdrop-blur-sm border-border/50"
                >
                  <feature.icon className="w-6 h-6 text-primary mb-2" />
                  <h3 className="font-semibold text-sm">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </Card>
              ))}
            </div>

            <Button 
              size="xl" 
              className="w-full gap-2"
              onClick={() => setStep(1)}
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-calm flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-lg mx-auto w-full space-y-8">
        <div className="text-center space-y-3">
          <div className="w-20 h-20 mx-auto rounded-full gradient-primary flex items-center justify-center shadow-glow">
            <Heart className="w-10 h-10 text-primary-foreground" fill="currentColor" />
          </div>
          <h2 className="text-2xl font-bold">Who are you?</h2>
          <p className="text-muted-foreground">
            Select your role to get started
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => onSelectRole('pregnant_woman')}
            className="w-full p-6 rounded-2xl bg-card border-2 border-primary/20 hover:border-primary hover:shadow-glow transition-all duration-300 text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                <Baby className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Expecting Mother</h3>
                <p className="text-sm text-muted-foreground">
                  Get voice monitoring, reminders & emergency alerts
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => onSelectRole('trusted_contact')}
            className="w-full p-6 rounded-2xl bg-card border-2 border-secondary/50 hover:border-primary hover:shadow-soft transition-all duration-300 text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-secondary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Trusted Contact</h3>
                <p className="text-sm text-muted-foreground">
                  Monitor location, receive alerts & confirm safety
                </p>
              </div>
            </div>
          </button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          You can switch roles anytime in the app
        </p>
      </div>
    </div>
  );
};
