const electron = require('electron');

const {ipcRenderer: ipc, shell, remote} = electron;

const {AppEventConstants} = require('./appEventConstants');
const {ValueConstants} = require('./valueConstants');
const video = require('./video');
const countdown = require('./countdown');

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

window.addEventListener(AppEventConstants.DOM_CONTENT_LOADED, _ => {
    const videoEl = document.getElementById(ValueConstants.IDS.VIDEO);
    const canvasEl = document.getElementById(ValueConstants.IDS.CANVAS);
    const recordEl = document.getElementById(ValueConstants.IDS.RECORD);
    const photosEl = document.querySelector(ValueConstants.CLASSES.PHOTOS_CONTAINER.DOT_CLASS_NAME);
    const counterEl = document.getElementById(ValueConstants.IDS.COUNTER);

    const ctx = canvasEl.getContext(ValueConstants.CANVAS_CONTEXT);

    video.init(navigator, videoEl);

    recordEl.addEventListener(AppEventConstants.CLICK, _ => {
        countdown.start(counterEl, COUNTDOWN_FROM, _ => {
            const bytes = video.captureBytes(videoEl, ctx, canvasEl);
            ipc.send(AppEventConstants.IMAGE_CAPTURED, bytes);
            photosEl.appendChild(formatImgTag(document, bytes));
        });
    });

    photosEl.addEventListener(AppEventConstants.CLICK, evt => {
        const photos = Array.from(document.querySelectorAll(ValueConstants.CLASSES.PHOTO_IMG.DOT_CLASS_NAME));
        const index = photos.findIndex(el => el == evt.target);

        shell.showItemInFolder(images.getFromCache(index));
    });
});
