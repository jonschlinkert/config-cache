/*!
 * config-cache <https://github.com/jonschlinkert/config-cache>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var should = require('should');
var Config = require('..');
var config = new Config();

describe('.methods()', function() {
  it('should be object.', function() {
    config.methods(config).should.be.an.object;
  });

  it('should return the methods on an object.', function() {
    var methods = config.methods(config);
    methods.should.have.properties(['set', 'get', 'extend']);
  });
});