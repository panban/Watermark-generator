(function(window, $) {
  'use strict';

  var my = {},
      $spinnerX = null,
      $spinnerY = null,
      upd = {},
      mode,
      SINGLE_MODE = 'SINGLE_MODE',
      TILING_MODE = 'TILING_MODE';

  init();
  attachEvents();

  function init() {
    mode = SINGLE_MODE;

    initSpinners();

    range.change = easel.setOpacity;
    sector.triger = easel.moveBySector;
    fileupload.uploaded = uploaded;
    easel.getLimit = applyLimit;
    easel.getCoords = applyCoords;
    blocker.disable([$('.locked-block')]);

    //==========================================
    // For test.
    // demo.apply();
    //==========================================
  }

  function attachEvents() {

    $('.js-reset').on('click', reset);
    $('.js-download').on('click', download);
    $('.js-switcher').on('click', 'a', toggleMode);
  }

  function uploaded(inputType, response) {
    if (inputType === 'image') {
      upd.image = true;

      easel.setImage(response);
    } else {
      upd.watemark = true;

      easel.setWatermark(response);
    }

    if (mode === SINGLE_MODE) {
      easel.moveBySector([0, 0]);
      sector.setActive([0, 0])
    }

    if (upd.image) {
      blocker.enable($('.locked-block').first());
    }

    if (upd.watemark) {
      blocker.enable($('.locked-block'));
    }
  }

  function reset() {
    easel.reset();
    sector.setActive([0, 0]);
    range.setValue(0);
  }

  function initSpinners() {
    var optionsH = {
      min: 0,

      /*create: function(event, ui) {
        $(this).on('keyup', function() {
          var value = $spinnerX.spinner('value');

          $spinnerX.spinner('value', value);
          easel.move({x: value});
        });
      },*/

      spin: function(event, ui) {
        if (mode === SINGLE_MODE) {
          easel.move([ui.value, null]);
        } else {
          easel.setGutter([ui.value, null])
        }
      }
    };

    var optionsV = {
      min:0,

      /*create: function(event, ui) {
        $(this).on('keyup', function() {
          var value = $spinnerY.spinner('value');

          $spinnerY.spinner('value', value);
          easel.move({y: value});
        });
      },*/

      spin: function(event, ui) {
        if (mode === SINGLE_MODE) {
          easel.move([null, ui.value]);
        } else {
          easel.setGutter([null, ui.value])
        }
      }
    };

    $spinnerX = $('.js-spinner-x').spinner(optionsH);
    $spinnerY = $('.js-spinner-y').spinner(optionsV);
  }

  function toggleMode(e) {
    var $this = $(this),
        modePeer = $this.data('mode');

    mode = (modePeer === 'single') ? SINGLE_MODE : TILING_MODE;

    easel.toggleMode(mode);
    sector.toggleMode(mode);

    $this
      .siblings()
      .removeClass('switcher_item--active')
      .end()
      .addClass('switcher_item--active');

    e.preventDefault();
  }

  function applyLimit(limit) {
    $spinnerX.spinner('option', 'max', limit[0]);
    $spinnerY.spinner('option', 'max', limit[1]);
    sector.setLimit(limit);
  }

  function applyCoords(coords) {
    $spinnerX.spinner('value', coords[0]);
    $spinnerY.spinner('value', coords[1]);

    if (mode === TILING_MODE) {
      sector.setCross(coords);
    }
  }

  function download() {
    var JSONSettings = JSON.stringify(easel.getSettings());

    console.warn('[Data for building]');
    console.dir(easel.getSettings());

    $.ajax({
      url: '/php/download.php',
      type: 'POST',
      data: 'JSONSettings=' + JSONSettings
    });
  }

})(window, jQuery);
