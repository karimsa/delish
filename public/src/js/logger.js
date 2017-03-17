/**
 * public/src/js/logger.js - delish
 * 
 * Licensed under MIT license.
 * Copyright (C) 2017 Karim Alibhai.
 */
/* globals trackJs */

const util = require('util')
    , debounce = require('debounce')

let currentLog = document.querySelector('.lead')
  , nextLog = document.querySelector('.lead.next')
  , appHasFailed = false

/**
 * Actual logger.
 */
const _log = debounce(function (done) {
  let text

  if (typeof done === 'function') {
    text = util.format.apply(util, [].slice.call(arguments, 1))
  } else {
    text = util.format.apply(util, arguments)
    done = () => 0
  }

  // transition to the new log
  nextLog.innerText = text
  currentLog.classList.add('hide')
  nextLog.classList.remove('next')

  // after the CSS transition completes, swap
  // the log elements out
  setTimeout(() => {
    let parent = currentLog.parentElement

    parent.removeChild(currentLog)
    currentLog = nextLog

    nextLog = document.createElement('p')
    nextLog.classList.add('lead')
    nextLog.classList.add('next')
    parent.appendChild(nextLog)
  }, 700)

  // return reference to the log element used
  done(nextLog)
}, 700)

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
 * Handle task failure.
 */
export function fail(err) {
  appHasFailed = true
  trackJs.track(err)

  document.documentElement.classList.add('error')

  _log(logElm => {
    logElm.classList.add('error-msg')
    logElm.classList.add('col-8')
    logElm.classList.add('offset-2')
  }, 'Things have gone horribly wrong. I think your computer is going to explode. But what do I know, I\'m just an error message.')
}