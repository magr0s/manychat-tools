const rp = require('request-promise')
const fetch = require('node-fetch-npm')
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

  fetch (endpoint, params = {}) {
    const url = this.makeURL(endpoint)
    const { headers } = params

    Object.assign(headers, {
      Authorization: `Bearer ${this.token}`
    })

    Object.assign(params, { json: true })

    return fetch(url, params)
      .then(result => (result.json()))
  }

  makeURL (endpoint) {
    return `${API_URL}/${endpoint}`
  }
}

module.exports = Manychat
