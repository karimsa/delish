/**
 * @file public/src/js/location.js
 * @author Karim Alibhai
 * @license MIT
 * @copyright Karim Alibhai 2017
 */
/**
 * Provides a wrapper over the native Geolocation API.
 * @module location
 */

import { fail } from './logger'
import { EventEmitter } from 'events'

const locEmitter = new EventEmitter()
const location = {}

/**
 * Updates location when updates are received.
 * @param {Object} pos position object from geolocation API
 */
const success = pos => {
  location.lat = pos.coords.latitude
  location.lng = pos.coords.longitude

  locEmitter.emit('update', getCurrentLocation())
}

/**
 * Geolocation options.
 */
const options = {
  enableHighAccuracy: false // true
}

/**
 * Create watcher.
 */
navigator.geolocation.watchPosition(success, fail, options)

/**
 * Request first location.
 */
//navigator.geolocation.getCurrentPosition(success, fail, options)

/**
 * @returns {LatLng} a copy of the user's current location
 */
export function getCurrentLocation() {
  return Object.assign({}, location)
}

/**
 * Get the first available location.
 * @param {Function} done a callback which will be called with a location when it is available
 */
export function getFirstLocation(done) {
  if (location.lat === undefined) {
    setTimeout(() => getFirstLocation(done), 0)
  } else {
    done(getCurrentLocation())
  }
}

/**
 * Attaches an event handler to location updates.
 * @param {Function} callback an event handler for location updates
 */
export function getLocationAlways(callback) {
  locEmitter.on('update', callback)
}