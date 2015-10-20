(function(window, $) {
  'use strict';

  var my = {},
      $root = null,
      $links = null,
      $cross = null,
      $activeLink = null,
      crossLine = {},
      mainLine = {},
      sectorsCache = {},
      crossMode = false,
      activeClass = 'sector--current';

  publicInterface();
  init();
  attachEvents();

  function init() {
    $root = $('.sector');
    $cross = $root.find('.sector_cross')
    $links = $root.find('a');
    crossLine.$element = $root.find('.sector_cross-line');
    mainLine.$element = $root.find('.sector_main-line');

    saveSectors();
  }

  function attachEvents() {

    $root.on('click', 'a', onClick);
  }

  function updateLinks($link) {
    $links.removeClass(activeClass);

    if ($link) {
      $activeLink = $link;
      $link.addClass(activeClass);
    }
  }

  function getCoords($el) {
    var x = $el.data('step-x');
    var y = $el.data('step-y');

    return [x, y];
  }

  function saveSectors() {

    $links.each(function(i, link) {
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

        if (crossMode) {
          return;
        }

        updateLinks($link);
      },

      toggleMode: function(type) {

        if (type === 'tiling') {
          crossMode = true;
          updateLinks();
          $cross.show();

          // ============================================
          // TODO
          crossLine.$element.css({height: 5})
          mainLine.$element.css({width: 5});
          // ============================================

        } else {
          crossMode = false;
          $cross.hide();
          updateLinks($activeLink);
        }
      },

      // callbacks
      triger: function() {}
    });
  }

  window.sector = my;
})(window, jQuery);
