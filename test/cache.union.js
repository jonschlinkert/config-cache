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

  it('should throw an error on bad args:', function() {
    (function () {
      config.union(null);
    }).should.throw('config-cache#union expected an array but got:');
  });

  it('should set a new array on the given property', function() {
    config.union('x', ['one', 'two']);
    config.cache.x.should.eql([ 'one', 'two' ]);
  });

  it('should set a new array `cache`.', function() {
    config.union('x.y.z', ['one', 'two']);
    config.cache.x.should.eql({ y: { z: [ 'one', 'two' ] } });
  });

  it('should add values to an existing array.', function() {
    config.union('a.b', ['c']);
    config.cache.a.should.eql({b: ['a', 'b', 'c']});
    config.union('a.b', ['d', 'e']);
    config.cache.a.should.eql({b: ['a', 'b', 'c', 'd', 'e']});
  });
});
