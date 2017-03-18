/**
 * @file public/src/js/socket.js
 * @author Karim Alibhai
 * @license MIT
 * @copyright Karim Alibhai 2017
 */
/**
 * Caches & exposes a single WebSocket instance.
 * @module socket
 */
/* globals io */

import { fail } from './logger'

// setup error handling and then expose
const sock = io()
sock.on('fail', fail)

/**
 * Cached WebSocket instance.
 */
export default sock