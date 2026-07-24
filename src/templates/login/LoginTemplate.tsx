'use client';

import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/src/store/authStore';
import { AuthService } from '@/src/services/authService';
import { useState } from 'react';

export default function LoginTemplate() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState('');

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      setError('No credential returned from Google.');
      return;
    }

    try {
      const result = await AuthService.loginWithGoogle(credentialResponse.credential);
      setAuth(result.token, result.user);

      if (result.onboardingCompleted) {
        router.push('/');
      } else {
        router.push('/onboarding');
      }
    } catch (err) {
      setError('Authentication failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 relative overflow-hidden">
      {/* Background blobs for aesthetics */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/30 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-rose-600/30 blur-[120px]" />

      <div className="z-10 bg-zinc-900/60 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl w-full max-w-md flex flex-col items-center">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-rose-400 mb-4 tracking-tight">
          melo.tv
        </h1>
        <p className="text-zinc-400 mb-8 text-center">
          Connect with strangers who share your passions.
        </p>

        {error && (
          <div className="w-full bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <div className="w-full flex justify-center hover:scale-105 transition-transform duration-300">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => setError('Google Sign-In failed.')}
            theme="filled_black"
            shape="pill"
            size="large"
            text="continue_with"
          />
        </div>
      </div>
    </div>
  );
}
