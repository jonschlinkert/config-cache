/*!
 * config-cache <https://github.com/jonschlinkert/config-cache>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var util = require('util');
var EventEmitter2 = require('eventemitter2').EventEmitter2;

function Event() {
  EventEmitter2.call(this, {
    wildcard: true,
    delimiter: ':',
    newListener: false,
    maxListeners: 0
  });
}

util.inherits(Event, EventEmitter2);
module.exports = Event;