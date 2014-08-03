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