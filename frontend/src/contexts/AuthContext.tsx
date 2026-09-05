import { createContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "firebase/auth";
import {
  firebaseReady,
  signInAsGuest,
  signInWithGoogle,
  signOutUser,
  subscribeToAuthChanges,
} from "@/services/firebase";
import type { AuthUser } from "@/types";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isConfigured: boolean;
  loginWithGoogle: () => Promise<void>;
  loginAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
}

function toAuthUser(user: User | null): AuthUser | null {
  if (!user) return null;
  return {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    isAnonymous: user.isAnonymous,
  };
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((firebaseUser) => {
      setUser(toAuthUser(firebaseUser));
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  const value: AuthContextValue = {
    user,
    isLoading,
    isConfigured: firebaseReady,
    loginWithGoogle: async () => {
      const firebaseUser = await signInWithGoogle();
      setUser(toAuthUser(firebaseUser));
    },
    loginAsGuest: async () => {
      const firebaseUser = await signInAsGuest();
      setUser(toAuthUser(firebaseUser));
    },
    logout: async () => {
      await signOutUser();
      setUser(null);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
