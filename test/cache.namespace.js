/*!
 * config-cache <https://github.com/jonschlinkert/config-cache>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var assert = require('assert');
var should = require('should');
var Config = require('..');
var config = new Config();


describe('config data', function () {
  describe('.namespace()', function() {
    it('should namespace data using the `:basename` of the file.', function() {
      config.namespace(':basename', 'test/fixtures/data/alert.json');
      config.get('data').should.have.property('alert');
    })

    it('should namespace data using the `:basename` of each file in a glob.', function() {
      config.namespace(':basename', 'test/fixtures/data/*.json');
      config.get('data').should.have.property('alert');
      config.get('data').should.have.property('test');

      // `data` property should be flattened by `config.flattenData()`
      config.get('data').should.not.have.property('data');
    });

    it('should namespace data using the `:basename` of each file, without having to define it.', function() {
      config.namespace(':basename', 'test/fixtures/data/*.json');
      config.get('data').should.have.property('alert');
      config.get('data').should.have.property('test');

      // `data` property should be flattened by `config.flattenData()`
      config.get('data').should.not.have.property('data');
    });

    it('should namespace data from an array of files.', function() {
      config.namespace(':basename', 'test/fixtures/data/*.json');
      config.get('data').should.have.property('alert');
      config.get('data').should.have.property('test');

      // `data` property should be flattened by `config.flattenData()`
      config.get('data').should.not.have.property('data');
    });

    it('should namespace data using the `:basename` of each file in an array of globs.', function() {
      config.namespace(':basename', ['test/fixtures/data/*.json']);
      config.get('data').should.have.property('alert');
      config.get('data').should.have.property('test');

      // `data` property should be flattened by `config.flattenData()`
      config.get('data').should.not.have.property('data');
    });

    it('should namespace data using the `:propstring`.', function() {
      config.namespace(':basename', 'test/fixtures/data/data.json');
      config.get('data').should.have.property('root');
      config.get('data').should.not.have.property('data');
    });
  });

  describe('when a `:propstring` is passed and matching context is found.', function() {
    it('should namespace data using value matching the `:propstring`.', function() {
      config.namespace(':foo', 'test/fixtures/data/data.json', {foo: 'bar'});
      config.get('data').should.have.property('bar');
    });
  });

  describe('when a `:propstring` is passed and NO matching context is found.', function() {
    it('should namespace data using the actual `:propstring`.', function() {
      config.namespace(':foo', 'test/fixtures/data/data.json');
      config.get('data').should.have.property('foo');
    });
  });

  describe('.namespace()', function() {
    it('should namespace data using the specified value.', function() {
      config.namespace('site', 'test/fixtures/data/data.json');
      config.get('data').should.have.property('site');
    });
  });
});