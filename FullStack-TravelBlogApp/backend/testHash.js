const bcrypt = require('bcrypt');

async function testHash() {
  const password = '12345678910';
  const hash = await bcrypt.hash(password, 10);
  console.log('Generated hash:', hash);
  
  const match = await bcrypt.compare(password, hash);
  console.log('Password match:', match);
  
  // Test with the hash from database
  const dbHash = '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';
  const dbMatch = await bcrypt.compare(password, dbHash);
  console.log('Database hash match:', dbMatch);
}

testHash().catch(console.error); 