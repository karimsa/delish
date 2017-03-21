/**
 * @file public/src/js/controllers/map.js
 * @author Karim Alibhai
 * @license MIT
 * @copyright Karim Alibhai 2017
 */
/**
 * Controller to manage the Google Map instance.
 * @module MapCtl
 */

import sock from '../socket'
import debounce from 'debounce'
import { getFirstLocation } from '../location'
import { getMapWhenReady, getMap } from '../map'

/**
 * Factory to create the map controller.
 * @param {Function} ready a callback to call when the map is ready
 * @returns {Array} array of dependencies ending with the angular controller factory
 */
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
    .onMap('zoom_changed', getNearby)
    .onMap('dragend', getNearby)

  // init the map
  getFirstLocation(() =>
    getMapWhenReady(() => {
      ready()
      setTimeout(getNearby, 0)
    })
  )
}]