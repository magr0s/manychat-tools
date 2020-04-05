const { TrackerRepository } = require('../repository')
const { Binom, BinomConstants } = require('binom-nodejs')
const { SubscriberManychat } = require('../lib/manychat')

const { APP_CONFIG } = require('../config')
const { CKICK_TRACKER_TAGNAME } = APP_CONFIG

const trackerRepo = new TrackerRepository()

class СlickTrackerWorker {
  static async start () {
    const conditions = [
      {
        field: 'status',
        operator: '==',
        value: false
      }
    ]

    try {
      const list = await trackerRepo.list(conditions)

      await list.reduce(async (promise, data) => {
        await promise

        const {
          id,
          camps,
          trackerURL,
          trackerToken
        } = data

        const binom = new Binom(trackerURL, trackerToken)

        const response = await binom.getCampaignReport({
          camps,
          groups: [BinomConstants.groups.t1],
          date: BinomConstants.dates.all
        })

        if (Array.isArray(response)) {
          if (response.findIndex(({ name }) => (name === userId)) !== -1) {
            try {
              const subscriber = new SubscriberManychat({ token })

              await subscriber.addTagByName({
                subscriber_id: userId,
                tag_name: CKICK_TRACKER_TAGNAME
              })

              await trackerRepo.edit(id, { status: true })
            } catch (error) {
              console.log(error)
            }
          }
        }

        return Promise.resolve()
      }, Promise.resolve())
    } catch (error) {
      throw error
    }
  }
}

module.exports = СlickTrackerWorker
