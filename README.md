grunt-module-index
==================

Grunt task to auto-build module index files (exports) based on folders and files.

## Getting Started
This plugin requires [Grunt](https://gruntjs.com) `~0.4.0`.

Install this grunt plugin with:
```shell
npm install grunt-module-index --save-dev
```

Then add this line to your project's `grunt.js` Gruntfile:

```javascript
grunt.loadNpmTasks('grunt-module-index');
```

## Tests
To do.

## Options
#### format
Type: `String`
Values: `coffee`, `js`
Default: `js`

File format and extension.

#### notice
Type: `String`

Optional file header message.

#### omitDirs
Type: `Array|String`
Default: `[]`

Omit these directory names for the object hierarchy.

_Example:_ `omitDirs: ['src']`

#### pathPrefix
Type: `String`

Optional prefix for every file path.

_Example:_ `pathPrefix: './'` and a file in `src/` ends as `require('./src/...`

#### pathSep
Type: `String|false`
Default: `'/'`

Force a file separator for paths. A value of `false` will use the system separator.

_Example:_ `pathSep: '\'` and a file at `src/file.js` ends as `require('src\file.js')`

#### requireWithExtension
Type: `Boolean`
Default: `false`

Include extensions on `require` calls.

## Examples
#### Basic (javascript)
```javascript
moduleIndex: {
  build: {
    src: ["modules", "components", "mixins"]
  }
}
```

#### Full (coffee)
```coffee
moduleIndex:
  build:
    src: ["modules", "components", "mixins"]
    dest: "index.js"
    options:
      format: "js"
      notice: "Generated with grunt"
      omitDirs: ['src']
      pathPrefix: './'
      pathSep: '/'
      requireWithExtension: true
```

## Output (index.js)
```javascript
//! This file was auto-generated by grunt-module-index, DO NOT edit it directly
module.exports = exports = {
  components: {
    nav: {
      nav: require("components/nav/nav"),
      navItem: require("components/nav/navItem")
    },
    form: {
      button: require("components/form/button"),
      input: require("components/form/input")
    }
  }
};
//EOF
```

## License
Copyright (c) 2014 Ignacio Lago
Licensed under the MIT license.