const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('./config/db');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Forbidden' });
    req.user = user;
    next();
  });
};

// Routes
// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    
    // Check if user already exists
    const [existingUsers] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert user
    const [result] = await db.execute(
      'INSERT INTO users (email, password, first_name, last_name) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, firstName, lastName]
    );
    
    // Generate token
    const token = jwt.sign({ id: result.insertId, email }, process.env.JWT_SECRET, { expiresIn: '24h' });
    
    res.status(201).json({ 
      token,
      user: {
        id: result.insertId,
        email,
        firstName,
        lastName
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const user = users[0];
    
    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
    
    res.json({ 
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Grocery routes
// Public routes (no authentication required)
app.get('/api/grocery/categories', authenticateToken, async (req, res) => {
  try {
    const [categories] = await db.execute('SELECT * FROM grocery_categories');
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Protected routes (authentication required)
app.get('/api/grocery/items', authenticateToken, async (req, res) => {
  try {
    const [items] = await db.execute(`
      SELECT i.*, c.name as category_name 
      FROM grocery_items i 
      LEFT JOIN grocery_categories c ON i.category_id = c.id 
      WHERE i.user_id = ?
    `, [req.user.id]);
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/grocery/items', authenticateToken, async (req, res) => {
  try {
    const { name, category_id, purchase_date, expiry_date, quantity, notes } = req.body;
    
    const [result] = await db.execute(
      'INSERT INTO grocery_items (name, category_id, purchase_date, expiry_date, quantity, notes, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, category_id, purchase_date, expiry_date, quantity, notes, req.user.id]
    );
    
    res.status(201).json({ 
      id: result.insertId,
      name,
      category_id,
      purchase_date,
      expiry_date,
      quantity,
      notes
    });
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/grocery/items/:id', authenticateToken, async (req, res) => {
  try {
    const itemId = req.params.id;
    const { 
      name, 
      expiry_date, 
      category_id, 
      quantity, 
      purchase_date, 
      notes,
      is_consumed,
      consumed_date
    } = req.body;
    
    // Check if item belongs to user
    const [items] = await db.execute(
      'SELECT * FROM grocery_items WHERE id = ? AND user_id = ?',
      [itemId, req.user.id]
    );
    
    if (items.length === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    // Format dates to YYYY-MM-DD
    const formattedExpiryDate = expiry_date ? new Date(expiry_date).toISOString().split('T')[0] : null;
    const formattedPurchaseDate = purchase_date ? new Date(purchase_date).toISOString().split('T')[0] : null;
    const formattedConsumedDate = consumed_date ? new Date(consumed_date).toISOString().split('T')[0] : null;
    
    await db.execute(
      `UPDATE grocery_items SET 
       name = ?, 
       expiry_date = ?, 
       category_id = ?, 
       quantity = ?, 
       purchase_date = ?, 
       notes = ?,
       is_consumed = ?,
       consumed_date = ?,
       updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        name, 
        formattedExpiryDate, 
        category_id, 
        quantity, 
        formattedPurchaseDate, 
        notes,
        is_consumed ? 1 : 0,
        formattedConsumedDate,
        itemId
      ]
    );
    
    // Get the updated item with category details
    const [updatedItems] = await db.execute(
      `SELECT gi.*, gc.name as category_name, gc.icon, gc.color 
       FROM grocery_items gi 
       LEFT JOIN grocery_categories gc ON gi.category_id = gc.id 
       WHERE gi.id = ?`,
      [itemId]
    );
    
    res.json(updatedItems[0]);
  } catch (error) {
    console.error('Error updating grocery item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/grocery/items/:id', authenticateToken, async (req, res) => {
  try {
    const itemId = req.params.id;
    
    // Check if item belongs to user
    const [items] = await db.execute(
      'SELECT * FROM grocery_items WHERE id = ? AND user_id = ?',
      [itemId, req.user.id]
    );
    
    if (items.length === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    await db.execute('DELETE FROM grocery_items WHERE id = ?', [itemId]);
    
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting grocery item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Dashboard stats
app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    // Get total grocery items
    const [groceryItems] = await db.execute(
      'SELECT COUNT(*) as count FROM grocery_items WHERE user_id = ?',
      [req.user.id]
    );
    
    // Get expiring items (within 3 days)
    const [expiringItems] = await db.execute(
      'SELECT COUNT(*) as count FROM grocery_items WHERE user_id = ? AND expiry_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 3 DAY) AND is_consumed = 0',
      [req.user.id]
    );
    
    // Get expired items
    const [expiredItems] = await db.execute(
      'SELECT COUNT(*) as count FROM grocery_items WHERE user_id = ? AND expiry_date < CURDATE() AND is_consumed = 0',
      [req.user.id]
    );
    
    // Get consumed items
    const [consumedItems] = await db.execute(
      'SELECT COUNT(*) as count FROM grocery_items WHERE user_id = ? AND is_consumed = 1',
      [req.user.id]
    );
    
    res.json({
      groceryItems: groceryItems[0].count,
      expiringItems: expiringItems[0].count,
      expiredItems: expiredItems[0].count,
      consumedItems: consumedItems[0].count
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Recent activity
app.get('/api/dashboard/activity', authenticateToken, async (req, res) => {
  try {
    // Get recent grocery items
    const [recentItems] = await db.execute(
      `SELECT gi.id, gi.name, gi.created_at, 'added' as action, gc.name as category
       FROM grocery_items gi
       LEFT JOIN grocery_categories gc ON gi.category_id = gc.id
       WHERE gi.user_id = ?
       ORDER BY gi.created_at DESC
       LIMIT 5`,
      [req.user.id]
    );
    
    // Get recently consumed items
    const [consumedItems] = await db.execute(
      `SELECT gi.id, gi.name, gi.consumed_date as created_at, 'consumed' as action, gc.name as category
       FROM grocery_items gi
       LEFT JOIN grocery_categories gc ON gi.category_id = gc.id
       WHERE gi.user_id = ? AND gi.is_consumed = 1
       ORDER BY gi.consumed_date DESC
       LIMIT 5`,
      [req.user.id]
    );
    
    // Combine and sort
    const activities = [...recentItems, ...consumedItems]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5);
    
    res.json(activities);
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 