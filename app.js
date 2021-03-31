const express = require('express')
const path = require('path')
const logger = require('morgan')
const mongoose = require('mongoose')
const config = require('./config')
const passport = require('passport')

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')

const url = config.mongoUrl
const connect = mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})

connect.then(
  () => console.log('Connected correctly to server'),
  error => console.log(error)
)

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(passport.initialize())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)

module.exports = app
