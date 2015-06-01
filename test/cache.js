/*!
 * config-cache <https://github.com/jonschlinkert/config-cache>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

/* deps: mocha */
var assert = require('assert');
var should = require('should');
var Cache = require('..');

describe('Cache', function () {
  describe('constructor:', function () {
    it('should be a constructor:', function () {
      var config = new Cache();
      config.should.be.instanceOf(Cache);
    });
  });

  describe('.keys:', function () {
    var config = new Cache();
    it('should return the keys of properties on the cache.', function () {
      config.set('a', 1);
      config.set('b', 2);
      config.set('c', 3);
      Object.keys(config.cache).should.eql(['a', 'b', 'c']);
    });
  });

  describe('all:', function () {
    var config = new Cache();

    it('should list the entire cache', function () {
      config.get().should.eql(config.cache);
    });
  });
});
