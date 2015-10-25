(function (window, $) {
  'use strict';

  var my = {},
      disableClass = 'disable';

  publicInterface();
  init();

  function init() {}

  function disable(selectors) {
      $.each(selectors, function() {
        var $this = $(this),
            blocker = $('<div class="disable-block"></div>');

        $this
          .addClass(disableClass)
          .append(blocker);
      })
  }

  function enable(selectors) {
      selectors.each(function() {
        $(this)
          .removeClass(disableClass)
          .find('.disable-block')
          .remove();
      })
  }

  function publicInterface() {
    my = $.extend(my, {

      disable: disable,

      enable: enable
    });
  }

  window.blocker = my;
})(window, jQuery);
