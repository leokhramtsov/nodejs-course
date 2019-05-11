const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/task');
const {
  setupDatabase,
  userOne,
  userTwo,
  taskOne,
  taskTwo,
  taskThree
} = require('../tests/fixtures/db');

beforeEach(setupDatabase);

test('Should create a new task', async () => {
  const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({ description: 'Get sleep' })
    .expect(201);

  const task = await Task.findById(response.body._id);
  expect(task).not.toBeNull();
  expect(task.completed).toEqual(false);
});

test('Should get tasks for user one', async () => {
  const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  expect(response.body.length).toEqual(2);
});

test('Should not delete other users tasks', async () => {
  await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404);

  const task = Task.findById(taskOne._id);
  expect(task).not.toBeNull();
});

test('Should not update other users tasks', async () => {
  await request(app)
    .patch(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send({ description: 'changed' })
    .expect(404);

  const task = await Task.findById(taskOne._id);
  expect(task.description).toEqual('Write tests');
});

test('Should not create task with invalid description', async () => {
  const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({ description: '' })
    .expect(400);

  const task = await Task.findById(response.body._id);
  expect(task).toBeNull();
});

test('Should not update task with invalid completed', async () => {
  const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({ completed: 2 })
    .expect(400);

  const task = await Task.findById(response.body._id);
  expect(task).toBeNull();
});

test('Should delete user task', async () => {
  await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const task = await Task.findById(taskOne._id);
  expect(task).toBeNull();
});

test('Should not delete if unauthenticated', async () => {
  await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set('Authorization', 'Bearer 111111')
    .send()
    .expect(401);

  const task = await Task.findById(taskOne._id);
  expect(task).not.toBeNull();
});

test('Should fetch user task by id', async () => {
  const response = await request(app)
    .get(`/tasks/${taskTwo._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  expect(response.body._id).toEqual(taskTwo._id.toString());
});
