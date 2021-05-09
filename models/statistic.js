const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Statistic = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  result: {
    type: Array,
    default: []
  }
})

module.exports = mongoose.model('Statistic', Statistic)
