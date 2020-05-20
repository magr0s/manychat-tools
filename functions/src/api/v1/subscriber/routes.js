const express = require('express')
const controller = require('./controller')

const router = express.Router()

router.get('/get-info/:id', controller.getInfo)
router.get('/get-location/:id', controller.getLocation)
router.get('/get-sign/:id', controller.getSign)
router.get('/get-friendship/:id', controller.getFriendship)
router.get('/get-friendship/:tpl/:id', controller.getFriendship)
router.get('/get-gift/:id', controller.getGift)
router.get('/get-gift-card/:id', controller.getGiftCard)
router.get('/get-gift-card-500/:id', controller.getGiftCard500)
router.post('/set-clicktracker', controller.setClickTracker)

module.exports = router
