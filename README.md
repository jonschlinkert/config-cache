# config-cache [![NPM version](https://badge.fury.io/js/config-cache.svg)](http://badge.fury.io/js/config-cache)

> General purpose JavaScript object storage methods.

## Install with [npm](npmjs.org)

```bash
npm i config-cache --save
```

## Usage

```js
var Config = require('config-cache');
var config = new Config();
```

## API
### [Cache](index.js#L40)

Initialize a new `Cache`

* `obj` **{Object}**: Optionally pass an object to initialize with.    

```js
var cache = new Cache();
```

### [.set](index.js#L96)

Assign `value` to `key` or return the value of `key`.

* `key` **{String}**    
* `value` **{*}**    
* `expand` **{Boolean}**: Resolve template strings with [expander]    
* `returns` **{Object}** `Cache`: to enable chaining  

```js
cache.set(key, value);
```

If `expand` is defined as true, the value will be set using [expander].

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

Visit the [expander] docs for more info.

[expander]: https://github.com/tkellen/expander
[getobject]: https://github.com/cowboy/node-getobject

### [.get](index.js#L137)

Return the stored value of `key`. If the value does **not** exist on the cache, you may pass `true` as a second parameter to tell [set-object] to initialize the value as an empty object.

* `key` **{*}**    
* `create` **{Boolean}**    
* `returns`: {*}  

```js
cache.set('foo', 'bar');
cache.get('foo');
// => "bar"

// also takes an array or list of property paths
cache.set({data: {name: 'Jon'}})
cache.get('data', 'name');
//=> 'Jon'
```

### [.constant](index.js#L184)

Set a constant on the cache.

* `key` **{String}**    
* `value` **{*}**    

**Example**

```js
cache.constant('site.title', 'Foo');
```

### [.exists](index.js#L219)

Return `true` if the element exists. Dot notation may be used for nested properties.

* `key` **{String}**    
* `returns`: {Boolean}  

**Example**

```js
cache.exists('author.name');
//=> true
```

### [.union](index.js#L249)

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

### [.extend](index.js#L290)

Extend the `cache` with the given object. This method is chainable.

* `returns` **{Object}** `Cache`: to enable chaining  

**Example**

```js
cache
  .extend({foo: 'bar'}, {baz: 'quux'});
  .extend({fez: 'bang'});
```

Or define the property to extend:

```js
cache
  // extend `cache.a`
  .extend('a', {foo: 'bar'}, {baz: 'quux'})
  // extend `cache.b`
  .extend('b', {fez: 'bang'})
  // extend `cache.a.b.c`
  .extend('a.b.c', {fez: 'bang'});
```

### [.keys](index.js#L317)

Return the keys on `this.cache`.

* `returns`: {Boolean}  

```js
cache.keys();
```

### [.hasOwn](index.js#L335)

Return true if `key` is an own, enumerable property of `this.cache` or the given `obj`.

* `key` **{String}**    
* `obj` **{Object}**: Optionally pass an object to check.    
* `returns`: {Boolean}  

```js
cache.hasOwn([key]);
```

### [.clone](index.js#L351)

Clone the given `obj` or `cache`.

* `obj` **{Object}**: Optionally pass an object to clone.    
* `returns`: {Boolean}  

```js
cache.clone();
```

### [.methods](index.js#L368)

Return methods on `this.cache` or the given `obj`.

* `obj` **{Object}**    
* `returns`: {Array}  

```js
cache.methods('foo')
//=> ['set', 'get', 'enable', ...]
```

### [Data methods](index.js#L382)


> Methods for reading data files, processing template strings and
extending the `cache.data` object.

### [.process](index.js#L400)

Use [expander] to recursively expand template strings into their resolved values.

* `lookup` **{*}**: Any value to process, usually strings with a cache template, like `<%= foo %>` or `${foo}`.    
* `opts` **{*}**: Options to pass to Lo-Dash `_.template`.    

**Example**

```js
cache.process({a: '<%= b %>', b: 'c'});
//=> {a: 'c', b: 'c'}
```

### [.extendData](index.js#L466)

Extend the `cache.data` object with the given data. This method is chainable.

* `returns` **{Object}** `Cache`: to enable chaining  

**Example**

```js
cache
  .extendData({foo: 'bar'}, {baz: 'quux'});
  .extendData({fez: 'bang'});
```

### [.plasma](index.js#L499)

Extend the `data` object with the value returned by [plasma].

* `data` **{Object|String|Array}**: File path(s), glob pattern, or object of data.    
* `options` **{Object}**: Options to pass to plasma.    

**Example:**

```js
cache
  .plasma({foo: 'bar'}, {baz: 'quux'});
  .plasma({fez: 'bang'});
```

See the [plasma] documentation for all available options.

### [.data](index.js#L532)

Extend the `cache.data` object with data from a JSON or YAML file, or by passing an object directly - glob patterns or file paths may be used.

* `values` **{Object|Array|String}**: Values to pass to plasma.    
* `process` **{Boolean}**: If `true`,    
* `returns` **{Object}** `Cache`: to enable chaining  

```js
cache
  .data({a: 'b'})
  .data({c: 'd'});

console.log(config.cache);
//=> {data: {a: 'b', c: 'd'}}
```

When `true` is passed as the last argumemnt data will
be processed by [expander] before extending `cache.data`.

```js
cache.data({a: '<%= b %>', b: 'z'})
//=> {data: {a: 'z', b: 'z'}}
```

## [Clearing the cache](index.js#L570)


> Methods for clearing the cache, removing or reseting specific
values on the cache.

### [.omit](index.js#L589)

Omit properties from the `cache`.

* `returns` **{Object}** `Cache`: to enable chaining  

**Example:**

```js
cache
  .omit('foo');
  .omit('foo', 'bar');
  .omit(['foo']);
  .omit(['foo', 'bar']);
```

### [.clear](index.js#L631)

Remove `key` from the cache, or if no value is specified the entire cache is reset.

**Example:**

```js
cache.clear();
```


## Author
 
**Jon Schlinkert**
 
+ [github/jonschlinkert](https://github.com/jonschlinkert)
+ [twitter/jonschlinkert](http://twitter.com/jonschlinkert) 
 
**Brian Woodward**
 
+ [github/doowb](https://github.com/doowb)
+ [twitter/doowb](http://twitter.com/doowb) 


## License
Copyright (c) 2014 Jon Schlinkert  
Released under the MIT license

***

_This file was generated by [verb](https://github.com/assemble/verb) on December 12, 2014. To update, run `npm i -g verb && verb`._

[plasma]: https://github.com/jonschlinkert/plasma