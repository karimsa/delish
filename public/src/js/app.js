/**
 * @file public/src/js/app.js
 * @author Karim Alibhai
 * @license MIT
 * @copyright Karim Alibhai 2017
 */
/**
 * Creates the angular app and bootstraps it.
 * @module createApp
 */
/* globals angular */

import MapCtl from './controllers/map'
import SearchCtl from './controllers/search'
import SearchParams from './factories/search'

export default exceptionHandler => (resolve, reject) => {
  try {
    const app = angular.module('delish', ['ngRoute', 'ngAnimate'])

    app.factory('$exceptionHandler', () => exceptionHandler)
    app.factory('$searchParams', SearchParams)

    app.config(['$routeProvider', '$locationProvider', ($router, $location) => {
      $router.otherwise('/')
      $location.html5Mode(true)
    }])

    app.controller('MapCtl', MapCtl(resolve))
    app.controller('SearchCtl', SearchCtl)

    angular.element(() => angular.bootstrap(document, ['delish']))
  } catch (err) {
    reject(err)
  }
}