import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, Star, ArrowRight, Play, Zap, Shield, Users, 
  Globe, Smartphone, Monitor, Code, Rocket, Heart,
  Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin
} from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
  >
    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
      {title}
    </h3>
    <p className="text-gray-600 dark:text-gray-400">
      {description}
    </p>
  </motion.div>
);

interface PricingCardProps {
  title: string;
  price: string;
  features: string[];
  popular?: boolean;
  delay: number;
}

const PricingCard: React.FC<PricingCardProps> = ({ title, price, features, popular, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    className={`relative bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border-2 ${
      popular 
        ? 'border-blue-500 dark:border-blue-400' 
        : 'border-gray-200 dark:border-gray-700'
    }`}
  >
    {popular && (
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
        <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
          Más Popular
        </span>
      </div>
    )}
    <div className="text-center mb-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
        {price}
      </div>
      <p className="text-gray-600 dark:text-gray-400">por mes</p>
    </div>
    <ul className="space-y-3 mb-6">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center">
          <Check className="w-5 h-5 text-green-500 mr-3" />
          <span className="text-gray-700 dark:text-gray-300">{feature}</span>
        </li>
      ))}
    </ul>
    <button className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
      popular
        ? 'bg-blue-500 hover:bg-blue-600 text-white'
        : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
    }`}>
      Empezar Ahora
    </button>
  </motion.div>
);

interface TestimonialCardProps {
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
  delay: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ name, role, content, rating, avatar, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700"
  >
    <div className="flex items-center mb-4">
      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-4">
        <span className="text-gray-600 font-semibold">{avatar}</span>
      </div>
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-white">{name}</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">{role}</p>
      </div>
    </div>
    <div className="flex items-center mb-3">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
        />
      ))}
    </div>
    <p className="text-gray-700 dark:text-gray-300 italic">"{content}"</p>
  </motion.div>
);

const LandingPage: React.FC = () => {
  const [email, setEmail] = useState('');

  const features = [
    {
      icon: <Zap className="w-6 h-6 text-white" />,
      title: 'Rápido y Eficiente',
      description: 'Optimizado para máxima velocidad y rendimiento en todos los dispositivos.'
    },
    {
      icon: <Shield className="w-6 h-6 text-white" />,
      title: 'Seguro y Confiable',
      description: 'Protección de datos de nivel empresarial con encriptación avanzada.'
    },
    {
      icon: <Users className="w-6 h-6 text-white" />,
      title: 'Colaboración en Tiempo Real',
      description: 'Trabaja con tu equipo de forma sincronizada desde cualquier lugar.'
    },
    {
      icon: <Globe className="w-6 h-6 text-white" />,
      title: 'Acceso Global',
      description: 'Disponible en todo el mundo con servidores distribuidos globalmente.'
    },
    {
      icon: <Smartphone className="w-6 h-6 text-white" />,
      title: 'Multiplataforma',
      description: 'Funciona perfectamente en móvil, tablet y desktop.'
    },
    {
      icon: <Code className="w-6 h-6 text-white" />,
      title: 'API Potente',
      description: 'Integración fácil con tu stack tecnológico existente.'
    }
  ];

  const pricingPlans = [
    {
      title: 'Básico',
      price: '$9',
      features: [
        'Hasta 1,000 usuarios',
        '5GB de almacenamiento',
        'Soporte por email',
        'Actualizaciones básicas'
      ]
    },
    {
      title: 'Profesional',
      price: '$29',
      features: [
        'Hasta 10,000 usuarios',
        '50GB de almacenamiento',
        'Soporte prioritario',
        'Actualizaciones automáticas',
        'Analytics avanzados'
      ],
      popular: true
    },
    {
      title: 'Empresarial',
      price: '$99',
      features: [
        'Usuarios ilimitados',
        'Almacenamiento ilimitado',
        'Soporte 24/7',
        'Actualizaciones personalizadas',
        'Analytics premium',
        'API dedicada'
      ]
    }
  ];

  const testimonials = [
    {
      name: 'María García',
      role: 'CEO, TechStart',
      content: 'Esta plataforma transformó completamente nuestra forma de trabajar. La eficiencia aumentó un 300%.',
      rating: 5,
      avatar: 'MG'
    },
    {
      name: 'Carlos López',
      role: 'Director de Producto',
      content: 'La mejor inversión que hemos hecho. El ROI fue evidente desde el primer mes.',
      rating: 5,
      avatar: 'CL'
    },
    {
      name: 'Ana Martínez',
      role: 'Desarrolladora Senior',
      content: 'La API es increíblemente fácil de usar. Integración perfecta con nuestro stack.',
      rating: 5,
      avatar: 'AM'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Rocket className="w-8 h-8 text-blue-500 mr-2" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">SysRot</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
                Características
              </a>
              <a href="#pricing" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
                Precios
              </a>
              <a href="#testimonials" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
                Testimonios
              </a>
              <a href="#contact" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
                Contacto
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
                Iniciar Sesión
              </button>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Empezar Gratis
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
            >
              El Futuro de la
              <span className="text-blue-500"> Productividad</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto"
            >
              Transforma tu forma de trabajar con nuestra plataforma integral. 
              Colaboración en tiempo real, análisis avanzados y herramientas poderosas.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center">
                Empezar Ahora
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-8 py-4 rounded-lg font-semibold text-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center">
                <Play className="w-5 h-5 mr-2" />
                Ver Demo
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Características Principales
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Todo lo que necesitas para llevar tu negocio al siguiente nivel
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Planes y Precios
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Elige el plan que mejor se adapte a tus necesidades
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <PricingCard
                key={index}
                title={plan.title}
                price={plan.price}
                features={plan.features}
                popular={plan.popular}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Miles de empresas confían en nosotros para su éxito
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                name={testimonial.name}
                role={testimonial.role}
                content={testimonial.content}
                rating={testimonial.rating}
                avatar={testimonial.avatar}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            ¿Listo para empezar?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto"
          >
            Únete a miles de empresas que ya están transformando su productividad
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <input
              type="email"
              placeholder="Tu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-6 py-3 rounded-lg text-gray-900 w-full sm:w-80"
            />
            <button className="bg-white text-blue-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Empezar Gratis
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Rocket className="w-8 h-8 text-blue-500 mr-2" />
                <span className="text-xl font-bold">SysRot</span>
              </div>
              <p className="text-gray-400 mb-4">
                Transformando la productividad empresarial con tecnología de vanguardia.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Producto</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Características</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Precios</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentación</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Acerca de</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carreras</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contacto</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  info@sysrot.com
                </li>
                <li className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  +1 (555) 123-4567
                </li>
                <li className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  San Francisco, CA
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 SysRot. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;