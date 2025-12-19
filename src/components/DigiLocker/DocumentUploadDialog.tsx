import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Upload, 
  FileText, 
  Image,
  X,
  Lock,
  Users,
  AlertTriangle
} from 'lucide-react';
import { DigiLockerDocument, DocumentType, DocumentAccessLevel } from '@/types';

interface DocumentUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (document: Omit<DigiLockerDocument, 'id' | 'uploadedAt'>) => void;
}

const documentTypes: { value: DocumentType; label: string }[] = [
  { value: 'government_id', label: 'Government ID (Aadhaar / ID Proof)' },
  { value: 'pregnancy_report', label: 'Pregnancy Report' },
  { value: 'scan_report', label: 'Scan Report (Ultrasound/MRI)' },
  { value: 'blood_group', label: 'Blood Group Details' },
  { value: 'prescription', label: 'Doctor Prescription' },
  { value: 'insurance', label: 'Insurance Details' },
  { value: 'medical_notes', label: 'Emergency Medical Notes' },
];

const accessLevels: { value: DocumentAccessLevel; label: string; description: string; icon: React.ElementType }[] = [
  { value: 'private', label: 'Private', description: 'Only you can see', icon: Lock },
  { value: 'trusted_contacts', label: 'Trusted Contacts', description: 'Husband & relatives', icon: Users },
  { value: 'emergency_only', label: 'Emergency Only', description: 'Auto-shared in emergency', icon: AlertTriangle },
];

export const DocumentUploadDialog: React.FC<DocumentUploadDialogProps> = ({
  open,
  onOpenChange,
  onUpload,
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<DocumentType>('pregnancy_report');
  const [accessLevel, setAccessLevel] = useState<DocumentAccessLevel>('emergency_only');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!name) {
        setName(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleUpload = () => {
    if (!name || !selectedFile) return;

    onUpload({
      type,
      name,
      fileName: selectedFile.name,
      fileSize: selectedFile.size,
      accessLevel,
      thumbnailUrl: selectedFile.type.startsWith('image/') 
        ? URL.createObjectURL(selectedFile) 
        : undefined,
    });

    // Reset form
    setName('');
    setType('pregnancy_report');
    setAccessLevel('emergency_only');
    setSelectedFile(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            Upload Document
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Upload Area */}
          <div className="border-2 border-dashed border-border rounded-2xl p-6 text-center hover:border-primary/50 transition-colors">
            {selectedFile ? (
              <div className="flex items-center justify-center gap-3">
                {selectedFile.type.startsWith('image/') ? (
                  <Image className="w-8 h-8 text-primary" />
                ) : (
                  <FileText className="w-8 h-8 text-primary" />
                )}
                <div className="text-left">
                  <p className="font-medium truncate max-w-[200px]">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setSelectedFile(null)}
                  className="ml-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <label className="cursor-pointer">
                <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                <p className="font-medium">Click to upload</p>
                <p className="text-sm text-muted-foreground">PDF, JPG, PNG up to 10MB</p>
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                />
              </label>
            )}
          </div>

          {/* Document Name */}
          <div className="space-y-2">
            <Label>Document Name</Label>
            <Input 
              placeholder="e.g., Pregnancy Report - Week 20"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl"
            />
          </div>

          {/* Document Type */}
          <div className="space-y-2">
            <Label>Document Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as DocumentType)}>
              <SelectTrigger className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {documentTypes.map(dt => (
                  <SelectItem key={dt.value} value={dt.value}>
                    {dt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Access Level */}
          <div className="space-y-2">
            <Label>Who can access?</Label>
            <div className="grid grid-cols-1 gap-2">
              {accessLevels.map(level => {
                const Icon = level.icon;
                return (
                  <button
                    key={level.value}
                    type="button"
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                      accessLevel === level.value 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/30'
                    }`}
                    onClick={() => setAccessLevel(level.value)}
                  >
                    <Icon className={`w-5 h-5 ${accessLevel === level.value ? 'text-primary' : 'text-muted-foreground'}`} />
                    <div>
                      <p className="font-medium">{level.label}</p>
                      <p className="text-sm text-muted-foreground">{level.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            onClick={handleUpload}
            disabled={!name || !selectedFile}
            className="w-full rounded-2xl h-12"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
