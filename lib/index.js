/**
 * @file lib/index.js
 * @description Runs a single server instance to run the application.
 * @author Karim Alibhai
 * @license MIT
 * @copyright Karim Alibhai 2017
 */

import fs from 'fs'
import path from 'path'
import express from 'express'
import autocomplete from './search/autocomplete'
import nearby from './search/nearby'

const app = express()
    , http = process.env.NODE_ENV === 'test' ?
        require('https').createServer({
          key: fs.readFileSync(path.resolve(__dirname, '..', 'ssl', 'server.key')),
          cert: fs.readFileSync(path.resolve(__dirname, '..', 'ssl', 'server.crt'))
        }, app) :
        require('http').createServer(app)
    , io = require('socket.io')(http)

app.use(require('morgan')('dev'))
app.use(express.static(path.join(__dirname, '..', 'public')))

io.on('connection', sock => {
  sock.on('autocomplete', query =>
    autocomplete(query)
      .then(results =>
        sock.emit(
          'autocomplete:results',
          results.filter(res => res.toLowerCase().startsWith(query.query.toLowerCase()))[0]
        )
      ).catch(err => sock.emit('failure', err))
  )

  sock.on('nearby', query =>
    nearby(query)
      .then(results => sock.emit('nearby:results', results))
      .catch(err => sock.emit('failure', err))
  )
})

export default http