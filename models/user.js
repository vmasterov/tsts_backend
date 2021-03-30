const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')

const User = new Schema({
  admin: {
    type: Boolean,
    default: false
  },
  facebookId: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: ''
  },
  tests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tests'
  }],
  statistics: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Statistics'
  }
})

User.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', User, 'Users')
