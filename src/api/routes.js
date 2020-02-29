const express = require('express')
const apiV1 = require('./v1/routes')
const { checkAuth } = require('../middleware')

const router = express.Router()

router.use('/v1', [
  // middleware
  checkAuth,
  
  // api
  apiV1
])

module.exports = router