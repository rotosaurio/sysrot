#!/usr/bin/env node

const { program } = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const { createProject } = require('./createProject');
const path = require('path');

// ASCII Art para SYSROT CORE en azul - versión más pequeña y llamativa
function showTitle() {
  console.log(chalk.blue.bold(`
 ╔═══════════════════════════════════════════════════════════════╗
 ║                                                               ║
 ║    ███████╗██╗   ██╗███████╗██████╗  ██████╗ ████████╗       ║
 ║    ██╔════╝╚██╗ ██╔╝██╔════╝██╔══██╗██╔═══██╗╚══██╔══╝       ║
 ║    ███████╗ ╚████╔╝ ███████╗██████╔╝██║   ██║   ██║          ║
 ║    ╚════██║  ╚██╔╝  ╚════██║██╔══██╗██║   ██║   ██║          ║
 ║    ███████║   ██║   ███████║██║  ██║╚██████╔╝   ██║          ║
 ║    ╚══════╝   ╚═╝   ╚══════╝╚═╝  ╚═╝ ╚═════╝    ╚═╝          ║
 ║                                                               ║
 ║      ██████╗ ██████╗ ██████╗ ███████╗    🚀 v2.4.1           ║
 ║     ██╔════╝██╔═══██╗██╔══██╗██╔════╝                        ║
 ║     ██║     ██║   ██║██████╔╝█████╗                          ║
 ║     ██║     ██║   ██║██╔══██╗██╔══╝                          ║
 ║     ╚██████╗╚██████╔╝██║  ██║███████╗                        ║
 ║      ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝                        ║
 ║                                                               ║
 ╚═══════════════════════════════════════════════════════════════╝
  `));
  console.log(chalk.cyan.bold(`           🚀 Next.js 14+ CLI Generator 🚀`));
  console.log(chalk.blue(`        Crea proyectos modernos en segundos\n`));
}

// Versión del paquete
const packageJson = require('./package.json');
const version = packageJson.version;

// Obtener argumentos de línea de comandos
const args = process.argv.slice(2);
const projectNameArg = args[0];

// Verificar flags de ayuda y versión
if (args.includes('--help') || args.includes('-h')) {
  showTitle();
  console.log(chalk.white.bold('Uso: '));
  console.log('  npx sysrotcore [nombre-proyecto]');
  console.log('  npx sysrot create [nombre-proyecto]');
  console.log('  ');
  console.log(chalk.white.bold('Ejemplos:'));
  console.log('  npx sysrotcore mi-app');
  console.log('  npx sysrotcore');
  console.log('  ');
  console.log(chalk.white.bold('Opciones:'));
  console.log('  -h, --help     Mostrar ayuda');
  console.log('  -v, --version  Mostrar versión');
  console.log('  ');
  process.exit(0);
}

if (args.includes('--version') || args.includes('-v')) {
  showTitle();
  console.log(chalk.green.bold(`SysrotCore v${version}`));
  console.log('');
  process.exit(0);
}

// Mostrar el título solo si no es help o version
showTitle();

const questions = [
  {
    type: 'input',
    name: 'projectName',
    message: 'Nombre del proyecto:',
    default: projectNameArg || 'my-nextjs-app',
    validate: input => {
      if (!input || input.trim() === '') {
        return 'El nombre del proyecto es requerido';
      }
      if (!/^[a-zA-Z0-9-_]+$/.test(input)) {
        return 'El nombre del proyecto solo puede contener letras, números, guiones y guiones bajos';
      }
      return true;
    }
  },

  // Configuración básica
  {
    type: 'confirm',
    name: 'typescript',
    message: '¿Deseas TypeScript configurado?',
    default: true
  },
  {
    type: 'confirm',
    name: 'tailwindcss',
    message: '¿Deseas TailwindCSS configurado?',
    default: true
  },
  {
    type: 'confirm',
    name: 'eslint',
    message: '¿Deseas ESLint configurado?',
    default: true
  },

  // Base de datos
  {
    type: 'list',
    name: 'database',
    message: '¿Qué base de datos deseas usar?',
    choices: ['MongoDB', 'Supabase', 'Firebase', 'Ninguna'],
    default: 'Ninguna'
  },

  // Autenticación
  {
    type: 'confirm',
    name: 'auth',
    message: '¿Deseas sistema de autenticación con NextAuth.js?',
    default: true
  },
  {
    type: 'checkbox',
    name: 'authProviders',
    message: 'Selecciona los proveedores de autenticación:',
    choices: ['Google', 'GitHub', 'Email'],
    default: ['Google', 'GitHub'],
    when: answers => answers.auth
  },
  {
    type: 'confirm',
    name: 'roles',
    message: '¿Deseas incluir sistema de roles básico (admin/user)?',
    default: false,
    when: answers => answers.auth
  },
  {
    type: 'confirm',
    name: 'middleware',
    message: '¿Deseas middleware de protección de rutas?',
    default: true,
    when: answers => answers.auth
  },

  // Modelos de IA
  {
    type: 'confirm',
    name: 'ai',
    message: '¿Deseas integración con modelos de IA?',
    default: true
  },
  {
    type: 'checkbox',
    name: 'aiModels',
    message: 'Selecciona los modelos de IA a integrar:',
    choices: [
      'GPT-4o (OpenAI)',
      'Claude 3.5 (Anthropic)',
      'Gemini Flash Pro (Google)',
      'DeepSeek V3 Chat',
      'DeepSeek R1 Reasoner'
    ],
    default: ['GPT-4o (OpenAI)'],
    when: answers => answers.ai
  },

  // Carga de archivos
  {
    type: 'confirm',
    name: 'cloudinary',
    message: '¿Deseas integración con Cloudinary para carga de imágenes?',
    default: false
  },

  // Blog y contenido
  {
    type: 'confirm',
    name: 'blog',
    message: '¿Deseas agregar un blog con MDX?',
    default: true
  },
  {
    type: 'confirm',
    name: 'mdxFeatures',
    message: '¿Deseas características avanzadas de MDX (syntax highlighting, slugs automáticos)?',
    default: true,
    when: answers => answers.blog
  },

  // Formularios y validación
  {
    type: 'confirm',
    name: 'forms',
    message: '¿Deseas incluir formularios con validaciones (react-hook-form + zod)?',
    default: true
  },

  // UI y temas
  {
    type: 'confirm',
    name: 'darkMode',
    message: '¿Deseas integración de temas (modo claro/oscuro)?',
    default: true
  },
  {
    type: 'confirm',
    name: 'uiComponents',
    message: '¿Deseas componentes UI reutilizables (layout, iconos, botones)?',
    default: true
  },

  // Animaciones
  {
    type: 'confirm',
    name: 'framerMotion',
    message: '¿Deseas animaciones con framer-motion?',
    default: false
  },

  // Notificaciones
  {
    type: 'confirm',
    name: 'notifications',
    message: '¿Deseas sistema de notificaciones toast (react-hot-toast)?',
    default: true
  },

  // Páginas de ejemplo
  {
    type: 'confirm',
    name: 'examplePages',
    message: '¿Deseas incluir páginas de ejemplo funcionales?',
    default: true
  },
  {
    type: 'checkbox',
    name: 'exampleTypes',
    message: 'Selecciona los ejemplos a incluir:',
    choices: [
      'Ejemplo de Autenticación',
      'Ejemplo de IA (Multi-modelo)',
      'Biblioteca de Componentes',
      'Ejemplo de Carga de Imágenes',
      'Ejemplo de Formularios',
      'Ejemplo de Animaciones',
      'Ejemplo de Notificaciones',
      'Ejemplo de Base de Datos',
      'Ejemplo de UI y Temas',
      'Ejemplo de TypeScript',
      'Páginas 404 personalizada'
    ],
    default: [
      'Ejemplo de Autenticación',
      'Ejemplo de IA (Multi-modelo)',
      'Biblioteca de Componentes',
      'Ejemplo de Formularios',
      'Ejemplo de Notificaciones'
    ],
    when: answers => answers.examplePages
  },

  // Configuración adicional
  {
    type: 'confirm',
    name: 'envExample',
    message: '¿Deseas archivo .env.example con todas las variables configuradas?',
    default: true
  },
  {
    type: 'confirm',
    name: 'documentation',
    message: '¿Deseas documentación completa (README.md y DOCUMENTACION.md)?',
    default: true
  }
];

async function init() {
  try {
    const answers = await inquirer.prompt(questions);
    
    console.log(chalk.green('\n✅ Generando tu proyecto...'));
    console.log(chalk.blue(`📁 Proyecto: ${answers.projectName}`));
    
    await createProject(answers);
    
    console.log(chalk.bold.green('\n🎉 ¡Proyecto creado exitosamente! 🎉'));
    console.log(chalk.cyan(`\n📋 Próximos pasos:`));
    console.log(chalk.white(`  cd ${answers.projectName}`));
    console.log(chalk.white(`  cp .env.example .env.local`));
    console.log(chalk.white(`  npm run dev`));
    console.log(chalk.cyan('\n✨ Happy coding! 💻'));
  } catch (error) {
    if (error.isTtyError) {
      console.error(chalk.red('❌ Error: Terminal no compatible con prompts interactivos'));
    } else {
      console.error(chalk.red('❌ Error al crear el proyecto:'), error.message);
    }
    process.exit(1);
  }
}

// Verificar versión de Node.js
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 16) {
  console.error(chalk.red('❌ Error: Se requiere Node.js 16 o superior'));
  console.error(chalk.yellow(`Tu versión actual: ${nodeVersion}`));
  process.exit(1);
}

init();
