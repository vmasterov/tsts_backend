const express = require('express')
const bodyParser = require('body-parser')
const User = require('../models/user')
const router = express.Router()
const passport = require('passport')
const authenticate = require('../authenticate')
const cors = require('./cors')

router.use(bodyParser.json())

router.get('/', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  User.find({})
    .then(
      users => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(users)
      },
      error => next(error)
    )
    .catch(error => next(error))
})

router.post('/singup', cors.corsWithOptions, function (req, res) {
  User.register(new User({ username: req.body.username }), req.body.password, (error, user) => {
    if (error) {
      res.statusCode = 500
      res.setHeader('Content-Type', 'application/json')
      res.json({ error: String(error) })
    }
    else {
      if (req.body.email) user.email = req.body.email
      if (req.body.avatar) user.avatar = req.body.avatar
      if (req.body.tests) user.tests = req.body.tests
      if (req.body.statistics) user.statistics = req.body.statistics

      user.save(error => {
        if (error) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.json({ error: String(error) })
          return
        }
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.json({ success: true, status: 'Registration Successful!' })
        })
      })
    }
  })
})

router.post('/singin', cors.corsWithOptions, passport.authenticate('local'), function (req, res) {
  let token = authenticate.getToken({ _id: req.user._id })
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.json({
    token,
    success: true,
    status: 'You are successfully logged in!'
  })
})

router.get('/logout', cors.corsWithOptions, function (req, res, next) {
  // Check if DON`T Facebook use sessions -- remove it
  if (req.session) {
    req.session.destroy()
    res.clearCookie('session-id')
    res.redirect('/')
  }
  else {
    let error = new Error('You are not logged in!')
    error.status = 403
    next(error)
  }
})

module.exports = router
