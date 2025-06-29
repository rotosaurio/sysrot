import React, { createContext, useContext, useEffect, useState } from 'react';
import { IntlProvider as ReactIntlProvider, useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import { Locale, getMessages } from '@/lib/i18n';

interface IntlContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  messages: Record<string, string>;
}

const IntlContext = createContext<IntlContextType | undefined>(undefined);

interface IntlProviderProps {
  children: React.ReactNode;
}

export function IntlProvider({ children }: IntlProviderProps) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>(
    (router.locale as Locale) || 'es'
  );
  const [messages, setMessages] = useState<Record<string, string>>({});

  // Cargar mensajes cuando cambie el locale
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const newMessages = getMessages(locale);
        setMessages(newMessages);
      } catch (error) {
        console.error(`Error loading messages for locale ${locale}:`, error);
        // Fallback a español si hay error
        const fallbackMessages = getMessages('es');
        setMessages(fallbackMessages);
      }
    };

    loadMessages();
  }, [locale]);

  // Sincronizar con Next.js router
  useEffect(() => {
    if (router.locale && router.locale !== locale) {
      setLocaleState(router.locale as Locale);
    }
  }, [router.locale, locale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
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
      <ReactIntlProvider locale={locale} messages={messages}>
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
    return intl.formatMessage({ id }, values);
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