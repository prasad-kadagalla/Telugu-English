const { MongoMemoryServer } = require('mongodb-memory-server');
const fs = require('fs');
const path = require('path');

async function run() {
  const dbPath = path.join(__dirname, 'mongodb_data');
  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath);
  }

  console.log('Starting MongoDB Local Server...');
  const mongod = await MongoMemoryServer.create({
    instance: {
      port: 27017,
      dbName: 'telugu_english_db',
      dbPath: dbPath,
    }
  });

  console.log(`\n✅ MongoDB Local Server started successfully!`);
  console.log(`🔗 URI:  ${mongod.getUri()}`);
  console.log(`📁 Data: ${dbPath}`);
  console.log(`Press Ctrl+C to stop the database.\n`);

  process.on('SIGINT', async () => {
    console.log('\nStopping MongoDB Local Server...');
    await mongod.stop();
    process.exit(0);
  });
}

run().catch(err => {
  console.error('Failed to start MongoDB Local Server:', err);
  process.exit(1);
});
