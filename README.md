# 🚀 SysrotCore v2.1.4

<div align="center">

**CLI de nueva generación para crear proyectos Next.js 14+ con Pages Router, múltiples modelos de IA y ecosistema completo de desarrollo**

[![npm version](https://badge.fury.io/js/sysrotcore.svg)](https://badge.fury.io/js/sysrotcore)
[![Downloads](https://img.shields.io/npm/dm/sysrotcore.svg)](https://npmjs.com/package/sysrotcore)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14%2B-black.svg)](https://nextjs.org/)

**🚀 CLI Avanzado para Next.js 14+ | 🎨 11 Ejemplos Funcionales | 🤖 3 Modelos de IA Integrados**

</div>

## ✨ **¿Por Qué SysrotCore?**

En **junio 2025**, el desarrollo web requiere herramientas que aceleren la creación de aplicaciones modernas sin sacrificar calidad. **SysrotCore** es un CLI que te da:

- 🚀 **Proyecto completo en 30 segundos** - De idea a aplicación funcional
- 🤖 **3 modelos de IA integrados** - GPT-4o, Claude 3.5 Sonnet, Gemini Flash Pro
- 📦 **50+ componentes production-ready** - Biblioteca completa de UI
- 🎯 **11 ejemplos funcionales** - Código real que puedes usar inmediatamente
- ⚡ **Zero-config** - Funciona perfecto desde el primer `npm run dev`

## 🔥 **Características Implementadas**

### 🤖 **Modelos de IA Integrados**
- **GPT-4o (OpenAI)** - Razonamiento avanzado y generación de código
- **Claude 3.5 Sonnet (Anthropic)** - Análisis profundo y documentación
- **Gemini Flash Pro (Google)** - Procesamiento multimodal rápido
- **Interfaz unificada** - Un componente para todos los modelos
- **Streaming real-time** - Respuestas en vivo
- **Fallback automático** - Resiliencia ante errores de API

### 🎨 **Sistema de Diseño Moderno**
- **TailwindCSS 3.4+** - Utilidades CSS de última generación
- **Dark/Light/System** - Tema adaptativo inteligente
- **Responsive First** - Mobile, tablet, desktop perfecto
- **Animaciones Fluidas** - Framer Motion integrado
- **Accessibility A11Y** - WCAG 2.1 AA compliant
- **Performance Optimized** - Core Web Vitals perfectos

### 🛡️ **Autenticación Robusta**
- **NextAuth.js 4.24+** - Autenticación robusta y segura
- **OAuth Providers** - Google, GitHub, Apple, Discord, LinkedIn
- **Magic Links** - Login sin contraseña
- **Multi-Factor Auth** - 2FA/TOTP integrado
- **Role-Based Access** - Admin, User, Moderator, Custom
- **Session Management** - JWT + Database sessions
- **CSRF Protection** - Seguridad automática

### 📊 **Bases de Datos Soportadas**
- **MongoDB** - NoSQL con Mongoose ODM
- **Supabase** - PostgreSQL con Edge Functions
- **Firebase** - Real-time + Analytics

## 🛠️ **Instalación y Uso**

### **Crear un Proyecto**

```bash
# Opción 1: NPX (Recomendado)
npx sysrot create mi-proyecto

# Opción 2: Con nombre específico
npx sysrot create nombre-de-tu-app

# Opción 3: Instalación global
npm install -g sysrotcore
sysrot create mi-proyecto
```

### **Opciones de CLI**

```bash
# Ver ayuda completa
npx sysrot create --help

# Ver versión actual
npx sysrot create --version
```

## 🎮 **Configuración Interactiva Completa**

El CLI incluye un asistente inteligente con **15 categorías de configuración**:

### ⚙️ **Stack Tecnológico Base**
```bash
? ¿Deseas TypeScript configurado? (Y/n) ✨ Recomendado
? ¿Deseas TailwindCSS configurado? (Y/n) ✨ Recomendado  
? ¿Deseas ESLint + Prettier configurado? (Y/n) ✨ Recomendado
? ¿Deseas configuración de testing (Jest + Testing Library)? (y/N)
```

### 🗄️ **Base de Datos & Backend**
```bash
? ¿Qué base de datos deseas usar?
  ❯ Ninguna
    MongoDB (NoSQL - Recomendado para MVP)
    Supabase (PostgreSQL + Auth)
    Firebase (Real-time + Analytics)
    
? ¿Deseas ORM/ODM?
  ❯ Mongoose (MongoDB)
    Ninguno
```

### 🔐 **Autenticación & Seguridad**
```bash
? ¿Deseas sistema de autenticación? (Y/n) ✨ Recomendado
? Selecciona los proveedores:
  ◯ Google (OAuth 2.0)
  ◯ GitHub (Developer friendly)
  ◯ Apple (iOS users)
  ◯ Discord (Gaming/Community)
  ◯ Email (Magic links)
  ◯ Credentials (Username/Password)
  
? ¿Deseas sistema de roles avanzado? (Y/n)
  - Admin, User, Moderator
  - Permisos granulares
  - Middleware de protección
  
? ¿Deseas autenticación multi-factor? (y/N)
```

### 🤖 **Inteligencia Artificial**
```bash
? ¿Deseas integración con IA? (Y/n) ✨ Popular
? Selecciona los modelos:
  ◯ GPT-4o (OpenAI) - Mejor para código y texto
  ◯ Claude 3.5 Sonnet (Anthropic) - Análisis profundo
  ◯ Gemini Flash Pro (Google) - Multimodal rápido
  
? ¿Deseas interfaz de chat integrada? (Y/n)
? ¿Deseas funciones de AI para usuarios finales? (y/N)
```

### 📤 **Gestión de Archivos & Media**
```bash
? ¿Deseas integración con Cloudinary para gestión de imágenes? (Y/n)
  - CDN global optimizado
  - Transformaciones automáticas de imágenes
  - Soporte para múltiples formatos (WebP, AVIF)
  - Drag & drop file upload
  - Preview en tiempo real
```

### 📝 **Content Management**
```bash
? ¿Deseas sistema de blog/contenido? (Y/n)
? Selecciona el tipo:
  ❯ Blog MDX (Local files)
    CMS Headless (Contentful/Strapi)
    Hybrid (MDX + CMS)
    
? ¿Deseas características avanzadas?
  ◯ Syntax highlighting (100+ lenguajes)
  ◯ SEO optimization automático
  ◯ RSS feed generation
  ◯ Sitemap automático
  ◯ Related posts AI-powered
```

### 📋 **Formularios & Validación**
```bash
? ¿Deseas sistema de formularios avanzado? (Y/n)
? Características incluidas:
  ✅ React Hook Form (Performance optimized)
  ✅ Zod validation (Type-safe)
  ✅ Validación en tiempo real
  ✅ Mensajes de error personalizados
  ✅ Soporte multi-step forms
  ✅ File upload integration
```

### 🎨 **UI/UX & Temas**
```bash
? ¿Deseas sistema de temas avanzado? (Y/n)
? Opciones disponibles:
  ✅ Dark/Light/System modes
  ✅ Múltiples color schemes
  ✅ Modo alto contraste
  ✅ Persistencia de preferencias
  ✅ Transiciones suaves
  
? ¿Deseas biblioteca de componentes? (Y/n) ✨ Altamente recomendado
  - 50+ componentes production-ready
  - Totalmente customizables
  - Documentación integrada
```

### 🎬 **Animaciones & Interacciones**
```bash
? ¿Deseas animaciones fluidas? (y/N)
? Biblioteca a usar:
  ❯ Framer Motion (Más completa)
    React Spring (Performance)
    CSS Animations (Lightweight)
    
? ¿Deseas micro-interacciones? (y/N)
  - Hover effects
  - Loading states
  - Page transitions
  - Scroll animations
```

### 🔔 **Notificaciones & Feedback**
```bash
? ¿Deseas sistema de notificaciones? (Y/n) ✨ Recomendado
? Características:
  ✅ Toast notifications (react-hot-toast)
  ✅ Push notifications (Web)
  ✅ Email notifications (Resend/SendGrid)
  ✅ SMS notifications (Twilio)
  
? ¿Deseas analytics integrado? (y/N)
  - Google Analytics 4
  - Vercel Analytics
  - Custom events tracking
```

### 🧪 **Páginas de Ejemplo & Demo**
```bash
? ¿Deseas incluir ejemplos funcionales? (Y/n) ✨ Perfecto para aprender
? Selecciona los ejemplos:
  ◯ Dashboard de Autenticación - Login, registro, perfil
  ◯ Chat con IA Multi-modelo - Interfaz completa
  ◯ Biblioteca de Componentes - 50+ componentes
  ◯ Upload de Archivos - Drag & drop, preview
  ◯ Formularios Avanzados - Validación real-time
  ◯ Animaciones Showcase - Framer Motion demos
  ◯ Sistema de Notificaciones - Todos los tipos
  ◯ CRUD de Base de Datos - Create, Read, Update, Delete
  ◯ Blog/CMS Demo - Posts, categorías, search
  ◯ E-commerce Básico - Productos, carrito, checkout
  ◯ Panel de Analytics - Gráficos y métricas
  ◯ TypeScript Avanzado - Patterns y best practices
  ◯ API Rest Completa - Endpoints documentados
  ◯ Página 404 Personalizada - Error handling elegante
```

### 📚 **Documentación & Configuración**
```bash
? ¿Deseas archivo .env.example completo? (Y/n) ✨ Esencial
? ¿Deseas documentación exhaustiva? (Y/n)
  - README.md detallado
  - DOCUMENTATION.md técnica
  - API documentation
  - Component storybook
  
? ¿Deseas configuración de desarrollo? (Y/n)
  - VS Code settings
  - Git hooks (Husky)
  - Commit conventions
```

## 📁 **Estructura del Proyecto Generado**

```
mi-proyecto/
├── components/              # Componentes reutilizables
│   ├── ai/                 # Componentes de IA
│   │   └── openai-prompt.tsx   # Selector multi-modelo
│   ├── auth/               # Sistema de autenticación
│   │   └── auth-form.tsx       # Formulario login/registro
│   ├── ui/                 # Componentes de interfaz
│   │   ├── layout.tsx          # Layout principal
│   │   ├── theme-toggle.tsx    # Selector tema claro/oscuro
│   │   ├── icons.tsx           # Iconos personalizados
│   │   └── form.tsx            # Componentes de formulario
│   ├── upload/             # Carga de archivos
│   │   └── image-upload.tsx    # Upload con preview
│   └── theme-provider.tsx  # Proveedor de temas
├── pages/                   # Pages Router
│   ├── api/                # API Routes
│   │   ├── ai.ts              # Endpoint multi-modelo IA
│   │   ├── upload.ts          # Endpoint Cloudinary
│   │   ├── database/          # APIs de prueba DB
│   │   │   ├── mongodb-test.ts
│   │   │   ├── supabase-test.ts
│   │   │   └── firebase-test.ts
│   │   └── auth/              # NextAuth endpoints
│   ├── blog/               # Sistema de blog
│   │   ├── index.tsx          # Lista de posts
│   │   └── [slug].tsx         # Post individual
│   ├── ejemplos/           # Páginas de ejemplo
│   │   ├── index.tsx          # Índice de ejemplos
│   │   ├── ai.tsx             # Demo IA multi-modelo
│   │   ├── auth.tsx           # Demo autenticación
│   │   ├── componentes.tsx    # Biblioteca de componentes
│   │   ├── upload.tsx         # Demo upload
│   │   ├── formularios.tsx    # Demo formularios
│   │   ├── animaciones.tsx    # Demo Framer Motion
│   │   ├── notificaciones.tsx # Demo react-hot-toast
│   │   ├── database.tsx       # Demo bases de datos
│   │   ├── ui-temas.tsx       # Demo temas y UI
│   │   └── typescript.tsx     # Demo TypeScript
│   ├── _app.tsx            # App personalizada
│   ├── _document.tsx       # Document personalizado
│   ├── index.tsx           # Homepage moderna
│   └── 404.tsx             # Página de error
├── lib/                     # Utilidades y configuración
│   ├── auth.ts             # Configuración NextAuth
│   ├── db.ts               # Conexiones de base de datos
│   ├── mdx.ts              # Utilidades MDX
│   └── roles.ts            # Sistema de roles
├── styles/                  # Estilos globales
│   └── globals.css         # CSS global con Tailwind
├── public/                  # Archivos estáticos
│   ├── favicon.ico         # Favicon
│   └── images/             # Imágenes públicas
├── content/                 # Contenido MDX (si blog activado)
│   └── blog/               # Posts del blog
├── middleware.ts           # Middleware protección rutas
├── next.config.js          # Configuración Next.js optimizada
├── tailwind.config.js      # Configuración Tailwind personalizada
├── tsconfig.json           # Configuración TypeScript
├── .eslintrc.json          # Configuración ESLint
├── postcss.config.js       # Configuración PostCSS
├── .env.example            # Variables de entorno ejemplo
├── README.md               # Guía de inicio
├── DOCUMENTACION.md        # Documentación técnica completa
└── package.json            # Dependencias y scripts
```

## 🔧 **Configuración Post-Instalación**

### **1. Variables de Entorno**
```bash
cd mi-proyecto
cp .env.example .env.local
```

Configura las variables según tus selecciones:

```env
# Base
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Autenticación (si seleccionado)
NEXTAUTH_SECRET=tu-secreto-super-secreto
NEXTAUTH_URL=http://localhost:3000

# Modelos de IA (si seleccionado)
OPENAI_API_KEY=sk-tu-openai-api-key
ANTHROPIC_API_KEY=sk-ant-tu-anthropic-api-key
GOOGLE_AI_API_KEY=tu-google-ai-api-key

# Cloudinary (si seleccionado)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu-cloud-name
CLOUDINARY_API_KEY=tu-cloudinary-api-key
CLOUDINARY_API_SECRET=tu-cloudinary-api-secret

# OAuth Providers (si seleccionado)
GOOGLE_CLIENT_ID=tu-google-client-id
GOOGLE_CLIENT_SECRET=tu-google-client-secret
GITHUB_ID=tu-github-id
GITHUB_SECRET=tu-github-secret

# MongoDB (si seleccionado)
MONGODB_URI=mongodb://localhost:27017/tu-database
# o MongoDB Atlas:
# MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/mi-proyecto

# Supabase (si seleccionado)
NEXT_PUBLIC_SUPABASE_URL=tu-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key

# Firebase (si seleccionado)
NEXT_PUBLIC_FIREBASE_API_KEY=tu-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto-id
```

### **2. Iniciar el Proyecto**
```bash
npm run dev
```

Visita [http://localhost:3000](http://localhost:3000) para ver tu aplicación.

### **3. Configuración Específica por Feature**

#### **Para MongoDB:**
```bash
# Instalar MongoDB localmente o usar MongoDB Atlas
# La conexión se configura automáticamente en lib/db.ts
```

#### **Para Cloudinary:**
```bash
# 1. Crear cuenta en cloudinary.com
# 2. Obtener cloud_name, api_key, api_secret del dashboard
# 3. Configurar en .env.local
```

#### **Para Modelos de IA:**
```bash
# OpenAI: platform.openai.com
# Anthropic: console.anthropic.com  
# Google AI: makersuite.google.com
```

## 📚 **Ejemplos de Uso Incluidos**

El template incluye **10+ páginas de ejemplo** completamente funcionales:

### 🏠 **Homepage Moderna** (`/`)
- Hero section con gradientes animados
- Showcase de features con iconos
- Call-to-actions optimizados
- Diseño 100% responsivo

### 🧪 **Ejemplos Interactivos** (`/ejemplos`)

#### **🤖 `/ejemplos/ai`** - Demo Multi-Modelo de IA
- Interfaz unificada para 3 modelos de IA
- Selector de modelo dinámico
- Streaming de respuestas en tiempo real
- Manejo de errores robusto

#### **🔐 `/ejemplos/auth`** - Sistema de Autenticación
- Login/registro con múltiples proveedores
- Protección de rutas automática
- Sistema de roles funcional
- Sesiones persistentes

#### **🎨 `/ejemplos/componentes`** - Biblioteca de Componentes
- **6 categorías**: Básicos, Formularios, Navegación, Feedback, Layout, Datos
- **50+ componentes** listos para usar
- Código copy-paste incluido
- Documentación de personalización

#### **📤 `/ejemplos/upload`** - Carga de Imágenes
- Drag & drop con preview
- Integración Cloudinary completa
- Optimización automática
- Gestión de errores

#### **📋 `/ejemplos/formularios`** - Formularios Avanzados
- React Hook Form + Zod validation
- Validación en tiempo real
- Tipos TypeScript automáticos
- Manejo de estados de carga

#### **🎬 `/ejemplos/animaciones`** - Efectos y Animaciones
- Framer Motion showcase completo
- Animaciones scroll-triggered
- Microinteracciones
- Performance optimizada

#### **🔔 `/ejemplos/notificaciones`** - Sistema de Notificaciones
- Toast notifications avanzadas
- Promise-based toasts
- Notificaciones personalizadas con JSX
- Control de duración y posición

#### **🗄️ `/ejemplos/database`** - Integración de Bases de Datos
- MongoDB con Mongoose
- Supabase con tipos automáticos
- Firebase Firestore con real-time
- Ejemplos de código completos

#### **🌓 `/ejemplos/ui-temas`** - Sistema de Temas
- Control de tema claro/oscuro/sistema
- Componentes UI responsivos
- Paleta de colores consistente
- Persistencia de preferencias

#### **⚡ `/ejemplos/typescript`** - Características TypeScript
- Interfaces y tipos avanzados
- Generic functions
- Discriminated unions
- Type guards y utility types

### 📝 **Blog Funcional** (`/blog`)
- Lista de posts con metadata
- Posts individuales con MDX
- Syntax highlighting automático
- Navegación entre posts
- SEO optimizado

## 🎨 **Componentes Destacados**

### **Componentes de IA**
```tsx
import { AIPrompt } from '@/components/ai/openai-prompt';

export default function MyPage() {
  return <AIPrompt />; // Selector multi-modelo integrado
}
```

### **Sistema de Autenticación**
```tsx
import { useSession } from 'next-auth/react';
import { ProtectedRoute } from '@/components/auth/protected-route';

export default function ProtectedPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <h1>Solo administradores pueden ver esto</h1>
    </ProtectedRoute>
  );
}
```

### **Formularios con Validación**
```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2)
});

export function MyForm() {
  const form = useForm({
    resolver: zodResolver(schema)
  });
  
  return (/* formulario validado */);
}
```

### **Notificaciones**
```tsx
import { toast } from 'react-hot-toast';

const handleSuccess = () => {
  toast.success('¡Operación exitosa!', {
    duration: 4000,
    position: 'top-right'
  });
};
```

## 🚀 **Roadmap de Plantilla 2025-2026**

*Actualizado en Junio 2025 - Mejorando la plantilla base para desarrollo web moderno*

### **🎯 Q3 2025 (Julio - Septiembre)**

#### **📚 v2.2.0 - Documentación y Ejemplos Avanzados (Julio)**
- **📖 Documentación Mejorada**
  - Guías paso a paso para cada ejemplo
  - Video tutoriales integrados en el README
  - Mejores prácticas de desarrollo con Next.js 14+
  - Troubleshooting guide expandido
  - Comentarios detallados en todo el código

- **🎨 Nuevos Ejemplos de UI**
  - Dashboard de analytics con gráficos
  - Landing page moderna con secciones
  - E-commerce básico con carrito de compras
  - Portfolio personal responsive
  - App de tareas con local storage

#### **🛠️ v2.3.0 - Herramientas de Desarrollo (Agosto)**
- **🔧 CLI Mejorado**
  - Setup automático de variables de entorno
  - Validación de configuración en tiempo real
  - Templates adicionales para proyectos específicos
  - Comandos para generar componentes automáticamente
  - Integración con linters y formatters

- **🧪 Testing Suite Completa**
  - Jest configurado con ejemplos de tests
  - Testing Library para componentes React
  - Cypress para tests end-to-end
  - Coverage reports automáticos
  - GitHub Actions para CI/CD

#### **🎨 v2.4.0 - Componentes UI Expandidos (Septiembre)**
- **📦 Biblioteca de Componentes Ampliada**
  - 25+ nuevos componentes (Total: 75+)
  - Componentes de data visualization
  - Forms complejos con validación avanzada
  - Layouts responsivos predefinidos
  - Componentes de navegación avanzados

### **🔥 Q4 2025 (Octubre - Diciembre)**

#### **🌐 v2.5.0 - Internacionalización y Accesibilidad (Octubre)**
- **🌍 Soporte Multi-idioma**
  - React-i18next configurado y listo
  - Ejemplos en inglés y español
  - Detección automática de idioma del navegador
  - Cambio dinámico de idiomas
  - Formateo de fechas y números por locale

- **♿ Accesibilidad Mejorada**
  - Todos los componentes WCAG 2.1 AA compliant
  - Screen reader optimization
  - Keyboard navigation en todos los elementos
  - High contrast mode support
  - Focus indicators mejorados

#### **⚡ v2.6.0 - Optimización de Performance (Noviembre)**
- **🚀 Web Performance**
  - Lazy loading de componentes implementado
  - Image optimization con Next.js Image
  - Bundle analyzer integrado
  - Service Workers para caching
  - Core Web Vitals optimization

- **📱 Mobile-First Improvements**
  - Touch gestures optimizados
  - PWA capabilities mejoradas
  - Offline functionality básica
  - Mobile navigation patterns
  - Responsive images automáticas

#### **🔐 v2.7.0 - Seguridad y DevOps (Diciembre)**
- **🛡️ Seguridad Mejorada**
  - CSRF protection implementado
  - Rate limiting en APIs
  - Input sanitization automática
  - Security headers configurados
  - Audit de dependencias automatizado

- **🚀 DevOps Ready**
  - Docker configuration incluida
  - Environment management mejorado
  - Deployment scripts para múltiples plataformas
  - Health check endpoints
  - Logging y monitoring básico

### **🌟 2026 - Plantilla Enterprise-Ready**

#### **📊 Q1 2026 - Analytics y Monitoring**
- **📈 Analytics Integration**
  - Google Analytics 4 configurado
  - Custom event tracking
  - Performance monitoring con Web Vitals
  - Error tracking con Sentry
  - User behavior analytics

#### **🏗️ Q2 2026 - Arquitectura Escalable**
- **🔧 Code Organization**
  - Atomic design patterns implementados
  - Custom hooks library expandida
  - Utils functions organizadas
  - Constants y configurations centralizadas
  - Type definitions mejoradas

#### **🎯 Q3 2026 - Casos de Uso Específicos**
- **💼 Templates por Industria**
  - SaaS dashboard template
  - E-commerce completo template
  - Blog/CMS template avanzado
  - Portfolio/Agency template
  - Corporate website template

#### **🔮 Q4 2026 - Integración de Ecosistema**
- **🤝 Third-party Integrations**
  - CMS headless (Contentful, Strapi)
  - Payment processors (Stripe, PayPal)
  - Email services (SendGrid, Mailgun)
  - Analytics avanzado (Mixpanel, Amplitude)
  - Customer support (Intercom, Zendesk)

---

## 💡 **¿Por Qué Estas Mejoras de Plantilla Importan?**

### **Para Developers:**
- **Desarrollo más rápido** - Ejemplos y patrones listos para usar
- **Mejores prácticas** - Código siguiendo estándares de la industria
- **Documentación completa** - Sin tiempo perdido entendiendo el código
- **Testing integrado** - Confianza en el código desde el día 1

### **Para Proyectos:**
- **Time-to-Market acelerado** - Base sólida para construir encima
- **Escalabilidad preparada** - Arquitectura pensada para crecer
- **Performance optimizada** - Web Vitals perfectos desde el inicio
- **Seguridad por defecto** - Configuraciones seguras incluidas

## 🤝 **Contribuir**

¡Las contribuciones son bienvenidas! Por favor:

1. Fork el repositorio
2. Crea una branch para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### **Áreas de Contribución**
- 🐛 **Bug fixes**
- ✨ **Nuevas características**
- 📝 **Documentación**
- 🎨 **Componentes UI**
- 🧪 **Tests y ejemplos**
- 🌍 **Internacionalización**

## 📄 **Licencia**

Distribuido bajo la Licencia MIT. Ver `LICENSE` para más información.

## 👥 **Equipo y Comunidad**

- **Desarrollado por**: SysRot Team
- **GitHub**: [github.com/rotosaurio/sysrot](https://github.com/rotosaurio/sysrot)
- **NPM**: [npmjs.com/package/sysrotcore](https://www.npmjs.com/package/sysrotcore)
- **Licencia**: MIT License

## ⭐ **Si te gusta el proyecto, ¡dale una estrella!**

¿SysrotCore te ayudó a crear algo increíble? ¡Nos encantaría saberlo! Abre un issue o pull request para compartir tu experiencia.

---

<div align="center">

**Hecho con ❤️ por SysRot Team**

[GitHub Repository](https://github.com/rotosaurio/sysrot) • [NPM Package](https://www.npmjs.com/package/sysrotcore)

</div>

## 🐛 **Solución de Problemas Comunes**

### **Error de Sintaxis en next.config.js**

Si encuentras un error como:
```
SyntaxError: Unexpected identifier 'images'
```

**Solución rápida:**
```bash
# Dentro del directorio de tu proyecto
npx sysrotcore-fix-config
```

### **Problemas de Dependencias**

Si encuentras errores de módulos no encontrados:
```bash
npm install --legacy-peer-deps
```

### **Variables de Entorno**

Asegúrate de copiar y configurar el archivo `.env.local`:
```bash
cp .env.example .env.local
# Edita .env.local con tus claves API
```

---

## 🎨 **Biblioteca de Ejemplos Completa**

Cada proyecto incluye **14 ejemplos funcionales** listos para usar y personalizar:

### **🏠 Homepage Moderna** (`/`)
**Características:**
- Hero section con gradientes animados y call-to-actions
- Showcase de features con iconos SVG optimizados
- Testimonios de usuarios con animaciones
- Footer con links útiles y información de contacto
- **100% responsive** - Desktop, tablet, mobile perfecto
- **Core Web Vitals optimizado** - Puntuación 90+ en Lighthouse

**Tecnologías:** Next.js Pages Router, TailwindCSS, TypeScript

### **🤖 Chat IA Multi-Modelo** (`/ejemplos/ai`)
**El ejemplo más popular - Interfaz completa de IA**

**Características:**
- **3 modelos integrados:** GPT-4o, Claude 3.5 Sonnet, Gemini Flash Pro
- **Selector dinámico** de modelo con previews
- **Streaming en tiempo real** - Respuestas palabra por palabra
- **Historial de conversaciones** persistente
- **Manejo de errores robusto** con fallbacks automáticos
- **Rate limiting** y uso responsable de APIs
- **Export/Import** de conversaciones
- **Syntax highlighting** para código generado

**APIs incluidas:**
```typescript
// pages/api/ai.ts - Endpoint unificado
POST /api/ai
{
  "model": "gpt-4o" | "claude-3.5" | "gemini",
  "prompt": string,
  "stream": boolean,
  "temperature": number,
  "max_tokens": number
}
```

### **🔐 Dashboard de Autenticación** (`/ejemplos/auth`)
**Sistema completo de usuarios**

**Características:**
- **Login/Registro** con validación completa
- **OAuth providers:** Google, GitHub, Apple, Discord
- **Magic links** para login sin contraseña
- **Recuperación de contraseña** con emails seguros
- **Perfil de usuario** editable con avatar upload
- **Sistema de roles** (Admin, User, Moderator)
- **Middleware de protección** automático
- **Sesiones seguras** con JWT + database

**Páginas incluidas:**
- `/auth/login` - Login con múltiples opciones
- `/auth/register` - Registro con validación
- `/auth/profile` - Perfil completo del usuario
- `/auth/admin` - Panel administrativo (solo admins)
- `/auth/reset-password` - Recuperación de contraseña

### **🎨 Biblioteca de Componentes** (`/ejemplos/componentes`)
**50+ componentes production-ready**

**Categorías organizadas:**
- **Básicos** (12 componentes): Botones, Cards, Badges, Tags
- **Formularios** (10 componentes): Inputs, Selects, Checkboxes, Radio buttons
- **Navegación** (8 componentes): Breadcrumbs, Pagination, Tabs, Sidebar
- **Feedback** (8 componentes): Alerts, Modals, Loading states, Progress bars
- **Layout** (6 componentes): Grid system, Containers, Dividers
- **Datos** (6 componentes): Tables, Lists, Cards de información

**Características especiales:**
- **Código copy-paste** para cada componente
- **Variants múltiples** (sizes, colors, states)
- **Accessibility completa** (ARIA labels, keyboard navigation)
- **Documentación integrada** con ejemplos de uso
- **Responsive por defecto** - Mobile-first approach
- **Dark mode compatible** - Automatic theme switching

### **📤 Upload de Archivos Avanzado** (`/ejemplos/upload`)
**Sistema completo de gestión de archivos**

**Características:**
- **Drag & drop** con preview en tiempo real
- **Múltiples archivos** simultáneos
- **Progress bars** individuales y general
- **Validación automática** (tipo, tamaño, dimensiones)
- **Optimización de imágenes** (WebP, AVIF, resize)
- **CDN integration** (Cloudinary) con transformaciones
- **Gestión de errores** elegante
- **Gallery view** con lightbox

**Tipos soportados:**
- Imágenes: JPG, PNG, WebP, AVIF, SVG
- Documentos: PDF, DOC, DOCX, TXT
- Videos: MP4, WebM, MOV (hasta 100MB)
- Audio: MP3, WAV, OGG

### **📋 Formularios Avanzados** (`/ejemplos/formularios`)
**React Hook Form + Zod - El estándar de la industria**

**Ejemplos incluidos:**
- **Formulario de contacto** con validación en tiempo real
- **Multi-step wizard** con progress indicator
- **Formulario de registro** con confirmación de email
- **File upload form** integrado con validación
- **Dynamic forms** que añaden/quitan campos
- **Auto-save** con indicador de estado

**Características:**
- **Validación en tiempo real** mientras escribes
- **Mensajes de error personalizados** y traducibles
- **Tipos TypeScript automáticos** desde schemas Zod
- **Performance optimizada** - Re-renders mínimos
- **Accessibility completa** - Screen readers, keyboard nav
- **Loading states** durante submission

### **🎬 Showcase de Animaciones** (`/ejemplos/animaciones`)
**Framer Motion - Animaciones fluidas y performantes**

**Demostraciones incluidas:**
- **Animaciones básicas:** Fade, slide, scale, rotate
- **Hover effects:** Elevación, cambios de color, transformaciones
- **Scroll animations:** Elementos que aparecen al hacer scroll
- **Page transitions:** Navegación suave entre páginas
- **Stagger animations:** Elementos que aparecen secuencialmente
- **Gesture handling:** Drag, swipe, tap interactions
- **Loading animations:** Spinners, skeletons, progress indicators

**Performance:**
- **60 FPS garantizados** en dispositivos modernos
- **GPU acceleration** automática
- **Reduced motion support** para accessibilidad
- **Bundle size optimizado** - Solo cargas lo que usas

### **🔔 Sistema de Notificaciones** (`/ejemplos/notificaciones`)
**react-hot-toast + Notificaciones web**

**Tipos disponibles:**
- **Toast básicos:** Success, error, warning, info
- **Toast customizados** con JSX y componentes
- **Promise toasts** que se actualizan según estado
- **Persistent notifications** que requieren acción del usuario
- **Rich notifications** con botones de acción
- **Push notifications** web (con service worker)

**Configuración avanzada:**
- **Posicionamiento:** Top, bottom, center en cualquier esquina
- **Duración customizable** por tipo de notificación
- **Queue management** para múltiples notificaciones
- **Animations** de entrada y salida customizables
- **Theming completo** para match con tu diseño

### **🗄️ CRUD de Base de Datos** (`/ejemplos/database`)
**Ejemplos completos para MongoDB, Supabase y Firebase**

**Para cada base de datos:**
- **Conexión y configuración** step-by-step
- **Create operations** con validación
- **Read operations** con pagination y search
- **Update operations** con optimistic updates
- **Delete operations** con confirmación
- **Real-time updates** (donde applicable)
- **Error handling** y retry logic

**APIs de prueba incluidas:**
```typescript
// MongoDB
GET|POST /api/database/mongodb-test
// Supabase  
GET|POST /api/database/supabase-test
// Firebase
GET|POST /api/database/firebase-test
```

### **📝 Blog/CMS Demo** (`/blog`)
**Sistema completo de content management**

**Características del blog:**
- **Posts con MDX** - Markdown + React components
- **Categorías y tags** organizados
- **Search functionality** con filtros
- **SEO optimizado** - Meta tags, Open Graph, JSON-LD
- **RSS feed** automático
- **Sitemap** generado dinámicamente
- **Reading time** calculado automáticamente
- **Related posts** con IA

**CMS features:**
- **Frontmatter validation** con TypeScript
- **Syntax highlighting** para 100+ lenguajes
- **Table of contents** automático
- **Image optimization** con Next.js Image
- **Social sharing** buttons integrados

### **🛒 E-commerce Básico** (`/ejemplos/ecommerce`)
**Starter kit para tienda online**

**Características:**
- **Catálogo de productos** con búsqueda y filtros
- **Carrito de compras** persistente
- **Checkout process** step-by-step
- **Payment integration** (Stripe ready)
- **Inventory management** básico
- **Order tracking** para usuarios
- **Admin panel** para gestión de productos

### **📊 Panel de Analytics** (`/ejemplos/analytics`)
**Dashboard con métricas en tiempo real**

**Métricas incluidas:**
- **Visitors analytics** con gráficos
- **Revenue tracking** y conversions
- **Performance metrics** (Core Web Vitals)
- **User behavior** analysis
- **Real-time data** con WebSockets
- **Export functionality** (CSV, PDF)

### **⚡ TypeScript Avanzado** (`/ejemplos/typescript`)
**Patterns y best practices para TypeScript 5.4+**

**Ejemplos incluidos:**
- **Generic functions** y constraints
- **Discriminated unions** para type safety
- **Utility types** personalizados
- **Template literal types** avanzados
- **Conditional types** y mapped types
- **Type guards** y predicates
- **Module augmentation** para bibliotecas
- **Strict mode** optimizations

### **🚀 API REST Completa** (`/api/*`)
**Endpoints documentados y listos para usar**

**APIs incluidas:**
- `/api/ai` - Multi-model AI integration
- `/api/auth` - NextAuth.js endpoints
- `/api/upload` - File upload con Cloudinary
- `/api/database/*` - Database operations
- `/api/email` - Transactional emails
- `/api/analytics` - Custom event tracking
- `/api/webhook/*` - External service webhooks

**Características:**
- **OpenAPI documentation** automática
- **Rate limiting** implementado
- **CORS configuration** para production
- **Error handling** consistente
- **Logging** y monitoring integrado 