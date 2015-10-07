(function(window, $) {
    'use strict';


    var range = function() {

        var my = {},
            _sliderCircle = $('.range__circle'),
            _slider = _sliderCircle.closest('.range'),
            _mouseOffsetX = 0;

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
            console.log(_mouseOffsetX);
            _sliderCircle.css({'transform':'translate3d(' + _mouseOffsetX + 'px' + ', 0, 0)'});
        }

        function _stopSlide() {
           // _sliderCircle.css({'position':'static'});
        }

        function _moveSlider() {
            _slider.on('mousemove', function(e) {
                _mouseOffsetX = e.offsetX;
            });
        }


        return my;
    };

    // transport
    window.range = range();

})(window, jQuery);

range.getOpacityValue($('.range__circle'));