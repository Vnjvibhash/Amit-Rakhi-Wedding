import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../lib/firebase';
import { AdminUser } from '../types/wedding';

interface AuthContextValue {
  user: User | null;
  adminProfile: AdminUser | null;
  isAdmin: boolean;
  loading: boolean;
  isDemoMode: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginDemoAdmin: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const DEMO_ADMIN_KEY = 'wedding_demo_admin_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth || !db) {
      const saved = sessionStorage.getItem(DEMO_ADMIN_KEY);
      if (saved) {
        setAdminProfile(JSON.parse(saved));
      }
      setLoading(false);
      return;
    }

    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setUser(fbUser);
      if (fbUser && db) {
        try {
          const snap = await getDoc(doc(db, 'admin_users', fbUser.uid));
          if (snap.exists()) {
            const data = snap.data();
            if (data.role === 'admin' || data.role === 'super_admin') {
              setAdminProfile({
                uid: fbUser.uid,
                email: fbUser.email || data.email || '',
                displayName: data.displayName || fbUser.displayName || 'Wedding Admin',
                role: data.role
              });
            } else {
              setAdminProfile(null);
            }
          } else {
            setAdminProfile(null);
          }
        } catch {
          setAdminProfile(null);
        }
      } else {
        setAdminProfile(null);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const login = async (email: string, password: string) => {
    if (!isFirebaseConfigured || !auth || !db) {
      throw new Error('Firebase is not configured. Use Demo Admin access or configure .env.');
    }
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const snap = await getDoc(doc(db, 'admin_users', cred.user.uid));
    if (!snap.exists() || !['admin', 'super_admin'].includes(snap.data().role)) {
      await signOut(auth);
      throw new Error(
        'This account does not have administrator privileges in the admin_users collection.'
      );
    }
    const data = snap.data();
    setAdminProfile({
      uid: cred.user.uid,
      email: cred.user.email || email,
      displayName: data.displayName || 'Wedding Admin',
      role: data.role
    });
  };

  const loginDemoAdmin = () => {
    const demo: AdminUser = {
      uid: 'demo-admin',
      email: 'admin@amitrakhi.wedding',
      displayName: 'Royal Wedding Coordinator (Preview)',
      role: 'super_admin'
    };
    sessionStorage.setItem(DEMO_ADMIN_KEY, JSON.stringify(demo));
    setAdminProfile(demo);
  };

  const logout = async () => {
    sessionStorage.removeItem(DEMO_ADMIN_KEY);
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    }
    setUser(null);
    setAdminProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        adminProfile,
        isAdmin: Boolean(adminProfile),
        loading,
        isDemoMode: !isFirebaseConfigured,
        login,
        loginDemoAdmin,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

