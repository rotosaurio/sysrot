# 🏆 Next.js 14+ Best Practices Guide

## 📋 Table of Contents

- [Project Structure](#project-structure)
- [Performance Optimization](#performance-optimization)
- [SEO & Metadata](#seo--metadata)
- [Code Organization](#code-organization)
- [Error Handling](#error-handling)
- [Security Guidelines](#security-guidelines)
- [Testing Strategies](#testing-strategies)
- [Deployment Best Practices](#deployment-best-practices)

## 🏗️ Project Structure

### Recommended Directory Organization

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components
│   ├── forms/          # Form-specific components
│   ├── layout/         # Layout components
│   └── features/       # Feature-specific components
├── pages/              # Next.js pages (Pages Router)
│   ├── api/            # API routes
│   ├── auth/           # Authentication pages
│   └── dashboard/      # Protected pages
├── lib/                # Utility functions and configurations
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Helper functions
│   ├── validations/    # Zod schemas
│   └── constants/      # Application constants
├── styles/             # Global styles and themes
├── types/              # TypeScript type definitions
└── middleware.ts       # Next.js middleware
```

### Component Organization Best Practices

```typescript
// ✅ Good: Clear component structure
// components/forms/ContactForm.tsx
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactSchema, type ContactFormData } from '@/lib/validations/contact'

interface ContactFormProps {
  onSubmit: (data: ContactFormData) => Promise<void>
  isLoading?: boolean
}

export const ContactForm: FC<ContactFormProps> = ({ onSubmit, isLoading = false }) => {
  // Component implementation
}

// Export default for better tree-shaking
export default ContactForm
```

## ⚡ Performance Optimization

### 1. Image Optimization

```typescript
// ✅ Always use Next.js Image component
import Image from 'next/image'

export default function OptimizedImage() {
  return (
    <Image
      src="/hero-image.jpg"
      alt="Hero image"
      width={800}
      height={600}
      priority // For above-the-fold images
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
    />
  )
}
```

### 2. Dynamic Imports & Code Splitting

```typescript
// ✅ Dynamic imports for heavy components
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false // If component doesn't need SSR
})

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<ChartSkeleton />}>
        <HeavyChart />
      </Suspense>
    </div>
  )
}
```

### 3. API Route Optimization

```typescript
// ✅ Optimized API route with caching
// pages/api/posts/[slug].ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

const querySchema = z.object({
  slug: z.string().min(1)
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { slug } = querySchema.parse(req.query)

    // Add caching headers
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')

    const post = await getPostBySlug(slug)
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' })
    }

    return res.status(200).json(post)
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
```

## 🔍 SEO & Metadata

### 1. Dynamic Metadata

```typescript
// ✅ Dynamic metadata with proper fallbacks
// pages/blog/[slug].tsx
import Head from 'next/head'
import { GetStaticProps, GetStaticPaths } from 'next'

interface BlogPostProps {
  post: {
    title: string
    description: string
    image: string
    publishedAt: string
    slug: string
  }
}

export default function BlogPost({ post }: BlogPostProps) {
  const seoTitle = `${post.title} | Your Blog`
  const seoDescription = post.description || 'Read our latest blog post'
  const seoImage = post.image || '/default-og-image.jpg'
  const canonicalUrl = `https://yourdomain.com/blog/${post.slug}`

  return (
    <>
      <Head>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content={seoImage} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content={seoImage} />
        <link rel="canonical" href={canonicalUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              headline: post.title,
              description: seoDescription,
              image: seoImage,
              datePublished: post.publishedAt,
              author: {
                '@type': 'Organization',
                name: 'Your Company'
              }
            })
          }}
        />
      </Head>
      <article>
        {/* Blog post content */}
      </article>
    </>
  )
}
```

## 🎯 Code Organization

### 1. Custom Hooks Pattern

```typescript
// ✅ Well-structured custom hook
// lib/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        setStoredValue(JSON.parse(item))
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
    }
  }, [key])

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue] as const
}
```

### 2. Type-Safe Environment Variables

```typescript
// ✅ Centralized environment validation
// lib/env.ts
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  NEXTAUTH_SECRET: z.string().min(1),
  NEXTAUTH_URL: z.string().url(),
  DATABASE_URL: z.string().url(),
  OPENAI_API_KEY: z.string().min(1).optional(),
  STRIPE_SECRET_KEY: z.string().min(1).optional(),
})

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}

export const env = envSchema.parse(process.env)
```

## 🛡️ Error Handling

### 1. Global Error Boundary

```typescript
// ✅ Comprehensive error boundary
// components/ErrorBoundary.tsx
import React, { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo)
    
    // Log to error reporting service
    if (process.env.NODE_ENV === 'production') {
      // logErrorToService(error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-6">
              We're sorry for the inconvenience. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
```

### 2. API Error Handling

```typescript
// ✅ Centralized API error handling
// lib/api-client.ts
class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new APIError(
      errorData.message || 'API request failed',
      response.status,
      errorData.code
    )
  }

  return response.json()
}
```

## 🔒 Security Guidelines

### 1. CSRF Protection

```typescript
// ✅ CSRF protection for forms
// lib/csrf.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'

export function withCSRF(handler: Function) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
      const token = await getToken({ req })
      
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      // Additional CSRF checks can be added here
    }

    return handler(req, res)
  }
}
```

### 2. Input Validation

```typescript
// ✅ Strict input validation
// lib/validations/user.ts
import { z } from 'zod'

export const createUserSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  email: z.string()
    .email('Please enter a valid email address')
    .toLowerCase(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
    .regex(/(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
    .regex(/(?=.*\d)/, 'Password must contain at least one number'),
})

export type CreateUserInput = z.infer<typeof createUserSchema>
```

## 🧪 Testing Strategies

### 1. Component Testing

```typescript
// ✅ Comprehensive component test
// __tests__/components/ContactForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ContactForm from '@/components/forms/ContactForm'

describe('ContactForm', () => {
  const mockOnSubmit = jest.fn()

  beforeEach(() => {
    mockOnSubmit.mockClear()
  })

  it('renders all form fields', () => {
    render(<ContactForm onSubmit={mockOnSubmit} />)
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    const user = userEvent.setup()
    render(<ContactForm onSubmit={mockOnSubmit} />)
    
    const submitButton = screen.getByRole('button', { name: /send/i })
    await user.click(submitButton)
    
    expect(screen.getByText(/name is required/i)).toBeInTheDocument()
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('submits form with valid data', async () => {
    const user = userEvent.setup()
    render(<ContactForm onSubmit={mockOnSubmit} />)
    
    await user.type(screen.getByLabelText(/name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/message/i), 'Hello world')
    
    await user.click(screen.getByRole('button', { name: /send/i }))
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Hello world'
      })
    })
  })
})
```

## 🚀 Deployment Best Practices

### 1. Environment-Specific Configuration

```typescript
// ✅ Environment-specific settings
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  images: {
    domains: ['example.com', 'cdn.example.com'],
    formats: ['image/webp', 'image/avif'],
  },
  headers: async () => [
    {
      source: '/api/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
      ],
    },
  ],
  redirects: async () => [
    {
      source: '/old-blog/:slug',
      destination: '/blog/:slug',
      permanent: true,
    },
  ],
}

module.exports = nextConfig
```

### 2. Performance Monitoring

```typescript
// ✅ Web Vitals monitoring
// pages/_app.tsx
import { AppProps } from 'next/app'
import { reportWebVitals } from '@/lib/analytics'

export function reportWebVitals(metric) {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(metric)
  }

  // Send to analytics service in production
  if (process.env.NODE_ENV === 'production') {
    switch (metric.name) {
      case 'CLS':
      case 'FID':
      case 'FCP':
      case 'LCP':
      case 'TTFB':
        // Send to your analytics service
        break
    }
  }
}

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
```

## 📝 Summary Checklist

- ✅ Follow consistent project structure
- ✅ Optimize images and implement code splitting
- ✅ Add proper SEO metadata to all pages
- ✅ Implement comprehensive error handling
- ✅ Validate all user inputs
- ✅ Use TypeScript strictly
- ✅ Write tests for critical components
- ✅ Configure proper security headers
- ✅ Monitor performance metrics
- ✅ Set up proper environment configuration

---

**Next**: Check out our [Performance Optimization Guide](./performance-optimization.md) for advanced techniques.