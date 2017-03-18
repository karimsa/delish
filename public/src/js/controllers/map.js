/**
 * public/src/js/controllers/map.js - delish
 * 
 * Licensed under MIT license.
 * Copyright (C) 2017 Karim Alibhai.
 */

import sock from '../socket'
import debounce from 'debounce'
import { getFirstLocation } from '../location'
import { getMapWhenReady, getMap } from '../map'

export default ready => [() => {
  /**
   * Executes a nearby search using params.
   * @param {LatLngLiteral} latlng an object literal with latitutde and longitude
   * @param {Number} latlng.lat the latitude of the literal
   * @param {Number} latlng.lng the longitude of the literal
   */
  const getNearby = debounce(() => {
    const { lat, lng } = getMap().center()

    sock.emit('nearby', {
      lat,
      lng,
      radius: getMap().radius()
    })
  }, 300)

  /**
   * Handle nearby search results.
   */
  sock.on('nearby:results', results =>
    results.map(spot => getMap().plot(spot))
  )

  /**
   * Attach the marker mapping function to changes in
   * the map's position.
   */
  getMap()
    .on('zoom_changed', getNearby)
    .on('dragend', getNearby)

  // init the map
  getFirstLocation(() =>
    getMapWhenReady(() => {
      ready()
      setTimeout(getNearby, 0)
    })
  )
}]