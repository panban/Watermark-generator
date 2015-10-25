(function() {
  'use strict';

  var my = {},
      upd = {};

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
    '500x331': {
      path: '/demo/cat.png',
      width: 500,
      height: 331
    },
    '256x256': {
      path: '/demo/cat-s.jpg',
      width: 256,
      height: 256
    },
    '1500x1500': {
      path: '/demo/1500x1500.jpg',
      width: 1500,
      height: 1500
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

  function uploaded(type) {
    if (type === 'image') {
      flag = true;
      easel.setImage(getImage());
      upd.image = true;
    } else {
      if (!flag) return;

      easel.setWatermark(getWatermark());
      easel.moveBySector([0, 0]);
      sector.setActive(0, 0);
      upd.watermark = true;
    }

    if (upd.image) {
      blocker.enable($('.locked-block').first());
    }

    if (upd.watermark) {
      blocker.enable($('.locked-block'));
    }
  }

  function attachEvent() {
    buttonImageEl.on('click', uploaded.bind(null, 'image'));
    buttonWmEl.on('click', uploaded.bind(null, 'watermark'));
  }

  function publicInterface() {
    my = $.extend(my, {

      apply: function() {
        easel.setImage(demoData['1500x1500']);
        easel.setWatermark(demoData['256x256']);
        easel.moveBySector([0, 0]);
        sector.setActive(0, 0);
      }
    });
  }

  window.demo = my;
})();
