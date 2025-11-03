"use client";

import { useState } from 'react';
import { useTranslations } from '@/lib/useTranslations';
import { Mail, Lock, User, Globe } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { BackButton } from '@/shared/components/BackButton';
import { AppLogo } from '@/shared/components/AppLogo';

interface SignupScreenProps {
  onSignup: (name: string, email: string, password: string, country: string) => void;
  onLoginClick: () => void;
  onBack: () => void;
}

export function SignupScreen({ onSignup, onLoginClick, onBack }: SignupScreenProps) {
  const t = useTranslations('auth');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignup(name, email, password, country);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-primary/5 via-[#e8eddb]/50 to-[#f0e5e0]/50">
      {/* Back Button */}
      <div className="px-4 pt-4 pb-2">
        <BackButton onClick={onBack} />
      </div>

      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8">
            <AppLogo />
            <p className="text-center text-muted-foreground mt-2">{t('joinCommunity')}</p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('fullName')}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t('email')}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t('password')}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">{t('country')}</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="country"
                    type="text"
                    placeholder="South Korea"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-11">
                {t('signup')}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                {t('signupTerms')}
              </p>
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {t('alreadyHaveAccount')}{' '}
              <button
                onClick={onLoginClick}
                className="text-primary hover:underline font-semibold"
              >
                {t('login')}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
