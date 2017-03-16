/**
 * public/src/js/map.js - delish
 * 
 * Licensed under MIT license.
 * Copyright (C) 2017 Karim Alibhai.
 */
/* globals google */

import MapOptions from './options'

/**
 * Map wrapper. For easier handling.
 */
export default class Map {
  constructor (elm) {
    this.map = new google.maps.Map(elm, MapOptions)
  }

  /**
   * Centers the map.
   * 
   * @param {number} lat the latitude of the center
   * @param {number} lng the longitude of the center
   * @returns {Map} current object for chaining
   */
  center (lat, lng) {
    this.map.setCenter({ lat, lng })
    return this
  }
}