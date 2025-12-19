import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FolderOpen, 
  Upload, 
  Lock, 
  Unlock, 
  FileText, 
  Image,
  Shield,
  AlertTriangle,
  Plus,
  Eye,
  Download,
  Trash2,
  Users
} from 'lucide-react';
import { DigiLockerDocument, DocumentType } from '@/types';
import { DocumentUploadDialog } from './DocumentUploadDialog';
import { DocumentCard } from './DocumentCard';
import { AccessControlPanel } from './AccessControlPanel';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';

const documentCategories: { type: DocumentType; label: string; icon: React.ElementType }[] = [
  { type: 'government_id', label: 'Government ID', icon: FileText },
  { type: 'pregnancy_report', label: 'Pregnancy Reports', icon: FileText },
  { type: 'scan_report', label: 'Scan Reports', icon: Image },
  { type: 'blood_group', label: 'Blood Group', icon: FileText },
  { type: 'prescription', label: 'Prescriptions', icon: FileText },
  { type: 'insurance', label: 'Insurance', icon: Shield },
  { type: 'medical_notes', label: 'Medical Notes', icon: FileText },
];

export const DigiLockerPage: React.FC = () => {
  const { emergencyStatus, digiLockerDocuments, addDocument, deleteDocument, emergencyAccessEnabled, toggleEmergencyAccess } = useApp();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [accessPanelOpen, setAccessPanelOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<DocumentType | 'all'>('all');

  const isEmergencyMode = emergencyStatus === 'emergency' || emergencyStatus === 'alert';

  const filteredDocuments = selectedCategory === 'all' 
    ? digiLockerDocuments 
    : digiLockerDocuments.filter(d => d.type === selectedCategory);

  const getDocumentCount = (type: DocumentType) => 
    digiLockerDocuments.filter(d => d.type === type).length;

  return (
    <div className="min-h-screen pb-24 animate-fade-in scrollbar-hide">
      {/* Header */}
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">My DigiLocker</h1>
              <p className="text-sm text-muted-foreground">Secure emergency documents</p>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Access Status */}
      <div className="px-4 mb-4">
        <Card className={cn(
          "p-4 rounded-3xl border-2 transition-all",
          isEmergencyMode 
            ? "border-emergency bg-emergency/5" 
            : emergencyAccessEnabled 
              ? "border-warning bg-warning/5"
              : "border-safe bg-safe/5"
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isEmergencyMode ? (
                <>
                  <Unlock className="w-6 h-6 text-emergency animate-pulse" />
                  <div>
                    <p className="font-semibold text-emergency">🔓 Emergency Access Active</p>
                    <p className="text-sm text-muted-foreground">Documents shared with contacts</p>
                  </div>
                </>
              ) : emergencyAccessEnabled ? (
                <>
                  <Unlock className="w-6 h-6 text-warning" />
                  <div>
                    <p className="font-semibold text-warning">🔓 Emergency Access Enabled</p>
                    <p className="text-sm text-muted-foreground">Ready for emergencies</p>
                  </div>
                </>
              ) : (
                <>
                  <Lock className="w-6 h-6 text-safe" />
                  <div>
                    <p className="font-semibold text-safe">🔒 Documents Locked</p>
                    <p className="text-sm text-muted-foreground">Private & secure</p>
                  </div>
                </>
              )}
            </div>
            <Button 
              variant={emergencyAccessEnabled ? "outline" : "default"}
              size="sm"
              className="rounded-2xl"
              onClick={toggleEmergencyAccess}
              disabled={isEmergencyMode}
            >
              {emergencyAccessEnabled ? 'Disable' : 'Enable'}
            </Button>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mb-4">
        <div className="grid grid-cols-2 gap-3">
          <Button 
            onClick={() => setUploadDialogOpen(true)}
            className="h-14 rounded-2xl bg-primary hover:bg-primary/90"
          >
            <Upload className="w-5 h-5 mr-2" />
            Upload Document
          </Button>
          <Button 
            variant="outline"
            onClick={() => setAccessPanelOpen(true)}
            className="h-14 rounded-2xl"
          >
            <Users className="w-5 h-5 mr-2" />
            Manage Access
          </Button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          <Badge 
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            className="cursor-pointer whitespace-nowrap px-4 py-2 rounded-2xl"
            onClick={() => setSelectedCategory('all')}
          >
            All ({digiLockerDocuments.length})
          </Badge>
          {documentCategories.map(cat => (
            <Badge 
              key={cat.type}
              variant={selectedCategory === cat.type ? 'default' : 'outline'}
              className="cursor-pointer whitespace-nowrap px-4 py-2 rounded-2xl"
              onClick={() => setSelectedCategory(cat.type)}
            >
              {cat.label} ({getDocumentCount(cat.type)})
            </Badge>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      <div className="px-4">
        {filteredDocuments.length === 0 ? (
          <Card className="p-8 rounded-3xl text-center">
            <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No Documents Yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upload important documents for emergency access
            </p>
            <Button 
              onClick={() => setUploadDialogOpen(true)}
              className="rounded-2xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Document
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredDocuments.map(doc => (
              <DocumentCard 
                key={doc.id} 
                document={doc} 
                onDelete={() => deleteDocument(doc.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Upload Dialog */}
      <DocumentUploadDialog 
        open={uploadDialogOpen} 
        onOpenChange={setUploadDialogOpen}
        onUpload={addDocument}
      />

      {/* Access Control Panel */}
      <AccessControlPanel 
        open={accessPanelOpen} 
        onOpenChange={setAccessPanelOpen}
      />
    </div>
  );
};
