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
Initialize a new `Cache`

```js
var config = new Cache();
```

* `obj` {Object}: Optionally pass an object to initialize `this.cache`.   


### .keys

Return the keys on `this.cache`.

```js
config.keys();
```
 
* `return` {Boolean} 


### .hasOwn

Return true if `key` is an own, enumerable property
of `this.cache` or the given `obj`.

```js
config.hasOwn([key]);
```

* `key` {String} 
* `obj` {Object}: Optionally pass an object to check.  
* `return` {Boolean} 


### .clone

Clone the given `obj` or `cache`.

```js
config.clone();
```

* `obj` {Object}: Optionally pass an object to clone.  
* `return` {Boolean} 


### .each

Call `fn` on each property in `this.cache`.

```js
config.each(fn, obj);
```

* `fn` {Function} 
* `obj` {Object}: Optionally pass an object to iterate over.  
* `return` {Object} Resulting object. 


### .visit

Traverse each _own property_ of `this.cache` or the given object,
recursively calling `fn` on child objects.

```js
config.visit(obj, fn);
```

* `obj` {Object|Function}: Optionally pass an object. 
* `fn` {Function}  
* `return` {Object} Return the resulting object. 


### .set

Assign `value` to `key` or return the value of `key`.

```js
config.set(key, value);
```

If `expand` is defined as true, the value will be set using [expander].

**Examples:**

```js
// as a key-value pair
config.set('a', {b: 'c'});

// or as an object
config.set({a: {b: 'c'}});

// chaining is possible
config
  .set({a: {b: 'c'}})
  .set('d', 'e');
```

Expand template strings with expander:

```js
config.set('a', {b: '${c}', c: 'd'}, true);
```

Visit the [expander] docs for more info.


[expander]: https://github.com/tkellen/expander
[getobject]: https://github.com/cowboy/node-getobject

* `key` {String} 
* `value` {*} 
* `expand` {Boolean}: Resolve template strings with [expander]  
* `return` {Cache} for chaining 


### .get

Return the stored value of `key`. If the value
does **not** exist on the cache, you may pass
`true` as a second parameter to tell [getobject]
to initialize the value as an empty object.

```js
config.set('foo', 'bar');
config.get('foo');
// => "bar"
```

* `key` {*} 
* `create` {Boolean}  
* `return` {*} 


### .constant

Set a constant on the cache.

**Example**

```js
config.constant('site.title', 'Foo');
```

* `key` {String} 
* `value` {*}   


### .methods (key)

Return methods on `this.cache` or the given `obj`.

```js
config.methods('foo')
//=> ['set', 'get', 'enable', ...]
```

* `obj` {Object}  
* `return` {Array} 


### .enabled (key)

Check if `key` is enabled (truthy).

```js
config.enabled('foo')
// => false

config.enable('foo')
config.enabled('foo')
// => true
```

* `key` {String}  
* `return` {Boolean} 


### .disabled (key)

Check if `key` is disabled.

```js
config.disabled('foo')
// => true

config.enable('foo')
config.disabled('foo')
// => false
```

* `key` {String}  
* `return` {Boolean} 


### .enable (key)

Enable `key`.

**Example**

```js
config.enable('foo');
```

* `key` {String}  
* `return` {Cache} for chaining 


### .disable (key)

Disable `key`.

**Example**

```js
config.disable('foo');
```

* `key` {String}  
* `return` {Cache} for chaining 


### .union

Add values to an array on the `cache`. This method
is chainable.

**Example**

```js
// config.cache['foo'] => ['a.hbs', 'b.hbs']
config
  .union('foo', ['b.hbs', 'c.hbs'], ['d.hbs']);
  .union('foo', ['e.hbs', 'f.hbs']);

// config.cache['foo'] => ['a.hbs', 'b.hbs', 'c.hbs', 'd.hbs', 'e.hbs', 'f.hbs']
```
 
* `return` {Cache} for chaining 


### .extend

Extend the `cache` with the given object.
This method is chainable.

**Example**

```js
config
  .extend({foo: 'bar'}, {baz: 'quux'});
  .extend({fez: 'bang'});
```
 
* `return` {Cache} for chaining 


### .merge

Extend the cache with the given object.
This method is chainable.

**Example**

```js
config
  .merge({foo: 'bar'}, {baz: 'quux'});
  .merge({fez: 'bang'});
```
 
* `return` {Cache} for chaining 


## Data

> Methods for reading data files, processing template strings and
extending the `cache.data` object.

### .process

Use [expander] to recursively expand template strings into
their resolved values.

**Example**

```js
config.process({a: '<%= b %>', b: 'c'});
//=> {a: 'c', b: 'c'}
```

* `lookup` {*}: Any value to process, usually strings with a cache template, like `<%= foo %>` or `${foo}`. 
* `opts` {*}: Options to pass to Lo-Dash `_.template`.   


### .extendData

Extend the `cache.data` object with the given data. This
method is chainable.

**Example**

```js
config
  .extendData({foo: 'bar'}, {baz: 'quux'});
  .extendData({fez: 'bang'});
```
 
* `return` {Cache} for chaining 


### .plasma

Extend the `data` object with the value returned by [plasma].

**Example:**

```js
config
  .plasma({foo: 'bar'}, {baz: 'quux'});
  .plasma({fez: 'bang'});
```

See the [plasma] documentation for all available options.

* `data` {Object|String|Array}: File path(s), glob pattern, or object of data. 
* `options` {Object}: Options to pass to plasma.   


### .namespace

Expects file path(s) or glob pattern(s) to any JSON or YAML files to
be merged onto the data object. Any data files read in by the
`.namespace()` method will extend the `data` object with an object
named after the basename of each file.

**Example**

```js
config.namespace(['alert.json', 'nav*.json']);
```
The data from each file is namespaced using the name of the file:

```js
{
  alert: {},
  navbar: {}
}
```

See the [plasma] documentation for all available options.

* `patterns` {String|Array}: Filepaths or glob patterns.  
* `return` {null} 


### .data

Extend the `data` object with data from a JSON or YAML file,
or by passing an object directly. Glob patterns may be used for
file paths.

```js
config
  .data({a: 'b'})
  .data({c: 'd'});

console.log(config.cache);
//=> {data: {a: 'b', c: 'd'}}
```

* `data` {Object} 
* `options` {Object}: Options to pass to [plasma].  
* `return` {Cache} for chaining 


## Clearing the cache

> Methods for clearing the cache, removing or reseting specific
values on the cache.


### .omit

Omit properties and their from the `cache`.

**Example:**

```js
config
  .omit('foo');
  .omit('foo', 'bar');
  .omit(['foo']);
  .omit(['foo', 'bar']);
```
 
* `return` {Cache} for chaining 


### .clear

Remove `key` from the cache, or if no value is
specified the entire config is reset.

**Example:**

```js
config.clear();
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

_This file was generated by [verb-cli](https://github.com/assemble/verb-cli) on August 03, 2014._

[plasma]: https://github.com/jonschlinkert/plasma