const express = require('express')
const subscriber = require('./subscriber/routes')

const router = express.Router()

router.use('/subscriber', subscriber)

module.exports = router