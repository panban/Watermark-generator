(function ($) {
    var Imager = require('Core/Imager');

    $.widget('loftschool.ImageContainerUI', {
        widgetEventPrefix: 'container-',
        defaultOptions: {
            image: null,
            w: 0,
            h: 0,
            marginRight: 0,
            marginBottom: 0
        },
        _create: function () {
            this.options = $.extend({}, this.defaultOptions, this.options);
        },
        _setOption: function (key, value) {
            throw new Error('not allowed')
        },
        image: function (src) {
            if (src === undefined) {
                return this.options.image;
            } else {
                var that = this;

                that._trigger('start', null, {src: src});

                Imager.loadImage(src).then(function (loaded) {
                        that.options.image = loaded;
                        that._trigger('changed', null, {image: loaded});
                    }, function (errorImage) {
                        that._trigger('fail', null, {image: errorImage});
                    }
                );
            }
        },
        marginRight: function (value) {
            if (value === undefined) {
                return this.options.marginRight;
            } else {
                this.options.marginRight = value;
                this._update();
            }
        },
        marginBottom: function (value) {
            if (value === undefined) {
                return this.options.marginBottom;
            } else {
                this.options.marginBottom = value;
                this._update();
            }
        },
        single: function () {
            this.options.marginRight = this.options.marginBottom = 0;
            this.element.width(this.options.image.width);
            this._generate(1);
        },
        fillArea: function (w, h) {
            if (w > 0 && h >= 0) {
                var amountX = Math.round(w / this.options.image.width) + 1,
                    amountY = Math.round(h / this.options.image.height) + 1;

                this._generate(amountX * amountY);
            }
        },
        _generate: function (amount) {
            var elements = new Array((amount + 1) >> 0),
                newSizes = Imager.putInBox({
                    width: this.element.parent().width(),
                    height: this.element.parent().height()
                }, this.options.image);

            this.options.image.width = newSizes.width;
            this.options.image.height = newSizes.height;

            this.element.html(elements.join(this.options.image.outerHTML));
            this._update();
        },
        _update: function () {
            var images = this.element.find('img'),
                amount = Math.sqrt(images.size()) >> 0;

            this.element.width((amount * this.options.image.width) + (amount * this.options.marginRight));
            this.element.find('img').css({
                'margin-right': this.options.marginRight,
                'margin-bottom': this.options.marginBottom
            });
        },
        _destroy: function () {
            this.options.image = null;
            this.element.find('img').remove();
        }
    });
})(jQuery);