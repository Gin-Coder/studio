'use client';

import { useEffect, useState } from 'react';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

// Function to call our new API route
async function sendWelcomeEmail(name: string, email: string) {
  try {
    await fetch('/api/send-welcome-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email }),
    });
  } catch (error) {
    console.error('Failed to send welcome email:', error);
  }
}


export function UserDocumentManager() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [processedUserId, setProcessedUserId] = useState<string | null>(null);

  const userRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  useEffect(() => {
    // Only proceed if we have a user, the services are ready, 
    // and we haven't already processed this user in this session.
    if (user && userRef && user.uid !== processedUserId) {
      
      const checkAndCreateUserDoc = async () => {
        try {
          const docSnap = await getDoc(userRef);
          
          const displayName = user.displayName || user.email?.split('@')[0] || 'New User';
          const userEmail = user.email;
          
          if (!docSnap.exists()) {
            // Document doesn't exist, so create it.
            const userData = {
              displayName: displayName,
              email: userEmail,
              lastLogin: serverTimestamp(),
            };
            // Using `setDoc` with `merge: true` is safe and won't overwrite existing data
            // if this check runs multiple times by mistake.
            await setDoc(userRef, userData, { merge: true });

            // Send welcome email only on first sign-up
            if(userEmail) {
                await sendWelcomeEmail(displayName, userEmail);
            }

          } else {
            // Document exists, update last login
            await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
          }
          // Mark this user as processed for this session to avoid redundant checks
          setProcessedUserId(user.uid);
        } catch (error) {
          console.error("Error managing user document:", error);
          // Don't throw here, just log the error. We don't want to crash the app.
        }
      };

      checkAndCreateUserDoc();
    }
  }, [user, userRef, processedUserId]);

  // This component renders nothing.
  return null;
}
