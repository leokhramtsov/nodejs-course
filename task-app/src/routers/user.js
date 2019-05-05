const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
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

router.patch('/me', auth, async (req, res) => {
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
    // const user = await User.findById(req.params.id);

    // if (!user) {
    //   return res.status(404).json({ message: 'No user found.' });
    // }

    updates.forEach(update => {
      req.user[update] = req.body[update];
    });

    await req.user.save();

    res.status(200).json({ message: 'User Updated' });
  } catch (e) {
    res.status(400).send();
  }
});

router.delete('/me', auth, async (req, res) => {
  try {
    // const user = await User.findByIdAndDelete(req.user._id);

    // if (!user) {
    //   return res.status(404).json({ message: 'No user found.' });
    // }

    await req.user.remove();

    res.status(200).json({ message: 'Deleted' });
  } catch (e) {
    res.status(400).send();
  }
});

const upload = multer({
  limits: {
    fieldSize: 1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      cb(new Error('File must be an image (jpg, jpeg, png)'));
    }
    cb(undefined, true);
  }
});

router.post(
  '/me/avatar',
  auth,
  upload.single('avatar'),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize(48, 48)
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();

    res.status(200).json({ message: 'upload completed' });
  },
  (error, req, res, next) => {
    res.status(400).json({ error: error.message });
  }
);

router.delete('/me/avatar', auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.status(200).send();
});

router.get('/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new Error();
    }

    res.set('Content-Type', 'image/png');
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send();
  }
});

module.exports = router;
