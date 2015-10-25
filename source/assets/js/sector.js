(function(window, $) {
  'use strict';

  var my = {},
      $root = null,
      $links = null,
      $cross = null,
      $activeLink = null,
      lineX = {},
      lineY = {},
      sectorsCache = {},
      crossMode = false,
      activeClass = 'sector--current';

  publicInterface();
  init();
  attachEvents();

  function init() {
    $root = $('.sector');
    $cross = $root.find('.sector_cross');
    $links = $root.find('a');
    lineX.$element = $root.find('.sector_line-x');
    lineY.$element = $root.find('.sector_line-y');

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

    my.triger(coords);
    updateLinks($this);

    e.preventDefault();
  }

  function publicInterface() {
    my = $.extend(my, {

      setActive: function(position) {
        var $link = sectorsCache[position.join('')];

        if (crossMode) {
          return;
        }

        updateLinks($link);
      },

      setCross: function(coords) {
        var height = (coords[1] * 100) / lineY.limit;
        var width = (coords[0] * 100) / lineX.limit;

        lineY.$element.css('height', height);
        lineX.$element.css('width', width);
      },

      setLimit: function(limit) {
        lineX.limit = limit[0];
        lineY.limit = limit[1];
      },

      toggleMode: function(mode) {
        if (mode === 'TILING_MODE') {
          crossMode = true;
          updateLinks();
          $cross.show();

        } else {
          crossMode = false;
          $cross.hide();
          updateLinks($activeLink);
        }
      },

      // callbacks
      triger: function(positoin) {}
    });
  }

  window.sector = my;
})(window, jQuery);
