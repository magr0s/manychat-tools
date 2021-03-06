const rp = require('request-promise')
const { MANYCHAT_CONFIG } = require('../../config')

const { API_URL } = MANYCHAT_CONFIG

class Manychat {
  constructor (params) {
    const { token } = params

    this.token = token
  }

  get apiURL () {
    return API_URL + this.endpoint
  }

  async _get (endpoint, qs) {
    const options = {
      url: this.apiURL + endpoint,
      json: true,
      qs,

      headers: {
        Authorization: `Bearer ${this.token}`
      }
    }

    return rp(options)
      .then(({ data }) => (data))
  }

  async _post (endpoint, body) {
    const options = {
      uri: this.apiURL + endpoint,
      method: 'POST',
      json: true,
      body,

      headers: {
        Authorization: `Bearer ${this.token}`
      }
    }

    return rp(options)
  }
}

module.exports = Manychat
