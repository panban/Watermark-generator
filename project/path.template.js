(function() {
  'use strict';

  var template = [
    './source/templates/**/*.jade'
    '!./source/templates/**/_*.jade'
  ];

  module.exports = template;
})();