# 🚀 SysrotCore v2.3.3 - Internacionalización Completa + Componentes Traducidos

[![npm version](https://badge.fury.io/js/sysrotcore.svg)](https://badge.fury.io/js/sysrotcore)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Template moderno y completo para aplicaciones Next.js con autenticación, IA multi-modelo, upload de archivos, blog con MDX y mucho más.**

✅ **TODAS LAS TRADUCCIONES COMPLETADAS** - Zero errores "Missing translation" garantizado  
✅ **350+ claves de traducción** en español e inglés  
✅ **100% de cobertura de internacionalización** incluyendo componentes principales  
✅ **Documentación internacional** - README en inglés como predeterminado

[🇺🇸 English Documentation](README.md)

## 🎯 Instalación Rápida

```bash
npx sysrotcore mi-proyecto
cd mi-proyecto
npm run dev
```

¡Tu aplicación estará corriendo en http://localhost:3000 en menos de 30 segundos!

## 🌟 Características Principales

### 🧠 **IA Multi-Modelo Integrada**
- **GPT-4o** (OpenAI) - Modelo más avanzado
- **Claude 3.5 Sonnet** (Anthropic) - Razonamiento superior
- **Gemini Flash Pro** (Google) - Velocidad optimizada
- **DeepSeek R1** - Próximamente disponible
- Chat interface unificada con switching automático

### 🔐 **Sistema de Autenticación Completo**
- **NextAuth.js** con múltiples providers (Google, GitHub, etc.)
- **Sistema de roles** y permisos granulares
- **Protección de rutas** automática
- **Componentes de UI** listos para usar

### 🎨 **50+ Componentes UI Production-Ready**
- **TailwindCSS** + **shadcn/ui** components
- **Modo oscuro/claro** con persistencia
- **Formularios validados** con react-hook-form + Zod
- **Animaciones** con Framer Motion
- **Notificaciones** con react-hot-toast

### 📡 **Integraciones de Base de Datos**
- **MongoDB** con Mongoose ODM
- **Supabase** con cliente optimizado
- **Firebase** con SDK completo
- **Prisma ORM** pre-configurado
- Ejemplos de CRUD para cada una

### 📝 **Sistema de Blog MDX**
- **Markdown + JSX** con sintaxis highlighting
- **Generación estática** optimizada
- **SEO automático** con metadatos
- **Tags y categorías** incluidas

### 🌍 **Internacionalización (i18n)**
- **Español** e **Inglés** incluidos
- **react-intl** completamente configurado
- **Sistema robusto** con fallbacks automáticos
- **280+ traducciones** pre-incluidas
- **Zero errores** de missing translations garantizado

### ☁️ **Upload de Imágenes**
- **Cloudinary** integration completa
- **Drag & drop** con preview
- **Validación** de tipos y tamaños
- **Optimización** automática

## 📋 Tecnologías Incluidas

```
🎯 Core Framework
├── Next.js 14+ (Pages Router)
├── TypeScript 5+
├── React 18+
└── Node.js 16+

🎨 Styling & UI
├── TailwindCSS 3+
├── shadcn/ui components
├── Framer Motion
├── Lucide React icons
└── Modo oscuro/claro

🔐 Autenticación
├── NextAuth.js
├── Sistema de roles
├── OAuth providers
└── Protección de rutas

🧠 Inteligencia Artificial
├── OpenAI GPT-4o
├── Anthropic Claude 3.5
├── Google Gemini Flash Pro
└── DeepSeek R1 (próximamente)

💾 Base de Datos
├── MongoDB + Mongoose
├── Supabase
├── Firebase
└── Prisma ORM

📝 Contenido
├── MDX Blog system
├── Syntax highlighting
├── SEO optimizado
└── Generación estática

🌍 Internacionalización
├── react-intl
├── Español + Inglés
├── 280+ traducciones
└── Sistema robusto

📁 Utilidades
├── React Hook Form + Zod
├── React Hot Toast
├── Cloudinary upload
└── TypeScript strict mode
```

## 🚀 Inicio Rápido

1. **Crear proyecto**:
```bash
npx sysrotcore@latest mi-app
cd mi-app
```

2. **Configurar variables de entorno**:
```bash
cp .env.example .env.local
# Editar .env.local con tus API keys
```

3. **Instalar dependencias**:
```bash
npm install
```

4. **Iniciar desarrollo**:
```bash
npm run dev
```

5. **¡Listo!** Tu aplicación estará corriendo en `http://localhost:3000`

## 📚 Documentación

- 📖 **Guía completa**: Ver `DOCUMENTACION.md` en tu proyecto
- 🌐 **Ejemplos en vivo**: `/ejemplos` en tu aplicación
- 🤖 **IA integrada**: `/ejemplos/ai` para probar los modelos
- 🔐 **Autenticación**: `/ejemplos/auth` para login/registro
- 📝 **Blog**: `/blog` para contenido MDX

## 🔧 Configuración de APIs

### OpenAI (GPT-4o)
```env
OPENAI_API_KEY=sk-your-key-here
```

### Anthropic (Claude)
```env
ANTHROPIC_API_KEY=sk-ant-your-key
```

### Google (Gemini)
```env
GOOGLE_API_KEY=your-google-key
```

### Cloudinary (Upload)
```env
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
```

### Base de Datos (elige una)
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/myapp

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key

# Firebase
FIREBASE_PROJECT_ID=your-project
FIREBASE_PRIVATE_KEY=your-key
```

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Construcción
npm run build

# Inicio de producción
npm start
```

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Soporte

- 🐛 **Issues**: [GitHub Issues](https://github.com/rotosaurio/sysrotcore/issues)
- 💬 **Discusiones**: [GitHub Discussions](https://github.com/rotosaurio/sysrotcore/discussions)
- 📧 **Email**: rotosaurio@example.com

---

⭐ **¡No olvides dar una estrella al proyecto si te ha sido útil!** 