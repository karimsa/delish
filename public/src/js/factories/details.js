/**
 * @file public/src/js/factories/details.js
 * @description Global details object.
 * @author Karim Alibhai
 * @license MIT
 * @copyright Karim Alibhai 2017
 */

/**
 * Factory to create global details object.
 * @returns {Object} the details object
 */
export default () => ({
  name: '',
  photos: [
    '/dist/img/default_photo.png'
  ],
  reviews: []
})