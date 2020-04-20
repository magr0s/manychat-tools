const functions = require('firebase-functions')

const { FirebaseAdmin } = require('firebase-nodejs-helpers')
const config = require(`./src/config/${process.env.GCLOUD_PROJECT}.json`)

FirebaseAdmin.init({ config })

const server = require('./src/server')
const Scheduler = require('./src/scheduler')

const webhooks = require('./src/webhooks')

exports.api = functions.https.onRequest(server)

exports.scheduler = functions.pubsub.schedule('*/30 * * * *').onRun(() => (Scheduler.run()))

const webhooksFactory = () => (
  Object.keys(webhooks).reduce((memo, webhook) => {
    memo[webhook] = functions.https.onRequest(webhooks[webhook])

    return memo
  }, {})
)

exports.webhooks = webhooksFactory()
