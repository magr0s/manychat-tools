const functions = require('firebase-functions')
const server = require('./src/server')

exports.api = functions.https.onRequest(server)
