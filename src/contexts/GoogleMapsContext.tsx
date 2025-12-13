import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface GoogleMapsContextType {
  apiKey: string | null;
  setApiKey: (key: string) => void;
  isKeySet: boolean;
}

const GoogleMapsContext = createContext<GoogleMapsContextType | undefined>(undefined);

const STORAGE_KEY = 'motherguard_google_maps_key';

export const GoogleMapsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [apiKey, setApiKeyState] = useState<string | null>(() => {
    // Try to load from localStorage on init
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY);
    }
    return null;
  });

  const setApiKey = (key: string) => {
    setApiKeyState(key);
    localStorage.setItem(STORAGE_KEY, key);
  };

  return (
    <GoogleMapsContext.Provider value={{ 
      apiKey, 
      setApiKey, 
      isKeySet: !!apiKey && apiKey.length > 10 
    }}>
      {children}
    </GoogleMapsContext.Provider>
  );
};

export const useGoogleMapsKey = () => {
  const context = useContext(GoogleMapsContext);
  if (context === undefined) {
    throw new Error('useGoogleMapsKey must be used within a GoogleMapsProvider');
  }
  return context;
};
