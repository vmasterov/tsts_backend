const express = require('express')
const router = express.Router()

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('<h1 style="color:red">respond with a resource</h1>')
})

module.exports = router
