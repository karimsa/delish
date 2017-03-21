/**
 * @file public/src/js/marker.js
 * @author Karim Alibhai
 * @license MIT
 * @copyright Karim Alibhai 2017
 */
/**
 * Creates a new marker with the given colour.
 * @module createMarker
 */

import util from 'util'

// via brfs
const marker = require('fs').readFileSync(__dirname + '/../../svg/marker.svg', 'utf8')

/**
 * Creates a new SVG marker from RGB values.
 * @param {Number} R red value
 * @param {Number} G green value
 * @param {Number} B blue value
 * @returns {String} an SVG string
 */
function createMarker(R, G, B) {
  return util.format(marker, R, G, B, R, G, B)
}

/**
 * Creates a new SVG marker from an intensity value.
 * @param {Number} relevancy amount of relevancy between 0 to 1
 * @returns {String} an SVG string
 */
export default relevancy =>
  createMarker(
    Math.round(255 * (1 - relevancy)),
    Math.round(255 * relevancy),
    0
  )