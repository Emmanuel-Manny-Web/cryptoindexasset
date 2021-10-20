const mongoose = require('mongoose');

const lastLoginSchema = mongoose.Schema({
  tok: {
    type: String,
    required: true
  },
  dateLoggedIn: {
    type: Date,
    default: Date.now()
  }
}, { timestamps: true })

module.exports = mongoose.model('lastLogin', lastLoginSchema)