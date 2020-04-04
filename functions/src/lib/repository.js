const { Firestore } = require('firebase-nodejs-helpers')
const firestore = new Firestore()

class Repository {
  constructor({ path }) {
    this.path = path
  }

  list (conditions) {
    return firestore.list(this.path, { conditions, orderBy, limit })
      .then(({ docs }) => (
        docs.map((doc) => {
          const { id } = doc

          return Object.assign({}, doc.data(), { id })
        })
      ))
  }

  create (params) {
    return firestore.create(this.path, params)
  }

  edit (id, params) {
    return firestore(`${this.patch}/${id}`, params)
  }
}

module.exports = Repository
