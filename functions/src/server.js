const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const api = require('./api/routes')

const app = express()

app.use(express.static('static'))
  .use(bodyParser.json())
  .use(cors({ origin: true }))
  .use('/', api)
  .get('*', (_, res) => (
    res.status(404)
      .json({
        success: false,
        data: 'Error: Endpoint not found.'
      })
  ))

module.exports = app
