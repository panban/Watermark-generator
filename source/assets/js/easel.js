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

  function normalizeSize(context, image) {
    image.ratio = 0;
    context.ratio = 0;

    if (image.width > context.width || image.height > context.height) {

      context.ratio = context.width / context.height;
      image.ratio = image.width / image.height;
      image.originalWidth = image.width;
      image.originalHeight = image.height;

      if (context.ratio < image.ratio) {
        image.width = context.width;
        image.height = Math.round(context.width / image.ratio);
      } else {
        image.width = Math.round(context.height * image.ratio);
        image.height = context.height;
      }
    }

    image.$element.css({
      'width': image.width,
      'height': image.height
    });
  }

  function scaleWatermark(watermark) {

    if (image.originalWidth > watermark.width || image.originalHeight > watermark.height) {
      watermark.width = watermark.width / image.ratio;
      watermark.height = watermark.height / image.ratio;
    }

    normalizeSize(image, watermark);

    watermark.scale = watermark.width / watermark.originalWidth || 1;
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
        image.$element = $('<div class="wm-area"><img class="wm-image" src="' + image.path + '"></div>');

        normalizeSize(root, image);
        centerImage(image);

        root.$element.append(image.$element);

        if (watermark.$element) {
          my.setWatermark({
            path: watermark.path,
            width: watermark.originalWidth,
            height: watermark.originalHeight
          });
        }
      },

      setWatermark: function(imageData) {
        if (watermark.$element) {
          watermark.$element.remove();
        }

        watermark = $.extend({}, imageData);
        watermark.$element = $('<img class="wm" src="' + watermark.path + '">');

        scaleWatermark(watermark);

        image.$element.append(watermark.$element);
      },

      setOpacity: function(value) {
        watermark.opacity = value;
        watermark.$element.css('opacity', value);
      }
    });
  }

  window.easel = my;
})(window, jQuery);


/*============================================================
  // TEST
=============================================================*/
