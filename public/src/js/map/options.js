/**
 * public/src/js/map/options.js - delish
 * 
 * Licensed under MIT license.
 * Copyright (C) 2017 Karim Alibhai.
 */

export default {
  /**
   * Default zoom of 16 allows user to see streets.
   */
  zoom: 17,

  /**
   * Just a dummy center. This will be updated to a geolocation.
   */
  center: { lat: 45.4286821, lng: -75.6898986 },

  /**
   * See styles file for info on styles.
   */
  styles: require('./styles'),

  /**
   * Gets rid of the UI provided by Google Maps, with
   * the exception of their terms of use and logo.
   */
  disableDefaultUI: true,

  /**
   * We disable default keyboard shortcuts so all keyboard
   * shortcuts can be handled by the application.
   */
  keyboardShortcuts: false,

  /**
   * The zoom control is a nice part of the UI, it helps
   * users control the zoom in more ways than just by using
   * their mouse & scroll.
   */
  zoomControl: true
}