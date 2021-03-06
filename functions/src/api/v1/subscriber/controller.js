const rp = require('request-promise')
const { SubscriberManychat } = require('../../../lib/manychat')
const SignImage = require('../../../lib/signImage')
const FriendshipImage = require('../../../lib/friendshipImage')
const GiftImage = require('../../../lib/giftImage')
const GiftImageCard = require('../../../lib/giftImageCard')
const GiftImageCard500 = require('../../../lib/giftImageCard500')
const GiftImageCard750 = require('../../../lib/giftImageCard750')
const { TrackerRepository } = require('../../../repository')

const {
  APP_CONFIG,
  MANYCHAT_CONFIG,
  SIGNIMAGE_CONFIG
} = require('../../../config')

const { APP_URL } = APP_CONFIG
const { API_VERSION } = MANYCHAT_CONFIG

const {
  IMAGES_FOLDER,
  BASE_SIGNIMAGE
} = SIGNIMAGE_CONFIG

const tracker = new TrackerRepository()

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

    // TODO: Refactor to external request

    const actions = addressData.reduce((arr, { types, long_name: longName }) => {
      const obj = {}

      types.includes('locality') && Object.assign(obj, { key: 'SCFCity', value: longName })
      types.includes('administrative_area_level_2') && Object.assign(obj, { key: 'SCFDistrict', value: longName })
      types.includes('route') && Object.assign(obj, { key: 'SCFStreet', value: longName })
      types.includes('country') && Object.assign(obj, { key: 'SCFCountry', value: longName })

      Object.keys(obj).length && arr.push(obj)

      return arr
    }, [])
      .map(({ key, value }) => ({
        action: "set_field_value",
        field_name: key,
        value
      }))

    return res.status(200).send({
      version: API_VERSION,
      content: {
        actions
      }
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send(error)
  }
}

const getSign = async (req, res) => {
  const {
    locals: { token }
  } = res

  const {
    params: { id }
  } = req

  const subscriber = new SubscriberManychat({ token })

  try {
    const {
      name
    } = await subscriber.getInfo(id)

    const signImage = new SignImage()

    const imageURL = await signImage.render({
      input: BASE_SIGNIMAGE,
      output: `${IMAGES_FOLDER}/sign.${id}-${Date.now()}.jpeg`,
      text: name
    })

    return res.status(200).send({
      version: 'v2',
      content: {
        messages: [
          {
            type: 'image',
            url: imageURL
          }
        ]
      }
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send(error)
  }
}

const getFriendship = async (req, res) => {
  const {
    locals: { token }
  } = res

  const {
    params: {
      id,
      tpl = 1
    }
  } = req

  const subscriber = new SubscriberManychat({ token })

  try {
    const {
      profile_pic: profilePic
    } = await subscriber.getInfo(id);

    if (!profilePic) {
      throw new Error('User profile picture is empty.')
    }

    const friendshipImage = await FriendshipImage.render({
      input: profilePic,
      output: `${IMAGES_FOLDER}/friendship.${tpl}.${id}-${Date.now()}.jpeg`,
      tpl
    });

    return res.status(200).send({
      version: 'v2',
      content: {
        messages: [
          {
            type: 'image',
            url: friendshipImage
          }
        ]
      }
    })
  } catch ({ message }) {
    return res.status(500).send({ error: message })
  }
}

const getGift = async (req, res) => {
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
    } = await subscriber.getInfo(id);

    const giftImage = await GiftImage.render({
      text: name,
      input: profilePic,
      output: `${IMAGES_FOLDER}/gift.${id}-${Date.now()}.jpeg`
    });

    return res.status(200).send({
      version: 'v2',
      content: {
        messages: [
          {
            type: 'image',
            url: giftImage
          }
        ]
      }
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send(error)
  }
}


const getGiftCard = async (req, res) => {
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
    } = await subscriber.getInfo(id);

    const giftImage = await GiftImageCard.render({
      text: name,
      input: profilePic,
      output: `${IMAGES_FOLDER}/gift.${id}-${Date.now()}.jpeg`
    });

    return res.status(200).send({
      version: 'v2',
      content: {
        messages: [
          {
            type: 'image',
            url: giftImage
          }
        ]
      }
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send(error)
  }
}


const getGiftCard500 = async (req, res) => {
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
    } = await subscriber.getInfo(id);

    const giftImage = await GiftImageCard500.render({
      text: name,
      input: profilePic,
      output: `${IMAGES_FOLDER}/gift.${id}-${Date.now()}.jpeg`
    });

    return res.status(200).send({
      version: 'v2',
      content: {
        messages: [
          {
            type: 'image',
            url: giftImage
          }
        ]
      }
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send(error)
  }
}

const getGiftCard750 = async (req, res) => {
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
    } = await subscriber.getInfo(id);

    const giftImage = await GiftImageCard750.render({
      text: name,
      input: profilePic,
      output: `${IMAGES_FOLDER}/gift.${id}-${Date.now()}.jpeg`
    });

    return res.status(200).send({
      version: 'v2',
      content: {
        messages: [
          {
            type: 'image',
            url: giftImage
          }
        ]
      }
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send(error)
  }
}

const setClickTracker = async (req, res) => {
  const {
    locals: { token }
  } = res

  const {
    body
  } = req

  const {
    userId,
    campId,
    trackerURL,
    trackerToken
  } = body

  if (
    !userId ||
    !campId ||
    !trackerURL ||
    !trackerToken
  ) {
    return res.status(400).send({ code: 'subscriber/bad-userId'})
  }

  try {
    const params = Object.assign({}, body, {
      manychatToken: token,
      createdAt: new Date().getTime()
    })

    await tracker.create(params)

    return res.status(200).send({ success: true })
  } catch ({ message }) {
    return res.status(500).send({ error: message })
  }
}

module.exports = {
  getInfo,
  getLocation,
  getSign,
  getFriendship,
  getGift,
  getGiftCard,
  getGiftCard500,
  getGiftCard750,
  setClickTracker
}
