/*!
 * config-cache <https://github.com/jonschlinkert/config-cache>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var EventEmitter2 = require('eventemitter2').EventEmitter2;
var Base = require('class-extend');

// make sure the event emitter is setup for using the class-extend lib
var Emitter = Base.extend(EventEmitter2.prototype);
Emitter.extend = Base.extend;

var Event = Emitter.extend({
  constructor: function () {
    Event.__super__.constructor.call(this, {
      wildcard: true,
      delimiter: ':',
      newListener: false,
      maxListeners: 0
    });
  }
});

Event.extend = Emitter.extend;
module.exports = Event;