$(function() {

  /*==========================================================
    // Set callbacks.
  ===========================================================*/
  range.change = easel.setOpacity;
  sector.triger = easel.moveBySector;



  /*==========================================================
    // Init spinners.
  ===========================================================*/
  var spinnerHorizont = $('#spinnerHorizont').spinner({
    min:0,

    create: function(event, ui) {
      $(this).on('keyup', function() {
        var value = spinnerHorizont.spinner('value');

        spinnerHorizont.spinner('value', value);
        easel.move(value, true);
      });
    },

    spin: function(event, ui) {
      easel.move(ui.value, true);
    }
  });

  var spinnerVertical = $('#spinnerVertical').spinner({
    min:0,

    create: function(event, ui) {
      $(this).on('keyup', function() {
        var value = spinnerVertical.spinner('value');

        spinnerVertical.spinner('value', value);
        easel.move(value);
      });
    },

    spin: function(event, ui) {
      easel.move(ui.value);
    }
  });

  easel.getLimit = function(limit) {
    spinnerHorizont.spinner('option', 'max', limit[0]);
    spinnerVertical.spinner('option', 'max', limit[1]);
  }

  easel.getPosition = function(position) {
    spinnerHorizont.spinner('value', position[0]);
    spinnerVertical.spinner('value', position[1]);
  }

 /*==========================================================
    // Play demo view.
  ===========================================================*/
  demo.apply();

  /*==========================================================
    // Init drag and drop.
  ===========================================================*/
  
   $('.wm').draggable({
      containment: '.wm-image',
      scroll: false,
      drag: function (e, param) {
        var x = param.position.left,
            y = param.position.top;

        easel.move(x, true);
        easel.move(y);
        spinnerHorizont.spinner("value", x);
        spinnerVertical.spinner("value", y);

      }
  });



 
  
});
