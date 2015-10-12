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

  function normalizeSize(context, picture) {

    if (picture.width > context.width || picture.height > context.height) {

      picture.originalWidth = picture.originalWidth || picture.width;
      picture.originalHeight = picture.originalHeight || picture.height;

      context.ratio = context.width / context.height;
      picture.ratio = picture.width / picture.height;

      if (context.ratio < picture.ratio) {
        picture.width = context.width;
        picture.height = Math.round(context.width / picture.ratio);
      } else {
        picture.width = Math.round(context.height * picture.ratio);
        picture.height = context.height;
      }
    }

    picture.$element.css({
      'width': picture.width,
      'height': picture.height
    });
  }

  function scaleWatermark(watermark) {
    watermark.originalWidth = watermark.width;
    watermark.originalHeight = watermark.height;

    if (image.originalWidth > watermark.width || image.originalHeight > watermark.height) {
      watermark.width = watermark.width / image.ratio;
      watermark.height = watermark.height / image.ratio;
    }

    normalizeSize(image, watermark);

    watermark.scale = watermark.originalWidth / watermark.width || 1;
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
