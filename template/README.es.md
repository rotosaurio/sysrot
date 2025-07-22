# 🚀 sysrot-hub

**CLI de nueva generación para crear proyectos avanzados Next.js 14+ con IA multi-modelo, SaaS, e-commerce, chat, analytics y más.**

[![npm version](https://badge.fury.io/js/sysrot-hub.svg)](https://badge.fury.io/js/sysrot-hub)
[![Licencia: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)

---

## 🎯 ¿Qué es sysrot-hub?

**sysrot-hub** es una herramienta CLI que genera proyectos Next.js 14+ listos para producción con un ecosistema empresarial completo. No es solo un starter, sino una suite real de sistemas empresariales integrados, UI/UX moderna, soporte multi-idioma y herramientas avanzadas para desarrolladores.

---

## 📦 Instalación

```bash
npm install -g sysrot-hub
# o usa npx
yarn create sysrot-hub mi-proyecto
npx sysrot-hub mi-proyecto
```

---

## ✨ Características principales

- **Next.js 14+** con Pages Router, SSR/SSG, API routes
- **TypeScript** en todo el código
- **TailwindCSS** con modo claro/oscuro y temas personalizados
- **Biblioteca de componentes**: layouts, tablas, formularios, cards, toggles, loaders, badges, etc.
- **Validación de formularios**: React Hook Form + Zod
- **Notificaciones**: react-hot-toast
- **Internacionalización (i18n)**: React Intl, ES/EN, selector de idioma
- **Autenticación**: NextAuth.js (Google, GitHub, email, Discord, Twitter, credenciales)
- **Acceso por roles**: admin/user, middleware de protección de rutas
- **APIs REST**: para todos los sistemas empresariales
- **Integración Stripe**: pagos, webhooks, facturación
- **Integración Cloudinary**: uploads de imágenes/videos
- **Integración IA**: OpenAI, Anthropic, Google, DeepSeek (multi-modelo, seleccionable)
- **Prisma**: para e-commerce, SaaS, chat, proyectos, video, cursos, salud, etc.
- **MongoDB**: utilidades listas para usar
- **Zustand**: manejo de estado global (ej: carrito de compras)
- **Framer Motion**: animaciones y micro-interacciones
- **Optimización mobile**: breakpoints, gestos touch, PWA
- **Documentación completa**: en español e inglés
- **Listo para despliegue en Vercel y Docker**

---

## 🏢 Sistemas empresariales incluidos (Ejemplos de integración completa)

| Sistema         | Estado   | Modelos | APIs | Usuarios | Docs |
|----------------|----------|--------|------|-------|------|
| 🛍️ E-commerce  | ✅ Listo | 15+    | 8+   | 25+   | [README-ECOMMERCE.md](README-ECOMMERCE.md) |
| 🏢 SaaS        | ✅ Listo | 8      | 6+   | 12+   | [README-SAAS.md](README-SAAS.md) |
| 💬 Chat        | ✅ Listo | 8      | 5+   | 15+   | [README-CHAT.md](README-CHAT.md) |
| 🤖 Chatbots    | ✅ Listo | 8      | 4+   | 8+    | [README-CHATBOT.md](README-CHATBOT.md) |
| 📋 Proyectos   | ✅ Listo | 16     | 2+   | 6+    | [README-PROJECTS.md](README-PROJECTS.md) |
| 📺 Video       | ✅ Listo | 15     | 2+   | 8+    | [README-VIDEOS.md](README-VIDEOS.md) |
| 🏪 Marketplace | ✅ Listo | 10+    | 3+   | 10+   | (ver docs) |
| 👨‍💼 Portfolio  | ✅ Listo | 5+     | 1+   | 1+    | (ver docs) |
| 🚀 Landing Page| ✅ Listo | -      | -    | -     | (ver docs) |
| 📊 Analytics   | ✅ Listo | -      | -    | -     | (ver docs) |
| 📝 Task App    | ✅ Listo | 5+     | 1+   | 1+    | (ver docs) |

**Total: 70+ modelos de base de datos, 35+ APIs REST, 74+ usuarios de prueba**

---

## 🧩 Páginas de ejemplo y funcionalidades

- `/ejemplos/auth` - Flujos de autenticación
- `/ejemplos/ai` - Chat IA multi-modelo
- `/ejemplos/upload` - Upload de imágenes (Cloudinary)
- `/ejemplos/ecommerce` - Demo e-commerce
- `/ejemplos/marketplace` - Plataforma marketplace
- `/ejemplos/portfolio` - Portfolio personal
- `/ejemplos/saas` - SaaS multi-tenant
- `/ejemplos/chat` - Chat en tiempo real (Socket.io)
- `/ejemplos/landing-page` - Landing page moderna
- `/ejemplos/task-app` - Gestión de tareas con drag & drop
- `/ejemplos/analytics-dashboard` - Dashboard de analytics
- `/ejemplos/ui-temas` - Cambio de tema
- `/ejemplos/formularios` - Formularios avanzados
- `/ejemplos/notificaciones` - Notificaciones toast
- `/ejemplos/animaciones` - Animaciones (Framer Motion)
- `/ejemplos/database` - Integración de base de datos
- `/blog` - Sistema de blog MDX

---

## 🗂️ Estructura del proyecto

```
mi-proyecto/
├── components/       # Componentes reutilizables
│   ├── ai/           # Componentes IA
│   ├── auth/         # Autenticación
│   ├── ui/           # Biblioteca UI
│   ├── upload/       # Upload de archivos/imágenes
│   ├── performance/  # Herramientas de performance
│   ├── providers/    # Contextos
│   └── theme-provider.tsx
├── lib/              # Utilidades, i18n, db, roles, mobile
├── pages/            # Páginas Next.js
│   ├── api/          # Rutas API
│   ├── blog/         # Blog
│   └── ejemplos/     # Ejemplos
├── prisma/           # Esquema y seeders de base de datos
├── public/           # Activos estáticos
├── styles/           # CSS (global, mobile)
├── locales/          # Traducciones i18n
├── posts/            # Posts MDX
├── README.md         # Documentación principal
└── ...
```

---

## ⚙️ Variables de entorno

Copia `.env.example` a `.env.local` y completa tus valores:

```env
# Base de datos
DATABASE_URL=tu_postgresql_connection_string
MONGODB_URI=tu_mongodb_connection_string

# Autenticación
NEXTAUTH_SECRET=tu_secreto
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
GITHUB_ID=tu_github_id
GITHUB_SECRET=tu_github_secret

# Proveedores IA
OPENAI_API_KEY=tu_openai_key
ANTHROPIC_API_KEY=tu_anthropic_key
GOOGLE_API_KEY=tu_google_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 🛠️ Herramientas para desarrolladores

- **TypeScript**: tipado en todo el proyecto
- **ESLint**: calidad de código
- **Prettier**: formateo
- **Prisma Studio**: UI de administración de DB
- **React Hot Toast**: notificaciones
- **Framer Motion**: animaciones
- **Zustand**: manejo de estado
- **Socket.io**: chat en tiempo real
- **Chart.js, D3.js, recharts**: analytics
- **Testing ready**: estructura para tests unitarios/integración/e2e

---

## 📚 Documentación

- [DOCUMENTACION.md](DOCUMENTACION.md)
- [README-ECOMMERCE.md](README-ECOMMERCE.md)
- [README-SAAS.md](README-SAAS.md)
- [README-CHAT.md](README-CHAT.md)
- [README-CHATBOT.md](README-CHATBOT.md)
- [README-VIDEOS.md](README-VIDEOS.md)
- [CHANGELOG-PHASES.md](CHANGELOG-PHASES.md) (Roadmap)

---

## 🚦 Roadmap (2024-2025)

### Expansiones planeadas
- CRM (gestión de clientes, pipeline, notas)
- LMS (cursos, lecciones, quizzes, progreso)
- Sistema de tickets/soporte (incidencias, comentarios, asignación)
- Notificaciones push (web push, service worker)
- Integraciones externas (webhooks, Slack, Zapier)
- Mejoras de accesibilidad (navegación teclado, roles ARIA, contraste)
- Expansión de tests (unitarios, integración, e2e)
- Onboarding interactivo (tours guiados)
- Favoritos/ratings (productos, cursos, proyectos)
- Documentación visual (diagramas, videos, tutoriales)
- Mejoras de performance (caching, CDN, lazy loading avanzado)

### Lo que NO está incluido (aún)
- Blockchain/NFTs/Web3 (no implementado)
- App mobile (solo web, optimizado mobile)
- Microservicios (monolítico Next.js)
- ERP/IoT (sugerido, no implementado)

---

## 📝 Licencia

MIT

---

**Hecho con ❤️ por el equipo sysrot** 