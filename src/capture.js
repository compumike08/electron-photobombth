const electron = require('electron');

const {ipcRenderer: ipc, shell, remote} = electron;

const {AppEventConstants} = require('./appEventConstants');
const {ValueConstants} = require('./valueConstants');
const video = require('./video');
const countdown = require('./countdown');
const flash = require('./flash');

const images = remote.require('./images');

const COUNTDOWN_FROM = 3;

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
    const btn = doc.getElementById(ValueConstants.IDS.RECORD);

    if (disable) {
        btn.setAttribute('disabled', 'disabled');
    } else {
        btn.removeAttribute('disabled');
    }
}

window.addEventListener(AppEventConstants.DOM_CONTENT_LOADED, _ => {
    const videoEl = document.getElementById(ValueConstants.IDS.VIDEO);
    const canvasEl = document.getElementById(ValueConstants.IDS.CANVAS);
    const recordEl = document.getElementById(ValueConstants.IDS.RECORD);
    const photosEl = document.querySelector(ValueConstants.CLASSES.PHOTOS_CONTAINER.DOT_CLASS_NAME);
    const counterEl = document.getElementById(ValueConstants.IDS.COUNTER);
    const flashEl = document.getElementById(ValueConstants.IDS.FLASH);

    const ctx = canvasEl.getContext(ValueConstants.CANVAS_CONTEXT);

    video.init(navigator, videoEl);

    recordEl.addEventListener(AppEventConstants.CLICK, _ => {
        disableRecordBtn(document);

        countdown.start(counterEl, COUNTDOWN_FROM, _ => {
            flash(flashEl);
            const bytes = video.captureBytes(videoEl, ctx, canvasEl);
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
    document.getElementById(ValueConstants.IDS.PHOTOS).removeChild(photosArray[index]);
});
