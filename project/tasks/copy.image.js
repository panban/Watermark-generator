(function() {
  'use strict';

  var builder = function($) {

    $.gulp.task('copy:image', function() {

      return $.gulp.src('./source/assets/images/**/*.{png|jpg|gif}')
        .pipe($.gulp.dest($.config.root + '/assets/img'));
    });
  };

  module.exports = builder;
})();