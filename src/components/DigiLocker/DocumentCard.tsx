import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Image, 
  Eye, 
  Download, 
  Trash2,
  Lock,
  Users,
  AlertTriangle,
  MoreVertical
} from 'lucide-react';
import { DigiLockerDocument, DocumentAccessLevel, DocumentType } from '@/types';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DocumentCardProps {
  document: DigiLockerDocument;
  onDelete: () => void;
  readOnly?: boolean;
}

const getDocumentIcon = (type: DocumentType) => {
  if (['scan_report'].includes(type)) return Image;
  return FileText;
};

const getDocumentTypeLabel = (type: DocumentType): string => {
  const labels: Record<DocumentType, string> = {
    government_id: 'Government ID',
    pregnancy_report: 'Pregnancy Report',
    scan_report: 'Scan Report',
    blood_group: 'Blood Group',
    prescription: 'Prescription',
    insurance: 'Insurance',
    medical_notes: 'Medical Notes',
  };
  return labels[type];
};

const getAccessBadge = (level: DocumentAccessLevel) => {
  switch (level) {
    case 'private':
      return { label: 'Private', icon: Lock, variant: 'secondary' as const };
    case 'trusted_contacts':
      return { label: 'Trusted', icon: Users, variant: 'default' as const };
    case 'emergency_only':
      return { label: 'Emergency', icon: AlertTriangle, variant: 'destructive' as const };
  }
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const DocumentCard: React.FC<DocumentCardProps> = ({ document, onDelete, readOnly = false }) => {
  const Icon = getDocumentIcon(document.type);
  const accessBadge = getAccessBadge(document.accessLevel);
  const AccessIcon = accessBadge.icon;

  return (
    <Card className="p-4 rounded-2xl hover:shadow-lg transition-all">
      <div className="flex items-start gap-3">
        {/* Thumbnail */}
        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          {document.thumbnailUrl ? (
            <img 
              src={document.thumbnailUrl} 
              alt={document.name}
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <Icon className="w-6 h-6 text-primary" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h4 className="font-semibold truncate">{document.name}</h4>
              <p className="text-sm text-muted-foreground truncate">{document.fileName}</p>
            </div>
            {!readOnly && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Eye className="w-4 h-4 mr-2" /> View
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="w-4 h-4 mr-2" /> Download
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive" onClick={onDelete}>
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge variant="outline" className="text-xs rounded-xl">
              {getDocumentTypeLabel(document.type)}
            </Badge>
            <Badge variant={accessBadge.variant} className="text-xs rounded-xl flex items-center gap-1">
              <AccessIcon className="w-3 h-3" />
              {accessBadge.label}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formatFileSize(document.fileSize)}
            </span>
          </div>

          <p className="text-xs text-muted-foreground mt-1">
            Uploaded {format(document.uploadedAt, 'MMM d, yyyy')}
          </p>
        </div>
      </div>

      {/* Quick Actions for Read-only */}
      {readOnly && (
        <div className="flex gap-2 mt-3 pt-3 border-t border-border">
          <Button variant="outline" size="sm" className="flex-1 rounded-xl">
            <Eye className="w-4 h-4 mr-1" /> Preview
          </Button>
          <Button variant="outline" size="sm" className="flex-1 rounded-xl">
            <Download className="w-4 h-4 mr-1" /> Download
          </Button>
        </div>
      )}
    </Card>
  );
};
