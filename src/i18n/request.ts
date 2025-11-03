import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';
import { defaultLocale, locales, type Locale } from './config';

export default getRequestConfig(async () => {
  let locale = defaultLocale;

  try {
    const cookieStore = await cookies();
    locale = (cookieStore.get('locale')?.value || defaultLocale) as Locale;
  } catch (error) {
    // cookies() not available in static rendering contexts (404, error pages)
    // Use default locale
    locale = defaultLocale;
  }

  // Validate locale
  const validLocale = locales.includes(locale) ? locale : defaultLocale;

  return {
    locale: validLocale,
    messages: (await import(`./messages/${validLocale}.json`)).default,
  };
});
