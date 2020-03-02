const express = require('express')
const controller = require('./controller')

const router = express.Router()

router.get('/get-info/:id', controller.getInfo)
router.get('/get-location/:id', controller.getLocation)

module.exports = router
