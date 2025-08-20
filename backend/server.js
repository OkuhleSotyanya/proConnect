
const express = require('express');
const cors = require('cors');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const authRoutes = require('../backend/routes/authRoutes');
const jobRoutes = require('../backend/routes/jobRoutes');
const authMiddleware = require('../backend/middleware/authMiddleware');
const clientRoutes = require('../backend/routes/clientRoutes');
const contractorRoutes = require('../backend/routes/contractorRoutes');
const pool = require('./config/db');
require('dotenv').config();
const profileRoutes = require('./routes/profileRoutes');


const JWT_SECRET = process.env.JWT_SECRET;

// Global map of connected users (user_id -> socket.id)
global.connectedUsers = new Map();

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: '*', // adjust in production
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/contractors', contractorRoutes);
app.use('/api/profile', profileRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Protected route example
app.get('/api/protected', authMiddleware(['admin']), (req, res) => {
  res.json({ message: 'Protected content' });
});

// Socket.io authentication middleware
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return next(new Error('Authentication error: Invalid token'));
      }
      socket.user = decoded; // { user_id, role_name }
      next();
    });
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

// Socket.io connection event
io.on('connection', (socket) => {
  const { user_id } = socket.user;

  // Store user socket
  connectedUsers.set(user_id, socket.id);
  console.log(`User ${user_id} connected. Socket ID: ${socket.id}`);

  // Listen for disconnect
  socket.on('disconnect', () => {
    connectedUsers.delete(user_id);
    console.log(`User ${user_id} disconnected`);
  });
});

// Attach io to app so controllers can use it
app.set('io', io);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
