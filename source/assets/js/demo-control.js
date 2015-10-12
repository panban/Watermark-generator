(function() {
  'use strict';

  var my = {};
  var demoData = {
    '600x600': {
      path: '/demo/cat-wh.jpg',
      width: 600,
      height: 600
    },
    '2000x1000': {
      path: '/demo/cat-w.jpg',
      width: 2000,
      height: 1000
    },
    '638x640': {
      path: '/demo/cat-h.jpeg',
      width: 638,
      height: 640
    },
    '500x331': {
      path: '/demo/cat.png',
      width: 500,
      height: 331
    },
    '256x256': {
      path: '/demo/cat-s.jpg',
      width: 256,
      height: 256
    }
  };
  var buttonImageEl = null,
      buttonWmEl = null,
      selectImageEl = null,
      selectWatermarkEl = null,
      flag = false;

  publicInterface();
  init();
  attachEvent();

  function init() {
    buttonImageEl = $('#demo-button-image');
    buttonWmEl = $('#demo-button-wm');
    selectImageEl = $('#demo-select-image');
    selectWatermarkEl = $('#demo-select-wm');
  }

  function getWatermark() {
    return demoData[selectWatermarkEl.val()];
  }

  function getImage() {
    return demoData[selectImageEl.val()];
  }

  function attachEvent() {
    buttonImageEl.on('click', function() {
      flag = true;
      easel.setImage(getImage());
    });

    buttonWmEl.on('click', function() {
      if (!flag) {
        return;
      }

      easel.setWatermark(getWatermark());
    });
  }

  function publicInterface() {
    my = $.extend(my, {

    });
  }

})();
