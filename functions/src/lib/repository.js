const { Firestore } = require('firebase-nodejs-helpers')
const firestore = new Firestore()

class Repository {
  constructor({ path }) {
    this.path = path
  }

  list (params) {
    return firestore.list(this.path, params)
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
    return firestore.update(`${this.path}/${id}`, params)
  }

  delete (id) {
    return firestore.delete(`${this.path}/${id}`)
  }
}

module.exports = Repository
