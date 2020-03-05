const text2png = require('text2png')
const sharp = require('sharp')
const Storage = require('./storage')

class SignImage {
  async render (params) {
    const {
      input,
      output,
      text
    } = params

    const textImage = await this.renderTextImage(text)

    const textImageBuffer = await sharp(textImage)
      .resize({
        width: 180,
        height: 120,
        fit: 'contain',
        gravity: 'center',
        position: 'center',
        background: { r: 0, b: 0, g: 0, alpha: 0 }
      })
      .rotate(20, {
        background: { r: 0, b: 0, g: 0, alpha: 0 }
      })
      .toBuffer()

    const fileBlob = await sharp(input)
      .composite([{
        input: textImageBuffer,
        top: 330,
        left: 535
       }])
      .sharpen()
      .toBuffer()

    const storage = new Storage()
    const imageData = await storage.create(output, fileBlob)
    const imageURL = this.buildURL(imageData)

    return imageURL
  }

  buildURL ({ bucket, object }) {
    return `https://storage.googleapis.com/${bucket}/${object}`
  }

  async renderTextImage (text) {
    const _text = text.split(' ').join('\n')

    return text2png(_text, {
      font: "36px Great_Park",
      localFontPath: "./static/fonts/Windsor_Great_Park-Regular.ttf",
      localFontName: "Great_Park",
      color: "#111111",
      textAlign: "center",
      lineSpacing: 8
    })
  }
}

module.exports = SignImage
