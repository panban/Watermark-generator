(function(window, $) {
  'use strict';

  var my = {},
      rootEl = null,
      linkEls = null,
      activeClass = 'position-area--current';

  init();
  attachEvents();

  function init() {
    rootEl = $('.position-area');
    linkEls = rootEl.find('a');
  }

  function updateLinks(currentEl) {
    linkEls.removeClass(activeClass);
    currentEl.addClass(activeClass);
  }

  function attachEvents() {
    rootEl.on('click', 'a', function(e) {
      var $this = $(this);
      var stepX = $this.data('step-x');
      var stepY = $this.data('step-y');

      my.triger(stepX, stepY);
      updateLinks($this);
    });
  }

  function publicInterface() {
    my = $.extend(my, {

      triger: function() {}
    });
  }

  window.sector = my;
})(window, jQuery);