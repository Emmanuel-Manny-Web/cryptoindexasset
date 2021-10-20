const mongoose = require('mongoose');

const withdrawSchema = mongoose.Schema({
  email: {
    type: String,
  },
  amount: {
    type: Number,
    required: [true, 'Please fill in this field']
  },
  currencytype: {
    type: String,
    required: [true, 'Please fill in this field']
  },
  withdrawaltype: {
    type: String,
    required: [true, 'Please fill in this field']
  },
  bankname: {
    type: String
  },
  bankaccountnumber: {
    type: String
  },
  city: {
    type: String
  },
  country: {
    type: String
  },
  walletaddress: {
    type: String
  },
  destinationtag: {
    type: String
  }
})

module.exports = mongoose.model('withdrawal', withdrawSchema)