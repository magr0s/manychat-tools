const express = require('express')
const apiV1 = require('./v1/routes')
const { Authorization } = require('../middleware')

const router = express.Router()

router.use('/v1', [
  // middleware
  Authorization.isAuthorized,

  // api
  apiV1
])

module.exports = router
