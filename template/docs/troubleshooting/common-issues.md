# 🐛 Common Issues & Troubleshooting Guide

This guide covers the most common issues you might encounter when using the sysrot-hub template and their solutions.

## 📋 Quick Diagnostics

Before diving into specific issues, run these quick checks:

```bash
# Check Node.js version (should be 18+)
node --version

# Check npm version
npm --version

# Verify Next.js installation
npx next --version

# Check for TypeScript issues
npx tsc --noEmit

# Verify environment variables
npm run check-env  # Custom script to validate .env variables
```

## 🚀 Installation & Setup Issues

### Issue: `npm install` fails with ERESOLVE errors

**Symptoms:**
```bash
npm ERR! ERESOLVE unable to resolve dependency tree
npm ERR! peer dep missing: react@^18.0.0, required by @next/font@13.0.0
```

**Solutions:**

1. **Use correct Node.js version:**
   ```bash
   # Use Node.js 18.x or 20.x
   nvm use 18
   # or
   nvm use 20
   ```

2. **Clear npm cache:**
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Use legacy peer deps (temporary fix):**
   ```bash
   npm install --legacy-peer-deps
   ```

### Issue: TypeScript compilation errors

**Symptoms:**
```
Type error: Cannot find module 'react' or its corresponding type declarations
```

**Solutions:**

1. **Reinstall React types:**
   ```bash
   npm install --save-dev @types/react @types/react-dom @types/node
   ```

2. **Check tsconfig.json configuration:**
   ```json
   {
     "compilerOptions": {
       "lib": ["dom", "dom.iterable", "esnext"],
       "allowJs": true,
       "skipLibCheck": true,
       "strict": true,
       "forceConsistentCasingInFileNames": true,
       "noEmit": true,
       "esModuleInterop": true,
       "module": "esnext",
       "moduleResolution": "node",
       "resolveJsonModule": true,
       "isolatedModules": true,
       "jsx": "preserve",
       "incremental": true,
       "plugins": [{ "name": "next" }],
       "paths": {
         "@/*": ["./*"]
       }
     },
     "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
     "exclude": ["node_modules"]
   }
   ```

## 🔐 Authentication Issues

### Issue: NextAuth.js session not persisting

**Symptoms:**
- User gets logged out after page refresh
- `useSession()` returns null even after successful login

**Solutions:**

1. **Check NEXTAUTH_SECRET environment variable:**
   ```bash
   # Generate a new secret
   openssl rand -base64 32
   
   # Add to .env.local
   NEXTAUTH_SECRET=your-generated-secret-here
   ```

2. **Verify NEXTAUTH_URL:**
   ```bash
   # For development
   NEXTAUTH_URL=http://localhost:3000
   
   # For production
   NEXTAUTH_URL=https://yourdomain.com
   ```

3. **Check session provider wrapping:**
   ```tsx
   // pages/_app.tsx
   import { SessionProvider } from 'next-auth/react'
   
   export default function App({
     Component,
     pageProps: { session, ...pageProps }
   }) {
     return (
       <SessionProvider session={session}>
         <Component {...pageProps} />
       </SessionProvider>
     )
   }
   ```

### Issue: OAuth providers not working

**Symptoms:**
- "Configuration error" when trying to sign in
- Redirect loops during authentication

**Solutions:**

1. **Verify OAuth app configuration:**
   ```bash
   # Check that redirect URIs match exactly
   # For Google: http://localhost:3000/api/auth/callback/google
   # For GitHub: http://localhost:3000/api/auth/callback/github
   ```

2. **Double-check environment variables:**
   ```bash
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   GITHUB_CLIENT_ID=your-client-id
   GITHUB_CLIENT_SECRET=your-client-secret
   ```

## 🗄️ Database Connection Issues

### Issue: MongoDB connection timeout

**Symptoms:**
```
MongoNetworkTimeoutError: connection timed out
```

**Solutions:**

1. **Check connection string format:**
   ```bash
   # Correct format
   DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority"
   ```

2. **Verify network access:**
   ```bash
   # Whitelist your IP in MongoDB Atlas
   # Or use 0.0.0.0/0 for development (not recommended for production)
   ```

3. **Test connection manually:**
   ```javascript
   // test-db.js
   const { MongoClient } = require('mongodb')
   
   async function testConnection() {
     try {
       const client = new MongoClient(process.env.DATABASE_URL)
       await client.connect()
       console.log('✅ Connected successfully to MongoDB')
       await client.close()
     } catch (error) {
       console.error('❌ MongoDB connection failed:', error)
     }
   }
   
   testConnection()
   ```

### Issue: Supabase queries failing

**Symptoms:**
```
Error: Invalid API key
supabase.auth is not a function
```

**Solutions:**

1. **Verify Supabase environment variables:**
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

2. **Check Supabase client initialization:**
   ```typescript
   // lib/supabase.ts
   import { createClient } from '@supabase/supabase-js'
   
   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
   const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
   
   export const supabase = createClient(supabaseUrl, supabaseKey)
   ```

## 🎨 UI & Styling Issues

### Issue: TailwindCSS styles not applying

**Symptoms:**
- Classes like `bg-blue-500` not working
- Styles working in development but not in production

**Solutions:**

1. **Check tailwind.config.js:**
   ```javascript
   /** @type {import('tailwindcss').Config} */
   module.exports = {
     content: [
       './pages/**/*.{js,ts,jsx,tsx,mdx}',
       './components/**/*.{js,ts,jsx,tsx,mdx}',
       './app/**/*.{js,ts,jsx,tsx,mdx}',
     ],
     theme: {
       extend: {},
     },
     plugins: [],
   }
   ```

2. **Verify CSS imports:**
   ```css
   /* styles/globals.css */
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

3. **Purge unused styles (for production):**
   ```bash
   # Rebuild with proper content paths
   npm run build
   ```

### Issue: Dark mode not working

**Symptoms:**
- Theme toggle doesn't switch themes
- `dark:` classes not applying

**Solutions:**

1. **Check next-themes configuration:**
   ```tsx
   // components/theme-provider.tsx
   import { ThemeProvider } from 'next-themes'
   
   export default function Providers({ children }) {
     return (
       <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
         {children}
       </ThemeProvider>
     )
   }
   ```

2. **Verify HTML class application:**
   ```html
   <!-- Should see class="dark" on html element -->
   <html class="dark">
   ```

## 📤 File Upload Issues

### Issue: Cloudinary upload failing

**Symptoms:**
```
Error: Invalid API credentials
Upload failed with status 401
```

**Solutions:**

1. **Verify Cloudinary credentials:**
   ```bash
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

2. **Check upload preset (if using unsigned uploads):**
   ```javascript
   // Cloudinary dashboard → Settings → Upload → Upload presets
   CLOUDINARY_UPLOAD_PRESET=your-upload-preset
   ```

3. **Test Cloudinary configuration:**
   ```javascript
   // test-cloudinary.js
   const cloudinary = require('cloudinary').v2
   
   cloudinary.config({
     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
     api_key: process.env.CLOUDINARY_API_KEY,
     api_secret: process.env.CLOUDINARY_API_SECRET
   })
   
   cloudinary.api.ping().then(console.log).catch(console.error)
   ```

## 🤖 AI Integration Issues

### Issue: OpenAI API calls failing

**Symptoms:**
```
Error: Incorrect API key provided
Rate limit exceeded
```

**Solutions:**

1. **Verify API key:**
   ```bash
   # Check that API key starts with sk-
   OPENAI_API_KEY=sk-your-api-key-here
   ```

2. **Check rate limits and billing:**
   ```bash
   # Visit: https://platform.openai.com/account/usage
   # Ensure you have credits and haven't exceeded rate limits
   ```

3. **Implement retry logic:**
   ```typescript
   // lib/openai-client.ts
   import OpenAI from 'openai'
   
   const openai = new OpenAI({
     apiKey: process.env.OPENAI_API_KEY,
     maxRetries: 3,
   })
   
   export async function generateResponse(prompt: string) {
     try {
       const response = await openai.chat.completions.create({
         model: 'gpt-4o',
         messages: [{ role: 'user', content: prompt }],
         max_tokens: 1000,
       })
       return response.choices[0]?.message?.content
     } catch (error) {
       if (error.status === 429) {
         // Rate limit - implement exponential backoff
         await new Promise(resolve => setTimeout(resolve, 1000))
         return generateResponse(prompt) // Retry
       }
       throw error
     }
   }
   ```

## 🚀 Performance Issues

### Issue: Slow page loads

**Symptoms:**
- Pages take more than 3 seconds to load
- Large bundle sizes
- Poor Core Web Vitals

**Solutions:**

1. **Analyze bundle size:**
   ```bash
   # Install bundle analyzer
   npm install --save-dev @next/bundle-analyzer
   
   # Add to next.config.js
   const withBundleAnalyzer = require('@next/bundle-analyzer')({
     enabled: process.env.ANALYZE === 'true',
   })
   
   # Analyze bundle
   ANALYZE=true npm run build
   ```

2. **Implement code splitting:**
   ```typescript
   // Use dynamic imports for heavy components
   import dynamic from 'next/dynamic'
   
   const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
     loading: () => <p>Loading...</p>,
     ssr: false // If component doesn't need SSR
   })
   ```

3. **Optimize images:**
   ```tsx
   import Image from 'next/image'
   
   // Use Next.js Image component
   <Image
     src="/image.jpg"
     alt="Description"
     width={800}
     height={600}
     priority // For above-the-fold images
   />
   ```

## 🔧 Development Tools Issues

### Issue: ESLint/Prettier conflicts

**Symptoms:**
- Formatting keeps changing back and forth
- ESLint errors about formatting

**Solutions:**

1. **Configure ESLint to work with Prettier:**
   ```json
   // .eslintrc.json
   {
     "extends": [
       "next/core-web-vitals",
       "prettier"
     ],
     "rules": {
       "prettier/prettier": "error"
     }
   }
   ```

2. **Add Prettier config:**
   ```json
   // .prettierrc
   {
     "semi": false,
     "singleQuote": true,
     "tabWidth": 2,
     "trailingComma": "es5"
   }
   ```

### Issue: Hot reload not working

**Symptoms:**
- Changes not reflecting without manual refresh
- `npm run dev` not watching files

**Solutions:**

1. **Check file watching limits (Linux/Mac):**
   ```bash
   # Increase file watching limit
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```

2. **Restart development server:**
   ```bash
   # Kill all Node processes and restart
   pkill -f node
   npm run dev
   ```

## 📱 Mobile/Responsive Issues

### Issue: Layout breaks on mobile

**Symptoms:**
- Horizontal scrolling on mobile
- Text too small or buttons too close

**Solutions:**

1. **Use proper viewport meta tag:**
   ```html
   <!-- pages/_document.tsx -->
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   ```

2. **Test responsive design:**
   ```css
   /* Use Tailwind responsive prefixes */
   <div className="w-full md:w-1/2 lg:w-1/3">
   
   /* Or custom media queries */
   @media (max-width: 768px) {
     .container {
       padding: 1rem;
     }
   }
   ```

## 🔍 Debugging Tips

### Enable Debug Mode

```bash
# Enable Next.js debug mode
DEBUG=* npm run dev

# Enable specific debug namespaces
DEBUG=next:* npm run dev
```

### Use Browser DevTools

1. **Network Tab**: Check for failed API requests
2. **Console**: Look for JavaScript errors
3. **Application Tab**: Inspect localStorage, cookies, service workers
4. **Lighthouse**: Analyze performance issues

### Server-Side Debugging

```typescript
// Add logging to API routes
export default function handler(req, res) {
  console.log('API called:', req.method, req.url)
  console.log('Request body:', req.body)
  console.log('Request headers:', req.headers)
  
  // Your API logic here
  
  console.log('Response:', responseData)
  res.json(responseData)
}
```

## 📞 Getting Help

If you're still experiencing issues:

1. **Check the documentation**: [Complete Documentation](../README.md)
2. **Search existing issues**: [GitHub Issues](https://github.com/rotosaurio/sysrotcore/issues)
3. **Create a new issue**: Provide detailed information including:
   - Node.js and npm versions
   - Operating system
   - Steps to reproduce
   - Error messages
   - Relevant code snippets

## 🔄 Regular Maintenance

### Weekly Checks

```bash
# Update dependencies
npm update

# Check for security vulnerabilities
npm audit

# Run type checking
npx tsc --noEmit

# Run linting
npm run lint
```

### Monthly Tasks

```bash
# Update Node.js to latest LTS
nvm install --lts
nvm use --lts

# Review and update dependencies
npx npm-check-updates -u
npm install

# Clean up unused dependencies
npx depcheck
```

---

**Need more help?** Check our [Best Practices Guide](../best-practices/nextjs-best-practices.md) or [Performance Optimization Guide](../best-practices/performance-optimization.md).