const initSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`⚡ Socket connected: ${socket.id}`);

    socket.on('join-leaderboard', () => {
      socket.join('leaderboard');
    });

    socket.on('leaderboard-update', (data) => {
      io.to('leaderboard').emit('leaderboard-updated', data);
    });

    socket.on('join-event', (eventId) => {
      socket.join(`event-${eventId}`);
    });

    socket.on('new-achievement', (data) => {
      io.emit('achievement-posted', data);
    });

    socket.on('disconnect', () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });
};

module.exports = initSocket;
