const chalk = require('chalk');
const ora = require('ora');

/**
 * Sistema de logging profesional para sysrot-hub CLI
 * Proporciona logging consistente con colores y formato
 */
class Logger {
  constructor() {
    this.spinner = null;
    this.verbose = process.env.SYSROT_VERBOSE === 'true';
  }

  // Logos y branding
  showLogo() {
    console.log(chalk.cyan(`
  ███████╗██╗   ██╗███████╗██████╗  ██████╗ ████████╗     ██╗  ██╗██╗   ██╗██████╗ 
  ██╔════╝╚██╗ ██╔╝██╔════╝██╔══██╗██╔═══██╗╚══██╔══╝     ██║  ██║██║   ██║██╔══██╗
  ███████╗ ╚████╔╝ ███████╗██████╔╝██║   ██║   ██║        ███████║██║   ██║██████╔╝
  ╚════██║  ╚██╔╝  ╚════██║██╔══██╗██║   ██║   ██║        ██╔══██║██║   ██║██╔══██╗
  ███████║   ██║   ███████║██║  ██║╚██████╔╝   ██║        ██║  ██║╚██████╔╝██████╔╝
  ╚══════╝   ╚═╝   ╚══════╝╚═╝  ╚═╝ ╚═════╝    ╚═╝        ╚═╝  ╚═╝ ╚═════╝ ╚═════╝ 
                                                                                   
  🚀 Next-Generation Development CLI v0.9.4
    `));
    console.log(chalk.green(`
  ✨ Generador de proyectos Next.js 14+ con IA integrada
  🤖 3 modelos de IA | 🎨 50+ componentes | 🌍 Internacionalización
    `));
  }

  // Métodos de logging básicos
  info(message, details = '') {
    console.log(chalk.blue(`ℹ ${message}`), details);
  }

  success(message, details = '') {
    console.log(chalk.green(`✅ ${message}`), details);
  }

  warning(message, details = '') {
    console.log(chalk.yellow(`⚠️  ${message}`), details);
  }

  error(message, details = '') {
    console.log(chalk.red(`❌ ${message}`), details);
    if (details) {
      console.log(chalk.dim(details));
    }
  }

  debug(message, data = null) {
    if (this.verbose) {
      console.log(chalk.dim(`🐛 DEBUG: ${message}`));
      if (data) {
        console.log(chalk.dim(JSON.stringify(data, null, 2)));
      }
    }
  }

  // Métodos específicos del CLI
  projectStart(projectName) {
    console.log(chalk.blue(`\n🚀 Creando proyecto: ${chalk.bold(projectName)}`));
  }

  projectSuccess(projectName) {
    console.log(chalk.green(`\n✅ ¡Proyecto ${chalk.bold(projectName)} creado exitosamente!`));
    this.nextSteps(projectName);
  }

  nextSteps(projectName) {
    console.log(chalk.yellow('\n📋 Próximos pasos:'));
    console.log(chalk.white(`  cd ${projectName}`));
    console.log(chalk.white('  npm install'));
    console.log(chalk.white('  cp .env.example .env.local'));
    console.log(chalk.white('  npm run dev'));
    console.log(chalk.cyan('\n🌐 Tu aplicación estará disponible en http://localhost:3000'));
  }

  showHelp() {
    console.log(chalk.yellow('\n📖 Uso del CLI:'));
    console.log('  npx sysrot-hub [nombre-proyecto]');
    console.log('');
    console.log(chalk.yellow('📋 Ejemplos:'));
    console.log('  npx sysrot-hub mi-app');
    console.log('  npx sysrot-hub mi-empresa-web');
    console.log('  npx sysrot-hub');
    console.log('');
    console.log(chalk.yellow('🔧 Opciones:'));
    console.log('  --help, -h     Mostrar ayuda');
    console.log('  --version, -v  Mostrar versión');
    console.log('  --verbose      Modo detallado');
    console.log('');
    console.log(chalk.cyan('🔗 Más información: https://github.com/rotosaurio/sysrot-hub'));
  }

  // Mostrar resumen de configuración
  showConfigSummary(config) {
    console.log(chalk.blue('\n📋 Resumen de Configuración:'));
    console.log(chalk.dim('─'.repeat(50)));
    
    // Configuración básica
    console.log(chalk.yellow('🛠️  Configuración Básica:'));
    console.log(`  TypeScript: ${config.typescript ? chalk.green('✅ Sí') : chalk.gray('❌ No')}`);
    console.log(`  TailwindCSS: ${config.tailwindcss ? chalk.green('✅ Sí') : chalk.gray('❌ No')}`);
    console.log(`  ESLint: ${config.eslint ? chalk.green('✅ Sí') : chalk.gray('❌ No')}`);
    console.log(`  Base de datos: ${chalk.cyan(config.database || 'Ninguna')}`);
    
    // Autenticación
    if (config.auth) {
      console.log(chalk.yellow('\n🔐 Autenticación:'));
      console.log(`  NextAuth.js: ${chalk.green('✅ Habilitado')}`);
      if (config.authProviders && config.authProviders.length > 0) {
        console.log(`  Proveedores: ${chalk.cyan(config.authProviders.join(', '))}`);
      }
      console.log(`  Sistema de roles: ${config.roles ? chalk.green('✅ Sí') : chalk.gray('❌ No')}`);
      console.log(`  Middleware: ${config.middleware ? chalk.green('✅ Sí') : chalk.gray('❌ No')}`);
    }
    
    // IA
    if (config.ai && config.aiModels && config.aiModels.length > 0) {
      console.log(chalk.yellow('\n🤖 Integración de IA:'));
      config.aiModels.forEach(model => {
        console.log(`  ${chalk.cyan('• ' + model)}`);
      });
    }
    
    // Funcionalidades adicionales
    console.log(chalk.yellow('\n✨ Funcionalidades:'));
    console.log(`  Cloudinary: ${config.cloudinary ? chalk.green('✅ Sí') : chalk.gray('❌ No')}`);
    console.log(`  Blog MDX: ${config.blog ? chalk.green('✅ Sí') : chalk.gray('❌ No')}`);
    console.log(`  Formularios: ${config.forms ? chalk.green('✅ Sí') : chalk.gray('❌ No')}`);
    console.log(`  Modo oscuro: ${config.darkMode ? chalk.green('✅ Sí') : chalk.gray('❌ No')}`);
    console.log(`  Animaciones: ${config.framerMotion ? chalk.green('✅ Sí') : chalk.gray('❌ No')}`);
    console.log(`  Notificaciones: ${config.notifications ? chalk.green('✅ Sí') : chalk.gray('❌ No')}`);
    
    // Ejemplos
    if (config.examplePages) {
      console.log(chalk.yellow('\n📚 Ejemplos:'));
      if (config.exampleTypes && config.exampleTypes.length > 0) {
        console.log(`  Ejemplos base: ${chalk.cyan(config.exampleTypes.length + ' seleccionados')}`);
      }
      if (config.premiumExamples && config.premiumExamples.length > 0) {
        console.log(`  Ejemplos premium: ${chalk.cyan(config.premiumExamples.length + ' seleccionados')}`);
      }
    }
    
    console.log(chalk.dim('\n─'.repeat(50)));
    console.log(chalk.green('🚀 ¡Iniciando creación del proyecto!'));
  }

  // Spinners para operaciones largas
  startSpinner(message) {
    this.spinner = ora(message).start();
    return this.spinner;
  }

  updateSpinner(message) {
    if (this.spinner) {
      this.spinner.text = message;
    }
  }

  succeedSpinner(message) {
    if (this.spinner) {
      this.spinner.succeed(message);
      this.spinner = null;
    }
  }

  failSpinner(message) {
    if (this.spinner) {
      this.spinner.fail(message);
      this.spinner = null;
    }
  }

  stopSpinner() {
    if (this.spinner) {
      this.spinner.stop();
      this.spinner = null;
    }
  }

  // Métodos para progreso de instalación
  templateStep() {
    this.success('Archivos de plantilla copiados');
  }

  structureStep() {
    this.success('Estructura de carpetas creada');
  }

  configStep() {
    this.success('Compatibilidad con Pages Router configurada');
  }

  customizeStep() {
    this.success('Proyecto personalizado según preferencias');
  }

  dependenciesStep() {
    this.success('Dependencias instaladas correctamente');
  }

  // Manejo de errores mejorado
  handleError(error, context = '') {
    this.failSpinner(`Error: ${context}`);
    this.error('Se produjo un error durante la instalación:', error.message);
    
    if (this.verbose) {
      console.log(chalk.dim('\nStack trace:'));
      console.log(chalk.dim(error.stack));
    }

    console.log(chalk.yellow('\n🔧 Posibles soluciones:'));
    console.log('  1. Verificar conexión a internet');
    console.log('  2. Verificar permisos de escritura en el directorio');
    console.log('  3. Ejecutar con --verbose para más detalles');
    console.log('  4. Reportar el issue en GitHub');
  }

  // Logging de progreso de descarga
  downloadProgress(progress) {
    const percentage = Math.round(progress * 100);
    const bar = '█'.repeat(Math.round(progress * 20));
    const empty = '░'.repeat(20 - Math.round(progress * 20));
    
    process.stdout.write(`\r📦 Descargando: [${bar}${empty}] ${percentage}%`);
    
    if (progress >= 1) {
      console.log(); // Nueva línea cuando termine
    }
  }

  // Tabla de características
  showFeatures() {
    console.log(chalk.cyan('\n🌟 Características incluidas:'));
    
    const features = [
      ['🤖 IA Multi-Modelo', 'GPT-4o, Claude 3.5, Gemini'],
      ['🎨 Componentes UI', '50+ componentes production-ready'],
      ['🌍 Internacionalización', '350+ traducciones ES/EN'],
      ['🔐 Autenticación', 'NextAuth.js + múltiples proveedores'],
      ['💾 Bases de Datos', 'MongoDB, Supabase, Firebase, Prisma'],
      ['📱 PWA Optimizado', 'Core Web Vitals 100/100'],
      ['📚 Blog MDX', 'Sistema completo de contenido'],
      ['🎬 Animaciones', 'Framer Motion + 60+ efectos']
    ];

    features.forEach(([feature, description]) => {
      console.log(`  ${feature} ${chalk.dim(description)}`);
    });
  }

  // Banner de version
  showVersion(version) {
    console.log(chalk.green(`\nsysrot-hub v${version}`));
    console.log(chalk.dim('Next-generation CLI for Next.js 14+ projects'));
  }
}

// Instancia singleton del logger
const logger = new Logger();

module.exports = logger;