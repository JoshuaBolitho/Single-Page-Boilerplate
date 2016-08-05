var gulp = require('gulp');                            // Task manager used to perform all the below tasks.
var del = require('del');                              // Simple module for deleting files and folders on the hard drive.
var path = require('path');                            // Module provides utilities for working with files and directory paths.
var gutil = require('gulp-util');                      // Utility functions for gulp plugins, such as logging.
var source = require('vinyl-source-stream');           // Converts a stream to a virtual file.
var buffer = require('gulp-buffer');                   // Converts stream to buffer
var gulpif = require('gulp-if');                       // Adds the ability to apply conditional logic within gulp
var uglify = require('gulp-uglify');                   // Shrinks js filesize
var browserify = require('browserify');                // Converts Common.js require modules to vanilla javascript, includes dependency management and bundling.
var babelify = require('babelify');                    // Converts ES6 javascript schema to a browser friendly translation.
var browserSync = require('browser-sync');             // Serves site files and performs reloads on file updates
var sass = require('gulp-sass');                       // CSS preprocessor for converting SASS to CSS. Pure node.js, no ruby
var sourcemaps = require('gulp-sourcemaps');           // Builds a js sourcemap for debugging build files
var autoprefixer = require('gulp-autoprefixer');       // Magic task that adds all the CSS browser prefixes automatically
var processHTML = require('gulp-processhtml');         // Handles build time conditions in index.html.
var history = require('connect-history-api-fallback'); // Connect middleware for making all URL requests served by browsersync go to index.html, since it's a single page app. No idea why it's called history
var hoganify = require('hoganify');                    // Compiles hogan modules from mustache templates and then embeds the result to app.min.js, so templates can be called by the browserify require modules.

// PATH CONSTANTS
var BUILD_PATH = './build';
var BUILD_SCRIPTS_PATH = BUILD_PATH + '/js';
var SOURCE_PATH = 'src';
var JSON_SOURCE_PATH = SOURCE_PATH + '/json';
var ASSET_SOURCE_PATH = SOURCE_PATH + '/assets';
var INPUT_JAVASCRIPT_FILE = SOURCE_PATH + '/js/app.js';
var OUTPUT_JAVASCRIPT_FILE_NAME = 'app.min.js';



/*************************************************************
**
**  Deletes the entire contents of the build directory
**
**************************************************************/

function cleanBuild () {
     del([BUILD_PATH + '/**/*.*']);
}


/*************************************************************
**
**  Copies 'src/assets' folder into the '/build' folder.
**
**************************************************************/

function copyAssets () {
    return gulp.src(ASSET_SOURCE_PATH + '/**/*')
        .pipe(gulp.dest(BUILD_PATH + '/assets'));
}


/*************************************************************
**
**  Copies 'json/main.json' to the '/build' folder.
**
**************************************************************/

function copyJSON () {
    return gulp.src(JSON_SOURCE_PATH + '/main.json')
        .pipe(gulp.dest(BUILD_PATH + '/json'));
}


/*************************************************************
**
**  Javascript is originally written in ES2015 script because
**  of how clean and easy to manage it is. Since there are
**  plenty of browsers that can't read it properly, it's just
**  easier to translate it to browser friendly javascript.
**
**************************************************************/

function processJavascriptDev () {

    // class handles a bunch of js related tasks, such as file translation and concatination.
    var browserified = browserify({
        paths: [ path.join(__dirname, SOURCE_PATH + '/js'), path.join(__dirname, SOURCE_PATH + '/view') ],
        entries: [INPUT_JAVASCRIPT_FILE],
        debug: true
    });
      
    // converts ES6 to vanilla javascript. Note that presets are an NPM dependency
    browserified.transform(babelify, { "presets": ["es2015"]} );
    browserified.transform(hoganify, { live:false, ext:'.html,.mustache' } );

    // bundles all the "require" dependencies together into one container
    var bundle = browserified.bundle();
    bundle.on('error', function(error){
        gutil.log(gutil.colors.red('[Build Error]', error.message));
        this.emit('end');
    });

    // now that files are bundled and transformed intto vanilla js, the final tasks can be performed.
    return bundle
        .pipe( source(OUTPUT_JAVASCRIPT_FILE_NAME) )    // convert vinyl virtual file
        .pipe( buffer() )                               // convert back to buffer
        .pipe( sourcemaps.init({ loadMaps: true }) )    // creates sourcemap of javascript
        .pipe( sourcemaps.write('./') )                 // in relation to "BUILD_SCRIPTS_PATH"
        .pipe( gulp.dest(BUILD_SCRIPTS_PATH) )          // outputs stream/buffer as build file
}


function processJavascriptProduction () {

    //var sourcemapPath = path.join(__dirname, BUILD_SCRIPTS_PATH + '/' + OUTPUT_JAVASCRIPT_FILE_NAME + '.map');

    // class handles a bunch of js related tasks, such as file translation and concatination.
    var browserified = browserify({
        paths: [ path.join(__dirname, SOURCE_PATH + '/js'), path.join(__dirname, SOURCE_PATH + '/view') ],
        entries: [INPUT_JAVASCRIPT_FILE],
        debug: false // true
    });
      
    // converts ES6 to vanilla javascript. Note that preset is an NPM dependency
    browserified.transform(babelify, { "presets": ["es2015"]} );
    browserified.transform(hoganify, { live:false, ext:'.html,.mustache' } );

    // bundles all the "require" dependencies together into one container
    var bundle = browserified.bundle();
    bundle.on('error', function(error){
        gutil.log(gutil.colors.red('[Build Error]', error.message));
        this.emit('end');
    });

    // now that stream is machine readable javascript, finish the rest of the gulp build tasks
    return bundle
        //.pipe( exorcist(sourcemapPath) )
        .pipe( source(OUTPUT_JAVASCRIPT_FILE_NAME) )
        .pipe( buffer() )
        .pipe( uglify() )
        .pipe( gulp.dest(BUILD_SCRIPTS_PATH) )
}


/*************************************************************
**
**  Converts SASS to CSS
**
**************************************************************/

function processSASS () {

    var autoprefixerOptions = {
        browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
    };

    return gulp.src(SOURCE_PATH + '/styles/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(gulp.dest(BUILD_PATH + '/css'))
}


/*************************************************************
**
**  Handles conditional comments in index.html
**
**************************************************************/

function processIndexHTML () {

    return gulp.src(SOURCE_PATH + '/index.html')
        .pipe( processHTML({}) )
        .pipe( gulp.dest(BUILD_PATH) )
}


/*************************************************************
**
**  Starts the Browsersync server and watches for file 
**  updates, which will prompt specific build tasks to the 
**  type of file updated.
**
**************************************************************/

function serve () {
    
    var options = {
        server: {
            baseDir: BUILD_PATH,
            middleware: [history()],    // Route all requests always go to index.html   
        },
        open: false                     // Change it to true if you wish to allow Browsersync to open a browser window.
    };
    
    browserSync(options);
    
    // Watches for changes in files inside the './src' folder.
    gulp.watch(SOURCE_PATH + '/js/**/*.js', ['watch-js']);

    // Watches for updates to sass css preprocessor files.
    gulp.watch(SOURCE_PATH + '/styles/**/*.scss', ['watch-sass']);

    // Watches for updates in index.html
    gulp.watch(SOURCE_PATH + '/index.html', ['watch-html']);

    // Watches view files and recompile on update
    gulp.watch(SOURCE_PATH + '/view/**', ['watch-views']);

    // Watches for updates in json/main.json
    gulp.watch(SOURCE_PATH + '/json/main.json', ['watch-json']);
    
    // Watches for changes in files inside the './static' folder. Also sets 'keepFiles' to true (see cleanBuild()).
    gulp.watch(ASSET_SOURCE_PATH + '/**/*', ['watch-assets']);
}


/*************************************************************
**
**  sub-tasks
**
**************************************************************/

gulp.task('clean-build', cleanBuild);
gulp.task('process-sass', processSASS);
gulp.task('process-html', processIndexHTML);
gulp.task('process-js', processJavascriptDev);
gulp.task('copy-json', copyJSON);
gulp.task('copy-assets', copyAssets);

gulp.task('watch-js', ['process-js'], browserSync.reload);
gulp.task('watch-sass', ['process-sass'], browserSync.reload);
gulp.task('watch-html', ['process-html'], browserSync.reload);
gulp.task('watch-views', ['process-js'], browserSync.reload);
gulp.task('watch-json', ['copy-json'], browserSync.reload);
gulp.task('watch-assets', ['copy-assets'], browserSync.reload);


/*************************************************************
**
**  tasks
**
**************************************************************/

// "final-build" uglifies and removes source maps and should be what goes to production.
gulp.task('build-production', ['clean-build', 'copy-assets', 'copy-json', 'process-sass', 'process-html'], processJavascriptProduction);

// "build" is used for development and debugging.
gulp.task('build-dev', ['clean-build', 'copy-assets', 'copy-json', 'process-sass', 'process-html', 'process-js']);

// serves the site at localhost:3000, using browser-sync. Also watches for file changes and reloads accordingly.
gulp.task('serve', ['build-dev'], serve);

