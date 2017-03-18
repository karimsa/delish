/**
 * @file public/src/js/map/index.js
 * @author Karim Alibhai
 * @license MIT
 * @copyright Karim Alibhai 2017
 */
/**
 * Provides wrappers for Google Maps and utilities to use them.
 * @module map
 */
/* globals google */

import MapOptions from './options'
import { getFirstLocation, getLocationAlways } from '../location'

/**
 * Gets the distance (in meters) between two points on a map. (Source: http://stackoverflow.com/a/11172685)
 * @param {LatLng} start one of the two points
 * @param {LatLng} end the other point
 * @returns {Number} the distance between start and end
 */
function getDistance({ lat: lat1, lng: lon1 }, { lat: lat2, lng: lon2 }) {
  var R = 6378.137
    , dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180
    , dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180
    , a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2)
    , c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c * 1000
}

/**
 * Converts a LatLng object from a map to a literal.
 * @param {LatLng} latlng a proper LatLng object from the google map API
 * @returns {LatLngLiteral} the simplified LatLngLiteral object
 */
function simpleLatLng(latlng) {
  return {
    lat: latlng.lat(),
    lng: latlng.lng()
  }
}

/**
 * @returns {String} the unique ID of this spot
 */
const spotID = spot =>
  [
    spot.name,
    spot.geometry.location.lat,
    spot.geometry.location.lng
  ].join(',')

/**
 * Marker wrapper for manipulating the marker.
 */
class Spot {
  /**
   * Creates a new Spot instance.
   * @param {Spot} spot the search result to plot
   * @param {Map} map the Google Map instance to plot on
   */
  constructor (spot, map) {
    this.marker = new google.maps.Marker({
      position: spot.geometry.location,
      map,
      title: spot.name,
      animation: google.maps.Animation.DROP
    })
  }
}

/**
 * Map wrapper. For easier handling.
 */
class Map {
  constructor (elm, ready) {
    this.map = new google.maps.Map(elm, MapOptions)
    this.spots = {}

    google.maps.event.addListenerOnce(this.map, 'bounds_changed', ready)
    getFirstLocation(pos => {
      this.center(pos.lat, pos.lng)
      this.you = new google.maps.Marker({
        position: pos,
        map: this.map,
        title: 'This is you. Don\'t click you.',
        animation: google.maps.Animation.DROP,
        icon: {
          url: '/dist/img/you.png',
          size: new google.maps.Size(54.92537312, 64),
          scaledSize: new google.maps.Size(54.92537312, 64)
        }
      })

      getLocationAlways(pos => {
        this.you.setPosition(pos)
      })
    })
  }

  /**
   * Sets the center of the map if arguments are provided,
   * otherwise returns the current location.
   * 
   * @param {number} [lat] the latitude of the center
   * @param {number} [lng] the longitude of the center
   * @returns {Map} current object for chaining, if arguments were provided
   * @returns {LatLngLiteral} current map center, if arguments were not provided
   */
  center (lat, lng) {
    if (lat === undefined) return simpleLatLng(this.map.getCenter())

    this.map.setCenter({ lat, lng })
    return this
  }

  /**
   * @returns {Number} the current zoom level
   */
  zoom () {
    return this.map.getZoom()
  }

  /**
   * Gets the viewable radius of this map.
   * @returns {Number} the viewable radius in meters
   */
  radius () {
    return getDistance(
      simpleLatLng(this.map.getCenter()),
      simpleLatLng(this.map.getBounds().getNorthEast())
    )
  }

  /**
   * Creates and plots a new spot on the map.
   * 
   * @param {Object} spot a search result for nearby restaurants
   * @returns {Spot} a new spot instance
   */
  plot (spot) {
    let id = spotID(spot)

    if (!this.spots.hasOwnProperty(id)) {
      this.spots[id] = new Spot(spot, this.map)
    }

    return this.spots[id]
  }

  /**
   * Attachs a callback to an event.
   * @param {String} event the name of the event
   * @param {Function} handler the callback to handle the event
   * @returns {Map} the current object for chaining
   */
  on (event, handler) {
    this.map.addListener(event, handler)
    return this
  }
}

let map

/**
 * Creates a new map instance.
 * @param {HTMLElement} elm an HTML element to use as the map
 * @returns {Map} a new map instance
 */
export default (elm, ready) => (map = new Map(elm, ready))

/**
 * Gets the current map instance.
 * @returns {Map} the saved map instance
 */
export const getMap = () => map

/**
 * Gets the map instance, if ready.
 * @param {Function} done callback to call when map becomes ready
 */
export const getMapWhenReady = done => {
  if (map) done(map)
  else setTimeout(() => getMapWhenReady(done), 0)
}