const mongoose = require('mongoose')
const { isEmail } = require("validator")

const currencySchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please put in an email address'],
    validate: [isEmail, 'Please type in a correct email address']
  },
  btc: {
    type: Number,
    default: 0.00
  },
  eth: {
    type: Number,
    default: 0.00
  },
  bch: {
    type: Number,
    default: 0.00
  },
  ltc: {
    type: Number,
    default: 0.00
  },
  xrp: {
    type: Number,
    default: 0.00
  },
  usdt: {
    type: Number,
    default: 0.00
  }
});

module.exports = mongoose.model('currency', currencySchema)