(function(window, $) {
  'use strict';

  var table = function() {

    var my = {};

    publicInterface();
    init();

    function init() {}

    function publicInterface() {
      my = $.extend(my, {
        getWm: function(path) {
          console.log(path);
        }
      });
    }

    return my;
  };

  // transport
  window.table = table();
})(window, jQuery);


// ======================================
  // Exapmle.
// ======================================

var fileUpload = {
  success: function(response) {

    if (typeof this.afterSuccess === 'function') {
      this.afterSuccess('somePaht/someImg.jpg');
    }
  }
};

fileUpload.afterSuccess = function(file) {
  table.getWm(file);
};

setTimeout(function() {
  fileUpload.success();
}, 1000);

