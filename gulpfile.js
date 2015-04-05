'use strict';


var paths = (function () {

    var appDir = 'app';
    var jsDir = appDir + '/js';
	var viewsDir = appDir + '/views';
	var scssDir = appDir + '/views/';
    var cssDir = appDir + '/css';
    var assetsDir = appDir + '/assets';
    var buildDir = 'build';
    var reportsDir = 'reports';

    return {
        appDir: appDir,
        jsDir: jsDir,
        scssDir: scssDir,
        cssDir: cssDir,
        buildDir: buildDir,
        assetsDir: assetsDir,
        reportsDir: reportsDir,

        bowerComponentsDir: appDir + '/bower_components',

        dirsToCopyOnBuild: [assetsDir],

        htmlFiles: appDir + '/{*,**/*}.html',
        reportFiles: reportsDir + '/*.html',
        jsFiles: jsDir + '/{*,**/*}.js',
		viewsFiles: viewsDir + '/{*,**/*}.js',
        assetFiles: assetsDir + '/{*,**/*}',
        scssFiles: scssDir + '/{*,**/*}.scss',
        cssFiles: cssDir + '/{*,**/*}.css',
        jasmineFiles: 'test/jasmine/{*,**/*}.js',

        bowerFile: './bower.json',
        appJsFile: jsDir + '/app.js',
        versionFile: appDir + '/version.txt',
        karmaConfFile: __dirname + '/karma.conf.js'
    };
})();

var bowerJson = require(paths.bowerFile);

var _ = require('lodash');
var gulp = require('gulp');
var prompt = require('prompt');
var replace = require('gulp-replace');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var ngAnnotate = require('gulp-ng-annotate');
var bump = require('gulp-bump');
var git = require('gulp-git');
var karma = require('karma').server;
var markdown = require('gulp-markdown');
var rename = require('gulp-rename');
var injector = require('connect-injector');
var fs = require('fs-extra');
var lazypipe = require('lazypipe');
var gulpif = require('gulp-if');
var exec = require('exec');
var Q = require('q');
var flatten = require('gulp-flatten');


gulp.task('init', function (onDone) {

    var promptValues = [
        {
            name: 'appName',
            validator: /^[a-zA-Z]+$/,
            message: 'Name to use for ng-app',
            warning: 'App name must include only letters.'
        },
        {
            description: 'Text to use for the <title> tag',
            name: 'titleText'
        }
    ];

    prompt.start();
    prompt.get(promptValues, function (err, result) {

        gulp.src([paths.bowerFile, paths.jsFiles, paths.viewsFiles, paths.htmlFiles, paths.appJsFile, paths.scssFiles, paths.jasmineFiles], {base: '.'})
            .pipe(replace(/xxAppName/g, result.appName))
            .pipe(replace(/xxTitleText/g, result.titleText))
            .pipe(replace(/xxReplacedWithEmptyStrOnInit/g, ''))
            .pipe(replace(/<!-- delete-on-init -->(.|\n)*<!-- end-delete-on-init -->\n/g, ''))
            .pipe(replace(/\/\/ delete-on-init(.|\n)*\/\/ end-delete-on-init\n/g, ''))
            .pipe(gulp.dest('.'))
            .on('end', onDone);
    });
});


// Build tasks.

gulp.task('clean', _.partial(fs.removeSync, paths.buildDir));
gulp.task('build-start', ['clean'], _.partial(fs.ensureDirSync, paths.buildDir));


gulp.task('build-dirs', ['build-start'], function () {

    var promises = _.map(paths.dirsToCopyOnBuild, function (dir) {
        return Q.nfcall(exec, ['cp', '-R', dir, paths.buildDir]);
    });

    return Q.all(promises);
});


gulp.task('build', ['build-dirs', 'compile-scss'], function () {

    var minifyJs = lazypipe()
        .pipe(ngAnnotate)
        .pipe(uglify);

    var assets = useref.assets();
    return gulp.src([paths.htmlFiles, '!' + paths.bowerComponentsDir + '{,/**}', paths.versionFile])
        .pipe(assets)
        .pipe(gulpif('*.js', minifyJs()))
        .pipe(assets.restore())        
        .pipe(replace(/xxAppVersion/g, bowerJson.version))
        .pipe(useref())
        .pipe(gulp.dest('build'));
});


// House keeping tasks.

gulp.task('bump', function (gulpCb) {

    var mapOfTypes = {p: 'patch', i: 'minor', j: 'major'};
    var promptValues = [{
        name: 'type',
        message: 'Which version to bump? ([p]atch, m[i]nor, or ma[j]or)',
        validator: /^[pij]$/
    }];

    prompt.start();
    prompt.get(promptValues, function (err, result) {

        gulp.src(paths.bowerFile)
            .pipe(bump({
                type: mapOfTypes[result.type]
            }))
            .pipe(gulp.dest('.'))
            .pipe(git.commit('[AUTO] Bump version.'))
            .on('end', gulpCb);
    });
});


// Compile tasks.

gulp.task('compile-scss', function () {

//    return gulp.src(paths.scssFiles)
//        .pipe(sass())
//        .pipe(gulp.dest(paths.cssDir));

	return gulp.src( paths.scssFiles )
		.pipe( sass() )
		.pipe( flatten() )
		.pipe( gulp.dest(paths.cssDir) );
});


gulp.task('compile-readme', function () {

    return gulp.src('README.md')
        .pipe(markdown())
        .pipe(rename(paths.reportsDir + '/readme.html'))
        .pipe(gulp.dest('.'));
});


// Test and run tasks.

gulp.task('lint', function () {

    return gulp.src([paths.jsFiles, paths.viewsFiles, paths.jasmineFiles])
		.pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});


var runKarma = function (onDone) {

    karma.start({
        configFile: paths.karmaConfFile,
        singleRun: true,
        reporters: ['progress', 'html']
    }, onDone);
};

gulp.task('test', function (onDone) {

    runKarma(function (err) {

        onDone(err ? new Error('Failed unit tests.') : undefined);
    });
});

gulp.task('tdd', function (onDone) {

    runKarma(function () { onDone(); });
});


gulp.task('dev', ['compile-scss', 'compile-readme', 'lint', 'tdd'], function () {

    var versionInjector = injector(
        function _when(req) {

            return req.url.match(/\/app\.js|\/version\.txt$/i) !== null;
        },
        function _inject(data, req, res, cb) {

            cb(null, data.toString().replace(/xxAppVersion/g, bowerJson.version));
        });

    browserSync.init(
        [
            paths.htmlFiles,
            paths.jsFiles,
			paths.viewsFiles,
            paths.cssFiles,
            paths.reportFiles,
            '!' + paths.bowerComponentsDir
        ],
        {
            server: {
                baseDir: [paths.appDir, paths.reportsDir],
                middleware: [versionInjector]
            },
            port : 3000,
            notify: true,
            open: false,
            // XXX: https://github.com/shakyShane/browser-sync/issues/68
            ghostMode: false
        }
    );

    gulp.watch( paths.scssFiles, ['compile-scss'] );
    gulp.watch( [paths.jsFiles, paths.viewsFiles, paths.jasmineFiles], ['lint'] );
});


gulp.task('default', ['dev']);
