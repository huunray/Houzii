import React, { createContext, useContext, useState, useCallback } from 'react';

export interface SeekerTrustState {
  emailVerified: boolean;
  identityVerified: boolean;
  tier: 0 | 1 | 2;
}

interface SeekerTrustContextValue {
  trust: SeekerTrustState;
  verifyEmail: () => void;
  verifyIdentity: () => void;
  completedCount: number;
  tierLabel: string;
  tierShort: string;
}

const SeekerTrustContext = createContext<SeekerTrustContextValue | null>(null);

export const useSeekerTrust = () => {
  const ctx = useContext(SeekerTrustContext);
  if (!ctx) throw new Error('useSeekerTrust must be used within SeekerTrustProvider');
  return ctx;
};

export const SeekerTrustProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trust, setTrust] = useState<SeekerTrustState>({
    emailVerified: false,
    identityVerified: false,
    tier: 0,
  });

  const verifyEmail = useCallback(() => {
    setTrust(prev => ({ ...prev, emailVerified: true, tier: 1 }));
  }, []);

  const verifyIdentity = useCallback(() => {
    setTrust(prev => ({ ...prev, identityVerified: true, tier: 2 }));
  }, []);

  const completedCount = [trust.emailVerified, trust.identityVerified].filter(Boolean).length;
  const tierLabel = trust.tier === 2 ? 'Tier 2 — Identity Verified' : trust.tier === 1 ? 'Tier 1 — Email Verified' : 'Basic';
  const tierShort = trust.tier === 0 ? 'T0' : trust.tier === 1 ? 'T1' : 'T2';

  return (
    <SeekerTrustContext.Provider value={{ trust, verifyEmail, verifyIdentity, completedCount, tierLabel, tierShort }}>
      {children}
    </SeekerTrustContext.Provider>
  );
};
