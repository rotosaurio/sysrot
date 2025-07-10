import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedHealthcare() {
  console.log('🏥 Starting Healthcare System seed...');

  try {
    // Create healthcare users
    console.log('👨‍⚕️ Creating doctors and patients...');
    
    const passwordHash = await bcrypt.hash('health123', 10);

    const users = [
      // Doctors
      {
        email: 'dr.johnson@medicenter.com',
        name: 'Dr. Sarah Johnson',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face'
      },
      {
        email: 'dr.martinez@cardioclinic.com', 
        name: 'Dr. Carlos Martinez',
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face'
      },
      {
        email: 'dr.wong@pediatrics.com',
        name: 'Dr. Lisa Wong',
        image: 'https://images.unsplash.com/photo-1594824389403-3d3bfec86371?w=150&h=150&fit=crop&crop=face'
      },
      {
        email: 'dr.anderson@neurocenter.com',
        name: 'Dr. Michael Anderson',
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face'
      },
      {
        email: 'dr.patel@dermaclinic.com',
        name: 'Dr. Priya Patel',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face'
      },
      
      // Patients
      {
        email: 'patient.smith@email.com',
        name: 'John Smith',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      },
      {
        email: 'patient.davis@email.com',
        name: 'Emily Davis',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
      },
      {
        email: 'patient.garcia@email.com',
        name: 'Maria Garcia',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
      },
      {
        email: 'patient.brown@email.com',
        name: 'James Brown',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
      },
      {
        email: 'patient.wilson@email.com',
        name: 'Linda Wilson',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face'
      },
      {
        email: 'patient.taylor@email.com',
        name: 'Robert Taylor',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
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

    console.log('✅ Created healthcare users');

    // Create doctor profiles
    console.log('🩺 Creating doctor profiles...');

    const doctors = [
      {
        userId: createdUsers[0].id, // Dr. Sarah Johnson
        licenseNumber: 'MD-12345-CA',
        specialization: 'FAMILY_MEDICINE',
        subSpecialties: ['INTERNAL_MEDICINE'],
        yearsExperience: 8,
        clinicName: 'Johnson Family Medical Center',
        clinicAddress: '123 Main St, Los Angeles, CA 90210',
        phoneNumber: '+1-555-0101',
        emergencyContact: '+1-555-0102',
        consultationFee: 150,
        currency: 'USD',
        acceptsInsurance: true,
        telemedicineEnabled: true,
        isVerified: true,
        verifiedAt: new Date('2023-06-15'),
        totalPatients: 0,
        totalConsultations: 0,
        averageRating: 4.8
      },
      {
        userId: createdUsers[1].id, // Dr. Carlos Martinez
        licenseNumber: 'MD-67890-TX',
        specialization: 'CARDIOLOGY',
        subSpecialties: ['INTERNAL_MEDICINE'],
        yearsExperience: 12,
        clinicName: 'Heart & Vascular Institute',
        clinicAddress: '456 Oak Ave, Houston, TX 77002',
        phoneNumber: '+1-555-0201',
        emergencyContact: '+1-555-0202',
        consultationFee: 250,
        currency: 'USD',
        acceptsInsurance: true,
        telemedicineEnabled: true,
        isVerified: true,
        verifiedAt: new Date('2023-05-20'),
        totalPatients: 0,
        totalConsultations: 0,
        averageRating: 4.9
      },
      {
        userId: createdUsers[2].id, // Dr. Lisa Wong
        licenseNumber: 'MD-54321-NY',
        specialization: 'PEDIATRICS',
        subSpecialties: [],
        yearsExperience: 6,
        clinicName: 'Children\'s Health Center',
        clinicAddress: '789 Park Ave, New York, NY 10001',
        phoneNumber: '+1-555-0301',
        emergencyContact: '+1-555-0302',
        consultationFee: 180,
        currency: 'USD',
        acceptsInsurance: true,
        telemedicineEnabled: true,
        isVerified: true,
        verifiedAt: new Date('2023-07-10'),
        totalPatients: 0,
        totalConsultations: 0,
        averageRating: 4.7
      },
      {
        userId: createdUsers[3].id, // Dr. Michael Anderson
        licenseNumber: 'MD-98765-FL',
        specialization: 'NEUROLOGY',
        subSpecialties: ['PSYCHIATRY'],
        yearsExperience: 15,
        clinicName: 'Neurological Associates',
        clinicAddress: '321 Beach Blvd, Miami, FL 33101',
        phoneNumber: '+1-555-0401',
        emergencyContact: '+1-555-0402',
        consultationFee: 300,
        currency: 'USD',
        acceptsInsurance: true,
        telemedicineEnabled: false,
        isVerified: true,
        verifiedAt: new Date('2023-04-25'),
        totalPatients: 0,
        totalConsultations: 0,
        averageRating: 4.6
      },
      {
        userId: createdUsers[4].id, // Dr. Priya Patel
        licenseNumber: 'MD-11111-WA',
        specialization: 'DERMATOLOGY',
        subSpecialties: [],
        yearsExperience: 10,
        clinicName: 'Seattle Dermatology Clinic',
        clinicAddress: '654 Pine St, Seattle, WA 98101',
        phoneNumber: '+1-555-0501',
        emergencyContact: '+1-555-0502',
        consultationFee: 200,
        currency: 'USD',
        acceptsInsurance: true,
        telemedicineEnabled: true,
        isVerified: true,
        verifiedAt: new Date('2023-08-01'),
        totalPatients: 0,
        totalConsultations: 0,
        averageRating: 4.9
      }
    ];

    const createdDoctors = [];
    for (const doctorData of doctors) {
      const doctor = await prisma.doctor.create({
        data: doctorData
      });
      createdDoctors.push(doctor);
    }

    console.log('✅ Created doctor profiles');

    // Create patient profiles
    console.log('🤒 Creating patient profiles...');

    const patients = [
      {
        userId: createdUsers[5].id, // John Smith
        dateOfBirth: new Date('1985-03-15'),
        gender: 'MALE',
        bloodType: 'A_POSITIVE',
        height: 180,
        weight: 75,
        phoneNumber: '+1-555-1001',
        emergencyContact: 'Jane Smith (Wife)',
        emergencyPhone: '+1-555-1002',
        address: '123 Elm St, Los Angeles, CA 90210',
        city: 'Los Angeles',
        zipCode: '90210',
        country: 'US',
        insuranceProvider: 'Blue Cross Blue Shield',
        insuranceNumber: 'BCBS-123456789',
        allergies: ['Penicillin', 'Shellfish'],
        chronicConditions: ['Hypertension'],
        currentMedications: ['Lisinopril 10mg'],
        primaryDoctorId: createdDoctors[0].id,
        consentToTreatment: true,
        consentToTelemedicine: true,
        dataProcessingConsent: true,
        isActive: true
      },
      {
        userId: createdUsers[6].id, // Emily Davis
        dateOfBirth: new Date('1992-07-22'),
        gender: 'FEMALE',
        bloodType: 'O_NEGATIVE',
        height: 165,
        weight: 58,
        phoneNumber: '+1-555-2001',
        emergencyContact: 'Mike Davis (Brother)',
        emergencyPhone: '+1-555-2002',
        address: '456 Maple Ave, Houston, TX 77002',
        city: 'Houston',
        zipCode: '77002',
        country: 'US',
        insuranceProvider: 'Aetna',
        insuranceNumber: 'AETNA-987654321',
        allergies: ['Latex'],
        chronicConditions: [],
        currentMedications: [],
        primaryDoctorId: createdDoctors[1].id,
        consentToTreatment: true,
        consentToTelemedicine: true,
        dataProcessingConsent: true,
        isActive: true
      },
      {
        userId: createdUsers[7].id, // Maria Garcia
        dateOfBirth: new Date('1978-11-08'),
        gender: 'FEMALE',
        bloodType: 'B_POSITIVE',
        height: 162,
        weight: 65,
        phoneNumber: '+1-555-3001',
        emergencyContact: 'Jose Garcia (Husband)',
        emergencyPhone: '+1-555-3002',
        address: '789 Broadway, New York, NY 10001',
        city: 'New York',
        zipCode: '10001',
        country: 'US',
        insuranceProvider: 'Cigna',
        insuranceNumber: 'CIGNA-555666777',
        allergies: ['Nuts'],
        chronicConditions: ['Diabetes Type 2'],
        currentMedications: ['Metformin 500mg', 'Insulin'],
        primaryDoctorId: createdDoctors[0].id,
        consentToTreatment: true,
        consentToTelemedicine: false,
        dataProcessingConsent: true,
        isActive: true
      },
      {
        userId: createdUsers[8].id, // James Brown
        dateOfBirth: new Date('1965-05-30'),
        gender: 'MALE',
        bloodType: 'AB_POSITIVE',
        height: 175,
        weight: 82,
        phoneNumber: '+1-555-4001',
        emergencyContact: 'Susan Brown (Wife)',
        emergencyPhone: '+1-555-4002',
        address: '321 Ocean Dr, Miami, FL 33101',
        city: 'Miami',
        zipCode: '33101',
        country: 'US',
        insuranceProvider: 'United Healthcare',
        insuranceNumber: 'UHC-111222333',
        allergies: [],
        chronicConditions: ['High Cholesterol', 'Arthritis'],
        currentMedications: ['Atorvastatin 20mg', 'Ibuprofen'],
        primaryDoctorId: createdDoctors[3].id,
        consentToTreatment: true,
        consentToTelemedicine: true,
        dataProcessingConsent: true,
        isActive: true
      },
      {
        userId: createdUsers[9].id, // Linda Wilson
        dateOfBirth: new Date('1988-12-12'),
        gender: 'FEMALE',
        bloodType: 'A_NEGATIVE',
        height: 168,
        weight: 62,
        phoneNumber: '+1-555-5001',
        emergencyContact: 'Tom Wilson (Husband)',
        emergencyPhone: '+1-555-5002',
        address: '654 Hill St, Seattle, WA 98101',
        city: 'Seattle',
        zipCode: '98101',
        country: 'US',
        insuranceProvider: 'Kaiser Permanente',
        insuranceNumber: 'KAISER-444555666',
        allergies: ['Aspirin'],
        chronicConditions: ['Eczema'],
        currentMedications: ['Hydrocortisone cream'],
        primaryDoctorId: createdDoctors[4].id,
        consentToTreatment: true,
        consentToTelemedicine: true,
        dataProcessingConsent: true,
        isActive: true
      },
      {
        userId: createdUsers[10].id, // Robert Taylor
        dateOfBirth: new Date('1995-09-18'),
        gender: 'MALE',
        bloodType: 'O_POSITIVE',
        height: 183,
        weight: 78,
        phoneNumber: '+1-555-6001',
        emergencyContact: 'Amy Taylor (Sister)',
        emergencyPhone: '+1-555-6002',
        address: '987 Valley Rd, Los Angeles, CA 90210',
        city: 'Los Angeles',
        zipCode: '90210',
        country: 'US',
        insuranceProvider: 'Blue Cross Blue Shield',
        insuranceNumber: 'BCBS-777888999',
        allergies: [],
        chronicConditions: [],
        currentMedications: [],
        primaryDoctorId: createdDoctors[0].id,
        consentToTreatment: true,
        consentToTelemedicine: true,
        dataProcessingConsent: true,
        isActive: true
      }
    ];

    const createdPatients = [];
    for (const patientData of patients) {
      const patient = await prisma.patient.create({
        data: patientData
      });
      createdPatients.push(patient);
    }

    console.log('✅ Created patient profiles');

    // Create doctor schedules
    console.log('📅 Creating doctor schedules...');

    const schedules = [
      // Dr. Sarah Johnson - Family Medicine
      { doctorId: createdDoctors[0].id, dayOfWeek: 1, startTime: '09:00', endTime: '17:00', slotDuration: 30, breakStartTime: '12:00', breakEndTime: '13:00' },
      { doctorId: createdDoctors[0].id, dayOfWeek: 2, startTime: '09:00', endTime: '17:00', slotDuration: 30, breakStartTime: '12:00', breakEndTime: '13:00' },
      { doctorId: createdDoctors[0].id, dayOfWeek: 3, startTime: '09:00', endTime: '17:00', slotDuration: 30, breakStartTime: '12:00', breakEndTime: '13:00' },
      { doctorId: createdDoctors[0].id, dayOfWeek: 4, startTime: '09:00', endTime: '17:00', slotDuration: 30, breakStartTime: '12:00', breakEndTime: '13:00' },
      { doctorId: createdDoctors[0].id, dayOfWeek: 5, startTime: '09:00', endTime: '15:00', slotDuration: 30 },
      
      // Dr. Carlos Martinez - Cardiology
      { doctorId: createdDoctors[1].id, dayOfWeek: 1, startTime: '08:00', endTime: '16:00', slotDuration: 45, breakStartTime: '12:00', breakEndTime: '13:00' },
      { doctorId: createdDoctors[1].id, dayOfWeek: 2, startTime: '08:00', endTime: '16:00', slotDuration: 45, breakStartTime: '12:00', breakEndTime: '13:00' },
      { doctorId: createdDoctors[1].id, dayOfWeek: 4, startTime: '08:00', endTime: '16:00', slotDuration: 45, breakStartTime: '12:00', breakEndTime: '13:00' },
      { doctorId: createdDoctors[1].id, dayOfWeek: 5, startTime: '08:00', endTime: '14:00', slotDuration: 45 },
      
      // Dr. Lisa Wong - Pediatrics
      { doctorId: createdDoctors[2].id, dayOfWeek: 1, startTime: '10:00', endTime: '18:00', slotDuration: 20, breakStartTime: '12:30', breakEndTime: '13:30' },
      { doctorId: createdDoctors[2].id, dayOfWeek: 2, startTime: '10:00', endTime: '18:00', slotDuration: 20, breakStartTime: '12:30', breakEndTime: '13:30' },
      { doctorId: createdDoctors[2].id, dayOfWeek: 3, startTime: '10:00', endTime: '18:00', slotDuration: 20, breakStartTime: '12:30', breakEndTime: '13:30' },
      { doctorId: createdDoctors[2].id, dayOfWeek: 4, startTime: '10:00', endTime: '18:00', slotDuration: 20, breakStartTime: '12:30', breakEndTime: '13:30' },
      
      // Dr. Michael Anderson - Neurology
      { doctorId: createdDoctors[3].id, dayOfWeek: 2, startTime: '09:00', endTime: '17:00', slotDuration: 60, breakStartTime: '12:00', breakEndTime: '13:00' },
      { doctorId: createdDoctors[3].id, dayOfWeek: 3, startTime: '09:00', endTime: '17:00', slotDuration: 60, breakStartTime: '12:00', breakEndTime: '13:00' },
      { doctorId: createdDoctors[3].id, dayOfWeek: 4, startTime: '09:00', endTime: '17:00', slotDuration: 60, breakStartTime: '12:00', breakEndTime: '13:00' },
      
      // Dr. Priya Patel - Dermatology
      { doctorId: createdDoctors[4].id, dayOfWeek: 1, startTime: '08:30', endTime: '16:30', slotDuration: 25, breakStartTime: '12:00', breakEndTime: '13:00' },
      { doctorId: createdDoctors[4].id, dayOfWeek: 3, startTime: '08:30', endTime: '16:30', slotDuration: 25, breakStartTime: '12:00', breakEndTime: '13:00' },
      { doctorId: createdDoctors[4].id, dayOfWeek: 5, startTime: '08:30', endTime: '14:30', slotDuration: 25 }
    ];

    for (const scheduleData of schedules) {
      await prisma.doctorSchedule.create({
        data: scheduleData
      });
    }

    console.log('✅ Created doctor schedules');

    // Create appointments
    console.log('📋 Creating appointments...');

    const appointments = [
      // Past completed appointments
      {
        patientId: createdPatients[0].id, // John Smith
        doctorId: createdDoctors[0].id, // Dr. Johnson
        scheduledAt: new Date('2024-01-15T10:00:00Z'),
        duration: 30,
        type: 'CONSULTATION',
        method: 'IN_PERSON',
        reason: 'Annual check-up',
        symptoms: 'General wellness check',
        status: 'COMPLETED'
      },
      {
        patientId: createdPatients[1].id, // Emily Davis
        doctorId: createdDoctors[1].id, // Dr. Martinez
        scheduledAt: new Date('2024-01-18T14:00:00Z'),
        duration: 45,
        type: 'CONSULTATION',
        method: 'IN_PERSON',
        reason: 'Chest pain evaluation',
        symptoms: 'Intermittent chest pain during exercise',
        status: 'COMPLETED'
      },
      {
        patientId: createdPatients[2].id, // Maria Garcia
        doctorId: createdDoctors[0].id, // Dr. Johnson
        scheduledAt: new Date('2024-01-20T11:30:00Z'),
        duration: 30,
        type: 'FOLLOW_UP',
        method: 'TELEMEDICINE',
        reason: 'Diabetes follow-up',
        symptoms: 'Blood sugar monitoring',
        status: 'COMPLETED'
      },
      
      // Upcoming appointments
      {
        patientId: createdPatients[3].id, // James Brown
        doctorId: createdDoctors[3].id, // Dr. Anderson
        scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        duration: 60,
        type: 'CONSULTATION',
        method: 'IN_PERSON',
        reason: 'Memory issues',
        symptoms: 'Difficulty remembering recent events',
        status: 'SCHEDULED'
      },
      {
        patientId: createdPatients[4].id, // Linda Wilson
        doctorId: createdDoctors[4].id, // Dr. Patel
        scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        duration: 25,
        type: 'CONSULTATION',
        method: 'IN_PERSON',
        reason: 'Skin rash',
        symptoms: 'Persistent rash on arms',
        status: 'CONFIRMED'
      },
      {
        patientId: createdPatients[5].id, // Robert Taylor
        doctorId: createdDoctors[0].id, // Dr. Johnson
        scheduledAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
        duration: 30,
        type: 'PHYSICAL_EXAM',
        method: 'IN_PERSON',
        reason: 'Pre-employment physical',
        symptoms: 'Routine examination for new job',
        status: 'SCHEDULED'
      }
    ];

    const createdAppointments = [];
    for (const appointmentData of appointments) {
      const appointment = await prisma.appointment.create({
        data: appointmentData
      });
      createdAppointments.push(appointment);
    }

    console.log('✅ Created appointments');

    // Update doctor patient counts
    for (const doctor of createdDoctors) {
      const patientCount = await prisma.appointment.count({
        where: { 
          doctorId: doctor.id,
          status: { in: ['COMPLETED', 'SCHEDULED', 'CONFIRMED'] }
        },
        distinct: ['patientId']
      });
      
      const consultationCount = await prisma.appointment.count({
        where: { 
          doctorId: doctor.id,
          status: 'COMPLETED'
        }
      });

      await prisma.doctor.update({
        where: { id: doctor.id },
        data: {
          totalPatients: patientCount,
          totalConsultations: consultationCount
        }
      });
    }

    console.log('\n🎉 Healthcare System seed completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   • 11 users created (5 doctors + 6 patients)`);
    console.log(`   • 5 specialized doctors with verified profiles`);
    console.log(`   • 6 patient profiles with complete medical information`);
    console.log(`   • 19 doctor schedule entries across different specialties`);
    console.log(`   • 6 appointments (3 completed + 3 upcoming)`);
    
    console.log('\n🔑 Test Login Credentials:');
    console.log('   dr.johnson@medicenter.com:health123 (Family Medicine - $150)');
    console.log('   dr.martinez@cardioclinic.com:health123 (Cardiology - $250)');
    console.log('   dr.wong@pediatrics.com:health123 (Pediatrics - $180)');
    console.log('   dr.anderson@neurocenter.com:health123 (Neurology - $300)');
    console.log('   dr.patel@dermaclinic.com:health123 (Dermatology - $200)');
    console.log('   patient.smith@email.com:health123 (John Smith - Hypertension)');
    console.log('   patient.davis@email.com:health123 (Emily Davis - Healthy)');
    console.log('   patient.garcia@email.com:health123 (Maria Garcia - Diabetes)');

    console.log('\n🩺 Medical Specialties Available:');
    console.log('   👨‍⚕️ Family Medicine (Dr. Johnson) - General practice');
    console.log('   ❤️ Cardiology (Dr. Martinez) - Heart conditions');
    console.log('   👶 Pediatrics (Dr. Wong) - Children\'s health');
    console.log('   🧠 Neurology (Dr. Anderson) - Brain & nervous system');
    console.log('   🔬 Dermatology (Dr. Patel) - Skin conditions');

    console.log('\n🎯 Healthcare Features Ready:');
    console.log('   ✅ Complete doctor and patient profiles');
    console.log('   ✅ Medical specialties and credentials verification');
    console.log('   ✅ Flexible appointment scheduling system');
    console.log('   ✅ Telemedicine and in-person consultations');
    console.log('   ✅ Medical history and chronic conditions tracking');
    console.log('   ✅ Insurance information and billing integration');
    console.log('   ✅ Emergency contacts and consent management');

  } catch (error) {
    console.error('❌ Error seeding healthcare data:', error);
    throw error;
  }
}

export default seedHealthcare;

// Run the seed if this file is executed directly
if (require.main === module) {
  seedHealthcare()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}