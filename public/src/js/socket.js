/**
 * public/src/js/socket.js - delish
 * 
 * Licensed under MIT license.
 * Copyright (C) 2017 Karim Alibhai.
 */
/* globals io */

import { fail } from './logger'

// setup error handling and then expose
const sock = io()
sock.on('fail', fail)
export default sock