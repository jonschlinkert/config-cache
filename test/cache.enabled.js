/*!
 * config-cache <https://github.com/jonschlinkert/config-cache>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var should = require('should');
var Config = require('..');
var config;

describe('config get/set', function () {
  beforeEach(function() {
    config = new Config();
  });

  describe('.enable/enabled()', function () {
    it('should set the value to true', function () {
      config.enable('foo');
      config.enabled('foo').should.be.true;
    });

    it('should return `this`', function () {
      config.enable('foo').should.equal(config);
    });

    it('should default to false', function () {
      config.enabled('xyz').should.be.false;
    });

    it('should return true when set', function () {
      config.enable('a');
      config.enabled('a').should.be.true;
    });

    it('should return `false` when set to `false` as an option.', function () {
      config.option('a', false);
      config.enabled('a').should.be.false;
    });

    it('should return true when set as an option.', function () {
      config.option('a', true);
      config.enabled('a').should.be.true;
    });
  });

  describe('.disable/disabled()', function () {
    it('should set the value to false', function () {
      config.disable('foo');
      config.disabled('foo').should.be.true;
      config.enabled('foo').should.be.false;
    });

    it('should return `this`', function () {
      config.disable('foo').should.eql(config);
    });

    it('should default to true', function () {
      config.disabled('xyz').should.be.true;
    });

    it('should return false when set', function () {
      config.disable('abc');
      config.disabled('abc').should.be.true;
    });
  });
});