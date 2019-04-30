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

app.post('/users', async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.status(201).json(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (e) {
    res.status(500).send();
  }
});

app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById({ _id: req.params.id });

    if (!user) {
      return res.status(404).json({ message: 'No user found' });
    }

    res.status(200).json(user);
  } catch (e) {
    res.status(500).send();
  }
});

app.patch('/users/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'password'];
  const isAllowedUpdate = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isAllowedUpdate) {
    return res
      .status(400)
      .json({ message: 'Update request contains invalid field.' });
  }

  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!user) {
      return res.status(404).json({ message: 'No user found.' });
    }

    res.status(200).json(user);
  } catch (e) {
    res.status(400).send();
  }
});

app.post('/tasks', async (req, res) => {
  const task = new Task(req.body);
  try {
    await task.save();
    res.status(201).json(task);
  } catch (e) {
    res.status(400).send();
  }
});

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.status(200).json(tasks);
  } catch (e) {
    res.status(500).send();
  }
});

app.get('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById({ _id: req.params.id });

    if (!task) {
      return res.status(404).json({ message: 'No task found' });
    }

    res.status(200).json(task);
  } catch (e) {
    res.status(500).send();
  }
});

app.patch('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!task) {
      return res.status(404).json({ message: 'No task found.' });
    }

    res.status(200).json(task);
  } catch (e) {
    res.status(400).send();
  }
});

// Playground
app.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    const count = await Task.countDocuments({ completed: false });
    res.status(200).json(count);
  } catch (e) {
    res.status(500).json(e);
  }
});

app.listen(port, () => console.log(`Server is up on port ${port}`));
