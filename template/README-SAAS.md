# 🏢 SaaS Multi-tenant Platform - Documentación Completa

## 📋 Índice

- [Resumen del Sistema](#resumen-del-sistema)
- [Características Principales](#características-principales)
- [Arquitectura](#arquitectura)
- [Configuración Inicial](#configuración-inicial)
- [Base de Datos](#base-de-datos)
- [APIs Disponibles](#apis-disponibles)
- [Autenticación y Autorización](#autenticación-y-autorización)
- [Sistema de Billing con Stripe](#sistema-de-billing-con-stripe)
- [Panel de Administración](#panel-de-administración)
- [Analytics y Métricas](#analytics-y-métricas)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## 🎯 Resumen del Sistema

Este es un **sistema SaaS multi-tenant completo** que proporciona:

- ✅ **Multi-tenancy completo** con aislamiento de datos
- ✅ **Sistema de billing con Stripe** integrado
- ✅ **Gestión de suscripciones** y planes
- ✅ **Panel administrativo** por organización
- ✅ **Sistema de invitaciones** y roles
- ✅ **Analytics y métricas** en tiempo real
- ✅ **APIs RESTful** completas
- ✅ **Autenticación robusta** con NextAuth.js

## 🌟 Características Principales

### 🏢 Multi-tenancy

- **Organizaciones**: Cada cliente tiene su propia organización
- **Aislamiento de datos**: Datos completamente separados por tenant
- **Configuración personalizada**: Cada org puede tener su configuración
- **Dominios personalizados**: Soporte para dominios custom (opcional)

### 👥 Gestión de Usuarios

- **Roles granulares**: Owner, Admin, Member, Viewer
- **Sistema de invitaciones**: Invitaciones por email con tokens seguros
- **Permisos detallados**: Control fino de acceso por funcionalidad
- **Actividad tracking**: Log completo de todas las acciones

### 💳 Billing y Suscripciones

- **Integración Stripe completa**: Suscripciones recurrentes
- **Múltiples planes**: Starter (gratis), Pro, Business, Enterprise
- **Gestión de upgrades/downgrades**: Cambios de plan sin fricción
- **Períodos de prueba**: Trials automáticos para nuevas organizaciones
- **Webhooks**: Sincronización automática con Stripe

### 📊 Analytics y Métricas

- **Dashboard en tiempo real**: KPIs y métricas clave
- **Tracking de uso**: Usuarios, storage, API calls, bandwidth
- **Health Score**: Puntuación de salud de la organización
- **Reportes históricos**: Datos de crecimiento y tendencias
- **Alertas de límites**: Notificaciones de proximidad a límites

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                       │
├─────────────────────────────────────────────────────────────┤
│  📱 Dashboard   👥 Members   💳 Billing   📊 Analytics     │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    API Routes (Next.js)                     │
├─────────────────────────────────────────────────────────────┤
│  🏢 Organizations  👥 Members  💳 Subscriptions  📊 Analytics│
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    Base de Datos (Prisma)                   │
├─────────────────────────────────────────────────────────────┤
│  Organization  │  Member  │  Subscription  │  Usage  │  Plan │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    Servicios Externos                       │
├─────────────────────────────────────────────────────────────┤
│        💳 Stripe        │       📧 Email Service            │
└─────────────────────────────────────────────────────────────┘
```

## ⚙️ Configuración Inicial

### 1. Variables de Entorno

Crea tu archivo `.env.local`:

```bash
# Base de datos
DATABASE_URL="sqlite:./dev.db"

# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu-secret-super-seguro

# Stripe (obtén tus keys en https://dashboard.stripe.com)
STRIPE_SECRET_KEY=sk_test_tu_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_tu_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_secret

# Email (opcional - para invitaciones)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=tu-email@gmail.com
EMAIL_SERVER_PASSWORD=tu-password
EMAIL_FROM=noreply@tu-saas.com
```

### 2. Instalación de Dependencias

```bash
npm install
# o
yarn install
```

### 3. Configuración de Base de Datos

```bash
# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma db push

# Sembrar datos de prueba
npx prisma db seed -- --saas
```

### 4. Configuración de Stripe

1. **Crear Productos en Stripe:**
```bash
# Ejecutar script de configuración (próximamente)
npm run setup:stripe
```

2. **Configurar Webhooks:**
   - URL: `https://tu-dominio.com/api/webhooks/stripe`
   - Eventos: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`, `invoice.payment_failed`

## 💾 Base de Datos

### Modelos Principales

#### Organization
```prisma
model Organization {
  id            String   @id @default(cuid())
  name          String
  slug          String   @unique
  domain        String?  @unique
  planId        String?
  status        OrganizationStatus
  trialEndsAt   DateTime?
  userLimit     Int      @default(5)
  storageLimit  Int      @default(1000) // MB
  apiLimit      Int      @default(1000) // requests/month
  
  // Relations
  members       OrganizationMember[]
  subscription  Subscription?
  plan          Plan?
  usage         Usage[]
  activities    Activity[]
}
```

#### Plan
```prisma
model Plan {
  id            String   @id @default(cuid())
  name          String   @unique
  slug          String   @unique
  price         Float    // Monthly price
  yearlyPrice   Float?   // Yearly price
  features      Json     // Plan features
  userLimit     Int
  storageLimit  Int
  apiLimit      Int
  stripePriceId String?  @unique
  status        PlanStatus
  popular       Boolean  @default(false)
}
```

#### Subscription
```prisma
model Subscription {
  id                     String   @id @default(cuid())
  organizationId         String   @unique
  planId                 String
  stripeCustomerId       String?
  stripeSubscriptionId   String?  @unique
  status                 SubscriptionStatus
  currentPeriodStart     DateTime
  currentPeriodEnd       DateTime
  cancelAtPeriodEnd      Boolean  @default(false)
}
```

## 🔗 APIs Disponibles

### 🏢 Organizations API

**Base URL:** `/api/saas/organizations`

#### GET /api/saas/organizations
Obtener organizaciones del usuario actual.

```javascript
const response = await fetch('/api/saas/organizations');
const { organizations } = await response.json();
```

#### POST /api/saas/organizations
Crear nueva organización.

```javascript
const response = await fetch('/api/saas/organizations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Mi Empresa',
    slug: 'mi-empresa',
    description: 'Descripción de mi empresa',
    planId: 'starter-plan-id'
  })
});
```

#### GET /api/saas/organizations/[id]
Obtener detalles de organización específica.

#### PUT /api/saas/organizations/[id]
Actualizar organización.

#### DELETE /api/saas/organizations/[id]
Eliminar organización (soft delete).

### 👥 Members API

**Base URL:** `/api/saas/members`

#### GET /api/saas/members?organizationId=[id]
Obtener miembros de organización.

#### POST /api/saas/members?action=invite
Invitar nuevo miembro.

```javascript
const response = await fetch('/api/saas/members?action=invite', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    organizationId: 'org-id',
    email: 'nuevo@miembro.com',
    role: 'MEMBER'
  })
});
```

#### POST /api/saas/members?action=accept
Aceptar invitación.

#### PUT /api/saas/members/[memberId]
Actualizar rol de miembro.

#### DELETE /api/saas/members/[memberId]
Remover miembro.

### 💳 Subscriptions API

**Base URL:** `/api/saas/subscriptions`

#### GET /api/saas/subscriptions?organizationId=[id]
Obtener detalles de suscripción.

#### POST /api/saas/subscriptions
Crear nueva suscripción.

#### PUT /api/saas/subscriptions?organizationId=[id]
Actualizar plan de suscripción.

#### DELETE /api/saas/subscriptions?organizationId=[id]
Cancelar suscripción.

### 📊 Analytics API

**Base URL:** `/api/saas/analytics`

#### GET /api/saas/analytics?organizationId=[id]
Dashboard general.

#### GET /api/saas/analytics?organizationId=[id]&type=usage
Métricas de uso.

#### GET /api/saas/analytics?organizationId=[id]&type=members
Métricas de miembros.

#### GET /api/saas/analytics?organizationId=[id]&type=billing
Métricas de facturación.

## 🔐 Autenticación y Autorización

### Roles y Permisos

#### OWNER
- Acceso total a la organización
- Gestión de billing y suscripciones
- Eliminar organización
- Gestionar todos los miembros

#### ADMIN  
- Gestión de miembros (excepto owners)
- Ver analytics y métricas
- Configurar organización
- No puede gestionar billing

#### MEMBER
- Acceso a funcionalidades básicas
- Ver métricas limitadas
- No puede gestionar miembros

#### VIEWER
- Solo lectura
- Ver dashboards básicos
- No puede realizar cambios

### Sistema de Permisos

```javascript
// Ejemplo de verificación de permisos
async function hasPermission(userId, organizationId, requiredRole = ['OWNER', 'ADMIN']) {
  const membership = await prisma.organizationMember.findUnique({
    where: { organizationId_userId: { organizationId, userId } }
  });
  return membership && requiredRole.includes(membership.role);
}
```

## 💳 Sistema de Billing con Stripe

### Configuración de Planes

Los planes se configuran tanto en la base de datos como en Stripe:

```javascript
// Crear plan en Stripe
const product = await stripe.products.create({
  name: 'Plan Pro',
  description: 'Plan profesional para equipos en crecimiento'
});

const price = await stripe.prices.create({
  product: product.id,
  currency: 'usd',
  recurring: { interval: 'month' },
  unit_amount: 2900 // $29.00
});

// Guardar en base de datos
await prisma.plan.create({
  data: {
    name: 'Pro',
    slug: 'pro',
    price: 29,
    stripePriceId: price.id,
    stripeProductId: product.id,
    // ... otros campos
  }
});
```

### Flujo de Suscripción

1. **Usuario selecciona plan**
2. **Se crea customer en Stripe**
3. **Se crea suscripción en Stripe**
4. **Webhook confirma suscripción**
5. **Se actualiza base de datos**

### Webhooks de Stripe

```javascript
// /api/webhooks/stripe.js
export default async function handler(req, res) {
  const sig = req.headers['stripe-signature'];
  const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

  switch (event.type) {
    case 'customer.subscription.created':
      await handleSubscriptionCreated(event.data.object);
      break;
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object);
      break;
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object);
      break;
    case 'invoice.payment_succeeded':
      await handlePaymentSucceeded(event.data.object);
      break;
    case 'invoice.payment_failed':
      await handlePaymentFailed(event.data.object);
      break;
  }

  res.json({ received: true });
}
```

## 📊 Panel de Administración

### Dashboard Principal

El dashboard proporciona una vista completa de la organización:

- **KPIs principales**: Usuarios, uso de almacenamiento, API calls
- **Health Score**: Puntuación de salud basada en utilización y actividad
- **Gráficos de tendencias**: Crecimiento de usuarios, uso de recursos
- **Actividad reciente**: Log de acciones importantes
- **Alertas**: Notificaciones de límites próximos

### Gestión de Miembros

- **Lista de miembros**: Con roles y última actividad
- **Invitaciones pendientes**: Estado y gestión
- **Asignación de roles**: Cambio dinámico de permisos
- **Activity tracking**: Historial de acciones por usuario

### Configuración

- **Detalles de organización**: Nombre, descripción, logo
- **Configuraciones**: Tema, notificaciones, features
- **Límites y uso**: Visualización de recursos utilizados
- **Seguridad**: Configuraciones de acceso

## 📈 Analytics y Métricas

### Métricas Clave

#### Utilización de Plan
```javascript
const planUtilization = {
  users: {
    current: totalMembers,
    limit: organization.userLimit,
    percentage: (totalMembers / organization.userLimit) * 100
  },
  storage: {
    current: currentStorage,
    limit: storageLimit,
    percentage: (currentStorage / storageLimit) * 100
  },
  api: {
    current: currentApiUsage,
    limit: apiLimit,
    percentage: (currentApiUsage / apiLimit) * 100
  }
};
```

#### Health Score
Algoritmo que evalúa la salud de la organización:

```javascript
function calculateHealthScore(planUtilization, activeMembers, totalMembers) {
  let score = 100;
  
  // Penalizar alta utilización (riesgo de límites)
  if (planUtilization.users.percentage > 90) score -= 20;
  if (planUtilization.storage.percentage > 90) score -= 15;
  if (planUtilization.api.percentage > 90) score -= 15;
  
  // Penalizar baja actividad de miembros
  const activityRate = (activeMembers / totalMembers) * 100;
  if (activityRate < 30) score -= 25;
  
  return Math.max(0, Math.min(100, score));
}
```

### Reportes Disponibles

- **Uso mensual**: Tendencias de consumo de recursos
- **Crecimiento de usuarios**: Nuevos miembros por período
- **Actividad**: Acciones realizadas en la plataforma
- **Facturación**: Historial de pagos y proyecciones

## 🚀 Deployment

### Desarrollo Local

```bash
# Instalar dependencias
npm install

# Configurar base de datos
npx prisma db push
npx prisma db seed -- --saas

# Iniciar desarrollo
npm run dev
```

### Producción

#### 1. Variables de Entorno Producción

```bash
# Base de datos (PostgreSQL recomendado)
DATABASE_URL="postgresql://user:password@host:5432/saas_db"

# NextAuth.js
NEXTAUTH_URL=https://tu-saas.com
NEXTAUTH_SECRET=super-secret-produccion

# Stripe (claves de producción)
STRIPE_SECRET_KEY=sk_live_tu_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_tu_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_secret_live
```

#### 2. Build y Deploy

```bash
# Build para producción
npm run build

# Migrar base de datos
npx prisma migrate deploy

# Iniciar aplicación
npm start
```

#### 3. Plataformas Recomendadas

**Vercel (Recomendado)**
```bash
# Deploy con Vercel
vercel --prod

# Configurar variables de entorno en Vercel dashboard
```

**Railway**
```bash
# Deploy con Railway
railway up
```

**DigitalOcean App Platform**
- Conectar repositorio
- Configurar variables de entorno
- Deploy automático

### Base de Datos Producción

**PostgreSQL (Recomendado)**
- Heroku Postgres
- DigitalOcean Managed Databases
- AWS RDS
- PlanetScale

**Configuración de Migraciones**
```bash
# Generar migración
npx prisma migrate dev --name init

# Deploy migraciones en producción
npx prisma migrate deploy
```

## 🔧 Troubleshooting

### Problemas Comunes

#### Error de Conexión a Base de Datos
```bash
# Verificar URL de conexión
echo $DATABASE_URL

# Regenerar cliente Prisma
npx prisma generate

# Verificar conexión
npx prisma db pull
```

#### Errores de Stripe
```bash
# Verificar webhooks
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Test webhook
stripe trigger customer.subscription.created
```

#### Problemas de Autenticación
```bash
# Verificar JWT secret
echo $NEXTAUTH_SECRET

# Limpiar cookies del navegador
# Verificar URL de NextAuth
```

### Logs y Monitoreo

#### Logs de Desarrollo
```javascript
// Habilitar logs detallados
console.log('DEBUG:', { user, organization, subscription });
```

#### Monitoreo en Producción
- **Sentry**: Para tracking de errores
- **LogRocket**: Para sesiones de usuario
- **Stripe Dashboard**: Para métricas de billing

### Performance

#### Optimizaciones de Base de Datos
```sql
-- Índices recomendados
CREATE INDEX idx_organization_members ON "OrganizationMember"("organizationId");
CREATE INDEX idx_activities_org_date ON "Activity"("organizationId", "createdAt");
CREATE INDEX idx_usage_org_date ON "Usage"("organizationId", "year", "month");
```

#### Cachéado
```javascript
// Redis para caché de métricas
const metrics = await redis.get(`metrics:${organizationId}`);
if (!metrics) {
  const freshMetrics = await calculateMetrics(organizationId);
  await redis.setex(`metrics:${organizationId}`, 300, JSON.stringify(freshMetrics));
}
```

## 📞 Soporte

### Contacto
- **Email**: soporte@tu-saas.com
- **Documentation**: https://docs.tu-saas.com
- **GitHub Issues**: Para reportar bugs

### Recursos Adicionales
- [Stripe Documentation](https://stripe.com/docs)
- [Prisma Documentation](https://prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)

---

## 🎉 ¡Felicidades!

Tienes un **sistema SaaS multi-tenant completo y funcional** con:

✅ **Multi-tenancy** con aislamiento completo  
✅ **Billing con Stripe** completamente integrado  
✅ **Panel administrativo** profesional  
✅ **Analytics en tiempo real**  
✅ **Sistema de roles** granular  
✅ **APIs RESTful** completas  
✅ **Documentación** exhaustiva  

**🚀 ¡Tu SaaS está listo para producción!**