/**
 * index.js - delish
 *
 * Licened under MIT license.
 * Copyright (C) 2017 Karim Alibhai.
 */

require('babel-register')

const cluster = require('cluster')
const CONCURRENCY = process.env.WEB_CONCURRENCY || 1

if (cluster.isMaster) {
  for (let i = 0; i < CONCURRENCY; i += 1) {
    cluster.fork()
  }

  cluster.on('exit', (worker, code) => {
    console.log('Worker %s died with status code %s', worker.process.pid, code)
  })
} else {
  require('./lib/env')

  const http = require('./lib').default
  http.listen(process.env.PORT || 8080, () =>
    console.log('Listening :%s', http.address().port)
  )
}