const fs = require('fs');
const path = require('path');

const {ValueConstants} = require('./valueConstants');

const logError = err => err && console.error(err);

let images = [];

exports.save = (picturesPath, contents, done) => {
    const base64Data = contents.replace(/^data:image\/png;base64,/, '');
    const imgPath = path.join(picturesPath, `${new Date().getTime()}.png`);
    fs.writeFile(imgPath, base64Data, { encoding: 'base64' }, err => {
        if (err) {
            return logError(err);
        } else {
            done(null, imgPath);
        }
    });
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

exports.cache = imgPath => {
    images = images.concat([imgPath]);
    return images;
};

exports.getFromCache = index => {
    return images[index];
};

exports.rm = (index, done) => {
    fs.unlink(images[index], err => {
        if (err) {
            return logError(err);
        } else {
            images.splice(index, 1);
            done();
        }
    });
};
