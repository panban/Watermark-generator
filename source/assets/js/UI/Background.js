(function ($) {
    var Imager = require('Core/Imager');

    $.widget('loftschool.BackgroundUI', {
        widgetEventPrefix: 'bg-',
        defaultOptions: {
            image: null
        },
        _create: function () {
            this.options = $.extend({}, this.defaultOptions, this.options);

            this.imageContainer_ = this.element.find('.image-container');

            if (!this.imageContainer_.size()) {
                throw new Error('wrong structure');
            }
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
                        var box = {width: that.element.width(), height: that.element.height()},
                            sizes = Imager.putInBox(box, loaded);

                        that.imageContainer_.css({
                            top: sizes.top,
                            left: sizes.left,
                            'background-image': 'url(' + loaded.src + ')',
                            'width': sizes.width + 'px',
                            'height': sizes.height + 'px',
                            'background-size': '100%'
                        });

                        that.options.image = loaded;
                        that._trigger('changed', null, {image: loaded});
                    }, function (errorImage) {
                        that._trigger('fail', null, {image: errorImage});
                    }
                );
            }
        },
        size: function () {
            return {
                width: this.imageContainer_.width(),
                height: this.imageContainer_.height()
            };
        },
        _destroy: function () {
            this.options.image = null;
            this.imageContainer_.removeAttr('style');
            this.imageContainer_ = null;
        }
    });
})(jQuery);