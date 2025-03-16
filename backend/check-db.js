const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkDatabase() {
  let connection;
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    });
    
    console.log('\n=== Database Connection Info ===');
    console.log('Host:', process.env.DB_HOST);
    console.log('Database:', process.env.DB_NAME);
    console.log('User:', process.env.DB_USER);

    // Get list of tables
    console.log('\n=== Tables in Database ===');
    const [tables] = await connection.execute('SHOW TABLES');
    tables.forEach(table => {
      console.log('-', Object.values(table)[0]);
    });

    // Check grocery_categories table
    console.log('\n=== Grocery Categories ===');
    const [categories] = await connection.execute('SELECT * FROM grocery_categories');
    if (categories.length === 0) {
      console.log('No categories found');
    } else {
      console.table(categories);
    }

    // Check grocery_items table
    console.log('\n=== Grocery Items ===');
    const [items] = await connection.execute(`
      SELECT i.*, c.name as category_name 
      FROM grocery_items i 
      LEFT JOIN grocery_categories c ON i.category_id = c.id
    `);
    if (items.length === 0) {
      console.log('No items found');
    } else {
      console.table(items);
    }

    // Check users table
    console.log('\n=== Users ===');
    const [users] = await connection.execute('SELECT id, email, first_name, last_name, created_at FROM users');
    if (users.length === 0) {
      console.log('No users found');
    } else {
      console.table(users);
    }

  } catch (error) {
    console.error('\nError checking database:');
    console.error('Message:', error.message);
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\nAccess denied. Please check your database credentials in the .env file.');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\nCannot connect to database. Please make sure MySQL is running.');
    }
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

checkDatabase(); 