const electron = require('electron');

const {ipcRenderer: ipc, shell, remote} = electron;

const {AppEventConstants} = require('./appEventConstants');
const {ValueConstants} = require('./valueConstants');
const {EffectTypesConstants} = require('./effectTypesConstants');
const video = require('./video');
const countdown = require('./countdown');
const flash = require('./flash');
const effects = require('./effects');

const images = remote.require('./images');

let canvasTarget;
let seriously;
let videoSrc;

function formatImgTag(doc, bytes) {
    const div = doc.createElement('div');
    div.classList.add(ValueConstants.CLASSES.PHOTO.CLASS_NAME);
    const close = doc.createElement('div');
    close.classList.add(ValueConstants.CLASSES.PHOTO_CLOSE.CLASS_NAME);
    const img = new Image();
    img.classList.add(ValueConstants.CLASSES.PHOTO_IMG.CLASS_NAME);
    img.src = bytes;
    div.appendChild(img);
    div.appendChild(close);
    return div;
}

function disableRecordBtn(doc) {
    setRecordBtnDisabledState(doc, true);
}

function enableRecordBtn(doc) {
    setRecordBtnDisabledState(doc, false);
}

function setRecordBtnDisabledState(doc, disable) {
    const btn = doc.getElementById(ValueConstants.IDS.RECORD.ID);

    if (disable) {
        btn.setAttribute('disabled', 'disabled');
    } else {
        btn.removeAttribute('disabled');
    }
}

window.addEventListener(AppEventConstants.DOM_CONTENT_LOADED, _ => {
    const videoEl = document.getElementById(ValueConstants.IDS.VIDEO.ID);
    const canvasEl = document.getElementById(ValueConstants.IDS.CANVAS.ID);
    const recordEl = document.getElementById(ValueConstants.IDS.RECORD.ID);
    const photosEl = document.querySelector(ValueConstants.CLASSES.PHOTOS_CONTAINER.DOT_CLASS_NAME);
    const counterEl = document.getElementById(ValueConstants.IDS.COUNTER.ID);
    const flashEl = document.getElementById(ValueConstants.IDS.FLASH.ID);

    seriously = new Seriously();
    videoSrc = seriously.source(ValueConstants.IDS.VIDEO.HASH_ID);
    canvasTarget = seriously.target(ValueConstants.IDS.CANVAS.HASH_ID);
    effects.choose(seriously, videoSrc, canvasTarget);

    video.init(navigator, videoEl);

    recordEl.addEventListener(AppEventConstants.CLICK, _ => {
        disableRecordBtn(document);

        countdown.start(counterEl, ValueConstants.COUNTDOWN_FROM, _ => {
            flash(flashEl);
            const bytes = video.captureBytesFromLiveCanvas(canvasEl);
            ipc.send(AppEventConstants.IMAGE_CAPTURED, bytes);
            photosEl.appendChild(formatImgTag(document, bytes));
            enableRecordBtn(document);
        });
    });

    photosEl.addEventListener(AppEventConstants.CLICK, evt => {
        const isRm = evt.target.classList.contains(ValueConstants.CLASSES.PHOTO_CLOSE.CLASS_NAME);
        const selector = isRm ? ValueConstants.CLASSES.PHOTO_CLOSE.DOT_CLASS_NAME : ValueConstants.CLASSES.PHOTO_IMG.DOT_CLASS_NAME;

        const photos = Array.from(document.querySelectorAll(selector));
        const index = photos.findIndex(el => el == evt.target);

        if (index >= 0) {
            if (isRm) {
                ipc.send(AppEventConstants.IMAGE_REMOVE, index);
            } else {
                shell.showItemInFolder(images.getFromCache(index));
            }
        }
    });
});

ipc.on(AppEventConstants.IMAGE_REMOVED, (evt, index) => {
    const photosArray = Array.from(document.querySelectorAll(ValueConstants.CLASSES.PHOTO.DOT_CLASS_NAME));
    document.getElementById(ValueConstants.IDS.PHOTOS.ID).removeChild(photosArray[index]);
});

ipc.on(AppEventConstants.EFFECT_CHOOSE, (evt, effectName) => {
    effects.choose(seriously, videoSrc, canvasTarget, effectName);
});

ipc.on(AppEventConstants.EFFECT_CYCLE, evt => {
    effects.cycle(seriously, videoSrc, canvasTarget);
});
