/**
 * @file public/src/js/controllers/details.js
 * @author Karim Alibhai
 * @license MIT
 * @copyright Karim Alibhai 2017
 */
/**
 * Controller to manage the details sidebar.
 * @module DetailsCtl
 */

import Styles from '../style'
import { getMapWhenReady } from '../map'

export default ['$scope', '$details', '$review', ($scope, $details, $review) => {
  new Styles('.photo-view, .photo-view > img', {
    width: () => `${$('.photo-view').width()}px`,
    height: () => `${$('.photo-view').width()}px`
  })

  new Styles('.sidebar', {
    'padding-top': () => {
      let fontSize = $('html').css('font-size')
      fontSize = parseInt(fontSize.substr(0, fontSize.length - 2), 10)

      return `${fontSize + $('.navbar').height()}px`
    }
  })

  $scope.details = $details

  const TEXT_LENGTH = 50

  $scope.short = text => `${text.substr(0, TEXT_LENGTH)}...`

  $scope.setActiveReview = index => {
    console.warn($details.details.reviews[index])
    Object.assign($review, $details.details.reviews[index])
    $('#review-modal').modal('show')
  }

  getMapWhenReady(map => map.on('active_changed', spot => {
    Object.assign($details, spot.spot)
    $scope.$apply()
  }))
}]