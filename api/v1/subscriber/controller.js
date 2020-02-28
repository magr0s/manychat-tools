const { SubscriberManyChat } = require('./manychat')

const getInfo = async (req, res) => {
  const {
    locals: { token }
  } = res

  const {
    params: { id }
  } = req

  const subscriber = new SubscriberManyChat({ token })

  try {
    const response = await subscriber.getInfo(id)

    return res.status(200).send(response)
  } catch (error) {
    console.log(error)
    return res.status(500).send(error)
  }
}

module.exports = {
  getInfo
}
