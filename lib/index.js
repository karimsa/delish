/**
 * index.js - delish
 *
 * Licened under MIT license.
 * Copyright (C) 2017 Karim Alibhai.
 */

const path = require('path')
    , express = require('express')
    , app = express()
    , http = require('http').createServer(app)
    , io = require('socket.io')(http)

app.use(require('morgan')('dev'))
app.use(express.static(path.join(__dirname, '..', 'public')))

io.on('connection', sock => {
  sock.on('data', data => {
    console.warn(data)
  })
})

http.listen(process.env.PORT || 8080, () =>
  console.log('Listening :%s', http.address().port)
)