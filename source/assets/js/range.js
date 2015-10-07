(function(window, $) {
    'use strict';


    var range = function() {

        var my = {},
            _sliderCircle = $('.range__circle'),
            _slider = _sliderCircle.closest('.range');

        /* ------- Setup listeners  ------- */
        _sliderCircle.on('mousedown', _startSlide);
        _sliderCircle.on('mouseup', _stopSlide);

        publicInterface();
        init();

        function init() {}

        function publicInterface() {
            my = $.extend(my, {
                getOpacityValue: function(range) {
                    _sliderCircle = range; // TODO it is doesn't change _sliderCircle, why ?
                    _moveSlider();
                }
            });
        }

        function _getSliderWidth() {
            return _sliderCircle.closest('.range').width();
        }


        function _getOpacity() {
            var sliderWidth =_getSliderWidth(),
                circlePosition = _sliderCircle.position().left,
                min = 0,
                max = sliderWidth;

            _moveSlider();
        }

        function _startSlide() {
            _sliderCircle.css({'position':'absolute'});
        }

        function _stopSlide() {
            console.log('hi');
            _sliderCircle.css({'position':'static'});
        }

        function _moveSlider() {

            _slider.on('mousemove', function(e) {
                _sliderCircle.css({
                    'left' : e.offsetX + 'px'
                });
                console.log('move');
            });

        }


        return my;
    };

    // transport
    window.range = range();

})(window, jQuery);

range.getOpacityValue($('.range__circle'));