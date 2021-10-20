const mongoose = require('mongoose');

const requestSchema = mongoose.Schema({
  email: {
    type: String
  },
  requestedAmount: {
    type: Number
  },
  requestDate: {
    type: Date,
    default: Date.now()
  },
  status: {
    type: String,
    default: "pending"
  },
  credited: {
    type: Boolean,
    default: false
  },
  withdrawaltype: {
    type: String,
    required: true
  },
  bankname: {
    type: String,
  },
  bankaccountnumber: {
    type: String,
  },
  city: {
    type: String
  },
  country: {
    type: String
  },
  walletaddress: {
    type: String,
  }
})

module.exports = mongoose.model('withdrawRequest', requestSchema);