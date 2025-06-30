import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Rocket, Zap, Shield, Palette, Code, Database } from "lucide-react";
import { useTranslation } from "@/components/providers/intl-provider";

// Tipos para las características
interface Feature {
  title: string;
  icon: React.ReactNode;
  description: string;
}

export default function Home(): React.ReactElement {
  const { t } = useTranslation();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showFloatingElements, setShowFloatingElements] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    setShowFloatingElements(true);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const features: Feature[] = [
    {
      title: t('features.ai.title'),
      icon: (
        <svg className="h-12 w-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      description: t('features.ai.description')
    },
    {
      title: t('features.auth.title'),
      icon: (
        <svg className="h-12 w-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      description: t('features.auth.description')
    },
    {
      title: t('features.components.title'),
      icon: (
        <svg className="h-12 w-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      description: t('features.components.description')
    },
    {
      title: t('features.upload.title'),
      icon: (
        <svg className="h-12 w-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      description: t('features.upload.description')
    },
    {
      title: t('features.blog.title'),
      icon: (
        <svg className="h-12 w-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      description: t('features.blog.description')
    },
    {
      title: t('features.forms.title'),
      icon: (
        <svg className="h-12 w-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      description: t('features.forms.description')
    }
  ];

  return (
    <div>
      {/* Mouse Follower - ARREGLADO */}
      <div 
        className="fixed w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full pointer-events-none z-50 mix-blend-difference transition-transform duration-75 ease-out"
        style={{
          left: mousePosition.x - 8,
          top: mousePosition.y - 8,
          transform: `scale(${showFloatingElements ? 1 : 0})`,
          transition: 'transform 0.2s ease-out'
        }}
      />

      {/* Hero section */}
      <section className="container py-24 md:py-32 space-y-8 text-center">
        <div className="mx-auto max-w-[58rem] space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 leading-tight py-2 relative">
            <span className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 blur-3xl scale-110" style={{ zIndex: -1 }}></span>
            {t('home.title')}
          </h1>
          <p className="mx-auto max-w-[36rem] text-muted-foreground text-lg sm:text-xl">
            {t('home.description')}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/ejemplos" 
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {t('home.getStarted')}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link 
            href="/blog" 
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-8 py-3 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
          >
            {t('home.viewExamples')}
          </Link>
        </div>
      </section>

      {/* Features section */}
      <section className="container py-24 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t('home.featuresTitle')}
          </h2>
          <p className="mx-auto max-w-[42rem] text-muted-foreground text-lg">
            {t('home.featuresDescription')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group relative p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA section */}
      <section className="container py-24">
        <div className="mx-auto max-w-[42rem] text-center space-y-6">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t('home.ctaTitle')}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t('home.ctaDescription')}
          </p>
          <div className="bg-gray-900 dark:bg-gray-800 rounded-lg p-6 text-left">
            <code className="text-green-400 font-mono text-sm">
              npx sysrotcore mi-proyecto
            </code>
          </div>
          <Link 
            href="/ejemplos" 
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {t('home.ctaButton')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
} 