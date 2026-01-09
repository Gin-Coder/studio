'use client';
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  User as FirebaseUser,
  UserCredential,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  getFirestore,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';


export const handleSignInWithGoogle = async (
  auth: Auth
): Promise<UserCredential | null> => {
  const provider = new GoogleAuthProvider();
  try {
    // Prefer popup, as it's a better user experience.
    const result = await signInWithPopup(auth, provider);
    return result;
  } catch (error: any) {
    // If popup fails (e.g., blocked by browser), fall back to redirect.
    if (
      error.code === 'auth/popup-blocked-by-browser' ||
      error.code === 'auth/cancelled-popup-request'
    ) {
      console.log('Popup was blocked or closed, falling back to redirect...');
      await signInWithRedirect(auth, provider);
      // After redirect, the page will reload and getRedirectResult will handle the login.
      // So, we return null here because the promise won't resolve in this context.
      return null;
    } else {
      // For other errors, we re-throw them to be handled by the calling component.
      console.error('Error during Google sign-in:', error);
      throw error;
    }
  }
};

export const getOrCreateUser = (user: FirebaseUser): Promise<void> => {
  const db = getFirestore(user.app);
  const userRef = doc(db, 'users', user.uid);

  return new Promise((resolve, reject) => {
    getDoc(userRef)
      .then((userSnap) => {
        if (!userSnap.exists()) {
          // User does not exist, create new document
          const { displayName, email, photoURL, phoneNumber } = user;
          const newUserDoc = {
            displayName,
            email,
            photoURL,
            language: 'en',
            phoneWhatsApp: phoneNumber || '', // Pre-fill with Google phone number if available
            consentWhatsApp: false,
            createdAt: serverTimestamp(),
            lastLoginAt: serverTimestamp(),
          };
          setDoc(userRef, newUserDoc)
            .then(() => resolve())
            .catch((error) => {
              errorEmitter.emit(
                'permission-error',
                new FirestorePermissionError({
                  path: userRef.path,
                  operation: 'create',
                  requestResourceData: newUserDoc,
                })
              );
              reject(error);
            });
        } else {
          // User exists, update last login
          const updateData = { lastLoginAt: serverTimestamp() };
          setDoc(userRef, updateData, { merge: true })
            .then(() => resolve())
            .catch((error) => {
              errorEmitter.emit(
                'permission-error',
                new FirestorePermissionError({
                  path: userRef.path,
                  operation: 'update',
                  requestResourceData: updateData,
                })
              );
              reject(error);
            });
        }
      })
      .catch((error) => {
        // Error on getDoc
        errorEmitter.emit(
          'permission-error',
          new FirestorePermissionError({
            path: userRef.path,
            operation: 'get',
          })
        );
        reject(error);
      });
  });
};