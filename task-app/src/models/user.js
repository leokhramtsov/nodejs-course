const mongoose = require('mongoose');
const validator = require('validator');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
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
    required: true,
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
    required: true,
    trim: true,
    minlength: 7,
    validate(val) {
      if (val.toLowerCase().includes('password')) {
        throw new Error('Cannot contain word password');
      }
    }
  }
});

userSchema.pre('save', async function(next) {
  try {
    // const salt = await bcrypt.genSalt(10);
    // const hash = await bcrypt.hash(this.password, salt);
    // this.password = hash;
    // console.log('yay');
    // console.log(this.password);
    console.log('before save');
    next();
  } catch (e) {
    next();
  }
});

module.exports = mongoose.model('User', userSchema);
