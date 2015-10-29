var $ = {
  package: require('./package.json'),
  config: require('./project/config.js'),
  path: {
    system: require('./project/path.system.js'),
    app: require('./project/path.app.js'),
    sass: require('./project/path.sass.js'),
    template: require('./project/path.template.js'),
    task: require('./project/path.task.js')
  },
  shell: require('gulp-shell'),
  browserSync: require('browser-sync'),
  sequence: require('run-sequence'),
  rimraf: require('rimraf'),
  gulp: require('gulp'),
  $gulp: require('gulp-load-plugins')({
    lazy: false,
    rename: {
      'gulp-replace-task': 'replace'
    }
  })
};

$.debug = true;

$.path.task.forEach(function(taskPath) {
  var builder = require(taskPath)($);
});

$.gulp.task('default', function() {
  $.sequence(
    [
      'webpack:process',
      'scss:process',
      'template:jade',
      'copy:image',
      'copy:resource',
      'copy:things'
    ],
    'service:server'
  );
});

$.gulp.task('build', function(cb) {
  $.debug = false;

  $.sequence(
    'service:clean',
    'js:lint',
    [
      'webpack:release',
      'scss:release',
      'template:jade',
      'copy:image',
      'copy:resource',
      'copy:things'
    ],
    function(cb) {
      console.log('Built has been completed.');
    }
  );
});
