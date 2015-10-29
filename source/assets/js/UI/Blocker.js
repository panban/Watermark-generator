(function ($) {
    $.widget('loftschool.BlockerUI', {
        defaultOptions: {
            message: 'ждите...'
        },
        _create: function () {
            this.options = $.extend({}, this.defaultOptions, this.options);

            this.element.block({
                message: this.options.message,
                css: {
                    border: 'none',
                    padding: '15px',
                    backgroundColor: '#000',
                    '-webkit-border-radius': '10px',
                    '-moz-border-radius': '10px',
                    '-ms-border-radius': '10px',
                    '-o-border-radius': '10px',
                    opacity: .5,
                    color: '#fff'
                }
            });
        },
        _setOption: function (key, value) {
            throw new Error('not allowed');
        },
        _destroy: function () {
            this.element.unblock();
        }
    });
})(jQuery);