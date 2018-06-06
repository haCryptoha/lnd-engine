const addInvoice = require('./add-invoice')
const connectPeer = require('./connect-peer')
const getInfo = require('./get-info')
const listInvoices = require('./list-invoices')
const listPeers = require('./list-peers')
const lookupInvoice = require('./lookup-invoice')
const newAddress = require('./new-address')
const openChannel = require('./open-channel')
const walletBalance = require('./wallet-balance')
const decodePayReq = require('./decode-pay-req')

module.exports = {
  addInvoice,
  connectPeer,
  getInfo,
  listInvoices,
  listPeers,
  lookupInvoice,
  newAddress,
  openChannel,
  walletBalance,
  decodePayReq
}
