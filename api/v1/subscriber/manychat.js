const rp = require('request-promise')

class ManyChat {
  constructor (params) {
    const { token } = params
    
    this._token = token
  }  
  
  _get (endpoint, qs) {
    const options = {
      url: `https://api.manychat.com${endpoint}`,
      json: true,
      qs,
      
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    }
    
    return rp(options)
  }
  
  prepareResponse (data) {
    const {
      profile_pic: profilePic,
      name
    } = data
    
    return {
      version: 'v2',
      content: {
        messages: [
          {
            "type": "text",
            "text": `${name} 👇`
          },
          {
            type: 'image',
            url: profilePic,
            buttons: []
          }
        ]
      }
    }
  }
  
  get token () {
    return this._token
  }
}

class SubscriberManyChat extends ManyChat {
  getInfo (id) {
    return this._get('/fb/subscriber/getInfo', { subscriber_id: id })
      .then(({ data }) => (this.prepareResponse(data)))
  }
}

module.exports = { SubscriberManyChat }