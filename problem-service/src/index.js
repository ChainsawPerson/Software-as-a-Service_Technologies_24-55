require('dotenv').config(); // Load environment variables
const pool = require('./db');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const problemRoutes = require('./routes/problems'); // Ensure this path is correct
// const pool = require('./db'); // Import your database pool setup

const app = express();
const port = process.env.PORT || 3003; // Ensure the port is correctly set to 3003 or your chosen port

// Enable CORS with specific settings
app.use(cors({
  origin: 'http://localhost:3006', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Use body-parser middleware
app.use(bodyParser.json());

// Define routes
app.use('/problems', problemRoutes);

// Check database connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('PostgreSQL connected');
  release(); // Release the client back to the pool
});

// Test the database connection with a simple query
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error executing query', err.stack);
  } else {
    console.log('Database connected:', res.rows[0]);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Problem service running on port ${port}`);
});
