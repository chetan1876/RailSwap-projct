'use strict';

const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { logger } = require('../shared/logger');

let io = null;

/**
 * Initialize Socket.IO server on top of the HTTP server.
 * @param {import('http').Server} httpServer
 * @returns {import('socket.io').Server}
 */
const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
    transports: ['websocket', 'polling'],
  });

  // JWT authentication for Socket.IO connections
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.split(' ')[1];

      if (!token) {
        return next(new Error('Authentication required for socket connection.'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      logger.warn('Socket auth failed', { error: err.message });
      next(new Error('Invalid or expired token.'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user?.id;
    logger.info('Socket connected', { userId, socketId: socket.id });

    // Join user to their private room
    if (userId) {
      socket.join(`user:${userId}`);
      // Broadcast online status to others
      socket.broadcast.emit('user:online', { userId });
    }

    // ── Typing Events ──────────────────────────────────────────
    socket.on('user:typing', ({ sessionId }) => {
      socket.to(`user:${userId}`).emit('user:typing', { userId, sessionId });
    });

    socket.on('user:stop-typing', ({ sessionId }) => {
      socket.to(`user:${userId}`).emit('user:stop-typing', { userId, sessionId });
    });

    // ── Message Events ─────────────────────────────────────────
    socket.on('message:sent', ({ messageId, sessionId }) => {
      io.to(`user:${userId}`).emit('message:delivered', { messageId, sessionId, timestamp: new Date() });
    });

    // ── Disconnect ─────────────────────────────────────────────
    socket.on('disconnect', (reason) => {
      logger.info('Socket disconnected', { userId, reason });
      socket.broadcast.emit('user:offline', { userId });
    });

    // ── Error ──────────────────────────────────────────────────
    socket.on('error', (err) => {
      logger.error('Socket error', { userId, error: err.message });
    });
  });

  logger.info('Socket.IO initialized successfully');
  return io;
};

/**
 * Get the Socket.IO instance (after initialization).
 * @returns {import('socket.io').Server}
 */
const getIO = () => {
  if (!io) throw new Error('Socket.IO not initialized. Call initSocket(httpServer) first.');
  return io;
};

/**
 * Emit an event to a specific user's room.
 * @param {string} userId
 * @param {string} event
 * @param {*} data
 */
const emitToUser = (userId, event, data) => {
  if (io) {
    io.to(`user:${userId}`).emit(event, data);
  }
};

module.exports = { initSocket, getIO, emitToUser };
