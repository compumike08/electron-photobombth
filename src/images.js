const fs = require('fs');
const path = require('path');

const {ValueConstants} = require('./valueConstants');

const logError = err => err && console.error(err);

exports.save = (picturesPath, contents) => {
    const base64Data = contents.replace(/^data:image\/png;base64,/, '');
    fs.writeFile(path.join(picturesPath, `${new Date().getTime()}.png`), base64Data, { encoding: 'base64' }, logError);
};

exports.getPicturesDir = app => {
    return path.join(app.getPath(ValueConstants.IMAGES_PARENT_DIR), ValueConstants.IMAGES_DIR);
};

exports.mkdir = picturesPath => {
    fs.stat(picturesPath, (err, stats) => {
        if (err && err.code !== ValueConstants.FILE_OR_DIR_NOT_FOUND_ERR_CODE) {
            return logError(err);
        } else if (err || !stats.isDirectory()) {
            fs.mkdir(picturesPath, logError);
        }
    });
};
