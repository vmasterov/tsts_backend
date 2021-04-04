const express = require('express')
const path = require('path')
const logger = require('morgan')
const mongoose = require('mongoose')
const config = require('./config')
const passport = require('passport')
const createError = require('http-errors')

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

app.all('*', (req, res, next) => {
  if (req.secure) return next()
  else res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url)
})

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(passport.initialize())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
