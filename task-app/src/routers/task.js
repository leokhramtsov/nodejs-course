const express = require('express');
const router = express.Router();
const Task = require('../models/task');

router.post('/', async (req, res) => {
  const task = new Task(req.body);
  try {
    await task.save();
    res.status(201).json(task);
  } catch (e) {
    res.status(400).send();
  }
});

router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.status(200).json(tasks);
  } catch (e) {
    res.status(500).send();
  }
});

router.get('/:id', async (req, res) => {
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

router.patch('/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['description', 'completed'];
  const isAllowedUpdate = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isAllowedUpdate) {
    return res
      .status(400)
      .json({ message: 'Update request contains invalid field.' });
  }

  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'No task found.' });
    }

    updates.forEach(update => {
      task[update] = req.body[update];
    });

    await task.save();

    res.status(200).json(task);
  } catch (e) {
    res.status(400).send();
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'No task found.' });
    }

    res.status(200).json(task);
  } catch (e) {
    res.status(400).send();
  }
});

module.exports = router;
