const rp = require('request-promise')
const { SubscriberManychat } = require('../../../lib/manychat')
const { MANYCHAT_CONFIG } = require('../../../config')

const { API_VERSION } = MANYCHAT_CONFIG

const getInfo = async (req, res) => {
  const {
    locals: { token }
  } = res

  const {
    params: { id }
  } = req

  const subscriber = new SubscriberManychat({ token })

  try {
    const {
      name,
      profile_pic: profilePic
    } = await subscriber.getInfo(id)

    return res.status(200).send({
      version: API_VERSION,
      content: {
        messages: [
          {
            "type": "text",
            "text": `${name} 👇`
          },
          {
            type: 'image',
            url: profilePic
          }
        ]
      }
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send(error)
  }
}

const getLocation = async (req, res) => {
  const {
    locals: { token }
  } = res

  const {
    params: { id }
  } = req

  const subscriber = new SubscriberManychat({ token })

  try {
    const { custom_fields: cf } = await subscriber.getInfo(id)

    const location = cf.find(item => (item.name === 'SCFLocation'))
    const { value: geocode } = location

    const geoCoderOptions = {
      url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${geocode}&key=AIzaSyAwX1Dw-6Xjv1485medbK24YlRboohb0bQ`,
      json: true
    }

    const { results } = await rp(geoCoderOptions)
    const [data, ] = results

    const { address_components: addressData } = data

    const { long_name: city } = addressData.find(
      ({ types }) => (types.includes('locality') || types.includes('administrative_area_level_2'))
    )

    return res.status(200).send({
      version: API_VERSION,
      content: {
        messages: [
          {
            type: 'text',
            text: `I came from ${city}`
          }
        ],
        actions: [
          {
            "action": "set_field_value",
            "field_name": "SCFLocation",
            "value": city
          }
        ]
      }
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send(error)
  }
}

module.exports = {
  getInfo,
  getLocation
}
