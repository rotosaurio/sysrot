import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
const doctorRegistrationSchema = z.object({
  licenseNumber: z.string().min(5, 'License number required'),
  specialization: z.enum([
    'GENERAL_PRACTICE', 'INTERNAL_MEDICINE', 'PEDIATRICS', 'CARDIOLOGY', 
    'DERMATOLOGY', 'ENDOCRINOLOGY', 'GASTROENTEROLOGY', 'HEMATOLOGY',
    'INFECTIOUS_DISEASE', 'NEPHROLOGY', 'NEUROLOGY', 'ONCOLOGY',
    'OPHTHALMOLOGY', 'ORTHOPEDICS', 'OTOLARYNGOLOGY', 'PSYCHIATRY',
    'PULMONOLOGY', 'RADIOLOGY', 'RHEUMATOLOGY', 'UROLOGY',
    'OBSTETRICS_GYNECOLOGY', 'ANESTHESIOLOGY', 'EMERGENCY_MEDICINE',
    'FAMILY_MEDICINE', 'PATHOLOGY', 'PHYSICAL_MEDICINE', 'PLASTIC_SURGERY',
    'PREVENTIVE_MEDICINE', 'SURGERY'
  ]).default('GENERAL_PRACTICE'),
  subSpecialties: z.array(z.string()).optional(),
  yearsExperience: z.number().min(0).max(50),
  clinicName: z.string().optional(),
  clinicAddress: z.string().optional(),
  phoneNumber: z.string().optional(),
  emergencyContact: z.string().optional(),
  consultationFee: z.number().min(0).default(100),
  currency: z.string().default('USD'),
  acceptsInsurance: z.boolean().default(true),
  telemedicineEnabled: z.boolean().default(true)
});

const scheduleSchema = z.object({
  schedule: z.array(z.object({
    dayOfWeek: z.number().min(0).max(6),
    startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    slotDuration: z.number().min(15).max(120).default(30),
    breakStartTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
    breakEndTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
    isActive: z.boolean().default(true)
  }))
});

const availabilitySchema = z.object({
  date: z.string().date(),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  type: z.enum(['REGULAR', 'EXTENDED', 'EMERGENCY', 'BLOCKED']).default('REGULAR'),
  isOverride: z.boolean().default(false),
  reason: z.string().optional()
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
        if (action === 'availability') {
          return await getDoctorAvailability(req, res);
        }
        return await getDoctors(req, res);

      case 'POST':
        if (action === 'register') {
          return await registerDoctor(req, res);
        } else if (action === 'schedule') {
          return await updateSchedule(req, res);
        } else if (action === 'availability') {
          return await setAvailability(req, res);
        }
        return res.status(400).json({ error: 'Invalid action' });

      case 'PUT':
        return await updateDoctorProfile(req, res);

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT']);
        return res.status(405).end('Method Not Allowed');
    }
  } catch (error) {
    console.error('Doctors API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}

async function getDoctors(req: NextApiRequest, res: NextApiResponse) {
  const { 
    specialization,
    search,
    sortBy = 'averageRating',
    sortOrder = 'desc',
    limit = '20',
    page = '1',
    availableDate,
    doctorId,
    verified = 'true'
  } = req.query;

  try {
    // Get single doctor with detailed information
    if (doctorId && typeof doctorId === 'string') {
      const doctor = await prisma.doctor.findUnique({
        where: { id: doctorId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          },
          schedule: {
            where: { isActive: true },
            orderBy: { dayOfWeek: 'asc' }
          },
          _count: {
            select: {
              appointments: {
                where: {
                  status: { in: ['COMPLETED'] }
                }
              }
            }
          }
        }
      });

      if (!doctor) {
        return res.status(404).json({ error: 'Doctor not found' });
      }

      return res.status(200).json({ doctor });
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    // Build where clause
    const whereClause: any = {
      isActive: true
    };

    if (verified === 'true') {
      whereClause.isVerified = true;
    }

    if (specialization && typeof specialization === 'string') {
      whereClause.specialization = specialization.toUpperCase();
    }

    if (search && typeof search === 'string') {
      whereClause.OR = [
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { clinicName: { contains: search, mode: 'insensitive' } },
        { specialization: { contains: search, mode: 'insensitive' } }
      ];
    }

    // If availableDate is provided, filter doctors with availability
    if (availableDate && typeof availableDate === 'string') {
      const requestedDate = new Date(availableDate);
      const dayOfWeek = requestedDate.getDay();

      whereClause.schedule = {
        some: {
          dayOfWeek,
          isActive: true
        }
      };
    }

    const doctors = await prisma.doctor.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        schedule: {
          where: { isActive: true },
          orderBy: { dayOfWeek: 'asc' }
        },
        _count: {
          select: {
            appointments: {
              where: {
                status: { in: ['COMPLETED'] }
              }
            }
          }
        }
      },
      orderBy: {
        [sortBy as string]: sortOrder
      },
      skip: offset,
      take: limitNum
    });

    // Get total count for pagination
    const total = await prisma.doctor.count({
      where: whereClause
    });

    res.status(200).json({
      doctors,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
}

async function registerDoctor(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  try {
    const validatedData = doctorRegistrationSchema.parse(req.body);

    // Check if user already has a doctor profile
    const existingDoctor = await prisma.doctor.findUnique({
      where: { userId: session.user.id }
    });

    if (existingDoctor) {
      return res.status(400).json({ error: 'User already has a doctor profile' });
    }

    // Check if license number is already in use
    const existingLicense = await prisma.doctor.findUnique({
      where: { licenseNumber: validatedData.licenseNumber }
    });

    if (existingLicense) {
      return res.status(400).json({ error: 'License number already registered' });
    }

    // Create doctor profile
    const doctor = await prisma.doctor.create({
      data: {
        userId: session.user.id,
        licenseNumber: validatedData.licenseNumber,
        specialization: validatedData.specialization,
        subSpecialties: validatedData.subSpecialties || [],
        yearsExperience: validatedData.yearsExperience,
        clinicName: validatedData.clinicName,
        clinicAddress: validatedData.clinicAddress,
        phoneNumber: validatedData.phoneNumber,
        emergencyContact: validatedData.emergencyContact,
        consultationFee: validatedData.consultationFee,
        currency: validatedData.currency,
        acceptsInsurance: validatedData.acceptsInsurance,
        telemedicineEnabled: validatedData.telemedicineEnabled,
        isVerified: false, // Requires admin verification
        isActive: true
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    });

    res.status(201).json({
      doctor,
      message: 'Doctor profile created successfully. Awaiting verification.'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    }

    console.error('Error registering doctor:', error);
    res.status(500).json({ error: 'Failed to register doctor' });
  }
}

async function updateDoctorProfile(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  try {
    // Get doctor profile for current user
    const doctor = await prisma.doctor.findUnique({
      where: { userId: session.user.id }
    });

    if (!doctor) {
      return res.status(403).json({ error: 'Doctor profile not found' });
    }

    const validatedData = doctorRegistrationSchema.partial().parse(req.body);

    // If license number is being changed, check uniqueness
    if (validatedData.licenseNumber && validatedData.licenseNumber !== doctor.licenseNumber) {
      const existingLicense = await prisma.doctor.findUnique({
        where: { licenseNumber: validatedData.licenseNumber }
      });

      if (existingLicense) {
        return res.status(400).json({ error: 'License number already registered' });
      }
    }

    const updatedDoctor = await prisma.doctor.update({
      where: { id: doctor.id },
      data: validatedData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    });

    res.status(200).json({
      doctor: updatedDoctor,
      message: 'Doctor profile updated successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    }

    console.error('Error updating doctor profile:', error);
    res.status(500).json({ error: 'Failed to update doctor profile' });
  }
}

async function updateSchedule(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  try {
    const validatedData = scheduleSchema.parse(req.body);

    // Get doctor profile for current user
    const doctor = await prisma.doctor.findUnique({
      where: { userId: session.user.id }
    });

    if (!doctor) {
      return res.status(403).json({ error: 'Doctor profile not found' });
    }

    // Delete existing schedule
    await prisma.doctorSchedule.deleteMany({
      where: { doctorId: doctor.id }
    });

    // Create new schedule
    const scheduleEntries = validatedData.schedule.map(entry => ({
      doctorId: doctor.id,
      dayOfWeek: entry.dayOfWeek,
      startTime: entry.startTime,
      endTime: entry.endTime,
      slotDuration: entry.slotDuration,
      breakStartTime: entry.breakStartTime,
      breakEndTime: entry.breakEndTime,
      isActive: entry.isActive
    }));

    await prisma.doctorSchedule.createMany({
      data: scheduleEntries
    });

    // Get updated schedule
    const updatedSchedule = await prisma.doctorSchedule.findMany({
      where: { doctorId: doctor.id },
      orderBy: { dayOfWeek: 'asc' }
    });

    res.status(200).json({
      schedule: updatedSchedule,
      message: 'Schedule updated successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    }

    console.error('Error updating schedule:', error);
    res.status(500).json({ error: 'Failed to update schedule' });
  }
}

async function setAvailability(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  try {
    const validatedData = availabilitySchema.parse(req.body);

    // Get doctor profile for current user
    const doctor = await prisma.doctor.findUnique({
      where: { userId: session.user.id }
    });

    if (!doctor) {
      return res.status(403).json({ error: 'Doctor profile not found' });
    }

    const date = new Date(validatedData.date);

    // Create or update availability
    const availability = await prisma.doctorAvailability.upsert({
      where: {
        doctorId_date: {
          doctorId: doctor.id,
          date
        }
      },
      update: {
        startTime: validatedData.startTime,
        endTime: validatedData.endTime,
        type: validatedData.type,
        isOverride: validatedData.isOverride,
        reason: validatedData.reason
      },
      create: {
        doctorId: doctor.id,
        date,
        startTime: validatedData.startTime,
        endTime: validatedData.endTime,
        type: validatedData.type,
        isOverride: validatedData.isOverride,
        reason: validatedData.reason
      }
    });

    res.status(200).json({
      availability,
      message: 'Availability updated successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    }

    console.error('Error setting availability:', error);
    res.status(500).json({ error: 'Failed to set availability' });
  }
}

async function getDoctorAvailability(req: NextApiRequest, res: NextApiResponse) {
  const { doctorId, startDate, endDate } = req.query;

  if (!doctorId || typeof doctorId !== 'string') {
    return res.status(400).json({ error: 'Doctor ID required' });
  }

  try {
    const start = startDate ? new Date(startDate as string) : new Date();
    const end = endDate ? new Date(endDate as string) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

    // Get doctor's regular schedule
    const schedule = await prisma.doctorSchedule.findMany({
      where: {
        doctorId,
        isActive: true
      },
      orderBy: { dayOfWeek: 'asc' }
    });

    // Get specific availability overrides
    const availability = await prisma.doctorAvailability.findMany({
      where: {
        doctorId,
        date: {
          gte: start,
          lte: end
        }
      },
      orderBy: { date: 'asc' }
    });

    // Get existing appointments to mark as booked
    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId,
        scheduledAt: {
          gte: start,
          lte: end
        },
        status: {
          in: ['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS']
        }
      },
      select: {
        scheduledAt: true,
        duration: true
      }
    });

    // Generate available time slots
    const timeSlots = generateTimeSlots(schedule, availability, appointments, start, end);

    res.status(200).json({
      schedule,
      availability,
      timeSlots,
      appointments: appointments.length
    });
  } catch (error) {
    console.error('Error fetching doctor availability:', error);
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
}

// Helper function to generate available time slots
function generateTimeSlots(
  schedule: any[],
  availability: any[],
  appointments: any[],
  startDate: Date,
  endDate: Date
): any[] {
  const slots = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    const dayOfWeek = current.getDay();
    const dateStr = current.toISOString().split('T')[0];

    // Check for availability override
    const override = availability.find(a => 
      a.date.toISOString().split('T')[0] === dateStr
    );

    if (override) {
      if (override.type !== 'BLOCKED') {
        const daySlots = generateDaySlots(
          current,
          override.startTime,
          override.endTime,
          30, // default slot duration
          appointments
        );
        slots.push(...daySlots);
      }
    } else {
      // Use regular schedule
      const regularSchedule = schedule.find(s => s.dayOfWeek === dayOfWeek);
      if (regularSchedule) {
        const daySlots = generateDaySlots(
          current,
          regularSchedule.startTime,
          regularSchedule.endTime,
          regularSchedule.slotDuration,
          appointments,
          regularSchedule.breakStartTime,
          regularSchedule.breakEndTime
        );
        slots.push(...daySlots);
      }
    }

    current.setDate(current.getDate() + 1);
  }

  return slots;
}

function generateDaySlots(
  date: Date,
  startTime: string,
  endTime: string,
  slotDuration: number,
  appointments: any[],
  breakStart?: string,
  breakEnd?: string
): any[] {
  const slots = [];
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  let currentTime = new Date(date);
  currentTime.setHours(startHour, startMinute, 0, 0);

  const endDateTime = new Date(date);
  endDateTime.setHours(endHour, endMinute, 0, 0);

  while (currentTime < endDateTime) {
    const slotEnd = new Date(currentTime.getTime() + slotDuration * 60000);

    // Check if slot conflicts with break time
    if (breakStart && breakEnd) {
      const [breakStartHour, breakStartMinute] = breakStart.split(':').map(Number);
      const [breakEndHour, breakEndMinute] = breakEnd.split(':').map(Number);
      
      const breakStartTime = new Date(date);
      breakStartTime.setHours(breakStartHour, breakStartMinute, 0, 0);
      
      const breakEndTime = new Date(date);
      breakEndTime.setHours(breakEndHour, breakEndMinute, 0, 0);

      if (currentTime < breakEndTime && slotEnd > breakStartTime) {
        currentTime = new Date(breakEndTime);
        continue;
      }
    }

    // Check if slot conflicts with existing appointments
    const hasConflict = appointments.some(apt => {
      const aptStart = new Date(apt.scheduledAt);
      const aptEnd = new Date(aptStart.getTime() + apt.duration * 60000);
      return currentTime < aptEnd && slotEnd > aptStart;
    });

    if (!hasConflict && slotEnd <= endDateTime) {
      slots.push({
        startTime: currentTime.toISOString(),
        endTime: slotEnd.toISOString(),
        duration: slotDuration,
        available: true
      });
    }

    currentTime = new Date(currentTime.getTime() + slotDuration * 60000);
  }

  return slots;
}