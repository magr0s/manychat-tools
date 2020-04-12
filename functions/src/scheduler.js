const Workers = require('./workers')

class Scheduler {
  static run (ctx) {
    const workers = Object.values(Workers)

    workers.forEach(worker => (worker.start()))

    return true
  }
}

module.exports = Scheduler
