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
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';


export const handleSignInWithGoogle = async (
  auth: Auth
): Promise<UserCredential | null> => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result;
  } catch (error: any) {
    if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
      console.log('Sign-in popup closed by user.');
      return null;
    }
    console.error('Error during Google sign-in:', error);
    return null;
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
          const { displayName, email, photoURL } = user;
          const newUserDoc = {
            displayName,
            email,
            photoURL,
            language: 'en',
            phoneWhatsApp: '',
            consentWhatsApp: false,
            createdAt: serverTimestamp(),
            lastLoginAt: serverTimestamp(),
            // DO NOT set isAdmin or roles on creation.
            // Security rules prevent this. These fields are managed by admins.
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
