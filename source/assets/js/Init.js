var background = $('.workspace_board'),
    container = $('.container'),
    cross = $('.sector_cross'),
    currentWMImage = null,
    currentBGSizes = {width: 0, height: 0},
    Imager = require('Core/Imager'),
    grid = $('.sector'),
    MODE_SINGLE = 'single',
    MODE_TILING = 'tiling',
    currentMode = MODE_SINGLE,
    spinnerH = $('.js-spinner-x'),
    spinnerV = $('.js-spinner-y'),
    switcher = $('.switcher'),
    transparentRange = $('.range'),
    watermarkContainer = $('.watermark-container');

transparentRange.RangeUI().bind('range-change', function (event, ui) {
    watermarkContainer.css('opacity', (100 - ui.position) / 100);
});

grid.GridUI().bind('grid-select', function (event, coords) {
    var posF = {
            0: function () {
                return 0;
            },
            1: function (val) {
                return val / 2;
            },
            2: function (val) {
                return val;
            }
        },
        x = posF[coords.x](currentBGSizes.width),
        y = posF[coords.y](currentBGSizes.height);

    x -= currentWMImage.width / 2;
    y -= currentWMImage.height / 2;

    x = x < 0 ? 0 : x;
    x = x > currentBGSizes.width - currentWMImage.width ? currentBGSizes.width - currentWMImage.width : x;

    y = y < 0 ? 0 : y;
    y = y > currentBGSizes.height - currentWMImage.height ? currentBGSizes.height - currentWMImage.height : y;

    watermarkContainer.css({top: y + 'px', left: x + 'px'});
});

switcher.SwitcherUI().bind('switcher-select', function (event, ui) {
    if (ui.mode !== currentMode) {
        if (ui.mode === MODE_SINGLE) {
            spinnerH.SpinnerUI('option', 'max', currentBGSizes.width - currentWMImage.width).SpinnerUI('value', 0);
            spinnerV.SpinnerUI('option', 'max', currentBGSizes.height - currentWMImage.height).SpinnerUI('value', 0);

            if (cross.data('loftschool-CrossUI')) {
                cross.CrossUI('destroy');
            }
            grid.GridUI().GridUI('select', 0, 0);
            watermarkContainer.ImageContainerUI('single');
        } else {
            spinnerH.SpinnerUI('option', 'max', currentBGSizes.width).SpinnerUI('value', 0);
            spinnerV.SpinnerUI('option', 'max', currentBGSizes.height).SpinnerUI('value', 0);
            watermarkContainer.css({top: 0, left: 0});

            if (grid.data('loftschool-GridUI')) {
                grid.GridUI('destroy');
            }
            cross.CrossUI({x: 0, y: 0});
            watermarkContainer.ImageContainerUI('fillArea', currentBGSizes.width, currentBGSizes.height);
        }

        currentMode = ui.mode;
    }
});

spinnerH.SpinnerUI({
    min: 0,
    value: 0,
    spin: function (event, ui) {
        if (currentMode === MODE_TILING) {
            cross.CrossUI('option', 'x', ui.value);
            watermarkContainer.ImageContainerUI('marginRight', ui.value);
        } else {
            watermarkContainer.css('left', ui.value + 'px');
        }
    }
}).SpinnerUI('value', 0);

spinnerV.SpinnerUI({
    min: 0,
    value: 0,
    spin: function (event, ui) {
        if (currentMode === MODE_TILING) {
            cross.CrossUI('option', 'y', ui.value);
            watermarkContainer.ImageContainerUI('marginBottom', ui.value);
        } else {
            watermarkContainer.css('top', ui.value + 'px');
        }
    }
}).SpinnerUI('value', 0);

background.BackgroundUI().bind('bg-start', function () {
    container.BlockerUI();
}).bind('bg-changed', function () {
    container.BlockerUI('destroy');
    currentBGSizes = background.BackgroundUI('size');
    if (currentWMImage) {
        if (currentMode = MODE_TILING) {
            watermarkContainer.ImageContainerUI('fillArea', currentBGSizes.width, currentBGSizes.height);
        }
        else {
            watermarkContainer.ImageContainerUI('single');
        }
    }
}).bind('bg-fail', function () {
    container.BlockerUI('destroy');
});

watermarkContainer.ImageContainerUI().bind('container-start', function () {
    container.BlockerUI();
}).bind('container-changed', function (event, data) {
    currentWMImage = data.image;

    container.BlockerUI('destroy');
    if (currentMode === MODE_SINGLE) {
        watermarkContainer.ImageContainerUI('single');
        grid.GridUI('select', 0, 0);

        spinnerH.SpinnerUI('option', 'max', currentBGSizes.width - currentWMImage.width).SpinnerUI('value', 0);
        spinnerV.SpinnerUI('option', 'max', currentBGSizes.height - currentWMImage.height).SpinnerUI('value', 0);
    } else {
        spinnerH.SpinnerUI('option', 'max', currentBGSizes.width).SpinnerUI('value', 0);
        spinnerV.SpinnerUI('option', 'max', currentBGSizes.height).SpinnerUI('value', 0);

        cross.CrossUI({x: 0, y: 0});
        watermarkContainer.ImageContainerUI('fillArea', currentBGSizes.width, currentBGSizes.height);
    }
}).bind('container-fail', function () {
    container.BlockerUI('destroy');
});

watermarkContainer.draggable({
    drag: function (event, ui) {
        var box = {
                width: currentBGSizes.width,
                height: currentBGSizes.height
            },
            imageSizes = {
                width: currentWMImage.width,
                height: currentWMImage.height
            },
            newPosition = {top: 0, left: 0};
        if (currentMode === MODE_SINGLE) {
            newPosition = Imager.checkConstrain(box, ui.position, imageSizes);

            spinnerH.SpinnerUI('value', newPosition.left);
            spinnerV.SpinnerUI('value', newPosition.top);
        } else {
            newPosition = Imager.checkConstrain(box, ui.position, imageSizes,
                -(watermarkContainer.height() - currentWMImage.height),
                -(watermarkContainer.width() - currentWMImage.width));
        }

        ui.position.top = newPosition.top;
        ui.position.left = newPosition.left;
    }
});

var uploadUptions = {
    url: '/php/fileupload.php',
    dataType: 'json',
    type: 'POST',
    done: function (e, context) {
        $(this)
            .closest('.uploader')
            .find('.uploader_field')
            .text(context.files[0].name);
    },
    success: function (response) {
        var inputType = $(this.fileInput).data('upload-type');

        if (inputType === 'image') {
            background.BackgroundUI('image', response.path);
        } else {
            watermarkContainer.ImageContainerUI('image', response.path);
        }
    }
};

$('.uploader_input').fileupload(uploadUptions);
$('.control_button-reset').click(function () {
    if (currentMode === MODE_SINGLE) {
        if (currentWMImage) {
            grid.GridUI('select', 0, 0);
        }
    } else {
        cross.CrossUI({x: 0, y: 0});
        watermarkContainer.css({
            top: 0,
            left: 0
        }).ImageContainerUI('marginBottom', 0).ImageContainerUI('marginRight', 0);
    }

    spinnerH.SpinnerUI('value', 0);
    spinnerV.SpinnerUI('value', 0);

    transparentRange.RangeUI('value', 0);
});