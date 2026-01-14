
'use client';

import { useLanguage } from "@/hooks/use-language";

// This wrapper component allows us to use the client-side `useLanguage` hook
// within Server Components by wrapping only the parts that need translation.
export function ClientSideTranslator({ children }: { children: (t: (key: string, params?: Record<string, string | number>) => string) => React.ReactNode }) {
  const { t } = useLanguage();

  const translateWithParams = (key: string, params?: Record<string, string | number>) => {
    let translation = t(key);
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        translation = translation.replace(`{{${paramKey}}}`, String(paramValue));
      });
    }
    return translation;
  };

  return <>{children(translateWithParams)}</>;
}

    