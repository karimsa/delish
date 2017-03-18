/**
 * @file public/src/js/track.js
 * @description Sets up track.js and connects it to logger.
 * @author Karim Alibhai
 * @license MIT
 * @copyright Karim Alibhai 2017
 */

import { failOnce } from './logger'

window._trackJs = {
  token: 'dd00708cab8f4cdd9b22b9c5a656271c',
  onError: function (p) {
    return p.message === '{}' ? false : (failOnce(), true)
  }
}

let script = document.createElement('script')
script.src = 'https://cdn.trackjs.com/releases/current/tracker.js'
document.head.appendChild(script)