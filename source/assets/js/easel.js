(function(window, $) {
  'use strict';

  var my = {},
      root = {},
      image = {},
      tiling = {uncreated: true},
      sector = {},
      containers = {},
      sectorCache = {},
      watermark = {},
      limit = [0, 0],
      positionSingle = [0, 0],
      positionTiling = [[0, 0], [20, 20]],
      SINGLE_MODE = 'SINGLE_MODE',
      TILING_MODE = 'TILING_MODE',
      mode = '';

  publicInterface();
  init();
  attackEvets();

  function init() {
    mode = SINGLE_MODE;
    root.$element = $('.workspace_board');
    root.width = root.$element.width();
    root.height = root.$element.height();
    containers.$image = root.$element.find('.image-container');
    containers.$watermark = root.$element.find('.watermark-container');

    tiling.$limiterEl = root.$element.find('.tiling-limiter');
    tiling.$containerEl = root.$element.find('.tiling-container');
  }

  function attackEvets() {
    $('.tiling-mode').on('click', onTilingMode);
    $('.single-mode').on('click', onSingleMode)
  }

  function onTilingMode() {
    if (tiling.uncreated) {
      createTiling();
    }

    mode = TILING_MODE;
    my.setOpacity();
    containers.$watermark.hide();
    tiling.$limiterEl.show();

    my.getLimit([30, 30]),
    my.getPosition(positionTiling[1]);
  }

  function onSingleMode() {
    if (!tiling.uncreated) {
      tiling.$limiterEl.hide();
    }

    mode = SINGLE_MODE;
    my.setOpacity();
    containers.$watermark.show();

    my.getLimit(limit);
    my.getPosition(positionSingle);
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

  function limitPosition(position, isHorizont) {
    var currentLimit = (isHorizont) ? limit[0] : limit[1];

    if (position < 0) {
      position = 0;
    } else if (position > currentLimit) {
      position = currentLimit;
    }

    return position;
  }

  function centerImage() {
    var centeringWidth = (root.width - image.width) / 2;
    var centeringHeight = (root.height - image.height) / 2;

    containers.$image.css('left', centeringWidth);
    containers.$image.css('top', centeringHeight);
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

  function countLimit() {
    limit[0] = image.width - watermark.width;
    limit[1] = image.height - watermark.height;
  }

  function createTiling() {
    var i, j;
    var $clone = null,
        tempWidth = 0,
        tempHeight = 0;

    //============================================
    // Test.
    var gutterWidth = 20;
    var gutterHeight = 20;
    //============================================

    tiling.countWidth = Math.round(image.width / watermark.width);
    tiling.countHeight = Math.round(image.height / watermark.height);
    tiling.width = tiling.countWidth * (watermark.width + gutterWidth) - gutterWidth;
    tiling.height = tiling.countHeight * (watermark.height + gutterHeight) - gutterHeight;
    tiling.limiterHeight = ((tiling.height + gutterHeight) * 2) - image.height;
    tiling.limiterWidth = ((tiling.width + gutterWidth) * 2) - image.width;

    var centeringHeight = (image.height - tiling.limiterHeight) / 2;
    var centeringWidth = (image.width - tiling.limiterWidth) / 2;

    for (i = 0; i < tiling.countHeight; i++) {

      for (j = 0; j < tiling.countWidth; j++) {
        $clone = watermark.$element.clone();

        $clone.css({
          left: tempWidth,
          top: tempHeight,
          position: 'absolute'
        });

        tiling.$containerEl.append($clone);
        tempWidth += watermark.width + gutterWidth;
      }

      tempWidth = 0;
      tempHeight += watermark.height + gutterHeight;
    }

    tiling.$containerEl.css({
      height: tiling.width,
      width: tiling.height
    });

    tiling.$limiterEl.css({
      height: tiling.limiterHeight,
      width: tiling.limiterWidth,
      top: centeringHeight,
      left: centeringWidth
    });

    delete tiling.uncreated;
  }

  function publicInterface() {
    my = $.extend(my, {

      setImage: function(pictureData) {
        image = savePicture(image, pictureData);
        image.$element = $('<img class="watermark-image" src="' + image.path + '">');

        normalizeSize(root, image);
        centerImage();

        tiling.uncreated = true;

        if (watermark.$element) {
          my.setWatermark({
            path: watermark.path,
            width: watermark.originalWidth,
            height: watermark.originalHeight
          });
        }

        containers.$image.append(image.$element);
      },

      setWatermark: function(pictureData) {
        watermark = savePicture(watermark, pictureData);
        watermark.$element = $('<img class="watermark draggable ui-widget-content" src="' + watermark.path + '">');

        scaleWatermark();
        countSectorSize();
        countLimit();
        my.setOpacity();

        containers.$watermark.append(watermark.$element);

        my.moveBySector(0, 0);
        my.getLimit(limit);
        my.getPosition(positionSingle);
      },

      setOpacity: function(value) {
        if (value) {
          watermark.opacity = value;
        }

        if (mode === SINGLE_MODE) {
          containers.$watermark.css('opacity', watermark.opacity);
        } else {
          tiling.$containerEl.css('opacity', watermark.opacity)
        }
      },

      move: function(position) {

        if (mode === TILING_MODE) {

          if (position[0] !== null) {
            positionTiling[1][0] = position[0];
          }

          if (position[1] !== null) {
            positionTiling[1][1] = position[1];
          }
        } else {

          if (position[0] !== null) {
            positionSingle[0] = limitPosition(position[0], true);
            containers.$watermark.css('left', positionSingle[0]);
          }

          if (position[1] !== null) {
            positionSingle[1] = limitPosition(position[1]);
            containers.$watermark.css('top', positionSingle[1]);
          }

          my.getPosition(positionSingle);
        }
      },

      moveBySector: function(stepX, stepY) {
        var sectorName = stepX + '.' + stepY;

        if (!sectorCache[sectorName]) {
          sectorCache[sectorName] = [];
          sectorCache[sectorName][0] = sector.centerWidth + sector.width * stepX;
          sectorCache[sectorName][1] = sector.centerHeight + sector.height * stepY;
        }

        my.move([sectorCache[sectorName][0], sectorCache[sectorName][1]]);
      },

      getLimit: function(limit) {},

      getPosition: function(position) {},
    });
  }

  window.easel = my;
})(window, jQuery);
