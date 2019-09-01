const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');
const Filter = require('bad-words');

const {
  generateMessage,
  generateLocationMessage
} = require('./utils/messages');
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirPath = path.join(__dirname, '../public');

app.use(express.static(publicDirPath));

io.on('connection', socket => {
  console.log('a user connected!');

  const chatBot = 'ChatBot';

  socket.on('join', ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room });

    if (error) {
      return callback(error);
    }

    socket.join(user.room);

    const userJoinedMessage = `${user.username} has joined!`;
    const welcomeMessage = `Welcome ${user.username}!`;

    socket.emit('message', generateMessage(chatBot, welcomeMessage));

    socket
      .to(user.room)
      .broadcast.emit('message', generateMessage(chatBot, userJoinedMessage));

    const users = getUsersInRoom(user.room);
    io.to(user.room).emit('userListUpdated', { users, room: user.room });
    callback();
  });

  socket.on('sendMessage', (newMessage, callback) => {
    const filter = new Filter();

    if (filter.isProfane(newMessage)) {
      return callback('Your message contains profanity and was rejected!');
    }

    const user = getUser(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        generateMessage(user.username, newMessage)
      );
      callback();
    }
  });

  socket.on('sendLocation', ({ lat, long }, callback) => {
    const user = getUser(socket.id);

    if (user) {
      const url = `https://google.com/maps?=${lat},${long}`;
      io.to(user.room).emit(
        'locationMessage',
        generateLocationMessage(user.username, url)
      );
      callback('Location shared!');
    }
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      const userLeftMessage = `${user.username} has left the chat.`;

      io.to(user.room).emit(
        'message',
        generateMessage(chatBot, userLeftMessage)
      );

      const users = getUsersInRoom(user.room);
      io.to(user.room).emit('userListUpdated', { users, room: user.room });
    }
  });
});

server.listen(port, () =>
  console.log(`Chat App server listening on port ${port}`)
);
