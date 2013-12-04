'use strict';
var path = require('path');
var assert = require('assert');
var grunt = require('grunt');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');

grunt.task.init([]);
grunt.config.init({});

var opts = grunt.cli.options;
opts.redirect = !opts.silent;

var directory = function directory(dir) {
  return function directory(done) {
    process.chdir(__dirname);
    rimraf(dir, function (err) {
      if (err) {
        return done(err);
      }
      mkdirp(dir, function (err) {
        if (err) {
          return done(err);
        }
        process.chdir(dir);
        done();
      });
    });
  };
};

describe('django', function(){
    describe('relative path', function(){
        beforeEach(directory('tmp'));

        it('should equal 4', function(){
            grunt.file.mkdir('build')
            grunt.file.copy(
                path.join(__dirname, 'fixtures/relative_links.html'),
                'build/index.html'
            );

            grunt.config.init();
            grunt.task.run('django');

            var changed = grunt.file.read('build/index.html');
            assert.ok(changed.match(/<img src="\.\.\/images\/test\.png"\>/));
        });
    });
});
