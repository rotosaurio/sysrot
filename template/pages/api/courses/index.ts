import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
const createCourseSchema = z.object({
  title: z.string().min(1, 'Course title is required').max(200, 'Title too long'),
  description: z.string().max(5000, 'Description too long').optional(),
  slug: z.string().min(3, 'Slug too short').max(100, 'Slug too long').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens').optional(),
  
  // Course content
  thumbnail: z.string().url().optional(),
  trailer: z.string().url().optional(),
  language: z.string().default('en'),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT', 'ALL_LEVELS']).default('BEGINNER'),
  category: z.enum(['TECHNOLOGY', 'BUSINESS', 'DESIGN', 'MARKETING', 'PERSONAL_DEVELOPMENT', 'HEALTH_FITNESS', 'MUSIC', 'LANGUAGE', 'PHOTOGRAPHY', 'COOKING', 'ARTS_CRAFTS', 'LIFESTYLE', 'ACADEMIC', 'TEST_PREP']).default('TECHNOLOGY'),
  tags: z.array(z.string()).max(10, 'Too many tags').optional(),
  
  // Pricing
  price: z.number().min(0, 'Price cannot be negative').max(10000, 'Price too high'),
  originalPrice: z.number().min(0).optional(),
  currency: z.string().default('USD'),
  access: z.enum(['FREE', 'PAID', 'SUBSCRIPTION', 'INVITATION_ONLY']).default('PAID'),
  
  // Course metadata
  requirements: z.array(z.string()).max(20, 'Too many requirements').optional(),
  outcomes: z.array(z.string()).max(30, 'Too many outcomes').optional(),
  
  // Publishing
  publishedAt: z.string().datetime().optional()
});

const updateCourseSchema = createCourseSchema.partial();

const enrollmentSchema = z.object({
  courseId: z.string(),
  paymentMethod: z.string().optional(),
  transactionId: z.string().optional()
});

async function hasCoursePermission(userId: string, courseId: string, action: string = 'read') {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      enrollments: {
        where: { studentId: userId }
      }
    }
  });

  if (!course) return false;

  // Course instructor has all permissions
  if (course.instructorId === userId) return true;

  // Check enrollment for students
  const enrollment = course.enrollments[0];
  
  switch (action) {
    case 'read':
      // Public courses or enrolled students
      return course.status === 'PUBLISHED' && (course.access === 'FREE' || enrollment);
    case 'enroll':
      // Can enroll if not already enrolled and course is published
      return course.status === 'PUBLISHED' && !enrollment;
    case 'update':
    case 'delete':
      // Only instructor can modify
      return course.instructorId === userId;
    case 'view_analytics':
      // Instructor or enrolled student
      return course.instructorId === userId || enrollment;
    default:
      return false;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession({ req });
    
    if (!session?.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { method } = req;
    const { action } = req.query;

    switch (method) {
      case 'GET':
        return await getCourses(req, res);

      case 'POST':
        if (action === 'enroll') {
          return await enrollInCourse(req, res);
        }
        return await createCourse(req, res);

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end('Method Not Allowed');
    }
  } catch (error) {
    console.error('Courses API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}

async function getCourses(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const { 
    category,
    level,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    limit = '20',
    page = '1',
    featured = 'false',
    trending = 'false',
    access = 'all',
    instructorId,
    enrolled = 'false'
  } = req.query;

  try {
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    // Build where clause
    const whereClause: any = {
      status: 'PUBLISHED' // Only show published courses by default
    };

    if (category && category !== 'ALL') {
      whereClause.category = category;
    }

    if (level && level !== 'ALL') {
      whereClause.level = level;
    }

    if (access && access !== 'all') {
      whereClause.access = access.toUpperCase();
    }

    if (featured === 'true') {
      whereClause.featured = true;
    }

    if (trending === 'true') {
      whereClause.trending = true;
    }

    if (instructorId && typeof instructorId === 'string') {
      whereClause.instructorId = instructorId;
      // Allow instructor to see their own drafts
      if (instructorId === session.user.id) {
        delete whereClause.status;
      }
    }

    if (enrolled === 'true') {
      whereClause.enrollments = {
        some: {
          studentId: session.user.id,
          status: 'ACTIVE'
        }
      };
    }

    if (search && typeof search === 'string') {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { hasSome: [search] } }
      ];
    }

    // Get courses with comprehensive data
    const courses = await prisma.course.findMany({
      where: whereClause,
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        _count: {
          select: {
            enrollments: {
              where: { status: 'ACTIVE' }
            },
            lessons: true,
            reviews: true,
            modules: true
          }
        },
        enrollments: {
          where: {
            studentId: session.user.id
          },
          select: {
            id: true,
            status: true,
            progress: true,
            enrolledAt: true,
            completedAt: true
          }
        }
      },
      orderBy: {
        [sortBy as string]: sortOrder
      },
      skip: offset,
      take: limitNum
    });

    // Enrich courses with user-specific data
    const enrichedCourses = courses.map(course => {
      const userEnrollment = course.enrollments[0];
      
      return {
        ...course,
        enrollments: undefined, // Remove from response
        userEnrollment: userEnrollment || null,
        isEnrolled: !!userEnrollment,
        stats: {
          totalEnrollments: course._count.enrollments,
          totalLessons: course._count.lessons,
          totalReviews: course._count.reviews,
          totalModules: course._count.modules,
          completionRate: course.enrollmentCount > 0 ? 
            Math.round((course.completionCount / course.enrollmentCount) * 100) : 0
        }
      };
    });

    // Get total count for pagination
    const total = await prisma.course.count({
      where: whereClause
    });

    res.status(200).json({
      courses: enrichedCourses,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
}

async function createCourse(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  try {
    const validatedData = createCourseSchema.parse(req.body);

    // Generate slug if not provided
    let slug = validatedData.slug;
    if (!slug) {
      slug = validatedData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      // Ensure slug uniqueness
      const existingCourse = await prisma.course.findUnique({ where: { slug } });
      if (existingCourse) {
        slug = `${slug}-${Date.now()}`;
      }
    } else {
      // Check if provided slug is unique
      const existingCourse = await prisma.course.findUnique({ where: { slug } });
      if (existingCourse) {
        return res.status(400).json({ error: 'Slug already exists' });
      }
    }

    // Create the course
    const course = await prisma.course.create({
      data: {
        ...validatedData,
        slug,
        instructorId: session.user.id,
        publishedAt: validatedData.publishedAt ? new Date(validatedData.publishedAt) : undefined,
        status: validatedData.publishedAt ? 'PUBLISHED' : 'DRAFT',
        tags: validatedData.tags || [],
        requirements: validatedData.requirements || [],
        outcomes: validatedData.outcomes || []
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    });

    // Create initial analytics entry if published
    if (course.publishedAt) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      await prisma.courseAnalytics.create({
        data: {
          courseId: course.id,
          date: today,
          newEnrollments: 0,
          totalEnrollments: 0,
          completions: 0,
          activeLearners: 0,
          revenue: 0
        }
      });
    }

    res.status(201).json({
      course,
      message: 'Course created successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    }

    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Failed to create course' });
  }
}

async function enrollInCourse(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  try {
    const validatedData = enrollmentSchema.parse(req.body);

    // Check if course exists and is available for enrollment
    const course = await prisma.course.findUnique({
      where: { id: validatedData.courseId },
      include: {
        enrollments: {
          where: { studentId: session.user.id }
        }
      }
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (course.status !== 'PUBLISHED') {
      return res.status(400).json({ error: 'Course is not available for enrollment' });
    }

    // Check if user is already enrolled
    if (course.enrollments.length > 0) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }

    // Check if user is trying to enroll in their own course
    if (course.instructorId === session.user.id) {
      return res.status(400).json({ error: 'Cannot enroll in your own course' });
    }

    // Calculate payment amount
    const amount = course.access === 'FREE' ? 0 : course.price;

    // Get course lesson count for progress tracking
    const lessonCount = await prisma.lesson.count({
      where: { courseId: validatedData.courseId }
    });

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        courseId: validatedData.courseId,
        studentId: session.user.id,
        amount,
        currency: course.currency,
        paymentMethod: validatedData.paymentMethod,
        transactionId: validatedData.transactionId,
        totalLessons: lessonCount,
        expiresAt: course.access === 'SUBSCRIPTION' ? 
          new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) : undefined // 1 year for subscriptions
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            thumbnail: true,
            instructor: {
              select: {
                name: true,
                image: true
              }
            }
          }
        }
      }
    });

    // Update course enrollment count
    await prisma.course.update({
      where: { id: validatedData.courseId },
      data: {
        enrollmentCount: {
          increment: 1
        }
      }
    });

    // Update today's analytics
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.courseAnalytics.upsert({
      where: {
        courseId_date: {
          courseId: validatedData.courseId,
          date: today
        }
      },
      update: {
        newEnrollments: {
          increment: 1
        },
        totalEnrollments: {
          increment: 1
        },
        revenue: {
          increment: amount
        }
      },
      create: {
        courseId: validatedData.courseId,
        date: today,
        newEnrollments: 1,
        totalEnrollments: course.enrollmentCount + 1,
        completions: 0,
        activeLearners: 1,
        revenue: amount
      }
    });

    res.status(201).json({
      enrollment,
      message: course.access === 'FREE' ? 'Successfully enrolled in free course' : 'Successfully enrolled in course'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    }

    console.error('Error enrolling in course:', error);
    res.status(500).json({ error: 'Failed to enroll in course' });
  }
}