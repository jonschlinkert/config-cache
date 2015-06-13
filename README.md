# config-cache [![NPM version](https://badge.fury.io/js/config-cache.svg)](http://badge.fury.io/js/config-cache)  [![Build Status](https://travis-ci.org/jonschlinkert/config-cache.svg)](https://travis-ci.org/jonschlinkert/config-cache)

> General purpose JavaScript object storage methods.

## Breaking changes in 5.0!

Major breaking changes were made in 5.0!

In an effort to simplify the library, the following methods were removed:

* `clone`: use [clone-deep](https://github.com/jonschlinkert/clone-deep), example: `var obj = cloneDeep(config.cache)`
* `keys`: use `Object.keys(config.cache)`
* `omit`: use `.del()`
* `exists`: use `config.cache.hasOwnProperty()` or [has-value](https://github.com/jonschlinkert/has-value)
* `has`: use `config.cache.hasownProperty()` or [has-value](https://github.com/jonschlinkert/has-value)
* `hasOwn`: use `config.cache.hasOwnProperty()` or [has-value](https://github.com/jonschlinkert/has-value)

The following data methods were also removed, use [plasma-cache](https://github.com/jonschlinkert/plasma-cache)if you need these methods:

* `data`
* `process`
* `plasma`
* `extendData`

## Install

Install with [npm](https://www.npmjs.com/)

```sh
$ npm i config-cache --save
```

## Usage

```js
var Config = require('config-cache');
var config = new Config();
```

## API

### [Config](index.js#L33)

Initialize a new `Config`, optionally passing an object to initialize with.

**Params**

* `cache` **{Object}**

**Example**

```js
var config = new Config();
```

### [.mixin](index.js#L55)

Static method for mixing `Config` prototype properties onto `obj`.

**Params**

* `obj` **{Object}**
* `returns` **{Object}**

**Example**

```js
function App() {
  Config.call(this);
}
Config.mixin(App.prototype);
```

### [.set](index.js#L81)

Assign `value` to `key` or return the value of `key`.

**Params**

* `key` **{String}**
* `value` **{*}**
* `returns` **{Object}** `Config`: to enable chaining

**Example**

```js
config.set(key, value);
```

### [.get](index.js#L112)

Return the stored value of `key`. Dot notation may be used to get [nested property values](https://github.com/jonschlinkert/get-value).

**Params**

* `key` **{*}**
* `escape` **{Boolean}**
* `returns` **{*}**

**Example**

```js
config.set('foo', 'bar');
config.get('foo');
// => "bar"

// also takes an array or list of property paths
config.set({data: {name: 'Jon'}})
config.get('data', 'name');
//=> 'Jon'
```

### [.constant](index.js#L130)

Create a constant (getter/setter) for setting and getting values on the given `namespace` or `this.cache`.

**Params**

* `key` **{String}**
* `value` **{*}**

**Example**

```js
config.constant('site.title', 'Foo');
```

### [.union](index.js#L161)

Add values to an array on the `cache`.

* `returns` **{Object}** `Config`: to enable chaining

**Example**

```js
// config.cache['foo'] => ['a.hbs', 'b.hbs']
config
  .union('foo', ['b.hbs', 'c.hbs'], ['d.hbs']);
  .union('foo', ['e.hbs', 'f.hbs']);

// config.cache['foo'] => ['a.hbs', 'b.hbs', 'c.hbs', 'd.hbs', 'e.hbs', 'f.hbs']
```

### [.extend](index.js#L203)

Extend the `cache` with the given object. This method is chainable.

Or define the property to extend:

* `returns` **{Object}** `Config`: to enable chaining

**Examples**

```js
config
  .extend({foo: 'bar'}, {baz: 'quux'});
  .extend({fez: 'bang'});
```

```js
config
  // extend `cache.a`
  .extend('a', {foo: 'bar'}, {baz: 'quux'})
  // extend `cache.b`
  .extend('b', {fez: 'bang'})
  // extend `cache.a.b.c`
  .extend('a.b.c', {fez: 'bang'});
```

### [.del](index.js#L233)

Remove `keys` from the cache. If no value is specified the entire cache is reset.

**Example**

```js
config.del();
```

## Usage Examples

### .set

If `expand: true` is defined on the options, the value will be set using [expander].

**Examples:**

```js
// as a key-value pair
config.set('a', {b: 'c'});

// or as an object
config.set({a: {b: 'c'}});

// chaining is possible
cache
  .set({a: {b: 'c'}})
  .set('d', 'e');
```

Expand template strings with expander:

```js
config.set('a', {b: '${c}', c: 'd'}, true);
```

Visit the [expander] docs for more info.

## Related

* [cache-base](https://github.com/jonschlinkert/cache-base): Generic object cache for node.js/javascript projects.
* [engine-cache](https://github.com/jonschlinkert/engine-cache): express.js inspired template-engine manager.
* [get-value](https://github.com/jonschlinkert/get-value): Use property paths (`  a.b.c`) to get a nested value from an object.
* [has-value](https://github.com/jonschlinkert/has-value): Returns true if a value exists, false if empty. Works with deeply nested values using… [more](https://github.com/jonschlinkert/has-value)
* [helper-cache](https://github.com/jonschlinkert/helper-cache): Easily register and get helper functions to be passed to any template engine or node.js… [more](https://github.com/jonschlinkert/helper-cache)
* [loader-cache](https://github.com/jonschlinkert/loader-cache): Register loader functions that dynamically read, parse or otherwise transform file contents when the name… [more](https://github.com/jonschlinkert/loader-cache)
* [map-cache](https://github.com/jonschlinkert/map-cache): Basic cache object for storing key-value pairs.
* [option-cache](https://github.com/jonschlinkert/option-cache): Simple API for managing options in JavaScript applications.
* [plasma-cache](https://github.com/jonschlinkert/plasma-cache): Object cache for [Plasma].
* [parser-cache](https://github.com/jonschlinkert/parser-cache): Cache and load parsers, similiar to consolidate.js engines.
* [set-value](https://github.com/jonschlinkert/set-value): Create nested values and any intermediaries using dot notation (`'a.b.c'`) paths.

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/jonschlinkert/config-cache/issues/new)

## Running tests

Install dev dependencies:

```sh
$ npm i -d && npm test
```

## Author

**Jon Schlinkert**

+ [github/jonschlinkert](https://github.com/jonschlinkert)
+ [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

## License

Copyright © 2015 Jon Schlinkert
Released under the MIT license.

***

_This file was generated by [verb-cli](https://github.com/assemble/verb-cli) on June 13, 2015._
