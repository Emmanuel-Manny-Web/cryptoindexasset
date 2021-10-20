const mongoose = require('mongoose')

const traderSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Fill in the name field'],
    unique: true
  },
  accuracy: {
    type: Number,
    required: [true, 'Fill in the accuracy field']
  },
  copiers: {
    type: Number,
    required: [true, 'Fill in the copiers field']
  },
  useable: {
    type: Boolean,
    default: true
  }
})

module.exports = mongoose.model('topTraders', traderSchema)