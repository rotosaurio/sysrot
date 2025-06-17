# 🚀 Deployment y CI/CD - SysrotCore

Este documento explica cómo funciona el sistema de CI/CD automático de SysrotCore.

## 📦 Publicación Automática en NPM

SysrotCore está configurado con GitHub Actions para publicación automática en NPM cada vez que se hace push a la rama `main`.

### ⚙️ Configuración Requerida

Para que el CI/CD funcione, necesitas configurar estos secrets en GitHub:

1. **NPM_TOKEN**: Token de NPM con permisos de publicación
   - Ve a [npmjs.com](https://www.npmjs.com/settings/tokens)
   - Crea un "Automation" token
   - Agrega el token en GitHub Settings > Secrets > NPM_TOKEN

2. **GITHUB_TOKEN**: Se configura automáticamente por GitHub Actions

### 🔄 Flujo de Trabajo

1. **Actualizar versión** en `package.json`:
   ```bash
   npm run version:patch  # Para bug fixes (2.1.4 → 2.1.5)
   npm run version:minor  # Para features (2.1.4 → 2.2.0)
   npm run version:major  # Para breaking changes (2.1.4 → 3.0.0)
   ```

2. **Commit y push** a main:
   ```bash
   git add .
   git commit -m "chore: release v2.1.5"
   git push origin main
   ```

3. **GitHub Actions automáticamente**:
   - ✅ Instala dependencias
   - ✅ Ejecuta tests
   - ✅ Verifica si la versión ya existe en NPM
   - ✅ Publica en NPM (si es nueva versión)
   - ✅ Crea tag de Git
   - ✅ Crea GitHub Release

### 📋 Checklist para Release

Antes de hacer push a main:

- [ ] Versión actualizada en `package.json`
- [ ] CHANGELOG.md actualizado con cambios
- [ ] Tests pasando localmente
- [ ] Documentación actualizada si es necesario
- [ ] Commits siguiendo convenciones

### 🛑 Troubleshooting

**Error: "npm ERR! 403 Forbidden"**
- Verifica que NPM_TOKEN tenga permisos de publicación
- Confirma que el token no haya expirado

**Error: "Version already exists"**
- El workflow solo publica versiones nuevas
- Incrementa la versión en package.json

**Tests fallando**
- El workflow requiere que `npm test` pase
- Verifica que el CLI funcione correctamente

### 📊 Monitoring

Puedes monitorear las publicaciones en:
- [GitHub Actions](https://github.com/rotosaurio/sysrot/actions)
- [NPM Package](https://www.npmjs.com/package/sysrotcore)
- [GitHub Releases](https://github.com/rotosaurio/sysrot/releases)

### 🔧 Configuración Manual

Si necesitas publicar manualmente:

```bash
# Instalar dependencias
npm ci

# Ejecutar tests
npm test

# Publicar en NPM
npm publish
```

## 🌐 Distribución

Una vez publicado en NPM, los usuarios pueden instalar con:

```bash
# Última versión estable
npx sysrot create mi-proyecto

# Versión específica
npx sysrotcore@2.1.4 create mi-proyecto

# Instalación global
npm install -g sysrotcore
sysrot create mi-proyecto
``` 