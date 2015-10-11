(function(window, $) {
  'use strict';

  var my = {},
      root = {},
      image = {},
      watermark = {};

  publicInterface();
  init();
  attachEvents();

  function init() {
    root.$element = $('.workspace_board');
    root.width = root.$element.width();
    root.height = root.$element.height();
  }

  function attachEvents() {}

  function normalizeSize(image) {
    var difference = 0;

    if (image.width > root.width || image.height > root.height) {

      if (image.width > image.height) {

        difference = image.width - root.width;
        image.height = Math.abs(image.height - difference);
        image.width = root.width;

        image.$element.css('width', root.width);
      } else {

        difference = image.height - root.height;
        image.width = Math.abs(image.width - difference);
        image.height = root.height;

        image.$element.css('height', root.height);
      }
    }

    console.log(image);
  }

  function centerImage(image) {
    var centeringWidth = (root.width - image.width) / 2;
    var centeringHeight = (root.height - image.height) / 2;

    if (centeringWidth) {
      image.$element.css('left', centeringWidth);
    }

    if (centeringHeight) {
      image.$element.css('top', centeringHeight);
    }
  }

  function publicInterface() {
    my = $.extend(my, {

      setImage: function(imageData) {
        if (image.$element) {
          image.$element.remove();
        }

        image = $.extend({}, imageData);
        image.$element = $('<img src="' + image.path + '" class="main-image">');

        normalizeSize(image);
        centerImage(image);

        root.$element.append(image.$element);
      },

      setWatermark: function(image) {

      }
    });
  }

  window.easel = my;
})(window, jQuery);


/*============================================================
  // TEST
=============================================================*/

var image1 = {
  path: '/demo/cat-wh.jpg',
  width: 600,
  height: 600
};
var image2 = {
  path: '/demo/cat-w.jpg',
  width: 2000,
  height: 1000
};
var image3 = {
  path: '/demo/cat-h.jpeg',
  width: 638,
  height: 640
};
var image4 = {
  path: '/demo/cat.png',
  width: 500,
  height: 331
};


easel.setImage(image2);

setTimeout(function() {
  easel.setImage(image3);
}, 2000);