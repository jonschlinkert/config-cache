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


describe('config omit', function () {
  beforeEach(function () {
    config = new Config();
  });

  describe('.omit()', function () {
    it('should omit a value from the cache', function () {
      config.set('a', 'b');
      config.set('b', 'c');

      // property should be on the cache
      config.get('a').should.equal('b');
      config.get('b').should.equal('c');
      config.omit('a');

      // property should not be on the cache
      assert(config.get('a') == null);
      assert(config.get('b') === 'c');
    });

    it('should omit an array of values from the cache', function () {
      config
      	.set('a', 'a')
      	.set('b', 'b')
      	.set('c', 'c')
      	.set('d', 'd')
        .set('e', 'e');

      // properties should be on the cache
      config.get('a').should.equal('a');
      config.get('b').should.equal('b');
      config.get('c').should.equal('c');
      config.get('d').should.equal('d');
      config.get('e').should.equal('e');

      config.omit(['a', 'b', 'c', 'd']);

      // properties should not be on the cache
      assert(config.get('a') == null);
      assert(config.get('b') == null);
      assert(config.get('c') == null);
      assert(config.get('d') == null);
      assert(config.get('e') === 'e');
    });
  });
});
