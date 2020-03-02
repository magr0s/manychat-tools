const { SubscriberManychat } = require('../../../lib/manychat')
const { MANYCHAT_CONFIG } = require('../../../config')

const { VERSION } = MANYCHAT_CONFIG

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
      version: VERSION,
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

module.exports = {
  getInfo
}
