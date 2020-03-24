const { MANYCHAT_CONFIG } = require('../../config')

const { API_VERSION } = MANYCHAT_CONFIG

class ResponseManychat {
  static output ({ messages, actions, replies }) {
    const content = {}

    Array.isArray(messages) && messages.length && Object.assign(content, { messages })
    Array.isArray(actions) && actions.length && Object.assign(content, { actions })
    Array.isArray(replies) && replies.length && Object.assign(content, { quick_replies: replies })

    return {
      version: API_VERSION,
      content
    }
  }
}

module.exports = ResponseManychat
