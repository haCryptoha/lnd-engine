const { deadline } = require('../grpc-utils')

/**
 * Returns a list of completed payments
 *
 * @see https://api.lightning.community/#listpayments
 * @param {Object} opts
 * @param {LndClient} opts.client
 * @returns {Promise<Object>}
 */
function listPayments ({ client }) {
  return new Promise((resolve, reject) => {
    client.listPayments({}, { deadline: deadline() }, (err, res) => {
      if (err) return reject(err)
      return resolve(res)
    })
  })
}

module.exports = listPayments
