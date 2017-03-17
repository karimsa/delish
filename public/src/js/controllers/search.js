/**
 * public/src/js/controllers/search.js - delish
 * 
 * Licensed under MIT license.
 * Copyright (C) 2017 Karim Alibhai.
 */
/* globals $ */

export default ['$scope', $scope => {
  $scope.test = 'hi'

  let search = $('[ng-model="query"]')
    , docElm = $(document.documentElement)

  // handle blur on search
  search.on('blur', evt => {
    evt.preventDefault()
    docElm.addClass('map-view')
  })

  docElm.on('keyup', evt => {
    if (docElm.is('.map-view')) {
      evt.preventDefault()
      search.val(String.fromCharCode(evt.which))
      docElm.removeClass('map-view')
      setTimeout(() => search.focus(), 0)
    }
  })

  // start with forced focus
  setTimeout(() => search.focus(), 0)
}]