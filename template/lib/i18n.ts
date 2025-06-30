import { createIntl, createIntlCache } from 'react-intl';

// Tipos para las traducciones
export type Locale = 'es' | 'en';

export interface Messages {
  // Navigation
  'nav.home': string;
  'nav.examples': string;
  'nav.blog': string;
  'nav.auth': string;
  'nav.documentation': string;

  // Homepage
  'home.title': string;
  'home.subtitle': string;
  'home.description': string;
  'home.getStarted': string;
  'home.viewExamples': string;

  // Features
  'features.ai.title': string;
  'features.ai.description': string;
  'features.auth.title': string;
  'features.auth.description': string;
  'features.components.title': string;
  'features.components.description': string;
  'features.upload.title': string;
  'features.upload.description': string;
  'features.blog.title': string;
  'features.blog.description': string;
  'features.forms.title': string;
  'features.forms.description': string;

  // Examples
  'examples.title': string;
  'examples.ai.title': string;
  'examples.ai.description': string;
  'examples.auth.title': string;
  'examples.auth.description': string;
  'examples.components.title': string;
  'examples.components.description': string;
  'examples.upload.title': string;
  'examples.upload.description': string;
  'examples.forms.title': string;
  'examples.forms.description': string;
  'examples.animations.title': string;
  'examples.animations.description': string;
  'examples.notifications.title': string;
  'examples.notifications.description': string;
  'examples.database.title': string;
  'examples.database.description': string;
  'examples.themes.title': string;
  'examples.themes.description': string;

  // Blog
  'blog.title': string;
  'blog.noArticles': string;
  'blog.backToBlog': string;
  'blog.readingTime': string;

  // Common
  'common.loading': string;
  'common.error': string;
  'common.success': string;
  'common.cancel': string;
  'common.save': string;
  'common.edit': string;
  'common.delete': string;
  'common.copy': string;
  'common.copied': string;

  // Authentication
  'auth.login': string;
  'auth.register': string;
  'auth.logout': string;
  'auth.profile': string;
  'auth.email': string;
  'auth.password': string;
  'auth.confirmPassword': string;
  'auth.forgotPassword': string;
  'auth.rememberMe': string;
  'auth.signInWith': string;

  // Footer
  'footer.madeWith': string;
  'footer.by': string;
}

// Cache para mejorar performance
const cache = createIntlCache();

// Función para crear intl instance
export function createIntlInstance(locale: Locale, localeMessages: Messages) {
  return createIntl(
    {
      locale,
      messages: localeMessages,
    },
    cache
  );
}

// Función helper para obtener mensajes usando dynamic imports
export async function getMessages(locale: Locale): Promise<Messages> {
  try {
    let messages;
    if (locale === 'en') {
      messages = await import('../locales/en.json');
    } else {
      messages = await import('../locales/es.json');
    }
    return messages.default || messages;
  } catch (error) {
    console.warn(`Error loading messages for locale ${locale}, falling back to es`);
    const fallback = await import('../locales/es.json');
    return fallback.default || fallback;
  }
}

// Función para detectar locale del navegador
export function detectBrowserLocale(): Locale {
  if (typeof window === 'undefined') return 'es';
  
  const browserLocale = navigator.language.split('-')[0] as Locale;
  return ['es', 'en'].includes(browserLocale) ? browserLocale : 'es';
}

// Función para formatear fechas según locale
export function formatDate(date: Date | string, locale: Locale): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
} 