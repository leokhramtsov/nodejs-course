const express = require('express');
const router = express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');

router.post('/', async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).json({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByCredentials(email, password);

    const token = await user.generateAuthToken();
    res.status(200).json({ user, token });
  } catch (e) {
    res.status(400).json(e);
  }
});

router.post('/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      token => token.token !== req.token
    );

    await req.user.save();
    res.status(200).json({ message: 'You are logged out!' });
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

router.post('/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = [];

    await req.user.save();
    res.status(200).json({ message: 'You are logged out!' });
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

router.get('/me', auth, async (req, res) => {
  res.status(200).json(req.user);
});

router.get('/:id', async (req, res) => {
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

router.patch('/:id', async (req, res) => {
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
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'No user found.' });
    }

    updates.forEach(update => {
      user[update] = req.body[update];
    });

    await user.save();

    res.status(200).json(user);
  } catch (e) {
    res.status(400).send();
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'No user found.' });
    }

    res.status(200).json(user);
  } catch (e) {
    res.status(400).send();
  }
});

module.exports = router;
