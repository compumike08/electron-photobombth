const {ValueConstants} = require('./valueConstants');

let timer;

module.exports = el => {
    if (el.classList.contains(ValueConstants.CLASSES.IS_FLASHING.CLASS_NAME)) {
        el.classList.remove(ValueConstants.CLASSES.IS_FLASHING.CLASS_NAME);
    }

    clearTimeout(timer);
    el.classList.add(ValueConstants.CLASSES.IS_FLASHING.CLASS_NAME);
    timer = setTimeout(_ => el.classList.remove(ValueConstants.CLASSES.IS_FLASHING.CLASS_NAME), ValueConstants.FLASH_DURATION);
}
