(function(window, $) {
  'use strict';

  var my = {},
      $rootEl = null,
      $linkEls = null,
      sectorsCache = {},
      activeClass = 'position-area--current';

  publicInterface();
  init();
  attachEvents();

  function init() {
    $rootEl = $('.position-area');
    $linkEls = $rootEl.find('a');

    saveSectors();
  }

  function attachEvents() {

    $rootEl.on('click', 'a', onClick);
  }

  function updateLinks($link) {
    $linkEls.removeClass(activeClass);

    if ($link) {
      $link.addClass(activeClass);
    }
  }

  function getCoords($el) {
    var x = $el.data('step-x');
    var y = $el.data('step-y');

    return [x, y];
  }

  function saveSectors() {

    $linkEls.each(function(i, link) {
      var $link = $(link);
      var y = $link.data('step-y');
      var x = $link.data('step-x');

      sectorsCache[x + '' + y] = $link;
    });
  }

  function onClick(e) {
    var $this = $(this);
    var coords = getCoords($this);

    my.triger(coords[0], coords[1]);
    updateLinks($this);

    e.preventDefault();
  }

  function publicInterface() {
    my = $.extend(my, {

      setActive: function(x, y) {
        var $link = sectorsCache[x + '' + y];
        updateLinks($link);
      },

      toggleMode: function() {

        updateLinks();
        $rootEl.off('click', 'a', onClick);
      },

      // callbacks
      triger: function() {}
    });
  }

  window.sector = my;
})(window, jQuery);
