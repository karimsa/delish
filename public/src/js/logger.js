/**
 * public/src/js/logger.js - delish
 * 
 * Licensed under MIT license.
 * Copyright (C) 2017 Karim Alibhai.
 */
/* globals $, trackJs */

const util = require('util')

let currentLog = $('.lead:eq(0)')
  , nextLog = $('.lead.next')
  , appHasFailed = false
  , logInProgress = false

/**
 * Actual logger.
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
 * Logs when current log is done.
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
 * Updates the current log status.
 * @param {?Function} done a callback to execute if the log happens
 * @param {String} message the string with formatting
 * @param {...Object} values any values to plug in
 */
export const log = function () {
  if (!appHasFailed) {
    return _log.apply(this, arguments)
  }
}

/**
 * Displays the error.
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
 * Handle task failure.
 */
export const fail = err => trackJs.track(err)