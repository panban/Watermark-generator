(function(window, document, $) {
  'use strict';

  var my = {
    change: function() {}
    },
    options = {
      eps: 1000
    },
    $rootEl = null,
    $handleEl = null,
    $progressEl = null,
    $document = null,
    rangeBox = null,
    leftEdge = 0,
    rangeWidth = 0,
    radius = 0,
    activeClass = 'range_handle--active';

  publicInterface();
  init();
  attachEvents();

  function init() {
    $rootEl = $('.range');
    $handleEl = $rootEl.find('.range_handle');
    $progressEl = $rootEl.find('.range_progress');
    rangeBox =  $rootEl[0].getBoundingClientRect();
    $document = $(document);
    leftEdge = rangeBox.left,
    rangeWidth = rangeBox.width,
    radius = $handleEl[0].offsetWidth / 2;
  }

  function attachEvents() {
    $handleEl.on('mousedown', onMousedown);
    $rootEl.on('mousedown', onMousedown);

    // TODO: refactor.
    $handleEl[0].ondragstart = function() {
      return false;
    };
  }

  function onMousedown(e) {
    $document.on('mouseup', onMouseup);
    $document.on('mousemove', onMousemove);
    $handleEl.addClass(activeClass);
    onMousemove(e);
  }

  function onMouseup(e) {
    $document.off('mousemove', onMousemove);
    $document.off('mouseup', onMouseup);
    $handleEl.removeClass(activeClass);
  }

  function onMousemove(e) {
    var x = e.pageX - leftEdge;

    if (x < 0) {
      x = 0;
    } else if (x > rangeWidth) {
      x = rangeWidth;
    }

    countValue(x);
    moveHangle(x);
  }

  function countValue(position) {
    var result = (Math.round((position / rangeWidth) * options.eps)) / options.eps;

    my.change(1 - result);
  }

  function moveHangle(position) {
    $handleEl[0].style.left = (position - radius) + 'px';
    $progressEl[0].style.width = position + 'px';
  }

  function publicInterface() {
    my = $.extend(my, {
      setEps: function(eps) {
        options.eps = eps;
      }
    });
  }

  window.range = my;
})(window, document, jQuery);
