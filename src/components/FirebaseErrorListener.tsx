
'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';
import debounce from 'lodash.debounce';

// Create a debounced function to prevent toast spam.
// It shows the toast immediately on the first error, but then waits 5 seconds
// before allowing another one to be shown. This prevents overwhelming the user
// if many requests fail at once.
const showPermissionErrorToast = debounce(
    (toast) => {
        toast({
            variant: "destructive",
            title: "Erreur de Permission Firebase",
            description: "Impossible d'accéder aux données. Veuillez vérifier vos règles de sécurité Firestore dans la console Firebase pour autoriser les opérations de lecture/écriture.",
            duration: 10000, // Show for 10 seconds
        });
    },
    5000,
    { leading: true, trailing: false }
);


/**
 * An invisible component that listens for globally emitted 'permission-error' events.
 * It displays a user-friendly toast notification instead of crashing the app.
 */
export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    // The callback now uses the toast function to show an error.
    const handleError = (error: FirestorePermissionError) => {
      // We still log the detailed error to the console for debugging purposes.
      console.error("Caught Firestore Permission Error:", error);
      
      // We call the debounced function to show the UI notification.
      showPermissionErrorToast(toast);
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, [toast]); // Dependency array includes toast to ensure it's available.

  // This component renders nothing.
  return null;
}
