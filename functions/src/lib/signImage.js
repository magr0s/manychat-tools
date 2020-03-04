const text2png = require('text2png')
const sharp = require('sharp')

class SignImage {
  constructor () {

  }

  async render (params) {
    const {
      input,
      output,
      text
    } = params

    const textImage = await this.renderTextImage(text)

    const textImageBuffer = await sharp(textImage)
      .resize({
        width: 160,
        fit: 'contain',
        gravity: 'center',
        position: 'center',
        background: { r: 0, b: 0, g: 0, alpha: 0 }
      })
      .rotate(20, {
        background: { r: 0, b: 0, g: 0, alpha: 0 }
      })
      .toBuffer()

    await sharp(input)
      .composite([{
        input: textImageBuffer,
        top: 355,
        left: 550
       }])
      .sharpen()
      .png()
      .toFile(output)
  }

  async renderTextImage (text) {
    const _text = text.split(' ').join('\n')

    return text2png(_text, {
      font: "36px Great_Park",
      localFontPath: "./static/fonts/Windsor_Great_Park-Regular.ttf",
      localFontName: "Great_Park",
      color: "#222222",
      textAlign: "center",
      lineSpacing: 10
    })
  }
}

module.exports = SignImage
