import { PrismaClient, OrganizationRole, OrganizationStatus, PlanStatus, SubscriptionStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedSaaS() {
  console.log('🚀 Starting SaaS Multi-tenant seed...');

  try {
    // Create SaaS Plans
    console.log('📋 Creating subscription plans...');
    
    const starterPlan = await prisma.plan.upsert({
      where: { slug: 'starter' },
      update: {},
      create: {
        name: 'Starter',
        slug: 'starter',
        description: 'Perfect for small teams getting started',
        price: 0, // Free tier
        yearlyPrice: 0,
        features: JSON.stringify([
          'Up to 5 team members',
          '1GB storage',
          '1,000 API requests/month',
          'Email support',
          'Basic analytics',
          'Standard integrations'
        ]),
        userLimit: 5,
        storageLimit: 1000, // 1GB in MB
        apiLimit: 1000,
        stripePriceId: null, // Free plan
        stripeProductId: null,
        status: PlanStatus.ACTIVE,
        popular: false
      }
    });

    const proPlan = await prisma.plan.upsert({
      where: { slug: 'pro' },
      update: {},
      create: {
        name: 'Pro',
        slug: 'pro',
        description: 'For growing teams that need more power',
        price: 29,
        yearlyPrice: 290, // $290/year (2 months free)
        features: JSON.stringify([
          'Up to 25 team members',
          '25GB storage',
          '25,000 API requests/month',
          'Priority email support',
          'Advanced analytics',
          'All integrations',
          'Custom branding',
          'Team collaboration tools'
        ]),
        userLimit: 25,
        storageLimit: 25000, // 25GB in MB
        apiLimit: 25000,
        stripePriceId: 'price_pro_monthly', // Placeholder
        stripeProductId: 'prod_pro',
        status: PlanStatus.ACTIVE,
        popular: true
      }
    });

    const businessPlan = await prisma.plan.upsert({
      where: { slug: 'business' },
      update: {},
      create: {
        name: 'Business',
        slug: 'business',
        description: 'For established businesses with advanced needs',
        price: 99,
        yearlyPrice: 990, // $990/year (2 months free)
        features: JSON.stringify([
          'Up to 100 team members',
          '100GB storage',
          '100,000 API requests/month',
          '24/7 phone & email support',
          'Premium analytics & reporting',
          'All integrations + API access',
          'White-label options',
          'Advanced security features',
          'SLA guarantee'
        ]),
        userLimit: 100,
        storageLimit: 100000, // 100GB in MB
        apiLimit: 100000,
        stripePriceId: 'price_business_monthly', // Placeholder
        stripeProductId: 'prod_business',
        status: PlanStatus.ACTIVE,
        popular: false
      }
    });

    const enterprisePlan = await prisma.plan.upsert({
      where: { slug: 'enterprise' },
      update: {},
      create: {
        name: 'Enterprise',
        slug: 'enterprise',
        description: 'Custom solutions for large organizations',
        price: 299,
        yearlyPrice: 2990,
        features: JSON.stringify([
          'Unlimited team members',
          '1TB storage',
          'Unlimited API requests',
          'Dedicated account manager',
          'Custom analytics & reporting',
          'Custom integrations',
          'Full white-label',
          'Enterprise security & compliance',
          'Custom SLA',
          'On-premise deployment options'
        ]),
        userLimit: 1000, // High limit
        storageLimit: 1000000, // 1TB in MB
        apiLimit: 1000000,
        stripePriceId: 'price_enterprise_monthly', // Placeholder
        stripeProductId: 'prod_enterprise',
        status: PlanStatus.ACTIVE,
        popular: false
      }
    });

    console.log('✅ Created subscription plans');

    // Create sample users
    console.log('👥 Creating sample users...');
    
    const passwordHash = await bcrypt.hash('saas123', 10);

    const johnUser = await prisma.user.upsert({
      where: { email: 'john@acmecorp.com' },
      update: {},
      create: {
        name: 'John Smith',
        email: 'john@acmecorp.com',
        password: passwordHash,
        role: 'user',
        emailVerified: new Date(),
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      }
    });

    const sarahUser = await prisma.user.upsert({
      where: { email: 'sarah@techsolutions.io' },
      update: {},
      create: {
        name: 'Sarah Johnson',
        email: 'sarah@techsolutions.io',
        password: passwordHash,
        role: 'user',
        emailVerified: new Date(),
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
      }
    });

    const mikeUser = await prisma.user.upsert({
      where: { email: 'mike@startupxyz.com' },
      update: {},
      create: {
        name: 'Mike Chen',
        email: 'mike@startupxyz.com',
        password: passwordHash,
        role: 'user',
        emailVerified: new Date(),
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      }
    });

    // Additional team members
    const emmaUser = await prisma.user.upsert({
      where: { email: 'emma@acmecorp.com' },
      update: {},
      create: {
        name: 'Emma Davis',
        email: 'emma@acmecorp.com',
        password: passwordHash,
        role: 'user',
        emailVerified: new Date(),
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
      }
    });

    const alexUser = await prisma.user.upsert({
      where: { email: 'alex@techsolutions.io' },
      update: {},
      create: {
        name: 'Alex Rodriguez',
        email: 'alex@techsolutions.io',
        password: passwordHash,
        role: 'user',
        emailVerified: new Date(),
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
      }
    });

    console.log('✅ Created sample users');

    // Create sample organizations
    console.log('🏢 Creating sample organizations...');
    
    const acmeOrg = await prisma.organization.upsert({
      where: { slug: 'acme-corp' },
      update: {},
      create: {
        name: 'Acme Corporation',
        slug: 'acme-corp',
        description: 'Leading provider of innovative business solutions',
        domain: 'acmecorp.com',
        logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop',
        planId: proPlan.id,
        status: OrganizationStatus.ACTIVE,
        trialEndsAt: null, // Not on trial
        settings: JSON.stringify({
          theme: 'blue',
          notifications: {
            email: true,
            slack: false
          },
          features: {
            analytics: true,
            apiAccess: true
          }
        })
      }
    });

    const techSolutionsOrg = await prisma.organization.upsert({
      where: { slug: 'tech-solutions' },
      update: {},
      create: {
        name: 'Tech Solutions Inc',
        slug: 'tech-solutions',
        description: 'Enterprise technology consulting and development',
        domain: 'techsolutions.io',
        logo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop',
        planId: businessPlan.id,
        status: OrganizationStatus.ACTIVE,
        trialEndsAt: null,
        settings: JSON.stringify({
          theme: 'purple',
          notifications: {
            email: true,
            slack: true
          },
          features: {
            analytics: true,
            apiAccess: true,
            whiteLabel: true
          }
        })
      }
    });

    const startupOrg = await prisma.organization.upsert({
      where: { slug: 'startup-xyz' },
      update: {},
      create: {
        name: 'StartupXYZ',
        slug: 'startup-xyz',
        description: 'Innovative fintech startup disrupting payments',
        domain: 'startupxyz.com',
        logo: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=200&h=200&fit=crop',
        planId: starterPlan.id,
        status: OrganizationStatus.ACTIVE,
        trialEndsAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days left
        settings: JSON.stringify({
          theme: 'green',
          notifications: {
            email: true,
            slack: false
          },
          features: {
            analytics: false,
            apiAccess: false
          }
        })
      }
    });

    console.log('✅ Created sample organizations');

    // Create organization memberships
    console.log('👔 Creating organization memberships...');
    
    // Acme Corp members
    await prisma.organizationMember.upsert({
      where: {
        organizationId_userId: {
          organizationId: acmeOrg.id,
          userId: johnUser.id
        }
      },
      update: {},
      create: {
        organizationId: acmeOrg.id,
        userId: johnUser.id,
        role: OrganizationRole.OWNER,
        permissions: ['*'],
        joinedAt: new Date('2024-01-15'),
        lastActiveAt: new Date()
      }
    });

    await prisma.organizationMember.upsert({
      where: {
        organizationId_userId: {
          organizationId: acmeOrg.id,
          userId: emmaUser.id
        }
      },
      update: {},
      create: {
        organizationId: acmeOrg.id,
        userId: emmaUser.id,
        role: OrganizationRole.ADMIN,
        permissions: ['users.manage', 'billing.view', 'analytics.view'],
        joinedAt: new Date('2024-02-01'),
        lastActiveAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      }
    });

    // Tech Solutions members
    await prisma.organizationMember.upsert({
      where: {
        organizationId_userId: {
          organizationId: techSolutionsOrg.id,
          userId: sarahUser.id
        }
      },
      update: {},
      create: {
        organizationId: techSolutionsOrg.id,
        userId: sarahUser.id,
        role: OrganizationRole.OWNER,
        permissions: ['*'],
        joinedAt: new Date('2024-01-01'),
        lastActiveAt: new Date()
      }
    });

    await prisma.organizationMember.upsert({
      where: {
        organizationId_userId: {
          organizationId: techSolutionsOrg.id,
          userId: alexUser.id
        }
      },
      update: {},
      create: {
        organizationId: techSolutionsOrg.id,
        userId: alexUser.id,
        role: OrganizationRole.MEMBER,
        permissions: ['analytics.view'],
        joinedAt: new Date('2024-02-15'),
        lastActiveAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
      }
    });

    // StartupXYZ members
    await prisma.organizationMember.upsert({
      where: {
        organizationId_userId: {
          organizationId: startupOrg.id,
          userId: mikeUser.id
        }
      },
      update: {},
      create: {
        organizationId: startupOrg.id,
        userId: mikeUser.id,
        role: OrganizationRole.OWNER,
        permissions: ['*'],
        joinedAt: new Date('2024-03-01'),
        lastActiveAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      }
    });

    console.log('✅ Created organization memberships');

    // Create subscriptions for paid plans
    console.log('💳 Creating subscriptions...');
    
    await prisma.subscription.upsert({
      where: { organizationId: acmeOrg.id },
      update: {},
      create: {
        organizationId: acmeOrg.id,
        planId: proPlan.id,
        stripeCustomerId: 'cus_acme_corp',
        stripeSubscriptionId: 'sub_acme_pro',
        stripePriceId: 'price_pro_monthly',
        status: SubscriptionStatus.ACTIVE,
        currentPeriodStart: new Date('2024-11-01'),
        currentPeriodEnd: new Date('2024-12-01'),
        stripeCurrentPeriodEnd: new Date('2024-12-01')
      }
    });

    await prisma.subscription.upsert({
      where: { organizationId: techSolutionsOrg.id },
      update: {},
      create: {
        organizationId: techSolutionsOrg.id,
        planId: businessPlan.id,
        stripeCustomerId: 'cus_tech_solutions',
        stripeSubscriptionId: 'sub_tech_business',
        stripePriceId: 'price_business_monthly',
        status: SubscriptionStatus.ACTIVE,
        currentPeriodStart: new Date('2024-11-01'),
        currentPeriodEnd: new Date('2024-12-01'),
        stripeCurrentPeriodEnd: new Date('2024-12-01')
      }
    });

    console.log('✅ Created subscriptions');

    // Create usage data
    console.log('📊 Creating usage data...');
    
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    // Current month usage
    await prisma.usage.upsert({
      where: {
        organizationId_month_year: {
          organizationId: acmeOrg.id,
          month: currentMonth,
          year: currentYear
        }
      },
      update: {},
      create: {
        organizationId: acmeOrg.id,
        month: currentMonth,
        year: currentYear,
        users: 2,
        storage: 12000, // 12GB
        apiRequests: 18500,
        bandwidth: 8500
      }
    });

    await prisma.usage.upsert({
      where: {
        organizationId_month_year: {
          organizationId: techSolutionsOrg.id,
          month: currentMonth,
          year: currentYear
        }
      },
      update: {},
      create: {
        organizationId: techSolutionsOrg.id,
        month: currentMonth,
        year: currentYear,
        users: 2,
        storage: 45000, // 45GB
        apiRequests: 75000,
        bandwidth: 25000
      }
    });

    await prisma.usage.upsert({
      where: {
        organizationId_month_year: {
          organizationId: startupOrg.id,
          month: currentMonth,
          year: currentYear
        }
      },
      update: {},
      create: {
        organizationId: startupOrg.id,
        month: currentMonth,
        year: currentYear,
        users: 1,
        storage: 500, // 500MB
        apiRequests: 850,
        bandwidth: 300
      }
    });

    // Previous month usage for growth calculations
    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    await prisma.usage.upsert({
      where: {
        organizationId_month_year: {
          organizationId: acmeOrg.id,
          month: lastMonth,
          year: lastMonthYear
        }
      },
      update: {},
      create: {
        organizationId: acmeOrg.id,
        month: lastMonth,
        year: lastMonthYear,
        users: 1,
        storage: 8000, // 8GB
        apiRequests: 12000,
        bandwidth: 6000
      }
    });

    await prisma.usage.upsert({
      where: {
        organizationId_month_year: {
          organizationId: techSolutionsOrg.id,
          month: lastMonth,
          year: lastMonthYear
        }
      },
      update: {},
      create: {
        organizationId: techSolutionsOrg.id,
        month: lastMonth,
        year: lastMonthYear,
        users: 1,
        storage: 35000, // 35GB
        apiRequests: 60000,
        bandwidth: 20000
      }
    });

    console.log('✅ Created usage data');

    // Create sample activities
    console.log('⚡ Creating sample activities...');
    
    const activities = [
      {
        organizationId: acmeOrg.id,
        userId: johnUser.id,
        action: 'organization_created',
        metadata: { organizationName: 'Acme Corporation' },
        createdAt: new Date('2024-01-15')
      },
      {
        organizationId: acmeOrg.id,
        userId: johnUser.id,
        action: 'subscription_created',
        metadata: { planName: 'Pro' },
        createdAt: new Date('2024-01-16')
      },
      {
        organizationId: acmeOrg.id,
        userId: johnUser.id,
        action: 'member_invited',
        metadata: { email: 'emma@acmecorp.com', role: 'ADMIN' },
        createdAt: new Date('2024-02-01')
      },
      {
        organizationId: acmeOrg.id,
        userId: emmaUser.id,
        action: 'member_joined',
        metadata: { role: 'ADMIN' },
        createdAt: new Date('2024-02-01')
      },
      {
        organizationId: techSolutionsOrg.id,
        userId: sarahUser.id,
        action: 'organization_created',
        metadata: { organizationName: 'Tech Solutions Inc' },
        createdAt: new Date('2024-01-01')
      },
      {
        organizationId: techSolutionsOrg.id,
        userId: sarahUser.id,
        action: 'subscription_created',
        metadata: { planName: 'Business' },
        createdAt: new Date('2024-01-02')
      },
      {
        organizationId: startupOrg.id,
        userId: mikeUser.id,
        action: 'organization_created',
        metadata: { organizationName: 'StartupXYZ' },
        createdAt: new Date('2024-03-01')
      }
    ];

    for (const activity of activities) {
      await prisma.activity.create({
        data: activity
      });
    }

    console.log('✅ Created sample activities');

    // Create sample invitations
    console.log('📧 Creating sample invitations...');
    
    await prisma.organizationInvitation.upsert({
      where: {
        organizationId_email: {
          organizationId: acmeOrg.id,
          email: 'david@acmecorp.com'
        }
      },
      update: {},
      create: {
        organizationId: acmeOrg.id,
        email: 'david@acmecorp.com',
        role: OrganizationRole.MEMBER,
        token: 'invitation_token_david_acme',
        invitedBy: johnUser.id,
        status: 'PENDING',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      }
    });

    await prisma.organizationInvitation.upsert({
      where: {
        organizationId_email: {
          organizationId: techSolutionsOrg.id,
          email: 'lisa@techsolutions.io'
        }
      },
      update: {},
      create: {
        organizationId: techSolutionsOrg.id,
        email: 'lisa@techsolutions.io',
        role: OrganizationRole.ADMIN,
        token: 'invitation_token_lisa_tech',
        invitedBy: sarahUser.id,
        status: 'PENDING',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      }
    });

    console.log('✅ Created sample invitations');

    // Update user extended info
    console.log('👤 Creating user extended info...');
    
    for (const user of [johnUser, sarahUser, mikeUser, emmaUser, alexUser]) {
      await prisma.userExtended.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id,
          onboardingCompleted: true,
          lastLoginAt: new Date(),
          preferences: JSON.stringify({
            theme: 'light',
            notifications: {
              email: true,
              push: false
            },
            timezone: 'UTC'
          })
        }
      });
    }

    console.log('✅ Created user extended info');

    console.log('\n🎉 SaaS Multi-tenant seed completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   • 4 subscription plans created`);
    console.log(`   • 5 test users created`);
    console.log(`   • 3 organizations created`);
    console.log(`   • 5 organization memberships created`);
    console.log(`   • 2 active subscriptions created`);
    console.log(`   • Sample usage data created`);
    console.log(`   • 7 activities logged`);
    console.log(`   • 2 pending invitations created`);
    
    console.log('\n🔑 Test Login Credentials:');
    console.log('   john@acmecorp.com:saas123 (Acme Corp Owner)');
    console.log('   sarah@techsolutions.io:saas123 (Tech Solutions Owner)');
    console.log('   mike@startupxyz.com:saas123 (StartupXYZ Owner)');
    console.log('   emma@acmecorp.com:saas123 (Acme Corp Admin)');
    console.log('   alex@techsolutions.io:saas123 (Tech Solutions Member)');

  } catch (error) {
    console.error('❌ Error seeding SaaS data:', error);
    throw error;
  }
}

export default seedSaaS;

// Run the seed if this file is executed directly
if (require.main === module) {
  seedSaaS()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}