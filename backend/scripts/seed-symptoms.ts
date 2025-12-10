import { PrismaClient, SymptomStatus, UrgencyLevel, MedicationStatus } from '@prisma/client';

const prisma = new PrismaClient();

const symptomNames = [
  'Headache', 'Fever', 'Cough', 'Sore Throat', 'Fatigue', 'Nausea', 'Dizziness',
  'Back Pain', 'Chest Pain', 'Abdominal Pain', 'Joint Pain', 'Muscle Ache',
  'Shortness of Breath', 'Runny Nose', 'Congestion', 'Sneezing', 'Chills',
  'Night Sweats', 'Loss of Appetite', 'Insomnia', 'Anxiety', 'Depression',
  'Stomach Cramps', 'Diarrhea', 'Constipation', 'Bloating', 'Heartburn',
  'Rash', 'Itching', 'Dry Skin', 'Acne', 'Swelling', 'Bruising',
  'Tingling', 'Numbness', 'Weakness', 'Tremors', 'Vertigo', 'Earache',
  'Vision Problems', 'Eye Pain', 'Toothache', 'Gum Pain', 'Jaw Pain',
  'Neck Pain', 'Shoulder Pain', 'Elbow Pain', 'Wrist Pain', 'Hip Pain',
  'Knee Pain', 'Ankle Pain', 'Foot Pain', 'Migraine', 'Tension Headache'
];

const bodyLocations = [
  'Head', 'Forehead', 'Temples', 'Back of Head', 'Neck', 'Throat',
  'Chest', 'Upper Back', 'Lower Back', 'Abdomen', 'Stomach',
  'Left Shoulder', 'Right Shoulder', 'Left Arm', 'Right Arm',
  'Left Elbow', 'Right Elbow', 'Left Wrist', 'Right Wrist',
  'Left Hip', 'Right Hip', 'Left Knee', 'Right Knee',
  'Left Ankle', 'Right Ankle', 'Left Foot', 'Right Foot',
  'Eyes', 'Ears', 'Nose', 'Mouth', 'Jaw', 'Whole Body'
];

const statuses: SymptomStatus[] = ['ACTIVE', 'IMPROVING', 'WORSENING', 'RESOLVED', 'MONITORING'];
const urgencyLevels: UrgencyLevel[] = ['EMERGENCY', 'URGENT', 'SEMI_URGENT', 'NON_URGENT', 'SELF_CARE'];

const notes = [
  'Started after waking up',
  'Got worse after eating',
  'Improved with rest',
  'Triggered by stress',
  'Occurred during exercise',
  'Worse in the evening',
  'Better in the morning',
  'Associated with weather change',
  'Started after work',
  'Improved with medication',
  'Persistent throughout the day',
  'Comes and goes',
  'Sharp and sudden onset',
  'Gradual onset',
  'Dull and constant',
  'Throbbing pain',
  'Burning sensation',
  'Stabbing pain',
  'Radiating to other areas',
  'Limited mobility'
];

// Medication data
const medications = [
  { name: 'Ibuprofen', dosage: '400mg', purpose: 'Pain relief and inflammation', timeSlots: ['08:00', '20:00'] },
  { name: 'Paracetamol', dosage: '500mg', purpose: 'Fever and pain relief', timeSlots: ['09:00', '15:00', '21:00'] },
  { name: 'Amoxicillin', dosage: '250mg', purpose: 'Bacterial infection treatment', timeSlots: ['08:00', '14:00', '20:00'] },
  { name: 'Omeprazole', dosage: '20mg', purpose: 'Acid reflux and heartburn', timeSlots: ['07:00'] },
  { name: 'Metformin', dosage: '500mg', purpose: 'Blood sugar control', timeSlots: ['08:00', '20:00'] },
  { name: 'Lisinopril', dosage: '10mg', purpose: 'Blood pressure management', timeSlots: ['08:00'] },
  { name: 'Atorvastatin', dosage: '20mg', purpose: 'Cholesterol management', timeSlots: ['21:00'] },
  { name: 'Levothyroxine', dosage: '75mcg', purpose: 'Thyroid hormone replacement', timeSlots: ['06:30'] },
  { name: 'Cetirizine', dosage: '10mg', purpose: 'Allergy relief', timeSlots: ['22:00'] },
  { name: 'Vitamin D3', dosage: '1000IU', purpose: 'Bone health and immunity', timeSlots: ['08:00'] },
  { name: 'Aspirin', dosage: '81mg', purpose: 'Cardiovascular protection', timeSlots: ['08:00'] },
  { name: 'Montelukast', dosage: '10mg', purpose: 'Asthma and allergy control', timeSlots: ['21:00'] },
  { name: 'Sertraline', dosage: '50mg', purpose: 'Anxiety and depression management', timeSlots: ['08:00'] },
  { name: 'Gabapentin', dosage: '300mg', purpose: 'Nerve pain relief', timeSlots: ['08:00', '14:00', '20:00'] },
  { name: 'Prednisone', dosage: '5mg', purpose: 'Inflammation reduction', timeSlots: ['09:00'] }
];

const doctors = [
  'Dr. Sarah Johnson',
  'Dr. Michael Chen',
  'Dr. Emily Rodriguez',
  'Dr. James Wilson',
  'Dr. Patricia Brown',
  'Dr. David Lee',
  'Dr. Amanda Taylor',
  'Dr. Robert Martinez'
];

const sideEffects = [
  ['Mild nausea', 'Drowsiness'],
  ['Stomach upset', 'Headache'],
  ['Dizziness', 'Dry mouth'],
  ['Fatigue', 'Insomnia'],
  ['Constipation', 'Diarrhea'],
  ['Skin rash', 'Itching'],
  []
];

const vitalSigns = [
  { temperature: 98.6, heartRate: 72, bloodPressure: '120/80', respiratoryRate: 16, oxygenSaturation: 98 },
  { temperature: 99.2, heartRate: 85, bloodPressure: '125/82', respiratoryRate: 18, oxygenSaturation: 97 },
  { temperature: 98.4, heartRate: 68, bloodPressure: '118/75', respiratoryRate: 15, oxygenSaturation: 99 },
  { temperature: 100.1, heartRate: 92, bloodPressure: '130/85', respiratoryRate: 20, oxygenSaturation: 96 },
  { temperature: 97.8, heartRate: 65, bloodPressure: '115/72', respiratoryRate: 14, oxygenSaturation: 99 }
];

const triggers = [
  'Stress', 'Weather change', 'Lack of sleep', 'Dehydration', 'Physical activity',
  'Poor posture', 'Food intolerance', 'Allergens', 'Screen time', 'Cold temperature'
];

const alleviatingFactors = [
  'Rest', 'Hydration', 'Medication', 'Cold compress', 'Heat therapy',
  'Gentle stretching', 'Deep breathing', 'Massage', 'Fresh air', 'Sleep'
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function seedSymptoms() {
  try {
    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    });

    if (!user) {
      console.error('User with email test@example.com not found');
      process.exit(1);
    }

    console.log(`Found user: ${user.email} (ID: ${user.id})`);
    console.log('Creating comprehensive test data...\n');

    const yearStart = new Date('2025-01-01');
    const yearEnd = new Date('2025-12-31');
    const createdSymptoms = [];

    // ========== SEED SYMPTOMS (100 symptoms) ==========
    console.log('📋 Creating 100 symptoms with complete data...');
    
    for (let i = 0; i < 100; i++) {
      const symptomName = getRandomElement(symptomNames);
      const bodyLocation = getRandomElement(bodyLocations);
      const severity = getRandomInt(1, 10);
      const status = getRandomElement(statuses);
      const startedAt = getRandomDate(yearStart, yearEnd);
      
      // Create symptom
      const symptom = await prisma.symptom.create({
        data: {
          userId: user.id,
          symptomName,
          bodyLocation,
          severity,
          status,
          startedAt,
          createdAt: startedAt,
          updatedAt: startedAt,
        }
      });

      // Add triage assessment with comprehensive data
      const urgencyLevel = getRandomElement(urgencyLevels);
      const vitalSign = getRandomElement(vitalSigns);
      
      await prisma.triageAssessment.create({
        data: {
          symptomId: symptom.id,
          urgencyLevel,
          score: severity >= 8 ? getRandomInt(85, 100) : severity >= 5 ? getRandomInt(50, 84) : getRandomInt(10, 49),
          recommendation: `Based on severity ${severity}/10, seek ${urgencyLevel.toLowerCase().replace('_', ' ')} medical attention.`,
          redFlags: severity >= 8 ? ['High severity symptom', 'Requires immediate attention'] : severity >= 6 ? ['Monitor closely'] : [],
        }
      });

      // Add symptom details with comprehensive notes
      const characteristicOptions = ['Sharp', 'Dull', 'Throbbing', 'Burning', 'Aching', 'Stabbing', 'Cramping', 'Shooting'];
      const frequencyOptions = ['Constant', 'Intermittent', 'Occasional', 'Frequent', 'Rare'];
      
      await prisma.symptomDetail.create({
        data: {
          symptomId: symptom.id,
          notes: `${getRandomElement(notes)}. ${Math.random() > 0.5 ? 'Duration: ' + getRandomElement(['Few minutes', '30 minutes', '1-2 hours', 'Several hours', 'All day']) : ''}`,
          characteristic: getRandomElement(characteristicOptions),
          frequency: getRandomElement(frequencyOptions),
          triggers: Math.random() > 0.5 ? [getRandomElement(triggers), getRandomElement(triggers)] : [],
          alleviatingFactors: Math.random() > 0.5 ? [getRandomElement(alleviatingFactors), getRandomElement(alleviatingFactors)] : [],
        }
      });

      createdSymptoms.push({
        id: symptom.id,
        name: symptomName,
        date: startedAt.toISOString().split('T')[0],
        severity,
        status
      });

      if ((i + 1) % 25 === 0) {
        console.log(`  ✓ Created ${i + 1}/100 symptoms...`);
      }
    }

    console.log('✅ Successfully created 100 symptoms!\n');

    // ========== SEED MEDICATIONS (15 medications) ==========
    console.log('💊 Creating 15 medications with logs...');
    const createdMedications = [];

    for (let i = 0; i < medications.length; i++) {
      const medData = medications[i];
      const medicationStatus: MedicationStatus = i < 12 ? 'ACTIVE' : i === 12 ? 'PAUSED' : 'DISCONTINUED';
      const startDate = getRandomDate(new Date('2025-01-01'), new Date('2025-06-01'));
      const endDate = medicationStatus === 'DISCONTINUED' ? getRandomDate(startDate, new Date()) : null;

      const medication = await prisma.medication.create({
        data: {
          userId: user.id,
          name: medData.name,
          dosage: medData.dosage,
          frequency: medData.timeSlots.length === 1 ? 'Once daily' : 
                     medData.timeSlots.length === 2 ? 'Twice daily' : 
                     medData.timeSlots.length === 3 ? 'Three times daily' : 'As needed',
          timeSlots: medData.timeSlots,
          startDate,
          endDate,
          purpose: medData.purpose,
          prescribedBy: getRandomElement(doctors),
          sideEffects: getRandomElement(sideEffects),
          notes: `${medData.purpose}. Take with ${Math.random() > 0.5 ? 'food' : 'water'}.`,
          reminderEnabled: Math.random() > 0.3,
          status: medicationStatus,
        }
      });

      // Create medication logs for the past 30 days (only for ACTIVE medications)
      if (medicationStatus === 'ACTIVE') {
        const logsCreated = [];
        for (let dayOffset = 29; dayOffset >= 0; dayOffset--) {
          const logDate = new Date();
          logDate.setDate(logDate.getDate() - dayOffset);
          
          for (const timeSlot of medData.timeSlots) {
            const [hours, minutes] = timeSlot.split(':').map(Number);
            const scheduledTime = new Date(logDate);
            scheduledTime.setHours(hours, minutes, 0, 0);

            // Only create logs for dates after medication start date
            if (scheduledTime >= startDate) {
              // 85% taken, 10% skipped, 5% pending (for today's future doses)
              const isPending = dayOffset === 0 && scheduledTime > new Date();
              const status = isPending ? 'PENDING' : 
                           Math.random() < 0.85 ? 'TAKEN' : 
                           Math.random() < 0.67 ? 'SKIPPED' : 'MISSED';

              const takenAt = status === 'TAKEN' ? 
                new Date(scheduledTime.getTime() + getRandomInt(-15, 30) * 60000) : // Within ±15-30 min
                null;

              await prisma.medicationLog.create({
                data: {
                  medicationId: medication.id,
                  scheduledTime,
                  takenAt,
                  status,
                  notes: status === 'SKIPPED' ? 'Forgot to take' : 
                         status === 'MISSED' ? 'Was not at home' :
                         status === 'TAKEN' ? 'Taken as scheduled' : undefined,
                }
              });

              logsCreated.push(status);
            }
          }
        }

        const takenCount = logsCreated.filter(s => s === 'TAKEN').length;
        const totalCount = logsCreated.length;
        const adherenceRate = totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 0;

        createdMedications.push({
          name: medData.name,
          status: medicationStatus,
          logs: logsCreated.length,
          adherence: adherenceRate
        });
      } else {
        createdMedications.push({
          name: medData.name,
          status: medicationStatus,
          logs: 0,
          adherence: 0
        });
      }

      if ((i + 1) % 5 === 0) {
        console.log(`  ✓ Created ${i + 1}/${medications.length} medications...`);
      }
    }

    console.log('✅ Successfully created 15 medications!\n');

    // ========== SUMMARY ==========
    console.log('═══════════════════════════════════════════════════');
    console.log('📊 SEEDING SUMMARY');
    console.log('═══════════════════════════════════════════════════\n');

    console.log('🏥 SYMPTOMS DATA:');
    console.log(`  Total symptoms: ${createdSymptoms.length}`);
    console.log(`  Date range: ${createdSymptoms[0].date} to ${createdSymptoms[createdSymptoms.length - 1].date}`);
    
    const statusCounts = createdSymptoms.reduce((acc, s) => {
      acc[s.status] = (acc[s.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('\n  Status distribution:');
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`    ${status}: ${count}`);
    });

    console.log('\n  Sample symptoms:');
    createdSymptoms.slice(0, 3).forEach(s => 
      console.log(`    - ${s.name} (${s.date}) - Severity: ${s.severity}/10, Status: ${s.status}`)
    );

    console.log('\n💊 MEDICATIONS DATA:');
    console.log(`  Total medications: ${createdMedications.length}`);
    
    const medStatusCounts = createdMedications.reduce((acc, m) => {
      acc[m.status] = (acc[m.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('\n  Status distribution:');
    Object.entries(medStatusCounts).forEach(([status, count]) => {
      console.log(`    ${status}: ${count}`);
    });

    const activeMeds = createdMedications.filter(m => m.status === 'ACTIVE');
    if (activeMeds.length > 0) {
      const totalLogs = activeMeds.reduce((sum, m) => sum + m.logs, 0);
      const avgAdherence = Math.round(activeMeds.reduce((sum, m) => sum + m.adherence, 0) / activeMeds.length);
      console.log(`\n  Total medication logs created: ${totalLogs}`);
      console.log(`  Average adherence rate: ${avgAdherence}%`);
    }

    console.log('\n  Sample medications:');
    createdMedications.slice(0, 3).forEach(m => 
      console.log(`    - ${m.name} (${m.status}) - ${m.logs} logs, ${m.adherence}% adherence`)
    );

    console.log('\n═══════════════════════════════════════════════════');
    console.log('✅ SEEDING COMPLETED SUCCESSFULLY!');
    console.log('═══════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedSymptoms();
