/**
 * lib/env.js - delish
 *
 * Licened under MIT license.
 * Copyright (C) 2017 Karim Alibhai.
 */

import fs from 'fs'
import path from 'path'

const ENV_FILE = path.resolve(__dirname, '..', 'env.json')

// load env variables from file
if (fs.existsSync(ENV_FILE)) {
  const env = JSON.parse(fs.readFileSync(ENV_FILE, 'utf8'))
  
  for (let key in env) {
    if (env.hasOwnProperty(key)) {
      process.env[key] = env[key]
    }
  }
}