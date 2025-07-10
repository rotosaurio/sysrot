import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
const createAppointmentSchema = z.object({
  doctorId: z.string(),
  scheduledAt: z.string().datetime(),
  duration: z.number().min(15).max(180).default(30),
  type: z.enum(['CONSULTATION', 'FOLLOW_UP', 'PHYSICAL_EXAM', 'VACCINATION', 'MENTAL_HEALTH', 'SPECIALIST_REFERRAL', 'EMERGENCY', 'TELEMEDICINE']).default('CONSULTATION'),
  method: z.enum(['IN_PERSON', 'TELEMEDICINE', 'PHONE_CALL', 'HOME_VISIT']).default('IN_PERSON'),
  reason: z.string().max(500).optional(),
  symptoms: z.string().max(1000).optional(),
  notes: z.string().max(1000).optional(),
  isFollowUp: z.boolean().default(false),
  followUpFor: z.string().optional()
});

const updateAppointmentSchema = z.object({
  status: z.enum(['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'RESCHEDULED']).optional(),
  scheduledAt: z.string().datetime().optional(),
  reason: z.string().max(500).optional(),
  symptoms: z.string().max(1000).optional(),
  notes: z.string().max(1000).optional(),
  cancellationReason: z.string().max(500).optional()
});

const consultationSchema = z.object({
  appointmentId: z.string(),
  chiefComplaint: z.string().max(1000).optional(),
  historyOfPresentIllness: z.string().max(2000).optional(),
  pastMedicalHistory: z.string().max(2000).optional(),
  familyHistory: z.string().max(1000).optional(),
  socialHistory: z.string().max(1000).optional(),
  physicalExam: z.string().max(2000).optional(),
  vitalSigns: z.object({
    systolicBP: z.number().optional(),
    diastolicBP: z.number().optional(),
    heartRate: z.number().optional(),
    temperature: z.number().optional(),
    respiratoryRate: z.number().optional(),
    oxygenSaturation: z.number().optional(),
    height: z.number().optional(),
    weight: z.number().optional(),
    painLevel: z.number().min(0).max(10).optional()
  }).optional(),
  assessment: z.string().max(2000).optional(),
  diagnosis: z.string().max(1000).optional(),
  treatmentPlan: z.string().max(2000).optional(),
  followUpInstructions: z.string().max(1000).optional(),
  followUpRequired: z.boolean().default(false),
  followUpDate: z.string().datetime().optional(),
  followUpType: z.enum(['CONSULTATION', 'FOLLOW_UP', 'PHYSICAL_EXAM', 'VACCINATION', 'MENTAL_HEALTH', 'SPECIALIST_REFERRAL', 'EMERGENCY', 'TELEMEDICINE']).optional(),
  consultationNotes: z.string().max(5000).optional(),
  privateNotes: z.string().max(2000).optional()
});

async function hasAppointmentAccess(userId: string, appointmentId: string, action: string = 'read') {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      patient: { include: { user: true } },
      doctor: { include: { user: true } }
    }
  });

  if (!appointment) return false;

  const isPatient = appointment.patient.userId === userId;
  const isDoctor = appointment.doctor.userId === userId;

  switch (action) {
    case 'read':
      return isPatient || isDoctor;
    case 'update':
      return isPatient || isDoctor;
    case 'cancel':
      return isPatient || isDoctor;
    case 'consult':
      return isDoctor; // Only doctors can create consultations
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
        return await getAppointments(req, res);

      case 'POST':
        if (action === 'consultation') {
          return await createConsultation(req, res);
        }
        return await createAppointment(req, res);

      case 'PUT':
        return await updateAppointment(req, res);

      case 'DELETE':
        return await cancelAppointment(req, res);

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).end('Method Not Allowed');
    }
  } catch (error) {
    console.error('Appointments API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}

async function getAppointments(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const { 
    doctorId,
    patientId,
    status,
    type,
    method: appointmentMethod,
    startDate,
    endDate,
    limit = '20',
    page = '1',
    upcoming = 'false',
    appointmentId
  } = req.query;

  try {
    // Get single appointment with detailed information
    if (appointmentId && typeof appointmentId === 'string') {
      if (!(await hasAppointmentAccess(session.user.id, appointmentId, 'read'))) {
        return res.status(403).json({ error: 'Access denied to this appointment' });
      }

      const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: {
          patient: {
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
          },
          doctor: {
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
          },
          consultation: {
            include: {
              prescriptions: true,
              labOrders: {
                include: {
                  result: true
                }
              },
              medicalRecord: true
            }
          },
          billingRecord: true
        }
      });

      if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found' });
      }

      return res.status(200).json({ appointment });
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    // Build where clause based on user role and filters
    const whereClause: any = {};

    // Get user's role (doctor or patient)
    const userProfile = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        doctorProfile: true,
        patientProfile: true
      }
    });

    if (!userProfile?.doctorProfile && !userProfile?.patientProfile) {
      return res.status(403).json({ error: 'User must have a doctor or patient profile' });
    }

    // Filter by user role
    if (userProfile.doctorProfile) {
      whereClause.doctorId = userProfile.doctorProfile.id;
    } else if (userProfile.patientProfile) {
      whereClause.patientId = userProfile.patientProfile.id;
    }

    // Override with specific doctor/patient if provided (for admin or cross-access)
    if (doctorId && typeof doctorId === 'string') {
      whereClause.doctorId = doctorId;
    }
    if (patientId && typeof patientId === 'string') {
      whereClause.patientId = patientId;
    }

    // Apply filters
    if (status && typeof status === 'string') {
      whereClause.status = status.toUpperCase();
    }

    if (type && typeof type === 'string') {
      whereClause.type = type.toUpperCase();
    }

    if (appointmentMethod && typeof appointmentMethod === 'string') {
      whereClause.method = appointmentMethod.toUpperCase();
    }

    // Date range filtering
    if (startDate || endDate || upcoming === 'true') {
      whereClause.scheduledAt = {};
      
      if (upcoming === 'true') {
        whereClause.scheduledAt.gte = new Date();
      } else {
        if (startDate && typeof startDate === 'string') {
          whereClause.scheduledAt.gte = new Date(startDate);
        }
        if (endDate && typeof endDate === 'string') {
          whereClause.scheduledAt.lte = new Date(endDate);
        }
      }
    }

    const appointments = await prisma.appointment.findMany({
      where: whereClause,
      include: {
        patient: {
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
        },
        doctor: {
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
        },
        consultation: {
          select: {
            id: true,
            startedAt: true,
            endedAt: true,
            duration: true,
            isTelemedicine: true
          }
        },
        billingRecord: {
          select: {
            id: true,
            amount: true,
            paymentStatus: true,
            billingStatus: true
          }
        }
      },
      orderBy: {
        scheduledAt: 'asc'
      },
      skip: offset,
      take: limitNum
    });

    // Get total count for pagination
    const total = await prisma.appointment.count({
      where: whereClause
    });

    res.status(200).json({
      appointments,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
}

async function createAppointment(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  try {
    const validatedData = createAppointmentSchema.parse(req.body);

    // Get patient profile for current user
    const userProfile = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        patientProfile: true
      }
    });

    if (!userProfile?.patientProfile) {
      return res.status(403).json({ error: 'Only patients can book appointments' });
    }

    // Verify doctor exists and is active
    const doctor = await prisma.doctor.findUnique({
      where: { id: validatedData.doctorId },
      include: {
        user: true
      }
    });

    if (!doctor || !doctor.isActive || !doctor.isVerified) {
      return res.status(400).json({ error: 'Doctor not available for appointments' });
    }

    // Check if appointment time is available
    const scheduledAt = new Date(validatedData.scheduledAt);
    const endTime = new Date(scheduledAt.getTime() + validatedData.duration * 60000);

    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId: validatedData.doctorId,
        status: {
          in: ['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS']
        },
        AND: [
          {
            scheduledAt: {
              lt: endTime
            }
          },
          {
            scheduledAt: {
              gte: new Date(scheduledAt.getTime() - 30 * 60000) // 30 minutes buffer
            }
          }
        ]
      }
    });

    if (conflictingAppointment) {
      return res.status(400).json({ error: 'Time slot not available' });
    }

    // Create the appointment
    const appointment = await prisma.appointment.create({
      data: {
        patientId: userProfile.patientProfile.id,
        doctorId: validatedData.doctorId,
        scheduledAt,
        duration: validatedData.duration,
        type: validatedData.type,
        method: validatedData.method,
        reason: validatedData.reason,
        symptoms: validatedData.symptoms,
        notes: validatedData.notes,
        isFollowUp: validatedData.isFollowUp,
        followUpFor: validatedData.followUpFor,
        status: 'SCHEDULED'
      },
      include: {
        patient: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        },
        doctor: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    // Update doctor's total patients count if first appointment
    const existingAppointments = await prisma.appointment.count({
      where: {
        doctorId: validatedData.doctorId,
        patientId: userProfile.patientProfile.id,
        id: { not: appointment.id }
      }
    });

    if (existingAppointments === 0) {
      await prisma.doctor.update({
        where: { id: validatedData.doctorId },
        data: {
          totalPatients: { increment: 1 }
        }
      });
    }

    // Create billing record
    await prisma.billingRecord.create({
      data: {
        patientId: userProfile.patientProfile.id,
        appointmentId: appointment.id,
        serviceDate: scheduledAt,
        serviceDescription: `${validatedData.type} - ${doctor.user.name}`,
        serviceCode: getServiceCode(validatedData.type),
        amount: doctor.consultationFee,
        currency: doctor.currency,
        patientResponsibility: doctor.consultationFee,
        billingStatus: 'DRAFT'
      }
    });

    res.status(201).json({
      appointment,
      message: 'Appointment scheduled successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    }

    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Failed to create appointment' });
  }
}

async function updateAppointment(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const { appointmentId } = req.query;

  if (!appointmentId || typeof appointmentId !== 'string') {
    return res.status(400).json({ error: 'Appointment ID required' });
  }

  try {
    const validatedData = updateAppointmentSchema.parse(req.body);

    if (!(await hasAppointmentAccess(session.user.id, appointmentId, 'update'))) {
      return res.status(403).json({ error: 'Access denied to this appointment' });
    }

    const updateData: any = {};

    if (validatedData.status) {
      updateData.status = validatedData.status;
      
      if (validatedData.status === 'CANCELLED') {
        updateData.cancelledAt = new Date();
        updateData.cancelledBy = session.user.id;
        updateData.cancellationReason = validatedData.cancellationReason;
      }
    }

    if (validatedData.scheduledAt) {
      updateData.scheduledAt = new Date(validatedData.scheduledAt);
    }

    if (validatedData.reason !== undefined) {
      updateData.reason = validatedData.reason;
    }

    if (validatedData.symptoms !== undefined) {
      updateData.symptoms = validatedData.symptoms;
    }

    if (validatedData.notes !== undefined) {
      updateData.notes = validatedData.notes;
    }

    const appointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: updateData,
      include: {
        patient: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        },
        doctor: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    res.status(200).json({
      appointment,
      message: 'Appointment updated successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    }

    console.error('Error updating appointment:', error);
    res.status(500).json({ error: 'Failed to update appointment' });
  }
}

async function cancelAppointment(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const { appointmentId } = req.query;

  if (!appointmentId || typeof appointmentId !== 'string') {
    return res.status(400).json({ error: 'Appointment ID required' });
  }

  try {
    if (!(await hasAppointmentAccess(session.user.id, appointmentId, 'cancel'))) {
      return res.status(403).json({ error: 'Access denied to this appointment' });
    }

    const { reason } = req.body;

    const appointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
        cancelledBy: session.user.id,
        cancellationReason: reason
      }
    });

    // Update billing record
    await prisma.billingRecord.updateMany({
      where: { appointmentId },
      data: {
        billingStatus: 'CANCELLED'
      }
    });

    res.status(200).json({
      appointment,
      message: 'Appointment cancelled successfully'
    });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ error: 'Failed to cancel appointment' });
  }
}

async function createConsultation(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  try {
    const validatedData = consultationSchema.parse(req.body);

    if (!(await hasAppointmentAccess(session.user.id, validatedData.appointmentId, 'consult'))) {
      return res.status(403).json({ error: 'Only the assigned doctor can create consultations' });
    }

    // Get appointment details
    const appointment = await prisma.appointment.findUnique({
      where: { id: validatedData.appointmentId },
      include: {
        patient: true,
        doctor: true,
        consultation: true
      }
    });

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    if (appointment.consultation) {
      return res.status(400).json({ error: 'Consultation already exists for this appointment' });
    }

    // Create consultation
    const consultation = await prisma.consultation.create({
      data: {
        appointmentId: validatedData.appointmentId,
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
        chiefComplaint: validatedData.chiefComplaint,
        historyOfPresentIllness: validatedData.historyOfPresentIllness,
        pastMedicalHistory: validatedData.pastMedicalHistory,
        familyHistory: validatedData.familyHistory,
        socialHistory: validatedData.socialHistory,
        physicalExam: validatedData.physicalExam,
        vitalSigns: validatedData.vitalSigns ? JSON.stringify(validatedData.vitalSigns) : null,
        assessment: validatedData.assessment,
        diagnosis: validatedData.diagnosis,
        treatmentPlan: validatedData.treatmentPlan,
        followUpInstructions: validatedData.followUpInstructions,
        followUpRequired: validatedData.followUpRequired,
        followUpDate: validatedData.followUpDate ? new Date(validatedData.followUpDate) : null,
        followUpType: validatedData.followUpType,
        consultationNotes: validatedData.consultationNotes,
        privateNotes: validatedData.privateNotes,
        isTelemedicine: appointment.method === 'TELEMEDICINE'
      },
      include: {
        patient: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        },
        doctor: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    // Update appointment status
    await prisma.appointment.update({
      where: { id: validatedData.appointmentId },
      data: {
        status: 'COMPLETED'
      }
    });

    // Update doctor consultation count
    await prisma.doctor.update({
      where: { id: appointment.doctorId },
      data: {
        totalConsultations: { increment: 1 }
      }
    });

    // Create medical record
    if (validatedData.diagnosis || validatedData.assessment || validatedData.treatmentPlan) {
      await prisma.medicalRecord.create({
        data: {
          patientId: appointment.patientId,
          doctorId: appointment.doctorId,
          consultationId: consultation.id,
          type: 'CONSULTATION_NOTE',
          title: `Consultation - ${new Date().toLocaleDateString()}`,
          content: `
Chief Complaint: ${validatedData.chiefComplaint || 'N/A'}
Assessment: ${validatedData.assessment || 'N/A'}
Diagnosis: ${validatedData.diagnosis || 'N/A'}
Treatment Plan: ${validatedData.treatmentPlan || 'N/A'}
          `.trim(),
          summary: validatedData.assessment || 'Consultation completed',
          diagnosis: validatedData.diagnosis ? [validatedData.diagnosis] : [],
          symptoms: validatedData.chiefComplaint ? [validatedData.chiefComplaint] : [],
          treatments: validatedData.treatmentPlan ? [validatedData.treatmentPlan] : []
        }
      });
    }

    res.status(201).json({
      consultation,
      message: 'Consultation created successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    }

    console.error('Error creating consultation:', error);
    res.status(500).json({ error: 'Failed to create consultation' });
  }
}

// Helper function to get service codes
function getServiceCode(appointmentType: string): string {
  const serviceCodes: Record<string, string> = {
    'CONSULTATION': '99213',
    'FOLLOW_UP': '99212',
    'PHYSICAL_EXAM': '99396',
    'VACCINATION': '90471',
    'MENTAL_HEALTH': '90834',
    'SPECIALIST_REFERRAL': '99245',
    'EMERGENCY': '99282',
    'TELEMEDICINE': '99421'
  };

  return serviceCodes[appointmentType] || '99213';
}