const { listChannels } = require('../lnd-actions')

/**
 * Returns a boolean, true if there is an active channel between caller and remote parties that sufficient funds for an order, false if not
 *
 * @param {string} destination is the remotePubkey
 * @param {Integer} value is the minimum value that needs to be in the channel
 * @param {Object} options, outbound is defaulted to true, outbound is true if checking outbound channels, false if inbound,

 * @return {Boolean} if a channel with sufficient funds exists
 */
async function isBalanceSufficient (destination, value, options = {outbound: true}) {
  const { outbound } = options
  const activeChannels = await listChannels({ client: this.client })
  const balance = outbound ? 'localBalance' : 'remoteBalance'

  return activeChannels.filter(channel => channel.remotePubkey === destination).some(channel => channel[balance] >= value)
}

module.exports = isBalanceSufficient
