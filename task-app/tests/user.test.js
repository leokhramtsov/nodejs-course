const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const { setupDatabase, userOne, userOneId } = require('../tests/fixtures/db');

beforeEach(setupDatabase);

test('Should signup a new user', async () => {
  const response = await request(app)
    .post('/users')
    .send({ name: 'Robert', email: 'rob@example.com', password: 'mypass555!' })
    .expect(201);

  // Assert the database was changed correctly
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  // Assert about response body
  expect(response.body).toMatchObject({
    user: {
      email: 'rob@example.com',
      name: 'Robert'
    },
    token: user.tokens[0].token
  });
  expect(user.password).not.toBe('testpass1234');
});

test('Should not signup user with invalid password', async () => {
  await request(app)
    .post('/users')
    .send({ name: 'Robert', email: 'rob@example.com', password: 'mypa' })
    .expect(400);
});

test('Should login existing user', async () => {
  const response = await request(app)
    .post('/users/login')
    .send({ email: userOne.email, password: userOne.password })
    .expect(200);
  const user = await User.findById(response.body.user._id);
  expect(response.body.token).toBe(user.tokens[1].token);
});

test('Should not login user', async () => {
  await request(app)
    .post('/users/login')
    .send({ email: userOne.email, password: 1111111 })
    .expect(400);
});

test('Should get user profile', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test('Should not get user profile (unauthenticated)', async () => {
  await request(app)
    .get('/users/me')
    .send()
    .expect(401);
});

test('Should delete account for user', async () => {
  await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user).toBeNull();
});

test('Should not update user if unauthenticated', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', 'Bearer 11111111')
    .send({ name: 'Samuel' })
    .expect(401);
});

test('Should not update user with invalid password', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({ password: 'short' })
    .expect(400);
});

test('Should not delete account for unauthenticated user', async () => {
  await request(app)
    .delete('/users/me')
    .send()
    .expect(401);
});

test('Should logout user', async () => {
  await request(app)
    .post('/users/logout')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test('Should logoutAll user', async () => {
  await request(app)
    .post('/users/logoutAll')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test('Should upload avatar image', async () => {
  await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/profile-pic.jpg')
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test('Should update valid user fields', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({ name: 'Benjamin' })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.name).toBe('Benjamin');
});

test('Should not update invalid user fields', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({ lastname: 'Benjamin' })
    .expect(400);
});
