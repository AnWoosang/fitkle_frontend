'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface PreRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ContactMethod = 'email' | 'instagram' | 'kakao' | 'phone';

const countries = [
  { value: 'kr', label: '대한민국 🇰🇷' },
  { value: 'us', label: '미국 🇺🇸' },
  { value: 'jp', label: '일본 🇯🇵' },
  { value: 'cn', label: '중국 🇨🇳' },
  { value: 'vn', label: '베트남 🇻🇳' },
  { value: 'th', label: '태국 🇹🇭' },
  { value: 'gb', label: '영국 🇬🇧' },
  { value: 'de', label: '독일 🇩🇪' },
  { value: 'fr', label: '프랑스 🇫🇷' },
  { value: 'es', label: '스페인 🇪🇸' },
  { value: 'ca', label: '캐나다 🇨🇦' },
  { value: 'au', label: '호주 🇦🇺' },
  { value: 'other', label: '기타' },
];

const ageRanges = [
  { value: '18-24', label: '18-24세' },
  { value: '25-34', label: '25-34세' },
  { value: '35-44', label: '35-44세' },
  { value: '45-54', label: '45-54세' },
  { value: '55+', label: '55세 이상' },
];

export function PreRegisterModal({ isOpen, onClose }: PreRegisterModalProps) {
  const t = useTranslations('preRegister');
  const [contactMethod, setContactMethod] = useState<ContactMethod>('email');
  const [contactValue, setContactValue] = useState('');
  const [country, setCountry] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactMethodLabels: Record<ContactMethod, string> = {
    email: t('email'),
    instagram: t('instagram'),
    kakao: t('kakao'),
    phone: t('phone'),
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('pre_registrations')
        .insert([
          {
            contact_type: contactMethod,
            contact_value: contactValue,
            country,
            age_range: ageRange,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);

        // Check for duplicate entry
        if (error.code === '23505') {
          toast.error(t('errorDuplicate'));
        } else {
          toast.error(t('errorGeneral'));
        }
        return;
      }

      // Reset form
      setContactValue('');
      setCountry('');
      setAgeRange('');

      // Show success message
      toast.success(t('successTitle'), {
        description: t('successDescription'),
        duration: 5000,
      });

      onClose();
    } catch (error) {
      console.error('Pre-registration error:', error);
      toast.error(t('errorGeneral'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPlaceholder = () => {
    switch (contactMethod) {
      case 'email':
        return 'example@email.com';
      case 'instagram':
        return '@username';
      case 'kakao':
        return 'KakaoTalk ID';
      case 'phone':
        return '+82 10-1234-5678';
      default:
        return '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{t('title')}</DialogTitle>
            <button
              onClick={onClose}
              className="rounded-full p-1 hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <DialogDescription>
            {t('description')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Contact Method Selection */}
          <div className="space-y-2">
            <Label htmlFor="contact-method">{t('contactMethod')}</Label>
            <div className="grid grid-cols-2 gap-2">
              {(['email', 'instagram', 'kakao', 'phone'] as ContactMethod[]).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setContactMethod(method)}
                  className={`px-4 py-2 rounded-lg border text-sm transition-all ${
                    contactMethod === method
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background border-border hover:bg-muted'
                  }`}
                >
                  {contactMethodLabels[method]}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Value Input */}
          <div className="space-y-2">
            <Label htmlFor="contact-value">
              {contactMethodLabels[contactMethod]}
            </Label>
            <Input
              id="contact-value"
              type={contactMethod === 'email' ? 'email' : 'text'}
              placeholder={getPlaceholder()}
              value={contactValue}
              onChange={(e) => setContactValue(e.target.value)}
              required
            />
          </div>

          {/* Country Selection */}
          <div className="space-y-2">
            <Label htmlFor="country">{t('country')}</Label>
            <Select value={country} onValueChange={setCountry} required>
              <SelectTrigger>
                <SelectValue placeholder={t('countryPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {countries.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Age Range Selection */}
          <div className="space-y-2">
            <Label htmlFor="age-range">{t('ageRange')}</Label>
            <Select value={ageRange} onValueChange={setAgeRange} required>
              <SelectTrigger>
                <SelectValue placeholder={t('ageRangePlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {ageRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting || !contactValue || !country || !ageRange}
            >
              {isSubmitting ? t('submitting') : t('submit')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
