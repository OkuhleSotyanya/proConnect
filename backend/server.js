const express = require("express");
const cors = require("cors");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const clientRoutes = require("./routes/clientRoutes");
const adminRoutes = require("./routes/adminRoutes");
const jobRequestRoutes = require("./routes/jobRequestRoutes");

const pool = require("./config/db");
const JWT_SECRET = process.env.JWT_SECRET;

// Controllers (CommonJS)
const {
  addContractorsCon,
  deleteContractorsCon,
  getContractorsByIDCon,
  getContractorsCon,
  updateContractorsInfoCon
} = require('./controllers/contractorsCon');

const {
  deleteJobRequestCon,
  getJobPendingCon,
  getJobRequestCon
} = require('./controllers/jobRequestCon');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only images (jpeg, jpg, png) and PDFs are allowed"));
    }
  },
});

// Global map of connected users (user_id -> socket.id)
global.connectedUsers = new Map();

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:8081","http://localhost:8082"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS
app.use(
  cors({
    origin: ["http://localhost:8081","http://localhost:8082"],
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/admin", adminRoutes);
app.use("/Uploads", express.static(path.join(__dirname, "Uploads")));

// Contractors routes
app.get('/contractors', getContractorsCon);
app.get('/contractorsByID/:id', getContractorsByIDCon);                          
app.post('/contractors', addContractorsCon);
app.delete('/contractors/:id', deleteContractorsCon);
app.patch('/contractors/:id', updateContractorsInfoCon);

// Job routes
app.get('/jobRequest', getJobRequestCon);
app.get('/jobPending', getJobPendingCon);
app.use('/api', jobRequestRoutes);
app.delete('/jobRequest/:id', deleteJobRequestCon);

// Protected route example
app.get("/api/protected", authMiddleware(["admin"]), (req, res) => {
  res.json({ message: "Protected content" });
});

// Socket.io authentication middleware
io.use((socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      (socket.handshake.headers?.authorization
        ? socket.handshake.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      return next(new Error("Authentication error: Token missing"));
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return next(new Error("Authentication error: Invalid token"));
      }
      socket.user = decoded; // { user_id, role_name }
      next();
    });
  } catch (error) {
    next(new Error("Authentication error"));
  }
});

// Socket.io connection
io.on("connection", (socket) => {
  const { user_id } = socket.user;

  // Store user socket
  connectedUsers.set(user_id, socket.id);
  console.log(`User ${user_id} connected. Socket ID: ${socket.id}`);

  // Disconnect
  socket.on("disconnect", () => {
    connectedUsers.delete(user_id);
    console.log(`User ${user_id} disconnected`);
  });
});

// Attach io to app
app.set("io", io);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
