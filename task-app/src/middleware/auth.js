const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, 'qwerty');
    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token
    });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    req.token = token;
    next();
  } catch (e) {
    res.status(401).json({ message: 'Unauthorized access' });
  }
};

const pet = {
  name: 'Winston'
};

pet.toJSON = function() {
  console.log(this);
  return this;
};

console.log(JSON.stringify(pet));

module.exports = auth;
