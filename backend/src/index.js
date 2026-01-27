require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const { socketAuth } = require('./middleware/auth');
const { chatHandler, getMessages } = require('./socket/chatHandler');

const app = express();
const server = http.createServer(app);

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Get messages API
app.get('/api/messages/:room?', async (req, res) => {
  try {
    const room = req.params.room || 'general';
    const messages = await getMessages(room);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Socket authentication middleware
io.use(socketAuth);

// Socket connection handler
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.user.username}`);
  chatHandler(io, socket);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
