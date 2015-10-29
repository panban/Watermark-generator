(function() {
  'use strict';

  var builder = function($) {

    $.gulp.task('webpack:process', $.shell.task('APPLICATION_ENV=development webpack'));
  };

  module.exports = builder;
})();