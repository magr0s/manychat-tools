const { FacebookAdsApi, AdsPixel } = require('facebook-nodejs-business-sdk')

const EVENT_NAME = 'Lead'

const postback = async ({ query }, res) => {
  const {
    pixel,
    token,
    time,
    ip,
    agent
  } = query

  const fields = []

  try {
    if (!token || token === 'Unknown') throw new Error('Token is incorrect')
    if (!pixel || pixel === 'Unknown') throw new Error('Pixel ID incorrect')

    const api = FacebookAdsApi.init(token, 'en_US', false)

    api.setDebug(true)

    const eventTime = time - (3 * 3600)

    const params = {
      data: [{
        event_name: EVENT_NAME,
        event_time: eventTime,
        user_data: {
          client_ip_address: ip,
          client_user_agent: agent
        }
      }]
    }

    await new AdsPixel(pixel).createEvent(fields, params)
  } catch (error) {
    console.log('ERROR: ' + error.message)
  }

  return res.end()
}

module.exports = postback
