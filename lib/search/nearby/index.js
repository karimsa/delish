/**
 * lib/nearby/index.js - delish
 * 
 * Licensed under MIT license.
 * Copyright (C) 2017 Karim Alibhai.
 */

import GooglePlacesProvider from './providers/google'

export default query => Promise.all([
  GooglePlacesProvider(query)
]).then(results => results.reduce((a, b) => a.concat(b), []))