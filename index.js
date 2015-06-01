/*!
 * config-cache <https://github.com/jonschlinkert/config-cache>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var typeOf = require('kind-of');
var extend = require('extend-shallow');
var flatten = require('arr-flatten');
var Emitter = require('component-emitter');
var union = require('array-union');
var omit = require('object.omit');
var set = require('set-value');
var get = require('get-value');

/**
 * Initialize a new `Cache`
 *
 * ```js
 * var cache = new Cache();
 * ```
 *
 * @class Cache
 * @param {Object} `obj` Optionally pass an object to initialize with.
 * @constructor
 * @api public
 */

function Cache(obj) {
  Emitter.call(this);
  this.cache = {};
}

Emitter(Cache.prototype);

/**
 * Static method for mixing `Cache` properties onto `obj`
 *
 * ```js
 * function App() {
 *   Cache.call(this);
 * }
 * Cache.mixin(App.prototype);
 * ```
 *
 * @param  {Object} `obj`
 * @return {Object}
 * @api public
 */

Cache.mixin = function(obj) {
  for (var key in this) {
    obj.constructor[key] = this[key];
  }
  obj.constructor.prototype = Object.create(this.prototype);
  for (var key in obj) {
    obj.constructor.prototype[key] = obj[key];
  }
  // save a reference to `this.prototype`
  obj.constructor.__super__ = this.prototype;
  return obj.constructor;
};

/**
 * Assign `value` to `key` or return the value of `key`.
 *
 * ```js
 * cache.set(key, value);
 * ```
 *
 * @param {String} `key`
 * @param {*} `value`
 * @param {Boolean} `expand` Resolve template strings with [expander]
 * @return {Object} `Cache` to enable chaining
 * @api public
 */

Cache.prototype.set = function(key, value, expand) {
  if (arguments.length === 1 && typeOf(key) === 'object') {
    this.extend(key);
    this.emit('set', key, value);
    return this;
  }
  if (expand) {
    value = this.process(value, this.cache);
    this.set(key, value, false);
  } else {
    set(this.cache, key, value);
  }
  this.emit('set', key, value);
  return this;
};

/**
 * Return the stored value of `key`. Dot notation may be used
 * to get [nested property values][get-value].
 *
 * ```js
 * cache.set('foo', 'bar');
 * cache.get('foo');
 * // => "bar"
 *
 * // also takes an array or list of property paths
 * cache.set({data: {name: 'Jon'}})
 * cache.get('data', 'name');
 * //=> 'Jon'
 * ```
 *
 * @param {*} `key`
 * @param {Boolean} `escape`
 * @return {*}
 * @api public
 */

Cache.prototype.get = function(key, escape) {
  return key ? get(this.cache, key, escape) : this.cache;
};

/**
 * Set a constant on the cache.
 *
 * ```js
 * cache.constant('site.title', 'Foo');
 * ```
 *
 * @param {String} `key`
 * @param {*} `value`
 * @chainable
 * @api public
 */

Cache.prototype.constant = function(key, value, namespace) {
  var getter;
  if (typeof value !== 'function'){
    getter = function() {
      return value;
    };
  } else {
    getter = value;
  }
  namespace = namespace || 'cache';
  this[namespace] = this[namespace] || {};
  this[namespace].__defineGetter__(key, getter);
  return this;
};

/**
 * Add values to an array on the `cache`.
 *
 * ```js
 * // config.cache['foo'] => ['a.hbs', 'b.hbs']
 * cache
 *   .union('foo', ['b.hbs', 'c.hbs'], ['d.hbs']);
 *   .union('foo', ['e.hbs', 'f.hbs']);
 *
 * // config.cache['foo'] => ['a.hbs', 'b.hbs', 'c.hbs', 'd.hbs', 'e.hbs', 'f.hbs']
 * ```
 * @chainable
 * @return {Object} `Cache` to enable chaining
 * @api public
 */

Cache.prototype.union = function(key/*, array*/) {
  if (typeof key !== 'string') {
    throw new Error('config-cache#union expects `key` to be a string.');
  }
  var arr = this.get(key) || [];
  var len = arguments.length - 1;
  var args = new Array(len);

  for (var i = 0; i < len; i++) {
    args[i] = arguments[i + 1];
  }
  this.set(key, union(arr, flatten(args)));
  this.emit('union', key);
  return this;
};

/**
 * Extend the `cache` with the given object.
 * This method is chainable.
 *
 * ```js
 * cache
 *   .extend({foo: 'bar'}, {baz: 'quux'});
 *   .extend({fez: 'bang'});
 * ```
 *
 * Or define the property to extend:
 *
 * ```js
 * cache
 *   // extend `cache.a`
 *   .extend('a', {foo: 'bar'}, {baz: 'quux'})
 *   // extend `cache.b`
 *   .extend('b', {fez: 'bang'})
 *   // extend `cache.a.b.c`
 *   .extend('a.b.c', {fez: 'bang'});
 * ```
 * @chainable
 * @return {Object} `Cache` to enable chaining
 * @api public
 */

Cache.prototype.extend = function() {
  var len = arguments.length;
  var args = new Array(len);
  for (var i = 0; i < len; i++) {
    args[i] = arguments[i];
  }
  if (typeof args[0] === 'string') {
    var o = this.get(args[0]) || {};
    o = extend.apply(extend, union([o], args.slice(1)));
    this.set(args[0], o);
    this.emit('extend');
    return this;
  }
  extend.apply(extend, union([this.cache], args));
  this.emit('extend');
  return this;
};

/**
 * Remove `keys` from the cache. If no value is
 * specified the entire cache is reset.
 *
 * ```js
 * cache.del();
 * ```
 * @chainable
 * @api public
 */

Cache.prototype.del = function(keys) {
  this.cache = keys ? omit(this.cache, keys) : {};
  this.emit('del', keys);
  return this;
};

/**
 * Expose `Cache`
 */

module.exports = Cache;
