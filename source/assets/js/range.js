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
    var activeClass = 'range_circle--active';

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
      $rangeEl.on('mousedown', onMousedown);
    }

    function onRangeClick(e) {
      var x = e.pageX - leftEdge;

      countValue(x);
      moveCircle(x);
    }

    function onMousedown(e) {
      onMousemove(e);
      $circleEl.addClass(activeClass);
      $document.on('mousemove', onMousemove);
      $document.on('mouseup', onMouseup);
    }

    function onMouseup(e) {
      $circleEl.removeClass(activeClass);
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

      countValue(x);
      moveCircle(x);
    }

    function countValue(position) {
      var result = (Math.round((position / rangeWidth) * options.eps)) / options.eps;

      my.change(result);
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

range.change = function(value) {
  console.log(value);
};