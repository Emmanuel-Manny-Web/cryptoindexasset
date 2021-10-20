const mongoose = require("mongoose");
const { isEmail } = require('validator')

const paidSchema = mongoose.Schema({
  email:{
    type: String,
    required: [true, 'Email address is required'],
    validate: [isEmail, 'Please enter a valid email address']
  },
  amount: {
    type: Number,
    default: 0
  },
  requestedDate: {
    type: Date
  },
  paidDate: {
    type: Date
  }
})

module.exports = mongoose.model('payment', paidSchema)