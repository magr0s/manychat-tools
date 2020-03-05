const admin = require('firebase-admin')
const config = require(`../config/${process.env.GCLOUD_PROJECT}.json`)

admin.initializeApp({
  credential: admin.credential.cert(config),
  storageBucket: `${process.env.GCLOUD_PROJECT}.appspot.com`
})

class Storage {
  constructor () {
    this.storage = admin.storage().bucket()
  }

  create (filePath, data) {
    const file = this.storage.file(filePath)

    return new Promise((resolve, reject) => {
      const stream = file.createWriteStream({
        metadata: {
          contentType: "image/jpeg"
        }
      })

      stream.on('error', (error) => {
        reject(error)
      })

      stream.on('finish', async () => {
        const [data] = await file.makePublic()

        resolve(data)
      })

      stream.end(data)
    })
  }
}

module.exports = Storage
