// custom dependencies: easel, range, sector;

(function(window, $) {
  'use strict';

  var my = {},
      options = {
        url: '/php/fileupload.php',
        dataType: 'json',
        type: 'POST',
        done: done,
        success: success
      };

  publicInterface();
  init();

  function init() {
    $('.uploader_input').fileupload(options);
  }

  function done(e, context) {
    $(this)
        .closest('.uploader')
        .find('.uploader_field')
        .text(context.files[0].name);
  }

  function success(response) {
    var inputType = $(this.fileInput).data('upload-type');

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
