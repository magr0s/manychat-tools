const Repository = require('../lib/repository')

class TrackerRepository extends Repository {
  constructor () {
    const options = {
      path: 'trackers'
    }

    super(options)
  }
}

module.exports = TrackerRepository
