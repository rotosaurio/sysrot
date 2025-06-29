import Link from 'next/link';
import { Rocket } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { LanguageSwitcher } from './language-switcher';
import { useTranslation } from '@/components/providers/intl-provider';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Barra de navegación */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Rocket className="h-6 w-6 text-blue-600" />
            <span>SysrotCore</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-blue-600 transition-colors">
              {t('nav.home')}
            </Link>
            <Link href="/ejemplos" className="text-sm font-medium hover:text-blue-600 transition-colors">
              {t('nav.examples')}
            </Link>
            <Link href="/blog" className="text-sm font-medium hover:text-blue-600 transition-colors">
              {t('nav.blog')}
            </Link>
            <Link href="/ejemplos/auth" className="text-sm font-medium hover:text-blue-600 transition-colors">
              {t('nav.auth')}
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-background/50">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{t('footer.madeWith')}</span>
              <span className="text-red-500">❤️</span>
              <span>{t('footer.by')} SysRot Team</span>
            </div>
            
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <Link
                href="https://github.com/rotosaurio/sysrot"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                GitHub
              </Link>
              <Link
                href="/ejemplos"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('nav.examples')}
              </Link>
              <Link
                href="/blog"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('nav.blog')}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 