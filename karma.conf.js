'use strict';

module.exports = function (config) {

    config.set({
        frameworks: ['jasmine'],
        browsers : ['PhantomJS'],
        plugins : [
            'karma-phantomjs-launcher',
            'karma-jasmine',
            'karma-htmlfile-reporter',
        ],
        files : [
            'app/bower_components/angular/angular.js',
            'app/bower_components/fastclick/lib/fastclick.js',
            'app/bower_components/jquery/dist/jquery.js',
            'app/bower_components/lodash/dist/lodash.js',
            'app/bower_components/angular-mocks/angular-mocks.js',
            'app/bower_components/common-web/common-web.js',
            'app/bower_components/amp-access/amp-access.js',
            'app/bower_components/amp-config/amp-config.js',
            'app/bower_components/pro-canvas/pro-canvas.js',
            'app/js/{*,**/*}.js',
            'test/jasmine/{*,**/*}.js',
        ],
        htmlReporter: {
            outputFile: 'reports/karma.html'
        }
    });
};
