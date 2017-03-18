/**
 * public/src/js/location.js - delish
 * 
 * Licensed under MIT license.
 * Copyright (C) 2017 Karim Alibhai.
 */

import { fail } from './logger'
import { EventEmitter } from 'events'

const locEmitter = new EventEmitter()
const location = {}

navigator.geolocation.watchPosition(pos => {
  location.lat = pos.coords.latitude
  location.lng = pos.coords.longitude

  locEmitter.emit('update', getCurrentLocation())
}, fail, {
  enableHighAccuracy: true
})

/**
 * @returns {LatLng} a copy of the user's current location
 */
export const getCurrentLocation = () => Object.assign({}, location)

/**
 * Get the first available location.
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
export const getLocationAlways = callback => locEmitter.on('update', callback)