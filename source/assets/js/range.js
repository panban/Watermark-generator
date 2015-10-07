(function(window, document, $) {
  'use strict';

  var range = function() {

    var my = {};
    var options = {
      eps: 1000
    };
    var $rangeEl = null;
    var $circleEl = null;
    var $document = null;
    var rangeBox = null;
    var leftEdge = 0;
    var rangeWidth = 0;
    var radius = 0;

    publicInterface();
    init();

    function init() {
      $rangeEl = $('.range');
      $circleEl = $rangeEl.find('.range_circle');
      rangeBox =  $rangeEl[0].getBoundingClientRect();
      $document = $(document);
      leftEdge = rangeBox.left,
      rangeWidth = rangeBox.width,
      radius = parseInt(getComputedStyle($circleEl[0]).width) / 2

      $circleEl.on('mousedown', onMousedown);
    }

    function onMousedown(e) {
      $document.on('mousemove', onMousemove);
      $document.on('mouseup', onMouseup);
    }

    function onMouseup(e) {
      $document.off('mousemove', onMousemove);
      $document.off('mouseup', onMouseup);
    }

    function onMousemove(e) {
      var x = e.pageX - leftEdge;

      if (x < 0) {
        x = 0;
      } else if (x > rangeWidth) {
        x = rangeWidth;
      }

      getValue(x);
      moveCircle(x);
    }

    function getValue(position) {
      var result = (Math.round((position / rangeWidth) * options.eps) ) / options.eps;

      my.getValue(result);
    }

    function moveCircle(position) {
      $circleEl[0].style.left = (position - radius) + 'px';
    }

    function publicInterface() {
      my = $.extend(my, {
        setEps: function(eps) {
          options.eps = eps;
        }
      });
    }

    return my;
  };

  window.range = range();
})(window, document, jQuery);

range.getValue = function(value) {
  console.log(value);
};