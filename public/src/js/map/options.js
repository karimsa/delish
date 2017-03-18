/**
 * @file public/src/js/map/options.js
 * @author Karim Alibhai
 * @license MIT
 * @copyright Karim Alibhai 2017
 */

/**
 * Defaults to use when setting up the Google Map.
 */
export default {
  /**
   * Default zoom of 16 allows user to see streets.
   */
  zoom: 18,

  /**
   * Further than 14 shows more than just the current
   * city typically, so it's useless to the application.
   */
  minZoom: 14,

  /**
   * See styles file for info on styles.
   */
  styles: require('./styles/hybrid'),

  /**
   * The combination of these two properties allows
   * a much more interesting view.
   */
  mapTypeId: 'hybrid',
  tilt: 45,

  /**
   * Gets rid of the UI provided by Google Maps, with
   * the exception of their terms of use and logo.
   */
  disableDefaultUI: true,

  /**
   * We want custom windows for markers.
   */
  clickableIcons: false,

  /**
   * The zoom control is a nice part of the UI, it helps
   * users control the zoom in more ways than just by using
   * their mouse & scroll.
   */
  zoomControl: true
}