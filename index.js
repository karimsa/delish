/**
 * index.js - delish
 *
 * Licened under MIT license.
 * Copyright (C) 2017 Karim Alibhai.
 */

const cluster = require('cluster')
const CONCURRENCY = process.env.WEB_CONCURRENCY || 1

if (cluster.isMaster) {
  for (let i = 0; i < CONCURRENCY; i += 1) {
    cluster.fork()
  }
} else {
  require('./lib')
}