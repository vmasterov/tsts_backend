const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const jwt = require('jsonwebtoken')
const User = require('./models/user')
const config = require('./config')
const FacebookTokenStrategy = require('passport-facebook-token')

exports.local = passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

exports.singin = (req, res, next) => {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err)
    }
    if (!user) {
      res.statusCode = 401
      res.setHeader('Content-Type', 'application/json')
      res.json({
        err,
        info,
        success: false,
        message: 'Неверный логин или пароль'
      })
    }
    let token = jwt.sign({ _id: user._id }, config.secretKey, { expiresIn: 3600 })
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.json({
      token,
      success: true,
      message: 'Вы успешно зарегистрированы в системе'
    })
  })(req, res, next)
}

exports.getToken = user => jwt.sign(user, config.secretKey, { expiresIn: 3600 })

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.secretKey
}

exports.jwtPassport = passport.use(new JwtStrategy(options, (jwtPayload, done) => {
  User.findOne({ _id: jwtPayload._id }, (error, user) => {
    if (error) return done(error, false)
    else if (user) return done(null, user)
    else return done(null, false)
  })
}))

exports.verifyUser = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, function (err, user, info) {
    if (err) {
      return next(err)
    }
    if (!user) {
      res.statusCode = 401
      res.setHeader('Content-Type', 'application/json')
      res.json({
        err,
        info,
        success: false,
        message: 'Неверный логин или пароль1'
      })
      return
    }
    req.user = user
    next()
  })(req, res, next)
}

exports.verifyAdmin = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then(
      user => {
        if (user.admin) {
          next()
        }
        else {
          let error = new Error('You are not authorized to perform this operation!')
          error.status = 403
          return next(error)
        }
      },
      error => next(error)
    )
    .catch(
      error => next(error)
    )
}

exports.facebookPassport = passport.use(new FacebookTokenStrategy({
  clientID: config.facebook.clientID,
  clientSecret: config.facebook.clientSecret
}, (accessToken, refreshToken, profile, done) => {
  User.findOne({ facebookId: profile.id }, (error, user) => {
    if (error) {
      return done(error, false)
    }
    if (!error && user !== null) {
      return done(null, user)
    }
    else {
      user = new User({ username: profile.displayName })
      user.facebookId = profile.id
      user.firstname = profile.name.givenName
      user.lasname = profile.name.familyName
      user.save((error, user) => {
        if (error) return done(error, false)
        else return done(null, user)
      })
    }
  })
}))
