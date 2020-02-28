const express = require("express")
const api = require('./api/routes')

const app = express()

app
  .use('/api', api)
  .get('*', (_, res) => (
    res.status(404)
      .json({
        success: false,
        data: 'Error: Endpoint not found.'
      })
  ))

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {  
  console.log("Your app is listening on port " + listener.address().port)
})
