const mongoose = require('mongoose')
const { isEmail } = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    lowercase: true
  },
  email: {
    type: String,
    required: [true, 'Please enter an email address'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email address']
  },
  number: {
    type: Number,
    required: [true, 'Please fill in your phone number'],
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minLength: [6, 'Password must be at least 6 characters long']
  },
  showSignal: {
    type: Boolean,
    default: true
  },
  status: {
    type: Boolean,
    default: true
  },
  twoFA: {
    type: Boolean,
    default: false
  },
  blocked: {
    type: Boolean,
    default: false
  },
  dateCreated: {
    type: Date,
    default: Date.now()
  }
}, { timestamps: true });

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({email})
  if (user) {
    if(!user.blocked) {
      const auth = bcrypt.compareSync(password, user.password)
      if (auth) {
        return user;
      }
      throw Error('Invalid login credentials')
    }
    throw Error('Temporarily suspended, cannot login')
  }
  throw Error('Invalid email/password')
}

const User = mongoose.model('User', userSchema)

module.exports = User