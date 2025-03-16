const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

// Load environment variables
dotenv.config();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory');
}

async function setupDatabase() {
  let connection;
  try {
    // First connect without database to create it if needed
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS
    });
    
    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    
    // Close initial connection
    await connection.end();
    
    // Connect with database selected
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      multipleStatements: true
    });
    
    console.log('Connected to MySQL server');
    
    // Read SQL file
    const sql = fs.readFileSync(path.join(__dirname, '..', 'tracked_db_setup.sql'), 'utf8');
    
    // Execute SQL statements
    await connection.query(sql);
    console.log('Database setup completed');
    
    // Check if admin user exists
    const [users] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      ['admin@tracked.com']
    );
    
    if (users.length === 0) {
      // Create admin user
      const hashedPassword = await bcrypt.hash('password', 10);
      await connection.execute(
        'INSERT INTO users (email, password, first_name, last_name) VALUES (?, ?, ?, ?)',
        ['admin@tracked.com', hashedPassword, 'Admin', 'User']
      );
      console.log('Created admin user');
    } else {
      console.log('Admin user already exists');
    }
    
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  } finally {
    if (connection) {
      // Close connection
      await connection.end();
      console.log('Database connection closed');
    }
    process.exit(0);
  }
}

setupDatabase(); 