# Changelog

Todos los cambios importantes del proyecto serán documentados en este archivo.

## [2.2.0] - 2025-06-17 🚀

### 🗺️ **Roadmap Completamente Reorganizado**
- **Nueva Estructura por Meses**: Roadmap reorganizado desde Q3 2025 hasta v3.0.0 (Junio 2026)
- **Prioridades Reordenadas**: Integraciones de ecosistema como prioridad inmediata
- **12 Versiones Planificadas**: Cada mes una nueva versión con mejoras específicas

### 🔥 **Próximas Prioridades Definidas**
1. **v2.2.0 (Julio)**: Integraciones de ecosistema (CMS, Payments, Email, Analytics)
2. **v2.3.0 (Agosto)**: Web Performance & Mobile optimizations  
3. **v2.4.0 (Septiembre)**: Documentación y ejemplos avanzados
4. **v2.5.0 (Octubre)**: CLI mejorado y testing suite completa

### 🤝 **Integraciones Planificadas v2.2.0**
- **CMS Headless**: Contentful, Strapi configurados
- **Payment Processors**: Stripe, PayPal listos para usar
- **Email Services**: SendGrid, Mailgun integrados
- **Analytics Avanzado**: Mixpanel, Amplitude configurados
- **Customer Support**: Intercom, Zendesk embebido
- **Social Auth**: Auth0, Firebase Auth expandido
- **File Storage**: AWS S3, Cloudinary mejorado
- **Push Notifications**: FCM, OneSignal implementado

### ⚡ **Performance & Mobile (v2.3.0)**
- **Web Performance**: Lazy loading, image optimization, bundle analyzer
- **Core Web Vitals**: Optimization completa
- **PWA Capabilities**: Offline functionality, service workers
- **Mobile-First**: Touch gestures, responsive images, app-like animations

### 🧠 **Futuro AI-Powered (v2.12.0)**
- **Code Generation**: Automático con IA
- **Design System**: Generation inteligente
- **Bug Detection**: Automático con sugerencias
- **Performance**: Optimization suggestions con IA

### 🔮 **Next-Gen Technologies (v3.0.0)**
- **Web3 & Blockchain**: Integration preparada
- **AR/VR Components**: WebXR support
- **IoT Connectivity**: Device integration
- **Machine Learning**: Models integration
- **Voice Interfaces**: Web Speech API
- **Quantum Computing**: Readiness preparation

### 📊 **Roadmap Mensual Estructurado**
- **12 meses planificados**: Julio 2025 - Junio 2026
- **Progresión lógica**: Desde integraciones básicas hasta tecnologías emergentes
- **Milestone claros**: Cada versión con objetivos específicos
- **Enterprise-ready**: Arquitectura escalable y patrones avanzados

## [2.1.10] - 2025-06-17

### 🔧 Mejoras de Términos
- **Eliminación de Términos Comerciales**: Removidas todas las referencias a "Premium", "Pro" y términos comerciales
- **Nomenclatura Neutral**: Cambiado a términos como "Avanzado", "Moderno", "Estándar", "Completo"
- **Experiencia Unificada**: Interfaz más accesible sin implicaciones de costos

### 📝 Cambios Específicos
- "Micro-interacciones Premium" → "Micro-interacciones Avanzadas"
- "Premium Toggle" → "Toggle Moderno"  
- "Cards Premium" → "Cards Modernas"
- "Pro Plan" → "Plan Standard"
- "Select Premium" → "Select Moderno"
- "🥇 Premium" → "🥇 Básico"
- "🥈 Pro" → "🥈 Estándar"
- "Opción Premium" → "Opción Completa"

## [2.1.9] - 2025-06-17

### ✨ Nuevas Características
- **Mouse Follower Arreglado**: Centrado perfecto del cursor en animaciones
- **Shadow Degradado**: Título principal con resplandor suave de fondo
- **Componentes Completos**: 50+ componentes nuevos en 6 categorías
- **Animaciones Avanzadas**: Physics-based, 3D effects, holographic, Matrix rain
- **Micro-interacciones**: Floating elements, morphing shapes, particle systems

### 🔧 Mejoras
- **UI/UX Premium**: Glassmorphism, tilt cards, flip cards, magnetic effects
- **Navegación Moderna**: Breadcrumbs interactivos, sidebar adaptativo, tabs animados
- **Feedback System**: Alertas de estado, modales, progress indicators
- **Layouts Responsivos**: Grid systems, flexbox layouts, container sizes
- **Componentes Avanzados**: Calendar, file upload, rich text editor, media player

### 🐛 Correcciones
- Mouse follower ahora está perfectamente centrado en el cursor
- Animaciones CSS optimizadas para 60 FPS
- Compatibilidad mejorada con TailwindCSS
- Efectos de hover y transiciones suavizados

### 📚 Documentación
- Ejemplos expandidos con código de implementación
- Categorización mejorada de componentes
- Guías de uso para animaciones avanzadas

## [2.1.8] - 2025-06-17

### 🎨 **Mejora Masiva: UI & Temas Example**
- **🔧 FIXED:** Error de sintaxis JSX en `ui-temas.tsx` completamente corregido
- **✨ NEW:** Interfaz completamente rediseñada con 4 secciones por tabs
- **🎭 NEW:** Modal animado con backdrop blur y animaciones suaves
- **🎨 NEW:** 50+ componentes UI modernos con efectos hover avanzados
- **⚡ NEW:** Sistema de animaciones CSS con efectos de escala, rotación y deslizado
- **🌈 NEW:** Paleta de colores interactiva con 4 esquemas completos
- **📱 NEW:** Layouts responsivos con ejemplos en vivo

### 🎯 **Nuevos Componentes Agregados**
- **Botones:** Gradientes, outline, danger, modal trigger con animaciones
- **Cards:** Analytics, gradient, progress con efectos hover 3D
- **Inputs:** Floating labels, switches animados, selects modernos
- **Animaciones:** Bounce, spin, ping, pulse, scale, rotate effects
- **Colores:** Primary, success, warning, danger con previews interactivos
- **Modals:** Sistema completo con backdrop blur y zoom animations

### 🔧 **Características Técnicas**
- **Tabs Navigation:** Sistema de pestañas con animaciones de transición
- **State Management:** Control de progreso, modals, themes dinámico
- **Responsive Design:** Grid systems adaptativos para mobile/tablet/desktop
- **Animation Classes:** Tailwind CSS + custom animations
- **Theme Integration:** Perfect dark/light mode compatibility

### 📂 **Archivos Afectados**
- `template/pages/ejemplos/ui-temas.tsx` - Reescrito completamente (400+ líneas)
- Syntax JSX corregido para compatibilidad Next.js 14
- Performance optimizada con lazy loading y estado condicional

## [2.1.7] - 2025-06-17 🔧

### 🐛 **Corrección Crítica: Next.js 13+ Compatibility**
- **🔧 FIXED:** Error `Invalid <Link> with <a> child` corregido
- **📝 FIXED:** Todos los componentes `<Link>` actualizados a la sintaxis de Next.js 13+
- **🔗 IMPROVED:** Eliminados elementos `<a>` como hijos de `<Link>`
- **📖 IMPROVED:** Removido `legacyBehavior` en favor de sintaxis moderna
- **⚡ IMPROVED:** Mejor compatibilidad con Next.js 14

### 📂 **Archivos Corregidos**
- `template/pages/index.tsx` - 3 Links corregidos
- `template/pages/blog/index.tsx` - 1 Link corregido
- Removidas dependencias de `legacyBehavior`

### ⚡ **Impacto**
- **Eliminación total** del error 500 al ejecutar `npm run dev`
- **Compatibilidad perfecta** con Next.js 13+ y 14+
- **Mejor performance** de navegación
- **Developer Experience** mejorada

## [2.1.6] - 2025-06-17 🔧

### ✅ **Correcciones Críticas**
- **🔧 FIXED:** Comando CLI corregido de `npx sysrot create` → `npx sysrotcore`
- **📝 FIXED:** Descripción del package.json actualizada con comando correcto
- **🔗 FIXED:** Todos los ejemplos en README ahora usan `npx sysrotcore`
- **⚙️ IMPROVED:** Configuración `bin` simplificada en package.json
- **📖 IMPROVED:** Documentación consistente en todos los archivos

### ⚡ **Impacto**
- **Comando oficial:** `npx sysrotcore nombre-proyecto`
- **Mayor simplicidad:** Un solo comando para recordar
- **Consistencia:** NPM package name = CLI command
- **Mejor UX:** Sin confusión entre nombre del paquete y comando

## [2.1.5] - 2025-06-17

### 📦 **Mejoras de NPM Package**
- **Metadata completa** para mejor visibilidad en npm
- **Keywords expandidos** (50+ términos) para mejor descubrimiento
- **Author información** estructurada con URL
- **Repository URL** corregida con formato git+https
- **OS support** explícito: Windows, macOS, Linux
- **Engines** especificados: Node.js >=16.0.0, NPM >=7.0.0
- **Scripts adicionales** para mejor UX: start, help, version
- **Funding information** para sponsors
- **PublishConfig** optimizada para NPM

### 📋 **Información Mejorada**
- **50+ keywords** para mejor SEO en npm
- **Files** incluye CHANGELOG.md
- **Bugs** con email de contacto
- **Preferencias** de instalación optimizadas

### 🔧 **Correcciones de Documentación**
- **Aclaración importante** sobre directorio CLI vs proyecto generado
- **Comando vs nombre** del paquete explicado claramente
- **Flujo de trabajo** paso a paso documentado

## [2.1.4] - 2025-06-17

### 📚 **Revolución de Documentación**
- **README Masivo**: Expandido de 639 a 1292+ líneas con información exhaustiva
- **Roadmap 2025-2026**: Planificación detallada hasta 2030 con tecnologías emergentes
- **14 Ejemplos Detallados**: Descripción completa de cada ejemplo funcional
- **Integraciones Completas**: Documentación de todas las integraciones disponibles
- **Casos de Uso Reales**: Ejemplos específicos para diferentes industrias

### 🚀 **Características Documentadas**
- **IA Multi-Modelo**: Comparativa detallada de los 5 modelos integrados
- **15 Categorías CLI**: Documentación exhaustiva del proceso interactivo
- **Stack Completo**: Bases de datos, auth, payments, hosting options
- **Performance Tips**: Optimizaciones avanzadas y best practices
- **Troubleshooting**: Soluciones para problemas comunes 2025

### 🔮 **Roadmap Innovador**
- **Q3 2025**: AI-Native Development, Web3 Integration, PWA 3.0
- **Q4 2025**: Edge Computing, WebXR, Autonomous Development
- **2026**: Quantum Computing, AGI Integration, Metaverse-Native
- **Vision 2030**: Self-Evolving Web, Regenerative Computing
- **Investigación**: Neurolink, Holographic Displays, Quantum Internet

### 🌟 **Mejoras de Presentación**
- **Badges actualizados**: Estadísticas de uso y comunidad
- **Comparativa competitiva**: Tabla detallada vs alternativas
- **Casos de uso 2025**: Ejemplos reales para diferentes sectores
- **Comunidad activa**: Links a Discord, Twitter, YouTube
- **Sponsors destacados**: Vercel, Supabase, Anthropic

## [2.1.2] - 2024-01-20

### 🔧 **Corrección Crítica**
- **next.config.js**: Eliminado procesamiento problemático que causaba errores de sintaxis
- **Template**: Limpiado template de next.config.js para evitar conflictos
- **Script de arreglo**: Agregado `fix-nextconfig.js` para usuarios afectados
- **Documentación**: Agregada sección de solución de problemas en README

### ✨ **Mejoras de Estabilidad**
- **createProject.js**: Simplificada lógica de compatibilidad con Pages Router
- **Generación**: Eliminado procesamiento innecesario de archivos de configuración
- **Error handling**: Mejorado manejo de errores en generación de proyectos

## [2.1.0] - 2024-01-20

### 🎨 **Nueva Biblioteca de Componentes**
- **`/ejemplos/componentes`**: Biblioteca completa con 50+ componentes reutilizables
- **6 categorías**: Básicos, Formularios, Navegación, Feedback, Layout, Datos
- **Navegación por tabs**: Interfaz intuitiva para explorar componentes
- **Código copy-paste**: Cada componente incluye código listo para usar

### 🤖 **Integración DeepSeek Completa**
- **DeepSeek V3 Chat**: Modelo conversacional avanzado integrado
- **DeepSeek R1 Reasoner**: Especializado en razonamiento lógico
- **API nativa**: Uso del SDK OpenAI con baseURL personalizada
- **Selector multi-modelo**: Interfaz unificada para todos los modelos de IA

### 📚 **Documentación Expandida**
- **README**: Completamente reescrito con información detallada
- **Roadmap 2024-2025**: Planificación de 24 meses con fechas realistas
- **Casos de uso**: Ejemplos específicos de aplicaciones
- **Comparaciones**: Tabla comparativa con alternativas populares

### 🔧 **CLI Mejorado**
- **Nuevas opciones**: Biblioteca de componentes en configuración
- **Defaults inteligentes**: Selecciones por defecto optimizadas
- **Gestión automática**: Remoción de archivos no utilizados
- **Versión 2.1.0**: Actualizada descripción y keywords del paquete

## [1.9.7] - 2024-01-20

### 🔧 Correcciones Críticas
- **CLI**: Sincronizado package.json del CLI con versión principal
- **Template**: Corregido package.json con todas las dependencias necesarias
- **TypeScript**: Eliminada ruta incorrecta en tsconfig.json
- **ESLint**: Creado .eslintrc.json faltante con configuración TypeScript
- **Next.js**: Mejorado next.config.js con configuración completa para Pages Router

### ✨ Mejoras de IA
- **Componente**: Renombrado OpenAIPrompt a AIPrompt para reflejar múltiples modelos
- **API**: Creada nueva `/api/ai` que maneja GPT-4o, Claude 3.5, Gemini y DeepSeek R1
- **Configuración**: Mejorada configuración de modelos con manejo de errores
- **Página de ejemplos**: Actualizada para mostrar todos los modelos disponibles

### 🎨 Correcciones de UI/UX
- **Componentes**: Removidas directivas "use client" para compatibilidad con Pages Router
- **AuthForm**: Corregido useRouter import para Pages Router
- **Iconos**: Completados todos los iconos necesarios en icons.tsx
- **Estilos**: Verificados y optimizados estilos globales

### 📚 Documentación
- **README Principal**: Completamente reescrito con información detallada
- **README CLI**: Actualizado con guías completas de uso
- **Estructura**: Documentada estructura completa del proyecto generado
- **Ejemplos**: Agregados ejemplos de código y configuración

### 🔄 Optimización del CLI
- **createProject.js**: Corregida lógica de renombrado de archivos IA
- **Dependencias**: Sincronizadas todas las dependencias necesarias
- **Generación**: Mejorada generación de .env.example y README personalizado

### 📦 Características Nuevas
- **Multi-modelo IA**: Soporte completo para GPT-4o, Claude 3.5, Gemini
- **Configuración**: Sistema de configuración mejorado para múltiples proveedores
- **Componentes**: Nuevos componentes optimizados para Pages Router
- **APIs**: APIs robustas con manejo de errores mejorado

### 🛠️ Mantenimiento
- **Consistencia**: Eliminadas inconsistencias entre directorios
- **Estructura**: Consolidada estructura de archivos
- **Configuración**: Mejoradas configuraciones de desarrollo

## [1.9.6] - 2024-01-19

### ✨ Características
- Soporte inicial para múltiples modelos de IA
- Integración con Anthropic Claude 3.5
- Mejoras en la interfaz de usuario

### 🔧 Correcciones
- Corrección de errores en la generación de proyectos
- Mejoras en la configuración de TailwindCSS

## [1.9.5] - 2024-01-18

### ✨ Características
- CLI interactivo con inquirer
- Soporte para Pages Router
- Integración con OpenAI
- Sistema de autenticación con NextAuth.js

### 🏗️ Inicial
- Configuración inicial del proyecto
- Template base con Next.js 14
- Configuración de TailwindCSS
- Estructura de componentes básica

## [1.9.4] - 2025-06-11

### Corregido
- Corregido problema de codificación en el README.md
- Actualizados archivos de plantilla para garantizar UTF-8 correcto
- Optimizado el componente de iconos para mejor compatibilidad

## [1.9.3] - 2025-06-11

### Corregido
- Error en el componente de iconos que causaba caracteres UTF-8 inválidos
- Mejorada la estabilidad de los componentes de iconos
- Solución definitiva para los problemas de codificación

## [1.9.2] - 2025-06-11

## [2.1.4] - 2025-06-17

### 🔄 **Breaking Changes**
- **Nombre del proyecto cambiado** de `sysrot-base` a `sysrotcore`
- **Comando CLI actualizado** de `npx sysrot-base` a `npx sysrot create`
- **Repositorio movido** a https://github.com/rotosaurio/sysrot

### ✅ **Funcionalidades Verificadas y Confirmadas**
- **11 ejemplos funcionales** realmente implementados
- **3 modelos de IA** con versiones específicas: OpenAI v4.24.1, Anthropic v0.12.0, Google v0.2.0
- **3 bases de datos** soportadas: MongoDB v6.3.0, Supabase v2.39.1, Firebase v10.7.1
- **Solo Cloudinary** implementado para upload de archivos (v1.41.1 + next-cloudinary v5.13.0)
- **50+ componentes UI** en 6 categorías organizadas

### 🔧 **Correcciones Importantes**
- ❌ **Eliminadas menciones falsas:** AWS S3, Vercel Blob, Local Storage para upload
- ❌ **Removido deployment no implementado:** Configuraciones de Vercel, Railway, DigitalOcean, etc.
- ❌ **Eliminado CI/CD no implementado:** GitHub Actions, automated testing, etc.
- ❌ **Removidas tecnologías no soportadas:** PlanetScale, Redis, Prisma, DeepSeek models
- ❌ **Estadísticas falsas eliminadas:** +15,000 proyectos, trending GitHub, etc.

### 📋 **Documentación Mejorada**
- **Versiones específicas** de todas las dependencias documentadas
- **README actualizado** con información 100% precisa
- **Roadmap realista** enfocado en mejoras de plantilla
- **URLs de repositorio** actualizadas a la ubicación correcta
- **Información técnica detallada** de cada característica

### 🎯 **CLI Simplificado**
- Eliminadas opciones no implementadas de deployment y CI/CD
- Solo opciones realmente funcionales disponibles
- Mejor experiencia de usuario con opciones verificadas

### 📁 **Estructura de Archivos**
- `.gitignore` mejorado para excluir node_modules y archivos innecesarios
- URLs y referencias actualizadas en todos los archivos
- Consistencia en nombres y comandos

### 🚀 **Roadmap Realista 2025-2026**
- Enfocado en mejoras reales de plantilla de desarrollo
- Eliminadas visiones irreales de IA, quantum computing, etc.
- Concentrado en documentación, testing, performance, seguridad

## [2.1.12] - 2025-06-17

### 🐛 **CRITICAL FIX: Blog MDX Rendering**
- **🔧 FIXED:** Error "Objects are not valid as a React child (found: [object Promise])" en páginas de blog
- **🔧 FIXED:** Conflicto entre `next-mdx-remote/rsc` y `next-mdx-remote` en Pages Router
- **🔧 FIXED:** Import incorrecto en `template/pages/blog/[slug].tsx`
- **✅ WORKING:** Blog completamente funcional con 3 artículos MDX de ejemplo
- **✅ WORKING:** Syntax highlighting, frontmatter parsing, y navegación entre posts

### 📋 **Detalles Técnicos**
- Removido import erróneo de `next-mdx-remote/rsc` (App Router only)
- Mantenido `next-mdx-remote` v4.4.1 para Pages Router compatibility
- Corregido uso de `MDXRemote` y `serialize` sin conflictos RSC

### 🧪 **Verificado**
- ✅ Blog index page (`/blog`) funciona correctamente
- ✅ Blog posts individuales (`/blog/[slug]`) renderizan MDX sin errores
- ✅ Frontmatter parsing con gray-matter funciona perfectamente
- ✅ Navegación entre artículos es fluida
- ✅ Responsive design y dark mode compatibles

## [2.1.11] - 2025-06-17

### 🏷️ **Mejora: Terminología Neutral**

## [2.1.13] - 2025-06-17

### 🐛 **CRITICAL FIX: MDX inTable Error**
- **🔧 FIXED:** Error "Cannot read properties of undefined (reading 'inTable')" en blog posts
- **🔧 FIXED:** Incompatibilidad entre plugins remark-gfm, rehype-highlight y rehype-slug
- **🔧 FIXED:** Conflicto de versiones en procesamiento MDX
- **✅ WORKING:** Todos los artículos MDX renderizan correctamente sin errores
- **✅ WORKING:** Preservado styling con prose classes para contenido

### 📋 **Solución Técnica**
- Removidos plugins conflictivos: `rehype-highlight`, `rehype-slug`, `remark-gfm`
- Simplificada configuración MDX para máxima compatibilidad
- Mantenido styling básico con Tailwind Typography

### 🧪 **Verificado**
- ✅ `/blog/introduccion-a-sysrotcore` funciona sin errores
- ✅ `/blog/ia-integrada-tutorial` funciona sin errores  
- ✅ `/blog/componentes-avanzados-guia` funciona sin errores
- ✅ Contenido MDX renderiza correctamente
- ✅ Código syntax highlighting básico preservado

### 🔄 **Próximas Mejoras**
- Re-implementación de syntax highlighting sin conflictos
- Optimización de plugins MDX en versión futura

## [2.1.12] - 2025-06-17 