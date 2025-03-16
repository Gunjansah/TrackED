# TrackED -  A Comprehensive Multi-Purpose Tracking System 

TrackED is a comprehensive life tracking application that helps you organize and monitor various aspects of your life, including groceries, medications, expenses, fitness, tasks, subscriptions, and documents.

## Features

- **Authentication**: Secure login and registration system
- **Dashboard**: Overview of all tracking modules with statistics and recent activity
- **Grocery Tracker**: Track grocery items, expiry dates, and consumption
- **Trackers Coming Soon**: Medication Tracker, Expense Tracker, Fitness Tracker, Task Tracker, Subscription Tracker, and Document Tracker

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8 or higher)

## Setup

### Database Setup

1. Make sure MySQL is installed and running
2. Update the database credentials in `backend/.env` file:

```
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASS=your_mysql_password
DB_NAME=tracked_db
JWT_SECRET=your_jwt_secret_key
PORT=3000
```

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Run the setup script to create the database and tables:

```bash
npm run setup
```

4. Start the backend server:

```bash
npm start
```

The backend server will run on http://localhost:3000.

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the frontend development server:

```bash
npm run serve
```

The frontend application will run on http://localhost:8080.

## Default Login Credentials

- Email: admin@tracked.com
- Password: password

## Project Structure

- `backend/`: Node.js/Express.js backend API
  - `config/`: Configuration files
  - `uploads/`: Directory for uploaded files
  - `index.js`: Main server file
  - `setup.js`: Database setup script
- `frontend/`: Vue.js frontend application
  - `src/`: Source code
    - `assets/`: Static assets (CSS, images)
    - `components/`: Vue components
    - `layouts/`: Layout components
    - `router/`: Vue Router configuration
    - `services/`: API services
    - `views/`: Vue views/pages
  - `public/`: Public static files
- `tracked_db_setup.sql`: SQL script for database setup

## Technologies Used

### Backend
- Node.js
- Express.js
- MySQL
- JSON Web Tokens (JWT)
- bcrypt

### Frontend
- Vue.js 3
- Vue Router
- Axios
- Bootstrap 5
- Font Awesome
- Chart.js
