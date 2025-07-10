#!/usr/bin/env node

const { Command } = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const { createProject } = require('./createProject');
const logger = require('./utils/logger');
const path = require('path');

const program = new Command();

// Funciones delegadas al logger
function showLogo() {
  logger.showLogo();
  logger.showFeatures();
}

function showHelp() {
  logger.showHelp();
}

// Available example templates with descriptions
const AVAILABLE_EXAMPLES = [
  {
    name: 'Analytics Dashboard',
    value: 'analytics-dashboard',
    description: 'Interactive dashboard with Chart.js and D3.js visualizations',
    dependencies: ['chart.js', 'react-chartjs-2', 'd3', '@types/d3']
  },
  {
    name: 'Modern Landing Page',
    value: 'landing-page',
    description: 'Professional landing page with multiple sections',
    dependencies: ['react-intersection-observer', 'react-parallax']
  },
  {
    name: 'E-commerce with Cart',
    value: 'ecommerce',
    description: 'Basic e-commerce with shopping cart functionality',
    dependencies: ['zustand', 'react-currency-input-field']
  },
  {
    name: 'Personal Portfolio',
    value: 'portfolio',
    description: 'Responsive personal portfolio showcase',
    dependencies: ['typed.js', 'react-scroll']
  },
  {
    name: 'Task Management App',
    value: 'task-app',
    description: 'Task app with local storage persistence',
    dependencies: ['use-local-storage-state', 'react-beautiful-dnd']
  },
  {
    name: 'Real-time Chat',
    value: 'chat',
    description: 'Real-time chat application with WebSockets',
    dependencies: ['socket.io-client', 'uuid', '@types/uuid']
  },
  {
    name: 'Multi-tenant SaaS',
    value: 'saas',
    description: 'Multi-tenant SaaS example with subscription management',
    dependencies: ['@stripe/stripe-js', 'stripe']
  },
  {
    name: 'Marketplace with Reviews',
    value: 'marketplace',
    description: 'Marketplace platform with ratings and reviews system',
    dependencies: ['react-rating-stars-component', 'react-image-gallery']
  }
];

async function askProjectConfiguration() {
  console.log(chalk.blue('\n🛠️  Configuración del Proyecto\n'));
  
  const config = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'typescript',
      message: '🔷 ¿Deseas TypeScript configurado?',
      default: true
    },
    {
      type: 'confirm',
      name: 'tailwindcss',
      message: '🎨 ¿Deseas TailwindCSS configurado?',
      default: true
    },
    {
      type: 'confirm',
      name: 'eslint',
      message: '📏 ¿Deseas ESLint configurado?',
      default: true
    },
    {
      type: 'list',
      name: 'database',
      message: '💾 ¿Qué base de datos deseas usar?',
      choices: [
        { name: 'MongoDB', value: 'MongoDB' },
        { name: 'Supabase', value: 'Supabase' },
        { name: 'Firebase', value: 'Firebase' },
        { name: 'Ninguna', value: 'None' }
      ],
      default: 'MongoDB'
    },
    {
      type: 'confirm',
      name: 'auth',
      message: '🔐 ¿Deseas sistema de autenticación con NextAuth.js?',
      default: true
    }
  ]);
  
  // Preguntas condicionales para autenticación
  if (config.auth) {
    const authConfig = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'authProviders',
        message: '🔑 Selecciona los proveedores de autenticación:',
        choices: [
          { name: 'Google', value: 'Google', checked: true },
          { name: 'GitHub', value: 'GitHub', checked: true },
          { name: 'Email', value: 'Email' },
          { name: 'Discord', value: 'Discord' },
          { name: 'Twitter', value: 'Twitter' }
        ],
        validate: (answer) => {
          if (answer.length === 0) {
            return 'Debes seleccionar al menos un proveedor de autenticación.';
          }
          return true;
        }
      },
      {
        type: 'confirm',
        name: 'roles',
        message: '👤 ¿Deseas incluir sistema de roles básico (admin/user)?',
        default: true
      },
      {
        type: 'confirm',
        name: 'middleware',
        message: '🛡️ ¿Deseas middleware de protección de rutas?',
        default: true
      }
    ]);
    
    Object.assign(config, authConfig);
  }
  
  // Continuar con más configuraciones
  const aiConfig = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'ai',
      message: '🤖 ¿Deseas integración con modelos de IA?',
      default: true
    }
  ]);
  
  if (aiConfig.ai) {
    const aiModels = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'aiModels',
        message: '🧠 Selecciona los modelos de IA a integrar:',
        choices: [
          { name: 'GPT-4o (OpenAI)', value: 'GPT-4o (OpenAI)', checked: true },
          { name: 'Claude 3.5 (Anthropic)', value: 'Claude 3.5 (Anthropic)', checked: true },
          { name: 'Gemini Flash Pro (Google)', value: 'Gemini Flash Pro (Google)', checked: true },
          { name: 'DeepSeek V3 Chat', value: 'DeepSeek V3 Chat' },
          { name: 'DeepSeek R1 Reasoner', value: 'DeepSeek R1 Reasoner' }
        ],
        validate: (answer) => {
          if (answer.length === 0) {
            return 'Debes seleccionar al menos un modelo de IA.';
          }
          return true;
        }
      }
    ]);
    
    Object.assign(aiConfig, aiModels);
  }
  
  Object.assign(config, aiConfig);
  
  // Configuraciones adicionales
  const additionalConfig = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'cloudinary',
      message: '☁️ ¿Deseas integración con Cloudinary para carga de imágenes?',
      default: true
    },
    {
      type: 'confirm',
      name: 'blog',
      message: '📝 ¿Deseas agregar un blog con MDX?',
      default: true
    }
  ]);
  
  if (additionalConfig.blog) {
    const blogFeatures = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'mdxFeatures',
        message: '✨ ¿Deseas características avanzadas de MDX (syntax highlighting, slugs automáticos)?',
        default: true
      }
    ]);
    
    Object.assign(additionalConfig, blogFeatures);
  }
  
  const uiConfig = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'forms',
      message: '📋 ¿Deseas integración de formularios (react-hook-form + zod)?',
      default: true
    },
    {
      type: 'confirm',
      name: 'darkMode',
      message: '🌙 ¿Deseas integración de temas (modo claro/oscuro)?',
      default: true
    },
    {
      type: 'confirm',
      name: 'uiComponents',
      message: '🎨 ¿Deseas componentes UI reutilizables (layout, iconos, botones)?',
      default: true
    },
    {
      type: 'confirm',
      name: 'framerMotion',
      message: '🎬 ¿Deseas animaciones con framer-motion?',
      default: true
    },
    {
      type: 'confirm',
      name: 'notifications',
      message: '🔔 ¿Deseas sistema de notificaciones toast (react-hot-toast)?',
      default: true
    }
  ]);
  
  Object.assign(config, additionalConfig, uiConfig);
  
  // Ejemplos funcionales
  const examplesConfig = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'examplePages',
      message: '📄 ¿Deseas incluir páginas de ejemplo funcionales?',
      default: true
    }
  ]);
  
  if (examplesConfig.examplePages) {
    const exampleTypes = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'exampleTypes',
        message: '📚 Selecciona los ejemplos a incluir:',
        choices: [
          { name: 'Ejemplo de Autenticación', value: 'Ejemplo de Autenticación', checked: true },
          { name: 'Ejemplo de IA (Multi-modelo)', value: 'Ejemplo de IA (Multi-modelo)', checked: true },
          { name: 'Biblioteca de Componentes', value: 'Biblioteca de Componentes', checked: true },
          { name: 'Ejemplo de Carga de Imágenes', value: 'Ejemplo de Carga de Imágenes', checked: true },
          { name: 'Ejemplo de Formularios', value: 'Ejemplo de Formularios', checked: true },
          { name: 'Ejemplo de Animaciones', value: 'Ejemplo de Animaciones', checked: true },
          { name: 'Ejemplo de Notificaciones', value: 'Ejemplo de Notificaciones', checked: true },
          { name: 'Ejemplo de Base de Datos', value: 'Ejemplo de Base de Datos', checked: true },
          { name: 'Ejemplo de UI y Temas', value: 'Ejemplo de UI y Temas', checked: true },
          { name: 'Ejemplo de TypeScript', value: 'Ejemplo de TypeScript', checked: true }
        ]
      }
    ]);
    
    Object.assign(examplesConfig, exampleTypes);
  }
  
  Object.assign(config, examplesConfig);
  
  // Ejemplos de integración completa
  const fullIntegrationConfig = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'includeFullIntegrationExamples',
      message: '🎨 ¿Deseas incluir ejemplos de integración completa adicionales?',
      default: false
    }
  ]);
  
  if (fullIntegrationConfig.includeFullIntegrationExamples) {
    const fullIntegrationExamples = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'fullIntegrationExamples',
        message: '🎯 Selecciona los ejemplos de integración completa que deseas incluir:',
        choices: AVAILABLE_EXAMPLES.map(example => ({
          name: `${example.name} - ${example.description}`,
          value: example.value,
          checked: false
        })),
        validate: (answer) => {
          if (answer.length === 0) {
            return 'Debes seleccionar al menos un ejemplo o desmarcar la opción anterior.';
          }
          return true;
        }
      }
    ]);
    
    Object.assign(fullIntegrationConfig, fullIntegrationExamples);
  }
  
  Object.assign(config, fullIntegrationConfig);
  
  // Configuraciones finales
  const finalConfig = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'envExample',
      message: '⚙️ ¿Deseas archivo .env.example con todas las variables configuradas?',
      default: true
    },
    {
      type: 'confirm',
      name: 'documentation',
      message: '📖 ¿Deseas documentación completa (README.md y DOCUMENTACION.md)?',
      default: true
    }
  ]);
  
  Object.assign(config, finalConfig);
  
  return config;
}

program
  .name('sysrot-hub')
  .description('CLI de nueva generación para proyectos Next.js con IA, autenticación y más')
  .version('1.0.5')
  .argument('[project-name]', 'Nombre del proyecto')
  .option('-y, --yes', 'Usar configuración por defecto')
  .option('-v, --version', 'Mostrar versión')
  .option('--verbose', 'Mostrar logs detallados')
  .option('--skip-install', 'Saltar instalación de dependencias')
  .action(async (projectName, options) => {
    // Configurar modo verbose si está habilitado
    if (options.verbose) {
      process.env.SYSROT_VERBOSE = 'true';
    }

    if (options.help) {
      showHelp();
      return;
    }

    if (options.version) {
      logger.showVersion('1.0.5');
      return;
    }

    if (options.examples) {
      console.log(chalk.blue('\n🎨 Available Full Integration Examples:\n'));
      AVAILABLE_EXAMPLES.forEach((example, index) => {
        console.log(chalk.cyan(`${index + 1}. ${example.name}`));
        console.log(chalk.gray(`   ${example.description}`));
        console.log('');
      });
      return;
    }

    showLogo();

    // Validar nombre del proyecto
    if (!projectName) {
      logger.info('Configurando tu proyecto...');
      const { name } = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: '📝 Nombre del proyecto:',
          default: 'mi-proyecto-sysrot',
          validate: (input) => {
            if (!input || input.trim().length === 0) {
              return 'El nombre del proyecto es requerido';
            }
            if (!/^[a-zA-Z0-9-_]+$/.test(input)) {
              return 'El nombre solo puede contener letras, números, guiones y guiones bajos';
            }
            if (input.length > 50) {
              return 'El nombre debe tener menos de 50 caracteres';
            }
            return true;
          }
        }
      ]);
      projectName = name.trim();
    }

    // Validar que el nombre del proyecto es válido
    if (!/^[a-zA-Z0-9-_]+$/.test(projectName)) {
      logger.error('Nombre de proyecto inválido. Solo se permiten letras, números, guiones y guiones bajos.');
      process.exit(1);
    }

    // Configuración interactiva completa
    const config = await askProjectConfiguration();
    config.projectName = projectName;

    // Mostrar resumen de configuración
    logger.showConfigSummary(config);
    
    // Confirmación final
    const { proceed } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'proceed',
        message: '✅ ¿Deseas continuar con esta configuración?',
        default: true
      }
    ]);
    
    if (!proceed) {
      logger.info('Operación cancelada por el usuario.');
      process.exit(0);
    }

    logger.projectStart(projectName);
    
    try {
      logger.debug('Configuración del proyecto:', config);
      
      await createProject(config);
      
      logger.projectSuccess(projectName);
      
      // Show information about selected examples
      if (config.fullIntegrationExamples && config.fullIntegrationExamples.length > 0) {
        console.log(chalk.green('\n✨ Ejemplos de integración completa incluidos:'));
        config.fullIntegrationExamples.forEach(exampleValue => {
          const example = AVAILABLE_EXAMPLES.find(e => e.value === exampleValue);
          console.log(chalk.cyan(`   • ${example.name}`));
        });
        console.log(chalk.yellow('\n📚 Revisa la documentación en /pages/ejemplos/ para más detalles'));
      }
      
    } catch (error) {
      logger.handleError(error, 'crear el proyecto');
      process.exit(1);
    }
  });

program.parse(process.argv);

// Si no se proporcionan argumentos, mostrar ayuda
if (!process.argv.slice(2).length) {
  showLogo();
  showHelp();
}
