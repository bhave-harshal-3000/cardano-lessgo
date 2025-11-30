import mongoose from 'mongoose';
import Budget from '../models/Budget.js';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// Sample user IDs
const USER_IDS = [
  '692ac9d28f0ec1b798d497b0',
  '692b0fde18cc3700664fa995',
  '692b175b80fe907e83284926'
];

// Sample goals for each user
const SAMPLE_GOALS = [
  // User 1
  [
    {
      userId: USER_IDS[0],
      goalName: 'Gaming Laptop',
      category: 'gadget',
      targetAmount: 80000,
      currentSavings: 15000,
      deadline: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000), // 6 months from now
      priority: 'high',
      status: 'active'
    },
    {
      userId: USER_IDS[0],
      goalName: 'Mountain Bike',
      category: 'vehicle',
      targetAmount: 50000,
      currentSavings: 8000,
      deadline: new Date(Date.now() + 4 * 30 * 24 * 60 * 60 * 1000), // 4 months from now
      priority: 'medium',
      status: 'active'
    }
  ],
  // User 2
  [
    {
      userId: USER_IDS[1],
      goalName: 'Gold Watch',
      category: 'luxury',
      targetAmount: 25000,
      currentSavings: 5000,
      deadline: new Date(Date.now() + 2 * 30 * 24 * 60 * 60 * 1000), // 2 months from now
      priority: 'high',
      status: 'active'
    },
    {
      userId: USER_IDS[1],
      goalName: 'Japan Trip',
      category: 'travel',
      targetAmount: 200000,
      currentSavings: 45000,
      deadline: new Date(Date.now() + 10 * 30 * 24 * 60 * 60 * 1000), // 10 months from now
      priority: 'medium',
      status: 'active'
    }
  ],
  // User 3
  [
    {
      userId: USER_IDS[2],
      goalName: 'iPhone 15 Pro',
      category: 'gadget',
      targetAmount: 130000,
      currentSavings: 30000,
      deadline: new Date(Date.now() + 3 * 30 * 24 * 60 * 60 * 1000), // 3 months from now
      priority: 'high',
      status: 'active'
    },
    {
      userId: USER_IDS[2],
      goalName: 'Advanced Course',
      category: 'education',
      targetAmount: 45000,
      currentSavings: 10000,
      deadline: new Date(Date.now() + 5 * 30 * 24 * 60 * 60 * 1000), // 5 months from now
      priority: 'medium',
      status: 'active'
    }
  ]
];

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing budgets
    await Budget.deleteMany({
      userId: { $in: USER_IDS }
    });
    console.log('✅ Cleared existing budget goals');

    // Insert sample goals
    let totalInserted = 0;
    for (let i = 0; i < SAMPLE_GOALS.length; i++) {
      const goals = SAMPLE_GOALS[i];
      const result = await Budget.insertMany(goals);
      totalInserted += result.length;
      console.log(`✅ Added ${result.length} goals for user ${USER_IDS[i]}`);
    }

    console.log(`\n✅ Successfully seeded ${totalInserted} budget goals!\n`);

    // Display endpoint info
    console.log('📍 ENDPOINTS:');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('\n1. Get budget goals for a user:');
    console.log('   GET /api/budget-plan/user/:userId');
    console.log('\n   Examples:');
    USER_IDS.forEach(id => {
      console.log(`   GET /api/budget-plan/user/${id}`);
    });

    console.log('\n2. Generate AI plan for user:');
    console.log('   GET /api/budget-plan/:userId');
    console.log('\n   Examples:');
    USER_IDS.forEach(id => {
      console.log(`   GET /api/budget-plan/${id}`);
    });

    console.log('\n3. Create new budget goal (POST):');
    console.log('   POST /api/budget-plan');
    console.log('\n   Body: {');
    console.log('     "userId": "user_id_here",');
    console.log('     "goalName": "Watch",');
    console.log('     "category": "gadget|vehicle|travel|education|luxury|other",');
    console.log('     "targetAmount": 6000,');
    console.log('     "deadline": "2025-12-30",');
    console.log('     "priority": "high|medium|low"');
    console.log('   }');

    console.log('\n4. Update savings for a goal (PUT):');
    console.log('   PUT /api/budget-plan/:goalId');
    console.log('\n   Body: {');
    console.log('     "currentSavings": 3000');
    console.log('   }');

    console.log('\n═══════════════════════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
