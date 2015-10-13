(function(window, $) {
  'use strict';

  var my = {},
      root = {},
      image = {},
      sector = {},
      sectorCache = {},
      watermark = {},
      positionSingle = [0, 0],
      positionTiling = [[0, 0], [0, 0]],
      SINGLE_MODE = 'SINGLE_MODE',
      TILING_MODE = 'TILING_MODE',
      mode = '';

  publicInterface();
  init();

  function init() {
    root.$element = $('.workspace_board');
    root.width = root.$element.width();
    root.height = root.$element.height();
    mode = SINGLE_MODE;
  }

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

  function scaleWatermark() {

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
    var limit = (isHorizont)
      ? image.width - watermark.width
      : image.height - watermark.height;

    if (position < 0) {
      position = 0;
    } else if (position > limit) {
      position = limit;
    }

    return position;
  }

  function centerImage() {
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

  function countSectorSize(stepX, stepY) {
    sectorCache = {};

    sector.width = Math.round(image.width / 3);
    sector.height = Math.round(image.height / 3);
    sector.centerWidth =  Math.round((sector.width - watermark.width) / 2);
    sector.centerHeight = Math.round((sector.height - watermark.height) / 2);
  }

  function publicInterface() {
    my = $.extend(my, {

      setImage: function(pictureData) {
        image = savePicture(image, pictureData);
        image.$element = $('<div class="wm-area"><img class="wm-image" src="' + image.path + '"></div>');

        normalizeSize(root, image);
        centerImage();

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

        scaleWatermark();
        countSectorSize();

        image.$element.append(watermark.$element);

        // ====================================
        // For testing.
        my.moveBySector(1, 1);
        // my.move(99, 'vertical');
        // my.move(9987, 'horizont');
        // ====================================
      },

      setOpacity: function(value) {
        watermark.opacity = value;
        watermark.$element.css('opacity', value);
      },

      move: function(position, duration) {

        if (duration === 'horizont') {
          movePosition(position, true)
        } else {
          movePosition(position);
        }
      },

      moveBySector: function(stepX, stepY) {
        var sectorName = stepX + '.' + stepY;

        if (!sectorCache[sectorName]) {
          sectorCache[sectorName] = [];
          sectorCache[sectorName][0] = sector.centerWidth + sector.width * stepX;
          sectorCache[sectorName][1] = sector.centerHeight + sector.height * stepY;
        }

        movePosition(sectorCache[sectorName][0], true);
        movePosition(sectorCache[sectorName][1]);
      }
    });
  }

  window.easel = my;
})(window, jQuery);
