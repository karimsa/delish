/**
 * @file public/src/js/controllers/search.js
 * @author Karim Alibhai
 * @license MIT
 * @copyright Karim Alibhai 2017
 */
/**
 * Controller to manage the search and autocomplete.
 * @module SearchCtl
 */

import sock from '../socket'
import debounce from 'debounce'
import { getCurrentLocation } from '../location'
import { getMap } from '../map'

/**
 * Angular controller factory for SearchCtl.
 * @returns {Array} an array of angular dependencies ending with the factory function
 */
export default ['$scope', ($scope) => {
  $scope.search = debounce(query => {
    if (!query) {
      $scope.hint = ''
      return $scope.$apply()
    }

    let { lat, lng } = getCurrentLocation()

    sock.emit('autocomplete', {
      query,
      lat,
      lng,
      radius: getMap().radius()
    })
  }, 500)

  $scope.prediction = () => {
    return $scope.hint && $scope.query ? $scope.query + $scope.hint.substr($scope.query.length) : ''
  }

  $scope.complete = evt => {
    if (evt.which === 39) {
      $scope.query = $scope.prediction()
    }
  }

  sock.on('autocomplete:results', result => {
    $scope.hint = result
    $scope.$apply()
  })

  $scope.$watch('query', query => {
    let map = getMap()
    if (map) map.filter(query || '')
  })
}]