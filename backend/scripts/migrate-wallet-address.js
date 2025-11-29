import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';

dotenv.config();

const migrateWalletAddresses = async () => {
  try {
    // Connect to MongoDB
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable not set');
    }

    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get all transactions without walletAddress
    const transactionsWithoutWallet = await Transaction.find({ 
      walletAddress: { $in: [null, undefined, ''] }
    });

    console.log(`\n📊 Found ${transactionsWithoutWallet.length} transactions without wallet address`);

    if (transactionsWithoutWallet.length === 0) {
      console.log('✅ All transactions already have wallet addresses!');
      await mongoose.connection.close();
      process.exit(0);
    }

    // Process transactions in batches
    const batchSize = 100;
    let updated = 0;
    let failed = 0;

    for (let i = 0; i < transactionsWithoutWallet.length; i += batchSize) {
      const batch = transactionsWithoutWallet.slice(i, i + batchSize);
      
      for (const transaction of batch) {
        try {
          // Fetch the user to get their wallet address
          const user = await User.findById(transaction.userId);
          
          if (user && user.walletAddress) {
            transaction.walletAddress = user.walletAddress;
            await transaction.save();
            updated++;
            console.log(`✅ Updated transaction ${transaction._id} with wallet: ${user.walletAddress}`);
          } else {
            console.log(`⚠️  User ${transaction.userId} has no wallet address for transaction ${transaction._id}`);
            failed++;
          }
        } catch (error) {
          console.error(`❌ Error updating transaction ${transaction._id}:`, error.message);
          failed++;
        }
      }

      console.log(`\n📈 Progress: ${Math.min(i + batchSize, transactionsWithoutWallet.length)}/${transactionsWithoutWallet.length}`);
    }

    console.log(`\n📋 Migration Summary:`);
    console.log(`   ✅ Updated: ${updated}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   📊 Total: ${updated + failed}`);

    await mongoose.connection.close();
    console.log('\n✅ Migration complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

migrateWalletAddresses();
