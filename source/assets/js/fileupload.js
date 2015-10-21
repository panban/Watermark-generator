// custom dependencies: easel, range, sector;

(function(window, $) {
  'use strict';

  var my = {},
      options = {
        url: '/php/fileupload.php',
        dataType: 'json',
        type: 'POST',
        success: my.uploaded
      };

  publicInterface();
  init();

  function init() {
    $('.uploader_input').fileupload(options);
  }

  function publicInterface() {
    my = $.extend(my, {

      // callbacks
      uploaded: function(inputType, response) {}
    });
  }

  window.fileupload = my;
})(window, jQuery);
