# config-cache [![NPM version](https://badge.fury.io/js/config-cache.png)](http://badge.fury.io/js/config-cache)

> General purpose JavaScript cache methods.

## Install
#### Install with [npm](npmjs.org):

```bash
npm i config-cache --save-dev
```

## Usage

```js
var Config = require('config-cache');
var config = new Config();
```

## API
[## Cache](index.js#L33)

Initialize a new `Cache`

* `obj` **{Object}**: Optionally pass an object to initialize with.  

```js
var cache = new Cache();
```


 [## option](index.js#L58)

Set or get an option.

* `key` **{String}**: The option name.  
* `value` **{*}**: The value to set.  
* returns **{*|Object}**: Returns `value` if `key` is supplied, or `Cache` for chaining when an option is set.  

```js
cache.option('a', true)
cache.option('a')
// => true
```


 [## set](index.js#L121)

Assign `value` to `key` or return the value of `key`.

* `key` **{String}**  
* `value` **{*}**  
* `expand` **{Boolean}**: Resolve template strings with [expander]  
* returns **{Cache}**: for chaining  

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


 [## get](index.js#L158)

Return the stored value of `key`. If the value does **not** exist on the cache, you may pass `true` as a second parameter to tell [getobject] to initialize the value as an empty object.

* `key` **{*}**  
* `create` **{Boolean}**  
* returns: {*}  

```js
cache.set('foo', 'bar');
cache.get('foo');
// => "bar"
```


 [## constant](index.js#L181)

Set a constant on the cache.

* `key` **{String}**  
* `value` **{*}**  

**Example**

```js
cache.constant('site.title', 'Foo');
```


 [## enabled](index.js#L218)

Check if `key` is enabled (truthy).

* `key` **{String}**  
* returns: {Boolean}  

```js
cache.enabled('foo')
// => false

cache.enable('foo')
cache.enabled('foo')
// => true
```


 [## disabled](index.js#L240)

Check if `key` is disabled.

* `key` **{String}**  
* returns: {Boolean}  

```js
cache.disabled('foo')
// => true

cache.enable('foo')
cache.disabled('foo')
// => false
```


 [## enable](index.js#L259)

Enable `key`.

* `key` **{String}**  
* returns **{Cache}**: for chaining  

**Example**

```js
cache.enable('foo');
```


 [## disable](index.js#L279)

Disable `key`.

* `key` **{String}**  
* returns **{Cache}**: for chaining  

**Example**

```js
cache.disable('foo');
```


 [## exists](index.js#L301)

Return `true` if the element exists. Dot notation may be used for nested properties.

* `key` **{String}**  
* returns: {Boolean}  

**Example**

```js
cache.exists('author.name');
//=> true
```


 [## union](index.js#L326)

Add values to an array on the `cache`. This method is chainable.

* returns **{Cache}**: for chaining  

**Example**

```js
// config.cache['foo'] => ['a.hbs', 'b.hbs']
cache
  .union('foo', ['b.hbs', 'c.hbs'], ['d.hbs']);
  .union('foo', ['e.hbs', 'f.hbs']);

// config.cache['foo'] => ['a.hbs', 'b.hbs', 'c.hbs', 'd.hbs', 'e.hbs', 'f.hbs']
```


 [## defaults](index.js#L368)

Extend the `cache` with the given object. This method is chainable.

* returns **{Cache}**: for chaining  

**Example**

```js
cache
  .defaults({foo: 'bar'}, {baz: 'quux'});
  .defaults({fez: 'bang'});
```

Or define the property to defaults:

```js
cache
  // defaults `cache.a`
  .defaults('a', {foo: 'bar'}, {baz: 'quux'})
  // defaults `cache.b`
  .defaults('b', {fez: 'bang'})
  // defaults `cache.a.b.c`
  .defaults('a.b.c', {fez: 'bang'});
```


 [## extend](index.js#L415)

Extend the `cache` with the given object. This method is chainable.

* returns **{Cache}**: for chaining  

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


 [## merge](index.js#L449)

Extend the cache with the given object. This method is chainable.

* returns **{Cache}**: for chaining  

**Example**

```js
cache
  .merge({foo: 'bar'}, {baz: 'quux'});
  .merge({fez: 'bang'});
```


 [## keys](index.js#L475)

Return the keys on `this.cache`.

* returns: {Boolean}  

```js
cache.keys();
```


 [## hasOwn](index.js#L494)

Return true if `key` is an own, enumerable property of `this.cache` or the given `obj`.

* `key` **{String}**  
* `obj` **{Object}**: Optionally pass an object to check.  
* returns: {Boolean}  

```js
cache.hasOwn([key]);
```


 [## clone](index.js#L511)

Clone the given `obj` or `cache`.

* `obj` **{Object}**: Optionally pass an object to clone.  
* returns: {Boolean}  

```js
cache.clone();
```


 [## methods](index.js#L529)

Return methods on `this.cache` or the given `obj`.

* `obj` **{Object}**  
* returns: {Array}  

```js
cache.methods('foo')
//=> ['set', 'get', 'enable', ...]
```


 [## each](index.js#L548)

Call `fn` on each property in `this.cache`.

* `fn` **{Function}**  
* `obj` **{Object}**: Optionally pass an object to iterate over.  
* returns **{Object}**: Resulting object.  

```js
cache.each(fn, obj);
```


 [## visit](index.js#L573)

Traverse each _own property_ of `this.cache` or the given object, recursively calling `fn` on child objects.

* `obj` **{Object|Function}**: Optionally pass an object.  
* `fn` **{Function}**  
* returns **{Object}**: Return the resulting object.  

```js
cache.visit(obj, fn);
```


 [## process](index.js#L616)

> Methods for reading data files, processing template strings and extending the `cache.data` object.

* `lookup` **{*}**: Any value to process, usually strings with a cache template, like `<%= foo %>` or `${foo}`.  
* `opts` **{*}**: Options to pass to Lo-Dash `_.template`.  

Use [expander] to recursively expand template strings into
their resolved values.

**Example**

```js
cache.process({a: '<%= b %>', b: 'c'});
//=> {a: 'c', b: 'c'}
```


 [## extendData](index.js#L673)

Extend the `cache.data` object with the given data. This method is chainable.

* returns **{Cache}**: for chaining  

**Example**

```js
cache
  .extendData({foo: 'bar'}, {baz: 'quux'});
  .extendData({fez: 'bang'});
```


 [## plasma](index.js#L707)

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


 [## namespace](index.js#L740)

Expects file path(s) or glob pattern(s) to any JSON or YAML files to be merged onto the data object. Any data files read in by the `.namespace()` method will extend the `data` object with an object named after the basename of each file.

* `patterns` **{String|Array}**: Filepaths or glob patterns.  
* returns: {null}  

**Example**

```js
cache.namespace(['alert.json', 'nav*.json']);
```
The data from each file is namespaced using the name of the file:

```js
{
  alert: {},
  navbar: {}
}
```

See the [plasma] documentation for all available options.


 [## data](index.js#L776)

Extend the `cache.data` object with data from a JSON or YAML file, or by passing an object directly - glob patterns or file paths may be used.

* `values` **{Object|Array|String}**: Values to pass to plasma.  
* `process` **{Boolean}**: If `true`,  
* returns **{Cache}**: for chaining  

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


 [## omit](index.js#L830)

> Methods for clearing the cache, removing or reseting specific values on the cache.

* returns **{Cache}**: for chaining  


Omit properties and their from the `cache`.

**Example:**

```js
cache
  .omit('foo');
  .omit('foo', 'bar');
  .omit(['foo']);
  .omit(['foo', 'bar']);
```


 [## clear](index.js#L853)

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
Copyright (c) 2014 Jon Schlinkert, contributors.  
Released under the MIT license

***

_This file was generated by [verb-cli](https://github.com/assemble/verb-cli) on August 16, 2014._

[plasma]: https://github.com/jonschlinkert/plasma