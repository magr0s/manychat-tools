const { FacebookAdsApi, Ad } = require('facebook-nodejs-business-sdk')

const actions = async ({ query }, res) => {
  const {
    ad_id: adId,
    access_token: accessToken
  } = query

  if (!adId) throw new Error('Ad ID required.')
  if (!accessToken) throw new Error('Access Token required.')

  const fields = []
  const params = { status: 'PAUSED' }

  try {
    const api = FacebookAdsApi.init(accessToken, 'en_US', false)

    api.setDebug(true)

    await new Ad(adId).update(fields, params)
  } catch ({ message }) {
    console.log(`ERROR: ${message}`)
  }

  res.end()
}

module.exports = actions
