(function ($) {
    $.widget('loftschool.SwitcherUI', {
        widgetEventPrefix: 'switcher-',
        defaultOptions: {
            mode: ''
        },
        _create: function () {
            var that = this;

            this.options = $.extend({}, this.defaultOptions, this.options);

            this.element.on('click', 'a', function () {
                that.select(this);

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
        select: function (mode) {
            var target = mode instanceof $ || mode instanceof HTMLElement ? $(mode) : this.element.find('a[data-mode=' + mode + ']');

            if (target.size()) {
                this.options.mode = mode;

                this.element.find('.switcher_item--active').removeClass('switcher_item--active');
                target.addClass('switcher_item--active');

                this._trigger('select', null, {mode: target.data('mode')});
            }
        }
    });
})(jQuery);