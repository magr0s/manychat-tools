const Manychat = require('./manychat')
const { MANYCHAT_CONFIG } = require('../../config')

const { ENDPOINT } = MANYCHAT_CONFIG


class SubscriberManychat extends Manychat {
  constructor (params) {
    super(params)

    this.endpoint = ENDPOINT.SUBSCRIBER
  }

  getInfo (id) {
    return this._get('/getInfo', { subscriber_id: id })
  }
}

module.exports = SubscriberManychat
