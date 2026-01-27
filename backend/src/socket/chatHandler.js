const Message = require('../models/Message');

const onlineUsers = new Map();

const chatHandler = (io, socket) => {
  const user = socket.user;

  // Add user to online list
  onlineUsers.set(socket.id, {
    id: user._id,
    username: user.username
  });

  // Broadcast updated user list
  io.emit('user-list', Array.from(onlineUsers.values()));

  // Join room
  socket.on('join', (room = 'general') => {
    socket.join(room);
    console.log(`${user.username} joined room: ${room}`);
  });

  // Handle new message
  socket.on('message', async (data) => {
    try {
      const { content, room = 'general' } = data;

      const message = await Message.create({
        sender: user._id,
        senderName: user.username,
        content,
        room
      });

      io.to(room).emit('message', {
        _id: message._id,
        sender: user._id,
        senderName: user.username,
        content: message.content,
        room: message.room,
        createdAt: message.createdAt
      });
    } catch (error) {
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Handle typing indicator
  socket.on('typing', (room = 'general') => {
    socket.to(room).emit('typing', {
      userId: user._id,
      username: user.username
    });
  });

  socket.on('stop-typing', (room = 'general') => {
    socket.to(room).emit('stop-typing', {
      userId: user._id
    });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    onlineUsers.delete(socket.id);
    io.emit('user-list', Array.from(onlineUsers.values()));
    console.log(`${user.username} disconnected`);
  });
};

// Get messages history
const getMessages = async (room = 'general', limit = 50) => {
  const messages = await Message.find({ room })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
  return messages.reverse();
};

module.exports = { chatHandler, getMessages };
