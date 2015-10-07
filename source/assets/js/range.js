(function(window, $) {
    'use strict';


    var range = function() {

        var my = {},
            _sliderCircle = [];

        publicInterface();
        init();

        function init() {}

        function publicInterface() {
            my = $.extend(my, {
                getOpacityValue: function(range) {
                    _sliderCircle = range;
                    _moveSlider();
                }
            });
        }

        /* ----- Узнаем ширину ползунка ----- */
        function _getSliderWidth() {
            return _sliderCircle.closest('.range').width();
        }
        
        function _moveSlider() {
            var sliderWidth =_getSliderWidth();
            console.log(sliderWidth);
        }

        return my;
    };

    // transport
    window.range = range();

})(window, jQuery);

range.getOpacityValue($('.range'));