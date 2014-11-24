/*!
 * config-cache <https://github.com/jonschlinkert/config-cache>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var should = require('should');
var Config = require('..');
var config;

describe('config data', function() {
  beforeEach(function() {
    config = new Config();
  });

  describe('.flattenData()', function() {
    it('should merge the value of a nested `data` property onto the root of the given object.', function() {
      var root = config.flattenData({data: {x: 'x'}, y: 'y', z: 'z'});
      root.should.have.property('x');
      root.should.have.property('y');
      root.should.have.property('z');
      root.should.not.have.property('data');
    });

    it('should merge the value of a nested `data` property onto the root of the given object.', function() {
      var root = config.flattenData({a: 'b', data: {x: 'x'}, y: 'y', z: 'z'});
      root.should.have.property('a');
      root.should.have.property('x');
      root.should.have.property('y');
      root.should.have.property('z');
      root.should.not.have.property('data');
    });
  });
});
