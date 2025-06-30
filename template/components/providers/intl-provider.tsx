import React, { createContext, useContext, useEffect, useState } from 'react';
import { IntlProvider as ReactIntlProvider, useIntl } from 'react-intl';
import { useRouter } from 'next/router';

export type Locale = 'es' | 'en';

interface IntlContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  messages: Record<string, string>;
}

const IntlContext = createContext<IntlContextType | undefined>(undefined);

interface IntlProviderProps {
  children: React.ReactNode;
}

// Función para cargar mensajes de forma síncrona
function loadMessages(locale: Locale): Record<string, string> {
  try {
    if (locale === 'en') {
      return require('@/locales/en.json');
    } else {
      return require('@/locales/es.json');
    }
  } catch (error) {
    console.warn(`Error loading messages for locale ${locale}, falling back to es`);
    return require('@/locales/es.json');
  }
}

export function IntlProvider({ children }: IntlProviderProps) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>('es');
  const [messages, setMessages] = useState<Record<string, string>>(() => loadMessages('es'));

  // Inicializar locale y mensajes
  useEffect(() => {
    const initialLocale = (router.locale as Locale) || 'es';
    setLocaleState(initialLocale);
    setMessages(loadMessages(initialLocale));
  }, []);

  // Sincronizar con Next.js router
  useEffect(() => {
    if (router.locale && router.locale !== locale) {
      const newLocale = router.locale as Locale;
      setLocaleState(newLocale);
      setMessages(loadMessages(newLocale));
    }
  }, [router.locale, locale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    setMessages(loadMessages(newLocale));
    // Cambiar la URL para reflejar el nuevo idioma
    router.push(router.asPath, router.asPath, { locale: newLocale });
  };

  const contextValue: IntlContextType = {
    locale,
    setLocale,
    messages,
  };

  return (
    <IntlContext.Provider value={contextValue}>
      <ReactIntlProvider 
        locale={locale} 
        messages={messages} 
        defaultLocale="es"
        onError={() => {}} // Silenciar errores de traducciones faltantes
      >
        {children}
      </ReactIntlProvider>
    </IntlContext.Provider>
  );
}

// Hook personalizado para usar el contexto de i18n
export function useI18n() {
  const context = useContext(IntlContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an IntlProvider');
  }
  return context;
}

// Hook para obtener funciones de traducción
export function useTranslation() {
  const intl = useIntl();
  const { locale } = useI18n();

  const t = (id: string, values?: Record<string, any>) => {
    try {
      return intl.formatMessage({ id }, values);
    } catch (error) {
      console.warn(`Missing translation for key: ${id}`);
      return id; // Fallback al ID de la traducción
    }
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return intl.formatDate(dateObj, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatRelativeTime = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24));

    return intl.formatRelativeTime(-diffInDays, 'day');
  };

  return {
    t,
    formatDate,
    formatRelativeTime,
    locale,
  };
} 