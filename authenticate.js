const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
// const JwtStrategy = require('passport-jwt').Strategy
// const ExtractJwt = require('passport-jwt').ExtractJwt
// const jwt = require('jsonwebtoken')
const User = require('./models/user')
// const config = require('./config')
// const FacebookTokenStrategy = require('passport-facebook-token')

exports.local = passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
