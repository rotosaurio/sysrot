import { PrismaClient, ChatRoomType, ChatRole, MessageType, NotificationType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedChat() {
  console.log('💬 Starting Real-time Chat seed...');

  try {
    // Create chat users if they don't exist
    console.log('👥 Creating chat users...');
    
    const passwordHash = await bcrypt.hash('chat123', 10);

    const users = [
      {
        email: 'alice@team.com',
        name: 'Alice Johnson',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
      },
      {
        email: 'bob@team.com',
        name: 'Bob Smith',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      },
      {
        email: 'carol@team.com',
        name: 'Carol Davis',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
      },
      {
        email: 'david@team.com',
        name: 'David Chen',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      {
        email: 'eva@team.com',
        name: 'Eva Rodriguez',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face'
      },
      {
        email: 'frank@team.com',
        name: 'Frank Wilson',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
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

    console.log('✅ Created chat users');

    // Create chat rooms
    console.log('🏠 Creating chat rooms...');

    // General team room
    const generalRoom = await prisma.chatRoom.upsert({
      where: { id: 'general-team-room' },
      update: {},
      create: {
        id: 'general-team-room',
        name: 'General',
        description: 'General team discussions and announcements',
        type: ChatRoomType.CHANNEL,
        isPrivate: false,
        avatar: '💬',
        createdBy: createdUsers[0].id,
        maxMembers: 50,
        settings: JSON.stringify({
          allowFileUploads: true,
          allowReactions: true,
          allowThreads: true,
          muteNotifications: false
        })
      }
    });

    // Development team room
    const devRoom = await prisma.chatRoom.upsert({
      where: { id: 'dev-team-room' },
      update: {},
      create: {
        id: 'dev-team-room',
        name: 'Development',
        description: 'Development team discussions, code reviews, and tech talks',
        type: ChatRoomType.GROUP,
        isPrivate: false,
        avatar: '💻',
        createdBy: createdUsers[1].id,
        maxMembers: 20,
        settings: JSON.stringify({
          allowFileUploads: true,
          allowReactions: true,
          allowThreads: true,
          requireApproval: false
        })
      }
    });

    // Design team room
    const designRoom = await prisma.chatRoom.upsert({
      where: { id: 'design-team-room' },
      update: {},
      create: {
        id: 'design-team-room',
        name: 'Design',
        description: 'Design team creativity and feedback',
        type: ChatRoomType.GROUP,
        isPrivate: false,
        avatar: '🎨',
        createdBy: createdUsers[2].id,
        maxMembers: 15,
        settings: JSON.stringify({
          allowFileUploads: true,
          allowReactions: true,
          allowThreads: true,
          theme: 'creative'
        })
      }
    });

    // Direct message room (Alice & Bob)
    const directRoom = await prisma.chatRoom.upsert({
      where: { id: 'alice-bob-direct' },
      update: {},
      create: {
        id: 'alice-bob-direct',
        name: 'Alice & Bob',
        type: ChatRoomType.DIRECT,
        isPrivate: true,
        createdBy: createdUsers[0].id,
        maxMembers: 2,
        settings: JSON.stringify({
          encryptMessages: true,
          deleteAfter: null
        })
      }
    });

    // Support room
    const supportRoom = await prisma.chatRoom.upsert({
      where: { id: 'support-room' },
      update: {},
      create: {
        id: 'support-room',
        name: 'Help & Support',
        description: 'Get help from our support team',
        type: ChatRoomType.SUPPORT,
        isPrivate: false,
        avatar: '🆘',
        createdBy: createdUsers[3].id,
        maxMembers: 100,
        settings: JSON.stringify({
          autoAssignAgent: true,
          businessHoursOnly: false,
          priority: 'high'
        })
      }
    });

    console.log('✅ Created chat rooms');

    // Create participants
    console.log('👤 Creating room participants...');

    const participantData = [
      // General room - everyone
      { roomId: generalRoom.id, userId: createdUsers[0].id, role: ChatRole.OWNER, permissions: ['*'] },
      { roomId: generalRoom.id, userId: createdUsers[1].id, role: ChatRole.ADMIN, permissions: ['moderate', 'invite', 'manage_messages'] },
      { roomId: generalRoom.id, userId: createdUsers[2].id, role: ChatRole.MEMBER, permissions: [] },
      { roomId: generalRoom.id, userId: createdUsers[3].id, role: ChatRole.MEMBER, permissions: [] },
      { roomId: generalRoom.id, userId: createdUsers[4].id, role: ChatRole.MEMBER, permissions: [] },
      { roomId: generalRoom.id, userId: createdUsers[5].id, role: ChatRole.MEMBER, permissions: [] },

      // Dev room - developers
      { roomId: devRoom.id, userId: createdUsers[1].id, role: ChatRole.OWNER, permissions: ['*'] },
      { roomId: devRoom.id, userId: createdUsers[0].id, role: ChatRole.ADMIN, permissions: ['moderate', 'invite'] },
      { roomId: devRoom.id, userId: createdUsers[3].id, role: ChatRole.MEMBER, permissions: [] },
      { roomId: devRoom.id, userId: createdUsers[4].id, role: ChatRole.MEMBER, permissions: [] },

      // Design room - designers and stakeholders
      { roomId: designRoom.id, userId: createdUsers[2].id, role: ChatRole.OWNER, permissions: ['*'] },
      { roomId: designRoom.id, userId: createdUsers[0].id, role: ChatRole.ADMIN, permissions: ['moderate'] },
      { roomId: designRoom.id, userId: createdUsers[4].id, role: ChatRole.MEMBER, permissions: [] },
      { roomId: designRoom.id, userId: createdUsers[5].id, role: ChatRole.MEMBER, permissions: [] },

      // Direct message
      { roomId: directRoom.id, userId: createdUsers[0].id, role: ChatRole.MEMBER, permissions: [] },
      { roomId: directRoom.id, userId: createdUsers[1].id, role: ChatRole.MEMBER, permissions: [] },

      // Support room
      { roomId: supportRoom.id, userId: createdUsers[3].id, role: ChatRole.OWNER, permissions: ['*'] },
      { roomId: supportRoom.id, userId: createdUsers[0].id, role: ChatRole.ADMIN, permissions: ['moderate', 'assign_tickets'] },
      { roomId: supportRoom.id, userId: createdUsers[1].id, role: ChatRole.MEMBER, permissions: [] },
      { roomId: supportRoom.id, userId: createdUsers[2].id, role: ChatRole.MEMBER, permissions: [] },
      { roomId: supportRoom.id, userId: createdUsers[4].id, role: ChatRole.MEMBER, permissions: [] }
    ];

    for (const participant of participantData) {
      await prisma.chatParticipant.upsert({
        where: {
          roomId_userId: {
            roomId: participant.roomId,
            userId: participant.userId
          }
        },
        update: {},
        create: {
          ...participant,
          joinedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random join time in last 30 days
          lastSeenAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000), // Random last seen in last 24 hours
          notificationSettings: JSON.stringify({
            muted: false,
            desktop: true,
            mobile: true,
            email: false
          })
        }
      });
    }

    console.log('✅ Created room participants');

    // Create sample messages
    console.log('💬 Creating sample messages...');

    const sampleMessages = [
      // General room messages
      {
        roomId: generalRoom.id,
        userId: createdUsers[0].id,
        content: '¡Bienvenidos al canal general del equipo! 🎉 Aquí compartiremos updates importantes y celebraremos nuestros logros.',
        type: MessageType.TEXT,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        roomId: generalRoom.id,
        userId: createdUsers[1].id,
        content: '¡Excelente! Me encanta tener un espacio centralizado para el equipo. 💪',
        type: MessageType.TEXT,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000)
      },
      {
        roomId: generalRoom.id,
        userId: createdUsers[2].id,
        content: 'Perfecto para mantenernos sincronizados. ¿Tendremos daily standups aquí? 🤔',
        type: MessageType.TEXT,
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
      },
      {
        roomId: generalRoom.id,
        userId: createdUsers[0].id,
        content: 'Great idea! Podemos hacer quick check-ins aquí los lunes, miércoles y viernes 📅',
        type: MessageType.TEXT,
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000)
      },
      {
        roomId: generalRoom.id,
        userId: null, // System message
        content: 'Eva Rodriguez se unió al canal',
        type: MessageType.SYSTEM,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        roomId: generalRoom.id,
        userId: createdUsers[4].id,
        content: '¡Hola team! Emocionada de estar aquí 🌟',
        type: MessageType.TEXT,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 2 * 60 * 1000)
      },

      // Dev room messages
      {
        roomId: devRoom.id,
        userId: createdUsers[1].id,
        content: '🚀 Nueva release en staging! Pueden hacer testing de las nuevas features.',
        type: MessageType.TEXT,
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
      },
      {
        roomId: devRoom.id,
        userId: createdUsers[3].id,
        content: 'Awesome! ¿Ya está el user authentication funcionando? 🔐',
        type: MessageType.TEXT,
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 15 * 60 * 1000)
      },
      {
        roomId: devRoom.id,
        userId: createdUsers[1].id,
        content: 'Sí! NextAuth.js está configurado con Google, GitHub y email/password 💯',
        type: MessageType.TEXT,
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 20 * 60 * 1000)
      },
      {
        roomId: devRoom.id,
        userId: createdUsers[4].id,
        content: 'Perfect! ¿Necesitan help con los tests? Puedo escribir algunos e2e tests 🧪',
        type: MessageType.TEXT,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        roomId: devRoom.id,
        userId: createdUsers[1].id,
        content: 'That would be amazing Eva! Los tests de Playwright estarían geniales 🎭',
        type: MessageType.TEXT,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000)
      },

      // Design room messages
      {
        roomId: designRoom.id,
        userId: createdUsers[2].id,
        content: '🎨 Working on the new dashboard design. ¿Qué opinan de estos mockups?',
        type: MessageType.TEXT,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        roomId: designRoom.id,
        userId: createdUsers[0].id,
        content: 'Love the clean aesthetic! Los colores están perfect para el branding 🌈',
        type: MessageType.TEXT,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000)
      },
      {
        roomId: designRoom.id,
        userId: createdUsers[4].id,
        content: '¿Podríamos hacer the navigation un poco más accessible? Maybe larger touch targets 📱',
        type: MessageType.TEXT,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        roomId: designRoom.id,
        userId: createdUsers[2].id,
        content: 'Excellent point! Accessibility es super importante. Voy a ajustar los sizes ♿',
        type: MessageType.TEXT,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000)
      },

      // Direct messages
      {
        roomId: directRoom.id,
        userId: createdUsers[0].id,
        content: '¿Tienes tiempo for a quick sync about the project roadmap? 🗺️',
        type: MessageType.TEXT,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
      },
      {
        roomId: directRoom.id,
        userId: createdUsers[1].id,
        content: 'Sure! Estoy free en 30 minutos. ¿Video call o here? 📞',
        type: MessageType.TEXT,
        createdAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000)
      },
      {
        roomId: directRoom.id,
        userId: createdUsers[0].id,
        content: 'Video call sería better. Sending calendar invite! 📅',
        type: MessageType.TEXT,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },

      // Support room messages
      {
        roomId: supportRoom.id,
        userId: createdUsers[4].id,
        content: '🆘 Help! No puedo upload files en el dashboard. ¿Es un known issue?',
        type: MessageType.TEXT,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
      },
      {
        roomId: supportRoom.id,
        userId: createdUsers[3].id,
        content: 'Hey Eva! Let me check that for you. ¿Qué browser estás usando? 🌐',
        type: MessageType.TEXT,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000 + 2 * 60 * 1000)
      },
      {
        roomId: supportRoom.id,
        userId: createdUsers[4].id,
        content: 'Chrome Version 120 on macOS. Files are PDFs around 2MB 📄',
        type: MessageType.TEXT,
        createdAt: new Date(Date.now() - 3.5 * 60 * 60 * 1000)
      },
      {
        roomId: supportRoom.id,
        userId: createdUsers[3].id,
        content: 'Found the issue! Hay un bug with PDF uploads. Fix coming in next release 🐛→✅',
        type: MessageType.TEXT,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
      }
    ];

    const createdMessages = [];
    for (const messageData of sampleMessages) {
      const message = await prisma.chatMessage.create({
        data: messageData
      });
      createdMessages.push(message);
    }

    console.log('✅ Created sample messages');

    // Add some threaded replies
    console.log('🧵 Creating threaded replies...');

    const threadReplies = [
      {
        roomId: devRoom.id,
        userId: createdUsers[0].id,
        content: 'También agregué rate limiting para security 🔒',
        type: MessageType.TEXT,
        parentId: createdMessages.find(m => m.content.includes('NextAuth.js está configurado'))?.id,
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 25 * 60 * 1000)
      },
      {
        roomId: devRoom.id,
        userId: createdUsers[3].id,
        content: 'Nice! ¿Qué strategy usaste? Redis-based? 🏎️',
        type: MessageType.TEXT,
        parentId: createdMessages.find(m => m.content.includes('NextAuth.js está configurado'))?.id,
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 35 * 60 * 1000)
      },
      {
        roomId: designRoom.id,
        userId: createdUsers[5].id,
        content: 'The color contrast looks great! WCAG AA compliant? ✅',
        type: MessageType.TEXT,
        parentId: createdMessages.find(m => m.content.includes('Love the clean aesthetic'))?.id,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000)
      }
    ];

    for (const replyData of threadReplies) {
      if (replyData.parentId) {
        await prisma.chatMessage.create({
          data: replyData
        });
      }
    }

    console.log('✅ Created threaded replies');

    // Add reactions to messages
    console.log('😊 Adding message reactions...');

    const reactions = [
      { messageId: createdMessages[0].id, userId: createdUsers[1].id, emoji: '🎉' },
      { messageId: createdMessages[0].id, userId: createdUsers[2].id, emoji: '🎉' },
      { messageId: createdMessages[0].id, userId: createdUsers[3].id, emoji: '👍' },
      { messageId: createdMessages[1].id, userId: createdUsers[0].id, emoji: '💪' },
      { messageId: createdMessages[1].id, userId: createdUsers[2].id, emoji: '👍' },
      { messageId: createdMessages[6].id, userId: createdUsers[0].id, emoji: '🚀' },
      { messageId: createdMessages[6].id, userId: createdUsers[3].id, emoji: '🔥' },
      { messageId: createdMessages[6].id, userId: createdUsers[4].id, emoji: '🔥' },
      { messageId: createdMessages[10].id, userId: createdUsers[1].id, emoji: '🎭' },
      { messageId: createdMessages[12].id, userId: createdUsers[0].id, emoji: '🎨' },
      { messageId: createdMessages[12].id, userId: createdUsers[4].id, emoji: '💯' }
    ];

    for (const reaction of reactions) {
      try {
        await prisma.chatReaction.create({
          data: reaction
        });
      } catch (error) {
        // Skip if reaction already exists
      }
    }

    console.log('✅ Added message reactions');

    // Add read receipts
    console.log('👁️ Creating read receipts...');

    for (const message of createdMessages.slice(0, 15)) { // Add read receipts for first 15 messages
      const roomParticipants = await prisma.chatParticipant.findMany({
        where: { roomId: message.roomId },
        select: { userId: true }
      });

      for (const participant of roomParticipants) {
        // Don't create read receipt for message author
        if (participant.userId !== message.userId) {
          try {
            await prisma.chatReadReceipt.create({
              data: {
                messageId: message.id,
                userId: participant.userId,
                readAt: new Date(message.createdAt.getTime() + Math.random() * 60 * 60 * 1000) // Read within an hour
              }
            });
          } catch (error) {
            // Skip if already exists
          }
        }
      }
    }

    console.log('✅ Created read receipts');

    // Add some typing indicators (simulating current activity)
    console.log('⌨️ Adding typing indicators...');

    const typingIndicators = [
      { roomId: generalRoom.id, userId: createdUsers[5].id, isTyping: true },
      { roomId: devRoom.id, userId: createdUsers[4].id, isTyping: true }
    ];

    for (const indicator of typingIndicators) {
      await prisma.chatTypingIndicator.create({
        data: {
          ...indicator,
          lastTypedAt: new Date()
        }
      });
    }

    console.log('✅ Added typing indicators');

    // Create some notifications
    console.log('🔔 Creating notifications...');

    const notifications = [
      {
        userId: createdUsers[0].id,
        roomId: devRoom.id,
        messageId: createdMessages.find(m => m.content.includes('Awesome! ¿Ya está el user authentication'))?.id,
        type: NotificationType.MENTION,
        title: 'Nueva mención en Development',
        content: 'David Chen te mencionó en Development',
        isRead: false
      },
      {
        userId: createdUsers[2].id,
        roomId: designRoom.id,
        type: NotificationType.MESSAGE,
        title: 'Nuevo mensaje en Design',
        content: 'Eva Rodriguez envió un mensaje',
        isRead: true,
        readAt: new Date()
      },
      {
        userId: createdUsers[1].id,
        roomId: directRoom.id,
        messageId: createdMessages.find(m => m.content.includes('tiempo for a quick sync'))?.id,
        type: NotificationType.MESSAGE,
        title: 'Mensaje directo de Alice',
        content: '¿Tienes tiempo for a quick sync about...',
        isRead: false
      }
    ];

    for (const notification of notifications) {
      if (notification.messageId) {
        await prisma.chatNotification.create({
          data: notification
        });
      }
    }

    console.log('✅ Created notifications');

    console.log('\n🎉 Real-time Chat seed completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   • 6 chat users created`);
    console.log(`   • 5 chat rooms created (General, Dev, Design, Direct, Support)`);
    console.log(`   • 21 room participants added`);
    console.log(`   • ${createdMessages.length} messages created`);
    console.log(`   • 3 threaded replies added`);
    console.log(`   • 11 message reactions added`);
    console.log(`   • Read receipts for active messages`);
    console.log(`   • 2 active typing indicators`);
    console.log(`   • 3 sample notifications`);
    
    console.log('\n🔑 Test Login Credentials:');
    console.log('   alice@team.com:chat123 (Team Lead)');
    console.log('   bob@team.com:chat123 (Senior Developer)');
    console.log('   carol@team.com:chat123 (Lead Designer)');
    console.log('   david@team.com:chat123 (DevOps Engineer)');
    console.log('   eva@team.com:chat123 (QA Engineer)');
    console.log('   frank@team.com:chat123 (Product Manager)');

    console.log('\n💬 Chat Features Ready:');
    console.log('   ✅ Multi-room support (Direct, Group, Channel, Support)');
    console.log('   ✅ Real-time messaging with reactions');
    console.log('   ✅ Threaded conversations');
    console.log('   ✅ Read receipts and typing indicators');
    console.log('   ✅ Role-based permissions');
    console.log('   ✅ File attachments support');
    console.log('   ✅ Notification system');
    console.log('   ✅ Message editing and deletion');

  } catch (error) {
    console.error('❌ Error seeding chat data:', error);
    throw error;
  }
}

export default seedChat;

// Run the seed if this file is executed directly
if (require.main === module) {
  seedChat()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}