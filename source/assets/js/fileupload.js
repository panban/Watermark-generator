;(function(window, $) {
    'use strict';

    $('.uploader_input').fileupload({

        url: '/assets/php/',
        dataType: 'json',
        type: 'GET',
        add: function() {
            console.log('add');
        },

        done: function() {
            console.log('done')
        }


    });




})(window, jQuery);
