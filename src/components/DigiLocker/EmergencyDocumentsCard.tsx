import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FolderOpen, 
  FileText, 
  Eye, 
  Download, 
  AlertTriangle,
  Lock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { DocumentCard } from './DocumentCard';

export const EmergencyDocumentsCard: React.FC = () => {
  const { emergencyStatus, digiLockerDocuments, emergencyAccessEnabled } = useApp();
  const [expanded, setExpanded] = useState(false);

  const isEmergencyMode = emergencyStatus === 'emergency' || emergencyStatus === 'alert';
  const accessibleDocuments = digiLockerDocuments.filter(
    d => d.accessLevel === 'trusted_contacts' || d.accessLevel === 'emergency_only'
  );

  const canAccess = isEmergencyMode || emergencyAccessEnabled;

  return (
    <Card className="rounded-3xl overflow-hidden">
      {/* Header */}
      <div 
        className={`p-4 flex items-center justify-between cursor-pointer ${
          isEmergencyMode ? 'bg-emergency/10' : 'bg-muted/50'
        }`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isEmergencyMode ? 'bg-emergency/20' : 'bg-primary/10'
          }`}>
            <FolderOpen className={`w-5 h-5 ${isEmergencyMode ? 'text-emergency' : 'text-primary'}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">Emergency Documents</h3>
              {isEmergencyMode && (
                <Badge variant="destructive" className="text-xs animate-pulse">
                  ACTIVE
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {accessibleDocuments.length} documents available
            </p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </div>

      {/* Warning Banner */}
      {!isEmergencyMode && !canAccess && (
        <div className="px-4 py-3 bg-warning/10 border-y border-warning/20">
          <div className="flex items-center gap-2 text-warning">
            <Lock className="w-4 h-4" />
            <p className="text-sm font-medium">Documents locked - Emergency access required</p>
          </div>
        </div>
      )}

      {isEmergencyMode && (
        <div className="px-4 py-3 bg-emergency/10 border-y border-emergency/20">
          <div className="flex items-center gap-2 text-emergency">
            <AlertTriangle className="w-4 h-4" />
            <p className="text-sm font-medium">Emergency mode - Full access granted</p>
          </div>
        </div>
      )}

      {/* Documents List */}
      {expanded && (
        <div className="p-4 space-y-3">
          {canAccess ? (
            accessibleDocuments.length > 0 ? (
              accessibleDocuments.map(doc => (
                <DocumentCard 
                  key={doc.id} 
                  document={doc} 
                  onDelete={() => {}} 
                  readOnly 
                />
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <FileText className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p>No emergency documents uploaded yet</p>
              </div>
            )
          ) : (
            <div className="text-center py-6">
              <Lock className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Access restricted</p>
              <p className="text-sm text-muted-foreground">
                Documents will be available during emergencies
              </p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
