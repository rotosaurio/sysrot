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
                                                                                   
  🚀 Next-Generation Development CLI v0.8.5
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