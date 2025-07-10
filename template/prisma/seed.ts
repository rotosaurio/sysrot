import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@tienda.com' },
    update: {},
    create: {
      email: 'admin@tienda.com',
      name: 'Administrador',
      password: adminPassword,
      role: 'admin'
    }
  });

  // Create sample users
  const userPassword = await bcrypt.hash('user123', 12);
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'juan@email.com' },
      update: {},
      create: {
        email: 'juan@email.com',
        name: 'Juan Pérez',
        password: userPassword,
        role: 'user'
      }
    }),
    prisma.user.upsert({
      where: { email: 'maria@email.com' },
      update: {},
      create: {
        email: 'maria@email.com',
        name: 'María García',
        password: userPassword,
        role: 'user'
      }
    }),
    prisma.user.upsert({
      where: { email: 'carlos@email.com' },
      update: {},
      create: {
        email: 'carlos@email.com',
        name: 'Carlos López',
        password: userPassword,
        role: 'user'
      }
    })
  ]);

  console.log('✅ Users created');

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'electronics' },
      update: {},
      create: {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Dispositivos electrónicos y gadgets',
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'audio' },
      update: {},
      create: {
        name: 'Audio',
        slug: 'audio',
        description: 'Auriculares, parlantes y equipos de audio',
        image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'wearables' },
      update: {},
      create: {
        name: 'Wearables',
        slug: 'wearables',
        description: 'Relojes inteligentes y dispositivos vestibles',
        image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=500'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'accessories' },
      update: {},
      create: {
        name: 'Accessories',
        slug: 'accessories',
        description: 'Accesorios y complementos',
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'computing' },
      update: {},
      create: {
        name: 'Computing',
        slug: 'computing',
        description: 'Computadoras, laptops y accesorios',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500'
      }
    })
  ]);

  console.log('✅ Categories created');

  // Create product tags
  const tags = await Promise.all([
    prisma.productTag.upsert({
      where: { slug: 'apple' },
      update: {},
      create: { name: 'Apple', slug: 'apple' }
    }),
    prisma.productTag.upsert({
      where: { slug: 'smartphone' },
      update: {},
      create: { name: 'Smartphone', slug: 'smartphone' }
    }),
    prisma.productTag.upsert({
      where: { slug: 'wireless' },
      update: {},
      create: { name: 'Wireless', slug: 'wireless' }
    }),
    prisma.productTag.upsert({
      where: { slug: 'premium' },
      update: {},
      create: { name: 'Premium', slug: 'premium' }
    }),
    prisma.productTag.upsert({
      where: { slug: 'gaming' },
      update: {},
      create: { name: 'Gaming', slug: 'gaming' }
    }),
    prisma.productTag.upsert({
      where: { slug: 'professional' },
      update: {},
      create: { name: 'Professional', slug: 'professional' }
    })
  ]);

  console.log('✅ Tags created');

  // Create products
  const products = await Promise.all([
    // iPhone 15 Pro
    prisma.product.upsert({
      where: { slug: 'iphone-15-pro' },
      update: {},
      create: {
        name: 'iPhone 15 Pro',
        slug: 'iphone-15-pro',
        description: 'El iPhone más avanzado con chip A17 Pro, cámara principal de 48MP, y diseño de titanio. Incluye Action Button personalizable y carga USB-C.',
        shortDescription: 'iPhone 15 Pro con chip A17 Pro y diseño de titanio',
        price: 999.00,
        comparePrice: 1099.00,
        sku: 'IPHONE-15-PRO-128',
        stock: 25,
        lowStockAlert: 5,
        status: 'ACTIVE',
        featured: true,
        weight: 0.187,
        dimensions: '146.6 × 70.6 × 8.25 mm',
        seoTitle: 'iPhone 15 Pro - Smartphone Premium con Titanio',
        seoDescription: 'Compra el nuevo iPhone 15 Pro con chip A17 Pro, cámara de 48MP y diseño de titanio. Envío gratis y garantía oficial.',
        categoryId: categories[0].id, // Electronics
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800',
              alt: 'iPhone 15 Pro - Frente',
              position: 0
            },
            {
              url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
              alt: 'iPhone 15 Pro - Lateral',
              position: 1
            }
          ]
        },
        tags: {
          connect: [
            { id: tags[0].id }, // Apple
            { id: tags[1].id }, // Smartphone
            { id: tags[3].id }  // Premium
          ]
        },
        variants: {
          create: [
            { name: 'Color', value: 'Natural Titanium', stock: 10 },
            { name: 'Color', value: 'Blue Titanium', stock: 8 },
            { name: 'Color', value: 'White Titanium', stock: 7 },
            { name: 'Storage', value: '256GB', price: 100, stock: 15 },
            { name: 'Storage', value: '512GB', price: 300, stock: 10 }
          ]
        }
      }
    }),

    // MacBook Air M3
    prisma.product.upsert({
      where: { slug: 'macbook-air-m3' },
      update: {},
      create: {
        name: 'MacBook Air M3',
        slug: 'macbook-air-m3',
        description: 'Laptop ultraligera con chip M3 de Apple, pantalla Liquid Retina de 13.6", hasta 18 horas de batería y diseño increíblemente delgado.',
        shortDescription: 'MacBook Air con chip M3 y pantalla Liquid Retina',
        price: 1299.00,
        comparePrice: 1399.00,
        sku: 'MBA-M3-256',
        stock: 15,
        lowStockAlert: 3,
        status: 'ACTIVE',
        featured: true,
        weight: 1.24,
        dimensions: '304.1 × 215 × 11.3 mm',
        seoTitle: 'MacBook Air M3 - Laptop Ultraligera Apple',
        seoDescription: 'Nueva MacBook Air con chip M3, 13.6" Liquid Retina, hasta 18h de batería. Perfecta para trabajo y creatividad.',
        categoryId: categories[4].id, // Computing
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
              alt: 'MacBook Air M3 - Abierta',
              position: 0
            },
            {
              url: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800',
              alt: 'MacBook Air M3 - Cerrada',
              position: 1
            }
          ]
        },
        tags: {
          connect: [
            { id: tags[0].id }, // Apple
            { id: tags[3].id }, // Premium
            { id: tags[5].id }  // Professional
          ]
        },
        variants: {
          create: [
            { name: 'Color', value: 'Space Gray', stock: 8 },
            { name: 'Color', value: 'Silver', stock: 7 },
            { name: 'Storage', value: '512GB', price: 200, stock: 10 },
            { name: 'Memory', value: '16GB RAM', price: 200, stock: 12 }
          ]
        }
      }
    }),

    // AirPods Pro
    prisma.product.upsert({
      where: { slug: 'airpods-pro' },
      update: {},
      create: {
        name: 'AirPods Pro (2nd generation)',
        slug: 'airpods-pro',
        description: 'Auriculares inalámbricos con cancelación activa de ruido, audio espacial personalizado y hasta 6 horas de reproducción.',
        shortDescription: 'AirPods Pro con cancelación de ruido activa',
        price: 249.00,
        comparePrice: 279.00,
        sku: 'AIRPODS-PRO-2ND',
        stock: 40,
        lowStockAlert: 10,
        status: 'ACTIVE',
        featured: false,
        weight: 0.056,
        dimensions: 'Estuche: 45.2 × 60.9 × 21.7 mm',
        seoTitle: 'AirPods Pro 2da Generación - Auriculares Apple',
        seoDescription: 'AirPods Pro con cancelación de ruido, audio espacial y hasta 30h de batería total. Sonido premium de Apple.',
        categoryId: categories[1].id, // Audio
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800',
              alt: 'AirPods Pro - Estuche abierto',
              position: 0
            },
            {
              url: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800',
              alt: 'AirPods Pro - En uso',
              position: 1
            }
          ]
        },
        tags: {
          connect: [
            { id: tags[0].id }, // Apple
            { id: tags[2].id }, // Wireless
            { id: tags[3].id }  // Premium
          ]
        }
      }
    }),

    // Apple Watch Series 9
    prisma.product.upsert({
      where: { slug: 'apple-watch-series-9' },
      update: {},
      create: {
        name: 'Apple Watch Series 9',
        slug: 'apple-watch-series-9',
        description: 'Smartwatch avanzado con chip S9, pantalla Always-On más brillante, nuevos gestos Double Tap y hasta 18 horas de batería.',
        shortDescription: 'Apple Watch Series 9 con chip S9 y Double Tap',
        price: 399.00,
        comparePrice: 429.00,
        sku: 'AW-S9-41MM',
        stock: 30,
        lowStockAlert: 8,
        status: 'ACTIVE',
        featured: false,
        weight: 0.032,
        dimensions: '41mm: 41 × 35 × 10.7 mm',
        seoTitle: 'Apple Watch Series 9 - Smartwatch Avanzado',
        seoDescription: 'Apple Watch Series 9 con chip S9, Double Tap, pantalla Always-On y monitoreo avanzado de salud.',
        categoryId: categories[2].id, // Wearables
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800',
              alt: 'Apple Watch Series 9 - Frente',
              position: 0
            },
            {
              url: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=800',
              alt: 'Apple Watch Series 9 - Lateral',
              position: 1
            }
          ]
        },
        tags: {
          connect: [
            { id: tags[0].id }, // Apple
            { id: tags[2].id }, // Wireless
            { id: tags[3].id }  // Premium
          ]
        },
        variants: {
          create: [
            { name: 'Size', value: '45mm', price: 30, stock: 20 },
            { name: 'Band', value: 'Sport Loop', stock: 25 },
            { name: 'Band', value: 'Leather Link', price: 99, stock: 15 },
            { name: 'Color', value: 'Midnight', stock: 18 },
            { name: 'Color', value: 'Starlight', stock: 12 }
          ]
        }
      }
    }),

    // iPad Pro
    prisma.product.upsert({
      where: { slug: 'ipad-pro-11' },
      update: {},
      create: {
        name: 'iPad Pro 11"',
        slug: 'ipad-pro-11',
        description: 'Tablet profesional con chip M2, pantalla Liquid Retina XDR, cámara TrueDepth frontal y soporte para Apple Pencil (2da gen).',
        shortDescription: 'iPad Pro 11" con chip M2 y pantalla Liquid Retina',
        price: 799.00,
        comparePrice: 899.00,
        sku: 'IPAD-PRO-11-128',
        stock: 20,
        lowStockAlert: 5,
        status: 'ACTIVE',
        featured: true,
        weight: 0.466,
        dimensions: '247.6 × 178.5 × 5.9 mm',
        seoTitle: 'iPad Pro 11" con M2 - Tablet Profesional Apple',
        seoDescription: 'iPad Pro 11" con chip M2, pantalla Liquid Retina XDR y soporte para Apple Pencil. Ideal para creativos y profesionales.',
        categoryId: categories[0].id, // Electronics
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800',
              alt: 'iPad Pro 11" - Pantalla principal',
              position: 0
            },
            {
              url: 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800',
              alt: 'iPad Pro 11" - Con Apple Pencil',
              position: 1
            }
          ]
        },
        tags: {
          connect: [
            { id: tags[0].id }, // Apple
            { id: tags[3].id }, // Premium
            { id: tags[5].id }  // Professional
          ]
        },
        variants: {
          create: [
            { name: 'Storage', value: '256GB', price: 100, stock: 15 },
            { name: 'Storage', value: '512GB', price: 300, stock: 10 },
            { name: 'Connectivity', value: 'Wi-Fi + Cellular', price: 150, stock: 12 },
            { name: 'Color', value: 'Space Gray', stock: 12 },
            { name: 'Color', value: 'Silver', stock: 8 }
          ]
        }
      }
    }),

    // Magic Keyboard
    prisma.product.upsert({
      where: { slug: 'magic-keyboard' },
      update: {},
      create: {
        name: 'Magic Keyboard',
        slug: 'magic-keyboard',
        description: 'Teclado inalámbrico recargable con diseño compacto, teclas de tijera mejoradas y conexión automática con Mac.',
        shortDescription: 'Teclado inalámbrico Magic Keyboard de Apple',
        price: 99.00,
        comparePrice: 119.00,
        sku: 'MAGIC-KB-US',
        stock: 35,
        lowStockAlert: 10,
        status: 'ACTIVE',
        featured: false,
        weight: 0.231,
        dimensions: '279 × 114.9 × 10.9 mm',
        seoTitle: 'Magic Keyboard - Teclado Inalámbrico Apple',
        seoDescription: 'Magic Keyboard inalámbrico con teclas de tijera, batería recargable y diseño compacto. Compatible con Mac.',
        categoryId: categories[3].id, // Accessories
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800',
              alt: 'Magic Keyboard - Vista superior',
              position: 0
            },
            {
              url: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=800',
              alt: 'Magic Keyboard - Lateral',
              position: 1
            }
          ]
        },
        tags: {
          connect: [
            { id: tags[0].id }, // Apple
            { id: tags[2].id }, // Wireless
            { id: tags[5].id }  // Professional
          ]
        },
        variants: {
          create: [
            { name: 'Layout', value: 'Spanish', stock: 20 },
            { name: 'Layout', value: 'US English', stock: 15 },
            { name: 'Color', value: 'White', stock: 25 },
            { name: 'Color', value: 'Space Gray', stock: 10 }
          ]
        }
      }
    })
  ]);

  console.log('✅ Products created');

  // Create sample addresses for users
  const addresses = await Promise.all([
    prisma.address.create({
      data: {
        userId: users[0].id,
        type: 'SHIPPING',
        firstName: 'Juan',
        lastName: 'Pérez',
        address1: 'Av. Reforma 123',
        address2: 'Piso 4, Depto 401',
        city: 'Ciudad de México',
        state: 'CDMX',
        postalCode: '06600',
        country: 'MX',
        phone: '+52 55 1234 5678',
        isDefault: true
      }
    }),
    prisma.address.create({
      data: {
        userId: users[1].id,
        type: 'SHIPPING',
        firstName: 'María',
        lastName: 'García',
        address1: 'Calle Insurgentes 456',
        city: 'Guadalajara',
        state: 'Jalisco',
        postalCode: '44100',
        country: 'MX',
        phone: '+52 33 8765 4321',
        isDefault: true
      }
    })
  ]);

  console.log('✅ Addresses created');

  // Create coupons
  const coupons = await Promise.all([
    prisma.coupon.create({
      data: {
        code: 'SAVE10',
        type: 'PERCENTAGE',
        value: 10,
        minAmount: 100,
        maxAmount: 200,
        usageLimit: 100,
        usageCount: 0,
        userLimit: 1,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        status: 'ACTIVE'
      }
    }),
    prisma.coupon.create({
      data: {
        code: 'WELCOME20',
        type: 'FIXED_AMOUNT',
        value: 20,
        minAmount: 200,
        usageLimit: 50,
        usageCount: 0,
        userLimit: 1,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-06-30'),
        status: 'ACTIVE'
      }
    }),
    prisma.coupon.create({
      data: {
        code: 'STUDENT15',
        type: 'PERCENTAGE',
        value: 15,
        minAmount: 500,
        maxAmount: 150,
        usageLimit: 200,
        usageCount: 5,
        userLimit: 2,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        status: 'ACTIVE'
      }
    })
  ]);

  console.log('✅ Coupons created');

  // Create sample orders
  const sampleOrders = await Promise.all([
    prisma.order.create({
      data: {
        orderNumber: 'ORD-' + Date.now().toString().slice(-6) + '-001',
        userId: users[0].id,
        status: 'DELIVERED',
        paymentStatus: 'PAID',
        paymentMethod: 'card',
        paymentId: 'pi_test_' + Math.random().toString(36).substring(7),
        subtotal: 1248.00,
        tax: 124.80,
        shipping: 0,
        discount: 0,
        total: 1372.80,
        currency: 'usd',
        shippingAddress: {
          firstName: 'Juan',
          lastName: 'Pérez',
          address1: 'Av. Reforma 123',
          address2: 'Piso 4, Depto 401',
          city: 'Ciudad de México',
          state: 'CDMX',
          postalCode: '06600',
          country: 'MX',
          phone: '+52 55 1234 5678'
        },
        billingAddress: {
          firstName: 'Juan',
          lastName: 'Pérez',
          address1: 'Av. Reforma 123',
          address2: 'Piso 4, Depto 401',
          city: 'Ciudad de México',
          state: 'CDMX',
          postalCode: '06600',
          country: 'MX',
          phone: '+52 55 1234 5678'
        },
        trackingNumber: 'TRK-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        shippedAt: new Date('2024-01-10'),
        deliveredAt: new Date('2024-01-12'),
        notes: 'Entrega en horario de oficina por favor',
        items: {
          create: [
            {
              productId: products[0].id, // iPhone 15 Pro
              quantity: 1,
              price: 999.00,
              total: 999.00
            },
            {
              productId: products[2].id, // AirPods Pro
              quantity: 1,
              price: 249.00,
              total: 249.00
            }
          ]
        }
      }
    }),
    prisma.order.create({
      data: {
        orderNumber: 'ORD-' + Date.now().toString().slice(-6) + '-002',
        userId: users[1].id,
        status: 'SHIPPED',
        paymentStatus: 'PAID',
        paymentMethod: 'card',
        paymentId: 'pi_test_' + Math.random().toString(36).substring(7),
        subtotal: 1299.00,
        tax: 129.90,
        shipping: 0,
        discount: 0,
        total: 1428.90,
        currency: 'usd',
        shippingAddress: {
          firstName: 'María',
          lastName: 'García',
          address1: 'Calle Insurgentes 456',
          city: 'Guadalajara',
          state: 'Jalisco',
          postalCode: '44100',
          country: 'MX',
          phone: '+52 33 8765 4321'
        },
        billingAddress: {
          firstName: 'María',
          lastName: 'García',
          address1: 'Calle Insurgentes 456',
          city: 'Guadalajara',
          state: 'Jalisco',
          postalCode: '44100',
          country: 'MX',
          phone: '+52 33 8765 4321'
        },
        trackingNumber: 'TRK-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        shippedAt: new Date('2024-01-14'),
        items: {
          create: [
            {
              productId: products[1].id, // MacBook Air M3
              quantity: 1,
              price: 1299.00,
              total: 1299.00
            }
          ]
        }
      }
    }),
    prisma.order.create({
      data: {
        orderNumber: 'ORD-' + Date.now().toString().slice(-6) + '-003',
        userId: users[2].id,
        status: 'PROCESSING',
        paymentStatus: 'PAID',
        paymentMethod: 'card',
        paymentId: 'pi_test_' + Math.random().toString(36).substring(7),
        subtotal: 1197.00,
        tax: 119.70,
        shipping: 0,
        discount: 119.70, // 10% discount applied
        total: 1197.00,
        currency: 'usd',
        couponCode: 'SAVE10',
        shippingAddress: {
          firstName: 'Carlos',
          lastName: 'López',
          address1: 'Boulevard Marina 789',
          city: 'Mazatlán',
          state: 'Sinaloa',
          postalCode: '82000',
          country: 'MX',
          phone: '+52 669 987 6543'
        },
        billingAddress: {
          firstName: 'Carlos',
          lastName: 'López',
          address1: 'Boulevard Marina 789',
          city: 'Mazatlán',
          state: 'Sinaloa',
          postalCode: '82000',
          country: 'MX',
          phone: '+52 669 987 6543'
        },
        items: {
          create: [
            {
              productId: products[4].id, // iPad Pro
              quantity: 1,
              price: 799.00,
              total: 799.00
            },
            {
              productId: products[3].id, // Apple Watch
              quantity: 1,
              price: 399.00,
              total: 399.00
            }
          ]
        }
      }
    })
  ]);

  console.log('✅ Sample orders created');

  // Create sample reviews
  const reviews = await Promise.all([
    prisma.review.create({
      data: {
        userId: users[0].id,
        productId: products[0].id, // iPhone 15 Pro
        rating: 5,
        title: 'Excelente teléfono',
        comment: 'El iPhone 15 Pro es increíble, la cámara es espectacular y el rendimiento es excepcional. Lo recomiendo totalmente.',
        verified: true,
        helpful: 12,
        status: 'APPROVED'
      }
    }),
    prisma.review.create({
      data: {
        userId: users[1].id,
        productId: products[1].id, // MacBook Air M3
        rating: 5,
        title: 'Perfecta para trabajo',
        comment: 'La MacBook Air M3 es perfecta para mi trabajo diario. Muy rápida, silenciosa y la batería dura todo el día.',
        verified: true,
        helpful: 8,
        status: 'APPROVED'
      }
    }),
    prisma.review.create({
      data: {
        userId: users[2].id,
        productId: products[2].id, // AirPods Pro
        rating: 4,
        title: 'Muy buenos auriculares',
        comment: 'La cancelación de ruido es excelente y la calidad de audio muy buena. Solo les falta un poco más de graves.',
        verified: true,
        helpful: 5,
        status: 'APPROVED'
      }
    }),
    prisma.review.create({
      data: {
        userId: users[0].id,
        productId: products[3].id, // Apple Watch
        rating: 5,
        title: 'Indispensable',
        comment: 'El Apple Watch Series 9 se ha vuelto indispensable en mi día a día. El monitoreo de salud es muy preciso.',
        verified: false,
        helpful: 3,
        status: 'APPROVED'
      }
    })
  ]);

  console.log('✅ Reviews created');

  // Create wishlist items
  const wishlistItems = await Promise.all([
    prisma.wishlistItem.create({
      data: {
        userId: users[0].id,
        productId: products[1].id // MacBook Air M3
      }
    }),
    prisma.wishlistItem.create({
      data: {
        userId: users[1].id,
        productId: products[4].id // iPad Pro
      }
    }),
    prisma.wishlistItem.create({
      data: {
        userId: users[2].id,
        productId: products[0].id // iPhone 15 Pro
      }
    })
  ]);

  console.log('✅ Wishlist items created');

  // Update coupon usage count
  await prisma.coupon.update({
    where: { code: 'SAVE10' },
    data: { usageCount: 1 }
  });

  console.log('✅ Database seed completed successfully! 🎉');
  console.log('');
  console.log('📝 Sample data created:');
  console.log(`   👥 Users: ${users.length + 1} (including admin)`);
  console.log(`   📂 Categories: ${categories.length}`);
  console.log(`   🏷️  Tags: ${tags.length}`);
  console.log(`   📦 Products: ${products.length}`);
  console.log(`   📍 Addresses: ${addresses.length}`);
  console.log(`   🎫 Coupons: ${coupons.length}`);
  console.log(`   📋 Orders: ${sampleOrders.length}`);
  console.log(`   ⭐ Reviews: ${reviews.length}`);
  console.log(`   ❤️  Wishlist items: ${wishlistItems.length}`);
  console.log('');
  console.log('🔑 Admin credentials:');
  console.log('   Email: admin@tienda.com');
  console.log('   Password: admin123');
  console.log('');
  console.log('🔑 User credentials:');
  console.log('   Email: juan@email.com | Password: user123');
  console.log('   Email: maria@email.com | Password: user123');
  console.log('   Email: carlos@email.com | Password: user123');
  console.log('');
  console.log('🎫 Test coupons:');
  console.log('   SAVE10: 10% discount (min $100)');
  console.log('   WELCOME20: $20 off (min $200)');
  console.log('   STUDENT15: 15% discount (min $500)');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });