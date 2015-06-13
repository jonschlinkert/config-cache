'use strict';

/**
 * Module dependencies
 */

var Emitter = require('component-emitter');
var lazy = require('lazy-cache')(require);

/**
 * Lazily required module dependencies
 */

var omit = lazy('object.omit');
var typeOf = lazy('kind-of');
var extend = lazy('extend-shallow');
var flatten = lazy('arr-flatten');
var union = lazy('array-union');
var set = lazy('set-value');
var get = lazy('get-value');

/**
 * Initialize a new `Config`, optionally passing an object
 * to initialize with.
 *
 * ```js
 * var cache = new Config();
 * ```
 * @param {Object} `cache`
 * @api public
 */

function Config(cache) {
  Emitter.call(this);
  this.cache = cache || {};
}

Emitter(Config.prototype);

/**
 * Static method for mixing `Config` prototype properties onto `obj`.
 *
 * ```js
 * function App() {
 *   Config.call(this);
 * }
 * Config.mixin(App.prototype);
 * ```
 *
 * @param  {Object} `obj`
 * @return {Object}
 * @api public
 */

Config.mixin = function(receiver, provider) {
  provider = provider || this;
  for (var key in provider) {
    receiver.constructor[key] = provider[key];
  }
  receiver.constructor.prototype = Object.create(provider.prototype);
  for (var prop in receiver) {
    receiver.constructor.prototype[prop] = receiver[prop];
  }
  receiver.constructor.__super__ = provider.prototype;
  return receiver.constructor;
};

/**
 * Assign `value` to `key` or return the value of `key`.
 *
 * ```js
 * config.set(key, value);
 * ```
 *
 * @param {String} `key`
 * @param {*} `value`
 * @return {Object} `Config` to enable chaining
 * @api public
 */

Config.prototype.set = function(key, value) {
  if (arguments.length === 1 && typeOf()(key) === 'object') {
    this.extend(key);
  } else {
    set()(this.cache, key, value);
  }
  this.emit('set', key, value);
  return this;
};

/**
 * Return the stored value of `key`. Dot notation may be used
 * to get [nested property values][get-value].
 *
 * ```js
 * config.set('foo', 'bar');
 * config.get('foo');
 * // => "bar"
 *
 * // also takes an array or list of property paths
 * config.set({data: {name: 'Jon'}})
 * config.get('data', 'name');
 * //=> 'Jon'
 * ```
 *
 * @param {*} `key`
 * @param {Boolean} `escape`
 * @return {*}
 * @api public
 */

Config.prototype.get = function(key, escape) {
  return key ? get()(this.cache, key, escape) : this.cache;
};

/**
 * Create a constant (getter/setter) for setting and getting values
 * on the given `namespace` or `this.cache`.
 *
 * ```js
 * config.constant('site.title', 'Foo');
 * ```
 *
 * @param {String} `key`
 * @param {*} `value`
 * @chainable
 * @api public
 */

Config.prototype.constant = function(key, value, namespace) {
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
 * config
 *   .union('foo', ['b.hbs', 'c.hbs'], ['d.hbs']);
 *   .union('foo', ['e.hbs', 'f.hbs']);
 *
 * // config.cache['foo'] => ['a.hbs', 'b.hbs', 'c.hbs', 'd.hbs', 'e.hbs', 'f.hbs']
 * ```
 * @chainable
 * @return {Object} `Config` to enable chaining
 * @api public
 */

Config.prototype.union = function(key/*, array*/) {
  if (typeof key !== 'string') {
    throw new Error('config-cache#union expects `key` to be a string.');
  }
  var arr = this.get(key) || [];
  var len = arguments.length - 1;
  var args = new Array(len);

  for (var i = 0; i < len; i++) {
    args[i] = arguments[i + 1];
  }
  this.set(key, union()(arr, flatten()(args)));
  this.emit('union', key);
  return this;
};

/**
 * Extend the `cache` with the given object.
 * This method is chainable.
 *
 * ```js
 * config
 *   .extend({foo: 'bar'}, {baz: 'quux'});
 *   .extend({fez: 'bang'});
 * ```
 *
 * Or define the property to extend:
 *
 * ```js
 * config
 *   // extend `cache.a`
 *   .extend('a', {foo: 'bar'}, {baz: 'quux'})
 *   // extend `cache.b`
 *   .extend('b', {fez: 'bang'})
 *   // extend `cache.a.b.c`
 *   .extend('a.b.c', {fez: 'bang'});
 * ```
 * @chainable
 * @return {Object} `Config` to enable chaining
 * @api public
 */

Config.prototype.extend = function() {
  var len = arguments.length;
  var args = new Array(len);
  for (var i = 0; i < len; i++) {
    args[i] = arguments[i];
  }
  var e = extend();
  if (typeof args[0] === 'string') {
    var o = this.get(args[0]) || {};
    o = e.apply(e, union()([o], args.slice(1)));
    this.set(args[0], o);
    this.emit('extend');
    return this;
  }
  e.apply(e, union()([this.cache], args));
  this.emit('extend');
  return this;
};

/**
 * Remove `keys` from the cache. If no value is
 * specified the entire cache is reset.
 *
 * ```js
 * config.del();
 * ```
 * @chainable
 * @api public
 */

Config.prototype.del = function(keys) {
  this.cache = keys ? omit()(this.cache, keys) : {};
  this.emit('del', keys);
  return this;
};

/**
 * Expose `Config`
 */

module.exports = Config;
/* deps: arr-flatten array-union extend-shallow get-value kind-of object.omit set-value */
