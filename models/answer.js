const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Answer = new Schema({
  test_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'tests'
  },
  answers: {
    type: Array,
    default: []
  }
})

module.exports = mongoose.model('Answer', Answer)
