const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Test = new Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  name: {
    type: String,
    default: ''
  },
  time: {
    type: Number,
    default: ''
  },
  score: {
    type: Number,
    default: ''
  },
  questions: {
    type: Array,
    default: []
  }
})

module.exports = mongoose.model('Test', Test)
