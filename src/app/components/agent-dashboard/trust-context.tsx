import React, { createContext, useContext, useState, useCallback } from 'react';

export interface TrustState {
  tier: number; // 1 = Basic, 2 = Pro, 3 = Financial
  emailVerified: boolean;
  identityVerified: boolean;
  financialCleared: boolean;
}

interface TrustContextValue {
  trust: TrustState;
  verifyEmail: () => void;
  verifyIdentity: () => void;
  clearFinancial: () => void;
  tierLabel: string;
  progressPercent: number;
  completedCount: number;
}

const TrustContext = createContext<TrustContextValue | null>(null);

export const useTrust = () => {
  const ctx = useContext(TrustContext);
  if (!ctx) throw new Error('useTrust must be used within TrustProvider');
  return ctx;
};

export const TrustProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trust, setTrust] = useState<TrustState>({
    tier: 1,
    emailVerified: false,
    identityVerified: false,
    financialCleared: false,
  });

  const verifyEmail = useCallback(() => {
    setTrust(prev => ({ ...prev, emailVerified: true }));
  }, []);

  const verifyIdentity = useCallback(() => {
    setTrust(prev => ({ ...prev, identityVerified: true, tier: 2 }));
  }, []);

  const clearFinancial = useCallback(() => {
    setTrust(prev => ({ ...prev, financialCleared: true, tier: 3 }));
  }, []);

  const completedCount = [trust.emailVerified, trust.identityVerified, trust.financialCleared].filter(Boolean).length;
  const progressPercent = Math.round((completedCount / 3) * 100);
  const tierLabel = trust.tier === 1 ? 'Basic' : trust.tier === 2 ? 'Pro' : 'Verified';

  return (
    <TrustContext.Provider value={{
      trust,
      verifyEmail,
      verifyIdentity,
      clearFinancial,
      tierLabel,
      progressPercent,
      completedCount,
    }}>
      {children}
    </TrustContext.Provider>
  );
};
