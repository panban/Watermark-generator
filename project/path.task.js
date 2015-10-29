(function() {
  'use strict';

  var task = [
    './project/tasks/sass.process.js',
    './project/tasks/sass.release.js',
    './project/tasks/js.lint.js',
    './project/tasks/webpack.process.js',
    './project/tasks/webpack.release.js',
    './project/tasks/template.copy.js',
    './project/tasks/template.jade.js',
    './project/tasks/service.server.js',
    './project/tasks/service.clean.js',
    './project/tasks/copy.resource.js',
    './project/tasks/copy.things.js',
    './project/tasks/copy.image.js'
  ];

  module.exports = task;
})();