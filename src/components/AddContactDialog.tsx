import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { TrustedContact } from '@/types';
import { Plus, User, Phone, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddContactDialogProps {
  onAdd: (contact: Omit<TrustedContact, 'id'>) => void;
  trigger?: React.ReactNode;
}

const relationships = [
  'Husband',
  'Wife',
  'Partner',
  'Mother',
  'Father',
  'Sister',
  'Brother',
  'Friend',
  'Doctor',
  'Midwife',
  'Other',
];

export const AddContactDialog: React.FC<AddContactDialogProps> = ({ onAdd, trigger }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !phone.trim() || !relationship) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    onAdd({
      name: name.trim(),
      phone: phone.trim(),
      relationship,
      isPrimary,
      role: 'trusted_contact',
    });

    toast({
      title: 'Contact Added',
      description: `${name} has been added as a trusted contact.`,
    });

    // Reset form
    setName('');
    setPhone('');
    setRelationship('');
    setIsPrimary(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="w-full gap-2 border-dashed h-14">
            <Plus className="w-5 h-5" />
            Add Trusted Contact
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Add Trusted Contact
            </DialogTitle>
            <DialogDescription>
              Add someone who will be notified during emergencies.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="Enter full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="relationship">Relationship *</Label>
              <Select value={relationship} onValueChange={setRelationship}>
                <SelectTrigger>
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  {relationships.map((rel) => (
                    <SelectItem key={rel} value={rel}>
                      {rel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
              <input
                type="checkbox"
                id="isPrimary"
                checked={isPrimary}
                onChange={(e) => setIsPrimary(e.target.checked)}
                className="w-4 h-4 rounded border-primary text-primary focus:ring-primary"
              />
              <div className="flex-1">
                <Label htmlFor="isPrimary" className="flex items-center gap-2 cursor-pointer">
                  <Heart className="w-4 h-4 text-primary" />
                  Set as Primary Contact
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Primary contacts receive priority alerts
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Contact</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
