import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  hasConsent,
  getCookiePreferences,
  saveCookiePreferences,
  clearNonEssentialCookies,
  type CookiePreferences,
} from '@/lib/cookies';

interface CookieConsentContextType {
  hasConsented: boolean;
  preferences: CookiePreferences;
  showBanner: boolean;
  showPreferences: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  savePreferences: (prefs: CookiePreferences) => void;
  openPreferences: () => void;
  closePreferences: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error('useCookieConsent must be used within CookieConsentProvider');
  }
  return context;
}

interface CookieConsentProviderProps {
  children: ReactNode;
}

export function CookieConsentProvider({ children }: CookieConsentProviderProps) {
  const [hasConsented, setHasConsented] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(getCookiePreferences());
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const consented = hasConsent();
    setHasConsented(consented);
    
    if (!consented) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    saveCookiePreferences(allAccepted);
    setPreferences(allAccepted);
    setHasConsented(true);
    setShowBanner(false);
    setShowPreferences(false);
  };

  const rejectAll = () => {
    const onlyEssential: CookiePreferences = {
      essential: true,
      functional: false,
      analytics: false,
      marketing: false,
    };
    saveCookiePreferences(onlyEssential);
    setPreferences(onlyEssential);
    setHasConsented(true);
    setShowBanner(false);
    setShowPreferences(false);
    clearNonEssentialCookies(onlyEssential);
  };

  const savePreferences = (prefs: CookiePreferences) => {
    saveCookiePreferences(prefs);
    setPreferences(prefs);
    setHasConsented(true);
    setShowBanner(false);
    setShowPreferences(false);
    clearNonEssentialCookies(prefs);
  };

  const openPreferences = () => {
    setShowPreferences(true);
    setShowBanner(false);
  };

  const closePreferences = () => {
    setShowPreferences(false);
    // If user hasn't consented yet, show banner again
    if (!hasConsented) {
      setShowBanner(true);
    }
  };

  return (
    <CookieConsentContext.Provider
      value={{
        hasConsented,
        preferences,
        showBanner,
        showPreferences,
        acceptAll,
        rejectAll,
        savePreferences,
        openPreferences,
        closePreferences,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
}

