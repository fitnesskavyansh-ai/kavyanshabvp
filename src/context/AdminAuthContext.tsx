import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

import {
  User,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  IdTokenResult,
} from 'firebase/auth';

import {
  auth,
  isFirebaseConfigured,
  CONFIGURED_ADMIN_UID,
} from '../lib/firebase';

interface AdminAuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  claims: Record<string, any> | null;
  authError: string | null;
  isFirebaseAvailable: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
  refreshClaims: () => Promise<boolean>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(
  undefined
);

export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [claims, setClaims] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const isFirebaseAvailable = isFirebaseConfigured();

  const verifyAdminStatus = async (
    currentUser: User
  ): Promise<boolean> => {
    try {
      // Remove hidden characters / whitespace from UID values
      const normalizeUid = (value: unknown): string =>
        String(value ?? '')
          .replace(/[\u200B-\u200D\uFEFF]/g, '')
          .trim();

      const currentUid = normalizeUid(currentUser.uid);
      const authorizedUid = normalizeUid(CONFIGURED_ADMIN_UID);

      console.log(
        '[AdminAuth] Current UID:',
        JSON.stringify(currentUid)
      );

      console.log(
        '[AdminAuth] Authorized UID:',
        JSON.stringify(authorizedUid)
      );

      const authorized =
        currentUid.length > 0 &&
        authorizedUid.length > 0 &&
        currentUid === authorizedUid;

      setIsAdmin(authorized);

      // Fetch Firebase token claims for diagnostics
      try {
        const tokenResult: IdTokenResult =
          await currentUser.getIdTokenResult(false);

        setClaims(tokenResult.claims);
      } catch {
        setClaims(null);
      }

      if (!authorized) {
        if (!authorizedUid) {
          setAuthError(
            `Configuration Required: VITE_ADMIN_UID is not set. Set VITE_ADMIN_UID="${currentUid}" in your environment variables.`
          );
        } else {
          setAuthError(
            `Access Denied: Your account (${currentUser.email}, UID: ${currentUid}) is not the authorized administrator UID.`
          );
        }
      } else {
        setAuthError(null);
      }

      return authorized;
    } catch (err: any) {
      console.error(
        '[AdminAuth] Error verifying admin UID:',
        err
      );

      setIsAdmin(false);
      setClaims(null);
      setAuthError(
        err?.message || 'Failed to verify admin authorization'
      );

      return false;
    }
  };

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        setUser(currentUser);

        if (currentUser) {
          await verifyAdminStatus(currentUser);
        } else {
          setIsAdmin(false);
          setClaims(null);
          setAuthError(null);
        }

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const signIn = async (
    email: string,
    pass: string
  ): Promise<void> => {
    if (!auth) {
      throw new Error(
        'Firebase Authentication is not configured. Please supply VITE_FIREBASE_* environment variables.'
      );
    }

    setAuthError(null);
    setLoading(true);

    try {
      const cred = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        pass
      );

      const authorized = await verifyAdminStatus(cred.user);

      if (!authorized) {
        throw new Error(
          CONFIGURED_ADMIN_UID
            ? 'Unauthorized: Your credentials are valid in Firebase, but your account UID is not the authorized administrator.'
            : `Configuration needed: Please set VITE_ADMIN_UID="${cred.user.uid}" in your environment variables.`
        );
      }
    } catch (err: any) {
      setAuthError(err?.message || 'Sign in failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    if (auth) {
      await firebaseSignOut(auth);
    }

    setUser(null);
    setIsAdmin(false);
    setClaims(null);
    setAuthError(null);
  };

  const resetPassword = async (
    email: string
  ): Promise<void> => {
    if (!auth) {
      throw new Error(
        'Firebase Authentication is not configured.'
      );
    }

    setAuthError(null);

    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (err: any) {
      setAuthError(
        err?.message || 'Failed to send password reset email'
      );
      throw err;
    }
  };

  const refreshClaims = async (): Promise<boolean> => {
    if (!user) return false;

    setLoading(true);

    try {
      return await verifyAdminStatus(user);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setAuthError(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
        claims,
        authError,
        isFirebaseAvailable,
        signIn,
        signOut,
        resetPassword,
        clearError,
        refreshClaims,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error(
      'useAdminAuth must be used within an AdminAuthProvider'
    );
  }

  return context;
};
