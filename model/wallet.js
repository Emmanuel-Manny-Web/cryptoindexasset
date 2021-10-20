const mongoose = require('mongoose');

const walletSchema = mongoose.Schema({
  btc: {
    type: String
  },
  eth: {
    type: String
  },
  bch: {
    type: String
  },
  ltc: {
    type: String
  },
  xrp: {
    type: String
  },
  usdt: {
    type: String
  }
})

module.exports = mongoose.model('wallet', walletSchema)