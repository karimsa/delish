/**
 * lib/nearby/providers/google.js - delish
 * 
 * Licensed under MIT license.
 * Copyright (C) 2017 Karim Alibhai.
 */

const places = require('@google/maps').createClient({
  key: process.env.API_KEY
})

export default ({ lat, lng, radius }) => new Promise((resolve, reject) =>
  places.placesNearby({
    location: { lat, lng },
    radius,
    type: 'food'
  }, (err, res) => {
    if (err) reject(err)
    else if (res.status !== 200 || res.json.status !== 'OK') reject(res)
    else resolve(res.json.results)
  })
)