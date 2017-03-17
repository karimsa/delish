/**
 * public/src/js/factories/search.js - delish
 * 
 * Licensed under MIT license.
 * Copyright (C) 2017 Karim Alibhai.
 */

export default () => {
  const params = {
    /**
     * Default radius of 20 meters to search within.
     */
    radius: 20
  }

  return params
}

/**
 * Type and option information for each search parameter
 * for view construction.
 */
export const ParamTypes = {
  radius: {
    type: 'range',
    min: 1,
    max: 100
  }
}