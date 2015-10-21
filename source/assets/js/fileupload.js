// custom dependencies: easel, range, sector;

(function(window, $) {
  'use strict';

  var my = {},
      options = {
        url: '/php/fileupload.php',
        dataType: 'json',
        type: 'POST',
        success: success
      };

  publicInterface();
  init();

  function init() {
    $('.uploader_input').fileupload(options);
  }

  function success(response) {
    var inputType = $(this).data('upload-type');

    my.uploaded(inputType, response);
  }

  function publicInterface() {
    my = $.extend(my, {

      // callbacks
      uploaded: function(inputType, response) {}
    });
  }

  window.fileupload = my;
})(window, jQuery);
