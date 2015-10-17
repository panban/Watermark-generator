(function(window, $) {
  'use strict';

  var my = {},
      root = {},
      image = {},
      tiling = {},
      sector = {},
      sectorCache = {},
      watermark = {},
      limit = [0, 0],
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

  function countLimit() {
    limit[0] = image.width - watermark.width;
    limit[1] = image.height - watermark.height;
  }

  function createTiling() {
    var i, j;
    var $clone = null,
        countH = Math.round(image.width / watermark.width),
        countV = Math.round(image.height / watermark.height),
        tempWidth = 0,
        tempHeight = 0;

    tiling.$element = $('<div class="watermark-tiling"></div>');
    tiling.$watermarks = [];

    //============================================
    // Test.
    var gutterH = 20;
    var gutterV = 20;
    //============================================

    for (i = 0; i < countV; i++) {

      for (j = 0; j < countH; j++) {

        tiling.$watermarks.push($clone = watermark.$element.clone());
        $clone.css({
          left: tempWidth,
          top: tempHeight
        });

        tiling.$element.append($clone);
        tempWidth += watermark.width + gutterV;
      }

      tempWidth = 0;
      tempHeight += watermark.height + gutterH;
    }

    image.$element.append(tiling.$element);
  }

  function publicInterface() {
    my = $.extend(my, {

      setImage: function(pictureData) {
        image = savePicture(image, pictureData);
        image.$element = $([
            '<div class="watermark-container">',
              '<img class="watermark-image" src="' + image.path + '">',
            '</div>'
          ].join(''));

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
        watermark.$element = $('<img class="watermark draggable ui-widget-content" src="' + watermark.path + '">');

        scaleWatermark();
        countSectorSize();
        countLimit();

        image.$element.append(watermark.$element);

        my.moveBySector(0, 0);

        my.getLimit(limit);
        my.getPosition(positionSingle);


        // =========================================================
        // Test
        createTiling();
        // =========================================================
      },

      setOpacity: function(value) {
        watermark.opacity = value;
        watermark.$element.css('opacity', value);
      },

      move: function(position) {

        if (position[0] !== null) {
          positionSingle[0] = limitPosition(position[0], true);
          watermark.$element.css('left', positionSingle[0]);
        }

        if (position[1] !== null) {
          positionSingle[1] = limitPosition(position[1]);
          watermark.$element.css('top', positionSingle[1]);
        }

        my.getPosition(positionSingle);
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
