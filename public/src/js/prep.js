/**
 * public/src/js/prep.js - delish
 * 
 * Licensed under MIT license.
 * Copyright (C) 2017 Karim Alibhai.
 */

import log from './logger'
import Map from './map'

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
    'Creating sexy map'
  ],

  /**
   * Creates a new Google map instance
   */
  'Creating sexy map': (resolve, reject) => {
    mapReady.then(() => {
      let map = document.createElement('div')
      map.id = 'map'
      document.body.appendChild(map)
      window.Map = new Map(map)

      resolve()
    }).catch(reject)
  }
}

/**
 * Handle task failure.
 */
const loading = document.querySelector('.loading-screen')
function fail(err) {
  log(String(err))
  loading.classList.add('error')
}

/**
 * Executes tasks sequentionally.
 */
let i = -1
function next() {
  i += 1

  if (i === tasks.order.length) {
    log('Okay I\'m ready now.')

    setTimeout(() => {
      document.documentElement.classList.remove('loading')
    }, 1000)
  } else {
    let text = tasks.order[i]
    log(text + ' ...')

    new Promise(tasks[text])
      .then(next)
      .catch(fail)
  }
}

// start task execution, soon
setTimeout(next, 0)