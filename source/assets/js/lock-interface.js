(function (window, $) {
    'use strict';

    var my = {},
        disableClass = 'disable';

    publicInterface();
    init();


    function init() {
        var inputImg = $('.uploader_input[data-upload-type="image"]'),
            inputWatermark = $('.uploader_input[data-upload-type="watermark"]');

        inputImg.on('change', unlockWatermark);
        inputWatermark.on('change', unlock);
    }

    function disable(selectors) {
        $.each(selectors, function() {
                var fakeDiv = $('<div class="disable-block"></div>'),
                    $this = $(this);

                $this.addClass(disableClass);
                fakeDiv.appendTo($this);
            }
        )
    }

    function enable(selectors) {
        $.each(selectors, function() {
                var $this = $(this);

                $this
                    .removeClass(disableClass)
                    .find('.disable-block')
                    .remove();

            }
        )
    }

    function unlockWatermark() {
        locking.enable([
            $('.locked-block').first()
        ]);

    }

    function unlock() {
        locking.enable([
            $('.locked-block')
        ]);

    }


    function publicInterface() {
        my = $.extend(my, {
            disable: disable,
            enable: enable
        });
    }

    window.locking = my;
})(window, jQuery);


locking.disable([
    $('.locked-block')
]);
