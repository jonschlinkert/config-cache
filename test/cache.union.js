/*!
 * config-cache <https://github.com/jonschlinkert/config-cache>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var assert = require('assert');
var should = require('should');
var Config = require('..');
var config;
var obj;

describe('union():', function () {
  beforeEach(function () {
    config = new Config();
    obj = {a: {b: ['a', 'b']}};
    config.set(obj);
  })

  it('immediate property should exist.', function() {
    config.union('a.b', ['c']);
    config.cache.a.should.eql({b: ['a', 'b', 'c']});
    config.union('a.b', ['d', 'e']);
    config.cache.a.should.eql({b: ['a', 'b', 'c', 'd', 'e']});
  });
});
