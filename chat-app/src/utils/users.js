const rooms = {};

const addUser = ({ id, username, room }) => {
  if (!username || !room) {
    return {
      error: 'Username and room are required.'
    };
  }

  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  if (rooms[room]) {
    for (let id in rooms[room]) {
      if (rooms[room][id].username === username) {
        return {
          error: 'Username already in use.'
        };
      }
    }
  }

  if (!rooms[room]) {
    rooms[room] = {};
  }

  const user = { id, username };
  rooms[room][id] = user;

  return { user: { ...user, room } };
};

const removeUser = id => {
  for (let room in rooms) {
    if (rooms[room][id]) {
      const user = rooms[room][id];

      delete rooms[room][id];

      if (
        Object.entries(rooms[room]).length === 0 &&
        rooms[room].constructor === Object
      ) {
        delete rooms[room];
      }

      return { ...user, room };
    }
  }

  return {
    error: 'Cannot find user.'
  };
};

const getUser = id => {
  for (let room in rooms) {
    if (rooms[room][id]) {
      return { ...rooms[room][id], room };
    } else {
      return undefined;
    }
  }
};

const getUsersInRoom = room => {
  if (!rooms[room]) {
    return {
      error: 'This room does not exist'
    };
  }

  const usersInRoom = [];

  for (let user in rooms[room]) {
    usersInRoom.push(rooms[room][user]);
  }

  return usersInRoom.sort((a, b) => {
    if (a.username < b.username) {
      return -1;
    } else if (a.username > b.username) {
      return 1;
    }
    return 0;
  });
};

module.exports = { addUser, removeUser, getUser, getUsersInRoom };
