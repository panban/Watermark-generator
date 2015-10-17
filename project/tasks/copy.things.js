(function() {
  'use strict';

  var builder = function($) {

    $.gulp.task('copy:things', function() {

      $.gulp.src('./source/assets/fonts/**/*')
        .pipe($.gulp.dest($.config.root + '/assets/fonts'))

      $.gulp.src('./source/assets/resources/**/*')
        .pipe($.gulp.dest($.config.root));

      if ($.debug) {
        $.gulp.src('./source/assets/demo/**/*.{png,jpg,jpeg}')
          .pipe($.gulp.dest($.config.root + '/demo'))
      }
    });
  };

  module.exports = builder;
})();