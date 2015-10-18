(function(window, $) {
  'use strict';

  var my = {},
      root = {},
      image = {},
      tiling = {
        uncreated: true,
        gutterLeft: 20,
        gutterTop: 20,
        left: 0,
        top: 0
      },
      opacity = 1,
      sector = {},
      containers = {},
      sectorCache = {},
      watermark = {},
      limit = [0, 0],
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

    $('.js-switch-mode').on('click', 'a', function(e) {
      var mode = $(this).data('mode');

      if (mode === 'single') {
        onSingleMode();
      } else {
        onTilingMode();
      }

      e.preventDefault();
    });

    $('.watermark-container').draggable({
      containment: '.image-container',
      scroll: false,
      drag: function (e, ui) {
        my.move({
          left: ui.position.left,
          top: ui.position.top
        });

        my.getPosition({
          left: watermark.left,
          top: watermark.top
        });
      }
    });

    $('.tiling-container').draggable({
      scroll: false,
      drag: onDragTiling
    });
  }

  function onDragTiling(e, ui) {
    var x = ui.position.left,
        y = ui.position.top,
        limitWidth = image.width - tiling.width,
        limitHeight = image.height - tiling.height;

    if(x > tiling.gutterLeft) x = tiling.gutterLeft;
    if(y > tiling.gutterTop)  y = tiling.gutterTop;
    if(x < limitWidth)        x = limitWidth;
    if(y < limitHeight)       y = limitHeight;

    tiling.left = ui.position.left = x;
    tiling.top = ui.position.top = y;
  }

  function onTilingMode() {
    if (tiling.uncreated) {
      createTiling();
    }

    mode = TILING_MODE;
    my.setOpacity();
    containers.$watermark.hide();
    tiling.$containerEl.show();

    my.getLimit([100, 100]),
    my.getPosition({
      left: tiling.gutterLeft,
      top: tiling.gutterTop
    });
  }

  function onSingleMode() {
    if (!tiling.uncreated) {
      tiling.$containerEl.hide();
    }

    mode = SINGLE_MODE;
    my.setOpacity();
    containers.$watermark.show();

    my.getLimit(limit);
    my.getPosition({
      left: watermark.left,
      top: watermark.top
    });
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

  function countLimit(type) {
    limit[0] = image.width - watermark.width;
    limit[1] = image.height - watermark.height;
  }

  function createTiling() {
    var i, l;
    var $clone = null;

    tiling.wms = [];
    tiling.countWidth = Math.round(image.width / watermark.width);
    tiling.countHeight = Math.round(image.height / watermark.height);
    tiling.width = tiling.countWidth * (watermark.width + tiling.gutterLeft);
    tiling.height = tiling.countHeight * (watermark.height + tiling.gutterTop);

    for (i = 0, l = tiling.countHeight * tiling.countWidth; i < l; i++) {

      $clone = watermark.$element.clone();
      $clone.css({
        'float': 'left',
        'margin-right': tiling.gutterLeft,
        'margin-bottom': tiling.gutterTop
      });

      tiling.$containerEl.append($clone);
      tiling.wms.push($clone);
    }

    tiling.$containerEl.css({
      width: tiling.width,
      height: tiling.height
    });

    delete tiling.uncreated;
  }

  function setGutter(position) {
    var i, l;

    if (position.left !== null) {
      tiling.gutterLeft = position.left;
      tiling.width = tiling.countWidth * (watermark.width + tiling.gutterLeft);
      tiling.$containerEl.css('width', tiling.width);
    }

    if (position.top !== null) {
      tiling.gutterTop = position.top;
      tiling.height = tiling.countHeight * (watermark.height + tiling.gutterTop);
      tiling.$containerEl.css('height', tiling.height);
    }

    for (i = 0, l = tiling.wms.length; i < l; i++) {
      tiling.wms[i].css({
        marginRight: tiling.gutterLeft,
        marginBottom: tiling.gutterTop
      });
    }
  }

  function setPosition(position) {

    if (position.left !== null) {
      watermark.left = limitPosition(position.left, true);
      containers.$watermark.css('left', watermark.left);
    }

    if (position.top !== null) {
      watermark.top = limitPosition(position.top);
      containers.$watermark.css('top', watermark.top);
    }
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
        my.getPosition({
          left: watermark.left,
          top: watermark.top
        });
      },

      setOpacity: function(value) {
        if (value) {
          opacity = value;
        }

        if (mode === SINGLE_MODE) {
          containers.$watermark.css('opacity', opacity);
        } else {
          tiling.$containerEl.css('opacity', opacity)
        }
      },

      move: function(position) {

        if (mode === SINGLE_MODE) {
          setPosition(position);
        } else {
          setGutter(position);
        }
      },

      moveBySector: function(stepX, stepY) {
        var sectorName = stepX + '.' + stepY;

        if (!sectorCache[sectorName]) {
          sectorCache[sectorName] = [];
          sectorCache[sectorName][0] = sector.centerWidth + sector.width * stepX;
          sectorCache[sectorName][1] = sector.centerHeight + sector.height * stepY;
        }

        my.move({
          left: sectorCache[sectorName][0],
          top: sectorCache[sectorName][1]
        });
      },

      getSettings: function() {
        var position = [[]],
            settings = {};

        if (mode === SINGLE_MODE) {
          position[0][0] = watermark.left;
          position[0][1] = watermark.top;
        } else {
          position[0][0] = tiling.left;
          position[0][1] = tiling.top;
          position.push([tiling.gutterLeft, tiling.gutterTop]);
        }

        settings = {
          imagePath: image.path,
          watermarkPaht: watermark.path,
          watermarkScale: '',
          opacity: opacity,
          position: position
        };

        return settings;
      },

      getLimit: function(limit) {},

      getPosition: function(position) {},
    });
  }

  window.easel = my;
})(window, jQuery);
