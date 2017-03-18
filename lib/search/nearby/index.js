/**
 * @file lib/search/nearby/index.js
 * @description Executes a nearby restaurants lookup across all providers.
 * @author Karim Alibhai
 * @license MIT
 * @copyright Karim Alibhai 2017
 */

import GooglePlacesProvider from './providers/google'

/**
 * Runs a nearby restaurants search against all providers.
 * @param {Object} query options to use to search for nearby restaurants
 * @param {Number} lat your current latitude
 * @param {Number} lng your current longitude
 * @param {Number} radius the maximum radius of your search
 * @returns {Promise} promise which will resolve with all results
 */
export default query => Promise.all([
  GooglePlacesProvider(query)
]).then(results => results.reduce((a, b) => a.concat(b), []))