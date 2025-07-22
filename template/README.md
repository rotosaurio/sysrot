# 🚀 sysrot-hub

**Next-generation CLI for creating advanced Next.js 14+ projects with multi-AI, SaaS, e-commerce, chat, analytics, and more.**

[![npm version](https://badge.fury.io/js/sysrot-hub.svg)](https://badge.fury.io/js/sysrot-hub)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)

---

## 🎯 What is sysrot-hub?

**sysrot-hub** is a CLI tool that scaffolds production-ready Next.js 14+ projects with a complete, enterprise-grade ecosystem. It provides not just a project starter, but a full suite of real-world, integrated business systems, modern UI/UX, multi-language support, and advanced developer tooling.

---

## 📦 Installation

```bash
npm install -g sysrot-hub
# or use npx
yarn create sysrot-hub my-project
npx sysrot-hub my-project
```

---

## 🌐 Repository & Documentation

- **GitHub repository:** [https://github.com/rotosaurio/sysrot](https://github.com/rotosaurio/sysrot)
- **Documentation (English):** [DOCUMENTACION.md](DOCUMENTACION.md)
- **Read this README in Spanish:** [README.es.md](README.es.md)
- **Other documentation:**
  - [README-ECOMMERCE.md](README-ECOMMERCE.md) — E-commerce system
  - [README-SAAS.md](README-SAAS.md) — SaaS multi-tenant
  - [README-CHAT.md](README-CHAT.md) — Real-time chat
  - [README-CHATBOT.md](README-CHATBOT.md) — AI chatbots
  - [README-VIDEOS.md](README-VIDEOS.md) — Video streaming
  - [CHANGELOG-PHASES.md](CHANGELOG-PHASES.md) — Roadmap & phases

---

## ✨ Key Features

- **Next.js 14+** with Pages Router, SSR/SSG, API routes
- **TypeScript** throughout the codebase
- **TailwindCSS** with dark/light mode and custom themes
- **Component library**: layouts, tables, forms, cards, toggles, loaders, badges, etc.
- **Form validation**: React Hook Form + Zod
- **Notifications**: react-hot-toast
- **Internationalization (i18n)**: React Intl, ES/EN, language switcher
- **Authentication**: NextAuth.js (Google, GitHub, email, Discord, Twitter, credentials)
- **Role-based access**: admin/user, route protection middleware
- **REST APIs**: for all business systems
- **Stripe integration**: payments, webhooks, billing
- **Cloudinary integration**: image/video uploads
- **AI integration**: OpenAI, Anthropic, Google, DeepSeek (multi-model, selectable)
- **Prisma**: for e-commerce, SaaS, chat, projects, video, courses, healthcare, etc.
- **MongoDB**: ready-to-use utilities
- **Zustand**: global state management (e.g. shopping cart)
- **Framer Motion**: animations and micro-interactions
- **Mobile optimization**: breakpoints, touch gestures, PWA
- **Complete documentation**: in English and Spanish
- **Ready for Vercel and Docker deployment**

---

## 🏢 Included Business Systems (Full Integration Examples)

| System         | Status   | Models | APIs | Users | Docs |
|----------------|----------|--------|------|-------|------|
| 🛍️ E-commerce  | ✅ Ready | 15+    | 8+   | 25+   | [README-ECOMMERCE.md](README-ECOMMERCE.md) |
| 🏢 SaaS        | ✅ Ready | 8      | 6+   | 12+   | [README-SAAS.md](README-SAAS.md) |
| 💬 Chat        | ✅ Ready | 8      | 5+   | 15+   | [README-CHAT.md](README-CHAT.md) |
| 🤖 Chatbots    | ✅ Ready | 8      | 4+   | 8+    | [README-CHATBOT.md](README-CHATBOT.md) |
| 📋 Projects    | ✅ Ready | 16     | 2+   | 6+    | [README-PROJECTS.md](README-PROJECTS.md) |
| 📺 Video       | ✅ Ready | 15     | 2+   | 8+    | [README-VIDEOS.md](README-VIDEOS.md) |
| 🏪 Marketplace | ✅ Ready | 10+    | 3+   | 10+   | (see docs) |
| 👨‍💼 Portfolio  | ✅ Ready | 5+     | 1+   | 1+    | (see docs) |
| 🚀 Landing Page| ✅ Ready | -      | -    | -     | (see docs) |
| 📊 Analytics   | ✅ Ready | -      | -    | -     | (see docs) |
| 📝 Task App    | ✅ Ready | 5+     | 1+   | 1+    | (see docs) |

**Total: 70+ database models, 35+ REST APIs, 74+ test users**

---

## 🧩 Example Pages & Features

- `/ejemplos/auth` - Authentication flows
- `/ejemplos/ai` - Multi-model AI chat
- `/ejemplos/upload` - Image upload (Cloudinary)
- `/ejemplos/ecommerce` - E-commerce demo
- `/ejemplos/marketplace` - Marketplace platform
- `/ejemplos/portfolio` - Personal portfolio
- `/ejemplos/saas` - SaaS multi-tenant
- `/ejemplos/chat` - Real-time chat (Socket.io)
- `/ejemplos/landing-page` - Modern landing page
- `/ejemplos/task-app` - Task management with drag & drop
- `/ejemplos/analytics-dashboard` - Analytics dashboard
- `/ejemplos/ui-temas` - Theme switching
- `/ejemplos/formularios` - Advanced forms
- `/ejemplos/notificaciones` - Toast notifications
- `/ejemplos/animaciones` - Animations (Framer Motion)
- `/ejemplos/database` - Database integration
- `/blog` - MDX blog system

---

## 🗂️ Project Structure

```
my-project/
├── components/       # Reusable UI components
│   ├── ai/           # AI components
│   ├── auth/         # Authentication
│   ├── ui/           # UI library
│   ├── upload/       # File/image upload
│   ├── performance/  # Performance tools
│   ├── providers/    # Context providers
│   └── theme-provider.tsx
├── lib/              # Utilities, i18n, db, roles, mobile
├── pages/            # Next.js pages
│   ├── api/          # API routes
│   ├── blog/         # Blog pages
│   └── ejemplos/     # Example pages
├── prisma/           # Database schema & seeders
├── public/           # Static assets
├── styles/           # CSS (globals, mobile)
├── locales/          # i18n translations
├── posts/            # MDX blog posts
├── README.md         # Main documentation
└── ...
```

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```env
# Database
DATABASE_URL=your_postgresql_connection_string
MONGODB_URI=your_mongodb_connection_string

# Authentication
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_ID=your_github_id
GITHUB_SECRET=your_github_secret

# AI Providers
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
GOOGLE_API_KEY=your_google_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 🛠️ Developer Tooling

- **TypeScript**: type safety everywhere
- **ESLint**: code quality
- **Prettier**: code formatting
- **Prisma Studio**: DB admin UI
- **React Hot Toast**: notifications
- **Framer Motion**: animations
- **Zustand**: state management
- **Socket.io**: real-time chat
- **Chart.js, D3.js, recharts**: analytics
- **Testing ready**: structure for unit/integration/e2e tests

---

## 📚 Documentation & Resources

- [DOCUMENTACION.md](DOCUMENTACION.md) — Full documentation (Spanish)
- [README.es.md](README.es.md) — Este README en español
- [README-ECOMMERCE.md](README-ECOMMERCE.md) — E-commerce system
- [README-SAAS.md](README-SAAS.md) — SaaS multi-tenant
- [README-CHAT.md](README-CHAT.md) — Real-time chat
- [README-CHATBOT.md](README-CHATBOT.md) — AI chatbots
- [README-VIDEOS.md](README-VIDEOS.md) — Video streaming
- [CHANGELOG-PHASES.md](CHANGELOG-PHASES.md) — Roadmap & phases

---

## 🚦 Roadmap (2024-2025)

### Planned Expansions
- CRM (customer management, pipeline, notes)
- LMS (courses, lessons, quizzes, progress)
- Ticket/support system (incidents, comments, assignment)
- Push notifications (web push, service worker)
- External integrations (webhooks, Slack, Zapier)
- Accessibility improvements (keyboard nav, ARIA roles, contrast)
- Expanded testing (unit, integration, e2e)
- Interactive onboarding (guided tours)
- Favorites/ratings (products, courses, projects)
- Visual documentation (diagrams, videos, tutorials)
- Performance improvements (caching, CDN, advanced lazy loading)

### What is NOT included (yet)
- Blockchain/NFTs/Web3 (not implemented)
- Mobile app (web only, mobile optimized)
- Microservices (monolithic Next.js)
- ERP/IoT (suggested, not implemented)

---

## 📝 License

MIT

---

**Made with ❤️ by the sysrot team** 