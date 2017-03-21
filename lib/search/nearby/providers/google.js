/**
 * @file lib/search/nearby/providers/index.js
 * @description Executes a nearby restaurants lookup on Google Places.
 * @author Karim Alibhai
 * @license MIT
 * @copyright Karim Alibhai 2017
 */

import util from 'util'

const request = require('request')
    , debug = util.debuglog('delish')
    , places = require('@google/maps').createClient({
        key: process.env.API_KEY
      })

/**
 * Resolves a photo reference to an actual photo URL.
 * @param {Object} info a photo reference object
 * @param {String} info.photo_reference the Google Places reference
 * @param {Number} [info.width] width of the photo (required if no height is present)
 * @param {Number} [info.height] height of the photo (required if no width is present)
 * @returns {Promise} resolves to a Google CDN photo URL
 */
const getPhoto = info => new Promise((resolve, reject) => {
  const size = info.width ? 'width' : 'height'

  debug('grabbing photo')

  request({
    url: util.format(
      'https://maps.googleapis.com/maps/api/place/photo?max%s=%s&photoreference=%s&key=%s',
      size, info[size], info.photo_reference, process.env.API_KEY
    ),
    followRedirect: false
  }, (err, res, body) => {
    debug(err)
    if (!err) debug('getPhoto() finished')

    if (err || res.statusCode > 399) reject(err || new Error('Request failed with status ' + res.statusCode))
    else resolve(res.headers.location)
  })
})

/**
 * Grabs the details of a place.
 * @param {String} placeid an official placeid
 * @returns {Promise} a promise that resolves with the details object
 */
const details = placeid => new Promise((resolve, reject) => {
  debug('getting details ' + placeid)

  places.place({ placeid }, (err, results) => {
    debug(err)
    debug(results)
    if (!err) debug('details() finished')

    if (err) reject(err)
    else if (results.status > 399 || results.json.status !== 'OK') reject(results)
    else resolve(results.json.result)
  })
})

/**
 * Runs a nearby restaurants search against Google Places.
 * @param {Object} query options to use to search for nearby restaurants
 * @param {Number} query.lat your current latitude
 * @param {Number} query.lng your current longitude
 * @param {Number} query.radius the maximum radius of your search
 * @returns {Promise} promise which will resolve with all results
 */
export default options => new Promise((resolve, reject) => {
  const { lat, lng, radius } = options || {}

  if (typeof options !== 'object' || !options) return reject(new Error('Unexpected value for options'))
  if (typeof lat !== 'number') return reject(new Error('Unexpected value for latitude'))
  if (typeof lng !== 'number') return reject(new Error('Unexpected value for longitude'))
  if (typeof radius !== 'number') return reject(new Error('Unexpected value for radius'))

  debug({
    location: { lat, lng },
    radius,
    type: 'food'
  })
  debug(process.env.API_KEY)

  places.placesNearby({
    location: { lat, lng },
    radius,
    type: 'food'
  }, (err, res) => {
    debug('places search')
    debug(err)
    if (!err) debug('search() finished')

    if (err) reject(err)
    else if (res.status > 399 || res.json.status !== 'OK') reject(res)
    else Promise.all(res.json.results.map(res => (async () => {
      res.photos = await Promise.all(res.photos.map(p => getPhoto(p)))
      return res
    })())).then(results => {
      Promise.all(results.map(result => (async () => {
        result.details = await details(result.place_id)
        return result
      })())).then(resolve, reject)
    }, reject)
  })
})