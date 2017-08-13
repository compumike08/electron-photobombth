const electron = require('electron');

const {AppEventConstants} = require('./eventConstants');
const video = require('./video');
const countdown = require('./countdown');

const {ipcRenderer: ipc} = electron;

const COUNTDOWN_FROM = 3;

function formatImgTag(doc, bytes) {
    const div = doc.createElement('div');
    div.classList.add('photo');
    const close = doc.createElement('div');
    close.classList.add('photoClose');
    const img = new Image();
    img.classList.add('photoImg');
    img.src = bytes;
    div.appendChild(img);
    div.appendChild(close);
    return div;
}

window.addEventListener(AppEventConstants.DOM_CONTENT_LOADED, _ => {
    const videoEl = document.getElementById('video');
    const canvasEl = document.getElementById('canvas');
    const recordEl = document.getElementById('record');
    const photosEl = document.querySelector('.photosContainer');
    const counterEl = document.getElementById('counter');

    const ctx = canvasEl.getContext('2d');

    video.init(navigator, videoEl);

    recordEl.addEventListener(AppEventConstants.CLICK, _ => {
        countdown.start(counterEl, COUNTDOWN_FROM, _ => {
            const bytes = video.captureBytes(videoEl, ctx, canvasEl);
            ipc.send(AppEventConstants.IMAGE_CAPTURED, bytes);
            photosEl.appendChild(formatImgTag(document, bytes));
        });
    });
});
