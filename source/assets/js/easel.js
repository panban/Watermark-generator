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

  function normalizeSize(outer, inner) {
    var outerRatio = 0;
    var innerRatio = 0;

    if (inner.width > outer.width || inner.height > outer.height) {

      outerRatio = outer.width / outer.height;
      innerRatio = inner.width / inner.height;

      if (outerRatio < innerRatio) {
        inner.width = outer.width;
        inner.height = Math.round(outer.width / innerRatio);
      } else {
        inner.width = Math.round(outer.height * innerRatio);
        inner.height = outer.height;
      }
    }

    inner.scale = inner.originalWidth / inner.width;

    inner.$element.css({
      'width': inner.width,
      'height': inner.height
    });
  }

  function scaleWatermark(watermark) {

    if (image.scale !== 1) {
      watermark.width = watermark.width / image.scale;
      watermark.height = watermark.height / image.scale;
    }

    normalizeSize(image, watermark);
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

  function savePicture(picture, data) {
    if (picture.$element) {
      picture.$element.remove();
    }

    picture = $.extend({}, data);
    picture.originalWidth = picture.width;
    picture.originalHeight = picture.height;

    return picture;
  }

  function publicInterface() {
    my = $.extend(my, {

      setImage: function(pictureData) {
        image = savePicture(image, pictureData);
        image.$element = $('<div class="wm-area"><img class="wm-image" src="' + image.path + '"></div>');

        normalizeSize(root, image);
        centerImage(image);

        if (watermark.$element) {
          my.setWatermark({
            path: watermark.path,
            width: watermark.originalWidth,
            height: watermark.originalHeight
          });
        }

        root.$element.append(image.$element);
      },

      setWatermark: function(pictureData) {
        watermark = savePicture(watermark, pictureData);
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
