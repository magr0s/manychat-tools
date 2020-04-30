const functions = require('firebase-functions')

const { FirebaseAdmin } = require('firebase-nodejs-helpers')
const config = require(`./src/config/${process.env.GCLOUD_PROJECT}.json`)

FirebaseAdmin.init({ config })

const server = require('./src/server')
const Scheduler = require('./src/scheduler')

const {
  postback,
  actions
} = require('./src/webhooks')

exports.api = functions.https.onRequest(server)

exports.scheduler = functions.pubsub.schedule('*/30 * * * *').onRun(() => (Scheduler.run()))

exports.postback = functions.https.onRequest(postback)
exports.actions = functions.https.onRequest(actions)

