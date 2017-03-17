/**
 * public/src/js/controllers/search.js - delish
 * 
 * Licensed under MIT license.
 * Copyright (C) 2017 Karim Alibhai.
 */

import sock from '../socket'
import debounce from 'debounce'
import getCurrentLocation from '../location'

export default ['$scope', '$searchParams', ($scope, $searchParams) => {
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
      radius: $searchParams.radius
    })
  }, 500)

  $scope.prediction = () => {
    return $scope.hint && $scope.query ? $scope.query + $scope.hint.substr($scope.query.length) : ''
  }

  sock.on('autocomplete:results', result => {
    $scope.hint = result
    $scope.$apply()
  })
}]