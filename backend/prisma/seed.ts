import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Create a test user
  const hashedPassword = await bcrypt.hash('Test123!', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      passwordHash: hashedPassword,
      name: 'Test User',
      dateOfBirth: new Date('1990-01-01'),
      profile: {
        create: {
          medicalConditions: ['Hypertension'],
          allergies: ['Penicillin'],
          currentMedications: ['Lisinopril 10mg'],
          bloodType: 'O+',
          height: 175.0,
          weight: 70.0,
        },
      },
    },
  });

  console.log(`✅ Created user: ${user.email}\n`);

  // Symptom templates with realistic data
  const symptomTemplates = [
    // Critical symptoms
    {
      symptomName: 'Severe Chest Pain',
      bodyLocation: 'Center of chest',
      severity: 9,
      startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      status: 'ACTIVE' as const,
      detail: {
        characteristic: 'crushing, radiating to left arm',
        frequency: 'constant',
        triggers: ['exertion'],
        alleviatingFactors: [],
        aggravatingFactors: ['movement', 'deep breathing'],
        notes: 'Pain started suddenly, accompanied by sweating',
        heartRate: 105,
        bloodPressure: '145/95',
      },
    },
    {
      symptomName: 'Difficulty Breathing',
      bodyLocation: 'Chest',
      severity: 8,
      startedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      status: 'ACTIVE' as const,
      detail: {
        characteristic: 'shortness of breath',
        frequency: 'constant',
        triggers: ['minimal exertion'],
        alleviatingFactors: ['sitting upright'],
        aggravatingFactors: ['lying down', 'walking'],
        notes: 'Gradually worsening throughout the day',
        heartRate: 98,
        bloodPressure: '140/90',
      },
    },
    {
      symptomName: 'Severe Headache',
      bodyLocation: 'Entire head',
      severity: 9,
      startedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      status: 'ACTIVE' as const,
      detail: {
        characteristic: 'thunderclap, worst headache ever',
        frequency: 'constant',
        triggers: ['sudden onset'],
        alleviatingFactors: [],
        aggravatingFactors: ['light', 'sound'],
        notes: 'Accompanied by stiff neck and sensitivity to light',
        temperature: 38.5,
      },
    },
    // High priority symptoms
    {
      symptomName: 'High Fever',
      bodyLocation: 'Whole body',
      severity: 7,
      startedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      status: 'ACTIVE' as const,
      detail: {
        characteristic: 'persistent fever',
        frequency: 'constant',
        triggers: [],
        alleviatingFactors: ['acetaminophen'],
        aggravatingFactors: [],
        notes: 'Fever not responding well to medication',
        temperature: 39.8,
        heartRate: 110,
      },
    },
    {
      symptomName: 'Severe Abdominal Pain',
      bodyLocation: 'Lower right abdomen',
      severity: 8,
      startedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      status: 'ACTIVE' as const,
      detail: {
        characteristic: 'sharp, stabbing',
        frequency: 'constant',
        triggers: ['movement'],
        alleviatingFactors: ['staying still'],
        aggravatingFactors: ['coughing', 'walking', 'touch'],
        notes: 'Pain has been steadily increasing, accompanied by nausea',
        temperature: 38.2,
      },
    },
    {
      symptomName: 'Persistent Vomiting',
      bodyLocation: 'Stomach',
      severity: 6,
      startedAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      status: 'ACTIVE' as const,
      detail: {
        characteristic: 'cannot keep anything down',
        frequency: 'every 30 minutes',
        triggers: ['eating', 'drinking'],
        alleviatingFactors: [],
        aggravatingFactors: ['any food or liquid'],
        notes: 'Started after eating seafood, feeling dehydrated',
      },
    },
    // Medium severity symptoms
    {
      symptomName: 'Migraine',
      bodyLocation: 'Left side of head',
      severity: 7,
      startedAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      status: 'ACTIVE' as const,
      detail: {
        characteristic: 'throbbing, pulsating',
        frequency: 'constant',
        triggers: ['bright lights', 'stress'],
        alleviatingFactors: ['dark room', 'quiet'],
        aggravatingFactors: ['movement', 'noise', 'light'],
        notes: 'Classic migraine symptoms with visual aura',
      },
    },
    {
      symptomName: 'Back Pain',
      bodyLocation: 'Lower back',
      severity: 6,
      startedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      status: 'IMPROVING' as const,
      detail: {
        characteristic: 'dull, aching',
        frequency: 'constant',
        triggers: ['sitting too long'],
        alleviatingFactors: ['heat', 'stretching'],
        aggravatingFactors: ['bending', 'lifting'],
        notes: 'Pain started after moving furniture',
      },
    },
    {
      symptomName: 'Sore Throat',
      bodyLocation: 'Throat',
      severity: 5,
      startedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      status: 'IMPROVING' as const,
      detail: {
        characteristic: 'scratchy, painful',
        frequency: 'constant',
        triggers: ['swallowing'],
        alleviatingFactors: ['warm tea', 'lozenges'],
        aggravatingFactors: ['talking', 'cold drinks'],
        notes: 'Started with cold symptoms',
        temperature: 37.8,
      },
    },
    {
      symptomName: 'Cough',
      bodyLocation: 'Chest',
      severity: 4,
      startedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      status: 'IMPROVING' as const,
      detail: {
        characteristic: 'dry, persistent',
        frequency: 'intermittent',
        triggers: ['talking', 'cold air'],
        alleviatingFactors: ['cough syrup', 'honey'],
        aggravatingFactors: ['lying down'],
        notes: 'Lingering cough from recent cold',
      },
    },
    // Resolved symptoms
    {
      symptomName: 'Headache',
      bodyLocation: 'Forehead',
      severity: 4,
      startedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      endedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
      status: 'RESOLVED' as const,
      detail: {
        characteristic: 'tension, tight',
        frequency: 'constant',
        triggers: ['stress', 'lack of sleep'],
        alleviatingFactors: ['ibuprofen', 'rest'],
        aggravatingFactors: ['screen time'],
        notes: 'Resolved with rest and pain medication',
      },
    },
    {
      symptomName: 'Nausea',
      bodyLocation: 'Stomach',
      severity: 5,
      startedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      endedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), // 9 days ago
      status: 'RESOLVED' as const,
      detail: {
        characteristic: 'queasy feeling',
        frequency: 'intermittent',
        triggers: ['certain foods'],
        alleviatingFactors: ['ginger tea', 'rest'],
        aggravatingFactors: ['movement'],
        notes: 'Food-related nausea, resolved after 24 hours',
      },
    },
    {
      symptomName: 'Fatigue',
      bodyLocation: 'Whole body',
      severity: 6,
      startedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
      endedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      status: 'RESOLVED' as const,
      detail: {
        characteristic: 'extreme tiredness',
        frequency: 'constant',
        triggers: ['viral infection'],
        alleviatingFactors: ['sleep', 'rest'],
        aggravatingFactors: ['activity'],
        notes: 'Post-viral fatigue, gradually improved',
      },
    },
    {
      symptomName: 'Runny Nose',
      bodyLocation: 'Nose',
      severity: 3,
      startedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
      endedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      status: 'RESOLVED' as const,
      detail: {
        characteristic: 'clear discharge',
        frequency: 'constant',
        triggers: ['cold weather'],
        alleviatingFactors: ['decongestant'],
        aggravatingFactors: [],
        notes: 'Common cold symptom, resolved naturally',
      },
    },
    {
      symptomName: 'Muscle Soreness',
      bodyLocation: 'Legs',
      severity: 5,
      startedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
      endedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      status: 'RESOLVED' as const,
      detail: {
        characteristic: 'aching, stiff',
        frequency: 'constant',
        triggers: ['intense workout'],
        alleviatingFactors: ['stretching', 'massage'],
        aggravatingFactors: ['movement'],
        notes: 'DOMS (delayed onset muscle soreness) after gym',
      },
    },
    // Additional varied symptoms
    {
      symptomName: 'Dizziness',
      bodyLocation: 'Head',
      severity: 6,
      startedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      status: 'ACTIVE' as const,
      detail: {
        characteristic: 'lightheaded, spinning sensation',
        frequency: 'intermittent',
        triggers: ['standing up quickly'],
        alleviatingFactors: ['lying down'],
        aggravatingFactors: ['standing', 'walking'],
        notes: 'Episodes of vertigo when changing positions',
        bloodPressure: '100/65',
      },
    },
    {
      symptomName: 'Rash',
      bodyLocation: 'Arms and torso',
      severity: 4,
      startedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      status: 'MONITORING' as const,
      detail: {
        characteristic: 'red, itchy bumps',
        frequency: 'constant',
        triggers: ['new laundry detergent'],
        alleviatingFactors: ['antihistamine cream'],
        aggravatingFactors: ['scratching', 'hot water'],
        notes: 'Possible allergic reaction to new product',
      },
    },
    {
      symptomName: 'Joint Pain',
      bodyLocation: 'Right knee',
      severity: 5,
      startedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      status: 'MONITORING' as const,
      detail: {
        characteristic: 'stiff, swollen',
        frequency: 'constant',
        triggers: ['running'],
        alleviatingFactors: ['ice', 'rest'],
        aggravatingFactors: ['stairs', 'exercise'],
        notes: 'Possible overuse injury from running',
      },
    },
    {
      symptomName: 'Insomnia',
      bodyLocation: 'Whole body',
      severity: 6,
      startedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      status: 'ACTIVE' as const,
      detail: {
        characteristic: 'difficulty falling asleep',
        frequency: 'nightly',
        triggers: ['stress', 'anxiety'],
        alleviatingFactors: ['meditation', 'chamomile tea'],
        aggravatingFactors: ['caffeine', 'screen time'],
        notes: 'Sleep difficulties for the past week',
      },
    },
    {
      symptomName: 'Ear Pain',
      bodyLocation: 'Left ear',
      severity: 5,
      startedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      status: 'WORSENING' as const,
      detail: {
        characteristic: 'sharp, throbbing',
        frequency: 'constant',
        triggers: ['touching ear'],
        alleviatingFactors: ['warm compress'],
        aggravatingFactors: ['cold air', 'pressure'],
        notes: 'Pain increasing, possible ear infection',
        temperature: 37.9,
      },
    },
  ];

  console.log(`Creating ${symptomTemplates.length} symptoms...\n`);

  for (const template of symptomTemplates) {
    const { detail, ...symptomData } = template;
    
    const symptom = await prisma.symptom.create({
      data: {
        ...symptomData,
        userId: user.id,
        details: detail ? {
          create: detail,
        } : undefined,
      },
    });

    console.log(`✅ Created: ${symptom.symptomName} (${symptom.status})`);
  }

  console.log(`\n✨ Seed completed! Created ${symptomTemplates.length} symptoms for ${user.email}`);
  console.log(`\n📝 Login credentials:`);
  console.log(`   Email: test@example.com`);
  console.log(`   Password: Test123!`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
