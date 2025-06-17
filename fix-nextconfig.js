#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Arreglando next.config.js...');

const nextConfigPath = path.join(process.cwd(), 'next.config.js');

if (!fs.existsSync(nextConfigPath)) {
  console.error('❌ Error: next.config.js no encontrado en el directorio actual');
  process.exit(1);
}

const correctConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Configuración para MDX
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
}

module.exports = nextConfig
`;

try {
  fs.writeFileSync(nextConfigPath, correctConfig);
  console.log('✅ next.config.js arreglado correctamente');
  console.log('🚀 Ahora puedes ejecutar: npm run dev');
} catch (error) {
  console.error('❌ Error al escribir el archivo:', error.message);
  process.exit(1);
} 