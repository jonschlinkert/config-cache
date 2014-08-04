/*!
 * config-cache <https://github.com/jonschlinkert/config-cache>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var should = require('should');
var Config = require('..');


describe('config data', function() {
  var config = new Config();
  beforeEach(function() {
    config.clear();
  });

  describe('.extendData()', function() {
    var config = new Config();
    it('should extend the `data` object.', function() {
      config
        .extendData({x: 'x', y: 'y', z: 'z'})
        .extendData({a: 'a', b: 'b', c: 'c'});

      config.get('data').should.have.property('a');
      config.get('data').should.have.property('b');
      config.get('data').should.have.property('c');

      config.get('data').should.have.property('x');
      config.get('data').should.have.property('y');
      config.get('data').should.have.property('z');
    });

    it('should extend the `data` object when the first param is a string.', function() {
      config
        .extendData('foo', {x: 'x', y: 'y', z: 'z'})
        .extendData('bar', {a: 'a', b: 'b', c: 'c'});

      config.get('data').should.have.property('foo');
      config.get('data').should.have.property('bar');

      config.get('data.foo').should.have.property('x');
      config.get('data.bar').should.have.property('a');

      config.cache.data.foo.should.have.property('x');
      config.cache.data.bar.should.have.property('a');
    });
  });

  describe('.flattenData()', function() {
    var config = new Config();
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

  describe('.plasma()', function() {
    var config = new Config();
    it('should read JSON files and return an object.', function() {
      var data = config.plasma('package.json');
      data.name.should.equal('config-cache');
    });

    it('should read YAML files and return an object.', function() {
      var data = config.plasma('test/fixtures/a.yml');
      data.a.should.equal('b');
    });

    it('should read an array of YAML and JSON files and return an object.', function() {
      var data = config.plasma(['package.json', 'test/fixtures/a.yml']);
      data.name.should.equal('config-cache');
      data.a.should.equal('b');
    });

    it('should expand a glob pattern, read JSON/YAML files and return an object.', function() {
      var data = config.plasma('p*.json');
      data.name.should.equal('config-cache');
    });

    it('should expand an array of glob patterns, read the JSON/YAML files and return an object.', function() {
      var data = config.plasma(['p*.json', 'test/fixtures/*.yml']);
      data.name.should.equal('config-cache');
      data.a.should.equal('b');
    });

    it('should accept an object and return an object.', function() {
      var data = config.plasma({a: 'b'});
      data.a.should.equal('b');
    });
  });

  describe('.data()', function() {
    var config = new Config();
    it('should set properties on the `data` object.', function() {
      config.set('data.foo', 'bar');
      config.get('data').foo.should.equal('bar');
      config.get('data.foo').should.equal('bar');
    });

    it('should read files and merge data onto `cache.data`', function() {
      config.data('package.json');
      config.get('data.name').should.equal('config-cache');
    });

    it('should read files and merge data onto `cache.data`', function() {
      config.data({xyz: 'abc'});
      config.get('data.xyz').should.equal('abc');
    });

    it('should read files and merge data onto `cache.data`', function() {
      config.data([{aaa: 'bbb', ccc: 'ddd'}]);
      config.get('data.aaa').should.equal('bbb');
      config.get('data.ccc').should.equal('ddd');
    });
  });
});
