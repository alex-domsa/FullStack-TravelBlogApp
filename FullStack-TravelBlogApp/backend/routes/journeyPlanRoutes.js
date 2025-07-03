const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, 'your-secret-key'); // Replace with the same secret key used in authRoutes
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Get all journey plans for the authenticated user
router.get('/', verifyToken, (req, res) => {
  const query = 'SELECT * FROM journey_plans WHERE user_id = ?';
  connection.query(query, [req.userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Get a specific journey plan
router.get('/:id', verifyToken, (req, res) => {
  const query = 'SELECT * FROM journey_plans WHERE id = ? AND user_id = ?';
  connection.query(query, [req.params.id, req.userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Journey plan not found' });
    }
    res.json(results[0]);
  });
});

// Create a new journey plan
router.post('/', verifyToken, (req, res) => {
  const { name, locations, start_date, end_date, activities, description } = req.body;
  
  if (!name || !locations || !start_date || !end_date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const query = 'INSERT INTO journey_plans (user_id, name, locations, start_date, end_date, activities, description) VALUES (?, ?, ?, ?, ?, ?, ?)';
  connection.query(query, [req.userId, name, JSON.stringify(locations), start_date, end_date, JSON.stringify(activities), description], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ id: results.insertId, ...req.body });
  });
});

// Update a journey plan
router.put('/:id', verifyToken, (req, res) => {
  const { name, locations, start_date, end_date, activities, description } = req.body;
  
  const query = 'UPDATE journey_plans SET name = ?, locations = ?, start_date = ?, end_date = ?, activities = ?, description = ? WHERE id = ? AND user_id = ?';
  connection.query(query, [name, JSON.stringify(locations), start_date, end_date, JSON.stringify(activities), description, req.params.id, req.userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Journey plan not found' });
    }
    res.json({ id: req.params.id, ...req.body });
  });
});

// Delete a journey plan
router.delete('/:id', verifyToken, (req, res) => {
  const query = 'DELETE FROM journey_plans WHERE id = ? AND user_id = ?';
  connection.query(query, [req.params.id, req.userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Journey plan not found' });
    }
    res.json({ message: 'Journey plan deleted successfully' });
  });
});

module.exports = router; 