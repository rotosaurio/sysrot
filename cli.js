#!/usr/bin/env node

const { Command } = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const createProject = require('./createProject');
const path = require('path');

const program = new Command();

function showLogo() {
  console.log(chalk.cyan(`
  ███████╗██╗   ██╗███████╗██████╗  ██████╗ ████████╗     ██╗  ██╗██╗   ██╗██████╗ 
  ██╔════╝╚██╗ ██╔╝██╔════╝██╔══██╗██╔═══██╗╚══██╔══╝     ██║  ██║██║   ██║██╔══██╗
  ███████╗ ╚████╔╝ ███████╗██████╔╝██║   ██║   ██║        ███████║██║   ██║██████╔╝
  ╚════██║  ╚██╔╝  ╚════██║██╔══██╗██║   ██║   ██║        ██╔══██║██║   ██║██╔══██╗
  ███████║   ██║   ███████║██║  ██║╚██████╔╝   ██║        ██║  ██║╚██████╔╝██████╔╝
  ╚══════╝   ╚═╝   ╚══════╝╚═╝  ╚═╝ ╚═════╝    ╚═╝        ╚═╝  ╚═╝ ╚═════╝ ╚═════╝ 
                                                                                   
  🚀 Next-Generation Development CLI v0.8.5
  `));
  console.log(chalk.green(`
  ✨ Generador de proyectos Next.js 14+ con IA integrada
  🤖 3 modelos de IA | 🎨 50+ componentes | 🌍 Internacionalización
  `));
}

function showHelp() {
  console.log(chalk.yellow('\n📖 Uso del CLI:'));
  console.log('  npx sysrot-hub [nombre-proyecto]');
  console.log('');
  console.log(chalk.yellow('📋 Ejemplos:'));
  console.log('  npx sysrot-hub mi-app');
  console.log('  npx sysrot-hub');
  console.log('');
  console.log(chalk.cyan('🔗 Más información: https://github.com/rotosaurio/sysrot-hub'));
}

program
  .name('sysrot-hub')
  .description('CLI para crear proyectos Next.js 14+ con IA, autenticación y más')
  .version('0.8.5')
  .argument('[proyecto]', 'Nombre del proyecto')
  .option('-h, --help', 'Mostrar ayuda')
  .action(async (projectName, options) => {
    if (options.help) {
      showHelp();
      return;
    }

    showLogo();

    if (!projectName) {
      const { name } = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: '📝 Nombre del proyecto:',
          default: 'mi-proyecto-sysrot'
        }
      ]);
      projectName = name;
    }

    console.log(chalk.blue(`\n🚀 Creando proyecto: ${projectName}`));
    
    try {
      await createProject({ 
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
        envExample: true,
        documentation: true
      });
      
      console.log(chalk.green(`\n✅ ¡Proyecto ${projectName} creado exitosamente!`));
      console.log(chalk.yellow('\n📋 Próximos pasos:'));
      console.log(chalk.white(`  cd ${projectName}`));
      console.log(chalk.white('  npm install'));
      console.log(chalk.white('  cp .env.example .env.local'));
      console.log(chalk.white('  npm run dev'));
      console.log(chalk.cyan('\n🌐 Tu aplicación estará disponible en http://localhost:3000'));
      
    } catch (error) {
      console.error(chalk.red('\n❌ Error al crear el proyecto:'));
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

program.parse(process.argv);

// Si no se proporcionan argumentos, mostrar ayuda
if (!process.argv.slice(2).length) {
  showLogo();
  showHelp();
}
