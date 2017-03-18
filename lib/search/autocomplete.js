/**
 * @file lib/search/autocomplete.js
 * @author Karim Alibhai
 * @license MIT
 * @copyright Karim Alibhai 2017
 */
/**
 * Wrapper over Google Places autocomplete.
 * @module search/autocomplete
 */

const places = require('@google/maps').createClient({
  key: process.env.API_KEY
})

/**
 * Fetches autocomplete results via Google Places.
 * @param {Object} options options for the autocomplete search
 * @param {String} options.query the search input to use
 * @param {Number} options.radius the number of meters within which to search
 * @param {Number} options.lat the latitude of your current location
 * @param {Number} options.lng the longitude of your current location
 * @returns {Promise} a promise object that will resolve with the search results
 */
export default options => new Promise((resolve, reject) => {
  const { query, radius, lat, lng } = options || {}

  if (typeof query !== 'string' || !query) return reject(new Error('Unexpected value for query'))
  if (typeof radius !== 'number' || radius < 0) return reject(new Error('Unexpected value for radius'))
  if (typeof lat !== 'number') return reject(new Error('Unexpected value for lat'))
  if (typeof lng !== 'number') return reject(new Error('Unexpected value for lng'))

  places.placesAutoComplete({
    input: query,
    radius,
    type: 'establishment',
    location: {
      lat,
      lng
    }
  }, (err, res) => {
    if (err) reject(err)
    else if (res.status > 399 || res.json.status !== 'OK') reject(res)
    else resolve(res.json.predictions.map(place => place.structured_formatting.main_text))
  })
})