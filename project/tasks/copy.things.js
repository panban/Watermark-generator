(function() {
  'use strict';

  var builder = function($) {

    $.gulp.task('copy:things', function() {

      $.gulp.src('./source/assets/fonts/**/*')
        .pipe($.gulp.dest($.config.root + '/assets/fonts'))

      if ($.debug) {
        $.gulp.src('./source/assets/demo/**.*')
          .pipe($.gulp.dest($.config.root + '/demo'))
      }
    });
  };

  module.exports = builder;
})();