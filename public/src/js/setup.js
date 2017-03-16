/**
 * public/src/js/setup/index.js - delish
 * 
 * Licensed under MIT license.
 * Copyright (C) 2017 Karim Alibhai.
 */

import log from './logger'
import Map from './map'
import createApp from './app'
import { Buffer } from 'buffer'

/**
 * Promise-ify Google map success.
 */
const mapReady = new Promise(resolve => {
        window.initMap = resolve
      })
    , loading = document.querySelector('.loading-screen')
    , errorMsg = document.querySelector('.loading-screen .error-msg')

/**
 * List of tasks, in the order that they
 * must be executed.
 */
const tasks = {
  order: [
    'Creating sexy map',
    'Wrapping up'
  ],

  /**
   * Creates a new Google map instance
   */
  'Creating sexy map': (resolve, reject) => {
    mapReady.then(() => {
      let map = document.createElement('div')
      map.id = 'map'
      document.body.insertBefore(map, loading)
      window.Map = new Map(map)

      resolve()
    }).catch(reject)
  },

  /**
   * Not actually wrapping up. This brings up the app
   * via angular.
   */
  'Wrapping up': createApp
}

/**
 * Handle task failure.
 */
function fail(err) {
  log('Things have gone horribly wrong. I think your computer is going to explode. But what do I know, I\'m just an error message.')
  
  let leadClasses = document.querySelector('.lead.next').classList
  leadClasses.add('col-8')
  leadClasses.add('offset-2')
  errorMsg.innerHTML = Buffer.from(err.stack || String(err), 'utf8').toString('base64')

  document.documentElement.classList.add('error')
}

/**
 * Executes tasks sequentionally.
 */
function next() {
  i += 1

  if (i === tasks.order.length) {
    log('Okay I\'m ready now.')

    setTimeout(() => {
      document.documentElement.classList.remove('loading')

      setTimeout(() => {
        document.body.removeChild(loading)
      }, 700)
    }, 2000)
  } else {
    let text = tasks.order[i]
    log(text + ' ...')

    new Promise(tasks[text])
      .then(next)
      .catch(fail)
  }
}

// start task execution, soon
let i = -1
setTimeout(next, 0)