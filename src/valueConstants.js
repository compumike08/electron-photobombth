const ValueConstants = {
    FILE_OR_DIR_NOT_FOUND_ERR_CODE: 'ENOENT',
    IMAGES_PARENT_DIR: 'pictures',
    IMAGES_DIR: 'photobombth',
    CLASSES: {
        PHOTO: {
            CLASS_NAME: 'photo',
            DOT_CLASS_NAME: '.photo'
        },
        PHOTO_CLOSE: {
            CLASS_NAME: 'photoClose',
            DOT_CLASS_NAME: '.photoClose'
        },
        PHOTO_IMG: {
            CLASS_NAME: 'photoImg',
            DOT_CLASS_NAME: '.photoImg'
        },
        PHOTOS_CONTAINER: {
            CLASS_NAME: 'photosContainer',
            DOT_CLASS_NAME: '.photosContainer'
        },
        IS_FLASHING: {
            CLASS_NAME: 'is-flashing',
            DOT_CLASS_NAME: '.is-flashing'
        }
    },
    IDS: {
        VIDEO: 'video',
        CANVAS: 'canvas',
        RECORD: 'record',
        COUNTER: 'counter',
        PHOTOS: 'photos',
        FLASH: 'flash'
    },
    CANVAS_CONTEXT: '2d',
    FLASH_DURATION: 2000
};

exports.ValueConstants = ValueConstants;
