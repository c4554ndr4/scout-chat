'use client';

import { useState, useEffect } from 'react';
import PasswordProtection from '../components/PasswordProtection';
import PrivacyPolicy from '../components/PrivacyPolicy';
import MainApp from '../components/MainApp';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasAcceptedPrivacy, setHasAcceptedPrivacy] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has already authenticated and accepted privacy policy
    const authStatus = localStorage.getItem('scout_authenticated');
    const privacyStatus = localStorage.getItem('scout_privacy_accepted');
    
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    if (privacyStatus === 'true') {
      setHasAcceptedPrivacy(true);
    }
    
    setIsLoading(false);
  }, []);

  const handleAuthentication = () => {
    setIsAuthenticated(true);
    localStorage.setItem('scout_authenticated', 'true');
  };

  const handlePrivacyAcceptance = () => {
    setHasAcceptedPrivacy(true);
    localStorage.setItem('scout_privacy_accepted', 'true');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center scout-gradient">
        <div className="text-white text-xl">Loading ScoutChat...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <PasswordProtection onAuthenticated={handleAuthentication} />;
  }

  if (!hasAcceptedPrivacy) {
    return <PrivacyPolicy onAccepted={handlePrivacyAcceptance} />;
  }

  return <MainApp />;
} 