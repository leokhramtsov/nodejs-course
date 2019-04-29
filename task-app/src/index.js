const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');

const app = express();
const port = process.env.port || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('root');
});

app.post('/users', (req, res) => {
  const { name, email, password } = req.body;

  const user = new User({ name, email, password });
  user
    .save()
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => res.status(400).send(err));
});

app.post('/tasks', (req, res) => {
  const { description } = req.body;

  const task = new Task({ description });
  task
    .save()
    .then(task => {
      res.status(201).json(task);
    })
    .catch(err => res.status(400).send(err));
});

app.listen(port, () => console.log(`Server is up on port ${port}`));
