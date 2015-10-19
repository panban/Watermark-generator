(function(window, $) {
  'use strict';

  $('.uploader_input').fileupload({

    url: '/',
    dataType: 'json',
    type: 'POST',

    add: function() {
      // TODO: Check uploaded file.
    },

    done: function(e, response) {
      var parseResponse = JSON.parse(response);
      var uploadType = $(this).data('upload-type');

      if (uploadType === 'image') {
        easel.setImage(parseResponse);
      } else {
        easel.setWatermark(parseResponse);
      }
    }
  });
})(window, jQuery);
