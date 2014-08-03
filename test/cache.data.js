/*!
 * config-cache <https://github.com/jonschlinkert/config-cache>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var should = require('should');
var Config = require('..');
var config = new Config();

describe('config data', function() {
  beforeEach(function() {
    config.clear();
  });

  describe('.extendData()', function() {
    it('should extend the `data` object.', function() {
      config.extendData({x: 'x', y: 'y', z: 'z'});
      config.get('data').should.have.property('x');
      config.get('data').should.have.property('y');
      config.get('data').should.have.property('z');
      console.log(config);

    });
  });

  // describe('.data()', function() {
  //   it('should set properties on the `data` object.', function() {
  //     config.set('data.foo', 'bar');
  //     config.get('data').foo.should.equal('bar');
  //     config.get('data.foo').should.equal('bar');
  //   });

  //   it('should read files and merge data onto `cache.data`', function() {
  //     config.data('package.json');
  //     config.get('data.name').should.equal('config-cache');
  //   });

  //   // it('should read files and merge data onto `cache.data`', function() {
  //   //   config.data({xyz: 'abc'});
  //   //   config.get('data.xyz').should.equal('abc');
  //   // });

  //   // it('should read files and merge data onto `cache.data`', function() {
  //   //   config.data([{aaa: 'bbb', ccc: 'ddd'}]);
  //   //   config.get('data.aaa').should.equal('bbb');
  //   //   config.get('data.ccc').should.equal('ddd');
  //   // });
  // });

  // describe('.root()', function() {
  //   it('should merge the value of a nested `data` property onto the root of the given object.', function() {
  //     var root = config.root({data: {x: 'x'}, y: 'y', z: 'z'});
  //     root.should.have.property('x');
  //     root.should.have.property('y');
  //     root.should.have.property('z');
  //     root.should.not.have.property('data');
  //   });
  // });

  // describe('.plasma()', function() {
  //   it('should read JSON files and return an object.', function() {
  //     var pkg = config.plasma('package.json');
  //     pkg.name.should.equal('config');
  //   });

  //   it('should expand a glob pattern, read JSON/YAML files and return an object.', function() {
  //     var pkg = config.plasma('p*.json');
  //     pkg.name.should.equal('config');
  //   });

  //   it('should accept and object and return an object.', function() {
  //     var foo = config.plasma({a: 'b'});
  //     foo.a.should.equal('b');
  //   });
  // });
});
