# 📚 Step-by-Step Example Guides

## Overview

This guide provides detailed, step-by-step instructions for each example included in your sysrot-hub generated project. Each section includes code explanations, best practices, and common pitfalls to avoid.

## 🤖 AI Integration Example (`/ejemplos/ai`)

### Step 1: Understanding the Multi-Model Setup

```typescript
// pages/ejemplos/ai.tsx
import { useState } from 'react'
import OpenAIPrompt from '../../components/ai/openai-prompt'

export default function AIExample() {
  const [response, setResponse] = useState('')
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1>Multi-Model AI Integration</h1>
      <OpenAIPrompt onResponse={setResponse} />
      {response && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          {response}
        </div>
      )}
    </div>
  )
}
```

**Key Points:**
- ✅ Uses a unified component for all AI models
- ✅ Handles responses asynchronously
- ✅ Includes error handling
- ✅ Supports streaming responses

### Step 2: Component Implementation

```typescript
// components/ai/openai-prompt.tsx
interface OpenAIPromptProps {
  onResponse: (response: string) => void;
  modelType?: 'gpt-4o' | 'claude-3.5-sonnet' | 'gemini-flash-pro';
}

export default function OpenAIPrompt({ onResponse, modelType = 'gpt-4o' }: OpenAIPromptProps) {
  // Implementation details...
}
```

### Step 3: API Route Configuration

```typescript
// pages/api/ai.ts
import { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { prompt, model = 'gpt-4o' } = req.body
  
  try {
    switch (model) {
      case 'gpt-4o':
        // OpenAI implementation
        break
      case 'claude-3.5-sonnet':
        // Anthropic implementation
        break
      case 'gemini-flash-pro':
        // Google Gemini implementation
        break
    }
  } catch (error) {
    res.status(500).json({ error: 'AI service error' })
  }
}
```

**Best Practices:**
- Always validate API keys before making requests
- Implement rate limiting for production use
- Handle different error types gracefully
- Use streaming for better UX with long responses

---

## 🔐 Authentication Example (`/ejemplos/auth`)

### Step 1: NextAuth.js Configuration

```typescript
// lib/auth.ts
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    },
  },
})
```

### Step 2: Protected Route Implementation

```typescript
// middleware.ts
import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    // Middleware logic for protected routes
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Protect admin routes
        if (pathname.startsWith('/admin')) {
          return token?.role === 'admin'
        }
        
        // Protect user dashboard
        if (pathname.startsWith('/dashboard')) {
          return !!token
        }
        
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*']
}
```

### Step 3: Role-Based Access Control

```typescript
// lib/roles.ts
export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  MODERATOR: 'moderator'
} as const

export type Role = typeof ROLES[keyof typeof ROLES]

export function hasPermission(userRole: Role, requiredRole: Role): boolean {
  const roleHierarchy = {
    admin: 3,
    moderator: 2,
    user: 1
  }
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}
```

---

## 📤 File Upload Example (`/ejemplos/upload`)

### Step 1: Cloudinary Configuration

```typescript
// lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default cloudinary
```

### Step 2: Upload Component with Drag & Drop

```typescript
// components/upload/image-upload.tsx
import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

interface ImageUploadProps {
  onUpload: (url: string) => void;
  maxSize?: number; // in MB
  acceptedFormats?: string[];
}

export default function ImageUpload({ 
  onUpload, 
  maxSize = 5, 
  acceptedFormats = ['image/*'] 
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`)
      return
    }

    setUploading(true)
    
    try {
      // Create preview
      const previewUrl = URL.createObjectURL(file)
      setPreview(previewUrl)

      // Upload to Cloudinary
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      
      if (data.secure_url) {
        onUpload(data.secure_url)
      }
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }, [maxSize, onUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFormats.reduce((acc, format) => {
      acc[format] = []
      return acc
    }, {} as Record<string, string[]>),
    multiple: false
  })

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed p-8 rounded-lg text-center cursor-pointer
        transition-colors duration-200
        ${isDragActive 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-300 hover:border-blue-400'
        }
      `}
    >
      <input {...getInputProps()} />
      
      {uploading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2">Uploading...</span>
        </div>
      ) : preview ? (
        <div>
          <img src={preview} alt="Preview" className="max-h-32 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Upload successful!</p>
        </div>
      ) : (
        <div>
          <p className="text-lg mb-2">
            {isDragActive ? 'Drop the image here' : 'Drag & drop an image'}
          </p>
          <p className="text-sm text-gray-500">
            or click to select a file (max {maxSize}MB)
          </p>
        </div>
      )}
    </div>
  )
}
```

### Step 3: API Route Implementation

```typescript
// pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import cloudinary from '../../lib/cloudinary'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const form = formidable({
      maxFileSize: 5 * 1024 * 1024, // 5MB
    })

    const [fields, files] = await form.parse(req)
    const file = Array.isArray(files.file) ? files.file[0] : files.file

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.filepath, {
      folder: 'uploads',
      resource_type: 'auto',
      transformation: [
        { width: 1000, height: 1000, crop: 'limit' },
        { quality: 'auto' },
        { format: 'auto' }
      ]
    })

    res.status(200).json({
      secure_url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: 'Upload failed' })
  }
}
```

---

## 📋 Form Validation Example (`/ejemplos/formularios`)

### Step 1: Schema Definition with Zod

```typescript
// lib/schemas.ts
import { z } from 'zod'

export const userSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: z.string()
    .email('Please enter a valid email'),
  age: z.number()
    .min(18, 'Must be at least 18 years old')
    .max(120, 'Age must be realistic'),
  website: z.string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  bio: z.string()
    .max(500, 'Bio must be less than 500 characters')
    .optional(),
})

export type UserFormData = z.infer<typeof userSchema>
```

### Step 2: Form Component with React Hook Form

```typescript
// components/forms/user-form.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { userSchema, type UserFormData } from '../../lib/schemas'

interface UserFormProps {
  onSubmit: (data: UserFormData) => void;
  initialData?: Partial<UserFormData>;
}

export default function UserForm({ onSubmit, initialData }: UserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: initialData,
  })

  // Watch field for real-time validation feedback
  const watchedEmail = watch('email')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name *
        </label>
        <input
          {...register('name')}
          type="text"
          id="name"
          className={`
            mt-1 block w-full rounded-md border-gray-300 shadow-sm
            focus:border-blue-500 focus:ring-blue-500
            ${errors.name ? 'border-red-500' : ''}
          `}
          placeholder="Enter your name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email *
        </label>
        <input
          {...register('email')}
          type="email"
          id="email"
          className={`
            mt-1 block w-full rounded-md border-gray-300 shadow-sm
            focus:border-blue-500 focus:ring-blue-500
            ${errors.email ? 'border-red-500' : ''}
          `}
          placeholder="Enter your email"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
        {watchedEmail && !errors.email && (
          <p className="mt-1 text-sm text-green-600">✓ Valid email format</p>
        )}
      </div>

      {/* Age Field */}
      <div>
        <label htmlFor="age" className="block text-sm font-medium text-gray-700">
          Age *
        </label>
        <input
          {...register('age', { valueAsNumber: true })}
          type="number"
          id="age"
          min="18"
          max="120"
          className={`
            mt-1 block w-full rounded-md border-gray-300 shadow-sm
            focus:border-blue-500 focus:ring-blue-500
            ${errors.age ? 'border-red-500' : ''}
          `}
          placeholder="Enter your age"
        />
        {errors.age && (
          <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
        )}
      </div>

      {/* Website Field (Optional) */}
      <div>
        <label htmlFor="website" className="block text-sm font-medium text-gray-700">
          Website
        </label>
        <input
          {...register('website')}
          type="url"
          id="website"
          className={`
            mt-1 block w-full rounded-md border-gray-300 shadow-sm
            focus:border-blue-500 focus:ring-blue-500
            ${errors.website ? 'border-red-500' : ''}
          `}
          placeholder="https://yourwebsite.com"
        />
        {errors.website && (
          <p className="mt-1 text-sm text-red-600">{errors.website.message}</p>
        )}
      </div>

      {/* Bio Field (Optional) */}
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
          Bio
        </label>
        <textarea
          {...register('bio')}
          id="bio"
          rows={4}
          className={`
            mt-1 block w-full rounded-md border-gray-300 shadow-sm
            focus:border-blue-500 focus:ring-blue-500
            ${errors.bio ? 'border-red-500' : ''}
          `}
          placeholder="Tell us about yourself..."
        />
        {errors.bio && (
          <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`
          w-full flex justify-center py-2 px-4 border border-transparent
          rounded-md shadow-sm text-sm font-medium text-white
          ${isSubmitting 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          }
        `}
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  )
}
```

---

## 🎨 Theme System Example (`/ejemplos/ui-temas`)

### Step 1: Theme Provider Setup

```typescript
// components/theme-provider.tsx
import { ThemeProvider as NextThemeProvider } from 'next-themes'
import { ReactNode } from 'react'

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemeProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemeProvider>
  )
}
```

### Step 2: Theme Toggle Component

```typescript
// components/ui/theme-toggle.tsx
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium">Theme:</span>
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      >
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  )
}
```

---

## 💡 Common Patterns & Best Practices

### Error Handling Pattern

```typescript
// utils/error-handler.ts
export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export function handleAPIError(error: unknown) {
  if (error instanceof APIError) {
    return {
      error: error.message,
      status: error.status,
      code: error.code
    }
  }
  
  console.error('Unexpected error:', error)
  return {
    error: 'Internal server error',
    status: 500
  }
}
```

### Loading State Management

```typescript
// hooks/useAsyncOperation.ts
import { useState, useCallback } from 'react'

export function useAsyncOperation<T>() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<T | null>(null)

  const execute = useCallback(async (operation: () => Promise<T>) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await operation()
      setData(result)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setLoading(false)
    setError(null)
    setData(null)
  }, [])

  return { loading, error, data, execute, reset }
}
```

### Type-Safe Environment Variables

```typescript
// lib/env.ts
import { z } from 'zod'

const envSchema = z.object({
  NEXTAUTH_SECRET: z.string().min(1),
  NEXTAUTH_URL: z.string().url(),
  OPENAI_API_KEY: z.string().min(1).optional(),
  CLOUDINARY_CLOUD_NAME: z.string().min(1).optional(),
  DATABASE_URL: z.string().url().optional(),
})

export const env = envSchema.parse(process.env)
```

## 📝 Next Steps

After completing these examples, you should:

1. **Customize** the components to match your brand
2. **Extend** the functionality based on your requirements
3. **Test** all integrations thoroughly
4. **Deploy** to your preferred platform
5. **Monitor** performance and user feedback

For more advanced topics, check out our [Best Practices Guide](../best-practices/nextjs-best-practices.md) and [Performance Optimization Guide](../best-practices/performance-optimization.md).