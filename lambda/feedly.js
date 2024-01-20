const axios = require('axios')
const _ = require('lodash')

const API_ENDPOINT = 'https://cloud.feedly.com'

// "Page Not Found" now 🥲
// https://developer.feedly.com/v3/streams/#get-the-content-of-a-stream
const getAllUnreadContents = async (streamId, projections) => {
  try {
    let allContents = []
    let nextPageToken = null

    do {
      const url = `${API_ENDPOINT}/v3/streams/${streamId}/contents`
      const config = {
        headers: {
          // Need to "Upgrade to Feedly Pro" now 🥲
          // https://feedly.com/v3/auth/dev
          'Authorization': `Bearer ${process.env.FEEDLY_ACCESS_TOKEN}`
        },
        params: {
          unreadOnly: true,
          continuation: nextPageToken,
          count: 250 // number of entries to return. default is 20. max is 250.
        }
      }
      const resp = await axios.get(url, config)
      const { items, continuation } = resp.data
      // console.log('Response:', { items, continuation })
      // console.dir({ items, continuation }, { depth: null })
      // console.log(items.length)
      if (items) {
        const contents = _.map(items, item => _.pick(item, projections))
        allContents = allContents.concat(contents)
      }

      nextPageToken = continuation
    } while (nextPageToken)

    return allContents
  } catch (err) {
    console.error('Error:', err)
    return []
  }  
}

module.exports = {
  getAllUnreadContents
}
