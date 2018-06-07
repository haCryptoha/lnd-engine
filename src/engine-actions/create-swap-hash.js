const { addInvoice } = require('../lnd-actions')

// default expiry for swap hashes is 3600 seconds - 1 hour.
// TODO: should we change that?
const SWAP_EXPIRY = '3600'
const MEMO_PREFIX = 'kinesis:'


/**
 * Creates a swap hash to prepare for a swap
 *
 * @param {String} orderId order ID for the swap hash
 * @param {Number} value
 * @returns {String} rHash hash of invoice from lnd
 */
async function createSwapHash (orderId, value) {
  const expiry = SWAP_EXPIRY
  const memo = `${MEMO_PREFIX}${orderId}`
  const { rHash } = await addInvoice(memo, expiry, value, { client: this.client })
  return rHash
}

module.exports = createSwapHash
