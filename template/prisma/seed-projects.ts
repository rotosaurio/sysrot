import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedProjects() {
  console.log('🚀 Starting Project Management seed...');

  try {
    // Create project management users
    console.log('👥 Creating project users...');
    
    const passwordHash = await bcrypt.hash('project123', 10);

    const users = [
      {
        email: 'alex@devteam.com',
        name: 'Alex Rodriguez',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      {
        email: 'emma@devteam.com', 
        name: 'Emma Johnson',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
      },
      {
        email: 'carlos@devteam.com',
        name: 'Carlos Martinez',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      },
      {
        email: 'sarah@devteam.com',
        name: 'Sarah Wilson',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
      },
      {
        email: 'david@devteam.com',
        name: 'David Kim',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
      },
      {
        email: 'lisa@devteam.com',
        name: 'Lisa Chen',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face'
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

    console.log('✅ Created project users');

    // Create organizations for projects
    console.log('🏢 Creating organizations...');

    const organizations = [
      {
        id: 'tech-innovations',
        name: 'Tech Innovations Inc',
        slug: 'tech-innovations',
        description: 'Leading software development company',
        userLimit: 50,
        status: 'ACTIVE'
      },
      {
        id: 'startup-labs',
        name: 'Startup Labs',
        slug: 'startup-labs',
        description: 'Agile startup development team',
        userLimit: 25,
        status: 'ACTIVE'
      }
    ];

    const createdOrgs = [];
    for (const orgData of organizations) {
      const org = await prisma.organization.upsert({
        where: { slug: orgData.slug },
        update: {},
        create: orgData
      });
      createdOrgs.push(org);

      // Add organization membership
      await prisma.organizationMember.upsert({
        where: {
          organizationId_userId: {
            organizationId: org.id,
            userId: createdUsers[0].id
          }
        },
        update: {},
        create: {
          organizationId: org.id,
          userId: createdUsers[0].id,
          role: 'OWNER'
        }
      });
    }

    console.log('✅ Created organizations');

    // Create projects
    console.log('🚀 Creating projects...');

    const projects = [
      {
        id: 'web-platform',
        name: 'E-Commerce Web Platform',
        description: 'Modern e-commerce platform with React, Node.js, and PostgreSQL. Features include user authentication, product catalog, shopping cart, payment processing, and admin dashboard.',
        key: 'ECOM',
        avatar: '🛒',
        color: '#3B82F6',
        projectType: 'SOFTWARE',
        methodology: 'SCRUM',
        status: 'ACTIVE',
        visibility: 'ORGANIZATION',
        priority: 'HIGH',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-06-15'),
        estimatedHours: 2400,
        budget: 150000,
        client: 'RetailCorp',
        organizationId: createdOrgs[0].id,
        ownerId: createdUsers[0].id,
        settings: JSON.stringify({
          enableTimeTracking: true,
          autoAssignSprints: true,
          defaultEstimation: 'storyPoints'
        })
      },
      {
        id: 'mobile-app',
        name: 'Mobile Fitness App',
        description: 'Cross-platform mobile fitness application with workout tracking, nutrition planning, social features, and AI-powered recommendations.',
        key: 'FIT',
        avatar: '💪',
        color: '#10B981',
        projectType: 'SOFTWARE',
        methodology: 'AGILE',
        status: 'ACTIVE',
        visibility: 'ORGANIZATION',
        priority: 'MEDIUM',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-08-01'),
        estimatedHours: 1800,
        budget: 120000,
        organizationId: createdOrgs[0].id,
        ownerId: createdUsers[1].id
      },
      {
        id: 'marketing-campaign',
        name: 'Product Launch Campaign',
        description: 'Comprehensive marketing campaign for new product launch including digital marketing, content creation, social media strategy, and influencer partnerships.',
        key: 'MKTG',
        avatar: '📢',
        color: '#F59E0B',
        projectType: 'MARKETING',
        methodology: 'KANBAN',
        status: 'ACTIVE',
        visibility: 'TEAM',
        priority: 'HIGH',
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-05-31'),
        estimatedHours: 960,
        budget: 80000,
        organizationId: createdOrgs[1].id,
        ownerId: createdUsers[2].id
      },
      {
        id: 'ai-research',
        name: 'AI Research Project',
        description: 'Research and development of machine learning algorithms for predictive analytics in e-commerce. Includes data collection, model training, and deployment.',
        key: 'AI',
        avatar: '🤖',
        color: '#8B5CF6',
        projectType: 'RESEARCH',
        methodology: 'CUSTOM',
        status: 'ACTIVE',
        visibility: 'PRIVATE',
        priority: 'MEDIUM',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        estimatedHours: 3200,
        budget: 200000,
        ownerId: createdUsers[3].id
      }
    ];

    const createdProjects = [];
    for (const projectData of projects) {
      const project = await prisma.project.upsert({
        where: { id: projectData.id },
        update: {},
        create: projectData
      });
      createdProjects.push(project);

      // Add project members
      const memberRoles = [
        { userId: createdUsers[0].id, role: 'OWNER' },
        { userId: createdUsers[1].id, role: 'ADMIN' },
        { userId: createdUsers[2].id, role: 'MANAGER' },
        { userId: createdUsers[3].id, role: 'DEVELOPER' },
        { userId: createdUsers[4].id, role: 'DEVELOPER' },
        { userId: createdUsers[5].id, role: 'TESTER' }
      ];

      for (const [index, memberData] of memberRoles.entries()) {
        if (index < 4 + Math.floor(Math.random() * 3)) { // 4-6 members per project
          await prisma.projectMember.upsert({
            where: {
              projectId_userId: {
                projectId: project.id,
                userId: memberData.userId
              }
            },
            update: {},
            create: {
              projectId: project.id,
              userId: memberData.userId,
              role: memberData.role,
              hourlyRate: 50 + Math.floor(Math.random() * 100)
            }
          });
        }
      }
    }

    console.log('✅ Created projects');

    // Create task categories and labels
    console.log('🏷️ Creating categories and labels...');

    const categories = [
      { projectId: createdProjects[0].id, name: 'Frontend', description: 'User interface development', color: '#3B82F6', icon: '🎨' },
      { projectId: createdProjects[0].id, name: 'Backend', description: 'Server-side development', color: '#10B981', icon: '⚙️' },
      { projectId: createdProjects[0].id, name: 'Database', description: 'Database design and optimization', color: '#F59E0B', icon: '🗄️' },
      { projectId: createdProjects[1].id, name: 'Mobile UI', description: 'Mobile interface design', color: '#EC4899', icon: '📱' },
      { projectId: createdProjects[1].id, name: 'API Development', description: 'Mobile app backend', color: '#10B981', icon: '🔌' },
      { projectId: createdProjects[2].id, name: 'Content Creation', description: 'Marketing content', color: '#F59E0B', icon: '✍️' },
      { projectId: createdProjects[2].id, name: 'Social Media', description: 'Social media management', color: '#3B82F6', icon: '📱' }
    ];

    for (const categoryData of categories) {
      await prisma.taskCategory.create({
        data: categoryData
      });
    }

    const labels = [
      { projectId: createdProjects[0].id, name: 'urgent', color: '#EF4444' },
      { projectId: createdProjects[0].id, name: 'bug', color: '#F59E0B' },
      { projectId: createdProjects[0].id, name: 'feature', color: '#10B981' },
      { projectId: createdProjects[1].id, name: 'ios', color: '#000000' },
      { projectId: createdProjects[1].id, name: 'android', color: '#3DDC84' },
      { projectId: createdProjects[2].id, name: 'campaign', color: '#8B5CF6' }
    ];

    for (const labelData of labels) {
      await prisma.taskLabel.create({
        data: labelData
      });
    }

    console.log('✅ Created categories and labels');

    // Create sprints
    console.log('🏃 Creating sprints...');

    const sprints = [
      {
        projectId: createdProjects[0].id,
        name: 'Sprint 1 - Foundation',
        goal: 'Set up project infrastructure and basic authentication',
        description: 'Initialize the project with proper setup, authentication, and core components',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-01-29'),
        status: 'COMPLETED',
        capacity: 80,
        velocity: 25,
        actualVelocity: 23
      },
      {
        projectId: createdProjects[0].id,
        name: 'Sprint 2 - Core Features',
        goal: 'Implement product catalog and shopping cart functionality',
        description: 'Build the main e-commerce features for browsing and purchasing',
        startDate: new Date('2024-01-30'),
        endDate: new Date('2024-02-13'),
        status: 'ACTIVE',
        capacity: 80,
        velocity: 28
      },
      {
        projectId: createdProjects[1].id,
        name: 'Sprint 1 - Mobile Setup',
        goal: 'Setup React Native project and basic navigation',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-02-15'),
        status: 'ACTIVE',
        capacity: 60,
        velocity: 20
      }
    ];

    const createdSprints = [];
    for (const sprintData of sprints) {
      const sprint = await prisma.sprint.create({
        data: sprintData
      });
      createdSprints.push(sprint);
    }

    console.log('✅ Created sprints');

    // Create tasks
    console.log('📋 Creating tasks...');

    const tasks = [
      // E-Commerce Project Tasks
      {
        key: 'ECOM-1',
        title: 'Setup Next.js project with TypeScript',
        description: 'Initialize the Next.js project with TypeScript configuration, ESLint, Prettier, and basic folder structure',
        type: 'TASK',
        status: 'DONE',
        priority: 'HIGH',
        projectId: createdProjects[0].id,
        assigneeId: createdUsers[0].id,
        reporterId: createdUsers[0].id,
        sprintId: createdSprints[0].id,
        estimatedHours: 8,
        storyPoints: 3,
        resolvedAt: new Date('2024-01-18'),
        businessValue: 10
      },
      {
        key: 'ECOM-2',
        title: 'Implement user authentication system',
        description: 'Create user registration, login, logout functionality with JWT tokens and password hashing',
        type: 'STORY',
        status: 'DONE',
        priority: 'HIGH',
        projectId: createdProjects[0].id,
        assigneeId: createdUsers[1].id,
        reporterId: createdUsers[0].id,
        sprintId: createdSprints[0].id,
        estimatedHours: 24,
        storyPoints: 8,
        resolvedAt: new Date('2024-01-25'),
        businessValue: 15
      },
      {
        key: 'ECOM-3',
        title: 'Design product catalog interface',
        description: 'Create responsive product listing page with filters, search, and pagination',
        type: 'STORY',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        projectId: createdProjects[0].id,
        assigneeId: createdUsers[2].id,
        reporterId: createdUsers[0].id,
        sprintId: createdSprints[1].id,
        estimatedHours: 32,
        storyPoints: 13,
        startDate: new Date('2024-02-01'),
        dueDate: new Date('2024-02-10'),
        businessValue: 20
      },
      {
        key: 'ECOM-4',
        title: 'Shopping cart functionality',
        description: 'Implement add to cart, remove from cart, update quantities, and cart persistence',
        type: 'EPIC',
        status: 'TODO',
        priority: 'HIGH',
        projectId: createdProjects[0].id,
        assigneeId: createdUsers[3].id,
        reporterId: createdUsers[0].id,
        sprintId: createdSprints[1].id,
        estimatedHours: 40,
        storyPoints: 21,
        businessValue: 25
      },
      {
        key: 'ECOM-5',
        title: 'Fix product image loading issue',
        description: 'Images not loading properly on product detail pages in Safari browser',
        type: 'BUG',
        status: 'TODO',
        priority: 'MEDIUM',
        projectId: createdProjects[0].id,
        assigneeId: createdUsers[4].id,
        reporterId: createdUsers[2].id,
        estimatedHours: 4,
        storyPoints: 2,
        environment: 'Safari',
        version: '1.0.0'
      },

      // Mobile App Tasks
      {
        key: 'FIT-1',
        title: 'Setup React Native development environment',
        description: 'Configure React Native CLI, Android Studio, Xcode, and project dependencies',
        type: 'TASK',
        status: 'DONE',
        priority: 'HIGH',
        projectId: createdProjects[1].id,
        assigneeId: createdUsers[1].id,
        reporterId: createdUsers[1].id,
        sprintId: createdSprints[2].id,
        estimatedHours: 12,
        storyPoints: 5,
        resolvedAt: new Date('2024-02-05')
      },
      {
        key: 'FIT-2',
        title: 'Create workout tracking interface',
        description: 'Design and implement workout logging screens with exercise selection and progress tracking',
        type: 'STORY',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        projectId: createdProjects[1].id,
        assigneeId: createdUsers[3].id,
        reporterId: createdUsers[1].id,
        sprintId: createdSprints[2].id,
        estimatedHours: 28,
        storyPoints: 13,
        startDate: new Date('2024-02-06'),
        businessValue: 18
      },

      // Marketing Campaign Tasks
      {
        key: 'MKTG-1',
        title: 'Develop brand messaging strategy',
        description: 'Create comprehensive brand messaging framework including value propositions, key messages, and target audience personas',
        type: 'TASK',
        status: 'DONE',
        priority: 'HIGH',
        projectId: createdProjects[2].id,
        assigneeId: createdUsers[2].id,
        reporterId: createdUsers[2].id,
        estimatedHours: 16,
        resolvedAt: new Date('2024-03-08'),
        businessValue: 12
      },
      {
        key: 'MKTG-2',
        title: 'Social media content calendar',
        description: 'Plan and create 3-month social media content calendar with posts, hashtags, and engagement strategies',
        type: 'STORY',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        projectId: createdProjects[2].id,
        assigneeId: createdUsers[5].id,
        reporterId: createdUsers[2].id,
        estimatedHours: 24,
        startDate: new Date('2024-03-10'),
        dueDate: new Date('2024-03-20')
      },

      // AI Research Tasks
      {
        key: 'AI-1',
        title: 'Data collection and preprocessing pipeline',
        description: 'Build automated data collection system for e-commerce user behavior data with cleaning and preprocessing capabilities',
        type: 'EPIC',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        projectId: createdProjects[3].id,
        assigneeId: createdUsers[3].id,
        reporterId: createdUsers[3].id,
        estimatedHours: 80,
        storyPoints: 34,
        startDate: new Date('2024-01-15'),
        businessValue: 30
      }
    ];

    const createdTasks = [];
    for (const taskData of tasks) {
      const task = await prisma.task.create({
        data: taskData
      });
      createdTasks.push(task);

      // Add task watchers
      await prisma.taskWatcher.create({
        data: {
          taskId: task.id,
          userId: task.reporterId
        }
      });

      if (task.assigneeId && task.assigneeId !== task.reporterId) {
        await prisma.taskWatcher.create({
          data: {
            taskId: task.id,
            userId: task.assigneeId
          }
        });
      }
    }

    console.log('✅ Created tasks');

    // Create task comments
    console.log('💬 Creating comments...');

    const comments = [
      {
        taskId: createdTasks[0].id,
        authorId: createdUsers[1].id,
        content: 'Great job setting up the project! The TypeScript configuration looks solid.',
        isInternal: false
      },
      {
        taskId: createdTasks[1].id,
        authorId: createdUsers[0].id,
        content: 'Authentication system is working perfectly. We should consider adding 2FA in the future.',
        isInternal: false
      },
      {
        taskId: createdTasks[2].id,
        authorId: createdUsers[0].id,
        content: 'The design looks amazing! Can we add sorting by price and rating?',
        isInternal: false
      },
      {
        taskId: createdTasks[2].id,
        authorId: createdUsers[2].id,
        content: 'Absolutely! I\'ll add those sorting options in the next iteration.',
        isInternal: false
      },
      {
        taskId: createdTasks[4].id,
        authorId: createdUsers[4].id,
        content: 'I think the issue is related to CORS policy in Safari. Investigating now.',
        isInternal: true
      }
    ];

    for (const commentData of comments) {
      await prisma.taskComment.create({
        data: commentData
      });
    }

    console.log('✅ Created comments');

    // Create time entries
    console.log('⏰ Creating time entries...');

    const timeEntries = [
      {
        projectId: createdProjects[0].id,
        taskId: createdTasks[0].id,
        userId: createdUsers[0].id,
        hours: 8,
        description: 'Project setup and configuration',
        date: new Date('2024-01-16'),
        billable: true,
        hourlyRate: 75,
        approved: true,
        approvedById: createdUsers[0].id,
        approvedAt: new Date('2024-01-17')
      },
      {
        projectId: createdProjects[0].id,
        taskId: createdTasks[1].id,
        userId: createdUsers[1].id,
        hours: 6,
        description: 'Authentication API development',
        date: new Date('2024-01-22'),
        billable: true,
        hourlyRate: 70,
        approved: true
      },
      {
        projectId: createdProjects[0].id,
        taskId: createdTasks[2].id,
        userId: createdUsers[2].id,
        hours: 5,
        description: 'Product catalog UI design',
        date: new Date('2024-02-02'),
        billable: true,
        hourlyRate: 65
      },
      {
        projectId: createdProjects[1].id,
        taskId: createdTasks[5].id,
        userId: createdUsers[1].id,
        hours: 8,
        description: 'React Native environment setup',
        date: new Date('2024-02-03'),
        billable: true,
        hourlyRate: 70,
        approved: true
      }
    ];

    for (const timeEntryData of timeEntries) {
      await prisma.timeEntry.create({
        data: timeEntryData
      });
    }

    console.log('✅ Created time entries');

    // Create project activities
    console.log('📊 Creating project activities...');

    const activities = [
      {
        projectId: createdProjects[0].id,
        userId: createdUsers[0].id,
        action: 'project_created',
        entityType: 'project',
        entityId: createdProjects[0].id,
        description: 'E-Commerce Web Platform project was created',
        metadata: JSON.stringify({ projectKey: 'ECOM' })
      },
      {
        projectId: createdProjects[0].id,
        userId: createdUsers[0].id,
        action: 'task_created',
        entityType: 'task',
        entityId: createdTasks[0].id,
        description: 'Task ECOM-1 "Setup Next.js project" was created',
        metadata: JSON.stringify({ taskKey: 'ECOM-1', taskType: 'TASK' })
      },
      {
        projectId: createdProjects[0].id,
        userId: createdUsers[1].id,
        action: 'task_completed',
        entityType: 'task',
        entityId: createdTasks[1].id,
        description: 'Task ECOM-2 "Authentication system" was completed',
        metadata: JSON.stringify({ taskKey: 'ECOM-2', completionTime: '24 hours' })
      }
    ];

    for (const activityData of activities) {
      await prisma.projectActivity.create({
        data: activityData
      });
    }

    console.log('✅ Created project activities');

    // Create milestones
    console.log('🎯 Creating milestones...');

    const milestones = [
      {
        projectId: createdProjects[0].id,
        name: 'MVP Release',
        description: 'Minimum viable product with core e-commerce functionality',
        dueDate: new Date('2024-04-15'),
        status: 'OPEN',
        progress: 35
      },
      {
        projectId: createdProjects[0].id,
        name: 'Beta Testing',
        description: 'Complete beta testing with selected customers',
        dueDate: new Date('2024-05-15'),
        status: 'OPEN',
        progress: 10
      },
      {
        projectId: createdProjects[1].id,
        name: 'Alpha Version',
        description: 'First working version of the mobile app',
        dueDate: new Date('2024-05-01'),
        status: 'OPEN',
        progress: 25
      }
    ];

    for (const milestoneData of milestones) {
      await prisma.milestone.create({
        data: milestoneData
      });
    }

    console.log('✅ Created milestones');

    console.log('\n🎉 Project Management seed completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   • 6 project team members created`);
    console.log(`   • 2 organizations with team structure`);
    console.log(`   • 4 diverse projects (Software, Marketing, Research)`);
    console.log(`   • 7 task categories and 6 labels`);
    console.log(`   • 3 active sprints with planning`);
    console.log(`   • 10 realistic tasks with different types and statuses`);
    console.log(`   • 5 task comments with team interactions`);
    console.log(`   • 4 time entries with billing information`);
    console.log(`   • 3 project activities for audit trail`);
    console.log(`   • 3 project milestones for tracking`);
    
    console.log('\n🔑 Test Login Credentials:');
    console.log('   alex@devteam.com:project123 (Project Owner & Team Lead)');
    console.log('   emma@devteam.com:project123 (Mobile App Lead)');
    console.log('   carlos@devteam.com:project123 (Marketing Manager)');
    console.log('   sarah@devteam.com:project123 (AI Research Lead)');
    console.log('   david@devteam.com:project123 (Full-Stack Developer)');
    console.log('   lisa@devteam.com:project123 (QA Tester)');

    console.log('\n🚀 Projects Ready:');
    console.log('   ✅ E-Commerce Web Platform (ECOM) - Scrum methodology');
    console.log('   ✅ Mobile Fitness App (FIT) - Agile methodology');  
    console.log('   ✅ Product Launch Campaign (MKTG) - Kanban methodology');
    console.log('   ✅ AI Research Project (AI) - Custom methodology');

    console.log('\n🛠️ Features Ready:');
    console.log('   ✅ Multi-project management with role-based access');
    console.log('   ✅ Agile workflows (Scrum, Kanban, Custom)');
    console.log('   ✅ Sprint planning and tracking');
    console.log('   ✅ Task management with epics, stories, bugs');
    console.log('   ✅ Time tracking and billing');
    console.log('   ✅ Team collaboration with comments and watchers');
    console.log('   ✅ Project analytics and reporting');
    console.log('   ✅ Milestone tracking and progress monitoring');

  } catch (error) {
    console.error('❌ Error seeding project data:', error);
    throw error;
  }
}

export default seedProjects;

// Run the seed if this file is executed directly
if (require.main === module) {
  seedProjects()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}