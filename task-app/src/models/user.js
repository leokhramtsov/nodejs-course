const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const Task = require('./task');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Username is required'],
      trim: true
    },
    age: {
      type: Number,
      default: 0,
      validate(val) {
        if (val < 0) {
          throw new Error('Age must be a positive number');
        }
      }
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      validate(val) {
        if (!validator.isEmail(val)) {
          throw new Error('Email is invalid');
        }
      }
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      trim: true,
      minlength: 7,
      validate(val) {
        if (val.toLowerCase().includes('password')) {
          throw new Error('Cannot contain word password');
        }
      }
    },
    tokens: [
      {
        token: {
          type: String,
          required: true
        }
      }
    ],
    avatar: {
      type: Buffer
    }
  },
  { timestamps: true }
);

userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
});

userSchema.methods.toJSON = function() {
  const userObj = this.toObject();

  delete userObj.password;
  delete userObj.tokens;
  delete userObj.avatar;
  delete userObj.__v;

  return userObj;
};

userSchema.statics.findByCredentials = async function(email, password) {
  const user = await this.findOne({ email });

  if (!user) {
    throw new Error('Unable to login.');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new error('Unable to login.');
  }

  return user;
};

userSchema.methods.generateAuthToken = async function() {
  const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });

  this.tokens.push({ token });
  await this.save();

  return token;
};

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(this.password, salt);
      this.password = hash;
      next();
    } catch (e) {
      next(e);
    }
  }
});

// Delete user tasks when user is removed
userSchema.pre('remove', async function(next) {
  await Task.deleteMany({ owner: this._id });
  next();
});

module.exports = mongoose.model('User', userSchema);
