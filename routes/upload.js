const express = require('express')
const bodyParser = require('body-parser')
const authenticate = require('../authenticate')
const multer = require('multer')
const cors = require('./cors')

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'public/files/')
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname)
  }
})

const fileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(txt)$/)) return callback(new Error('You can upload only .txt files'), false)
  else callback(null, true)
}

const upload = multer({ storage, fileFilter })

const error403 = (req, res, message) => {
  res.statusCode = 403
  res.end(message)
}

const uploadRouter = express.Router()

uploadRouter.use(bodyParser.json())

uploadRouter.route('/')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, authenticate.verifyUser, (req, res) => {
    error403(req, res, 'PUT operation is not supported')
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, upload.single('testFile'), (req, res) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.json(req.file)
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    error403(req, res, 'PUT operation is not supported')
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    error403(req, res, 'PUT operation is not supported')
  })

module.exports = uploadRouter
