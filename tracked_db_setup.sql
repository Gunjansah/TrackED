-- Drop tables if they exist
DROP TABLE IF EXISTS grocery_notifications;
DROP TABLE IF EXISTS grocery_shopping_list_items;
DROP TABLE IF EXISTS grocery_shopping_lists;
DROP TABLE IF EXISTS grocery_items;
DROP TABLE IF EXISTS grocery_categories;
DROP TABLE IF EXISTS users;

-- Create tables
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  profile_image VARCHAR(255),
  settings JSON,
  INDEX idx_email (email)
);

CREATE TABLE grocery_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  icon VARCHAR(50),
  color VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE grocery_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  expiry_date DATE NOT NULL,
  category_id INT,
  quantity INT DEFAULT 1,
  quantity_unit VARCHAR(50),
  purchase_date DATE,
  price DECIMAL(10,2),
  barcode VARCHAR(100),
  image_path VARCHAR(255),
  notes TEXT,
  is_consumed BOOLEAN DEFAULT FALSE,
  consumed_date DATE,
  is_wasted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES grocery_categories(id) ON DELETE SET NULL,
  INDEX idx_user_expiry (user_id, expiry_date),
  INDEX idx_barcode (barcode)
);

CREATE TABLE grocery_shopping_lists (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_default (user_id, is_default)
);

CREATE TABLE grocery_shopping_list_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  list_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  quantity INT DEFAULT 1,
  quantity_unit VARCHAR(50),
  category_id INT,
  is_purchased BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (list_id) REFERENCES grocery_shopping_lists(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES grocery_categories(id) ON DELETE SET NULL,
  INDEX idx_list_purchased (list_id, is_purchased)
);

CREATE TABLE grocery_notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  item_id INT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  notification_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES grocery_items(id) ON DELETE SET NULL,
  INDEX idx_user_read (user_id, is_read)
);

-- Insert default categories
INSERT INTO grocery_categories (name, icon, color) VALUES 
('Dairy', 'milk', '#f5f5dc'),
('Fruits', 'apple', '#ff6347'),
('Vegetables', 'carrot', '#90ee90'),
('Meat', 'meat', '#cd5c5c'),
('Seafood', 'fish', '#add8e6'),
('Bakery', 'bread', '#d2b48c'),
('Frozen', 'snow', '#e0ffff'),
('Canned', 'can', '#d3d3d3'),
('Beverages', 'bottle', '#e6e6fa'),
('Snacks', 'cookie', '#ffa07a'),
('Condiments', 'sauce', '#ffff00'),
('Other', 'box', '#c0c0c0');