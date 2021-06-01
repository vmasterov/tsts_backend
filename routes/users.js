const express = require('express')
const bodyParser = require('body-parser')
const User = require('../models/user')
const Test = require('../models/test')
const Answer = require('../models/answer')
const router = express.Router()
const passport = require('passport')
const authenticate = require('../authenticate')
const cors = require('./cors')

router.use(bodyParser.json())

router.route('/')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
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

router.route('/user')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    User.findOne({ _id: req.user._id })
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

router.route('/user/tests')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Test.find({ owner: req.query.owner })
      .then(
        tests => {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.json(tests)
        },
        error => next(error)
      )
      .catch(error => next(error))
  })

router.route('/user/tests/:id')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Test.find({ _id: req.params.id })
      .then(
        test => {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.json(test)
        },
        error => next(error)
      )
      .catch(error => next(error))
  })

router.route('/user/tests/:id/result')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Answer.findOne({ test_id: req.params.id })
      .then(
        answer => {
          let sum = 0

          for (let i = 0, l = req.body.length; i < l; i++) {
            const current = req.body[i]
            const rightAnswer = answer.answers[current.id]
            const userAnswer = current.answer
            let rightAnswerStr = rightAnswer.sort().join('')
            let userAnswerStr = Array.isArray(userAnswer) ? userAnswer.sort().join('') : userAnswer

            if (rightAnswerStr === userAnswerStr) ++sum
          }

          const result = Math.round(sum / answer.answers.length * 100)

          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.json({ result })
        },
        error => next(error)
      )
      .catch(error => next(error))
  })

router.route('/singup')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .post(cors.corsWithOptions, function (req, res, next) {
    User.register(new User({ username: req.body.username }), req.body.password, (error, user) => {
      if (error) {
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json')
        res.json({ error: String(error) })
      }
      else {
        if (req.body.email) user.email = req.body.email

        user.save(error => {
          if (error) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.json({ error: String(error) })
            return
          }
          req.singup = true
          authenticate.singin(req, res, next)
        })
      }
    })
  })

router.route('/singin')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .post(cors.corsWithOptions, authenticate.singin)

router.route('/refresh-token')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .post(cors.corsWithOptions, authenticate.refresh)

router.route('/refresh-token/delete')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .post(cors.corsWithOptions, authenticate.deleteRefresh)

router.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
  if (req.user) {
    const token = authenticate.getToken({ _id: req.user._id })
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.json({
      token,
      success: true,
      status: 'You are successfully logged in!'
    })
  }
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
