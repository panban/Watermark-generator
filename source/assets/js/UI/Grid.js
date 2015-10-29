(function ($) {
    $.widget('loftschool.GridUI', {
        widgetEventPrefix: 'grid-',
        defaultOptions: {
            x: 0,
            y: 0
        },
        _create: function () {
            var that = this;

            this.options = $.extend({}, this.defaultOptions, this.options);

            this.element.on('click', 'a', function () {
                that.select($(this).data('step-x'), $(this).data('step-y'));

                return false;
            });
        },
        _setOption: function (key, value) {
            throw new Error('not allowed');
        },
        _destroy: function () {
            this.element.off('click');
            this.element.find('.sector--current').removeClass('sector--current');
        },
        select: function (x, y) {
            var target = x instanceof $ || x instanceof HTMLElement ? $(this) : this.element.find('a[data-step-x=' + x + '][data-step-y=' + y + ']');

            if (target.size()) {
                this.options.x = x;
                this.options.y = y;

                this.element.find('.sector--current').removeClass('sector--current');
                target.addClass('sector--current');

                this._trigger('select', null, {x: target.data('step-x'), y: target.data('step-y')});
            }
        }
    });
})(jQuery);