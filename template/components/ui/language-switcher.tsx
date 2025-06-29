import React, { useState } from 'react';
import { useI18n } from '@/components/providers/intl-provider';
import { Locale } from '@/lib/i18n';

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className = '' }: LanguageSwitcherProps) {
  const { locale, setLocale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'es' as Locale, name: 'Español', flag: '🇪🇸' },
    { code: 'en' as Locale, name: 'English', flag: '🇺🇸' },
  ];

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  const handleLanguageChange = (newLocale: Locale) => {
    setLocale(newLocale);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
        aria-label="Select language"
      >
        <span className="text-lg">{currentLanguage.flag}</span>
        <span className="hidden sm:inline">{currentLanguage.code.toUpperCase()}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Overlay para cerrar el dropdown */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown menu */}
          <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-20">
            <div className="py-1">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 ${
                    locale === language.code
                      ? 'bg-gray-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className="text-lg">{language.flag}</span>
                  <span>{language.name}</span>
                  {locale === language.code && (
                    <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Versión compacta para mobile
export function LanguageSwitcherCompact({ className = '' }: LanguageSwitcherProps) {
  const { locale, setLocale } = useI18n();

  const languages = [
    { code: 'es' as Locale, flag: '🇪🇸' },
    { code: 'en' as Locale, flag: '🇺🇸' },
  ];

  const toggleLanguage = () => {
    const newLocale = locale === 'es' ? 'en' : 'es';
    setLocale(newLocale);
  };

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  return (
    <button
      onClick={toggleLanguage}
      className={`p-2 text-lg hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors ${className}`}
      aria-label={`Switch to ${locale === 'es' ? 'English' : 'Español'}`}
      title={`Switch to ${locale === 'es' ? 'English' : 'Español'}`}
    >
      {currentLanguage.flag}
    </button>
  );
} 