# Documentación de RotosaurioApp

Este documento proporciona una guía detallada sobre todas las características y herramientas incluidas en tu proyecto creado con `create-rotosaurio-app`.

## Índice

1. [Estructura del Proyecto](#estructura-del-proyecto)
2. [Características Principales](#características-principales)
3. [Sistema de Autenticación](#sistema-de-autenticación)
4. [Integración con OpenAI](#integración-con-openai)
5. [Carga de Imágenes](#carga-de-imágenes)
6. [Blog con MDX](#blog-con-mdx)
7. [Formularios y Validación](#formularios-y-validación)
8. [Temas Claro/Oscuro](#temas-clarooscuro)
9. [Variables de Entorno](#variables-de-entorno)
10. [Navegación y Rutas](#navegación-y-rutas)
11. [Mejores Prácticas](#mejores-prácticas)
12. [Solución de Problemas](#solución-de-problemas)
13. [Despliegue](#despliegue)

## Estructura del Proyecto

El proyecto sigue la estructura del Pages Router de Next.js 14:

```
├── components/       # Componentes reutilizables
│   ├── ai/           # Componentes relacionados con IA
│   ├── auth/         # Componentes de autenticación
│   ├── ui/           # Componentes de interfaz de usuario
│   └── upload/       # Componentes de carga de archivos
├── lib/              # Funciones y utilidades
├── pages/            # Rutas y páginas de la aplicación
│   ├── api/          # Endpoints de API
│   ├── blog/         # Páginas de blog
│   └── ejemplos/     # Ejemplos de uso
├── public/           # Activos públicos
└── styles/           # Hojas de estilo CSS
```

### Archivos Clave

- **package.json**: Configuración del proyecto y dependencias
- **next.config.js**: Configuración de Next.js
- **tsconfig.json**: Configuración de TypeScript
- **tailwind.config.js**: Configuración de TailwindCSS
- **middleware.ts**: Middleware para autenticación y roles (si está habilitado)
- **.env.local**: Variables de entorno (debes crear este archivo basado en .env.example)

## Características Principales

### Next.js 14 con Pages Router

Tu proyecto utiliza Next.js 14 con el sistema Pages Router, ofreciendo:

- Renderizado del lado del servidor (SSR)
- Generación estática (SSG)
- API Routes
- Optimización de imágenes
- Fast Refresh

Para crear nuevas páginas, simplemente añade archivos `.tsx` dentro del directorio `pages/`. Por ejemplo:

```tsx
// pages/about.tsx
import { Layout } from '@/components/ui/layout';

export default function AboutPage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6">Acerca de nosotros</h1>
      <p className="text-lg">
        Esta es una página de ejemplo creada con Next.js y TailwindCSS.
      </p>
    </div>
  );
}
```

### Obtención de Datos

Next.js ofrece varias formas de obtener datos:

#### getServerSideProps (SSR)

```tsx
// pages/users.tsx
export async function getServerSideProps() {
  const res = await fetch('https://api.example.com/users');
  const users = await res.json();
  
  return {
    props: { users },
  };
}

export default function UsersPage({ users }) {
  return (
    <div>
      <h1>Usuarios</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

#### getStaticProps (SSG)

```tsx
// pages/products.tsx
export async function getStaticProps() {
  const res = await fetch('https://api.example.com/products');
  const products = await res.json();
  
  return {
    props: { products },
    revalidate: 60, // Revalidar cada 60 segundos
  };
}
```

### TypeScript

El proyecto está configurado con TypeScript para un desarrollo más seguro y productivo. Los tipos están predefinidos para la mayoría de los componentes y funciones.

Para crear tus propios tipos:

```tsx
// types/index.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
}
```

## Sistema de Autenticación

La autenticación está implementada utilizando NextAuth.js, permitiendo a los usuarios registrarse e iniciar sesión.

### Configuración

1. Configura tus proveedores en `.env.local`:

```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu_secreto_aqui

# Para Google OAuth
GOOGLE_CLIENT_ID=tu_client_id
GOOGLE_CLIENT_SECRET=tu_client_secret

# Para GitHub OAuth
GITHUB_ID=tu_github_id
GITHUB_SECRET=tu_github_secret

# Para autenticación con credenciales
DATABASE_URL=tu_url_de_base_de_datos
```

2. El componente de formulario de autenticación está listo para usar:

```tsx
import { AuthForm } from '@/components/auth/auth-form';

export default function LoginPage() {
  return (
    <div>
      <h1>Iniciar Sesión</h1>
      <AuthForm />
    </div>
  );
}
```

### Protección de Rutas

Para proteger rutas, utiliza la función `getServerSideProps`:

```tsx
import { getSession } from "next-auth/react";

export async function getServerSideProps(context) {
  const session = await getSession(context);
  
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  
  return {
    props: { session }
  };
}
```

### Acceso al Usuario Actual

En el lado del cliente:

```tsx
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  
  if (status === "loading") {
    return <p>Cargando...</p>;
  }
  
  if (status === "unauthenticated") {
    return <p>Acceso denegado</p>;
  }
  
  return (
    <div>
      <h1>Perfil</h1>
      <p>Bienvenido, {session.user.name}</p>
      <p>Email: {session.user.email}</p>
    </div>
  );
}
```

### Sistema de Roles

Si habilitaste el sistema de roles, puedes verificar roles usando el middleware:

```tsx
// middleware.ts ya está configurado para verificar roles

// Para verificar roles en componentes:
import { useSession } from "next-auth/react";
import { UserRole } from "@/lib/roles";

export default function AdminPanel() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === UserRole.ADMIN;
  
  if (!isAdmin) {
    return <p>Acceso denegado</p>;
  }
  
  return <div>Panel de Administración</div>;
}
```

## Integración con OpenAI

Tu proyecto incluye integración con la API de OpenAI, permitiendo incorporar IA en tu aplicación.

### Configuración

1. Configura tu clave API en `.env.local`:

```
OPENAI_API_KEY=tu_clave_api_de_openai
```

2. Utiliza el componente `OpenAIPrompt` para interactuar con la IA:

```tsx
import { OpenAIPrompt } from '@/components/ai/openai-prompt';

export default function AIPage() {
  const handleResponse = (response) => {
    console.log("Respuesta de IA:", response);
  };

  return (
    <div>
      <h1>Asistente IA</h1>
      <OpenAIPrompt 
        placeholder="Pregunta algo..."
        buttonText="Enviar"
        onResponse={handleResponse}
      />
    </div>
  );
}
```

### Personalización del Modelo

Puedes personalizar el modelo y parámetros en `pages/api/openai.ts`:

```tsx
// Ejemplo de configuración avanzada
const completion = await openai.chat.completions.create({
  model: "gpt-4-turbo", // Cambiar modelo
  messages: [
    { role: "system", content: "Eres un asistente especializado en desarrollo web." },
    { role: "user", content: prompt }
  ],
  temperature: 0.7, // Ajustar creatividad
  max_tokens: 1000, // Ajustar longitud de respuesta
});
```

## Carga de Imágenes

El proyecto incluye un sistema de carga de imágenes que utiliza Cloudinary para almacenamiento.

### Configuración

1. Configura tus credenciales de Cloudinary en `.env.local`:

```
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

2. Utiliza el componente `ImageUpload` para permitir a los usuarios cargar imágenes:

```tsx
import { ImageUpload } from '@/components/upload/image-upload';
import { useState } from 'react';

export default function UploadPage() {
  const [imageUrl, setImageUrl] = useState('');
  
  const handleSuccess = (url) => {
    setImageUrl(url);
    console.log("Imagen cargada:", url);
  };

  return (
    <div>
      <h1>Subir Imagen</h1>
      <ImageUpload 
        onSuccess={handleSuccess}
        maxSizeMB={5}
        acceptedFileTypes={['image/jpeg', 'image/png']}
      />
      
      {imageUrl && (
        <div>
          <h2>Vista previa:</h2>
          <img src={imageUrl} alt="Imagen cargada" width={300} />
        </div>
      )}
    </div>
  );
}
```

### Transformaciones de Imágenes

Puedes aplicar transformaciones a las imágenes de Cloudinary:

```tsx
// URL original
const imageUrl = "https://res.cloudinary.com/tu_cloud_name/image/upload/v1234567/ejemplo.jpg";

// Con transformaciones (redimensionar a 300x200, recortar)
const transformedUrl = imageUrl.replace("/upload/", "/upload/c_fill,w_300,h_200/");
```

## Blog con MDX

Tu proyecto incluye un sistema de blog completo utilizando MDX para contenido enriquecido.

### Creación de Contenido

1. Crea archivos MDX en el directorio `/content/blog/`:

```mdx
---
title: Mi Primer Post
date: '2023-12-25'
excerpt: Este es mi primer post de blog
coverImage: '/images/blog/cover.jpg'
---

# Hola Mundo

Este es mi primer post utilizando MDX.

## Características

- Soporte para Markdown
- Componentes React dentro del contenido
- Sintaxis resaltada para código

```jsx
function Ejemplo() {
  return <div>¡Esto es un componente!</div>;
}
```

<SomeComponent />
```

2. Las páginas de blog están disponibles en `/blog` y `/blog/[slug]`.

3. Personaliza los componentes de MDX en `lib/mdx.ts`.

### Componentes Personalizados en MDX

Puedes añadir componentes personalizados para usar en tus archivos MDX:

```tsx
// lib/mdx-components.tsx
import Image from 'next/image';
import { CodeBlock } from '@/components/ui/code-block';

export const mdxComponents = {
  img: (props) => (
    <Image 
      {...props} 
      width={800} 
      height={450} 
      className="rounded-lg my-6" 
      alt={props.alt || 'Blog image'} 
    />
  ),
  code: (props) => <CodeBlock {...props} />,
};

// Usar en lib/mdx.ts
import { mdxComponents } from './mdx-components';
// ...
```

## Formularios y Validación

El proyecto utiliza react-hook-form y zod para crear formularios con validación.

### Ejemplo Básico

```tsx
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Define el esquema de validación
const formSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres")
});

// Tipo derivado del esquema
type FormValues = z.infer<typeof formSchema>;

export default function ContactForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  function onSubmit(values: FormValues) {
    // Manejar envío
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="tu@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Enviar</Button>
      </form>
    </Form>
  );
}
```

### Formularios Avanzados

Para campos más complejos o personalizados:

```tsx
// Ejemplo de esquema avanzado
const userSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  age: z.coerce.number().min(18, "Debes ser mayor de 18 años"),
  website: z.string().url("URL inválida").optional(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "Debes aceptar los términos y condiciones"
  })
});
```

## Temas Claro/Oscuro

El proyecto incluye soporte para temas claro y oscuro utilizando next-themes.

### Uso Básico

El cambio de tema está disponible con el componente `ThemeToggle`:

```tsx
import { ThemeToggle } from '@/components/ui/theme-toggle';

export default function Layout({ children }) {
  return (
    <div>
      <header>
        <ThemeToggle />
      </header>
      <main>{children}</main>
    </div>
  );
}
```

### Personalización

1. Personaliza los colores del tema en `styles/globals.css`.

2. Para acceder al tema actual en componentes:

```tsx
import { useTheme } from 'next-themes';

export function MyComponent() {
  const { theme, setTheme } = useTheme();
  
  return (
    <div>
      <p>Tema actual: {theme}</p>
      <button onClick={() => setTheme('light')}>Claro</button>
      <button onClick={() => setTheme('dark')}>Oscuro</button>
      <button onClick={() => setTheme('system')}>Sistema</button>
    </div>
  );
}
```

## Navegación y Rutas

### Navegación Básica

Para navegar entre páginas, usa el componente `Link`:

```tsx
import Link from 'next/link';

export default function Navigation() {
  return (
    <nav>
      <Link href="/">Inicio</Link>
      <Link href="/about">Acerca de</Link>
      <Link href="/blog">Blog</Link>
      <Link href="/contact">Contacto</Link>
    </nav>
  );
}
```

### Rutas Dinámicas

Para crear rutas dinámicas como `/products/[id]`:

```tsx
// pages/products/[id].tsx
import { useRouter } from 'next/router';

export default function ProductPage() {
  const router = useRouter();
  const { id } = router.query;
  
  return <div>Producto ID: {id}</div>;
}
```

### Navegación Programática

```tsx
import { useRouter } from 'next/router';

export default function LoginPage() {
  const router = useRouter();
  
  const handleLogin = async (credentials) => {
    // Lógica de login...
    await login(credentials);
    
    // Redirigir después del login
    router.push('/dashboard');
  };
  
  return (
    // Formulario de login...
  );
}
```

## Variables de Entorno

Configura las siguientes variables en `.env.local` según las características que uses:

```
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=

# Autenticación con proveedores
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_ID=
GITHUB_SECRET=

# Base de datos
DATABASE_URL=

# OpenAI
OPENAI_API_KEY=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Uso de Variables de Entorno

En el servidor (API Routes, getServerSideProps, etc.):
```tsx
// Acceso directo
const apiKey = process.env.OPENAI_API_KEY;
```

En el cliente (componentes, páginas):
```tsx
// Solo variables públicas con prefijo NEXT_PUBLIC_
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

## Mejores Prácticas

### Performance

1. **Imágenes optimizadas**: Usa el componente `Image` de Next.js para optimizar automáticamente las imágenes.

```tsx
import Image from 'next/image';

export default function ProfilePage() {
  return (
    <Image
      src="/images/profile.jpg"
      alt="Perfil de usuario"
      width={200}
      height={200}
      priority
    />
  );
}
```

2. **Code Splitting**: Next.js hace code splitting automáticamente por páginas, pero también puedes usar importaciones dinámicas:

```tsx
import dynamic from 'next/dynamic';

// Solo se carga cuando es necesario
const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
  loading: () => <p>Cargando...</p>,
});
```

3. **Optimización de fuentes**: Usa `next/font` para optimizar las fuentes:

```tsx
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function Layout({ children }) {
  return (
    <div className={inter.className}>
      {children}
    </div>
  );
}
```

### Seguridad

1. **Validación de datos**: Valida todos los datos de entrada, especialmente en API Routes.
2. **Content Security Policy**: Configura encabezados de seguridad.
3. **CSRF Protection**: NextAuth.js incluye protección CSRF automática.

## Solución de Problemas

### Errores Comunes

1. **Error "Module not found"**
   - Verifica las rutas de importación
   - Asegúrate de usar alias `@/` correctamente

2. **Errores con imágenes externas**
   - Añade los dominios en `next.config.js` en la sección `images.domains`

3. **Problemas con la autenticación**
   - Verifica que las variables de entorno estén correctamente configuradas
   - Revisa los logs del servidor para ver errores específicos

4. **Errores de TypeScript**
   - Ejecuta `npm run build` para ver errores de tipos
   - Asegúrate de definir correctamente las interfaces

### Depuración

1. **Depuración del lado del cliente**:
   - Usa React DevTools
   - Utiliza `console.log()` o `debugger`

2. **Depuración del lado del servidor**:
   - Añade logs en funciones del servidor
   - Verifica la terminal donde ejecutas `npm run dev`

## Despliegue

La forma más sencilla de desplegar tu aplicación es utilizando Vercel:

1. Crea una cuenta en [Vercel](https://vercel.com)
2. Conecta tu repositorio
3. Configura las variables de entorno
4. ¡Despliega!

Para otros proveedores como Netlify o AWS Amplify, consulta sus respectivas documentaciones.

### Vercel CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Iniciar sesión
vercel login

# Desplegar
vercel

# Desplegar a producción
vercel --prod
```

---

Esta documentación cubre las principales características y herramientas incluidas en tu proyecto creado con `create-rotosaurio-app`. Para cualquier duda o problema, visita el repositorio del proyecto o consulta la documentación oficial de Next.js. 