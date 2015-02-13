/*!
 * config-cache <https://github.com/jonschlinkert/config-cache>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var assert = require('assert');
var should = require('should');
var Config = require('..');
var config;
var obj;

describe('.get()', function () {
  beforeEach(function () {
    config = new Config();
    obj = {a: {b: {c: 1, d: '', e: null, f: undefined, 'g.h.i': 2}}};
    config.set(obj);
  })

  describe('get() - add:', function () {
    it('should get immediate properties.', function() {
      config.get('a').should.eql(obj.a);
    });
    it('should get nested properties.', function() {
      config.get('a.b').should.eql(obj.a.b);
      config.get('a', 'b').should.eql(obj.a.b);
      config.get(['a', 'b']).should.eql(obj.a.b);
      config.get(['a.b']).should.eql(obj.a.b);
      config.get(['a.b']).should.eql(obj.a.b);
    });
    it('should return undefined for nonexistent properties.', function() {
      (typeof config.get('a.x')).should.be.undefined;
    });
    it('should return values.', function() {
      config.get('a.b.c').should.eql(1);
    });
    it('should return values.', function() {
      config.get('a.b.d').should.eql('');
    });
    it('should return values.', function() {
      (typeof config.get('a.b.e')).should.be.an.object;
      (config.get('a.b.e') == null).should.be.true;
    });
    it('should return values.', function() {
      (typeof config.get('a.b.f')).should.be.undefined;
    });
    it('literal backslash should escape period in property name.', function() {
      config.get('a.b.g\\.h\\.i', true).should.equal(2);
      config.get(['a', 'b', 'g\\.h\\.i'], true).should.equal(2);
      config.get('a', 'b', 'g\\.h\\.i', true).should.equal(2);
    });
    it('should just return existing properties.', function() {
      config.get('a', true).should.eql(config.cache.a);
    });
    it('should create immediate properties.', function() {
      config.get('b', true).should.eql(config.cache.b);
    });
    it('should create nested properties.', function() {
      config = new Config();
      config.get('c.d.e', true);
      config.cache.c.d.e.should.be.true;
    });
  });
});