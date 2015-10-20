// custom dependencies: easel, range, sector;

(function(window, $) {
  'use strict';

  var my = {},
      options = {
        url: '/',
        dataType: 'json',
        type: 'POST',
        add: add,
        done: done
      };

  publicInterface();
  init();

  function init() {

    $('.uploader_input').fileupload(options);
  }

  function done(e, response) {
    var parseResponse = JSON.parse(response);
    var inputType = $(this).data('upload-type');

    my.uploaded(inputType, parseResponse);
  }

  function add(e) {
    // TODO: Check uploaded file.
    // console.log(data.files[0].name);
    // console.log(data.files[0].size);
    // console.log(data.files[0].type);
  }

  function publicInterface() {
    my = $.extend(my, {

      // callbacks
      uploaded: function(inputType, response) {}
    });
  }

  window.fileupload = my;
})(window, jQuery);
