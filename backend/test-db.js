const db = require('./config/db');

async function testConnection() {
  try {
    const connection = await db.getConnection();
    console.log('Successfully connected to the database!');
    connection.release();
    
    // Test query
    const [rows] = await db.execute('SELECT 1 + 1 AS result');
    console.log('Test query result:', rows[0].result);
    
    process.exit(0);
  } catch (error) {
    console.error('Database connection failed:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  }
}

testConnection();