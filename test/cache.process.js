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
var config = new Config();


describe('config process', function () {
  beforeEach(function() {
    config.clear();
    config.omit('abcdefghijklmnopqrstuvwxyz'.split(''));
  });

  describe('.process()', function () {
    it('should resolve template strings in config values', function () {
      var store = config.process({a: '<%= b %>', b: 'c'});
      store.a.should.equal('c')
    });

    it('should resolve es6 template strings in config values', function () {
      var store = config.process({a: '${b}', b: 'c'});
      store.a.should.equal('c')
    });

    it('should recursively resolve template strings.', function () {
      var store = config.process({
        a: '${b}',
        b: '${c}',
        c: '${d}',
        d: '${e.f.g}',
        e: {f:{g:'h'}}});
      store.a.should.equal('h');
    });

    describe('when functions are defined on the config', function() {
      it('should used them on config templates', function() {
        config.data({
          upper: function (str) {
            return str.toUpperCase();
          }
        });

        config.data({fez: 'bang', pop: 'boom-pow!'});
        config.data({whistle: '<%= upper(fez) %>-<%= upper(pop) %>'});
        config.get('data.whistle').should.equal('<%= upper(fez) %>-<%= upper(pop) %>');

        var a = config.process(config.get('data.whistle'), config.get('data'));
        a.should.equal('BANG-BOOM-POW!');

        var b = config.process(config.get('data'), config.get('data'));
        b.whistle.should.equal('BANG-BOOM-POW!');
      });
    });
  });
});