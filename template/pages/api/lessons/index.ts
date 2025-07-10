import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
const progressUpdateSchema = z.object({
  lessonId: z.string(),
  progress: z.number().min(0).max(100),
  timeSpent: z.number().min(0),
  lastPosition: z.number().min(0).optional(),
  watchTime: z.number().min(0).optional()
});

const quizAttemptSchema = z.object({
  quizId: z.string(),
  answers: z.array(z.object({
    questionId: z.string(),
    answer: z.string()
  }))
});

const assignmentSubmissionSchema = z.object({
  assignmentId: z.string(),
  content: z.string().optional(),
  fileUrl: z.string().url().optional(),
  fileName: z.string().optional(),
  fileSize: z.number().optional()
});

const noteSchema = z.object({
  lessonId: z.string(),
  content: z.string().min(1, 'Note content is required').max(5000, 'Note too long'),
  timestamp: z.number().min(0).optional()
});

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
        return await getLessons(req, res);

      case 'POST':
        if (action === 'progress') {
          return await updateProgress(req, res);
        } else if (action === 'quiz-attempt') {
          return await submitQuizAttempt(req, res);
        } else if (action === 'assignment') {
          return await submitAssignment(req, res);
        } else if (action === 'note') {
          return await addNote(req, res);
        }
        return res.status(400).json({ error: 'Invalid action' });

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end('Method Not Allowed');
    }
  } catch (error) {
    console.error('Lessons API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}

async function getLessons(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const { courseId, moduleId, lessonId } = req.query;

  try {
    if (lessonId && typeof lessonId === 'string') {
      // Get single lesson with full details
      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: {
          course: {
            include: {
              enrollments: {
                where: { studentId: session.user.id }
              }
            }
          },
          module: true,
          attachments: true,
          quiz: {
            include: {
              questions: {
                include: {
                  options: true
                },
                orderBy: { order: 'asc' }
              },
              attempts: {
                where: { studentId: session.user.id },
                orderBy: { startedAt: 'desc' },
                take: 5
              }
            }
          },
          assignment: {
            include: {
              submissions: {
                where: { studentId: session.user.id }
              }
            }
          },
          progress: {
            where: {
              enrollment: {
                studentId: session.user.id
              }
            }
          },
          notes: {
            where: {
              enrollment: {
                studentId: session.user.id
              }
            },
            orderBy: { createdAt: 'desc' }
          }
        }
      });

      if (!lesson) {
        return res.status(404).json({ error: 'Lesson not found' });
      }

      // Check if user has access to this lesson
      const enrollment = lesson.course.enrollments[0];
      const hasAccess = lesson.isPreview || 
        lesson.course.instructorId === session.user.id ||
        (enrollment && enrollment.status === 'ACTIVE');

      if (!hasAccess) {
        return res.status(403).json({ error: 'Access denied to this lesson' });
      }

      const userProgress = lesson.progress[0];
      const userNotes = lesson.notes;

      return res.status(200).json({
        lesson: {
          ...lesson,
          course: {
            id: lesson.course.id,
            title: lesson.course.title,
            instructorId: lesson.course.instructorId
          },
          progress: undefined,
          notes: undefined,
          userProgress: userProgress || null,
          userNotes: userNotes || []
        }
      });
    }

    // Get lessons for a course or module
    const whereClause: any = {};
    
    if (courseId && typeof courseId === 'string') {
      whereClause.courseId = courseId;
      
      // Verify user has access to the course
      const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
          enrollments: {
            where: { studentId: session.user.id }
          }
        }
      });

      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }

      const enrollment = course.enrollments[0];
      const hasAccess = course.instructorId === session.user.id ||
        (enrollment && enrollment.status === 'ACTIVE');

      if (!hasAccess) {
        return res.status(403).json({ error: 'Access denied to this course' });
      }
    }

    if (moduleId && typeof moduleId === 'string') {
      whereClause.moduleId = moduleId;
    }

    const lessons = await prisma.lesson.findMany({
      where: whereClause,
      include: {
        module: {
          select: {
            id: true,
            title: true,
            order: true
          }
        },
        progress: {
          where: {
            enrollment: {
              studentId: session.user.id
            }
          }
        },
        quiz: {
          select: {
            id: true,
            title: true,
            maxAttempts: true,
            attempts: {
              where: { studentId: session.user.id },
              select: {
                id: true,
                score: true,
                isPassed: true,
                completedAt: true
              }
            }
          }
        },
        assignment: {
          select: {
            id: true,
            title: true,
            dueDate: true,
            submissions: {
              where: { studentId: session.user.id },
              select: {
                id: true,
                status: true,
                score: true,
                submittedAt: true
              }
            }
          }
        }
      },
      orderBy: { order: 'asc' }
    });

    // Enrich lessons with user progress
    const enrichedLessons = lessons.map(lesson => {
      const userProgress = lesson.progress[0];
      const quizAttempts = lesson.quiz?.attempts || [];
      const assignmentSubmission = lesson.assignment?.submissions[0];

      return {
        ...lesson,
        progress: undefined,
        userProgress: userProgress || null,
        quiz: lesson.quiz ? {
          ...lesson.quiz,
          attempts: undefined,
          userAttempts: quizAttempts,
          hasAttempts: quizAttempts.length > 0,
          bestScore: quizAttempts.length > 0 ? Math.max(...quizAttempts.map(a => a.score)) : 0
        } : null,
        assignment: lesson.assignment ? {
          ...lesson.assignment,
          submissions: undefined,
          userSubmission: assignmentSubmission || null,
          hasSubmission: !!assignmentSubmission
        } : null
      };
    });

    res.status(200).json({
      lessons: enrichedLessons
    });
  } catch (error) {
    console.error('Error fetching lessons:', error);
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
}

async function updateProgress(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  try {
    const validatedData = progressUpdateSchema.parse(req.body);

    // Verify user has access to this lesson
    const lesson = await prisma.lesson.findUnique({
      where: { id: validatedData.lessonId },
      include: {
        course: {
          include: {
            enrollments: {
              where: { studentId: session.user.id }
            }
          }
        }
      }
    });

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    const enrollment = lesson.course.enrollments[0];
    if (!enrollment || enrollment.status !== 'ACTIVE') {
      return res.status(403).json({ error: 'Must be enrolled in course to track progress' });
    }

    // Determine progress status
    let status = 'IN_PROGRESS';
    if (validatedData.progress >= 100) {
      status = 'COMPLETED';
    } else if (validatedData.progress > 0) {
      status = 'IN_PROGRESS';
    } else {
      status = 'NOT_STARTED';
    }

    // Update or create lesson progress
    const progress = await prisma.lessonProgress.upsert({
      where: {
        enrollmentId_lessonId: {
          enrollmentId: enrollment.id,
          lessonId: validatedData.lessonId
        }
      },
      update: {
        status,
        progress: validatedData.progress,
        timeSpent: {
          increment: validatedData.timeSpent
        },
        lastPosition: validatedData.lastPosition,
        watchTime: validatedData.watchTime ? {
          increment: validatedData.watchTime
        } : undefined,
        completedAt: status === 'COMPLETED' ? new Date() : undefined,
        lastAccessedAt: new Date()
      },
      create: {
        enrollmentId: enrollment.id,
        lessonId: validatedData.lessonId,
        status,
        progress: validatedData.progress,
        timeSpent: validatedData.timeSpent,
        lastPosition: validatedData.lastPosition,
        watchTime: validatedData.watchTime || 0,
        startedAt: new Date(),
        completedAt: status === 'COMPLETED' ? new Date() : undefined,
        lastAccessedAt: new Date()
      }
    });

    // Update enrollment progress if lesson is completed
    if (status === 'COMPLETED') {
      const completedLessons = await prisma.lessonProgress.count({
        where: {
          enrollmentId: enrollment.id,
          status: 'COMPLETED'
        }
      });

      const totalLessons = await prisma.lesson.count({
        where: { courseId: lesson.courseId }
      });

      const courseProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

      await prisma.enrollment.update({
        where: { id: enrollment.id },
        data: {
          progress: courseProgress,
          completedLessons,
          totalLessons,
          completedAt: courseProgress >= 100 ? new Date() : null,
          totalTimeSpent: {
            increment: validatedData.timeSpent
          },
          lastAccessedAt: new Date()
        }
      });

      // Update course completion count if course is fully completed
      if (courseProgress >= 100) {
        await prisma.course.update({
          where: { id: lesson.courseId },
          data: {
            completionCount: {
              increment: 1
            }
          }
        });
      }
    }

    res.status(200).json({
      progress,
      message: 'Progress updated successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    }

    console.error('Error updating progress:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
}

async function submitQuizAttempt(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  try {
    const validatedData = quizAttemptSchema.parse(req.body);

    // Get quiz with questions and check access
    const quiz = await prisma.quiz.findUnique({
      where: { id: validatedData.quizId },
      include: {
        lesson: {
          include: {
            course: {
              include: {
                enrollments: {
                  where: { studentId: session.user.id }
                }
              }
            }
          }
        },
        questions: {
          include: {
            options: true
          },
          orderBy: { order: 'asc' }
        },
        attempts: {
          where: { studentId: session.user.id }
        }
      }
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const enrollment = quiz.lesson.course.enrollments[0];
    if (!enrollment || enrollment.status !== 'ACTIVE') {
      return res.status(403).json({ error: 'Must be enrolled in course to take quiz' });
    }

    // Check attempt limits
    if (quiz.attempts.length >= quiz.maxAttempts) {
      return res.status(400).json({ error: 'Maximum attempts reached' });
    }

    // Calculate score
    let totalPoints = 0;
    let earnedPoints = 0;
    const answerResults = [];

    for (const question of quiz.questions) {
      totalPoints += question.points;
      const userAnswer = validatedData.answers.find(a => a.questionId === question.id);
      
      if (userAnswer) {
        let isCorrect = false;
        
        if (question.type === 'MULTIPLE_CHOICE' || question.type === 'TRUE_FALSE') {
          const correctOption = question.options.find(o => o.isCorrect);
          isCorrect = correctOption?.text === userAnswer.answer;
        } else if (question.type === 'FILL_IN_BLANK' || question.type === 'SHORT_ANSWER') {
          const correctAnswers = question.options.filter(o => o.isCorrect).map(o => o.text.toLowerCase());
          isCorrect = correctAnswers.includes(userAnswer.answer.toLowerCase().trim());
        }

        if (isCorrect) {
          earnedPoints += question.points;
        }

        answerResults.push({
          questionId: question.id,
          answer: userAnswer.answer,
          isCorrect,
          pointsEarned: isCorrect ? question.points : 0
        });
      }
    }

    const score = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
    const isPassed = score >= quiz.passingScore;

    // Create quiz attempt
    const attempt = await prisma.quizAttempt.create({
      data: {
        quizId: validatedData.quizId,
        studentId: session.user.id,
        score,
        totalPoints,
        earnedPoints,
        completedAt: new Date(),
        status: 'COMPLETED',
        isPassed,
        answers: {
          create: answerResults
        }
      },
      include: {
        answers: {
          include: {
            question: {
              select: {
                question: true,
                explanation: true,
                type: true
              }
            }
          }
        }
      }
    });

    // Update lesson progress if quiz is passed
    if (isPassed) {
      await prisma.lessonProgress.upsert({
        where: {
          enrollmentId_lessonId: {
            enrollmentId: enrollment.id,
            lessonId: quiz.lesson.id
          }
        },
        update: {
          status: 'COMPLETED',
          progress: 100,
          completedAt: new Date(),
          lastAccessedAt: new Date()
        },
        create: {
          enrollmentId: enrollment.id,
          lessonId: quiz.lesson.id,
          status: 'COMPLETED',
          progress: 100,
          timeSpent: 0,
          startedAt: new Date(),
          completedAt: new Date(),
          lastAccessedAt: new Date()
        }
      });
    }

    res.status(201).json({
      attempt: {
        ...attempt,
        showCorrectAnswers: quiz.showCorrectAnswers,
        passingScore: quiz.passingScore
      },
      message: isPassed ? 'Quiz passed successfully!' : 'Quiz completed. You can retry if attempts remain.'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    }

    console.error('Error submitting quiz attempt:', error);
    res.status(500).json({ error: 'Failed to submit quiz attempt' });
  }
}

async function submitAssignment(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  try {
    const validatedData = assignmentSubmissionSchema.parse(req.body);

    // Get assignment and check access
    const assignment = await prisma.assignment.findUnique({
      where: { id: validatedData.assignmentId },
      include: {
        lesson: {
          include: {
            course: {
              include: {
                enrollments: {
                  where: { studentId: session.user.id }
                }
              }
            }
          }
        },
        submissions: {
          where: { studentId: session.user.id }
        }
      }
    });

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    const enrollment = assignment.lesson.course.enrollments[0];
    if (!enrollment || enrollment.status !== 'ACTIVE') {
      return res.status(403).json({ error: 'Must be enrolled in course to submit assignment' });
    }

    // Check if already submitted
    if (assignment.submissions.length > 0) {
      return res.status(400).json({ error: 'Assignment already submitted' });
    }

    // Check file requirements if file submission
    if (validatedData.fileUrl && validatedData.fileSize) {
      if (validatedData.fileSize > assignment.maxFileSize) {
        return res.status(400).json({ error: 'File size exceeds limit' });
      }

      if (validatedData.fileName) {
        const fileExtension = validatedData.fileName.split('.').pop()?.toLowerCase();
        if (fileExtension && assignment.allowedFileTypes.length > 0 && 
            !assignment.allowedFileTypes.includes(fileExtension)) {
          return res.status(400).json({ error: 'File type not allowed' });
        }
      }
    }

    // Check due date
    const isLate = assignment.dueDate && new Date() > assignment.dueDate;
    if (isLate && !assignment.allowLateSubmission) {
      return res.status(400).json({ error: 'Assignment submission deadline has passed' });
    }

    // Create submission
    const submission = await prisma.assignmentSubmission.create({
      data: {
        assignmentId: validatedData.assignmentId,
        studentId: session.user.id,
        content: validatedData.content,
        fileUrl: validatedData.fileUrl,
        fileName: validatedData.fileName,
        fileSize: validatedData.fileSize,
        status: isLate ? 'LATE' : 'SUBMITTED'
      },
      include: {
        assignment: {
          select: {
            title: true,
            maxPoints: true,
            dueDate: true
          }
        }
      }
    });

    res.status(201).json({
      submission,
      message: isLate ? 'Assignment submitted late' : 'Assignment submitted successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    }

    console.error('Error submitting assignment:', error);
    res.status(500).json({ error: 'Failed to submit assignment' });
  }
}

async function addNote(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  try {
    const validatedData = noteSchema.parse(req.body);

    // Verify user has access to this lesson
    const lesson = await prisma.lesson.findUnique({
      where: { id: validatedData.lessonId },
      include: {
        course: {
          include: {
            enrollments: {
              where: { studentId: session.user.id }
            }
          }
        }
      }
    });

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    const enrollment = lesson.course.enrollments[0];
    if (!enrollment || enrollment.status !== 'ACTIVE') {
      return res.status(403).json({ error: 'Must be enrolled in course to add notes' });
    }

    // Create note
    const note = await prisma.studentNote.create({
      data: {
        enrollmentId: enrollment.id,
        lessonId: validatedData.lessonId,
        content: validatedData.content,
        timestamp: validatedData.timestamp
      }
    });

    res.status(201).json({
      note,
      message: 'Note added successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    }

    console.error('Error adding note:', error);
    res.status(500).json({ error: 'Failed to add note' });
  }
}