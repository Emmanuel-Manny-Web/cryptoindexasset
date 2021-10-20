const mongoose = require("mongoose");
const { isEmail } = require("validator")

const financeSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please enter an email address'],
    vaildate: [isEmail, 'Please enter a valid email address']
  },
  paidAmount: {
    type: Number,
    default: 0.00
  },
  timesPaid: {
    type: Number,
    default: 0
  },
  totalAmountWithdrawn: {
    type: Number,
    default: 0
  },
  numberofRequest: {
    type: Number,
    default: 0
  },
  timesDeclined: {
    type: Number,
    default: 0
  },
  timesApproved: {
    type: Number,
    default: 0
  }
})

module.exports = mongoose.model('finance', financeSchema)