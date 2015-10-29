(function ($) {
    $.widget('loftschool.SpinnerUI', $.ui.spinner, {
        _create: function () {
            var that = this;

            this._super();

            this.element.on('keyup', function (e) {
                var val = that.value();

                if (e.keyCode !== $.ui.keyCode.UP && e.keyCode !== $.ui.keyCode.DOWN && that.isValid(val)) {
                    that._trigger('spin', e, {value: val});
                }
            });
        },
        _destroy: function () {
            this._super();

            this.element.off('keyup');
        }
    });
})(jQuery);