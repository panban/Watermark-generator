(function(window, $) {
  'use strict';

  var table = function() {

    var my = {};

    publicInterface();
    init();

    function init() {}

    function publicInterface() {
      my = $.extend(my, {

      });
    }

    return my;
  };

  window.table = table();
})(window, jQuery);
