const { FacebookAdsApi, AdsPixel } = require('facebook-nodejs-business-sdk')

const EVENT_NAME = 'Lead'
const PSEUDO_LENGTH = 10

const postback = async ({ query }, res) => {
  const {
    pixel,
    token,
    time,
    ip,
    agent,
    externalid,
    fbclid
  } = query

  const fields = []

  try {
    if (
      !token ||
      token.length <= PSEUDO_LENGTH
    ) throw new Error('Token is incorrect')

    if (
      !pixel ||
      pixel.length <= PSEUDO_LENGTH
    ) throw new Error('Pixel ID incorrect')

    if (
      !externalid &&
      (!ip && !agent) &&
      !fbclid
    ) throw new Error('Bad params')

    const api = FacebookAdsApi.init(token, 'en_US', false)

    api.setDebug(true)

    const eventTime = time - (3 * 3600)

    const userData = {}

    ip && Object.assign(userData, { client_ip_address: ip })
    agent && Object.assign(userData, { client_user_agent: agent })
    externalid && Object.assign(userData, { external_id: externalid })

    if (fbclid && fbclid !== 'Unknow' && fbclid !== '-') {
      const fbc = `fb.1.${eventTime}.${fbclid}`

      Object.assign(userData, { fbc })
    }

    const params = {
      data: [{
        event_name: EVENT_NAME,
        event_time: eventTime,
        user_data: userData
      }]
    }

    await new AdsPixel(pixel).createEvent(fields, params)
  } catch (error) {
    console.log('ERROR: ' + error.message)
  }

  return res.end()
}

module.exports = postback
