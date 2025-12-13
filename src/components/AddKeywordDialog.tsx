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
import { Plus, Mic, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddKeywordDialogProps {
  keywords: string[];
  onAdd: (keyword: string) => void;
  trigger?: React.ReactNode;
}

export const AddKeywordDialog: React.FC<AddKeywordDialogProps> = ({ keywords, onAdd, trigger }) => {
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedKeyword = keyword.trim().toLowerCase();
    
    if (!trimmedKeyword) {
      toast({
        title: 'Missing Keyword',
        description: 'Please enter a keyword.',
        variant: 'destructive',
      });
      return;
    }

    if (keywords.includes(trimmedKeyword)) {
      toast({
        title: 'Keyword Exists',
        description: 'This keyword is already in your list.',
        variant: 'destructive',
      });
      return;
    }

    onAdd(trimmedKeyword);

    toast({
      title: 'Keyword Added',
      description: `"${trimmedKeyword}" will now trigger emergency alerts.`,
    });

    setKeyword('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-1">
            <Plus className="w-4 h-4" />
            Add Keyword
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mic className="w-5 h-5 text-primary" />
              Add Emergency Keyword
            </DialogTitle>
            <DialogDescription>
              Add a word that will trigger emergency detection when spoken.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  Choose words you would naturally say in an emergency but not in normal conversation.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="keyword">Keyword *</Label>
              <Input
                id="keyword"
                placeholder="e.g., danger, ambulance"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground text-sm">Current Keywords:</Label>
              <div className="flex flex-wrap gap-2">
                {keywords.map((kw) => (
                  <span
                    key={kw}
                    className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Keyword</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
