const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id
  });

  try {
    await task.save();
    res.status(201).json(task);
  } catch (e) {
    res.status(400).send();
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user._id });

    // alternative solution
    // await req.user.populate('tasks').execPopulate();
    res.status(200).json(tasks);
  } catch (e) {
    res.status(500).send();
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!task) {
      return res.status(404).json({ message: 'No task found' });
    }

    res.status(200).json(task);
  } catch (e) {
    res.status(500).send();
  }
});

router.patch('/:id', auth, async (req, res) => {
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
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

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

router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!task) {
      return res.status(404).json({ message: 'No task found.' });
    }

    res.status(200).json(task);
  } catch (e) {
    res.status(400).send();
  }
});

module.exports = router;
