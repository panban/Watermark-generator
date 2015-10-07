(function(window, document, $) {
  'use strict';

  var options = {};

  function Spinner(o) {
    options = $.extend(options, o);
  }

  var fn = Spinner.prototype;

  fn.test = function() {

  };

  window.Spinner = Spinner;
})(window, document, jQuery);

var spinner1 = new Spinner({

});