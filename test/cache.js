/*!
 * config-cache <https://github.com/jonschlinkert/config-cache>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var should = require('should');
var Cache = require('..');

describe('Cache', function () {
  describe('constructor:', function () {
    it('when new Cache() is defined:', function () {
      var config = new Cache({
        one: 1,
        two: 2
      });
      config.get('one').should.eql(1);
      config.get('two').should.eql(2);
      config.should.be.instanceOf(Cache);
    });
  });

  describe('keys():', function () {
    var config = new Cache();
    it('should return the keys of properties on the cache.', function () {
      config.set('a', 1);
      config.set('b', 2);
      config.set('c', 3);
      config.keys().should.eql(['data', 'a', 'b', 'c']);
    });
  });

  describe('all:', function () {
    var config = new Cache();

    it('should list the entire cache', function () {
      config.get().should.eql(config.cache);
    });
  });

  describe('events:', function () {
    describe('when configuration settings are customized', function () {
      it('should have the custom settings', function () {
        var config = new Cache();
        config.wildcard.should.be.true;
        config.listenerTree.should.be.an.object;
      });
    });

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
          config.exists(key).should.be.true;
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

      // events are currently disabled on options
      it.skip('should emit `enabled` when a value is enabled', function () {
        var config = new Cache();
        var called = false;

        config.once('enable', function (key, value) {
          called = true;
          config.enable('hidden');
        });

        config.enable('option');
        config.enabled('hidden').should.be.true;
        called.should.be.true;
      });

      // events are currently disabled on options
      it.skip('should emit `disable` when items on the cache are disabled.', function () {
        var called = false;
        var config = new Cache();

        config.enable('foo');
        config.enabled('foo').should.be.true;

        config.once('disable', function (key, value) {
          called = true;
        });

        config.disable('foo');
        called.should.be.true;

        config.enabled('foo').should.be.false;
      });

      it('should emit `clear` when an item is removed from the cache', function () {
        var called = false;
        var config = new Cache();
        config.set('one', 'a');
        config.set('two', 'c');

        config.on('clear', function (key, value) {
          called = true;
          config.get(key).should.be.undefined;
        });

        config.clear('one');
        config.clear('two');

        called.should.be.true;
      });

      it('should emit `omit` when items are omitted from the cache', function () {
        var called = false;
        var config = new Cache();
        config.set('one', 'a');
        config.set('two', 'c');
        config.set('thr', 'd');
        config.set('fou', 'e');
        config.set('fiv', 'f');
        config.set('six', 'g');
        config.set('sev', 'h');

        config.on('omit', function (key) {
          config.get(key).should.be.undefined;
          called = true;
        });

        config.omit(['one', 'two', 'thr', 'fou', 'fiv', 'six', 'sev']);

        called.should.be.true;
      });
    });
  });
});
