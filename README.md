# config-cache [![NPM version](https://badge.fury.io/js/config-cache.svg)](http://badge.fury.io/js/config-cache)  [![Build Status](https://travis-ci.org/jonschlinkert/config-cache.svg)](https://travis-ci.org/jonschlinkert/config-cache)

> General purpose JavaScript object storage methods.

Install with [npm](https://www.npmjs.com/)

```bash
npm i config-cache --save
```

## Usage

```js
var Config = require('config-cache');
var config = new Config();
```

## API

### [Cache](index.js#L42)

Initialize a new `Cache`

**Params**

* `obj` **{Object}**: Optionally pass an object to initialize with.

**Example**

```js
var cache = new Cache();
```

### [.set](index.js#L68)

Assign `value` to `key` or return the value of `key`.

**Params**

* `key` **{String}**
* `value` __{_}_*
* `expand` **{Boolean}**: Resolve template strings with [expander](https://github.com/tkellen/expander)
* `returns` **{Object}** `Cache`: to enable chaining

**Example**

```js
cache.set(key, value);
```

### [.get](index.js#L105)

Return the stored value of `key`. Dot notation may be used to get [nested property values](https://github.com/jonschlinkert/get-value).

**Params**

* `key` __{_}_*
* `escape` **{Boolean}**
* `returns` __{_}_*

**Example**

```js
cache.set('foo', 'bar');
cache.get('foo');
// => "bar"

// also takes an array or list of property paths
cache.set({data: {name: 'Jon'}})
cache.get('data', 'name');
//=> 'Jon'
```

### [.constant](index.js#L124)

Set a constant on the cache.

**Params**

* `key` **{String}**
* `value` __{_}_*

**Example**

```js
cache.constant('site.title', 'Foo');
```

### [.keys](index.js#L151)

Return the keys on `this.cache`.

* `returns` **{Boolean}**

**Example**

```js
cache.keys();
```

### [.hasOwn](index.js#L169)

Return true if `key` is an own, enumerable property of `this.cache` or the given `obj`.

**Params**

* `key` **{String}**
* `obj` **{Object}**: Optionally pass an object to check.
* `returns` **{Boolean}**

**Example**

```js
cache.hasOwn([key]);
```

### [.exists](index.js#L189)

Return true if `key` exists in `cache`. Dot notation may be used for nested properties.

**Params**

* `key` **{String}**
* `returns` **{Boolean}**

**Example**

```js
cache.exists('author.name');
//=> true
```

### [.has](index.js#L209)

Return true if `property` exists and has a non-null value. Dot notation may be used for nested properties.

**Params**

* `property` **{String}**
* `returns` **{Boolean}**

**Example**

```js
cache.has('author.name');
//=> true
```

### [.union](index.js#L233)

Add values to an array on the `cache`. This method is chainable.

* `returns` **{Object}** `Cache`: to enable chaining

**Example**

```js
// config.cache['foo'] => ['a.hbs', 'b.hbs']
cache
  .union('foo', ['b.hbs', 'c.hbs'], ['d.hbs']);
  .union('foo', ['e.hbs', 'f.hbs']);

// config.cache['foo'] => ['a.hbs', 'b.hbs', 'c.hbs', 'd.hbs', 'e.hbs', 'f.hbs']
```

### [.extend](index.js#L280)

Extend the `cache` with the given object. This method is chainable.

Or define the property to extend:

* `returns` **{Object}** `Cache`: to enable chaining

**Examples**

```js
cache
  .extend({foo: 'bar'}, {baz: 'quux'});
  .extend({fez: 'bang'});
```

```js
cache
  // extend `cache.a`
  .extend('a', {foo: 'bar'}, {baz: 'quux'})
  // extend `cache.b`
  .extend('b', {fez: 'bang'})
  // extend `cache.a.b.c`
  .extend('a.b.c', {fez: 'bang'});
```

### [.clone](index.js#L312)

Clone the given `obj` or `cache`.

**Params**

* `obj` **{Object}**: Optionally pass an object to clone.
* `returns` **{Boolean}**

**Example**

```js
cache.clone();
```

### [.methods](index.js#L329)

Return methods on `this.cache` or the given `obj`.

**Params**

* `obj` **{Object}**
* `returns` **{Array}**

**Example**

```js
cache.methods('foo')
//=> ['set', 'get', 'enable', ...]
```

### [Data methods](index.js#L342)

> Methods for reading data files, processing template strings and
extending the `cache.data` object.

### [.process](index.js#L359)

Use [expander](https://github.com/tkellen/expander)to recursively expand template strings into their resolved values.

**Params**

* `lookup` __{_}_*: Any value to process, usually strings with a cache template, like `<%= foo %>` or `${foo}`.
* `opts` __{_}_*: Options to pass to Lo-Dash `  _.template`.

**Example**

```js
cache.process({a: '<%= b %>', b: 'c'});
//=> {a: 'c', b: 'c'}
```

### [.extendData](index.js#L422)

Extend the `cache.data` object with the given data. This method is chainable.

* `returns` **{Object}** `Cache`: to enable chaining

**Example**

```js
cache
  .extendData({foo: 'bar'}, {baz: 'quux'});
  .extendData({fez: 'bang'});
```

### [.plasma](index.js#L459)

Extend the `data` object with the value returned by [plasma](https://github.com/jonschlinkert/plasma).

**Example:**

See the [plasma](https://github.com/jonschlinkert/plasma)documentation for all available options.

**Params**

* `data` **{Object|String|Array}**: File path(s), glob pattern, or object of data.
* `options` **{Object}**: Options to pass to plasma.

**Example**

```js
cache
  .plasma({foo: 'bar'}, {baz: 'quux'});
  .plasma({fez: 'bang'});
```

### [.data](index.js#L491)

Extend the `cache.data` object with data from a JSON or YAML file, or by passing an object directly - glob patterns or file paths may be used.

When `true` is passed as the last argumemnt data will
be processed by [expander](https://github.com/tkellen/expander)before extending `cache.data`.

**Params**

* `values` **{Object|Array|String}**: Values to pass to plasma.
* `process` **{Boolean}**: If `true`,
* `returns` **{Object}** `Cache`: to enable chaining

**Examples**

```js
cache
  .data({a: 'b'})
  .data({c: 'd'});

console.log(config.cache);
//=> {data: {a: 'b', c: 'd'}}
```

```js
cache.data({a: '<%= b %>', b: 'z'})
//=> {data: {a: 'z', b: 'z'}}
```

### [.omit](index.js#L553)

Omit properties from the `cache`.

**Example:**

* `returns` **{Object}** `Cache`: to enable chaining

**Example**

```js
cache
  .omit('foo');
  .omit('foo', 'bar');
  .omit(['foo']);
  .omit(['foo', 'bar']);
```

### [.del](index.js#L575)

Remove `key` from the cache, or if no value is specified the entire cache is reset.

**Example:**

**Example**

```js
cache.del();
```

## Usage Examples

### .set

If `expand: true` is defined on the options, the value will be set using [expander](https://github.com/tkellen/expander).

**Examples:**

```js
// as a key-value pair
cache.set('a', {b: 'c'});

// or as an object
cache.set({a: {b: 'c'}});

// chaining is possible
cache
  .set({a: {b: 'c'}})
  .set('d', 'e');
```

Expand template strings with expander:

```js
cache.set('a', {b: '${c}', c: 'd'}, true);
```

Visit the [expander](https://github.com/tkellen/expander)docs for more info.

## Related

* [cache-base](https://github.com/jonschlinkert/cache-base): Generic object cache for node.js/javascript projects.
* [engine-cache](https://github.com/jonschlinkert/engine-cache): express.js inspired template-engine manager.
* [get-value](https://github.com/jonschlinkert/get-value): Use property paths (`  a.b.c`) get a nested value from an object.
* [helper-cache](https://github.com/jonschlinkert/helper-cache): Easily register and get helper functions to be passed to any template engine or node.js… [more](https://github.com/jonschlinkert/helper-cache)
* [has-value](https://github.com/jonschlinkert/has-value): Returns true if a value exists, false if empty. Works with deeply nested values using… [more](https://github.com/jonschlinkert/has-value)
* [loader-cache](https://github.com/jonschlinkert/loader-cache): Register loader functions that dynamically read, parse or otherwise transform file contents when the name… [more](https://github.com/jonschlinkert/loader-cache)
* [map-cache](https://github.com/jonschlinkert/map-cache): Basic cache object for storing key-value pairs.
* [option-cache](https://github.com/jonschlinkert/option-cache): Simple API for managing options in JavaScript applications.
* [parser-cache](https://github.com/jonschlinkert/parser-cache): Cache and load parsers, similiar to consolidate.js engines.
* [set-value](https://github.com/jonschlinkert/set-value): Create nested values and any intermediaries using dot notation (`'a.b.c'`) paths.

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/jonschlinkert/config-cache/issues/new)

## Running tests

Install dev dependencies:

```bash
npm i -d && npm test
```

## Author

**Jon Schlinkert**

+ [github/jonschlinkert](https://github.com/jonschlinkert)
+ [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

## License

Copyright (c) 2015 Jon Schlinkert
Released under the MIT license.

***

_This file was generated by [verb-cli](https://github.com/assemble/verb-cli) on May 07, 2015._
