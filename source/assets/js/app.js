(function(window, $) {
  'use strict';

  var my = {},
      $spinnerX = null,
      $spinnerY = null;

  init();
  attachEvents();

  function init() {
    initSpinners();

    range.change = easel.setOpacity;
    sector.triger = easel.moveBySector;
    fileupload.uploaded = uploaded;
    easel.getLimit = applyLimit;
    easel.getPosition = applyPosition;

    //==========================================
    // For test.
    demo.apply();
    //==========================================
  }

  function attachEvents() {

    $('.js-reset').on('click', easel.reset);
    $('.js-download').on('click', download);
    $('.js-switch-mode').on('click', 'a', switchMode);
  }

  function uploaded(inputType, response) {

    if (inputType === 'image') {
      easel.setImage(response);
    } else {
      easel.setWatermark(response);
    }

    easel.moveBySector(0, 0);
    sector.setActive(0, 0)
  }


  function initSpinners() {
    var optionsH = {
      min: 0,

      create: function(event, ui) {
        $(this).on('keyup', function() {
          var value = $spinnerX.spinner('value');

          $spinnerX.spinner('value', value);
          easel.move({left: value});
        });
      },

      spin: function(event, ui) {
        easel.move({left: ui.value});
      }
    };

    var optionsV = {
      min:0,

      create: function(event, ui) {
        $(this).on('keyup', function() {
          var value = $spinnerY.spinner('value');

          $spinnerY.spinner('value', value);
          easel.move({top: value});
        });
      },

      spin: function(event, ui) {
        easel.move({top: ui.value});
      }
    };

    $spinnerX = $('.js-spinner-x').spinner(optionsH);
    $spinnerY = $('.js-spinner-y').spinner(optionsV);
  }

  function switchMode(e) {
    var $this = $(this),
        mode = $this.data('mode');

    easel.switchMode(mode);

    $this
      .siblings()
      .removeClass('active')
      .end()
      .addClass('active')

    e.preventDefault();
  }

  function applyLimit(limit) {
    $spinnerX.spinner('option', 'max', limit[0]);
    $spinnerY.spinner('option', 'max', limit[1]);
  }

  function applyPosition(position) {
    $spinnerX.spinner('value', position.left);
    $spinnerY.spinner('value', position.top);
  }

  function download() {
    var JSONSettings = JSON.stringify(easel.getSettings());

    $.ajax({
      url: '/',
      type: 'POST',
      data: JSONSettings
    });
  }

})(window, jQuery);
