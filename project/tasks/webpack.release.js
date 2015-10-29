(function() {
  'use strict';

  var builder = function($) {

    $.gulp.task('webpack:release', $.shell.task('webpack'));
  };

  module.exports = builder;
})();