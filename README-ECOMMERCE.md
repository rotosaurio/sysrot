# 🛒 E-commerce Completo con Panel Administrativo

Sistema completo de e-commerce construido con Next.js, Prisma, Stripe y panel administrativo completo.

## ✨ Características

### 🏬 **E-commerce Frontend**
- ✅ Catálogo de productos con filtros y búsqueda
- ✅ Carrito de compras persistente
- ✅ Lista de deseos (wishlist)
- ✅ Checkout completo con Stripe Elements
- ✅ Gestión de cupones y descuentos
- ✅ Sistema de reseñas y calificaciones
- ✅ Autenticación de usuarios con NextAuth.js
- ✅ Responsive design con Tailwind CSS

### 👨‍💼 **Panel Administrativo**
- ✅ Dashboard con analíticas en tiempo real
- ✅ Gestión completa de productos (CRUD + variantes)
- ✅ Gestión de órdenes con estados y tracking
- ✅ Gestión de usuarios y roles
- ✅ Sistema de cupones y promociones
- ✅ Analíticas de ventas con Chart.js
- ✅ Gestión de categorías jerárquicas

### 💳 **Pagos y Integración**
- ✅ Stripe Elements integración completa
- ✅ Webhooks automáticos para actualizar órdenes
- ✅ Soporte para reembolsos y disputas
- ✅ Múltiples métodos de pago
- ✅ Manejo automático de inventario

### 📄 **Base de Datos**
- ✅ Esquema completo con Prisma
- ✅ Datos de ejemplo con seeder
- ✅ Soporte para PostgreSQL/MySQL/SQLite
- ✅ Migraciones automáticas

## 🚀 Setup Rápido

### 1. **Instalar Dependencias**
```bash
npm install
```

### 2. **Configurar Variables de Entorno**
Crea un archivo `.env.local` con las siguientes variables:

```env
# Base de datos (elige una opción)
# SQLite (para desarrollo rápido)
DATABASE_URL="file:./dev.db"

# PostgreSQL (recomendado para producción)
# DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce_db"

# MySQL
# DATABASE_URL="mysql://username:password@localhost:3306/ecommerce_db"

# NextAuth.js
NEXTAUTH_SECRET="tu-nextauth-secret-super-seguro"
NEXTAUTH_URL="http://localhost:3000"

# Stripe (obtén tus keys en https://dashboard.stripe.com)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Cloudinary (para subida de imágenes)
CLOUDINARY_CLOUD_NAME="tu-cloud-name"
CLOUDINARY_API_KEY="tu-api-key"
CLOUDINARY_API_SECRET="tu-api-secret"

# Email (opcional - para notificaciones)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="tu-email@gmail.com"
SMTP_PASS="tu-app-password"

# OpenAI (opcional - para recomendaciones IA)
OPENAI_API_KEY="sk-..."
```

### 3. **Configurar Base de Datos**
```bash
# Generar cliente Prisma
npm run db:generate

# Crear/actualizar base de datos
npm run db:push

# Poblar con datos de ejemplo
npm run db:seed
```

### 4. **Iniciar Desarrollo**
```bash
npm run dev
```

### 5. **Configurar Webhooks de Stripe** (Opcional)
```bash
# Instalar Stripe CLI
npm install -g stripe

# Login en Stripe
stripe login

# Escuchar webhooks en desarrollo
npm run stripe:listen
```

## 📊 Datos de Ejemplo

Después de ejecutar `npm run db:seed`, tendrás:

### 🔑 **Credenciales de Admin**
- **Email:** `admin@tienda.com`
- **Password:** `admin123`

### 👥 **Usuarios de Prueba**
- **Email:** `juan@email.com` | **Password:** `user123`
- **Email:** `maria@email.com` | **Password:** `user123`
- **Email:** `carlos@email.com` | **Password:** `user123`

### 🎫 **Cupones de Prueba**
- `SAVE10` - 10% de descuento (mínimo $100)
- `WELCOME20` - $20 de descuento (mínimo $200)
- `STUDENT15` - 15% de descuento (mínimo $500)

### 💳 **Tarjetas de Prueba Stripe**
```
Visa: 4242 4242 4242 4242
Mastercard: 5555 5555 5555 4444
American Express: 3782 822463 10005
Fecha: Cualquier fecha futura
CVC: Cualquier 3 dígitos
```

## 🗂️ Estructura del Proyecto

```
template/
├── pages/
│   ├── ejemplos/
│   │   ├── ecommerce.tsx          # Tienda principal
│   │   ├── checkout.tsx           # Checkout con Stripe
│   │   └── admin/
│   │       ├── dashboard.tsx      # Dashboard admin
│   │       ├── products.tsx       # Gestión productos
│   │       └── orders.tsx         # Gestión órdenes
│   └── api/
│       ├── ecommerce/
│       │   ├── products.ts        # API productos
│       │   ├── orders.ts          # API órdenes
│       │   ├── categories.ts      # API categorías
│       │   └── analytics.ts       # API analíticas
│       └── webhooks/
│           └── stripe.ts          # Webhooks Stripe
├── prisma/
│   ├── schema.prisma              # Esquema base de datos
│   └── seed.ts                    # Datos de ejemplo
├── components/
│   └── ui/                        # Componentes reutilizables
└── styles/
    └── globals.css                # Estilos globales
```

## 🔧 Configuración Avanzada

### **Base de Datos en Producción**

Para PostgreSQL en producción (recomendado):
```bash
# 1. Crear base de datos PostgreSQL
# 2. Actualizar DATABASE_URL en .env
# 3. Ejecutar migraciones
npm run db:migrate
npm run db:seed
```

### **Cloudinary Setup**
1. Crear cuenta en [Cloudinary](https://cloudinary.com)
2. Obtener credenciales del Dashboard
3. Configurar variables de entorno
4. Crear folder 'products' en Cloudinary

### **Stripe Configuración**
1. **Crear cuenta en [Stripe](https://stripe.com)**
2. **Obtener API keys del Dashboard**
3. **Configurar webhook endpoint:**
   - URL: `https://tu-dominio.com/api/webhooks/stripe`
   - Eventos: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.dispute.created`
4. **Copiar webhook secret a .env**

### **Variables de Entorno Adicionales**
```env
# Configuración de envío
SHIPPING_RATE_STANDARD=9.99
SHIPPING_RATE_EXPRESS=19.99
FREE_SHIPPING_THRESHOLD=100

# Configuración de impuestos
TAX_RATE=0.10

# Configuración de la tienda
STORE_NAME="Tu Tienda"
STORE_EMAIL="contacto@tu-tienda.com"
STORE_PHONE="+1234567890"
```

## 📱 URLs Principales

### **Frontend**
- **Tienda:** `/ejemplos/ecommerce`
- **Checkout:** `/ejemplos/checkout`
- **Perfil:** `/profile`

### **Admin Panel**
- **Dashboard:** `/ejemplos/admin/dashboard`
- **Productos:** `/ejemplos/admin/products`
- **Órdenes:** `/ejemplos/admin/orders`

### **APIs**
- **Productos:** `/api/ecommerce/products`
- **Órdenes:** `/api/ecommerce/orders`
- **Analíticas:** `/api/ecommerce/analytics`
- **Webhook Stripe:** `/api/webhooks/stripe`

## 🚀 Despliegue

### **Vercel (Recomendado)**
1. **Push a GitHub**
2. **Conectar repositorio en Vercel**
3. **Configurar variables de entorno**
4. **Deploy automático**

### **Variables de Entorno en Producción**
```bash
# En Vercel Dashboard > Settings > Environment Variables
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=production-secret
NEXTAUTH_URL=https://tu-dominio.com
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
# ... resto de variables
```

### **Base de Datos en Producción**
- **PostgreSQL:** [Neon](https://neon.tech), [Supabase](https://supabase.com), [PlanetScale](https://planetscale.com)
- **MySQL:** [PlanetScale](https://planetscale.com), [Railway](https://railway.app)

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev                    # Iniciar servidor desarrollo
npm run build                  # Build para producción
npm run start                  # Iniciar servidor producción

# Base de datos
npm run db:generate            # Generar cliente Prisma
npm run db:push                # Actualizar esquema DB
npm run db:migrate             # Crear migración
npm run db:seed                # Poblar con datos ejemplo
npm run db:studio              # Abrir Prisma Studio
npm run db:reset               # Resetear DB y poblar

# Stripe
npm run stripe:listen          # Escuchar webhooks localmente

# Otros
npm run lint                   # Ejecutar linter
npm run type-check             # Verificar tipos TypeScript
```

## 🔍 Troubleshooting

### **Error: "Database connection failed"**
```bash
# Verificar DATABASE_URL en .env.local
# Asegurar que la base de datos existe
npm run db:push
```

### **Error: "Stripe keys not found"**
```bash
# Verificar variables Stripe en .env.local
# Asegurar que las keys empiecen con pk_ y sk_
```

### **Error: "Webhook signature verification failed"**
```bash
# Verificar STRIPE_WEBHOOK_SECRET
# Asegurar que el webhook está configurado correctamente
```

### **Error: "Module not found"**
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

## 📚 Recursos Adicionales

- **[Documentación Stripe](https://stripe.com/docs)**
- **[Documentación Prisma](https://www.prisma.io/docs)**
- **[NextAuth.js Guide](https://next-auth.js.org)**
- **[Tailwind CSS](https://tailwindcss.com/docs)**
- **[Vercel Deployment](https://vercel.com/docs)**

## 🎯 Próximas Características

- [ ] Sistema de subscripciones
- [ ] Programa de afiliados
- [ ] Chat en tiempo real con soporte
- [ ] Notificaciones push
- [ ] App móvil con React Native
- [ ] Integración con marketplaces
- [ ] Sistema de reviews con fotos
- [ ] Recomendaciones con IA

## 🤝 Soporte

Si necesitas ayuda:

1. **Revisa este README completo**
2. **Verifica las variables de entorno**
3. **Consulta los logs de desarrollo**
4. **Revisa la documentación de las APIs utilizadas**

---

## 🏆 ¡Listo para Producción!

Este sistema está **completamente funcional** y listo para usar en producción. Solo necesitas:

1. ✅ Configurar las variables de entorno
2. ✅ Poblar con tus productos
3. ✅ Configurar Stripe en modo live
4. ✅ Desplegar en Vercel
5. ✅ ¡Empezar a vender! 🚀

**¡Construido con ❤️ por SysRot Hub!** 