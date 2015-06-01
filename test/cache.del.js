/*!
 * config-cache <https://github.com/jonschlinkert/config-cache>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

require('should');
var assert = require('assert');
var Config = require('..');
var config;

describe('.del', function () {
  beforeEach(function () {
    config = new Config();
  });

  it('should delete a value from the cache', function () {
    config.set('a', 'b');
    config.set('b', 'c');

    // property should be on the cache
    config.get('a').should.equal('b');
    config.get('b').should.equal('c');
    config.del('a');

    // property should not be on the cache
    assert(config.get('a') == null);
    assert(config.get('b') === 'c');
  });

  it('should delete an array of values from the cache', function () {
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

    config.del(['a', 'b', 'c', 'd']);

    // properties should not be on the cache
    assert(config.get('a') == null);
    assert(config.get('b') == null);
    assert(config.get('c') == null);
    assert(config.get('d') == null);
    assert(config.get('e') === 'e');
  });
});
