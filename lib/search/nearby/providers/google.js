/**
 * @file lib/search/nearby/providers/index.js
 * @description Executes a nearby restaurants lookup on Google Places.
 * @author Karim Alibhai
 * @license MIT
 * @copyright Karim Alibhai 2017
 */

const places = require('@google/maps').createClient({
  key: process.env.API_KEY
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

  places.placesNearby({
    location: { lat, lng },
    radius,
    type: 'food'
  }, (err, res) => {
    if (err) reject(err)
    else if (res.status > 399 || res.json.status !== 'OK') reject(res)
    else resolve(res.json.results)
  })
})