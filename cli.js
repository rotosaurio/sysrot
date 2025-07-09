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

program
  .name('sysrot-hub')
  .description('CLI de nueva generación para crear proyectos Next.js 14+ con IA, autenticación y más')
  .version('0.9.0')
  .argument('[proyecto]', 'Nombre del proyecto')
  .option('-h, --help', 'Mostrar ayuda completa')
  .option('-v, --version', 'Mostrar versión')
  .option('--verbose', 'Modo detallado de logging')
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
          'Ejemplo de TypeScript',
          'Dashboard de Analytics',
          'Tienda E-Commerce',
          'Gestor de Tareas',
          'Chat en Tiempo Real',
          'Portfolio Personal',
          'Marketplace',
          'Plataforma SaaS',
          'Analytics Dashboard (Nuevo)',
          'Modern Landing Page (Nuevo)',
          'Multi-Tenant SaaS (Nuevo)'
        ],
        envExample: true,
        documentation: true
      };

      logger.debug('Configuración del proyecto:', defaultConfig);
      
      await createProject(defaultConfig);
      
      logger.projectSuccess(projectName);
      
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
