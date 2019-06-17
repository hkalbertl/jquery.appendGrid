// Karma configuration

module.exports = function (config) {

  // Prepare files to be included based on args
  let includeFiles = [
    // AppendGrid binary
    'dist/AppendGrid.js'
  ], extraFiles = null;
  if (config.bootstrap4) {
    // For Bootstrap 4
    extraFiles = [
      // Library CSS
      { pattern: './node_modules/bootstrap/dist/css/bootstrap.min.css' },
      { pattern: './node_modules/bootstrap/dist/css/bootstrap.min.css.map', included: false },
      { pattern: './node_modules/@fortawesome/fontawesome-free/css/all.min.css' },
      { pattern: './node_modules/@fortawesome/fontawesome-free/webfonts/*.woff2', included: false },
      { pattern: './node_modules/@fortawesome/fontawesome-free/webfonts/*.woff', included: false },
      { pattern: './node_modules/@fortawesome/fontawesome-free/webfonts/*.ttf', included: false },
      // Library JS
      { pattern: './node_modules/jquery/dist/jquery.slim.min.js' },
      { pattern: './node_modules/jquery/dist/jquery.slim.min.map', included: false },
      { pattern: './node_modules/bootstrap/dist/js/bootstrap.bundle.min.js' },
      { pattern: './node_modules/bootstrap/dist/js/bootstrap.bundle.min.js.map', included: false },
      // Testing scripts
      { pattern: './test/bootstrap4-*.js' },
    ];
  } else if (config.bulma) {
    // For Bulma
  } else {
    // For Plain JS
    extraFiles = [
      // Testing scripts
      { pattern: './test/plainjs-*.js' },
    ];
  }
  if (extraFiles) {
    extraFiles.forEach(function (entry) {
      includeFiles.push(entry);
    });
  }

  // Karma config
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai'],


    // list of files / patterns to load in the browser
    files: includeFiles,


    // list of files / patterns to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,


    client: {
      // Clear the context window
      clearContext: false
    },
  })
}
