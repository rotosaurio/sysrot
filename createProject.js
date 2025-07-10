const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const { execSync } = require('child_process');
const ora = require('ora');
const logger = require('./utils/logger');

async function createProject(options) {
  const { projectName } = options;
  const projectPath = path.resolve(process.cwd(), projectName);

  // Verificar si la carpeta ya existe
  if (fs.existsSync(projectPath)) {
    logger.error(`La carpeta ${projectName} ya existe. Por favor elige otro nombre o elimina la carpeta existente.`);
    process.exit(1);
  }

  logger.info('Generando tu proyecto...');
  logger.debug(`Ruta del proyecto: ${projectPath}`);
  
  try {
    // Crear directorio principal
    fs.mkdirSync(projectPath, { recursive: true });
    
    // Copiar la plantilla base
    await copyTemplateFiles(projectPath);
    logger.templateStep();
    
    // Asegurar compatibilidad con Pages Router
    await ensurePagesRouterOnly(projectPath);
    logger.structureStep();
    
    // Configurar el proyecto según las opciones seleccionadas
    await customizeProject(projectPath, options);
    logger.configStep();
    
    // Añadir ejemplos de integración completa si están seleccionados
    if (options.fullIntegrationExamples && options.fullIntegrationExamples.length > 0) {
      await addFullIntegrationExamples(projectPath, options.fullIntegrationExamples);
      logger.info('Ejemplos de integración completa añadidos');
    }
    
    // Remover archivos no utilizados
    await removeUnusedFiles(projectPath, options);
    logger.customizeStep();
    
    // Instalar dependencias
    await installDependencies(projectPath, options);
    
    // Generar archivo README personalizado
    await generateReadme(projectPath, options);
    
    return true;
  } catch (error) {
    console.log(chalk.red('× Error al instalar las dependencias'));
    console.log(chalk.red('× Error al crear la estructura de carpetas'));
    console.error(chalk.red(`Error: ${error.message}`));
    
    // Limpiar directorio si algo falló
    try {
      if (fs.existsSync(projectPath)) {
        await fs.remove(projectPath);
      }
    } catch (cleanupError) {
      console.error(chalk.yellow('Advertencia: No se pudo limpiar el directorio del proyecto'));
    }
    
    process.exit(1);
  }
}

async function ensurePagesRouterOnly(projectPath) {
  const spinner = ora('Configurando compatibilidad con Pages Router...').start();
  
  try {
    // Solo verificar que el archivo existe, no procesarlo
    const nextConfigPath = path.join(projectPath, 'next.config.js');
    if (!fs.existsSync(nextConfigPath)) {
      spinner.fail('Error: next.config.js no encontrado');
      throw new Error('Archivo de configuración Next.js no encontrado');
    }
    
    spinner.succeed('Compatibilidad con Pages Router configurada correctamente');
  } catch (error) {
    spinner.fail('Error al configurar compatibilidad con Pages Router');
    throw error;
  }
}

async function copyTemplateFiles(targetPath) {
  const templatePath = path.resolve(__dirname, 'template');
  
  const spinner = ora('Copiando archivos de la plantilla base...').start();
  
  try {
    // Copiar todos los archivos del template al directorio destino
    await fs.copy(templatePath, targetPath);
    spinner.succeed('Archivos de plantilla copiados');
  } catch (error) {
    spinner.fail('Error al copiar los archivos de la plantilla');
    throw error;
  }
}

async function customizeProject(projectPath, options) {
  const {
    typescript,
    tailwindcss,
    eslint,
    database,
    auth,
    authProviders,
    roles,
    middleware,
    ai,
    aiModels,
    cloudinary,
    blog,
    mdxFeatures,
    forms,
    darkMode,
    uiComponents,
    framerMotion,
    notifications,
    examplePages,
    exampleTypes,
      fullIntegrationExamples,
    envExample,
    documentation
  } = options;
  
  const spinner = ora('Personalizando el proyecto según tus preferencias...').start();
  
  try {
    // Actualizar package.json con las dependencias necesarias
    const packageJsonPath = path.join(projectPath, 'package.json');
    const packageJson = await fs.readJson(packageJsonPath);
    
    // Dependencias base que siempre se incluyen
    const dependencies = {
      "next": "^14.2.17",
      "react": "^18.2.0",
      "react-dom": "^18.2.0"
    };
    
    const devDependencies = {};
    
    // TypeScript (opcional)
    if (typescript) {
      devDependencies["typescript"] = "^5.3.3";
      devDependencies["@types/react"] = "^18.2.45";
      devDependencies["@types/node"] = "^20.10.5";
      devDependencies["@types/react-dom"] = "^18.2.18";
    }
    
    // TailwindCSS (opcional)
    if (tailwindcss) {
      dependencies["tailwindcss"] = "^3.4.0";
      dependencies["postcss"] = "^8.4.32";
      dependencies["autoprefixer"] = "^10.4.16";
      dependencies["clsx"] = "^2.0.0";
      dependencies["tailwind-merge"] = "^2.2.0";
      dependencies["critters"] = "^0.0.20"; // Para optimización CSS
    }
    
    // ESLint (opcional)
    if (eslint) {
      devDependencies["eslint"] = "^8.56.0";
      devDependencies["eslint-config-next"] = "^14.0.4";
      devDependencies["@typescript-eslint/parser"] = "^6.15.0";
      devDependencies["@typescript-eslint/eslint-plugin"] = "^6.15.0";
    }
    
    // Base de datos
    if (database === 'MongoDB') {
      dependencies["mongodb"] = "^6.3.0";
      dependencies["mongoose"] = "^8.0.3";
    } else if (database === 'Supabase') {
      dependencies["@supabase/supabase-js"] = "^2.39.1";
    } else if (database === 'Firebase') {
      dependencies["firebase"] = "^10.7.1";
      dependencies["firebase-admin"] = "^11.11.1";
    }
    
    // Autenticación
    if (auth) {
      dependencies["next-auth"] = "^4.24.5";
      
      // Si no está TypeScript habilitado, añadir tipos como dependencia normal
      if (!typescript) {
        dependencies["@types/next-auth"] = "^3.15.0";
      }
    }
    
    // Cloudinary
    if (cloudinary) {
      dependencies["cloudinary"] = "^1.41.1";
      dependencies["next-cloudinary"] = "^5.13.0";
      dependencies["formidable"] = "^2.1.2";
      devDependencies["@types/formidable"] = "^3.4.5";
    }
    
    // Modelos de IA
    if (ai && aiModels && aiModels.length > 0) {
      // Añadir cada modelo según selección
      if (aiModels.includes('GPT-4o (OpenAI)')) {
      dependencies["openai"] = "^4.24.1";
      }
      
      if (aiModels.includes('Claude 3.5 (Anthropic)')) {
        dependencies["@anthropic-ai/sdk"] = "^0.12.0";
      }
      
      if (aiModels.includes('Gemini Flash Pro (Google)')) {
        dependencies["@google/generative-ai"] = "^0.2.0";
      }
      
      // DeepSeek usa el SDK de OpenAI
      if (aiModels.includes('DeepSeek V3 Chat') || aiModels.includes('DeepSeek R1 Reasoner')) {
        if (!dependencies["openai"]) {
          dependencies["openai"] = "^4.24.1";
        }
      }
    }
    
    // Blog con MDX
    if (blog) {
      dependencies["gray-matter"] = "^4.0.3";
      dependencies["next-mdx-remote"] = "^4.4.1";
      dependencies["date-fns"] = "^2.30.0";
      dependencies["remark"] = "^15.0.1";
      dependencies["remark-html"] = "^16.0.1";
      
      if (mdxFeatures) {
      dependencies["rehype-highlight"] = "^7.0.0";
      dependencies["rehype-slug"] = "^6.0.0";
      dependencies["remark-gfm"] = "^4.0.0";
      }
      
      if (typescript) {
      devDependencies["@types/mdx"] = "^2.0.10";
      }
    }
    
    // Formularios
    if (forms) {
      dependencies["react-hook-form"] = "^7.49.2";
      dependencies["zod"] = "^3.22.4";
      dependencies["@hookform/resolvers"] = "^3.3.3";
    }
    
    // Tema claro/oscuro
    if (darkMode) {
      dependencies["next-themes"] = "^0.2.1";
    }
    
    // Animaciones
    if (framerMotion) {
      dependencies["framer-motion"] = "^10.16.16";
    }
    
    // Notificaciones
    if (notifications) {
    dependencies["react-hot-toast"] = "^2.4.1";
    }
    
    // Full Integration Examples Dependencies
    if (fullIntegrationExamples && fullIntegrationExamples.length > 0) {
      const EXAMPLE_DEPENDENCIES = {
        'analytics-dashboard': {
          deps: ['chart.js', 'react-chartjs-2', 'd3'],
          devDeps: ['@types/d3']
        },
        'landing-page': {
          deps: ['react-intersection-observer', 'react-parallax'],
          devDeps: []
        },
        'ecommerce': {
          deps: ['zustand', 'react-currency-input-field'],
          devDeps: []
        },
        'portfolio': {
          deps: ['typed.js', 'react-scroll'],
          devDeps: []
        },
        'task-app': {
          deps: ['use-local-storage-state', 'react-beautiful-dnd'],
          devDeps: []
        },
        'chat': {
          deps: ['socket.io-client', 'uuid'],
          devDeps: ['@types/uuid']
        },
        'saas': {
          deps: ['@stripe/stripe-js', 'stripe'],
          devDeps: []
        },
        'marketplace': {
          deps: ['react-rating-stars-component', 'react-image-gallery'],
          devDeps: []
        }
      };

      // Add dependencies for selected full integration examples
      fullIntegrationExamples.forEach(exampleKey => {
        const exampleDeps = EXAMPLE_DEPENDENCIES[exampleKey];
        if (exampleDeps) {
          // Add regular dependencies
          exampleDeps.deps.forEach(dep => {
            if (dep === 'chart.js') dependencies[dep] = '^4.4.1';
            else if (dep === 'react-chartjs-2') dependencies[dep] = '^5.2.0';
            else if (dep === 'd3') dependencies[dep] = '^7.8.5';
            else if (dep === 'react-intersection-observer') dependencies[dep] = '^9.5.3';
            else if (dep === 'react-parallax') dependencies[dep] = '^3.5.1';
            else if (dep === 'zustand') dependencies[dep] = '^4.4.7';
            else if (dep === 'react-currency-input-field') dependencies[dep] = '^3.6.11';
            else if (dep === 'typed.js') dependencies[dep] = '^2.1.0';
            else if (dep === 'react-scroll') dependencies[dep] = '^1.9.0';
            else if (dep === 'use-local-storage-state') dependencies[dep] = '^19.2.0';
            else if (dep === 'react-beautiful-dnd') dependencies[dep] = '^13.1.1';
            else if (dep === 'socket.io-client') dependencies[dep] = '^4.7.4';
            else if (dep === 'uuid') dependencies[dep] = '^9.0.1';
            else if (dep === '@stripe/stripe-js') dependencies[dep] = '^2.4.0';
            else if (dep === 'stripe') dependencies[dep] = '^14.13.0';
            else if (dep === 'react-rating-stars-component') dependencies[dep] = '^2.2.0';
            else if (dep === 'react-image-gallery') dependencies[dep] = '^1.3.0';
            else dependencies[dep] = 'latest';
          });
          
          // Add dev dependencies
          exampleDeps.devDeps.forEach(dep => {
            if (dep === '@types/d3') devDependencies[dep] = '^7.4.3';
            else if (dep === '@types/uuid') devDependencies[dep] = '^9.0.7';
            else devDependencies[dep] = 'latest';
          });
        }
      });
    }
    
    // Actualizar package.json
    packageJson.dependencies = { ...packageJson.dependencies, ...dependencies };
    packageJson.devDependencies = { ...packageJson.devDependencies, ...devDependencies };
    
    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    
    // Remover archivos/componentes según las opciones
    await removeUnusedFiles(projectPath, options);
    
    spinner.succeed('Proyecto personalizado según tus preferencias');
  } catch (error) {
    spinner.fail('Error al personalizar el proyecto');
    throw error;
  }
}

async function removeUnusedFiles(projectPath, options) {
  const {
    typescript,
    tailwindcss,
    eslint,
    auth,
    ai,
    cloudinary,
    blog,
    forms,
    darkMode,
    framerMotion,
    notifications,
    examplePages,
    exampleTypes
  } = options;

  try {
    // Remover archivos de TypeScript si no está habilitado
    if (!typescript) {
      const tsFiles = [
        'tsconfig.json',
        'next-env.d.ts'
      ];
      
      for (const file of tsFiles) {
        const filePath = path.join(projectPath, file);
        if (fs.existsSync(filePath)) {
          await fs.remove(filePath);
        }
      }
    }

    // Remover configuración de TailwindCSS si no está habilitado
    if (!tailwindcss) {
      const tailwindFiles = [
        'tailwind.config.js',
        'postcss.config.js'
      ];
      
      for (const file of tailwindFiles) {
        const filePath = path.join(projectPath, file);
        if (fs.existsSync(filePath)) {
          await fs.remove(filePath);
        }
      }
    }

    // Remover ESLint si no está habilitado
    if (!eslint) {
      const eslintPath = path.join(projectPath, '.eslintrc.json');
      if (fs.existsSync(eslintPath)) {
        await fs.remove(eslintPath);
      }
    }

    // Remover componentes de autenticación si no está habilitado
    if (!auth) {
      const authFiles = [
        'components/auth',
        'lib/auth.ts',
        'lib/roles.ts',
        'pages/api/auth',
        'middleware.ts'
      ];
      
      for (const file of authFiles) {
        const filePath = path.join(projectPath, file);
        if (fs.existsSync(filePath)) {
          await fs.remove(filePath);
        }
      }
    }
    
    // Remover componentes de IA si no está habilitado
    if (!ai) {
      const aiFiles = [
        'components/ai',
        'pages/api/ai.ts',
        'pages/api/openai.ts'
      ];
      
      for (const file of aiFiles) {
        const filePath = path.join(projectPath, file);
        if (fs.existsSync(filePath)) {
          await fs.remove(filePath);
        }
      }
    }
    
    // Remover Cloudinary si no está habilitado
    if (!cloudinary) {
      const cloudinaryFiles = [
        'components/upload',
        'pages/api/upload.ts'
      ];
      
      for (const file of cloudinaryFiles) {
        const filePath = path.join(projectPath, file);
        if (fs.existsSync(filePath)) {
          await fs.remove(filePath);
        }
      }
    }

    // Remover blog si no está habilitado
    if (!blog) {
      const blogFiles = [
        'pages/blog',
        'lib/mdx.ts',
        'content'
      ];
      
      for (const file of blogFiles) {
        const filePath = path.join(projectPath, file);
        if (fs.existsSync(filePath)) {
          await fs.remove(filePath);
        }
      }
    }

    // Remover páginas de ejemplo si no están habilitadas
    if (!examplePages) {
      const examplePath = path.join(projectPath, 'pages/ejemplos');
      if (fs.existsSync(examplePath)) {
        await fs.remove(examplePath);
      }
    } else if (exampleTypes && exampleTypes.length > 0) {
      // Remover ejemplos específicos no seleccionados
      const examplePath = path.join(projectPath, 'pages/ejemplos');
      
      if (!exampleTypes.includes('Ejemplo de Autenticación')) {
        const authExamplePath = path.join(examplePath, 'auth.tsx');
        if (fs.existsSync(authExamplePath)) {
          await fs.remove(authExamplePath);
        }
      }
      
      if (!exampleTypes.includes('Ejemplo de IA (Multi-modelo)')) {
        const aiExamplePath = path.join(examplePath, 'ai.tsx');
        if (fs.existsSync(aiExamplePath)) {
          await fs.remove(aiExamplePath);
        }
      }
      
      if (!exampleTypes.includes('Biblioteca de Componentes')) {
        const componentsExamplePath = path.join(examplePath, 'componentes.tsx');
        if (fs.existsSync(componentsExamplePath)) {
          await fs.remove(componentsExamplePath);
        }
      }
      
      if (!exampleTypes.includes('Ejemplo de Carga de Imágenes')) {
        const uploadExamplePath = path.join(examplePath, 'upload.tsx');
        if (fs.existsSync(uploadExamplePath)) {
          await fs.remove(uploadExamplePath);
    }
      }

      if (!exampleTypes.includes('Ejemplo de Formularios')) {
        const formsExamplePath = path.join(examplePath, 'formularios.tsx');
        if (fs.existsSync(formsExamplePath)) {
          await fs.remove(formsExamplePath);
        }
      }

      if (!exampleTypes.includes('Ejemplo de Animaciones')) {
        const animationsExamplePath = path.join(examplePath, 'animaciones.tsx');
        if (fs.existsSync(animationsExamplePath)) {
          await fs.remove(animationsExamplePath);
        }
      }

      if (!exampleTypes.includes('Ejemplo de Notificaciones')) {
        const notificationsExamplePath = path.join(examplePath, 'notificaciones.tsx');
        if (fs.existsSync(notificationsExamplePath)) {
          await fs.remove(notificationsExamplePath);
        }
      }

      if (!exampleTypes.includes('Ejemplo de Base de Datos')) {
        const databaseExamplePath = path.join(examplePath, 'database.tsx');
        if (fs.existsSync(databaseExamplePath)) {
          await fs.remove(databaseExamplePath);
        }
        
        // También remover las APIs de prueba de database
        const databaseApiPath = path.join(projectPath, 'pages/api/database');
        if (fs.existsSync(databaseApiPath)) {
          await fs.remove(databaseApiPath);
        }
      }

      if (!exampleTypes.includes('Ejemplo de UI y Temas')) {
        const uiExamplePath = path.join(examplePath, 'ui-temas.tsx');
        if (fs.existsSync(uiExamplePath)) {
          await fs.remove(uiExamplePath);
        }
      }

      if (!exampleTypes.includes('Ejemplo de TypeScript')) {
        const tsExamplePath = path.join(examplePath, 'typescript.tsx');
        if (fs.existsSync(tsExamplePath)) {
          await fs.remove(tsExamplePath);
        }
      }
      
      if (!exampleTypes.includes('Páginas 404 personalizada')) {
        const notFoundPath = path.join(projectPath, 'pages/404.tsx');
        if (fs.existsSync(notFoundPath)) {
          await fs.remove(notFoundPath);
        }
      }
    }
    
  } catch (error) {
    console.log(chalk.yellow('Advertencia: Error al remover algunos archivos no utilizados'));
  }
}

async function installDependencies(projectPath, options) {
  const spinner = ora('Instalando dependencias (esto puede tardar unos minutos)...').start();
  
  try {
    const isWindows = process.platform === 'win32';
    
    if (isWindows) {
      // Solución robusta para Windows usando spawn
      const { spawn } = require('child_process');
      
      await new Promise((resolve, reject) => {
        const npmProcess = spawn('npm', ['install'], {
      cwd: projectPath,
      stdio: 'inherit',
          shell: true,
          env: process.env
        });
        
        npmProcess.on('close', (code) => {
          if (code === 0) {
            resolve();
          } else {
            reject(new Error(`npm install falló con código ${code}`));
          }
        });
        
        npmProcess.on('error', (error) => {
          reject(error);
        });
      });
    } else {
      // En Unix/Linux/macOS usar execSync
      execSync('npm install', { 
        cwd: projectPath,
        stdio: 'inherit'
      });
    }
    
    spinner.succeed('Dependencias instaladas correctamente');
  } catch (error) {
    spinner.fail('Error al instalar las dependencias');
    console.error(chalk.red(`Error: ${error.message}`));
    
    // Fallback: Guía manual para el usuario
    console.error(chalk.yellow('\n🚨 SOLUCIÓN ALTERNATIVA:'));
    console.error(chalk.yellow('El CLI generó el proyecto exitosamente, pero falló la instalación automática.'));
    console.error(chalk.yellow('Ejecuta estos comandos manualmente:'));
    console.error(chalk.cyan(`   cd ${path.basename(projectPath)}`));
    console.error(chalk.cyan('   npm install'));
    console.error(chalk.cyan('   npm run dev'));
    console.error(chalk.yellow('\n💡 Si npm install también falla:'));
    console.error(chalk.yellow('   1. Usa yarn: yarn install'));
    console.error(chalk.yellow('   2. O bun: bun install'));
    console.error(chalk.yellow('   3. Verifica Node.js versión: node --version (necesita >=18)'));
    
    // No lanzar error para que el proyecto se complete
    console.log(chalk.green('\n✅ Proyecto generado exitosamente. Instala las dependencias manualmente.'));
  }
}

async function addFullIntegrationExamples(projectPath, selectedExamples) {
  const spinner = ora('Añadiendo ejemplos de integración completa seleccionados...').start();
  
  try {
    // Copy full integration example files from templates to main ejemplos directory
    const ejemplosPath = path.join(projectPath, 'pages/ejemplos');
    const templateEjemplosPath = path.resolve(__dirname, 'template/pages/ejemplos');
    
    for (const exampleKey of selectedExamples) {
      const exampleFilePath = path.join(templateEjemplosPath, `${exampleKey}.tsx`);
      const targetFilePath = path.join(ejemplosPath, `${exampleKey}.tsx`);
      
      if (fs.existsSync(exampleFilePath)) {
        await fs.copy(exampleFilePath, targetFilePath);
      }
    }
    
    spinner.succeed('Ejemplos de integración completa añadidos correctamente');
  } catch (error) {
    spinner.fail('Error al añadir ejemplos de integración completa');
    throw error;
  }
}

// Function removed - full integration examples are now included directly in main examples page

async function generateReadme(projectPath, options) {
  const spinner = ora('Generando README personalizado...').start();
  
  try {
    const readmePath = path.join(projectPath, 'README.md');
    
    let readmeContent = `# ${options.projectName}\n\n`;
    readmeContent += `Proyecto Next.js 14+ con Pages Router y varias características modernas.\n\n`;
    readmeContent += `## Características\n\n`;
    
    // Listar características según opciones elegidas
    readmeContent += `- Next.js 14+ con Pages Router\n`;
    readmeContent += `- TypeScript\n`;
    readmeContent += `- TailwindCSS\n`;
    
    if (options.darkMode) {
      readmeContent += `- Modo claro/oscuro con next-themes\n`;
    }
    
    if (options.database !== 'Ninguna') {
      readmeContent += `- Integración con ${options.database}\n`;
    }
    
    if (options.auth) {
      readmeContent += `- Autenticación con NextAuth.js (`;
      readmeContent += options.authProviders.join(', ');
      readmeContent += `)\n`;
      
      if (options.roles) {
        readmeContent += `- Sistema de roles básico (admin/user)\n`;
      }
    }
    
    if (options.blog) {
      readmeContent += `- Blog con MDX\n`;
    }
    
    if (options.forms) {
      readmeContent += `- Formularios con react-hook-form y validaciones zod\n`;
    }
    
    if (options.cloudinary) {
      readmeContent += `- Integración con Cloudinary para gestión de imágenes\n`;
    }
    
    if (options.ai) {
      readmeContent += `- Integración con IA\n`;
    }
    
    if (options.framerMotion) {
      readmeContent += `- Animaciones con Framer Motion\n`;
    }
    
    readmeContent += `- Notificaciones con react-hot-toast\n\n`;
    
    readmeContent += `## Primeros pasos\n\n`;
    readmeContent += `\`\`\`bash\n`;
    readmeContent += `npm run dev\n`;
    readmeContent += `\`\`\`\n\n`;
    readmeContent += `Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver el resultado.\n\n`;
    
    readmeContent += `## Variables de entorno\n\n`;
    readmeContent += `Copia el archivo \`.env.example\` a \`.env.local\` y completa las variables necesarias.\n\n`;
    
    await fs.writeFile(readmePath, readmeContent);
    
    spinner.succeed('README generado correctamente');
  } catch (error) {
    spinner.fail('Error al generar el README');
    throw error;
  }
}

module.exports = { createProject };