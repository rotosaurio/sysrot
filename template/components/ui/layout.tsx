import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';
import { Rocket } from './icons';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
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
              Inicio
            </Link>
            <Link href="/ejemplos" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Ejemplos
            </Link>
            <Link href="/blog" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Blog
            </Link>
            <Link href="/ejemplos/auth" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Autenticación
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t py-8 md:py-12">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} SysrotCore. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/ejemplos" className="text-sm text-muted-foreground hover:text-foreground">
              Ejemplos
            </Link>
            <Link href="https://github.com/rotosaurio/sysrot" className="text-sm text-muted-foreground hover:text-foreground">
              GitHub
            </Link>
            <Link href="/DOCUMENTACION.md" className="text-sm text-muted-foreground hover:text-foreground">
              Documentación
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
} 