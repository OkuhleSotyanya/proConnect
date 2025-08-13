// Global mapping of connected users
const connectedUsers = {};

// Add or update a connected user
function addUser(userId, socketId) {
  connectedUsers[userId] = socketId;
}

// Remove a disconnected user
function removeUser(socketId) {
  for (const [userId, sockId] of Object.entries(connectedUsers)) {
    if (sockId === socketId) {
      delete connectedUsers[userId];
      break;
    }
  }
}

// Get socket ID by user ID
function getSocketId(userId) {
  return connectedUsers[userId] || null;
}

// Get all connected users (optional debugging)
function getAllUsers() {
  return connectedUsers;
}

module.exports = {
  addUser,
  removeUser,
  getSocketId,
  getAllUsers
};
