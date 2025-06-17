import { AuthForm } from '@/components/auth/auth-form';

export default function AuthPage() {
  return (
    <div className="container mx-auto max-w-md py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Autenticación</h1>
      <div className="border rounded-lg p-6 shadow-md">
        <AuthForm />
      </div>
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Cómo funciona</h2>
        <p className="text-muted-foreground">
          Este componente de autenticación utiliza NextAuth.js para manejar el registro e inicio de sesión.
          Puedes personalizarlo modificando <code>components/auth/auth-form.tsx</code> y 
          <code>pages/api/auth/[...nextauth].ts</code>.
        </p>
      </div>
    </div>
  );
} 