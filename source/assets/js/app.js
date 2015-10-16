$(function() {


  /*==========================================================
    // Init spinners.
  ===========================================================*/
  var spinnerHorizont = $('#spinnerHorizont').spinner({
    min:0,

    create: function(event, ui) {
      $(this).on('keyup', function() {
        var value = spinnerHorizont.spinner('value');

        spinnerHorizont.spinner('value', value);
        easel.move([value, null]);
      });
    },

    spin: function(event, ui) {
      easel.move([ui.value, null]);
    }
  });

  var spinnerVertical = $('#spinnerVertical').spinner({
    min:0,

    create: function(event, ui) {
      $(this).on('keyup', function() {
        var value = spinnerVertical.spinner('value');

        spinnerVertical.spinner('value', value);
        easel.move([null, value]);
      });
    },

    spin: function(event, ui) {
      easel.move([null, ui.value]);
    }
  });



 /*==========================================================
    // Play demo view.
  ===========================================================*/
  demo.apply();



  /*==========================================================
    // Init drag and drop.
  ===========================================================*/
  
   $('.watermark').draggable({
      containment: '.watermark-image',
      scroll: false,
      drag: function (e, param) {
        var x = param.position.left,
            y = param.position.top;

        easel.move([x, y]);
        spinnerHorizont.spinner("value", x);
        spinnerVertical.spinner("value", y);
      }
  });

   /*==========================================================
     // Set callbacks.
   ===========================================================*/

   range.change = easel.setOpacity;
   sector.triger = easel.moveBySector;

   easel.getLimit = function(limit) {
     spinnerHorizont.spinner('option', 'max', limit[0]);
     spinnerVertical.spinner('option', 'max', limit[1]);
   }

   easel.getPosition = function(position) {
     spinnerHorizont.spinner('value', position[0]);
     spinnerVertical.spinner('value', position[1]);
   }


});
