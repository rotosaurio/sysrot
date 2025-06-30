import { AuthForm } from '@/components/auth/auth-form';
import { useTranslation } from '@/components/providers/intl-provider';

export default function AuthPage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto max-w-md py-12">
      <h1 className="text-3xl font-bold text-center mb-8">{t('pages.auth.title')}</h1>
      <div className="border rounded-lg p-6 shadow-md">
        <AuthForm />
      </div>
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">{t('pages.auth.howItWorks')}</h2>
        <p className="text-muted-foreground">
          {t('pages.auth.description')} <code>components/auth/auth-form.tsx</code> {t('pages.auth.and')}{' '}
          <code>pages/api/auth/[...nextauth].ts</code>.
        </p>
      </div>
    </div>
  );
} 