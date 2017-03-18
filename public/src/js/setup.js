/**
 * public/src/js/setup/index.js - delish
 * 
 * Licensed under MIT license.
 * Copyright (C) 2017 Karim Alibhai.
 */

import { log, fail } from './logger'
import createMap from './map'
import createApp from './app'
import { getFirstLocation } from './location'

/**
 * Promise-ify Google map success.
 */
const mapReady = new Promise(resolve => {
  window.initMap = resolve
})

/**
 * List of tasks, in the order that they
 * must be executed.
 */
const tasks = {
  order: [
    'Locating you',
    'Creating sexy map',
    'Wrapping up'
  ],

  /**
   * Tracks down your first location. Or fails.
   */
  'Locating you': resolve => getFirstLocation(resolve),

  /**
   * Creates a new Google map instance
   */
  'Creating sexy map': (resolve, reject) => {
    mapReady.then(() => {
      let map = document.createElement('div')
      map.id = 'map'
      document.body.insertBefore(map, document.body.children[0])
      createMap(map, resolve)
    }).catch(reject)

    let script = document.createElement('script')
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDP65fNhrgLMP9Gu20ATUn2CxwPQErxngQ&callback=initMap'
    document.body.appendChild(script)
  },

  /**
   * Not actually wrapping up. This brings up the app
   * via angular.
   */
  'Wrapping up': createApp(fail)
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
    }, 2000)
  } else {
    let text = tasks.order[i]
    console.warn(text + ' ...')
    log(text + ' ...')

    new Promise(tasks[text])
      .then(next)
      .catch(fail)
  }
}

// start task execution, soon
let i = -1
setTimeout(next, 0)