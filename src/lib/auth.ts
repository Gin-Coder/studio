'use client';
import {
  Auth,
  GoogleAuthProvider,
  signInWithRedirect,
  User as FirebaseUser,
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


/**
 * Initiates a Google sign-in flow using redirect.
 * This method is more robust against popup blockers.
 */
export const handleSignInWithGoogle = async (auth: Auth): Promise<void> => {
  const provider = new GoogleAuthProvider();
  // We use signInWithRedirect which is more reliable across different browsers and environments.
  // This function doesn't resolve with a user credential directly; the result is handled
  // on page load by `getRedirectResult`.
  await signInWithRedirect(auth, provider);
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
