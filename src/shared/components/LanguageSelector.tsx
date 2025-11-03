'use client';

import { useTransition } from 'react';
import { useLocale } from '@/lib/useTranslations';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { locales, localeNames, localeFlags, type Locale } from '@/i18n/config';

export function LanguageSelector() {
  const locale = useLocale() as Locale;
  const [isPending, startTransition] = useTransition();

  const handleLocaleChange = (newLocale: Locale) => {
    startTransition(() => {
      // Set cookie for locale
      document.cookie = `locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
      // Reload to apply new locale
      window.location.reload();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors">
        <Globe className="w-5 h-5" />
        <span className="hidden md:inline text-sm">
          {localeFlags[locale]} {localeNames[locale]}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => handleLocaleChange(loc)}
            className={`flex items-center gap-3 cursor-pointer ${
              locale === loc ? 'bg-primary/10' : ''
            }`}
            disabled={isPending}
          >
            <span className="text-xl">{localeFlags[loc]}</span>
            <span>{localeNames[loc]}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
