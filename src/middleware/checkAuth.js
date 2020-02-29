const checkAuth = (req, res, next) => {
  const {
    headers: {
      authorization
    }
  } = req
  
  if (!authorization || typeof (authorization) !== 'string') {
    return res.status(401).send({ message: 'Unauthorized' })
  }
  
  if (!authorization.startsWith('Bearer')) {
    return res.status(401).send({ message: 'Unauthorized' })
  }
  
  const split = authorization.split('Bearer ')
  
  if (split.length !== 2) {
    return res.status(401).send({ message: 'Unauthorized' })
  }
  
  const [, token] = split
  
  Object.assign(res.locals, { token })
  
  
  next()
}

module.exports = checkAuth