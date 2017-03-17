/**
 * lib/search/autocomplete.js - delish
 * 
 * Licensed under MIT license.
 * Copyright (C) 2017 Karim Alibhai.
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
  let { query, radius, lat, lng } = options || {}

  // defaults
  query = query || ''
  radius = radius || 20
  lat = lat || 0
  lng = lng || 0

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
    else if (res.status !== 200 || res.json.status !== 'OK') reject('Error: ' + JSON.stringify(res))
    else resolve(res.json.predictions.map(place => place.structured_formatting.main_text))
  })
})