/**
 * index.js - delish
 *
 * Licened under MIT license.
 * Copyright (C) 2017 Karim Alibhai.
 */

require('babel-register')
require('./lib/env')

const http = require('./lib').default
http.listen(process.env.PORT || 8080, () =>
  console.log('Listening :%s', http.address().port)
)