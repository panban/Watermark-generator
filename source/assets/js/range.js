(function(window, $) {
    'use strict';


    var range = function() {

        var my = {};

        publicInterface();
        init();

        function init() {}

        function publicInterface() {
            my = $.extend(my, {
                getWm: function(path) {
                    console.log('rangedd');
                }
            });
        }

        return my;
    };

    // transport
    window.range = range();

})(window, jQuery);

range.getWm();