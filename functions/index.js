const functions = require('firebase-functions')

const { FirebaseAdmin } = require('firebase-nodejs-helpers')
const config = require(`./src/config/${process.env.GCLOUD_PROJECT}.json`)

FirebaseAdmin.init({ config })

const server = require('./src/server')

exports.api = functions.https.onRequest(server)
