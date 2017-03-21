/**
 * @file public/src/js/style.js
 * @author Karim Alibhai
 * @license MIT
 * @copyright Karim Alibhai 2017
 */
/**
 * Tiny version of swirl.js
 * @module style
 */

import requestAnimationFrame from './raf'

/**
 * Control CSS in JS.
 */
export default class Style {
  constructor (selector, css) {
    this.selector = selector
    this.css = css
    this.style = document.createElement('style')
    document.body.appendChild(this.style)
    this.render()
  }

  set (key, value) {
    this.css[key] = value
    return this
  }

  eval (value) {
    return typeof value === 'function' ? value() : value
  }

  render () {
    this.style.innerText = `${this.selector} {${Object.keys(this.css).map(key =>
      `${key}: ${this.eval(this.css[key])};`
    ).join('')}}`

    requestAnimationFrame(() => this.render())
  }
}