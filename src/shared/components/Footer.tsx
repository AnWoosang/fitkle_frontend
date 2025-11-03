'use client';

import {
  Heart,
  Instagram,
  Facebook,
  Twitter,
  MessageCircle,
} from 'lucide-react';
import { useTranslations } from '@/lib/useTranslations';
import { AppLogo } from './AppLogo';

export function Footer() {
  const t = useTranslations('footer');
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: t('about'), href: '#' },
      { label: t('team'), href: '#' },
      { label: t('careers'), href: '#' },
      { label: t('blog'), href: '#' },
    ],
    support: [
      { label: t('helpCenter'), href: '#' },
      { label: t('safetyGuide'), href: '#' },
      { label: t('communityGuidelines'), href: '#' },
      { label: t('contact'), href: '#' },
    ],
    legal: [
      { label: t('terms'), href: '#' },
      { label: t('privacy'), href: '#' },
      { label: t('cookies'), href: '#' },
    ],
  };

  const socialLinks = [
    {
      icon: Instagram,
      href: '#',
      label: 'Instagram',
      color: 'hover:text-[#E4405F]',
    },
    {
      icon: Facebook,
      href: '#',
      label: 'Facebook',
      color: 'hover:text-[#1877F2]',
    },
    {
      icon: Twitter,
      href: '#',
      label: 'Twitter',
      color: 'hover:text-[#1DA1F2]',
    },
    {
      icon: MessageCircle,
      href: '#',
      label: 'KakaoTalk',
      color: 'hover:text-[#FEE500]',
    },
  ];

  return (
    <footer className="bg-gradient-to-b from-background via-accent-sage/5 to-accent-sage/10 border-t border-border/50 mt-auto">
      <div className="max-w-[1600px] mx-auto px-8 lg:px-24 xl:px-32 2xl:px-40 py-12 lg:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-4 space-y-4">
            <AppLogo />
            <p className="text-muted-foreground max-w-sm">
              {t('tagline')}
            </p>
            <p className="text-sm text-muted-foreground max-w-sm">
              {t('subtitle')}
            </p>
          </div>

          {/* Company Links */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 flex items-center gap-2">
              <span>{t('company')}</span>
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm cursor-pointer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="lg:col-span-3">
            <h3 className="mb-4 flex items-center gap-2">
              <span>{t('support')}</span>
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm cursor-pointer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="lg:col-span-3">
            <h3 className="mb-4 flex items-center gap-2">
              <span>{t('legal')}</span>
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm cursor-pointer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/50 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Copyright */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>© {currentYear} fitkle.</span>
              <span className="hidden md:inline">|</span>
              <span className="flex items-center gap-1">
                {t('madeWith')}{' '}
                <Heart className="w-4 h-4 text-accent-rose fill-accent-rose animate-pulse" />{' '}
                {t('inSeoul')}
              </span>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {t('follow')}
              </span>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      className={`p-2 rounded-full bg-card border border-border/50 text-muted-foreground transition-all hover:scale-110 hover:border-primary/50 hover:bg-primary/5 cursor-pointer ${social.color}`}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 pt-6 border-t border-border/30 text-center">
            <p className="text-xs text-muted-foreground">
              {t('platformDescription')}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {t('communityDescription')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
