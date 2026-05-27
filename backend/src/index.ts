import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import assignmentRoutes from './routes/assignment.routes';
import { setSocketIoInstance, startGenerationWorker } from './queues/generation.worker';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: '*', // For development. Update to actual frontend URL in production
    methods: ['GET', 'POST']
  }
});

// Pass the io instance to our worker so it can emit events
setSocketIoInstance(io);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/assignments', assignmentRoutes);

// Basic health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Clients can join a room specific to an assignment ID to receive its updates
  socket.on('join_assignment_room', (assignmentId: string) => {
    socket.join(assignmentId);
    console.log(`Client ${socket.id} joined room: ${assignmentId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

// Initialize Server
const startServer = async () => {
  await connectDB();
  
  // Start listening to the queue
  startGenerationWorker();

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
