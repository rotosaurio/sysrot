import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedVideos() {
  console.log('🎬 Starting Video Streaming seed...');

  try {
    // Create video content creators and users
    console.log('👤 Creating video creators and users...');
    
    const passwordHash = await bcrypt.hash('video123', 10);

    const users = [
      {
        email: 'techguru@creators.com',
        name: 'TechGuru Master',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      },
      {
        email: 'gamequeen@creators.com', 
        name: 'GameQueen Pro',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
      },
      {
        email: 'cookmaster@creators.com',
        name: 'CookMaster Chef',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      {
        email: 'fitnesscoach@creators.com',
        name: 'FitnessCoach Elite',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
      },
      {
        email: 'musicproducer@creators.com',
        name: 'MusicProducer Beats',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
      },
      {
        email: 'artcreator@creators.com',
        name: 'ArtCreator Studio',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face'
      },
      // Regular viewers
      {
        email: 'viewer1@watchers.com',
        name: 'Alex Viewer',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f13?w=150&h=150&fit=crop&crop=face'
      },
      {
        email: 'viewer2@watchers.com',
        name: 'Emma Watcher',
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

    console.log('✅ Created video users');

    // Create video channels
    console.log('📺 Creating video channels...');

    const channels = [
      {
        id: 'tech-tutorials',
        name: 'Tech Tutorials Pro',
        description: 'Learn programming, web development, and latest technology trends with in-depth tutorials and hands-on projects.',
        handle: 'techtutorials',
        avatar: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=150&h=150&fit=crop',
        banner: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=300&fit=crop',
        category: 'SCIENCE_TECH',
        isVerified: true,
        isMonetized: true,
        subscriberCount: 125000,
        videoCount: 0,
        totalViews: 2500000,
        totalWatchTime: 45000000,
        ownerId: createdUsers[0].id,
        socialLinks: JSON.stringify({
          youtube: 'https://youtube.com/techtutorials',
          twitter: 'https://twitter.com/techtutorials',
          website: 'https://techtutorials.dev'
        })
      },
      {
        id: 'gaming-central',
        name: 'Gaming Central Hub',
        description: 'Ultimate gaming content: reviews, gameplay, tips, and live streams of the latest games and esports tournaments.',
        handle: 'gamingcentral',
        avatar: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=150&h=150&fit=crop',
        banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=300&fit=crop',
        category: 'GAMING',
        isVerified: true,
        isMonetized: true,
        subscriberCount: 89000,
        videoCount: 0,
        totalViews: 1800000,
        totalWatchTime: 35000000,
        ownerId: createdUsers[1].id,
        socialLinks: JSON.stringify({
          twitch: 'https://twitch.tv/gamingcentral',
          discord: 'https://discord.gg/gamingcentral',
          instagram: 'https://instagram.com/gamingcentral'
        })
      },
      {
        id: 'chef-secrets',
        name: 'Chef Secrets Kitchen',
        description: 'Professional cooking techniques, recipe masterclasses, and culinary secrets from around the world.',
        handle: 'chefsecrets',
        avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&h=150&fit=crop',
        banner: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=300&fit=crop',
        category: 'COOKING',
        isVerified: false,
        isMonetized: false,
        subscriberCount: 45000,
        videoCount: 0,
        totalViews: 900000,
        totalWatchTime: 18000000,
        ownerId: createdUsers[2].id
      },
      {
        id: 'fitness-revolution',
        name: 'Fitness Revolution',
        description: 'Transform your body and mind with comprehensive workout routines, nutrition guides, and wellness tips.',
        handle: 'fitnessrevolution',
        avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop',
        banner: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=300&fit=crop',
        category: 'FITNESS',
        isVerified: true,
        isMonetized: true,
        subscriberCount: 67000,
        videoCount: 0,
        totalViews: 1350000,
        totalWatchTime: 25000000,
        ownerId: createdUsers[3].id,
        socialLinks: JSON.stringify({
          instagram: 'https://instagram.com/fitnessrevolution',
          website: 'https://fitnessrevolution.fit'
        })
      },
      {
        id: 'beats-studio',
        name: 'Beats Studio Official',
        description: 'Music production tutorials, beat making, mixing & mastering techniques, and exclusive electronic music releases.',
        handle: 'beatsstudio',
        avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop',
        banner: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&h=300&fit=crop',
        category: 'MUSIC',
        isVerified: false,
        isMonetized: true,
        subscriberCount: 34000,
        videoCount: 0,
        totalViews: 680000,
        totalWatchTime: 12000000,
        ownerId: createdUsers[4].id
      },
      {
        id: 'art-masterclass',
        name: 'Art Masterclass Studio',
        description: 'Digital art tutorials, traditional painting techniques, and creative inspiration for artists of all levels.',
        handle: 'artmasterclass',
        avatar: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=150&h=150&fit=crop',
        banner: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1200&h=300&fit=crop',
        category: 'GENERAL',
        isVerified: false,
        isMonetized: false,
        subscriberCount: 28000,
        videoCount: 0,
        totalViews: 560000,
        totalWatchTime: 9000000,
        ownerId: createdUsers[5].id
      }
    ];

    const createdChannels = [];
    for (const channelData of channels) {
      const channel = await prisma.videoChannel.upsert({
        where: { id: channelData.id },
        update: {},
        create: channelData
      });
      createdChannels.push(channel);

      // Create owner subscription
      await prisma.channelSubscription.upsert({
        where: {
          channelId_userId: {
            channelId: channel.id,
            userId: channel.ownerId
          }
        },
        update: {},
        create: {
          channelId: channel.id,
          userId: channel.ownerId,
          isNotificationsEnabled: true
        }
      });
    }

    console.log('✅ Created video channels');

    // Create cross-subscriptions between users
    console.log('🔔 Creating channel subscriptions...');
    
    const subscriptions = [
      // Regular viewers subscribe to channels
      { channelId: createdChannels[0].id, userId: createdUsers[6].id },
      { channelId: createdChannels[0].id, userId: createdUsers[7].id },
      { channelId: createdChannels[1].id, userId: createdUsers[6].id },
      { channelId: createdChannels[1].id, userId: createdUsers[7].id },
      { channelId: createdChannels[2].id, userId: createdUsers[6].id },
      { channelId: createdChannels[3].id, userId: createdUsers[7].id },
      
      // Content creators subscribe to each other
      { channelId: createdChannels[0].id, userId: createdUsers[1].id },
      { channelId: createdChannels[1].id, userId: createdUsers[0].id },
      { channelId: createdChannels[2].id, userId: createdUsers[3].id },
      { channelId: createdChannels[3].id, userId: createdUsers[2].id }
    ];

    for (const subData of subscriptions) {
      await prisma.channelSubscription.upsert({
        where: {
          channelId_userId: {
            channelId: subData.channelId,
            userId: subData.userId
          }
        },
        update: {},
        create: {
          ...subData,
          isNotificationsEnabled: true
        }
      });
    }

    console.log('✅ Created channel subscriptions');

    // Create videos
    console.log('🎥 Creating videos...');

    const videos = [
      // Tech Channel Videos
      {
        id: 'next-js-tutorial',
        title: 'Complete Next.js 14 Tutorial - Build a Full-Stack App',
        description: 'Learn Next.js 14 from scratch! In this comprehensive tutorial, we\'ll build a complete full-stack application with App Router, Server Components, and TypeScript. Perfect for beginners and intermediate developers.',
        slug: 'complete-nextjs-14-tutorial',
        thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1280&h=720&fit=crop',
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        duration: 3420, // 57 minutes
        fileSize: 245760000, // ~245MB
        resolution: '1920x1080',
        fps: 30,
        bitrate: 2500,
        category: 'TUTORIAL',
        tags: ['nextjs', 'react', 'typescript', 'fullstack', 'tutorial'],
        language: 'en',
        visibility: 'PUBLIC',
        status: 'READY',
        channelId: createdChannels[0].id,
        uploadedById: createdUsers[0].id,
        viewCount: 45600,
        likeCount: 2340,
        dislikeCount: 89,
        commentCount: 567,
        shareCount: 234,
        uploadedAt: new Date('2024-01-15T10:00:00Z'),
        publishedAt: new Date('2024-01-15T12:00:00Z'),
        customThumbnails: [
          'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1280&h=720&fit=crop',
          'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1280&h=720&fit=crop'
        ]
      },
      {
        id: 'react-hooks-guide',
        title: 'React Hooks Complete Guide - useState, useEffect, Custom Hooks',
        description: 'Master React Hooks with this in-depth guide covering all built-in hooks and how to create custom hooks for your applications.',
        slug: 'react-hooks-complete-guide',
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1280&h=720&fit=crop',
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
        duration: 2160, // 36 minutes
        fileSize: 156800000,
        resolution: '1920x1080',
        fps: 30,
        bitrate: 2200,
        category: 'TUTORIAL',
        tags: ['react', 'hooks', 'javascript', 'frontend'],
        visibility: 'PUBLIC',
        status: 'READY',
        channelId: createdChannels[0].id,
        uploadedById: createdUsers[0].id,
        viewCount: 32400,
        likeCount: 1890,
        dislikeCount: 45,
        commentCount: 324,
        shareCount: 167,
        uploadedAt: new Date('2024-01-20T09:00:00Z'),
        publishedAt: new Date('2024-01-20T11:00:00Z')
      },

      // Gaming Channel Videos
      {
        id: 'valorant-pro-tips',
        title: 'VALORANT Pro Tips & Tricks - Rank Up Fast to Immortal!',
        description: 'Learn the secret strategies and advanced techniques that pro players use to dominate in VALORANT. Improve your aim, game sense, and ranking!',
        slug: 'valorant-pro-tips-rank-up',
        thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1280&h=720&fit=crop',
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        duration: 1680, // 28 minutes
        fileSize: 201600000,
        resolution: '1920x1080',
        fps: 60,
        bitrate: 3000,
        category: 'GAMING',
        tags: ['valorant', 'fps', 'tips', 'gaming', 'esports'],
        visibility: 'PUBLIC',
        status: 'READY',
        channelId: createdChannels[1].id,
        uploadedById: createdUsers[1].id,
        viewCount: 78900,
        likeCount: 4560,
        dislikeCount: 123,
        commentCount: 892,
        shareCount: 445,
        uploadedAt: new Date('2024-01-18T15:00:00Z'),
        publishedAt: new Date('2024-01-18T16:00:00Z')
      },
      {
        id: 'genshin-impact-guide',
        title: 'Genshin Impact F2P Guide - Best Characters & Team Builds 2024',
        description: 'Complete free-to-play guide for Genshin Impact! Learn which characters to build, best team compositions, and resource management strategies.',
        slug: 'genshin-impact-f2p-guide-2024',
        thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1280&h=720&fit=crop',
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
        duration: 2520, // 42 minutes
        fileSize: 181440000,
        resolution: '1920x1080',
        fps: 30,
        bitrate: 2400,
        category: 'GAMING',
        tags: ['genshin', 'rpg', 'guide', 'f2p', 'characters'],
        visibility: 'PUBLIC',
        status: 'READY',
        channelId: createdChannels[1].id,
        uploadedById: createdUsers[1].id,
        viewCount: 56700,
        likeCount: 3240,
        dislikeCount: 78,
        commentCount: 634,
        shareCount: 289,
        uploadedAt: new Date('2024-01-22T13:00:00Z'),
        publishedAt: new Date('2024-01-22T14:00:00Z')
      },

      // Cooking Channel Videos
      {
        id: 'perfect-pasta-carbonara',
        title: 'Perfect Pasta Carbonara - Authentic Italian Recipe',
        description: 'Learn to make the perfect Pasta Carbonara the traditional Italian way! No cream, just eggs, cheese, pancetta, and technique.',
        slug: 'perfect-pasta-carbonara-authentic',
        thumbnail: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=1280&h=720&fit=crop',
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        duration: 900, // 15 minutes
        fileSize: 108000000,
        resolution: '1920x1080',
        fps: 30,
        bitrate: 2000,
        category: 'COOKING',
        tags: ['pasta', 'italian', 'carbonara', 'recipe', 'cooking'],
        visibility: 'PUBLIC',
        status: 'READY',
        channelId: createdChannels[2].id,
        uploadedById: createdUsers[2].id,
        viewCount: 23400,
        likeCount: 1456,
        dislikeCount: 23,
        commentCount: 234,
        shareCount: 178,
        uploadedAt: new Date('2024-01-19T11:00:00Z'),
        publishedAt: new Date('2024-01-19T12:00:00Z')
      },

      // Fitness Channel Videos
      {
        id: 'full-body-workout',
        title: '30-Minute Full Body HIIT Workout - No Equipment Needed',
        description: 'Intense 30-minute full body HIIT workout you can do anywhere! Perfect for burning calories and building strength at home.',
        slug: '30-minute-full-body-hiit-workout',
        thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1280&h=720&fit=crop',
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        duration: 1800, // 30 minutes
        fileSize: 144000000,
        resolution: '1920x1080',
        fps: 30,
        bitrate: 2000,
        category: 'FITNESS',
        tags: ['hiit', 'workout', 'fitness', 'home', 'bodyweight'],
        visibility: 'PUBLIC',
        status: 'READY',
        channelId: createdChannels[3].id,
        uploadedById: createdUsers[3].id,
        viewCount: 34560,
        likeCount: 2234,
        dislikeCount: 45,
        commentCount: 445,
        shareCount: 267,
        uploadedAt: new Date('2024-01-21T07:00:00Z'),
        publishedAt: new Date('2024-01-21T08:00:00Z')
      },

      // Music Channel Videos
      {
        id: 'fl-studio-beat-making',
        title: 'FL Studio Beat Making Tutorial - Trap Beats from Scratch',
        description: 'Complete FL Studio tutorial showing how to make trap beats from scratch. Includes drums, melody, bass, and mixing techniques.',
        slug: 'fl-studio-trap-beats-tutorial',
        thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1280&h=720&fit=crop',
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
        duration: 2700, // 45 minutes
        fileSize: 194400000,
        resolution: '1920x1080',
        fps: 30,
        bitrate: 2400,
        category: 'MUSIC',
        tags: ['flstudio', 'beats', 'trap', 'production', 'tutorial'],
        visibility: 'PUBLIC',
        status: 'READY',
        channelId: createdChannels[4].id,
        uploadedById: createdUsers[4].id,
        viewCount: 18900,
        likeCount: 987,
        dislikeCount: 34,
        commentCount: 178,
        shareCount: 89,
        uploadedAt: new Date('2024-01-17T14:00:00Z'),
        publishedAt: new Date('2024-01-17T15:00:00Z')
      },

      // Art Channel Videos
      {
        id: 'digital-portrait-painting',
        title: 'Digital Portrait Painting in Photoshop - Step by Step',
        description: 'Learn professional digital portrait painting techniques in Photoshop. From sketch to final rendering with color theory and lighting.',
        slug: 'digital-portrait-painting-photoshop',
        thumbnail: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1280&h=720&fit=crop',
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        duration: 3600, // 60 minutes
        fileSize: 259200000,
        resolution: '1920x1080',
        fps: 30,
        bitrate: 2000,
        category: 'GENERAL',
        tags: ['digital art', 'photoshop', 'portrait', 'painting', 'tutorial'],
        visibility: 'PUBLIC',
        status: 'READY',
        channelId: createdChannels[5].id,
        uploadedById: createdUsers[5].id,
        viewCount: 15600,
        likeCount: 892,
        dislikeCount: 18,
        commentCount: 156,
        shareCount: 78,
        uploadedAt: new Date('2024-01-16T16:00:00Z'),
        publishedAt: new Date('2024-01-16T17:00:00Z')
      }
    ];

    const createdVideos = [];
    for (const videoData of videos) {
      const video = await prisma.video.upsert({
        where: { id: videoData.id },
        update: {},
        create: videoData
      });
      createdVideos.push(video);

      // Update channel video count
      await prisma.videoChannel.update({
        where: { id: video.channelId },
        data: {
          videoCount: {
            increment: 1
          }
        }
      });
    }

    console.log('✅ Created videos');

    // Create video qualities for transcoding
    console.log('🎞️ Creating video qualities...');

    const qualities = ['360p', '480p', '720p', '1080p'];
    for (const video of createdVideos) {
      for (const quality of qualities) {
        await prisma.videoQuality.create({
          data: {
            videoId: video.id,
            quality,
            resolution: quality === '360p' ? '640x360' : 
                       quality === '480p' ? '854x480' :
                       quality === '720p' ? '1280x720' : '1920x1080',
            videoUrl: `${video.videoUrl}?quality=${quality}`,
            fileSize: Math.floor(video.fileSize * (
              quality === '360p' ? 0.3 : 
              quality === '480p' ? 0.5 :
              quality === '720p' ? 0.7 : 1.0
            )),
            bitrate: Math.floor(video.bitrate * (
              quality === '360p' ? 0.4 : 
              quality === '480p' ? 0.6 :
              quality === '720p' ? 0.8 : 1.0
            )),
            processingStatus: 'completed'
          }
        });
      }
    }

    console.log('✅ Created video qualities');

    // Create video comments
    console.log('💬 Creating video comments...');

    const comments = [
      // Tech tutorial comments
      {
        videoId: createdVideos[0].id,
        authorId: createdUsers[6].id,
        content: 'Amazing tutorial! Finally understand App Router properly. Thank you for the clear explanations!',
        likeCount: 234,
        createdAt: new Date('2024-01-15T14:30:00Z')
      },
      {
        videoId: createdVideos[0].id,
        authorId: createdUsers[7].id,
        content: 'This helped me so much with my project. The TypeScript integration part was exactly what I needed.',
        likeCount: 156,
        createdAt: new Date('2024-01-15T16:45:00Z')
      },
      {
        videoId: createdVideos[0].id,
        authorId: createdUsers[1].id,
        content: 'Great work! Love how you explain complex concepts in simple terms. Subscribed!',
        likeCount: 89,
        createdAt: new Date('2024-01-16T09:20:00Z')
      },

      // Gaming comments
      {
        videoId: createdVideos[2].id,
        authorId: createdUsers[6].id,
        content: 'These tips actually work! Went from Gold to Platinum using your crosshair placement advice.',
        likeCount: 445,
        createdAt: new Date('2024-01-18T18:30:00Z')
      },
      {
        videoId: createdVideos[2].id,
        authorId: createdUsers[7].id,
        content: 'The util usage guide is insane! Never thought about smoke placements like this.',
        likeCount: 312,
        createdAt: new Date('2024-01-19T10:15:00Z')
      },

      // Cooking comments
      {
        videoId: createdVideos[4].id,
        authorId: createdUsers[6].id,
        content: 'Made this for dinner tonight - absolutely perfect! My Italian grandmother would be proud 😊',
        likeCount: 123,
        createdAt: new Date('2024-01-19T20:00:00Z')
      },
      {
        videoId: createdVideos[4].id,
        authorId: createdUsers[0].id,
        content: 'The technique for tempering the eggs is genius. Never had scrambled carbonara again!',
        likeCount: 89,
        createdAt: new Date('2024-01-20T12:30:00Z')
      }
    ];

    for (const commentData of comments) {
      await prisma.videoComment.create({
        data: commentData
      });
    }

    console.log('✅ Created video comments');

    // Create video likes
    console.log('👍 Creating video likes...');

    const likes = [
      { videoId: createdVideos[0].id, userId: createdUsers[6].id, isLike: true },
      { videoId: createdVideos[0].id, userId: createdUsers[7].id, isLike: true },
      { videoId: createdVideos[0].id, userId: createdUsers[1].id, isLike: true },
      { videoId: createdVideos[1].id, userId: createdUsers[6].id, isLike: true },
      { videoId: createdVideos[2].id, userId: createdUsers[6].id, isLike: true },
      { videoId: createdVideos[2].id, userId: createdUsers[7].id, isLike: true },
      { videoId: createdVideos[3].id, userId: createdUsers[6].id, isLike: true },
      { videoId: createdVideos[4].id, userId: createdUsers[6].id, isLike: true },
      { videoId: createdVideos[4].id, userId: createdUsers[0].id, isLike: true },
      { videoId: createdVideos[5].id, userId: createdUsers[7].id, isLike: true }
    ];

    for (const likeData of likes) {
      await prisma.videoLike.create({
        data: likeData
      });
    }

    console.log('✅ Created video likes');

    // Create watch history
    console.log('👁️ Creating watch history...');

    const watchHistories = [
      {
        userId: createdUsers[6].id,
        videoId: createdVideos[0].id,
        watchDuration: 3200, // Almost completed
        lastPosition: 3200,
        isCompleted: true,
        deviceType: 'desktop',
        quality: '1080p'
      },
      {
        userId: createdUsers[7].id,
        videoId: createdVideos[0].id,
        watchDuration: 1800, // Halfway through
        lastPosition: 1800,
        isCompleted: false,
        deviceType: 'mobile',
        quality: '720p'
      },
      {
        userId: createdUsers[6].id,
        videoId: createdVideos[2].id,
        watchDuration: 1680, // Completed
        lastPosition: 1680,
        isCompleted: true,
        deviceType: 'mobile',
        quality: '720p'
      },
      {
        userId: createdUsers[7].id,
        videoId: createdVideos[4].id,
        watchDuration: 900, // Completed
        lastPosition: 900,
        isCompleted: true,
        deviceType: 'desktop',
        quality: '1080p'
      }
    ];

    for (const watchData of watchHistories) {
      await prisma.watchHistory.create({
        data: watchData
      });
    }

    console.log('✅ Created watch history');

    // Create playlists
    console.log('📋 Creating playlists...');

    const playlists = [
      {
        id: 'web-dev-mastery',
        title: 'Web Development Mastery Course',
        description: 'Complete web development course from beginner to advanced. Learn HTML, CSS, JavaScript, React, and Next.js.',
        thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop',
        visibility: 'PUBLIC',
        isCollaborative: false,
        videoCount: 2,
        totalDuration: 5580, // Sum of video durations
        viewCount: 234,
        channelId: createdChannels[0].id,
        createdById: createdUsers[0].id
      },
      {
        id: 'gaming-guides',
        title: 'Ultimate Gaming Guides',
        description: 'Best gaming guides and tips for popular games. Improve your skills and rank up faster.',
        thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
        visibility: 'PUBLIC',
        isCollaborative: false,
        videoCount: 2,
        totalDuration: 4200,
        viewCount: 189,
        channelId: createdChannels[1].id,
        createdById: createdUsers[1].id
      },
      {
        id: 'quick-recipes',
        title: 'Quick & Easy Recipes',
        description: 'Fast and delicious recipes for busy people. Perfect meals in 30 minutes or less.',
        thumbnail: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=300&fit=crop',
        visibility: 'PUBLIC',
        isCollaborative: true,
        videoCount: 1,
        totalDuration: 900,
        viewCount: 156,
        channelId: createdChannels[2].id,
        createdById: createdUsers[2].id
      }
    ];

    const createdPlaylists = [];
    for (const playlistData of playlists) {
      const playlist = await prisma.playlist.upsert({
        where: { id: playlistData.id },
        update: {},
        create: playlistData
      });
      createdPlaylists.push(playlist);
    }

    // Add videos to playlists
    const playlistItems = [
      { playlistId: createdPlaylists[0].id, videoId: createdVideos[0].id, position: 1, addedById: createdUsers[0].id },
      { playlistId: createdPlaylists[0].id, videoId: createdVideos[1].id, position: 2, addedById: createdUsers[0].id },
      { playlistId: createdPlaylists[1].id, videoId: createdVideos[2].id, position: 1, addedById: createdUsers[1].id },
      { playlistId: createdPlaylists[1].id, videoId: createdVideos[3].id, position: 2, addedById: createdUsers[1].id },
      { playlistId: createdPlaylists[2].id, videoId: createdVideos[4].id, position: 1, addedById: createdUsers[2].id }
    ];

    for (const itemData of playlistItems) {
      await prisma.playlistItem.create({
        data: itemData
      });
    }

    console.log('✅ Created playlists');

    // Create analytics data
    console.log('📊 Creating analytics data...');

    const today = new Date();
    const dates = [];
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      dates.push(date);
    }

    // Create video analytics
    for (const video of createdVideos) {
      for (const [index, date] of dates.entries()) {
        const dayMultiplier = Math.max(0.1, 1 - (index / dates.length));
        const baseViews = Math.floor(video.viewCount / 30 * dayMultiplier);
        
        await prisma.videoAnalytics.create({
          data: {
            videoId: video.id,
            date,
            views: Math.floor(baseViews + (Math.random() * baseViews * 0.5)),
            uniqueViews: Math.floor(baseViews * 0.8),
            watchTime: Math.floor(baseViews * video.duration * 0.6),
            averageViewDuration: video.duration * (0.4 + Math.random() * 0.4),
            likes: Math.floor(video.likeCount / 30 * dayMultiplier),
            dislikes: Math.floor(video.dislikeCount / 30 * dayMultiplier),
            comments: Math.floor(video.commentCount / 30 * dayMultiplier),
            shares: Math.floor(video.shareCount / 30 * dayMultiplier),
            subscribersGained: Math.floor(Math.random() * 5)
          }
        });
      }
    }

    // Create channel analytics
    for (const channel of createdChannels) {
      for (const [index, date] of dates.entries()) {
        const dayMultiplier = Math.max(0.1, 1 - (index / dates.length));
        
        await prisma.channelAnalytics.create({
          data: {
            channelId: channel.id,
            date,
            subscriberCount: Math.floor(channel.subscriberCount * (0.9 + (index / dates.length) * 0.1)),
            totalViews: Math.floor(channel.totalViews / 30 * dayMultiplier),
            totalWatchTime: Math.floor(channel.totalWatchTime / 30 * dayMultiplier),
            videoPublished: index === dates.length - 1 ? 1 : 0, // Latest video published today
            revenue: channel.isMonetized ? Math.random() * 100 : 0,
            rpm: channel.isMonetized ? 1.5 + Math.random() * 2 : 0,
            cpm: channel.isMonetized ? 2 + Math.random() * 3 : 0
          }
        });
      }
    }

    console.log('✅ Created analytics data');

    console.log('\n🎉 Video Streaming seed completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   • 8 users created (6 creators + 2 viewers)`);
    console.log(`   • 6 diverse video channels across different categories`);
    console.log(`   • 8 high-quality videos with realistic metadata`);
    console.log(`   • 32 video quality variants (360p-1080p transcoding)`);
    console.log(`   • 7 authentic video comments with engagement`);
    console.log(`   • 10 video likes and user interactions`);
    console.log(`   • 4 detailed watch history entries`);
    console.log(`   • 3 curated playlists with video collections`);
    console.log(`   • 5 playlist items organized by topic`);
    console.log(`   • 248+ analytics entries (31 days of data)`);
    console.log(`   • Cross-channel subscriptions and community`);
    
    console.log('\n🔑 Test Login Credentials:');
    console.log('   techguru@creators.com:video123 (Tech Channel - 125K subs)');
    console.log('   gamequeen@creators.com:video123 (Gaming Channel - 89K subs)');
    console.log('   cookmaster@creators.com:video123 (Cooking Channel - 45K subs)');
    console.log('   fitnesscoach@creators.com:video123 (Fitness Channel - 67K subs)');
    console.log('   musicproducer@creators.com:video123 (Music Channel - 34K subs)');
    console.log('   artcreator@creators.com:video123 (Art Channel - 28K subs)');
    console.log('   viewer1@watchers.com:video123 (Active Video Viewer)');
    console.log('   viewer2@watchers.com:video123 (Video Consumer)');

    console.log('\n📺 Featured Channels:');
    console.log('   🔧 Tech Tutorials Pro (@techtutorials) - Programming & Web Dev');
    console.log('   🎮 Gaming Central Hub (@gamingcentral) - Gaming & Esports');  
    console.log('   👨‍🍳 Chef Secrets Kitchen (@chefsecrets) - Cooking & Recipes');
    console.log('   💪 Fitness Revolution (@fitnessrevolution) - Workouts & Wellness');
    console.log('   🎵 Beats Studio Official (@beatsstudio) - Music Production');
    console.log('   🎨 Art Masterclass Studio (@artmasterclass) - Digital Art');

    console.log('\n🎬 Video Content Ready:');
    console.log('   ✅ Complete Next.js 14 Tutorial (57 min, 45.6K views)');
    console.log('   ✅ React Hooks Complete Guide (36 min, 32.4K views)');
    console.log('   ✅ VALORANT Pro Tips & Tricks (28 min, 78.9K views)');
    console.log('   ✅ Genshin Impact F2P Guide (42 min, 56.7K views)');
    console.log('   ✅ Perfect Pasta Carbonara (15 min, 23.4K views)');
    console.log('   ✅ 30-Minute Full Body HIIT (30 min, 34.5K views)');
    console.log('   ✅ FL Studio Beat Making (45 min, 18.9K views)');
    console.log('   ✅ Digital Portrait Painting (60 min, 15.6K views)');

    console.log('\n🛠️ Features Ready:');
    console.log('   ✅ Multi-channel video platform with subscriptions');
    console.log('   ✅ Video upload, processing, and quality transcoding');
    console.log('   ✅ Like/dislike system and threaded comments');
    console.log('   ✅ Watch history and progress tracking');
    console.log('   ✅ Playlist creation and management');
    console.log('   ✅ Comprehensive analytics and reporting');
    console.log('   ✅ Channel monetization and verification');
    console.log('   ✅ Search, filtering, and recommendation system');

  } catch (error) {
    console.error('❌ Error seeding video data:', error);
    throw error;
  }
}

export default seedVideos;

// Run the seed if this file is executed directly
if (require.main === module) {
  seedVideos()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}