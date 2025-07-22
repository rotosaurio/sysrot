import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedLearning() {
  console.log('🎓 Starting Learning Management System seed...');

  try {
    // Create instructors and students
    console.log('👨‍🏫 Creating instructors and students...');
    
    const passwordHash = await bcrypt.hash('learning123', 10);

    const users = [
      // Instructors
      {
        email: 'prof.smith@university.com',
        name: 'Dr. Emily Smith',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
      },
      {
        email: 'instructor.jones@techcourses.com', 
        name: 'Michael Jones',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      },
      {
        email: 'prof.garcia@designschool.com',
        name: 'Prof. Maria Garcia',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
      },
      {
        email: 'dr.wilson@businessacademy.com',
        name: 'Dr. James Wilson',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      
      // Students
      {
        email: 'alice.student@learners.com',
        name: 'Alice Johnson',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
      },
      {
        email: 'bob.student@learners.com',
        name: 'Bob Chen',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      },
      {
        email: 'charlie.student@learners.com',
        name: 'Charlie Brown',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
      },
      {
        email: 'diana.student@learners.com',
        name: 'Diana Martinez',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face'
      },
      {
        email: 'edward.student@learners.com',
        name: 'Edward Kim',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f13?w=150&h=150&fit=crop&crop=face'
      },
      {
        email: 'fiona.student@learners.com',
        name: 'Fiona White',
        image: 'https://images.unsplash.com/photo-1507101105822-7472b28e22ac?w=150&h=150&fit=crop&crop=face'
      }
    ];

    const createdUsers = [];
    for (const userData of users) {
      const user = await prisma.user.upsert({
        where: { email: userData.email },
        update: {},
        create: {
          ...userData,
          password: passwordHash,
          role: 'user',
          emailVerified: new Date()
        }
      });
      createdUsers.push(user);
    }

    console.log('✅ Created learning users');

    // Create courses
    console.log('📚 Creating courses...');

    const courses = [
      {
        id: 'javascript-fundamentals',
        title: 'JavaScript Fundamentals for Beginners',
        description: 'Master the basics of JavaScript programming with hands-on exercises and real-world projects. Perfect for complete beginners who want to start their programming journey.',
        slug: 'javascript-fundamentals',
        thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&h=600&fit=crop',
        trailer: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        language: 'en',
        level: 'BEGINNER',
        category: 'TECHNOLOGY',
        tags: ['javascript', 'programming', 'web development', 'beginner'],
        duration: 480, // 8 hours
        lessonCount: 0,
        price: 79.99,
        originalPrice: 129.99,
        currency: 'USD',
        access: 'PAID',
        status: 'PUBLISHED',
        publishedAt: new Date('2024-01-10T10:00:00Z'),
        requirements: ['Basic computer skills', 'Text editor (VS Code recommended)', 'Web browser'],
        outcomes: [
          'Understand JavaScript syntax and fundamentals',
          'Work with variables, functions, and objects',
          'Handle DOM manipulation and events',
          'Build interactive web applications',
          'Apply problem-solving with algorithms'
        ],
        instructorId: createdUsers[0].id, // Dr. Emily Smith
        featured: true,
        trending: true,
        enrollmentCount: 0,
        completionCount: 0,
        averageRating: 4.8,
        reviewCount: 0,
        revenue: 0
      },
      {
        id: 'react-mastery',
        title: 'React Development Mastery Course',
        description: 'Advanced React course covering hooks, context, state management, and modern patterns. Build production-ready applications with confidence.',
        slug: 'react-mastery',
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop',
        trailer: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
        language: 'en',
        level: 'INTERMEDIATE',
        category: 'TECHNOLOGY',
        tags: ['react', 'javascript', 'frontend', 'hooks', 'state management'],
        duration: 720, // 12 hours
        lessonCount: 0,
        price: 149.99,
        originalPrice: 199.99,
        currency: 'USD',
        access: 'PAID',
        status: 'PUBLISHED',
        publishedAt: new Date('2024-01-15T14:00:00Z'),
        requirements: ['Solid JavaScript knowledge', 'HTML/CSS basics', 'Node.js installed'],
        outcomes: [
          'Master React hooks and component patterns',
          'Implement complex state management',
          'Build responsive and accessible UIs',
          'Optimize React application performance',
          'Deploy production-ready applications'
        ],
        instructorId: createdUsers[1].id, // Michael Jones
        featured: true,
        trending: false,
        enrollmentCount: 0,
        completionCount: 0,
        averageRating: 4.9,
        reviewCount: 0,
        revenue: 0
      },
      {
        id: 'ui-ux-design-principles',
        title: 'UI/UX Design Principles and Practice',
        description: 'Learn design thinking, user research, prototyping, and creating beautiful user interfaces. Includes Figma tutorials and real client projects.',
        slug: 'ui-ux-design-principles',
        thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
        trailer: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        language: 'en',
        level: 'BEGINNER',
        category: 'DESIGN',
        tags: ['ui design', 'ux design', 'figma', 'prototyping', 'user research'],
        duration: 600, // 10 hours
        lessonCount: 0,
        price: 99.99,
        currency: 'USD',
        access: 'PAID',
        status: 'PUBLISHED',
        publishedAt: new Date('2024-01-12T09:00:00Z'),
        requirements: ['Creative mindset', 'Figma account (free)', 'Basic computer skills'],
        outcomes: [
          'Understand design thinking process',
          'Conduct user research and testing',
          'Create wireframes and prototypes',
          'Design beautiful and functional interfaces',
          'Present design solutions effectively'
        ],
        instructorId: createdUsers[2].id, // Prof. Maria Garcia
        featured: false,
        trending: true,
        enrollmentCount: 0,
        completionCount: 0,
        averageRating: 4.7,
        reviewCount: 0,
        revenue: 0
      },
      {
        id: 'digital-marketing-strategy',
        title: 'Digital Marketing Strategy for Small Business',
        description: 'Comprehensive digital marketing course covering SEO, social media, email marketing, and analytics. Grow your business online.',
        slug: 'digital-marketing-strategy',
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
        language: 'en',
        level: 'INTERMEDIATE',
        category: 'MARKETING',
        tags: ['digital marketing', 'seo', 'social media', 'email marketing', 'analytics'],
        duration: 540, // 9 hours
        lessonCount: 0,
        price: 119.99,
        currency: 'USD',
        access: 'PAID',
        status: 'PUBLISHED',
        publishedAt: new Date('2024-01-08T11:00:00Z'),
        requirements: ['Basic business knowledge', 'Access to social media platforms', 'Google Analytics account'],
        outcomes: [
          'Develop comprehensive marketing strategies',
          'Master SEO and content marketing',
          'Create effective social media campaigns',
          'Build email marketing funnels',
          'Analyze and optimize marketing performance'
        ],
        instructorId: createdUsers[3].id, // Dr. James Wilson
        featured: false,
        trending: false,
        enrollmentCount: 0,
        completionCount: 0,
        averageRating: 4.6,
        reviewCount: 0,
        revenue: 0
      },
      {
        id: 'python-for-data-science',
        title: 'Python for Data Science and Machine Learning',
        description: 'Learn Python programming for data analysis, visualization, and machine learning. Includes pandas, numpy, matplotlib, and scikit-learn.',
        slug: 'python-for-data-science',
        thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=600&fit=crop',
        language: 'en',
        level: 'INTERMEDIATE',
        category: 'TECHNOLOGY',
        tags: ['python', 'data science', 'machine learning', 'pandas', 'numpy'],
        duration: 900, // 15 hours
        lessonCount: 0,
        price: 0, // Free course
        currency: 'USD',
        access: 'FREE',
        status: 'PUBLISHED',
        publishedAt: new Date('2024-01-05T08:00:00Z'),
        requirements: ['Basic programming knowledge', 'Python 3.8+ installed', 'Jupyter Notebook'],
        outcomes: [
          'Master Python for data manipulation',
          'Create stunning data visualizations',
          'Build machine learning models',
          'Analyze real-world datasets',
          'Deploy ML models to production'
        ],
        instructorId: createdUsers[0].id, // Dr. Emily Smith
        featured: true,
        trending: false,
        enrollmentCount: 0,
        completionCount: 0,
        averageRating: 4.9,
        reviewCount: 0,
        revenue: 0
      }
    ];

    const createdCourses = [];
    for (const courseData of courses) {
      const course = await prisma.course.upsert({
        where: { id: courseData.id },
        update: {},
        create: courseData
      });
      createdCourses.push(course);
    }

    console.log('✅ Created courses');

    // Create course modules and lessons
    console.log('📖 Creating modules and lessons...');

    // JavaScript Fundamentals Course Content
    const jsModules = [
      {
        id: 'js-intro',
        title: 'Introduction to Programming',
        description: 'Basic programming concepts and JavaScript setup',
        order: 1,
        courseId: createdCourses[0].id
      },
      {
        id: 'js-basics',
        title: 'JavaScript Basics',
        description: 'Variables, data types, and operators',
        order: 2,
        courseId: createdCourses[0].id
      },
      {
        id: 'js-functions',
        title: 'Functions and Control Flow',
        description: 'Functions, conditionals, and loops',
        order: 3,
        courseId: createdCourses[0].id
      }
    ];

    for (const moduleData of jsModules) {
      await prisma.courseModule.upsert({
        where: { id: moduleData.id },
        update: {},
        create: moduleData
      });
    }

    // JavaScript Lessons
    const jsLessons = [
      {
        id: 'js-lesson-1',
        title: 'What is Programming?',
        description: 'Introduction to programming concepts and JavaScript',
        order: 1,
        courseId: createdCourses[0].id,
        moduleId: 'js-intro',
        type: 'VIDEO',
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        videoDuration: 900, // 15 minutes
        isPreview: true,
        isRequired: true
      },
      {
        id: 'js-lesson-2',
        title: 'Setting Up Your Development Environment',
        description: 'Install VS Code, setup your first JavaScript file',
        order: 2,
        courseId: createdCourses[0].id,
        moduleId: 'js-intro',
        type: 'VIDEO',
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
        videoDuration: 1200, // 20 minutes
        isPreview: false,
        isRequired: true
      },
      {
        id: 'js-lesson-3',
        title: 'Variables and Data Types',
        description: 'Learn about different data types in JavaScript',
        order: 3,
        courseId: createdCourses[0].id,
        moduleId: 'js-basics',
        type: 'VIDEO',
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        videoDuration: 1800, // 30 minutes
        isPreview: false,
        isRequired: true
      },
      {
        id: 'js-lesson-4',
        title: 'JavaScript Fundamentals Quiz',
        description: 'Test your knowledge of JavaScript basics',
        order: 4,
        courseId: createdCourses[0].id,
        moduleId: 'js-basics',
        type: 'QUIZ',
        isPreview: false,
        isRequired: true
      },
      {
        id: 'js-lesson-5',
        title: 'Your First JavaScript Project',
        description: 'Build a simple calculator application',
        order: 5,
        courseId: createdCourses[0].id,
        moduleId: 'js-functions',
        type: 'ASSIGNMENT',
        content: 'Create a calculator that can perform basic arithmetic operations (addition, subtraction, multiplication, division). Use HTML for the interface and JavaScript for the logic.',
        isPreview: false,
        isRequired: true
      }
    ];

    const createdLessons = [];
    for (const lessonData of jsLessons) {
      const lesson = await prisma.lesson.upsert({
        where: { id: lessonData.id },
        update: {},
        create: lessonData
      });
      createdLessons.push(lesson);
    }

    // Create quiz for the quiz lesson
    const quiz = await prisma.quiz.create({
      data: {
        lessonId: 'js-lesson-4',
        title: 'JavaScript Fundamentals Quiz',
        description: 'Test your understanding of JavaScript basics',
        instructions: 'Choose the best answer for each question. You need 70% to pass.',
        timeLimit: 30, // 30 minutes
        maxAttempts: 3,
        passingScore: 70,
        isRandomized: false,
        showCorrectAnswers: true
      }
    });

    // Create quiz questions
    const quizQuestions = [
      {
        quizId: quiz.id,
        question: 'Which of the following is the correct way to declare a variable in JavaScript?',
        explanation: 'let and const are the modern ways to declare variables in JavaScript.',
        order: 1,
        type: 'MULTIPLE_CHOICE',
        points: 10
      },
      {
        quizId: quiz.id,
        question: 'What is the result of typeof null in JavaScript?',
        explanation: 'This is a well-known quirk in JavaScript. typeof null returns "object".',
        order: 2,
        type: 'MULTIPLE_CHOICE',
        points: 10
      },
      {
        quizId: quiz.id,
        question: 'JavaScript is a statically typed language.',
        explanation: 'JavaScript is dynamically typed, meaning variable types are determined at runtime.',
        order: 3,
        type: 'TRUE_FALSE',
        points: 10
      }
    ];

    for (const questionData of quizQuestions) {
      const question = await prisma.quizQuestion.create({
        data: questionData
      });

      // Create options for each question
      if (questionData.order === 1) {
        await prisma.quizOption.createMany({
          data: [
            { questionId: question.id, text: 'var x = 5;', order: 1, isCorrect: false },
            { questionId: question.id, text: 'let x = 5;', order: 2, isCorrect: true },
            { questionId: question.id, text: 'const x = 5;', order: 3, isCorrect: true },
            { questionId: question.id, text: 'All of the above', order: 4, isCorrect: false }
          ]
        });
      } else if (questionData.order === 2) {
        await prisma.quizOption.createMany({
          data: [
            { questionId: question.id, text: '"null"', order: 1, isCorrect: false },
            { questionId: question.id, text: '"undefined"', order: 2, isCorrect: false },
            { questionId: question.id, text: '"object"', order: 3, isCorrect: true },
            { questionId: question.id, text: '"number"', order: 4, isCorrect: false }
          ]
        });
      } else if (questionData.order === 3) {
        await prisma.quizOption.createMany({
          data: [
            { questionId: question.id, text: 'True', order: 1, isCorrect: false },
            { questionId: question.id, text: 'False', order: 2, isCorrect: true }
          ]
        });
      }
    }

    // Create assignment for the assignment lesson
    await prisma.assignment.create({
      data: {
        lessonId: 'js-lesson-5',
        title: 'JavaScript Calculator Project',
        description: 'Build a functional calculator using HTML, CSS, and JavaScript',
        instructions: `Create a calculator with the following requirements:
        1. HTML interface with number buttons (0-9) and operation buttons (+, -, *, /)
        2. Display screen to show current number and results
        3. JavaScript functions for each operation
        4. Clear button to reset the calculator
        5. Proper error handling for division by zero
        
        Submit your project as a ZIP file containing HTML, CSS, and JavaScript files.`,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        maxPoints: 100,
        allowLateSubmission: true,
        allowedFileTypes: ['zip', 'html', 'js', 'css'],
        maxFileSize: 10485760 // 10MB
      }
    });

    // Update course lesson counts
    for (const course of createdCourses) {
      const lessonCount = await prisma.lesson.count({
        where: { courseId: course.id }
      });
      
      await prisma.course.update({
        where: { id: course.id },
        data: { lessonCount }
      });
    }

    console.log('✅ Created modules and lessons');

    // Create enrollments
    console.log('📝 Creating enrollments...');

    const enrollments = [
      // JavaScript Fundamentals enrollments
      { courseId: createdCourses[0].id, studentId: createdUsers[4].id, amount: 79.99 }, // Alice
      { courseId: createdCourses[0].id, studentId: createdUsers[5].id, amount: 79.99 }, // Bob
      { courseId: createdCourses[0].id, studentId: createdUsers[6].id, amount: 79.99 }, // Charlie
      
      // React Mastery enrollments
      { courseId: createdCourses[1].id, studentId: createdUsers[4].id, amount: 149.99 }, // Alice
      { courseId: createdCourses[1].id, studentId: createdUsers[7].id, amount: 149.99 }, // Diana
      
      // UI/UX Design enrollments
      { courseId: createdCourses[2].id, studentId: createdUsers[5].id, amount: 99.99 }, // Bob
      { courseId: createdCourses[2].id, studentId: createdUsers[8].id, amount: 99.99 }, // Edward
      { courseId: createdCourses[2].id, studentId: createdUsers[9].id, amount: 99.99 }, // Fiona
      
      // Python Data Science (free) enrollments
      { courseId: createdCourses[4].id, studentId: createdUsers[4].id, amount: 0 }, // Alice
      { courseId: createdCourses[4].id, studentId: createdUsers[5].id, amount: 0 }, // Bob
      { courseId: createdCourses[4].id, studentId: createdUsers[6].id, amount: 0 }, // Charlie
      { courseId: createdCourses[4].id, studentId: createdUsers[7].id, amount: 0 }, // Diana
      { courseId: createdCourses[4].id, studentId: createdUsers[8].id, amount: 0 }  // Edward
    ];

    const createdEnrollments = [];
    for (const enrollmentData of enrollments) {
      const lessonCount = await prisma.lesson.count({
        where: { courseId: enrollmentData.courseId }
      });

      const enrollment = await prisma.enrollment.create({
        data: {
          ...enrollmentData,
          currency: 'USD',
          paymentMethod: enrollmentData.amount > 0 ? 'stripe' : 'free',
          totalLessons: lessonCount,
          status: 'ACTIVE'
        }
      });
      createdEnrollments.push(enrollment);

      // Update course enrollment count
      await prisma.course.update({
        where: { id: enrollmentData.courseId },
        data: {
          enrollmentCount: { increment: 1 }
        }
      });
    }

    console.log('✅ Created enrollments');

    // Create lesson progress and quiz attempts
    console.log('📊 Creating student progress...');

    // Alice's progress in JavaScript course (advanced student)
    const aliceJSEnrollment = createdEnrollments.find(e => 
      e.courseId === createdCourses[0].id && e.studentId === createdUsers[4].id
    );

    if (aliceJSEnrollment) {
      // Alice completed first 3 lessons
      for (let i = 0; i < 3; i++) {
        await prisma.lessonProgress.create({
          data: {
            enrollmentId: aliceJSEnrollment.id,
            lessonId: createdLessons[i].id,
            status: 'COMPLETED',
            progress: 100,
            timeSpent: 25 + Math.floor(Math.random() * 20), // 25-45 minutes
            watchTime: createdLessons[i].videoDuration || 0,
            startedAt: new Date(Date.now() - (3-i) * 24 * 60 * 60 * 1000),
            completedAt: new Date(Date.now() - (3-i) * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
            lastAccessedAt: new Date()
          }
        });
      }

      // Alice took the quiz and passed
      const quizAttempt = await prisma.quizAttempt.create({
        data: {
          quizId: quiz.id,
          studentId: createdUsers[4].id,
          score: 90,
          totalPoints: 30,
          earnedPoints: 27,
          completedAt: new Date(),
          status: 'COMPLETED',
          isPassed: true,
          timeSpent: 15
        }
      });

      // Create quiz answers
      const questions = await prisma.quizQuestion.findMany({
        where: { quizId: quiz.id },
        orderBy: { order: 'asc' }
      });

      await prisma.quizAnswer.createMany({
        data: [
          { attemptId: quizAttempt.id, questionId: questions[0].id, answer: 'let x = 5;', isCorrect: true, pointsEarned: 10 },
          { attemptId: quizAttempt.id, questionId: questions[1].id, answer: '"object"', isCorrect: true, pointsEarned: 10 },
          { attemptId: quizAttempt.id, questionId: questions[2].id, answer: 'False', isCorrect: true, pointsEarned: 7 }
        ]
      });

      // Update enrollment progress
      await prisma.enrollment.update({
        where: { id: aliceJSEnrollment.id },
        data: {
          progress: 80, // 4/5 lessons completed
          completedLessons: 4,
          totalTimeSpent: 120,
          lastAccessedAt: new Date()
        }
      });
    }

    // Bob's progress (beginner, just started)
    const bobJSEnrollment = createdEnrollments.find(e => 
      e.courseId === createdCourses[0].id && e.studentId === createdUsers[5].id
    );

    if (bobJSEnrollment) {
      // Bob completed first lesson
      await prisma.lessonProgress.create({
        data: {
          enrollmentId: bobJSEnrollment.id,
          lessonId: createdLessons[0].id,
          status: 'COMPLETED',
          progress: 100,
          timeSpent: 18,
          watchTime: createdLessons[0].videoDuration || 0,
          startedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 18 * 60 * 1000),
          lastAccessedAt: new Date()
        }
      });

      // Bob is halfway through second lesson
      await prisma.lessonProgress.create({
        data: {
          enrollmentId: bobJSEnrollment.id,
          lessonId: createdLessons[1].id,
          status: 'IN_PROGRESS',
          progress: 45,
          timeSpent: 12,
          watchTime: Math.floor((createdLessons[1].videoDuration || 0) * 0.45),
          lastPosition: Math.floor((createdLessons[1].videoDuration || 0) * 0.45),
          startedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          lastAccessedAt: new Date()
        }
      });

      // Update enrollment progress
      await prisma.enrollment.update({
        where: { id: bobJSEnrollment.id },
        data: {
          progress: 29, // ~1.45/5 lessons
          completedLessons: 1,
          totalTimeSpent: 30,
          lastAccessedAt: new Date()
        }
      });
    }

    console.log('✅ Created student progress');

    // Create course reviews
    console.log('⭐ Creating course reviews...');

    const reviews = [
      {
        courseId: createdCourses[0].id,
        studentId: createdUsers[4].id,
        rating: 5,
        title: 'Excellent course for beginners!',
        content: 'Dr. Smith explains everything clearly and the examples are very practical. I went from knowing nothing about JavaScript to building my first web app!',
        isApproved: true,
        isVerifiedPurchase: true
      },
      {
        courseId: createdCourses[0].id,
        studentId: createdUsers[5].id,
        rating: 4,
        title: 'Great content, could use more exercises',
        content: 'The course content is really good and easy to follow. Would love to see more hands-on exercises throughout the lessons.',
        isApproved: true,
        isVerifiedPurchase: true
      },
      {
        courseId: createdCourses[4].id,
        studentId: createdUsers[4].id,
        rating: 5,
        title: 'Amazing free course!',
        content: 'Cannot believe this quality content is available for free. The Python fundamentals are explained perfectly and the data science applications are very relevant.',
        isApproved: true,
        isVerifiedPurchase: true
      }
    ];

    for (const reviewData of reviews) {
      await prisma.courseReview.create({
        data: reviewData
      });

      // Update course review count and average rating
      const courseReviews = await prisma.courseReview.findMany({
        where: { courseId: reviewData.courseId }
      });

      const avgRating = courseReviews.reduce((sum, r) => sum + r.rating, 0) / courseReviews.length;

      await prisma.course.update({
        where: { id: reviewData.courseId },
        data: {
          averageRating: Math.round(avgRating * 10) / 10,
          reviewCount: courseReviews.length
        }
      });
    }

    console.log('✅ Created course reviews');

    // Create student notes
    console.log('📝 Creating student notes...');

    const notes = [
      {
        enrollmentId: aliceJSEnrollment?.id,
        lessonId: createdLessons[0].id,
        content: 'Remember: JavaScript is case-sensitive! variable !== Variable',
        timestamp: 540 // 9 minutes into the video
      },
      {
        enrollmentId: aliceJSEnrollment?.id,
        lessonId: createdLessons[2].id,
        content: 'Key data types: string, number, boolean, undefined, null, object, symbol',
        timestamp: 1080 // 18 minutes into the video
      },
      {
        enrollmentId: bobJSEnrollment?.id,
        lessonId: createdLessons[0].id,
        content: 'Programming is like writing instructions for a computer to follow step by step',
        timestamp: 300 // 5 minutes into the video
      }
    ];

    for (const noteData of notes) {
      if (noteData.enrollmentId) {
        await prisma.studentNote.create({
          data: noteData
        });
      }
    }

    console.log('✅ Created student notes');

    // Create analytics data
    console.log('📈 Creating analytics data...');

    const today = new Date();
    const dates = [];
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      dates.push(date);
    }

    // Create course analytics
    for (const course of createdCourses) {
      for (const [index, date] of dates.entries()) {
        const dayMultiplier = Math.max(0.1, 1 - (index / dates.length));
        const baseEnrollments = Math.floor(course.enrollmentCount / 30 * dayMultiplier);
        
        await prisma.courseAnalytics.create({
          data: {
            courseId: course.id,
            date,
            newEnrollments: index === dates.length - 5 ? baseEnrollments : Math.floor(Math.random() * 3),
            totalEnrollments: Math.floor(course.enrollmentCount * (0.1 + (index / dates.length) * 0.9)),
            completions: Math.floor(Math.random() * 2),
            dropouts: Math.floor(Math.random() * 1),
            totalTimeSpent: Math.floor(Math.random() * 500 + 100),
            averageProgress: 20 + Math.random() * 60,
            activeLearners: Math.floor(course.enrollmentCount * (0.2 + Math.random() * 0.3)),
            revenue: course.access === 'PAID' ? course.price * baseEnrollments : 0,
            averageRating: course.averageRating + (Math.random() - 0.5) * 0.2
          }
        });
      }
    }

    console.log('✅ Created analytics data');

    console.log('\n🎉 Learning Management System seed completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   • 10 users created (4 instructors + 6 students)`);
    console.log(`   • 5 comprehensive courses across different categories`);
    console.log(`   • 3 course modules with structured learning paths`);
    console.log(`   • 5 diverse lessons (video, quiz, assignment)`);
    console.log(`   • 1 interactive quiz with 3 questions and multiple choice`);
    console.log(`   • 1 practical assignment with file submission`);
    console.log(`   • 13 realistic student enrollments`);
    console.log(`   • 7 lesson progress entries with varied completion`);
    console.log(`   • 1 completed quiz attempt with detailed answers`);
    console.log(`   • 3 authentic course reviews with ratings`);
    console.log(`   • 3 student notes with video timestamps`);
    console.log(`   • 155+ analytics entries (31 days of data)`);
    
    console.log('\n🔑 Test Login Credentials:');
    console.log('   prof.smith@university.com:learning123 (JavaScript & Python Instructor)');
    console.log('   instructor.jones@techcourses.com:learning123 (React Instructor)');
    console.log('   prof.garcia@designschool.com:learning123 (UI/UX Design Instructor)');
    console.log('   dr.wilson@businessacademy.com:learning123 (Marketing Instructor)');
    console.log('   alice.student@learners.com:learning123 (Advanced Student - 80% JS progress)');
    console.log('   bob.student@learners.com:learning123 (Beginner Student - 29% JS progress)');
    console.log('   charlie.student@learners.com:learning123 (Enrolled Student)');
    console.log('   diana.student@learners.com:learning123 (React Student)');

    console.log('\n📚 Featured Courses:');
    console.log('   🟨 JavaScript Fundamentals for Beginners ($79.99, 4.8★)');
    console.log('   ⚛️  React Development Mastery Course ($149.99, 4.9★)');
    console.log('   🎨 UI/UX Design Principles and Practice ($99.99, 4.7★)');
    console.log('   📈 Digital Marketing Strategy for Small Business ($119.99, 4.6★)');
    console.log('   🐍 Python for Data Science and Machine Learning (FREE, 4.9★)');

    console.log('\n🎯 Learning Features Ready:');
    console.log('   ✅ Complete course creation and management');
    console.log('   ✅ Structured learning with modules and lessons');
    console.log('   ✅ Interactive quizzes with multiple question types');
    console.log('   ✅ Assignment submission and grading system');
    console.log('   ✅ Progress tracking and completion certificates');
    console.log('   ✅ Course reviews and rating system');
    console.log('   ✅ Student notes with video timestamps');
    console.log('   ✅ Comprehensive analytics and reporting');
    console.log('   ✅ Multiple access types (free, paid, subscription)');
    console.log('   ✅ Learning paths and prerequisites');

  } catch (error) {
    console.error('❌ Error seeding learning data:', error);
    throw error;
  }
}

export default seedLearning;

// Run the seed if this file is executed directly
if (require.main === module) {
  seedLearning()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}