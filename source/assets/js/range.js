(function(window, document, $) {
  'use strict';

  var range = function() {

    var my = {};
    var options = {
      eps: 1000
    };
    var $rangeEl = null;
    var $circleEl = null;
    var $progressEl = null;
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
      $progressEl = $rangeEl.find('.range_progress');
      rangeBox =  $rangeEl[0].getBoundingClientRect();
      $document = $(document);
      leftEdge = rangeBox.left,
      rangeWidth = rangeBox.width,
      radius = $circleEl[0].offsetWidth / 2;

      $circleEl.on('mousedown', onMousedown);
      $rangeEl.on('mousedown', onMousedown);

      // TODO: refactor.
      $circleEl[0].ondragstart = function() {
        return false;
      };
    }

    function onMousedown(e) {
      $document.on('mouseup', onMouseup);
      $document.on('mousemove', onMousemove);
      $circleEl.addClass(activeClass);
      onMousemove(e);
    }

    function onMouseup(e) {
      $document.off('mousemove', onMousemove);
      $document.off('mouseup', onMouseup);
      $circleEl.removeClass(activeClass);
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
      $progressEl[0].style.width = position + 'px';
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
  // console.log(value);
};