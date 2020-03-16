const rp = require('request-promise');
const sharp = require('sharp');
const Storage = require('./storage');

class GiftImage {
  static async render ({ input, output }) {
    try {
      const requestOptions = {
        url: input,
        encoding: null
      };

      const buffer = await rp(requestOptions);

      const avatar = await sharp(buffer)
        .resize(430, 430)
        .toBuffer();

      const fileBlob = await sharp('./static/images/gift.template.png')
        .composite([
          {
            input: Buffer.from(avatar),
            top: 321,
            left: 766
          }
        ])
        .sharpen()
        .toBuffer();

      const storage = new Storage();
      const { bucket, object } = await storage.create(output, fileBlob);

      return `https://storage.googleapis.com/${bucket}/${object}`
    } catch (error) {
      return error;
    }
  }
}

module.exports = GiftImage;
