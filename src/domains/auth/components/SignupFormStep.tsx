'use client';

import { useState, useEffect } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Check } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { authApi } from '@/domains/auth/api/authApi';
import {
  validateEmail,
  validatePassword,
  validatePasswordConfirm,
  validateNickname,
  checkPasswordStrength,
} from '@/shared/validation/common';
import type { SignupFormData } from '../types/signup';
import { toast } from 'sonner';

interface SignupFormStepProps {
  onSubmit: (data: SignupFormData) => void;
}

export function SignupFormStep({ onSubmit }: SignupFormStepProps) {
  // Form state
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 에러 상태
  const [nicknameError, setNicknameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState<string[]>([]);
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // 이메일 중복 확인 상태
  const [emailChecked, setEmailChecked] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailCheckMessage, setEmailCheckMessage] = useState('');

  // 약관 동의 상태
  const [agreedToTerms, setAgreedToTerms] = useState(false);


  // 비밀번호 강도 측정
  const passwordStrength = password ? checkPasswordStrength(password) : null;

  // 비밀번호 일치 여부 확인
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  // 실시간 검증
  const handleNicknameBlur = () => {
    const error = validateNickname(nickname);
    setNicknameError(error || '');
  };

  const handleEmailBlur = () => {
    const error = validateEmail(email);
    setEmailError(error || '');
  };

  // 이메일 중복 확인 함수
  const handleCheckEmail = async () => {
    const error = validateEmail(email);
    if (error) {
      setEmailError(error);
      return;
    }

    setIsCheckingEmail(true);
    setEmailCheckMessage('');

    try {
      const result = await authApi.checkEmailDuplicate(email);
      setEmailChecked(true);
      setEmailAvailable(result.available);
      setEmailCheckMessage(result.message);

      if (!result.available) {
        setEmailError(result.message);
      } else {
        setEmailError('');
      }
    } catch (error: any) {
      setEmailChecked(false);
      setEmailAvailable(false);
      setEmailCheckMessage('An error occurred while checking email');
      setEmailError('An error occurred while checking email');
    } finally {
      setIsCheckingEmail(false);
    }
  };

  // 이메일이 변경되면 중복 확인 상태 초기화
  useEffect(() => {
    setEmailChecked(false);
    setEmailAvailable(false);
    setEmailCheckMessage('');
  }, [email]);


  const handlePasswordBlur = () => {
    const result = validatePassword(password);
    setPasswordError(result.errors);
  };

  const handleConfirmPasswordBlur = () => {
    const error = validatePasswordConfirm(password, confirmPassword);
    setConfirmPasswordError(error || '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Terms agreement check
    if (!agreedToTerms) {
      toast.error('Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    // Email verification check
    if (!emailChecked || !emailAvailable) {
      setEmailError('Please verify your email');
      return;
    }

    // 모든 필드 검증
    const nicknameErr = validateNickname(nickname);
    const emailErr = validateEmail(email);
    const passwordResult = validatePassword(password);
    const confirmPasswordErr = validatePasswordConfirm(password, confirmPassword);

    // 에러 설정
    setNicknameError(nicknameErr || '');
    setEmailError(emailErr || '');
    setPasswordError(passwordResult.errors);
    setConfirmPasswordError(confirmPasswordErr || '');

    // 에러가 있으면 중단
    if (nicknameErr || emailErr || !passwordResult.isValid || confirmPasswordErr) {
      return;
    }

    // 폼 제출
    onSubmit({ nickname, email, password, confirmPassword });
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Enter Your Information</h2>
        <p className="text-muted-foreground text-sm">Please fill in your details to sign up</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nickname */}
          <div className="space-y-2">
            <Label htmlFor="nickname">Nickname</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="nickname"
                type="text"
                placeholder="Enter nickname (2-20 characters)"
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                  setNicknameError('');
                }}
                onBlur={handleNicknameBlur}
                className={`pl-10 ${nicknameError ? 'border-red-500' : ''}`}
                required
                minLength={2}
                maxLength={20}
              />
            </div>
            {nicknameError && <p className="text-sm text-red-600">{nicknameError}</p>}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="signup-email">Email</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="signup-email"
                  type="email"
                  name="signup-email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError('');
                  }}
                  onBlur={handleEmailBlur}
                  className={`pl-10 ${
                    emailError
                      ? 'border-red-500'
                      : emailChecked && emailAvailable
                        ? 'border-green-500'
                        : ''
                  }`}
                  autoComplete="off"
                  required
                />
              </div>
              <Button
                type="button"
                onClick={handleCheckEmail}
                disabled={!email || isCheckingEmail || (emailChecked && emailAvailable)}
                variant={emailChecked && emailAvailable ? 'outline' : 'default'}
                className="min-w-[100px] whitespace-nowrap"
              >
                {isCheckingEmail ? (
                  'Checking...'
                ) : emailChecked && emailAvailable ? (
                  <span className="flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    Verified
                  </span>
                ) : (
                  'Check'
                )}
              </Button>
            </div>
            {emailError && <p className="text-sm text-red-600">{emailError}</p>}
            {emailChecked && emailAvailable && (
              <p className="text-sm text-green-600 flex items-center gap-1">
                <Check className="w-4 h-4" />
                {emailCheckMessage}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="signup-password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                name="signup-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError([]);
                }}
                onBlur={handlePasswordBlur}
                className={`pl-10 pr-10 ${passwordError.length > 0 ? 'border-red-500' : ''}`}
                autoComplete="new-password"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password strength indicator */}
            {password && passwordStrength && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Password strength</span>
                  <span className={passwordStrength.color}>{passwordStrength.label}</span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      passwordStrength.strength === 'very-strong'
                        ? 'bg-green-600'
                        : passwordStrength.strength === 'strong'
                          ? 'bg-blue-600'
                          : passwordStrength.strength === 'medium'
                            ? 'bg-yellow-600'
                            : passwordStrength.strength === 'weak'
                              ? 'bg-orange-600'
                              : 'bg-red-600'
                    }`}
                    style={{ width: `${passwordStrength.score}%` }}
                  />
                </div>
              </div>
            )}

            {passwordError.length > 0 && (
              <ul className="text-sm text-red-600 space-y-1">
                {passwordError.map((err, idx) => (
                  <li key={idx}>• {err}</li>
                ))}
              </ul>
            )}

            <p className="text-xs text-muted-foreground">
              • At least 8 characters
              <br />• Include letters, numbers, and special characters
            </p>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="signup-confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="signup-confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                name="signup-confirmPassword"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setConfirmPasswordError('');
                }}
                onBlur={handleConfirmPasswordBlur}
                className={`pl-10 pr-10 ${
                  confirmPasswordError
                    ? 'border-red-500'
                    : passwordsMatch
                      ? 'border-green-500'
                      : ''
                }`}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {confirmPasswordError && <p className="text-sm text-red-600">{confirmPasswordError}</p>}
            {passwordsMatch && !confirmPasswordError && (
              <p className="text-sm text-green-600 flex items-center gap-1">
                <Check className="w-4 h-4" />
                Passwords match
              </p>
            )}
          </div>

        {/* Terms Agreement */}
        <div className="space-y-3 pt-2">
          <div className="flex items-start gap-3">
            <label className="relative flex items-center justify-center mt-0.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="peer sr-only"
              />
              <div className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center pointer-events-none ${
                agreedToTerms
                  ? 'bg-primary border-primary'
                  : 'border-gray-300 peer-hover:border-gray-400'
              }`}>
                {agreedToTerms && (
                  <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                )}
              </div>
            </label>
            <div className="flex-1 text-sm leading-relaxed">
              <span className="text-muted-foreground">
                I agree to the{' '}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // TODO: Open Terms of Service modal
                  }}
                  className="text-primary font-medium hover:underline underline-offset-2"
                >
                  Terms of Service
                </button>
                {' '}and{' '}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // TODO: Open Privacy Policy modal
                  }}
                  className="text-primary font-medium hover:underline underline-offset-2"
                >
                  Privacy Policy
                </button>
              </span>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-11"
          disabled={
            !nickname ||
            !email ||
            !password ||
            !confirmPassword ||
            !emailChecked ||
            !emailAvailable ||
            passwordError.length > 0 ||
            !agreedToTerms
          }
        >
          Next
        </Button>
      </form>
    </div>
  );
}
