const rp = require('request-promise');
const sharp = require('sharp');
const Storage = require('./storage');
const text2png = require('text2png');

class GiftImage {
  static async render ({ input, output, text }) {
    try {
      const requestOptions = {
        url: input,
        encoding: null
      };

      const buffer = await rp(requestOptions);

      const avatar = await sharp(buffer)
        .resize(370, 370)
        .toBuffer();

      const textImage = await sharp(
        await text2png(text, {
          color: "#111111"
        })
      )
        .resize({
          width: 600,
          height: 33,
          fit: 'contain',
          gravity: 'center',
          position: 'center',
          background: { r: 0, b: 0, g: 0, alpha: 0 }
        })
        .toBuffer();

      const fileBlob = await sharp('./static/images/gift.template.png')
        .composite([
          {
            input: Buffer.from(textImage),
            top: 320,
            left: 585
          },
          {
            input: Buffer.from(avatar),
            top: 385,
            left: 820
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