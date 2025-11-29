import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const inspectDatabase = async () => {
  try {
    console.log('🔍 Connecting to MongoDB...\n');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    console.log('╔════════════════════════════════════════════════════╗');
    console.log('║          MONGODB DATABASE STRUCTURE                ║');
    console.log('╚════════════════════════════════════════════════════╝\n');

    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      const collection = db.collection(collectionName);

      console.log(`\n📊 Collection: "${collectionName}"`);
      console.log('─'.repeat(60));

      // Get document count
      const docCount = await collection.countDocuments();
      console.log(`   Documents: ${docCount}`);

      if (docCount > 0) {
        // Get sample document to show schema
        const sampleDoc = await collection.findOne();
        
        console.log(`\n   Schema/Fields:`);
        if (sampleDoc) {
          const fields = Object.keys(sampleDoc);
          fields.forEach((field, index) => {
            const value = sampleDoc[field];
            let type = typeof value;
            
            if (value === null) {
              type = 'null';
            } else if (Array.isArray(value)) {
              type = 'array';
            } else if (value instanceof mongoose.Types.ObjectId) {
              type = 'ObjectId';
            } else if (value instanceof Date) {
              type = 'Date';
            } else if (typeof value === 'object') {
              type = 'object';
            }
            
            console.log(`      • ${field.padEnd(25)} : ${type}`);
          });
        }

        // Show sample data
        console.log(`\n   Sample Document:`);
        console.log(`   ${JSON.stringify(sampleDoc, null, 2)
          .split('\n')
          .map(line => '   ' + line)
          .join('\n')}`);
      } else {
        console.log(`   (No documents in this collection)`);
      }

      console.log('');
    }

    console.log('\n╔════════════════════════════════════════════════════╗');
    console.log('║                 SUMMARY                            ║');
    console.log('╚════════════════════════════════════════════════════╝\n');
    console.log(`Total Collections: ${collections.length}`);
    console.log(`Collections: ${collections.map(c => c.name).join(', ')}\n`);

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

inspectDatabase();
