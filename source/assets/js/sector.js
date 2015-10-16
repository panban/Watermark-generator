(function(window, $) {
  'use strict';

  var my = {},
      rootEl = null,
      linkEls = null,
      sectorsCache = {},
      activeClass = 'position-area--current';

  publicInterface();
  init();
  attachEvents();

  function init() {
    rootEl = $('.position-area');
    linkEls = rootEl.find('a');

    saveSectors();
  }

  function attachEvents() {

    rootEl.on('click', 'a', onClick);
  }

  function saveSectors() {

    linkEls.each(function(i, el) {
      var $el = $(el);
      var stepX = $el.data('step-x');
      var stepY = $el.data('step-y');

      sectorsCache[i] = [stepX, stepY];
    });
  }

  function updateLinks(currentEl) {
    linkEls.removeClass(activeClass);

    if (currentEl) {
      currentEl.addClass(activeClass);
    }
  }

  function onClick(e) {
    var $this = $(this);
    var index = $this.index();

    my.triger(sectorsCache[index][0], sectorsCache[index][1]);
    updateLinks($this);
  }

  function publicInterface() {
    my = $.extend(my, {

      toggleMode: function() {

        updateLinks();
        rootEl.off('click', 'a', onClick);
      },

      triger: function() {}
    });
  }

  window.sector = my;
})(window, jQuery);
