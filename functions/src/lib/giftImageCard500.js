const rp = require('request-promise');
const sharp = require('sharp');
const Storage = require('./storage');
const text2png = require('text2png');

class GiftImageCard500 {
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
          color: "#111111",
          font: "36px Arial_Bold",
          localFontPath: "./static/fonts/arial-bold.ttf",
          localFontName: "Arial_Bold",
        })
      )
        .resize({
          width: 600,
          height: 35,
          fit: 'contain',
          gravity: 'center',
          position: 'right',
          background: { r: 0, b: 0, g: 0, alpha: 0 }
        })
        .toBuffer();

      const fileBlob = await sharp('./static/images/gift-blue.template-500.png')
        .composite([
          {
            input: Buffer.from(textImage),
            top: 485,
            left: 555
          },
          {
            input: Buffer.from(avatar),
            top: 95,
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

module.exports = GiftImageCard500;
