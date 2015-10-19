;(function(window, $) {
    'use strict';

    $('.uploader_input').fileupload({

        url: '/assets/php/fileupload.php',
        add: function(e, data) {
            console.log('add');
            data.submit();
        },

        done: function(e, data) {
            console.log('done');
            console.log(data.result.files);
        }

    });




})(window, jQuery);
