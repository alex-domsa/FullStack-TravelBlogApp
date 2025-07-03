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

// Get all travel logs for the authenticated user
router.get('/', verifyToken, (req, res) => {
  const query = 'SELECT * FROM travel_logs WHERE user_id = ?';
  connection.query(query, [req.userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Get a specific travel log
router.get('/:id', verifyToken, (req, res) => {
  const query = 'SELECT * FROM travel_logs WHERE id = ? AND user_id = ?';
  connection.query(query, [req.params.id, req.userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Travel log not found' });
    }
    res.json(results[0]);
  });
});

// Create a new travel log
router.post('/', verifyToken, (req, res) => {
  const { title, description, start_date, end_date, post_date, tags } = req.body;
  
  if (!title || !start_date || !end_date || !post_date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const query = 'INSERT INTO travel_logs (user_id, title, description, start_date, end_date, post_date, tags) VALUES (?, ?, ?, ?, ?, ?, ?)';
  connection.query(query, [req.userId, title, description, start_date, end_date, post_date, JSON.stringify(tags)], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ id: results.insertId, ...req.body });
  });
});

// Update a travel log
router.put('/:id', verifyToken, (req, res) => {
  const { title, description, start_date, end_date, post_date, tags } = req.body;
  
  const query = 'UPDATE travel_logs SET title = ?, description = ?, start_date = ?, end_date = ?, post_date = ?, tags = ? WHERE id = ? AND user_id = ?';
  connection.query(query, [title, description, start_date, end_date, post_date, JSON.stringify(tags), req.params.id, req.userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Travel log not found' });
    }
    res.json({ id: req.params.id, ...req.body });
  });
});

// Delete a travel log
router.delete('/:id', verifyToken, (req, res) => {
  const query = 'DELETE FROM travel_logs WHERE id = ? AND user_id = ?';
  connection.query(query, [req.params.id, req.userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Travel log not found' });
    }
    res.json({ message: 'Travel log deleted successfully' });
  });
});

module.exports = router; 