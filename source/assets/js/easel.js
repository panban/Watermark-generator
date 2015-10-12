(function(window, $) {
  'use strict';

  var my = {},
      root = {},
      image = {},
      watermark = {},
      positionSingle = [0, 0],
      positionTiling = [[0, 0], [0, 0]],
      SINGLE_MODE = 'SINGLE_MODE',
      TILING_MODE = 'TILING_MODE',
      mode = '';

  publicInterface();
  init();
  attachEvents();

  function init() {
    root.$element = $('.workspace_board');
    root.width = root.$element.width();
    root.height = root.$element.height();
    mode = SINGLE_MODE;
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
      watermark.width = Math.round(watermark.width / image.scale);
      watermark.height = Math.round(watermark.height / image.scale);
    }

    normalizeSize(image, watermark);
  }

  function movePosition(position, isHorizont) {

    if (isHorizont) {
      positionSingle[0] = limitPosition(position, true);
      watermark.$element.css('left', positionSingle[0]);
    } else {
      positionSingle[1] = limitPosition(position);
      watermark.$element.css('top', positionSingle[1]);
    }
  }

  function limitPosition(position, isHorizont) {
    // TODO: refactor.
    var stopEdge = (isHorizont)
      ? image.width - watermark.width
      : image.height - watermark.height;

    if (position < 0) {
      position = 0;
    } else if (position > stopEdge) {
      position = stopEdge;
    }

    return position;
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

        // ====================================
        // For testing.
        my.setPositoin(929, 'horizont');
        my.setPositoin(9922, 'vertical');
        // ====================================
      },

      setOpacity: function(value) {
        watermark.opacity = value;
        watermark.$element.css('opacity', value);
      },

      setPositoin: function(position, duration) {

        if (duration === 'horizont') {
          movePosition(position, true)
        } else {
          movePosition(position);
        }
      }
    });
  }

  window.easel = my;
})(window, jQuery);
