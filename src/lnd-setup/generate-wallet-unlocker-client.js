/**
 * Wallet Unlocker Client Module
 * @module src/lnd-setup/generate-wallet-unlocker-client
 */

const grpc = require('grpc')
const loadProto = require('../utils/load-proto')
const fs = require('fs')

/**
 * Generates a lnrpc.WalletUnlocker client which is only used on initialization of the LND
 * node.
 *
 * @function
 * @param {LndEngine} - engine
 * @param {String} engine.host
 * @param {String} engine.protoPath
 * @param {String} engine.tlsCertPath
 * @returns {grpc.Client} lnrpc WalletUnlocker client definition
 */
function generateWalletUnlockerClient ({ host, protoPath, tlsCertPath }) {
  const { lnrpc } = loadProto(protoPath)

  if (!fs.existsSync(tlsCertPath)) {
    throw new Error(`LND-ENGINE error - tls cert file not found at path: ${tlsCertPath}`)
  }

  const tls = fs.readFileSync(tlsCertPath)
  const tlsCredentials = grpc.credentials.createSsl(tls)

  return new lnrpc.WalletUnlocker(host, tlsCredentials)
}

module.exports = generateWalletUnlockerClient
