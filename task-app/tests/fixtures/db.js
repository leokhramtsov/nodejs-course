const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../src/models/user');
const Task = require('../../src/models/task');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: 'user 1',
  email: 'test1@test.com',
  password: 'testpass1234',
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }
  ]
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  name: 'user 2',
  email: 'test2@test.com',
  password: 'testpass9999',
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }
  ]
};

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Write tests',
  owner: userOneId
};

const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Finish course',
  owner: userOneId
};

const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Workout',
  owner: userTwoId
};

const setupDatabase = async () => {
  await User.deleteMany();
  await Task.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
};

module.exports = {
  userOne,
  userOneId,
  userTwo,
  userTwoId,
  taskOne,
  taskTwo,
  taskThree,
  setupDatabase
};
