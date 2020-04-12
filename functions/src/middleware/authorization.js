const ERROR_UNAUTHORIZED = 'Unauthorized!'

class Authorization {
  static get isAuthorized () {
    return (req, res, next) => {
      const {
        headers: { authorization }
      } = req

      if (!authorization || (typeof (authorization) !== 'string')) {
        return res.status(401).send({ message: ERROR_UNAUTHORIZED })
      }

      if (!authorization.startsWith('Bearer')) {
        return res.status(401).send({ message: ERROR_UNAUTHORIZED })
      }

      const split = authorization.split('Bearer ')

      if (split.length !== 2) {
        return res.status(401).send({ message: ERROR_UNAUTHORIZED })
      }

      const [, token] = split

      Object.assign(res.locals, { token })

      return next()
    }
  }
}

module.exports = Authorization
