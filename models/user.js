const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')

const User = new Schema({
  refresh_token: {
    type: String,
    default: ''
  },
  admin: {
    type: Boolean,
    default: false
  },
  facebook_id: {
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
    ref: 'tests'
  }],
  statistics: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'statistics'
  }
})

User.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', User)
