var get = require('getobject');
var _ = require('lodash');

var this.cache = {};
var bar = {};

bar.extend = function(obj) {
  var args = [].slice.call(arguments);
  if (typeof args[0] === 'string') {
    var name = args[0];
    this.cache[name] = {};
    _.extend.apply(_, [this.cache[name]].concat(_.rest(args)));
    return this;
  }
  _.extend.apply(_, [this.cache].concat(args));
  return this;
};


bar.extend({a: 'b'});
bar.extend({c: 'd'});
bar.extend('data', {f: 'g'}, {h: 'i'});


console.log(this.cache)