/*!
 * config-cache <https://github.com/jonschlinkert/config-cache>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('lodash');
var util = require('util');
var typeOf = require('kind-of');
var Options = require('option-cache');
var namespaceData = require('namespace-data');
var getobject = require('getobject');
var expander = require('expander');
var plasma = require('plasma');
var Events = require('./events');
var expand = expander.process;
var extend = _.extend;


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

var Cache = Events.extend({
  constructor: function(o) {
    Cache.__super__.constructor.call(this);
    this.cache = o || {};
    this.cache.data = this.cache.data || {};
    Options.call(this, this.cache.options);
  }
});

Cache.extend = Events.extend;
extend(Cache.prototype, Options.prototype);

/**
 * Assign `value` to `key` or return the value of `key`.
 *
 * ```js
 * cache.set(key, value);
 * ```
 *
 * If `expand` is defined as true, the value will be set using [expander].
 *
 * **Examples:**
 *
 * ```js
 * // as a key-value pair
 * cache.set('a', {b: 'c'});
 *
 * // or as an object
 * cache.set({a: {b: 'c'}});
 *
 * // chaining is possible
 * cache
 *   .set({a: {b: 'c'}})
 *   .set('d', 'e');
 * ```
 *
 * Expand template strings with expander:
 *
 * ```js
 * cache.set('a', {b: '${c}', c: 'd'}, true);
 * ```
 *
 * Visit the [expander] docs for more info.
 *
 *
 * [expander]: https://github.com/tkellen/expander
 * [getobject]: https://github.com/cowboy/node-getobject
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
    getobject.set(this.cache, key, value);
  }

  this.emit('set', key, value);
  return this;
};


/**
 * Return the stored value of `key`. If the value
 * does **not** exist on the cache, you may pass
 * `true` as a second parameter to tell [getobject]
 * to initialize the value as an empty object.
 *
 * ```js
 * cache.set('foo', 'bar');
 * cache.get('foo');
 * // => "bar"
 * ```
 *
 * @param {*} `key`
 * @param {Boolean} `create`
 * @return {*}
 * @api public
 */

Cache.prototype.get = function(key, create) {
  if (!key) {
    return this.cache;
  }
  return getobject.get(this.cache, key, create);
};


/**
 * Set a constant on the cache.
 *
 * **Example**
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
  if (!this[namespace]) {
    this[namespace] = {};
  }

  this[namespace].__defineGetter__(key, getter);
  return this;
};


/*
 * Return `true` if the element exists. Dot notation
 * may be used for nested properties.
 *
 * **Example**
 *
 * ```js
 * cache.exists('author.name');
 * //=> true
 * ```
 *
 * @param   {String}  `key`
 * @return  {Boolean}
 * @api public
 */

Cache.prototype.exists = function(key) {
  return getobject.exists(this.cache, key);
};


/**
 * Add values to an array on the `cache`. This method
 * is chainable.
 *
 * **Example**
 *
 * ```js
 * // config.cache['foo'] => ['a.hbs', 'b.hbs']
 * cache
 *   .union('foo', ['b.hbs', 'c.hbs'], ['d.hbs']);
 *   .union('foo', ['e.hbs', 'f.hbs']);
 *
 * // config.cache['foo'] => ['a.hbs', 'b.hbs', 'c.hbs', 'd.hbs', 'e.hbs', 'f.hbs']
 * ```
 *
 * @chainable
 * @return {Object} `Cache` to enable chaining
 * @api public
 */

Cache.prototype.union = function(key) {
  var args = [].slice.call(arguments, 1);
  var arr = this.get(key) || [];

  if (!Array.isArray(arr)) {
    throw new Error('Cache#union expected an array but got', arr);
  }

  this.set(key, _.union.apply(_, [arr].concat(args)));
  return this;
};


/**
 * Extend the `cache` with the given object.
 * This method is chainable.
 *
 * **Example**
 *
 * ```js
 * cache
 *   .defaults({foo: 'bar'}, {baz: 'quux'});
 *   .defaults({fez: 'bang'});
 * ```
 *
 * Or define the property to defaults:
 *
 * ```js
 * cache
 *   // defaults `cache.a`
 *   .defaults('a', {foo: 'bar'}, {baz: 'quux'})
 *   // defaults `cache.b`
 *   .defaults('b', {fez: 'bang'})
 *   // defaults `cache.a.b.c`
 *   .defaults('a.b.c', {fez: 'bang'});
 * ```
 *
 * @chainable
 * @return {Object} `Cache` to enable chaining
 * @api public
 */

Cache.prototype.defaults = function() {
  var args = [].slice.call(arguments);

  if (typeof args[0] === 'string') {
    var o = this.get(args[0]) || {};
    o = _.defaults.apply(_, [o].concat(_.rest(args)));
    this.set(args[0], o);
    this.emit('defaults');
    return this;
  }

  _.defaults.apply(_, [this.cache].concat(args));
  this.emit('defaults');

  return this;
};


/**
 * Extend the `cache` with the given object.
 * This method is chainable.
 *
 * **Example**
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
 *
 * @chainable
 * @return {Object} `Cache` to enable chaining
 * @api public
 */

Cache.prototype.extend = function() {
  var args = [].slice.call(arguments);

  if (typeof args[0] === 'string') {
    var o = this.get(args[0]) || {};
    o = extend.apply(_, [o].concat(_.rest(args)));
    this.set(args[0], o);
    this.emit('extend');
    return this;
  }

  extend.apply(_, [this.cache].concat(args));
  this.emit('extend');
  return this;
};


/**
 * Extend the cache with the given object.
 * This method is chainable.
 *
 * **Example**
 *
 * ```js
 * cache
 *   .merge({foo: 'bar'}, {baz: 'quux'});
 *   .merge({fez: 'bang'});
 * ```
 *
 * @chainable
 * @return {Object} `Cache` to enable chaining
 * @api public
 */

Cache.prototype.merge = function() {
  var args = [].slice.call(arguments);
  if (typeof args[0] === 'string') {
    var o = this.get(args[0]) || {};
    o = _.merge.apply(_, [o].concat(_.rest(args)));
    this.set(args[0], o);
    this.emit('merge');
    return this;
  }
  _.merge.apply(_, [this.cache].concat(args));
  this.emit('merge');
  return this;
};


/**
 * Return the keys on `this.cache`.
 *
 * ```js
 * cache.keys();
 * ```
 *
 * @return {Boolean}
 * @api public
 */

Cache.prototype.keys = function() {
  return Object.keys(this.cache);
};


/**
 * Return true if `key` is an own, enumerable property
 * of `this.cache` or the given `obj`.
 *
 * ```js
 * cache.hasOwn([key]);
 * ```
 *
 * @param  {String} `key`
 * @param  {Object} `obj` Optionally pass an object to check.
 * @return {Boolean}
 * @api public
 */

Cache.prototype.hasOwn = function(key, o) {
  return {}.hasOwnProperty.call(o || this.cache, key);
};


/**
 * Clone the given `obj` or `cache`.
 *
 * ```js
 * cache.clone();
 * ```
 *
 * @param  {Object} `obj` Optionally pass an object to clone.
 * @return {Boolean}
 * @api public
 */

Cache.prototype.clone = function(o) {
  return _.cloneDeep(o || this.cache);
};


/**
 * Return methods on `this.cache` or the given `obj`.
 *
 * ```js
 * cache.methods('foo')
 * //=> ['set', 'get', 'enable', ...]
 * ```
 *
 * @param {Object} `obj`
 * @return {Array}
 * @api public
 */

Cache.prototype.methods = function(o) {
  o = o || this.cache;
  return _.pick(o, _.methods(o));
};


/**
 * # Data
 *
 * > Methods for reading data files, processing template strings and
 * extending the `cache.data` object.
 *
 * Use [expander] to recursively expand template strings into
 * their resolved values.
 *
 * **Example**
 *
 * ```js
 * cache.process({a: '<%= b %>', b: 'c'});
 * //=> {a: 'c', b: 'c'}
 * ```
 *
 * @param {*} `lookup` Any value to process, usually strings with a
 *                     cache template, like `<%= foo %>` or `${foo}`.
 * @param {*} `opts` Options to pass to Lo-Dash `_.template`.
 * @api public
 */

Cache.prototype.process = function(lookup, context) {
  var args = [].slice.call(arguments);

  if (!args.length) {
    lookup = context = this.cache.data;
  } else {
    context = context || this.cache.data;
    if (typeOf(lookup) === 'object') {
      context = extend({}, context, lookup);
    }
  }

  var methods = this.methods(context);
  var o = expand(context, lookup, {
    imports: methods
  });

  if (!args.length) {
    extend(this.cache.data, o);
  }

  return o;
};


/**
 * If a `data` property is on the given `data` object
 * (e.g. `data.data`, like when files named `data.json`
 * or `data.yml` are used), the value of `data.data`'s
 * is flattened to the root `data` object.
 *
 * @param {Object} `data`
 * @return {Object} Returns the flattened object.
 * @api private
 */

Cache.prototype.flattenData = function(data, name) {
  name = name || 'data';

  name = !Array.isArray(name) ? [name] : name;
  name.forEach(function (prop) {
    if (data && data.hasOwnProperty(prop)) {
      extend(data, data[prop]);
      delete data[prop];
    }
  });

  return data;
};


/**
 * Extend the `cache.data` object with the given data. This
 * method is chainable.
 *
 * **Example**
 *
 * ```js
 * cache
 *   .extendData({foo: 'bar'}, {baz: 'quux'});
 *   .extendData({fez: 'bang'});
 * ```
 *
 * @chainable
 * @return {Object} `Cache` to enable chaining
 * @api public
 */

Cache.prototype.extendData = function() {
  var args = [].slice.call(arguments);

  if (typeof args[0] === 'string') {
    this.extend.apply(this, ['data.' + args[0]].concat(_.rest(args)));
    this.emit('extendData');
    return this;
  }

  this.extend.apply(this, ['data'].concat(args));
  this.emit('extendData');

  return this;
};


/**
 * Extend the `data` object with the value returned by [plasma].
 *
 * **Example:**
 *
 * ```js
 * cache
 *   .plasma({foo: 'bar'}, {baz: 'quux'});
 *   .plasma({fez: 'bang'});
 * ```
 *
 * See the [plasma] documentation for all available options.
 *
 * @param {Object|String|Array} `data` File path(s), glob pattern, or object of data.
 * @param {Object} `options` Options to pass to plasma.
 * @api public
 */

Cache.prototype.plasma = function() {
  var args = [].slice.call(arguments);
  return plasma.apply(this, args);
};


/**
 * Expects file path(s) or glob pattern(s) to any JSON or YAML files to
 * be merged onto the data object. Any data files read in by the
 * `.namespace()` method will extend the `data` object with an object
 * named after the basename of each file.
 *
 * **Example**
 *
 * ```js
 * cache.namespace(['alert.json', 'nav*.json']);
 * ```
 * The data from each file is namespaced using the name of the file:
 *
 * ```js
 * {
 *   alert: {},
 *   navbar: {}
 * }
 * ```
 *
 * See the [plasma] documentation for all available options.
 *
 * @param {String|Array} `patterns` Filepaths or glob patterns.
 * @return {null}
 * @api public
 */

Cache.prototype.namespace = function(namespace, data, context) {
  var args = [].slice.call(arguments);
  var len = args.length;

  var o = {}, last;

  // 1) when the last arg is `true`...
  if (typeof args[len - 1] === 'boolean') {
    last = args[len - 1];
    args = _.initial(args);
    context = {};
  }

  // Shallow clone `cache.data` to pass as context to namespace-data
  var ctx = extend({}, this.cache.data, context);
  extend(o, namespaceData(namespace, data, ctx));

  o = this.flattenData(o);

  // 2) process data with expander
  if (last) {
    o = this.process(o);
  }

  return this.extendData(o);
};


/**
 * Extend the `cache.data` object with data from a JSON
 * or YAML file, or by passing an object directly - glob
 * patterns or file paths may be used.
 *
 * ```js
 * cache
 *   .data({a: 'b'})
 *   .data({c: 'd'});
 *
 * console.log(config.cache);
 * //=> {data: {a: 'b', c: 'd'}}
 * ```
 *
 * When `true` is passed as the last argumemnt data will
 * be processed by [expander] before extending `cache.data`.
 *
 * ```js
 * cache.data({a: '<%= b %>', b: 'z'})
 * //=> {data: {a: 'z', b: 'z'}}
 * ```
 *
 * @param {Object|Array|String} `values` Values to pass to plasma.
 * @param {Boolean} `process` If `true`,
 * @return {Object} `Cache` to enable chaining
 * @api public
 */

Cache.prototype.data = function() {
  var args = [].slice.call(arguments);
  var len = args.length;

  if (!len) {
    return this.cache.data;
  }

  var o = {}, last;

  // 1) when the last arg is `true`...
  if (typeof args[len - 1] === 'boolean') {
    last = args[len - 1];
    args = _.initial(args);
  }

  extend(o, plasma.apply(plasma, args));
  o = this.flattenData(o);

  // 2) process data with expander
  if (last) {
    this.extendData(this.process(o));
    return this;
  }

  this.extendData(o);
  return this;
};


/**
 * # Clearing the cache
 *
 * > Methods for clearing the cache, removing or reseting specific
 * values on the cache.
 *
 * @section
 */


/**
 * Omit properties from the `cache`.
 *
 * **Example:**
 *
 * ```js
 * cache
 *   .omit('foo');
 *   .omit('foo', 'bar');
 *   .omit(['foo']);
 *   .omit(['foo', 'bar']);
 * ```
 *
 * @chainable
 * @return {Object} `Cache` to enable chaining
 * @api public
 */

Cache.prototype.omit = function() {
  var args = [].slice.call(arguments);
  this.cache = _.omit.apply(_, [this.cache].concat(args));

  this.emit('omit');
  return this;
};


/**
 * Remove `key` from the cache, or if no value is
 * specified the entire cache is reset.
 *
 * **Example:**
 *
 * ```js
 * cache.clear();
 * ```
 *
 * @chainable
 * @api public
 */

Cache.prototype.clear = function(key) {
  if (key) {
    this.emit('clear', key);
    delete this.cache[key];
  } else {
    this.cache = {};
    this.emit('clear');
  }
};


/**
 * Expose `Cache`
 */

module.exports = Cache;
