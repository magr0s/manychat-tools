const { TrackerRepository } = require('../repository')
const { Binom, BinomConstants } = require('binom-nodejs')
const { SubscriberManychat } = require('../lib/manychat')

const { APP_CONFIG } = require('../config')
const { CKICK_TRACKER_TAGNAME } = APP_CONFIG

const trackerRepo = new TrackerRepository()

class СlickTrackerWorker {
  static async start () {
    try {
      const list = (await trackerRepo.list())
        // Sort to up of earlier or not sync entries
        .sort(({ syncTime: a = 0 }, { syncTime: b = 0 }) => (a - b))

      await list.reduce(async (promise, data) => {
        await promise

        const {
          id,
          camps,
          userId,
          manychatToken,
          trackerURL,
          trackerToken,
          createdAt = 0
        } = data

        // Check is not older than 24 hours
        if (createdAt <= (new Date().getTime() - (24 * 60 * 60 * 1000))) {
          return trackerRepo.delete(id)
        }

        const binom = new Binom(trackerURL, trackerToken)

        const response = await binom.getCampaignReport({
          camps,
          groups: [BinomConstants.groups.t1],
          date: BinomConstants.dates.all,
          search_report: userId
        })

        if (
          Array.isArray(response) &&
          (response.findIndex(({ name, leads }) => (name === userId && parseInt(leads) !== 0)) !== -1)
        ) {
          try {
            const subscriber = new SubscriberManychat({ token: manychatToken })

            await subscriber.addTagByName({
              subscriber_id: userId,
              tag_name: CKICK_TRACKER_TAGNAME
            })
              .then((response) => {
                const { status } = response

                if (status === 'error') {
                  const { message } = response

                  throw new Error(message)
                }

                return response
              })

            await trackerRepo.delete(id)
          } catch (error) {
            console.log(error)
          }
        } else {
          await trackerRepo.edit(id, {
            syncTime: new Date().getTime()
          })
        }

        return Promise.resolve()
      }, Promise.resolve())
    } catch (error) {
      throw error
    }
  }
}

module.exports = СlickTrackerWorker
