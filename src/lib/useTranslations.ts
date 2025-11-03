// Simple translation implementation using English JSON
import enMessages from '@/i18n/messages/en.json';

export function useTranslations(namespace?: string) {
  return (key: string) => {
    if (!namespace) return key;

    const namespaceMessages = (enMessages as any)[namespace];
    if (!namespaceMessages) return key;

    return namespaceMessages[key] || key;
  };
}

export function useLocale() {
  return 'en';
}
