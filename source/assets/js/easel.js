(function(window, $) {
  'use strict';

  var my = {},
      root = {},
      image = {},
      watermark = {},
      tiling = {
        size: [],
        count: [],
        coords: [0, 0],
        gutter: [20, 20]
      },
      opacity = 1,
      containers = {},
      sectorCache = {},
      context = null,
      limitFn = null,
      mode = '',
      SINGLE_MODE = 'SINGLE_MODE',
      TILING_MODE = 'TILING_MODE';

  publicInterface();
  init();
  attachEvets();

  function init() {
    mode = SINGLE_MODE;
    root.$element = $('.workspace_board');
    root.size = [root.$element.width(), root.$element.height()];

    containers.$image = root.$element.find('.image-container');
    containers.$watermark = root.$element.find('.watermark-container');
  }

  function attachEvets() {
    var options = {
      scroll: false,
      drag: onDrag
    };

    $('.watermark-container').draggable(options);
  }

  function onDrag(e, ui) {
    setCoords([ui.position.left, ui.position.top]);

    ui.position.left = context.coords[0];
    ui.position.top = context.coords[1];

    if (mode === SINGLE_MODE) {
      my.getCoords([context.coords[0], context.coords[1]]);
    }
  }

  function normalizeSize(outer, inner) {
    var outerRatio = 0;
    var innerRatio = 0;

    if (inner.size[0] > outer.size[0] || inner.size[1] > outer.size[1]) {

      outerRatio = outer.size[0] / outer.size[1];
      innerRatio = inner.size[0] / inner.size[1];

      if (outerRatio < innerRatio) {
        inner.size[0] = outer.size[0];
        inner.size[1] = Math.round(outer.size[0] / innerRatio);
      } else {
        inner.size[0] = Math.round(outer.size[1] * innerRatio);
        inner.size[1] = outer.size[1];
      }
    }

    inner.scale = inner.originalSize[0] / inner.size[0];

    inner.$element.css({
      'width': inner.size[0],
      'height': inner.size[1]
    });
  }

  function scaleWatermark() {

    if (image.scale !== 1) {
      watermark.size[0] = Math.round(watermark.size[0] / image.scale);
      watermark.size[1] = Math.round(watermark.size[1] / image.scale);
    }

    normalizeSize(image, watermark);
  }

  function setCoords(coords) {
    var axis;

    each(coords, function(i, position) {
      context.coords[i] = limitFn(position, context.limit[i]);
    });
  }

  function countLimit() {
    var widthLimit = image.size[0] - watermark.size[0];
    var heightLimit = image.size[1] - watermark.size[1];

    watermark.limit = [widthLimit, heightLimit];
  }

  function centerImage() {
    var centeringWidth = (root.size[0] - image.size[0]) / 2;
    var centeringHeight = (root.size[1] - image.size[1]) / 2;

    containers.$image.css('left', centeringWidth);
    containers.$image.css('top', centeringHeight);
  }

  function savePicture(picture, data) {
    if (picture.$element) {
      picture.$element.remove();
    }

    picture = $.extend({}, data);
    picture.originalSize = [picture.width, picture.height];
    picture.size = [picture.width, picture.height];
    picture.coords = [];

    return picture;
  }

  function createTiling() {
    var watermarkTpl= '',
        tilingTpl = '',
        i, l;

    watermarkTpl = [
      '<img src="' + watermark.path + '" ',
            'width="' + watermark.size[0] + '" ',
            'height="' + watermark.size[1] + '" ',
            'style="margin-right: ' + tiling.gutter[0] + 'px;',
                   'margin-bottom: ' + tiling.gutter[1] + 'px;"',
                   'float: left;>'
    ].join('');


    tiling.count[0] = Math.round(image.size[0] / watermark.size[0]);
    tiling.count[1] = Math.round(image.size[1] / watermark.size[1]);

    tiling.size[0] = tiling.count[0] * (watermark.size[0] + tiling.gutter[0]) + tiling.gutter[0];
    tiling.size[1] = tiling.count[1] * (watermark.size[1] + tiling.gutter[1]) + tiling.gutter[1];
    tiling.limit = [image.size[0] - tiling.size[0], image.size[1] - tiling.size[1]];


    for (i = 0, l = tiling.count[1] * tiling.count[0]; i < l; i++) {
      tilingTpl += watermarkTpl;
    }

    containers.$watermark.css({
      width: tiling.size[0] ,
      height: tiling.size[1],
      paddingTop: tiling.gutter[1],
      paddingLeft: tiling.gutter[0]
    });

    containers.$watermark[0].innerHTML = tilingTpl;
    tiling.items = containers.$watermark.children();
  }

  function singleLimit(value, limit) {
    if (value > limit) {
      value = limit;
    } else if (value < 0) {
      value = 0;
    }

    return value;
  }

  function tilingLimit(value, limit) {
    if (value < limit) {
      value = limit;
    } else if (value > 0) {
      value = 0;
    }

    return value;
  }

  function toggleContext() {
    var resolve = (mode === SINGLE_MODE);

    context = resolve ? watermark : tiling;
    limitFn = resolve ? singleLimit : tilingLimit;
  }

  function each(coords, fn) {
    var i, l;

    for (i = 0, l = coords.length; i < l; i++) {

      if (coords[i] == null) {
        continue;
      }

      fn(i, coords[i]);
    }
  }

  function publicInterface() {
    my = $.extend(my, {

      setImage: function(pictureData) {
        image = savePicture(image, pictureData);
        image.$element = $('<img class="watermark-image" src="' + image.path + '">');

        normalizeSize(root, image);
        centerImage();

        if (watermark.$element) {
          my.setWatermark({
            path: watermark.path,
            width: watermark.originalSize[0],
            height: watermark.originalSize[1]
          });
        }

        containers.$image.append(image.$element);
      },

      setWatermark: function(pictureData) {
        watermark = savePicture(watermark, pictureData);
        watermark.$element = $('<img src="' + watermark.path + '">');
        sectorCache = {};

        scaleWatermark();
        countLimit();

        containers.$watermark.append(watermark.$element);

        toggleContext()

        my.setOpacity(opacity);
        my.getLimit(watermark.limit);
        my.getCoords(watermark.coords);
      },

      setOpacity: function(value) {
        containers.$watermark.css('opacity', value);
        opacity = value;
      },

      move: function(coords) {
        var duration = ['left', 'top'];

        setCoords(coords);

        each(coords, function(i) {
          containers.$watermark.css(duration[i], context.coords[i]);
        });

        my.getCoords(context.coords);
      },

      setGutter: function(gutters) {
        var props =  {
          duration: ['left', 'top'],
          margin: ['marginRight', 'marginBottom'],
          size: ['width', 'height'],
          padding: ['paddingLeft', 'paddingTop']
        }

        each(gutters, function(i, gutter) {
          var edge = parseInt(containers.$watermark.css(props.duration[i]));
          var add;

          if (edge < 0) {
            add = edge + (tiling.count[i] + 1) * (tiling.gutter[i] - gutter);
            containers.$watermark.css(props.duration[i], add);
          }

          tiling.gutter[i] = gutter;
          tiling.size[i] = tiling.count[i] * (watermark.size[i] + tiling.gutter[i]) + tiling.gutter[i];

          containers.$watermark.css(props.size[i], tiling.size[i]);
          containers.$watermark.css(props.padding[i], tiling.gutter[i]);
          tiling.items.css(props.margin[i], tiling.gutter[i]);
        });

        tiling.limit = [image.size[0] - tiling.size[0], image.size[1] - tiling.size[1]];
        my.getCoords(tiling.gutter);
      },

      moveBySector: function(position) {
        var name = position.join('');

        if (!sectorCache[name]) {
          sectorCache[name] = [];
          sectorCache[name][0] = (image.size[0] - watermark.size[0]) / 2 * position[0];
          sectorCache[name][1] = (image.size[1] - watermark.size[1]) / 2 * position[1];
        }

        my.move([sectorCache[name][0], sectorCache[name][1]]);
      },

      getSettings: function() {
        var position = [[]],
            settings = {};

        if (mode === SINGLE_MODE) {
          position[0] = watermark.coords;
        } else {
          position.push(tiling.gutter);
        }

        settings = {
          imagePath: image.path,
          watermarkPath: watermark.path,
          watermarkScale: watermark.scale,
          opacity: opacity,
          position: position
        };

        return settings;
      },

      reset: function() {
        if (mode === SINGLE_MODE) {
          my.move([0, 0]);
        } else {
          my.setGutter([20, 20])
        }

        my.setOpacity(1);
      },

      toggleMode: function(newMode) {
        if (mode === newMode) {
          return;
        }

        mode = newMode;
        toggleContext();

        var coords = (mode === SINGLE_MODE)
          ? watermark.coords
          : tiling.gutter;

        var limit = (mode === SINGLE_MODE)
          ? watermark.limit
          : [100, 100];

        if (mode === SINGLE_MODE) {
          containers.$watermark.html(watermark.$element).css({
            padding: 0,
            width: watermark.size[0],
            height: watermark.size[1]
          });
        } else {
          createTiling();
        }

        my.move(context.coords);
        my.getLimit(limit);
        my.getCoords(coords);
      },

      // callbacks
      getLimit: function(limit) {},

      getCoords: function(coords) {}
    });
  }

  window.easel = my;
})(window, jQuery);
