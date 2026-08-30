"use client";

import { GoogleOAuthProvider } from '@react-oauth/google';
import { ReactNode } from 'react';

export function AuthProvider({ children }: { children: ReactNode }) {
  // MUST BE FILLED: Add NEXT_PUBLIC_GOOGLE_CLIENT_ID to your .env.local file in frontend/
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
  
  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  );
}
