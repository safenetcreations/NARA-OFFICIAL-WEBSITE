// Firebase Authentication Context for NARA Admin Portal
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  confirmPasswordReset
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

const FirebaseAuthContext = createContext({});

export const useFirebaseAuth = () => {
  const context = useContext(FirebaseAuthContext);
  if (!context) {
    throw new Error('useFirebaseAuth must be used within a FirebaseAuthProvider');
  }
  return context;
};

export const FirebaseAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Google Auth Provider
  const googleProvider = new GoogleAuthProvider();
  googleProvider?.setCustomParameters({
    domain_hint: 'nara.gov.lk'
  });

  // Sign in with email and password
  const signIn = async (email, password) => {
    try {
      setError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);
      await ensureAdminProfile(result?.user);
      return result;
    } catch (error) {
      setError(error?.message);
      throw error;
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);
      await ensureAdminProfile(result?.user);
      return result;
    } catch (error) {
      setError(error?.message);
      throw error;
    }
  };

  // Sign out
  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
      setUser(null);
      setProfile(null);
    } catch (error) {
      setError(error?.message);
      throw error;
    }
  };

  // Send password reset email
  const resetPassword = async (email) => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      setError(error?.message);
      throw error;
    }
  };

  // Confirm password reset
  const confirmPasswordResetCode = async (oobCode, newPassword) => {
    try {
      setError(null);
      await confirmPasswordReset(auth, oobCode, newPassword);
    } catch (error) {
      setError(error?.message);
      throw error;
    }
  };

  // Ensure a Firestore admin profile exists for the authenticated user
  const ensureAdminProfile = async (firebaseUser) => {
    if (!firebaseUser) return;
    try {
      const profileRef = doc(db, 'adminProfiles', firebaseUser?.uid);
      const snap = await getDoc(profileRef);
      const base = {
        uid: firebaseUser?.uid,
        email: firebaseUser?.email,
        displayName: firebaseUser?.displayName || 'Admin User',
        photoURL: firebaseUser?.photoURL || null,
        role: 'admin',
        is_active: true,
        lastLoginAt: new Date()
      };
      if (!snap?.exists()) {
        await setDoc(profileRef, { ...base, createdAt: new Date(), updatedAt: new Date() });
      } else {
        await updateDoc(profileRef, { lastLoginAt: new Date(), updatedAt: new Date() });
      }
      setProfile({ ...base });
    } catch (error) {
      console.error('Error ensuring admin profile:', error);
    }
  };

  // Load user profile from Firestore
  const loadUserProfile = async (user) => {
    if (!user) return;
    try {
      const ref = doc(db, 'adminProfiles', user?.uid);
      const snap = await getDoc(ref);
      if (!snap?.exists()) {
        await ensureAdminProfile(user);
        return;
      }
      const profileData = snap?.data();
      setProfile(profileData);
      await updateDoc(ref, { lastLoginAt: new Date() });
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  // Check if user has admin privileges
  const isAdmin = () => {
    return profile?.role === 'admin' || profile?.role === 'senior_researcher';
  };

  // Get admin permissions
  const getAdminPermissions = () => {
    if (!profile) return [];
    
    const basePermissions = ['view_dashboard', 'view_analytics'];
    
    if (profile?.role === 'admin') {
      return [
        ...basePermissions,
        'manage_users',
        'manage_content',
        'manage_applications',
        'manage_system',
        'view_logs',
        'manage_cloud_functions'
      ];
    }
    
    if (profile?.role === 'senior_researcher') {
      return [
        ...basePermissions,
        'manage_content',
        'view_applications',
        'manage_research_data'
      ];
    }
    
    return basePermissions;
  };

  const value = {
    user,
    profile,
    loading,
    error,
    signIn,
    signInWithGoogle,
    logout,
    resetPassword,
    confirmPasswordResetCode,
    isAdmin,
    getAdminPermissions,
    setError
  };

  return (
    <FirebaseAuthContext.Provider value={value}>
      {children}
    </FirebaseAuthContext.Provider>
  );
};

export default FirebaseAuthProvider;