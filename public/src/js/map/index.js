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
import createMarker from '../marker'
import requestAnimationFrame from '../raf'
import { EventEmitter } from 'events'

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
    this.id = spotID(spot)
    this.map = map
    this.relevancy = spot.rating / 5
    this.spot = spot
    this.marker = new google.maps.Marker({
      position: spot.geometry.location,
      map: map.map,
      title: spot.name,
      animation: google.maps.Animation.DROP,
      optimized: false,
      icon: this.icon()
    })

    this.marker.addListener('click', () =>
      this.map.setActive(this)
    )
  }

  hide () {
    this.marker.setMap(null)
    return this
  }

  show () {
    this.marker.setMap(this.map.map)
    return this
  }

  icon () {
    return new google.maps.MarkerImage(
      'data:image/svg+xml;utf-8,' + this.render(),
      null, /* size is determined at runtime */
      null, /* origin is 0,0 */
      null, /* anchor is bottom center of the scaled image */
      new google.maps.Size(40, 40)
    )
  }

  render () {
    return createMarker(this.relevancy)
  }

  pos () {
    return this.marker.getPosition()
  }

  matches (text) {
    return this.spot.name.toLowerCase().replace(/\s+/g, '').startsWith(text.toLowerCase().replace(/\s+/g, ''))
  }
}

/**
 * Map wrapper. For easier handling.
 */
class Map extends EventEmitter {
  constructor (elm, ready) {
    super()

    this.map = new google.maps.Map(elm, MapOptions)
    this.spots = {}

    this.overlay = new google.maps.OverlayView()
    this.overlay.draw = this.draw.bind(this)
    this.overlay.setMap(this.map)

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

    this.canvas = document.createElement('canvas')
    this.canvas.width = this.canvas.height = 0
    this.context = this.canvas.getContext('2d')
    this.framesLeft = this.maxFrames = 40
    this.prevTarget = { x: 0, y: 0 }

    document.body.appendChild(this.canvas)
  }

  /**
   * Sets the given spot as the current active spot.
   * @param {Spot} spot a valid (cached) spot object
   * @returns {Map} current map object for chaining
   */
  setActive (spot) {
    this.activeSpot = spot
    this.emit('active_changed', spot)
    return this
  }

  /**
   * @returns {Spot} the current active spot
   */
  getActive () {
    return this.activeSpot
  }

  /**
   * Renders the overlay. Called by OverlayView.
   */
  draw () {
    const projection = this.overlay.getProjection()
    
    if (this.activeSpot) {
      let { x, y } = projection.fromLatLngToContainerPixel(this.activeSpot.pos())
      let { width } = this.activeSpot.marker.getIcon().scaledSize

      // y value given by the projection must be centered
      // on the marker, x is already given centered
      y -= width / 2

      // get the distance that must be moved on the x-axis and
      // append it to the old position
      x = this.prevTarget.x + ((x - this.prevTarget.x) / this.framesLeft)

      // same as above for the y
      y = this.prevTarget.y + ((y - this.prevTarget.y) / this.framesLeft)

      // clear up the canvas
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

      // the canvas being a bit bigger than the
      // line's end is useful when the line becomes small
      // (i.e. when the spot starts to move towards the edge)
      this.canvas.width = x + 10
      this.canvas.height = y + 10

      // figure out where to start the line
      const photoView = $('.photo-view>img')
          , originX = photoView.offset().left + (photoView.width() / 2)
          , originY = photoView.offset().top + (photoView.height() / 2)

      // paint the line again, with new coordinates
      this.context.beginPath()
      this.context.moveTo(originX, originY)
      this.context.lineTo(x, y)
      this.context.lineWidth = 2
      this.context.strokeStyle =
        `rgba(
          ${Math.round(255 * (1 - this.activeSpot.relevancy))},
          ${Math.round(255 * this.activeSpot.relevancy)},
          0,
          .5
        )`
      this.context.stroke()

      // for trajectory calculation later
      this.prevTarget = { x, y }

      // trim off number of frames left
      this.framesLeft -= 1

      // if end of animation, restart
      if (this.framesLeft === 0) this.framesLeft = this.maxFrames
    }

    requestAnimationFrame(() => this.draw())
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

    this.map.panTo({ lat, lng })
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
      this.spots[id] = new Spot(spot, this)
    }

    return this.spots[id]
  }

  /**
   * Toggles the visibility of all markers based
   * on given query.
   * @param {String} query simple query to search with
   * @returns {Map} current object for searching
   */
  filter (query) {
    Object.keys(this.spots).forEach(key => {
      let spot = this.spots[key]

      if (spot.matches(query)) spot.show()
      else spot.hide()
    })

    return this
  }

  /**
   * Attachs a callback to an event.
   * @param {String} event the name of the event
   * @param {Function} handler the callback to handle the event
   * @returns {Map} the current object for chaining
   */
  onMap (event, handler) {
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