/**
 * @file public/src/js/location.js
 * @author Karim Alibhai
 * @license MIT
 * @copyright Karim Alibhai 2017
 */
/**
 * Interface for logging during setup and failing.
 * @module logger
 */
/* globals $, trackJs */

const util = require('util')

let currentLog = $('.lead:eq(0)')
  , nextLog = $('.lead.next')
  , appHasFailed = false
  , logInProgress = false

/**
 * Private logger that logs in an animated fashion.
 * @param {String} message a formatter string (as passed to util.format)
 * @param {...Object} values values to format in (as passed to util.format)
 * @returns {HTMLElement} the element that the log is written into
 */
const _log = function () {
  if (logInProgress) return;
  logInProgress = true

  let text = util.format.apply(util, arguments)

  // ensure that dom is ready
  if (Math.min(currentLog.length, nextLog.length) === 0) {
    currentLog = $('.lead:eq(0)')
    nextLog = $('.lead.next')

    if (Math.min(currentLog.length, nextLog.length) === 0) {
      logInProgress = false
      return $(() => _log(text))
    }
  }

  // transition to the new log
  nextLog.text(text)
  currentLog.addClass('hide')
  nextLog.removeClass('next')

  // after the CSS transition completes, swap
  // the log elements out
  setTimeout(() => {
    let parent = currentLog.parent()
    currentLog.remove()
    currentLog = nextLog

    nextLog = $('<p class="lead next"></p>')
    parent.append(nextLog)

    logInProgress = false
  }, 700)

  // return reference to the log element used
  return nextLog
}

/**
 * Logs when current log is done and the DOM is ready.
 * @param {Function} done callback to execute when log is executed, it will be passed the log element
 * @param {String} message a formatter string (as passed to util.format)
 * @param {...Object} values values to format in (as passed to util.format)
 */
function logLater(done) {
  const args = [].slice.call(arguments)

  if (Math.min(currentLog.length, nextLog.length) === 0) {
    currentLog = $('.lead:eq(0)')
    nextLog = $('.lead.next')

    setTimeout(() => logLater.apply(this, args), 0)
  } else if (logInProgress) {
    setTimeout(() => logLater.apply(this, args), 0)
  } else {
    done(_log.apply(this, args.slice(1)))
  }
}

/**
 * Updates the current log status (if app is alive).
 * @param {String} message the string with formatting
 * @param {...Object} values any values to plug in
 * @returns {HTMLElement} the element that the log is written into
 */
export const log = function () {
  if (!appHasFailed) {
    return _log.apply(this, arguments)
  }
}

/**
 * Displays static error message and causes application failure. Not to be invoked directly.
 */
export function failOnce() {
  if (appHasFailed) return;
  appHasFailed = true
  $('html').addClass('error')

  logLater(logElm =>
    logElm.addClass('error-msg')
          .addClass('col-8')
          .addClass('offset-2')
  , 'Things have gone horribly wrong. I think your computer is going to explode. But what do I know, I\'m just an error message.')
}

/**
 * An alias for trackJs.track().
 * @param {Error} err an error object
 */
export const fail = err => trackJs.track(err)