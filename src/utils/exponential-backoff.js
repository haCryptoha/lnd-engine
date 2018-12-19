const delay = require('./delay')

/**
 * Delay multiplier - Value in milliseconds
 *
 * @constant
 * @type {Number} milliseconds
 * @default
 */
const DELAY_MULTIPLIER = 1.5

/**
 * Attempts to retry validating an engine
 *
 * @constant
 * @type {Number}
 * @default
 */
const EXPONENTIAL_BACKOFF_ATTEMPTS = 24

/**
 * Delay in each retry attempt to validating an engine
 *
 * @constant
 * @type {Number} milliseconds
 * @default
 */
const EXPONENTIAL_BACKOFF_DELAY = 5000

/**
 * Calls a function repeatedly until success or throws if it fails on final retry
 *
 * @param {Function} callFunction
 * @param {Object} [payload={}] - information for error log during backoff failures
 * @param {Object} opts
 * @param {String} opts.debugName
 * @param {Number} [attempts=EXPONENTIAL_BACKOFF_ATTEMPTS] opts.attempts - attempts left
 * @param {Number} [delayTime=EXPONENTIAL_BACKOFF_DELAY] opts.delayTime - delay in milliseconds between calls
 * @param {Logger} [delayTime=EXPONENTIAL_BACKOFF_DELAY] opts.logger
 * @return {Promise}
 */
async function exponentialBackoff (callFunction, payload = {}, { debugName = null, attempts = EXPONENTIAL_BACKOFF_ATTEMPTS, delayTime = EXPONENTIAL_BACKOFF_DELAY, logger = console }) {
  try {
    var res = await callFunction()
  } catch (error) {
    if (attempts > 0) {
      const attemptsLeft = attempts - 1
      const nextDelayTime = delayTime * DELAY_MULTIPLIER

      if (debugName) {
        logger.error(`Error calling ${debugName}. Retrying in ${Math.round(delayTime / 1000)} seconds, attempts left: ${attemptsLeft}`, { payload, error: error.message })
      } else {
        logger.error(`Error calling ${callFunction}. Retrying in ${Math.round(delayTime / 1000)} seconds, attempts left: ${attemptsLeft}`, { payload, error: error.message })
      }

      await delay(delayTime)
      res = await exponentialBackoff(callFunction, payload, { debugName, attempts: attemptsLeft, delayTime: nextDelayTime, logger })
    } else {
      throw new Error(error, `Error with ${callFunction}, no retry attempts left`)
    }
  }

  return res
}

module.exports = exponentialBackoff
