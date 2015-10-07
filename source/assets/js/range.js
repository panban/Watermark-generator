(function(window, $) {
    'use strict';


    var range = function() {

        var my = {};

        publicInterface();
        init();

        function init() {}

        function publicInterface() {
            my = $.extend(my, {
                getOpacityValue: function(range) {
                    this.range = range;
                    _moveSlider();
                }
            });
        }
        
        function _moveSlider() {
            console.log(my.range);
        }

        return my;
    };

    // transport
    window.range = range();

})(window, jQuery);

range.getOpacityValue($('.range'));