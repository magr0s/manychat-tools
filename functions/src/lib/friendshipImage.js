const rp = require('request-promise');
const sharp = require('sharp');
const Storage = require('./storage');
const fs = require('fs')

const { 
  APP_CONFIG: {
    FRIENDSHIPS_TEMPLATE_FOLDER
  }
} = require('../config')

class FriendshipImage {
 static async render ({ input, output, tpl }) {
    try {
      const requestOptions = {
        url: input,
        encoding: null
      };

      const buffer = await rp(requestOptions);

      const avatar = await sharp(buffer)
        .resize(458, 498)
        .toBuffer();

      const template = FRIENDSHIPS_TEMPLATE_FOLDER + `${tpl}.png`

      if (!fs.existsSync(template)) {
        throw new Error('Template not found.')
      }

      const fileBlob = await sharp(template)
        .composite([
          { input: Buffer.from(avatar) },
          { input: template}
        ])
        .sharpen()
        .toBuffer();

      const storage = new Storage();
      const { bucket, object } = await storage.create(output, fileBlob);

      return `https://storage.googleapis.com/${bucket}/${object}`
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

module.exports = FriendshipImage;
