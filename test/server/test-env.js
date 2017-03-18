/**
 * @file test/server/test-env.js
 * @author Karim Alibhai
 * @license MIT
 * @copyright Karim Alibhai 2017
 */

import path from 'path'
import db from 'databob'
import expect from 'expect'
import mock from 'mock-require'

const ENV_MODULE = require.resolve('../../lib/env')

describe('lib/env.js', () => {
  /**
   * Creates a test to see if the env module
   * imports the env object properly.
   * @param {Object} value sample env object to test against
   * @param {Number} indent the number of spaces to use for indentation
   */
  const test = (value, indent) => () => {
    expect(value).toBeA('object')

    // stringify so it seems like it came out of a file
    const strValue = JSON.stringify(value, null, indent)

    // mock up fs for importing
    mock('fs', {
      existsSync: (file) => {
        expect(file).toBe(path.resolve(__dirname, '..', '..', 'env.json'))

        return true
      },

      readFileSync: (file, encoding) => {
        expect(file).toBe(path.resolve(__dirname, '..', '..', 'env.json'))
        expect(encoding).toBe('utf8')

        return strValue
      }
    })

    // backup env value
    const _env = process.env

    // empty env object so we can properly
    // test the values that can copied
    const env = {}

    // mock up global env
    process.env = env
    mock.reRequire(ENV_MODULE)
    mock.stop('fs')

    // verify imported value
    expect(process.env).toBeA('object')
    expect(process.env).toNotEqual(_env)
    expect(process.env).toEqual(env)
    expect(process.env).toEqual(value)

    // restore
    process.env = _env
  }

  // test with single key
  const simple = db().make({
    test: 'string'
  })

  it('should import ' + JSON.stringify(simple), test(simple))
  it('should import ' + JSON.stringify(simple) + ' beautified', test(simple, 2))

  // test with multi-key
  const multi = db().make({
    a: 'string',
    b: 'number',
    c: 'string',
    d: 'number',
    e: 'string',
    f: 'number'
  })

  it('should import ' + JSON.stringify(multi, null, 2), test(multi))
  it('should import ' + JSON.stringify(multi, null, 2) + ' beautified', test(multi, 2))

  // test empty object
  it('should import empty object', test({}))

  it('should import non-existent file', () => {
    // mock up fs for non-existent file
    mock('fs', {
      existsSync: (file) => {
        expect(file).toBe(path.resolve(__dirname, '..', '..', 'env.json'))
        return false
      }
    })

    // backup env value
    const _env = process.env

    // empty env object so we can properly
    // test the values that can copied
    const env = {}

    // mock up global env
    process.env = env
    mock.reRequire(ENV_MODULE)
    mock.stop('fs')

    // verify imported value
    expect(process.env).toBeA('object')
    expect(process.env).toNotEqual(_env)
    expect(process.env).toEqual(env)
    expect(process.env).toEqual({})

    // restore
    process.env = _env
  })
})