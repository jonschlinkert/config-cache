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

describe('.get', function () {
  beforeEach(function () {
    config = new Config();
    obj = {a: {b: {c: 1, d: '', e: null, f: undefined, 'g.h.i': 2}}};
    config.set(obj);
  })

  describe('get() - add:', function () {
    it('should return undefined when no set', function () {
      (typeof config.get('zzz') === 'undefined').should.be.true;
    });
    it('should otherwise return the value', function () {
      config.set('a', 'b');
      config.get('a').should.equal('b');
    });
    it('should get immediate properties.', function() {
      config.get('a').should.eql(obj.a);
    });
    it('should get nested properties.', function() {
      config.get('a.b').should.eql(obj.a.b);
    });
    it('should return undefined for nonexistent properties.', function() {
      assert(config.get('a.x') == undefined);
    });
    it('should return values.', function() {
      config.get('a.b.c').should.eql(1);
    });
    it('should return values.', function() {
      config.get('a.b.d').should.eql('');
    });
    it('should return values.', function() {
      assert(config.get('a.b.e') == null);
      (config.get('a.b.e') == null).should.be.true;
    });
    it('should return values.', function() {
      assert(config.get('a.b.f') == undefined);
    });
    it('literal backslash should escape period in property name.', function() {
      config.get('a.b.g\\.h\\.i', true).should.equal(2);
    });
    it('should just return existing properties.', function() {
      config.get('a', true).should.eql(config.cache.a);
    });
    it('should create nested properties.', function() {
      config = new Config();
      config.set('c.d.e', true);
      config.cache.c.d.e.should.be.true;
    });
  });
});
