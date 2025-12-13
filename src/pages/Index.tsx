import React, { useState } from 'react';
import { AppProvider, useApp } from '@/contexts/AppContext';
import { Header } from '@/components/Header';
import { Navigation } from '@/components/Navigation';
import { EmergencyOverlay } from '@/components/EmergencyOverlay';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { PregnantDashboard } from '@/pages/PregnantDashboard';
import { TrustedContactDashboard } from '@/pages/TrustedContactDashboard';
import { RemindersPage } from '@/pages/RemindersPage';
import { LocationPage } from '@/pages/LocationPage';
import { ContactsPage } from '@/pages/ContactsPage';
import { UserRole } from '@/types';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [showWelcome, setShowWelcome] = useState(true);
  
  const { 
    userName, 
    emergencyStatus, 
    currentRole, 
    setCurrentRole,
    verifySafe,
    resolveEmergency
  } = useApp();

  const handleSelectRole = (role: UserRole) => {
    setCurrentRole(role);
    setShowWelcome(false);
  };

  const handleSwitchRole = () => {
    setCurrentRole(currentRole === 'pregnant_woman' ? 'trusted_contact' : 'pregnant_woman');
  };

  if (showWelcome) {
    return <WelcomeScreen onSelectRole={handleSelectRole} />;
  }

  const renderPage = () => {
    if (currentRole === 'trusted_contact') {
      switch (currentPage) {
        case 'location':
          return <LocationPage />;
        case 'contacts':
          return <ContactsPage />;
        default:
          return <TrustedContactDashboard />;
      }
    }

    switch (currentPage) {
      case 'reminders':
        return <RemindersPage />;
      case 'location':
        return <LocationPage />;
      case 'contacts':
        return <ContactsPage />;
      default:
        return <PregnantDashboard />;
    }
  };

  return (
    <div className="min-h-screen gradient-calm">
      <Header
        userName={userName}
        status={emergencyStatus}
        currentRole={currentRole}
        onSwitchRole={handleSwitchRole}
      />

      <main className="max-w-lg mx-auto px-4 py-6">
        {renderPage()}
      </main>

      <Navigation
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />

      <EmergencyOverlay
        isVisible={emergencyStatus === 'emergency'}
        onConfirmSafe={() => {
          if (currentRole === 'pregnant_woman') {
            verifySafe('button');
          } else {
            resolveEmergency('contact');
          }
        }}
        onClose={() => resolveEmergency('contact')}
      />
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default Index;
