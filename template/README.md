# Next.js App Template

Este proyecto fue generado con [create-rotosaurio-app](https://github.com/yourusername/create-rotosaurio-app).

## 🚀 Características

- ✅ **Next.js 14+ con Pages Router** - Sistema de rutas basado en archivos
- ✅ **TypeScript** - Seguridad de tipos y mejor experiencia de desarrollo
- ✅ **TailwindCSS** - Utilidades CSS para estilizado rápido
- ✅ **Tema Claro/Oscuro** - Sistema completo de temas con next-themes
- ✅ **Componentes UI** - Biblioteca de componentes personalizables
- ✅ **Validación de Formularios** - React Hook Form con Zod
- ✅ **Notificaciones** - Sistema de toasts con react-hot-toast
- ✅ **Ejemplos** - Ejemplos completos y funcionales de todas las características

## 🛠️ Primeros pasos

### Instalación

Primero, instala las dependencias:

```bash
npm install
# o
yarn install
# o 
pnpm install
```

### Desarrollo

Ejecuta el servidor de desarrollo:

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver el resultado.

## 📚 Estructura del Proyecto

```
├── components/       # Componentes reutilizables
│   ├── ai/           # Componentes relacionados con IA
│   ├── auth/         # Componentes de autenticación
│   ├── ui/           # Componentes de interfaz de usuario
│   └── upload/       # Componentes de carga de archivos
├── lib/              # Funciones y utilidades
├── pages/            # Rutas y páginas de la aplicación
│   ├── api/          # Endpoints de API
│   ├── blog/         # Páginas del blog
│   └── ejemplos/     # Ejemplos de uso
├── public/           # Activos públicos
└── styles/           # Hojas de estilo CSS
```

## 📘 Documentación

Revisa el archivo `DOCUMENTACION.md` incluido en este proyecto para información detallada sobre cada característica y cómo utilizarla.

### Páginas de Ejemplo

- `/ejemplos/auth` - Ejemplo de autenticación
- `/ejemplos/ai` - Integración con OpenAI
- `/ejemplos/upload` - Carga de imágenes
- `/blog` - Sistema de blog con MDX

## 🔑 Variables de Entorno

1. Copia el archivo `.env.example` a `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Completa las variables necesarias según las características que hayas elegido:
   - Autenticación: NEXTAUTH_SECRET, GOOGLE_CLIENT_ID, etc.
   - OpenAI: OPENAI_API_KEY
   - Cloudinary: CLOUDINARY_CLOUD_NAME, etc.
   - Base de Datos: DATABASE_URL

## 🧩 Personalización

### Estilos

- Modifica `tailwind.config.js` para personalizar colores, fuentes, etc.
- Edita `styles/globals.css` para cambiar estilos globales y variables CSS

### Componentes

- Todos los componentes se encuentran en la carpeta `/components`
- Puedes editar, extender o reemplazar según tus necesidades

## 🔗 Enlaces Útiles

- [Documentación de Next.js](https://nextjs.org/docs) - aprende sobre las características y API de Next.js.
- [Documentación de TailwindCSS](https://tailwindcss.com/docs) - aprende sobre clases y personalización de Tailwind.
- [Documentación de NextAuth.js](https://next-auth.js.org/getting-started/introduction) - guía de autenticación.
- [React Hook Form](https://react-hook-form.com/get-started) - validación de formularios.

## 🚀 Despliegue

La forma más sencilla de desplegar tu aplicación Next.js es utilizando la [Plataforma Vercel](https://vercel.com/new):

```bash
npm i -g vercel
vercel
```

Consulta la [documentación de despliegue de Next.js](https://nextjs.org/docs/deployment) para más detalles.

## 🐛 Solución de Problemas

Si encuentras algún problema durante el desarrollo:

1. Verifica que todas las dependencias estén instaladas
2. Asegúrate que las variables de entorno estén correctamente configuradas
3. Revisa la documentación para obtener ayuda
4. Verifica los logs en la consola del navegador y del servidor

## 📝 Licencia

MIT 