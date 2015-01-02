/*
 * grunt-module-index
 *
 * Copyright (c) 2014 Ignacio Lago
 * Licensed under the MIT license.
 */

'use strict';

var walk = require("walk");
var path = require("path");
var fs = require("fs");

// Repeats a string
function nTimes(str, n) {
  var ret = '';
  if (n > 0) {
    for (var _i = 1; _i <= n; ++_i) {
      ret += str;
    }
  }
  return ret;
}

// Prints our path-objects, coffee style
function printObjCoffee(obj, deep) {
  var ret = "";
  var key;
  if (deep == null) {
    deep = 1;
  }
  for (key in obj) {
    if (!{}.hasOwnProperty.call(obj, key)) {
      continue;
    }
    if ('object' === typeof obj[key]) {
      ret += nTimes('  ', deep) + key + ':' + "\n";
      ret += printObjCoffee(obj[key], deep + 1);
    } else {
      ret += nTimes('  ', deep) + key + ': require "' + obj[key] + '"\n';
    }
  }
  return ret;
}

// Prints our path-objects, javascript style
function printObjJs(obj, deep) {
  var ret = [];
  var key;
  if (deep == null) {
    deep = 1;
  }
  for (key in obj) {
    if (!{}.hasOwnProperty.call(obj, key)) {
      continue;
    }
    if ('object' === typeof obj[key]) {
      var str = nTimes('  ', deep) + '"' + key + '": {' + "\n";
      str += printObjJs(obj[key], deep + 1);
      str += '\n' + nTimes('  ', deep) + '}';
      ret.push(str);
    } else {
      ret.push(nTimes('  ', deep) + '"' + key + '": require("' +
        obj[key] + '")');
    }
  }
  return ret.join(',\n');
}

module.exports = function(grunt) {

  function moduleIndex(dirs, dest, options) {
    var dir, exportable = {}, ret = '', _dest_dir;
    var fmt = options.format || 'js';
    // create dest folder
    grunt.file.mkdir(path.dirname(dest));
    // normalize dest
    if (dest) {
      // it's just a dir
      if (dest[dest.length -1] === '/') {
        dest += 'index.' + fmt;
      }
      dest = path.normalize(dest);
    }
    else {
      dest = 'index.' + fmt;
    }
    _dest_dir = path.dirname(dest);

    // options for walker
    var walkerOptions = {
      listeners: {
        // sorted output
        names: function(root, nodeNamesArray) {
          return nodeNamesArray.sort(function(a, b) {
            if (a > b) {
              return 1;
            }
            if (a < b) {
              return -1;
            }
            return 0;
          });
        },
        // ignore directories
        directories: function(root, dirStatsArray, next) {
          return next();
        },
        // main logic
        file: function(root, fileStats, next) {
          var deep, levels, filename, last, _path, total;
          // ignore hidden
          if (fileStats.name[0] !== '.') {
            filename = path.basename(
              fileStats.name,
              path.extname(fileStats.name)
            );

            if (options.requireWithExtension) {
              _path = root + '/' + fileStats.name;
            }
            else {
              _path = root + '/' + filename;
            }

            _path = path.relative(_dest_dir, _path);

            // directories array
            levels = root.split('/');
            last = exportable;
            total = levels.length;
            for (var _i = 0, _len = levels.length; _i < _len; ++_i) {
              deep = levels[_i];
              // ignore relative (useful?)
              if (deep !== '.' && deep !== '..') {
                if (!last[deep]) {
                  last[deep] = {};
                }
                // filename
                if ((_i + 1) === total) {
                  last[deep][filename] = _path;
                } else {
                  last = last[deep];
                }
              }
            }
          }
          return next();
        },
        errors: function(root, nodeStatsArray, next) {
          return next();
        }
      }
    };

    // walk!
    dirs.forEach(function(filepath){
      if (!grunt.file.exists(filepath)) {
        console.error('File ' + filepath + ' missing!');
        return false;
      }
      var walker = walk.walkSync(filepath, walkerOptions);
    });

    // create the content
    var notice = 'This file was auto-generated by grunt-module-index,' +
                 'DO NOT edit it directly';

    if (fmt === 'coffee') {
      ret  = '#! ' + notice + '\n';
      if (options.notice) {
        ret  += '#! ' + options.notice + '\n';
      }
      ret += 'module.exports = exports =\n';
      ret += printObjCoffee(exportable);
      ret += '\n#EOF\n';
    }
    else {
      ret  = '//! ' + notice + '\n';
      if (options.notice) {
        ret += '//! ' + options.notice + '\n';
      }
      ret += 'module.exports = exports = {\n';
      ret += printObjJs(exportable);
      ret += '\n};\n//EOF\n';
    }

    // write the content
    try {
      fs.writeFileSync(dest, ret);
    } catch (e) {
      grunt.log.error();
      grunt.fail.warn('Unable to create "' + dest +
       '" file (' + e.message + ').', e);
    }
    return dest;
  }

  grunt.registerMultiTask(
    'moduleIndex',
    'Auto-build module index file.',
    function() {
      // merge default options
      var options = this.options({
        format: grunt.option('format'),
        requireWithExtension: grunt.option('requireWithExtension') === true
      });

      this.files.forEach(function(filePair) {
        var dest = moduleIndex(filePair.src, filePair.dest, options);
        grunt.log.ok('Module index "' + dest + '" created');
      });
    }
  );
};
