/*!
 * config-cache <https://github.com/jonschlinkert/config-cache>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

/* deps: mocha */
require('should');
var assert = require('assert');
var Cache = require('..');

describe('events:', function () {
  describe('when a listener is removed', function () {
    it('should remove listener', function () {
      var config = new Cache();
      var called = false;
      var type = 'foo', listeners;
      var fn = function () {};

      // add
      config.on(type, fn);
      listeners = config.listeners(type);
      listeners.length.should.equal(1);

      // remove
      config.removeListener(type, fn);
      listeners = config.listeners(type);
      listeners.length.should.equal(0);
    });
  });

  describe('when listeners are added', function () {
    it('should add the listeners', function () {
      var config = new Cache();
      var called = false;
      config.on('foo', function () {
        called = 'a';
      });
      config.emit('foo');
      called.should.equal('a');
      config.on('foo', function () {
        called = 'b';
      });
      config.emit('foo');
      called.should.equal('b');
      config.on('foo', function () {
        called = true;
      });
      config.emit('foo');
      called.should.equal(true);
      config.listeners('foo').length.should.equal(3);
    });

    it('should emit `set` when a value is set', function () {
      var called = false;
      var value = '';
      var config = new Cache();
      config.on('set', function (key, val) {
        called = key;
        value = val;
      });
      config.set('foo', 'bar');
      called.should.equal('foo');
      value.should.equal('bar');
    });

    it('should emit `set` when items are set on the config.', function () {
      var called = false;
      var config = new Cache();

      config.on('set', function (key, value) {
        called = true;
        config.cache.should.have.property(key);
      });

      config.set('one', 'a');
      config.set('two', 'c');
      config.set('one', 'b');
      config.set('two', 'd');

      called.should.be.true;
    });

    it('should emit `set`', function () {
      var called = false;
      var config = new Cache();

      config.on('set', function (key, value) {
        called = true;
        value.should.eql('baz');
      });

      config.set('foo', 'baz');
      called.should.be.true;
    });

    it('should emit `del` when an item is removed from the cache', function () {
      var called = false;
      var config = new Cache();
      config.set('one', 'a');
      config.set('two', 'c');

      config.on('del', function (key, value) {
        called = true;
        assert(config.get(key) == undefined);
      });

      config.del('one');
      config.del('two');
      called.should.be.true;
    });

    it('should emit `del` when items are deleted from the cache', function () {
      var called = false;
      var config = new Cache();
      config.set('one', 'a');
      config.set('two', 'c');
      config.set('thr', 'd');
      config.set('fou', 'e');
      config.set('fiv', 'f');
      config.set('six', 'g');
      config.set('sev', 'h');

      config.on('del', function (key) {
        called = true;
        assert(config.cache[key] == undefined);
      });

      config.del(['one', 'two', 'thr', 'fou', 'fiv', 'six', 'sev']);
      called.should.be.true;
    });
  });
});
