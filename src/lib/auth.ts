'use client';
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  getFirestore,
} from 'firebase/firestore';

export const handleSignInWithGoogle = async (
  auth: Auth
): Promise<UserCredential | null> => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result;
  } catch (error) {
    console.error('Error during Google sign-in:', error);
    return null;
  }
};

export const getOrCreateUser = async (user: FirebaseUser) => {
  const db = getFirestore(user.app);
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    // Create user
    const { displayName, email, photoURL } = user;
    try {
      await setDoc(userRef, {
        displayName,
        email,
        photoURL,
        language: 'en', // default language
        phoneWhatsApp: '', // To be filled in onboarding
        consentWhatsApp: false, // To be filled in onboarding
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        isAdmin: false,
        roles: [],
      });
    } catch (error) {
      console.error('Error creating user document:', error);
    }
  } else {
    // Update last login
    try {
      await setDoc(userRef, { lastLoginAt: serverTimestamp() }, { merge: true });
    } catch (error) {
      console.error('Error updating last login:', error);
    }
  }
};
