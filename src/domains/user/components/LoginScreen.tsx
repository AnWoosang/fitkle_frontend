"use client";

import { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { BackButton } from '@/shared/components/BackButton';
import { AppLogo } from '@/shared/components/AppLogo';

interface LoginScreenProps {
  onLogin: (email: string, password: string) => void;
  onSignupClick: () => void;
  onBack: () => void;
}

export function LoginScreen({ onLogin, onSignupClick, onBack }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-primary/5 via-[#e8eddb]/50 to-[#f0e5e0]/50">
      {/* Back Button */}
      <div className="px-4 pt-4 pb-2">
        <BackButton onClick={onBack} />
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8">
            <AppLogo subtitle="다시 만나서 반가워요!" />
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
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
                <Label htmlFor="password">비밀번호</Label>
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

              <Button type="submit" className="w-full h-11">
                로그인
              </Button>

              <div className="text-center">
                <button type="button" className="text-sm text-primary hover:underline">
                  비밀번호를 잊으셨나요?
                </button>
              </div>
            </div>
          </form>

          {/* Signup Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              계정이 없으신가요?{' '}
              <button
                onClick={onSignupClick}
                className="text-primary hover:underline font-semibold"
              >
                회원가입
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
