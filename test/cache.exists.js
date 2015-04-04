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

describe('exists():', function () {
  beforeEach(function () {
    config = new Config();
    obj = {a: {b: {c: 1, d: '', e: null, f: undefined, 'g.h.i': 2}}};
    config.set(obj);
  })

  it('immediate property should exist.', function() {
    config.exists('a').should.be.true;
  });
  it('nested property should exist.', function() {
    config.exists('a.b').should.be.true;
  });
  it('nested property should exist.', function() {
    config.exists('a.b.c').should.be.true;
  });
  it('nested property should exist.', function() {
    config.exists('a.b.d').should.be.true;
  });

  it('nested property should exist.', function() {
    config.exists('a.b.e').should.be.true;
  });
  it('nested property should exist.', function() {
    config.exists('a.b.f').should.be.true;
  });

  it('literal backslash should escape period in property name.', function() {
    config.exists('a.b.g\\.h\\.i', true).should.be.true;
  });

  it('nonexistent property should not exist.', function() {
    config.exists('x').should.eql(false);
  });
  it('nonexistent property should not exist.', function() {
    config.exists('a.x').should.eql(false);
  });
  it('nonexistent property should not exist.', function() {
    config.exists('a.b.x').should.eql(false);
  });
});
