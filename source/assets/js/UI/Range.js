(function ($) {
    $.widget('loftschool.RangeUI', {
        widgetEventPrefix: 'range-',
        defaultOptions: {
            position: 0,
            maxWidth: 0
        },
        _create: function () {
            var that = this;

            this.rangeHandle_ = this.element.find('.range_handle');
            this.rangeProgress_ = this.element.find('.range_progress');

            if (!this.rangeHandle_.size() || !this.rangeProgress_.size()) {
                throw new Error('wrong structure');
            }

            this.options = $.extend({}, this.defaultOptions, this.options, {maxWidth: this.element.parent().width()});

            this.rangeHandle_.draggable({
                axis: 'x',
                containment: [that.rangeHandle_.offset().left, that.rangeHandle_.offset().top, that.rangeHandle_.offset().left + that.options.maxWidth],
                drag: function (event, ui) {
                    that.position(ui.position.left);
                }
            });
        },
        _setOption: function (key, value) {
            throw new Error('not allowed');
        },
        _destroy: function () {
            this.rangeHandle_.draggable('destroy');
            this.rangeHandle_ = this.rangeProgress_ = null;
        },
        value: function (value) {
            if (value === undefined) {
                return this.options.position;
            } else {
                if (value < 0 || value > 100) {
                    throw new Error('wrong value');
                }

                var res = ((this.element.width() - (this.rangeHandle_.width() / 2)) / 100) * value;

                this.rangeHandle_.css('left', res + 'px');
                this.position(res);
            }
        },
        position: function (value) {
            var pos = value + this.rangeHandle_.width() / 2,
                rangePos = (pos / (this.options.maxWidth / 100)) >> 0;

            this.rangeProgress_.width(pos);

            if (this.options.position !== rangePos) {
                this.options.position = rangePos;

                this._trigger('change', null, {position: rangePos});
            }
        }
    });
})(jQuery);