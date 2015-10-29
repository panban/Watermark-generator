var Imager = function () {
};

Imager.loadImage = function (image) {
    return new P.Promise(function (resolve, reject) {
        var img = new Image();

        img.onload = function () {
            resolve(this);
        };
        img.onerror = function () {
            reject(this);
        };

        img.src = image;
    });
};

Imager.putInBox = function (box, image) {
    var boxRatio = box.width / box.height,
        imgRatio = image.width / image.height,
        newSizes = {
            width: 0,
            height: 0
        };

    if (image.width > box.width || image.height > box.height) {
        if (boxRatio > imgRatio) {
            newSizes.height = box.height;
            newSizes.width = image.width * (newSizes.height / image.height);
        } else {
            newSizes.width = box.width;
            newSizes.height = image.height * (newSizes.width / image.width);
        }
    } else {
        newSizes = image;
    }

    newSizes.top = (box.height - newSizes.height) / 2;
    newSizes.left = (box.width - newSizes.width) / 2;

    return newSizes;
};

Imager.checkConstrain = function (box, imagePosition, imageSizes, topAllow, leftAllow) {
    var newPosition = {
        top: imagePosition.top,
        left: imagePosition.left
    };

    topAllow = topAllow || 0;
    leftAllow = leftAllow || 0;

    if (imagePosition.top < topAllow) {
        newPosition.top = topAllow;
    }

    if (imagePosition.left < leftAllow) {
        newPosition.left = leftAllow;
    }

    if (imagePosition.top > box.height - imageSizes.height) {
        newPosition.top = box.height - imageSizes.height;
    }

    if (imagePosition.left > box.width - imageSizes.width) {
        newPosition.left = box.width - imageSizes.width;
    }

    return newPosition;
};

module.exports = Imager;