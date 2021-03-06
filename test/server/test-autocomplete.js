/**
 * @file test/server/test-nearby-google.js
 * @author Karim Alibhai
 * @license MIT
 * @copyright Karim Alibhai 2017
 */

import fs from 'fs'
import path from 'path'
import db from 'databob'
import expect from 'expect'
import crypto from 'crypto'
import mock from 'mock-require'
import deepEqual from 'deep-equal'
import { EventEmitter } from 'events'

const ENV_FILE = path.resolve(__dirname, '..', '..', 'env.json')

const expectRejection = (promise, message) => new Promise((resolve, reject) =>
  promise
    .then(() => reject('Expected Promise to throw ' + message))
    .catch(err => ~ String(err).indexOf(message) ? resolve() : reject(err))
)

describe('lib/search/autocomplete.js', () => {
  let autocomplete
    , emitter = new EventEmitter()

  before(() => {
    if (!fs.existsSync(ENV_FILE)) {
      process.env.API_KEY = crypto.randomBytes(10).toString('base64')
      fs.writeFileSync(ENV_FILE, '{"API_KEY":"' + process.env.API_KEY + '"}')
    } else {
      process.env.API_KEY = require('../../env.json').API_KEY
    }

    mock('@google/maps', {
      createClient: object => {
        expect(object).toBeA('object')
        expect(Object.keys(object).length).toBe(1)
        expect(object.key).toBeA('string')
        expect(object.key).toEqual(process.env.API_KEY)

        return {
          placesAutoComplete (options, callback) {
            expect(options).toBeA('object')
            expect(callback).toBeA('function')
            expect(options.input).toBeA('string')
            expect(options.radius).toBeA('number')
            expect(options.radius).toBeGreaterThanOrEqualTo(0)
            expect(options.type).toBe('establishment')
            expect(options.location).toBeA('object')
            expect(options.location.lat).toBeA('number')
            expect(options.location.lng).toBeA('number')

            emitter.emit('search', options, callback)
          }
        }
      }
    })

    autocomplete = require('../../lib/search/autocomplete').default
  })

  it('should error out with no parameters', () =>
    expectRejection(autocomplete(), 'Unexpected value')
  )

  it('should error out with non-object parameter', () => Promise.all([
    expectRejection(autocomplete(null), 'Unexpected value'),
    expectRejection(autocomplete(10), 'Unexpected value'),
    expectRejection(autocomplete('non-object'), 'Unexpected value'),
    expectRejection(autocomplete(true), 'Unexpected value')
  ]))

  const validOptions = {
    query: 'pizza',
    radius: 100,
    lat: 12.34,
    lng: 45.67
  }

  it('should error out with missing latitude', () => Promise.all([
    expectRejection(autocomplete(Object.assign({}, validOptions, { lat: null })), 'Unexpected value'),
    expectRejection(autocomplete(Object.assign({}, validOptions, { lat: 'lat' })), 'Unexpected value'),
    expectRejection(autocomplete(Object.assign({}, validOptions, { lat: {} })), 'Unexpected value'),
    expectRejection(autocomplete(Object.assign({}, validOptions, { lat: () => 0 })), 'Unexpected value')
  ]))

  it('should error out with missing longitude', () => Promise.all([
    expectRejection(autocomplete(Object.assign({}, validOptions, { lng: null })), 'Unexpected value'),
    expectRejection(autocomplete(Object.assign({}, validOptions, { lng: 'lat' })), 'Unexpected value'),
    expectRejection(autocomplete(Object.assign({}, validOptions, { lng: {} })), 'Unexpected value'),
    expectRejection(autocomplete(Object.assign({}, validOptions, { lng: () => 0 })), 'Unexpected value')
  ]))

  it('should error out with missing radius', () => Promise.all([
    expectRejection(autocomplete(Object.assign({}, validOptions, { radius: null })), 'Unexpected value'),
    expectRejection(autocomplete(Object.assign({}, validOptions, { radius: 'lat' })), 'Unexpected value'),
    expectRejection(autocomplete(Object.assign({}, validOptions, { radius: {} })), 'Unexpected value'),
    expectRejection(autocomplete(Object.assign({}, validOptions, { radius: () => 0 })), 'Unexpected value')
  ]))

  it('should convert async errors into promise errors', () => new Promise((resolve, reject) => {
    const error = new Error(db().make({ message: 'string' }).message)

    emitter.once('search', (ignore, callback) =>
      callback(error)
    )

    autocomplete(validOptions)
      .then(() => reject('Expected Promise to fail'))
      .catch(err => err === error ? resolve() : reject(new Error(err)))
  }))

  it('should handle HTTP errors', () => new Promise((resolve, reject) => {
    emitter.once('search', (ignore, callback) =>
      callback(null, { status: 404 })
    )

    autocomplete(validOptions)
      .then(() => reject('Expected Promise to fail'))
      .catch(err => deepEqual(err, { status: 404 }) ? resolve() : reject(err))
  }))
  
  ;[
    'ZERO_RESULTS',
    'OVER_QUERY_LIMIT',
    'REQUEST_DENIED',
    'INVALID_REQUEST'
  ].forEach(status =>
    it(`should handle non-HTTP errors (${status})`, () => new Promise((resolve, reject) => {
      const payload = { status: 200, json: { status } }

      emitter.once('search', (ignore, callback) =>
        callback(null, payload)
      )

      autocomplete(validOptions)
        .then(() => reject('Expected Promise to fail'))
        .catch(err => deepEqual(err, payload) ? resolve() : reject(err))
    }))
  )

  it('should handle good data', () => new Promise((resolve, reject) => {
    const predictions = [... new Array((Math.random() * 50)|0)].map(() =>
      db().make({
        str: 'string'
      }).str
    )

    emitter.once('search', (ignore, callback) =>
      callback(null, {
        status: 200,
        json: {
          status: 'OK',
          predictions: predictions.map(main_text => ({
            structured_formatting: {
              main_text
            }
          }))
        }
      })
    )

    autocomplete(validOptions)
      .then(res => deepEqual(predictions, res) ? resolve() : reject(new Error('Unexpected results: ' + JSON.stringify(res, null, 2))))
      .catch(reject)
  }))
})