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

exports.getToken = user => jwt.sign(user, config.secretKey, { expiresIn: 3600 })

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.secretKey
}

exports.jwtPassport = passport.use(new JwtStrategy(opts, (jwtPayload, done) => {
  User.findOne({ _id: jwtPayload._id }, (error, user) => {
    if (error) return done(error, false)
    else if (user) return done(null, user)
    else return done(null, false)
  })
}))

exports.verifyUser = passport.authenticate('jwt', { session: false })

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
