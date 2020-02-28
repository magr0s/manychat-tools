const express = require('express')
const controller = require('./controller')

const router = express.Router()

router.get('/:id', controller.getInfo)

module.exports = router