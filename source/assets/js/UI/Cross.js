(function ($) {
    $.widget('loftschool.CrossUI', {
        defaultOptions: {
            x: 0,
            y: 0
        },
        _create: function () {
            this.lineX_ = this.element.find('.sector_line-x');
            this.lineY_ = this.element.find('.sector_line-y');

            if (!this.lineX_.size() || !this.lineY_.size()) {
                throw new Error('wrong structure');
            }

            this.options = $.extend({}, this.defaultOptions, this.options);
            this._update();
            this.element.show();
        },
        _setOption: function (key, value) {
            if (this.options[key] !== undefined) {
                this.options[key] = value;
                this._update();
            } else {
                throw new Error('[' + key + '] is wrong option')
            }
        },
        _update: function () {
            this.lineX_.width(this.options.x);
            this.lineY_.height(this.options.y);
        },
        _destroy: function () {
            this.lineX_ = null;
            this.lineY_ = null;

            this.element.hide();
        }
    });
})(jQuery);