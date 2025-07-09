#!/usr/bin/env node

const { Command } = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const createProject = require('./createProject');
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
    dependencies: ['react-typed', 'react-scroll']
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

program
  .name('sysrot-hub')
  .description('CLI de nueva generación para crear proyectos Next.js 14+ con IA, autenticación y más')
  .version('0.9.0')
  .argument('[proyecto]', 'Nombre del proyecto')
  .option('-h, --help', 'Mostrar ayuda completa')
  .option('-v, --version', 'Mostrar versión')
  .option('--verbose', 'Modo detallado de logging')
  .option('--examples', 'Mostrar ejemplos disponibles')
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
      logger.showVersion('0.9.0');
      return;
    }

    if (options.examples) {
      console.log(chalk.blue('\n🎨 Available Premium Examples:\n'));
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

    // Ask about premium examples
    const { includePremiumExamples } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'includePremiumExamples',
        message: '🎨 ¿Deseas incluir ejemplos premium adicionales?',
        default: false
      }
    ]);

    let selectedExamples = [];
    if (includePremiumExamples) {
      const { examples } = await inquirer.prompt([
        {
          type: 'checkbox',
          name: 'examples',
          message: '🎯 Selecciona los ejemplos que deseas incluir (puedes elegir múltiples):',
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
      selectedExamples = examples;
    }

    logger.projectStart(projectName);
    
    try {
      // Configuración predeterminada optimizada
      const defaultConfig = {
        projectName,
        typescript: true,
        tailwindcss: true,
        eslint: true,
        database: 'MongoDB',
        auth: true,
        authProviders: ['Google', 'GitHub'],
        roles: true,
        middleware: true,
        ai: true,
        aiModels: ['GPT-4o (OpenAI)', 'Claude 3.5 (Anthropic)', 'Gemini Flash Pro (Google)'],
        cloudinary: true,
        blog: true,
        mdxFeatures: true,
        forms: true,
        darkMode: true,
        uiComponents: true,
        framerMotion: true,
        notifications: true,
        examplePages: true,
        exampleTypes: [
          'Ejemplo de Autenticación',
          'Ejemplo de IA (Multi-modelo)',
          'Biblioteca de Componentes',
          'Ejemplo de Carga de Imágenes',
          'Ejemplo de Formularios',
          'Ejemplo de Animaciones',
          'Ejemplo de Notificaciones',
          'Ejemplo de Base de Datos',
          'Ejemplo de UI y Temas',
          'Ejemplo de TypeScript'
        ],
        premiumExamples: selectedExamples,
        envExample: true,
        documentation: true
      };

      logger.debug('Configuración del proyecto:', defaultConfig);
      
      await createProject(defaultConfig);
      
      logger.projectSuccess(projectName);
      
      // Show information about selected examples
      if (selectedExamples.length > 0) {
        console.log(chalk.green('\n✨ Ejemplos premium incluidos:'));
        selectedExamples.forEach(exampleValue => {
          const example = AVAILABLE_EXAMPLES.find(e => e.value === exampleValue);
          console.log(chalk.cyan(`   • ${example.name}`));
        });
        console.log(chalk.yellow('\n📚 Revisa la documentación en /pages/ejemplos/premium/ para más detalles'));
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
