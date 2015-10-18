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
        easel.move({left: value});
      });
    },

    spin: function(event, ui) {
      easel.move({left: ui.value});
    }
  });

  var spinnerVertical = $('#spinnerVertical').spinner({
    min:0,

    create: function(event, ui) {
      $(this).on('keyup', function() {
        var value = spinnerVertical.spinner('value');

        spinnerVertical.spinner('value', value);
        easel.move({top: value});
      });
    },

    spin: function(event, ui) {
      easel.move({top: ui.value});
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
     spinnerHorizont.spinner('value', position.left);
     spinnerVertical.spinner('value', position.top);
   }


   /*==========================================================
      // Play demo view.
    ===========================================================*/
    demo.apply();
});
