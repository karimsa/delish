/**
 * @file lib/env.js
 * @description Loads values from "env.json" into process.env. Like foreman.
 * @author Karim Alibhai
 * @license MIT
 * @copyright Karim Alibhai 2017
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