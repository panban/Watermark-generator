(function() {
  'use strict';

  var builder = function($) {

    $.gulp.task('copy:things', function() {

      $.gulp.src('./source/assets/fonts/**/*')
        .pipe($.gulp.dest($.config.root + '/assets/fonts'))

      if ($.debug) {
        // $.gulp.src('./source/assets/js/app.templates.js')
        //   .pipe($.gulp.dest($.config.root + '/assets/js'))
      }
    });
  };

  module.exports = builder;
})();