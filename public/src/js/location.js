/**
 * public/src/js/location.js - delish
 * 
 * Licensed under MIT license.
 * Copyright (C) 2017 Karim Alibhai.
 */

import { fail } from './logger'

const location = {}

navigator.geolocation.watchPosition(pos => {
  location.lat = pos.coords.latitude
  location.lng = pos.coords.longitude
}, fail, {
  enableHighAccuracy: true
})

/**
 * @returns {LatLng} a copy of the user's current location
 */
export default () => Object.assign({}, location)