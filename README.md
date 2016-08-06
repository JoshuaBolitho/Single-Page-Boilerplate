## Single Page Web Application Boilerplate (Front-End)

Front-end boilerplate with a bunch of helpful build tasks for getting up and running in the least amount of steps. 

#### Key features :

  - ES6 module support using [babel] and [browserify].
  - [SASS] for CSS preprocessing and [autoprefixer] for handling browser vendor prefixes.
  - [Browsersync] for serving the site locally, with auto reload set on file changes.

#### Installation :

Need to have node.js, NPM, and Gulp installed before moving ahead.

```sh
$ https://github.com/JoshuaBolitho/Single-Page-Boilerplate.git
$ cd Single-Page-Boilerplate
$ npm install
```

#### Instructions :

To begin serving the site from localhost:3000

```sh
gulp serve
```

Or if you prefer to build manually:

```sh
gulp build-dev or gulp build-production
```

#### License :
MIT

[browserify]: <http://browserify.org>
[babel]: <https://babeljs.io/>
[SASS]: <http://sass-lang.com/>
[autoprefixer]: <https://github.com/postcss/autoprefixer>
[Browsersync]: <https://www.browsersync.io>
   
  