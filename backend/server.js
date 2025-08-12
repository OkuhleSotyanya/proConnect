const express = require('express');
const cors = require('cors');
const authRoutes = require('../backend/routes/authRoutes');
const db = require('./config/db');
const authMiddleware = require('../backend/middleware/authMiddleware');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);


// Protected route example                                                                          
app.get('/api/protected', authMiddleware(['admin']), (req, res) => {
  res.json({ message: 'Protected content' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
