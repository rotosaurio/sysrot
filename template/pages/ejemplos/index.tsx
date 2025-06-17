import Link from 'next/link';
import { ArrowRight, BookOpen, Code, Rocket, Terminal } from '@/components/ui/icons';

export default function EjemplosPage() {
  const ejemplos = [
    {
      title: "Autenticación",
      description: "Sistema completo de autenticación con NextAuth.js y roles",
      href: "/ejemplos/auth",
      icon: <Terminal className="h-10 w-10 text-blue-600" />
    },
    {
      title: "Inteligencia Artificial",
      description: "Integración con múltiples APIs de IA (OpenAI, Claude, Gemini, DeepSeek)",
      href: "/ejemplos/ai",
      icon: <Rocket className="h-10 w-10 text-purple-600" />
    },
    {
      title: "Biblioteca de Componentes",
      description: "Componentes reutilizables listos para usar y personalizar",
      href: "/ejemplos/componentes",
      icon: <Code className="h-10 w-10 text-emerald-600" />
    },
    {
      title: "Carga de Imágenes",
      description: "Sistema de carga de imágenes con Cloudinary y preview",
      href: "/ejemplos/upload",
      icon: <BookOpen className="h-10 w-10 text-green-600" />
    },
    {
      title: "Formularios",
      description: "Formularios con validación usando react-hook-form y zod",
      href: "/ejemplos/formularios",
      icon: <Terminal className="h-10 w-10 text-orange-600" />
    },
    {
      title: "Animaciones",
      description: "Efectos y animaciones con Framer Motion",
      href: "/ejemplos/animaciones",
      icon: <Rocket className="h-10 w-10 text-pink-600" />
    },
    {
      title: "Notificaciones",
      description: "Sistema de notificaciones con react-hot-toast",
      href: "/ejemplos/notificaciones",
      icon: <Code className="h-10 w-10 text-indigo-600" />
    },
    {
      title: "Base de Datos",
      description: "Conexiones a MongoDB, Supabase y Firebase",
      href: "/ejemplos/database",
      icon: <Terminal className="h-10 w-10 text-teal-600" />
    },
    {
      title: "UI y Temas",
      description: "Sistema de temas claro/oscuro y componentes UI",
      href: "/ejemplos/ui-temas",
      icon: <BookOpen className="h-10 w-10 text-cyan-600" />
    },
    {
      title: "Blog con MDX",
      description: "Sistema de blog con soporte para MDX y sintaxis highlighting",
      href: "/blog",
      icon: <BookOpen className="h-10 w-10 text-blue-600" />
    },
  ];

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold text-center mb-12">Ejemplos de Componentes</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ejemplos.map((ejemplo, index) => (
          <Link href={ejemplo.href} key={index} className="group">
            <div className="border rounded-lg p-6 shadow-md transition-all duration-200 hover:shadow-lg hover:border-blue-300 h-full">
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  {ejemplo.icon}
                </div>
                <div>
                  <h2 className="text-xl font-semibold group-hover:text-blue-600 transition-colors">
                    {ejemplo.title}
                    <ArrowRight className="ml-2 h-4 w-4 inline-block transition-transform group-hover:translate-x-1" />
                  </h2>
                  <p className="mt-2 text-muted-foreground">
                    {ejemplo.description}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-12 p-6 border rounded-lg shadow-md bg-blue-50 dark:bg-blue-900/20">
        <h2 className="text-2xl font-semibold mb-4">Sobre los Ejemplos</h2>
        <p className="text-muted-foreground mb-4">
          Esta sección muestra ejemplos prácticos de las principales características 
          incluidas en tu aplicación creada con create-rotosaurio-app. Puedes usar estos
          ejemplos como punto de partida para desarrollar tu propia aplicación.
        </p>
        <p className="text-muted-foreground">
          Para obtener más información sobre cada característica, consulta el archivo
          <code className="mx-1 px-1 py-0.5 bg-muted rounded">DOCUMENTACION.md</code>
          en la raíz del proyecto.
        </p>
      </div>
    </div>
  );
} 