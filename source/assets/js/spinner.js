(function(window, document, $) {
  'use strict';

  var options = {
    min: 0,
    max: 100
  };

  function Spinner(element, o) {
    this.options = $.extend(options, o);
    this.$el = element;
    this.$inputEl = this.$el.find('.spinner_input');
    this.value = 0;

    this.control = this.$el.find('.spinner_control');
    this.control.on('mousedown', onMousedown.bind(this));
    this.control.on('mouseup', onMouseup.bind(this));

    this.setValue();
  }

  function onMousedown(e) {
    var target = e.target;
    var direction = target.getAttribute('data-direction');

    this.changeValue(direction);
    this.timerId = repeat(100, this.setValue.bind(this), this);
  }

  function onMouseup(e) {
    clearInterval(this.timerId);
  }

  function delay(handler, delay) {
    return setTimeout(handler, delay || 0);
  }

  function repeat(ms, handler, context) {
    // TODO: I fucked this shit.

    var ms = ms || 500;
    var timerId;
    handler = handler.bind(context || null);

    clearTimeout(context.timerId); // sometimes it's undefined, why ???????????
    timerId = delay(function() {
      repeat(40, handler)
    }, ms);

    handler();

    return timerId;
  }

  var fn = Spinner.prototype;

  fn.setValue = function() {
    this.$inputEl.attr('value', this.value);
  };

  fn.changeValue = function(direction) {
    switch(direction) {
      case 'up':
        if (this.value < this.options.max) {
          this.value++;
        }
        break;
      case 'down':
        if (this.value > this.options.min) {
          this.value--;
        }
        break;
    }
  };

  window.Spinner = Spinner;
})(window, document, jQuery);

var spinner1 = new Spinner($('.spinner'), {
  min: 0,
  max: 10
});