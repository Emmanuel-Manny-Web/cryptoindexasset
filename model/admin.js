const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")

const adminSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please type in a username'],
    minLength: [4, 'Username must be at least 4 characters'],
    unique: [true, 'Username already exists'],
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Please type in a password'],
    minLength: [6, 'Password must be at least six characters long']
  },
  created: {
    type: Date,
    default: Date.now()
  }
})

adminSchema.statics.login = async function(username, password) {
  const user = await this.findOne({ username });
  if (user) {
    const auth = bcrypt.compareSync(password, user.password)
    if (auth) {
      return user;
    }
    throw Error("Incorrect password")
  }
  throw Error("Invalid username")
}

module.exports = mongoose.model('Admin', adminSchema)