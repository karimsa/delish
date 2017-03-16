/**
 * public/src/js/logger.js - delish
 * 
 * Licensed under MIT license.
 * Copyright (C) 2017 Karim Alibhai.
 */

const util = require('util')

let currentLog = document.querySelector('.lead')
  , nextLog = document.querySelector('.lead.next')

/**
 * Updates the current log status.
 * @param {String} message the string with formatting
 * @param {...Object} values any values to plug in
 */
export default function () {
  let text = util.format.apply(util, arguments)

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

    nextLog = document.createElement('div')
    nextLog.classList.add('lead')
    nextLog.classList.add('next')
    parent.appendChild(nextLog)
  }, 700)
}