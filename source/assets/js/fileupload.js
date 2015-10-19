(function(window, $) {
  'use strict';

  var options = {
    url: '/',
    dataType: 'json',
    type: 'POST',
    add: add,
    done: done
  };

  function done(e, response) {
    var parseResponse = JSON.parse(response);
    var uploadType = $(this).data('upload-type');

    if (uploadType === 'image') {
      easel.setImage(parseResponse);
    } else {
      easel.setWatermark(parseResponse);
    }
  }

  function add() {
    // TODO: Check uploaded file.
  }

  $('.uploader_input').fileupload(options);

})(window, jQuery);
