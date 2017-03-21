/**
 * @file public/src/js/raf.js
 * @author Karim Alibhai
 * @license MIT
 * @copyright Karim Alibhai 2017
 */
/**
 * Vender prefix fallbacks and polyfill for requestAnimationFrame.
 * @module requestAnimationFrame
 */

export default
  window.requestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  function (fn) { setTimeout(fn, 1000 / 60) }