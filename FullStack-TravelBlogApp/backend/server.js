const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Create Express server
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
const connection = mysql.createConnection({
  host: 'webcourse.cs.nuim.ie',
  user: 'u240209',
  password: 'Uey9ooth0phee0ah',
  database: 'cs230_u240209',
  connectTimeout: 10000, // 10 seconds
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Function to handle database connection
function handleDisconnect() {
  connection.connect(err => {
    if (err) {
      console.error('Error connecting to MySQL database: ', err);
      // Try to reconnect after 2 seconds
      setTimeout(handleDisconnect, 2000);
      return;
    }
    console.log('Connected to MySQL database');
    
    // Set up database tables on server start
    setupDatabase();
  });

  connection.on('error', err => {
    console.error('Database error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.log('Database connection was closed. Reconnecting...');
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

// Initial connection
handleDisconnect();

// Make the connection available globally
global.connection = connection;

// Function to set up database tables
function setupDatabase() {
  try {
    console.log('Forcing database reset...');
    
    // Drop tables one by one
    const dropQueries = [
      'DROP TABLE IF EXISTS journey_plans',
      'DROP TABLE IF EXISTS travel_logs',
      'DROP TABLE IF EXISTS users'
    ];
    
    // Execute drop queries sequentially
    const executeDropQueries = (index) => {
      if (index >= dropQueries.length) {
        console.log('All tables dropped successfully');
        setupTables();
        return;
      }
      
      connection.query(dropQueries[index], (err) => {
        if (err) {
          console.error(`Error dropping table: ${dropQueries[index]}`, err);
          return;
        }
        console.log(`Successfully dropped: ${dropQueries[index]}`);
        executeDropQueries(index + 1);
      });
    };
    
    // Function to set up new tables
    const setupTables = () => {
      const sqlScript = fs.readFileSync(path.join(__dirname, 'database_setup.sql'), 'utf8');
      const statements = sqlScript.split(';').filter(statement => statement.trim() !== '');
      
      statements.forEach(statement => {
        connection.query(statement, (err, results) => {
          if (err) {
            console.error(`Error executing SQL: ${statement.substring(0, 50)}...`);
            console.error(err);
          } else {
            console.log(`Successfully executed: ${statement.substring(0, 50)}...`);
          }
        });
      });
      
      console.log('Database setup complete with new test user!');
    };
    
    // Start dropping tables
    executeDropQueries(0);
    
  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

// Import routes
const authRoutes = require('./routes/authRoutes');
const travelLogRoutes = require('./routes/travelLogRoutes');
const journeyPlanRoutes = require('./routes/journeyPlanRoutes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/travel-logs', travelLogRoutes);
app.use('/api/journey-plans', journeyPlanRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Travel Blog API is running');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 