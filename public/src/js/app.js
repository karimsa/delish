/**
 * public/src/js/app.js - delish
 * 
 * Licensed under MIT license.
 * Copyright (C) 2017 Karim Alibhai.
 */
/* globals angular */

import SearchCtl from './controllers/search'

export default (resolve, reject) => {
  try {
    const app = angular.module('delish', ['ngRoute', 'ngAnimate'])

    app.config(['$routeProvider', '$locationProvider', ($router, $location) => {
      $router
        .when('/', {
          templateUrl: '/views/index.html',
          controller: 'SearchCtl'
        })
        .otherwise('/')
      $location.html5Mode(true)

      resolve()
    }])

    app.controller('SearchCtl', SearchCtl)
  } catch (err) {
    reject(err)
  }
}